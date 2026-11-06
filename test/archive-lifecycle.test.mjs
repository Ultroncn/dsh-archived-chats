import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { EventEmitter } from 'node:events';
import { existsSync } from 'node:fs';
import { apply as applyPlugin } from '../lib/index.js';
const apply = applyPlugin;
import { createDeletionTaskStore } from '../lib/deletion-tasks.js';
import { resolvePersistenceCompat } from '../lib/persistence-compat.js';

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

// Real routes and disk-backed plugin stores; only the external Host is stubbed.
async function fixture(t, { modern = false, conversation = false } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'dac-lifecycle-'));
  const previousHome = process.env.DSH_HOME;
  process.env.DSH_HOME = root;
  const disposers = [];
  t.after(async () => {
    for (const dispose of disposers) dispose();
    if (previousHome === undefined) delete process.env.DSH_HOME;
    else process.env.DSH_HOME = previousHome;
    await rm(root, { recursive: true, force: true });
  });
  const data = join(root, 'plugin-data', 'archived-chats');
  const path = join(root, 'sessions', 'chat-a', 'session.jsonl');
  await mkdir(join(root, 'sessions', 'chat-a'), { recursive: true });
  await writeFile(path, 'original');
  const header = modern
    ? { id: 'chat-a', version: 3, createdAt: 10, cwd: root, isSeeded: true, parentSession: 'parent' }
    : { id: 'chat-a', version: 1, createdAt: 10, cwd: root };
  const events = [
    { seq: 0, type: 'session/title', data: { title: 'Greeting from user' } },
    { seq: 1, type: 'user/message', surfaceOp: 'append', data: { role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: 'inherited hello' }] } },
    { seq: 2, type: 'session/title', data: { title: 'Greeting from user (1)' } },
    { seq: 3, type: 'assistant/message', surfaceOp: 'append', data: { message: { role: 'assistant', source: { kind: 'model' }, content: [{ type: 'reasoning', text: 'child reasoning' }, { type: 'text', text: 'child reply' }] } } },
  ];
  if (conversation) {
    events.unshift({ type: 'turn/start', data: { turn: 1 } });
    events.forEach((event, seq) => { event.seq = seq; });
  }
  const persistence = {
    async list() { return await exists(path) ? [header] : []; },
    async inspect() { await access(path); return { meta: header, events }; },
    locate: () => ({ kind: 'jsonl', path }),
  };
  const reads = { opened: 0, closed: 0 };
  const raw = modern ? {
    async list() { return [{ header, revision: 'fork-revision' }]; },
    locate: persistence.locate,
    async open() {
      reads.opened++;
      return { header, inheritedEventCount: 2,
        async read() { return { events }; }, async close() { reads.closed++; } };
    },
  } : persistence;
  const registry = {
    state: { archivedSessionIds: ['chat-a'], workspaceIds: [] },
    get archivedSessionIds() { return this.state.archivedSessionIds; },
    list: () => [],
    async unarchiveSession(id) { await this.setState({ ...this.state, archivedSessionIds: this.state.archivedSessionIds.filter(value => value !== id) }); },
    async setState(next) { this.state = next; },
  };
  const routes = new Map();
  const services = { workspaceRegistry: registry, sessionPersistence: raw,
    sessions: { get: () => undefined },
    webServer: { register({ path, handler }) { routes.set(path, handler); } } };
  let startScheduler;
  let recoveryFinished;
  const mount = () => apply({ get: key => services[key], on() {}, emit: (...args) => services.emit?.(...args), logger: { warn(message) { recoveryFinished?.(message); } },
    effect(fn, label) {
      if (label === 'archived-chats: automatic recycle cleanup') startScheduler = () => disposers.push(fn());
      else fn();
    } });
  mount();
  async function call(route, body) {
    const req = new EventEmitter();
    req.method = body === undefined ? 'GET' : 'POST';
    req.headers = { 'x-dsh-archived-chats': '1' };
    let status; let result;
    const res = { writeHead(code) { status = code; }, end(value) { result = JSON.parse(value); } };
    queueMicrotask(() => { if (body !== undefined) req.emit('data', Buffer.from(JSON.stringify(body))); req.emit('end'); });
    await routes.get('/plugins/dsh-archived-chats' + route)(req, res);
    return { status, body: result };
  }
  const trash = createDeletionTaskStore({ path: join(data, 'deletion-tasks.json') });
  return { root, data, path, registry, persistence: raw, services, reads, call, routes, trash,
    async restart() {
      mount();
      // Retirement does not perform destructive startup work. Retry is explicit.
      const before = await trash.get('chat-a');
      if (before?.state === 'purge-pending') {
        assert.equal((await trash.get('chat-a')).state, 'purge-pending');
        await call('/deletion-tasks/retry', { targets: [{ sessionId: 'chat-a', taskId: before.taskId }] });
      }
    } };
}

async function confirmedDelete(f, route, body) {
  const source = route === '/unarchived/delete' ? 'unarchived' : 'archive';
  const ids = body.sessionIds ?? [body.sessionId];
  const headers = await f.persistence.list().catch(() => []);
  const sessions = ids.map(sessionId => ({ sessionId, createdAt: body.createdAt
    ?? headers.find(header => (header.header ?? header).id === sessionId)?.createdAt ?? 10,
    ...(Object.hasOwn(body, 'workspaceId') ? { workspaceId: body.workspaceId } : {}) }));
  const preview = await f.call('/deletion/preview', { source, sessions });
  // A refused preview must also fail the legacy route's preflight without
  // writing intent. A nonmatching token cannot authorize any physical removal.
  return f.call(route, { ...body, fingerprint: preview.body.plan?.fingerprint ?? 'refused-preview' });
}

const permanentlyDelete = f => confirmedDelete(f, '/delete-all', { sessionIds: ['chat-a'], permanent: true });

test('legacy permanent-delete routes refuse requests without a scope fingerprint', async t => {
  const f = await fixture(t);
  for (const [route, body] of [['/delete', { sessionId: 'chat-a' }], ['/delete-all', { sessionIds: ['chat-a'] }]]) {
    const result = await f.call(route, { ...body, permanent: true });
    assert.equal(result.status, 409);
    assert.equal(result.body.failed[0].reason, 'deletion-confirmation-required');
    assert.equal(await exists(f.path), true);
  }
});

test('state exposes legacy committed deletion recovery without removing session files', async t => {
  const f = await fixture(t);
  await mkdir(f.data, { recursive: true });
  await writeFile(join(f.data, 'pending-deletions.json'), JSON.stringify({ ids: ['chat-a'] }));
  const state = await f.call('/state');
  assert.equal(state.status, 200);
  assert.equal(state.body.retryTargets.length, 1);
  assert.equal(state.body.retryTargets[0].sessionId, 'chat-a');
  assert.equal(state.body.retryTargets[0].taskId, (await f.trash.get('chat-a')).taskId);
  assert.equal(await exists(f.path), true);
});

test('unified deletion requires a current preview and clears the real session directory', async t => {
  const f = await fixture(t);
  const request = { source: 'archive', sessions: [{ sessionId: 'chat-a', createdAt: 10 }] };
  const preview = await f.call('/deletion/preview', request);
  assert.equal(preview.status, 200);
  assert.equal(preview.body.plan.total, 1);
  assert.equal(await exists(f.path), true);
  const invalid = await f.call('/deletion/execute', { ...request, permanent: true, fingerprint: 'stale' });
  assert.equal(invalid.status, 409);
  assert.equal(await exists(f.path), true);
  const deleted = await f.call('/deletion/execute', { ...request, permanent: true, fingerprint: preview.body.plan.fingerprint });
  assert.equal(deleted.status, 200);
  assert.deepEqual(deleted.body.deleted, ['chat-a']);
  assert.equal(await exists(f.path), false);
  const replayed = await f.call('/deletion/execute', { ...request, permanent: true, fingerprint: preview.body.plan.fingerprint });
  assert.equal(replayed.status, 200);
  assert.deepEqual(replayed.body, deleted.body);
});

test('unified deletion rejects stale selection identities and cross-scope roots', async t => {
  const f = await fixture(t);
  const stale = await f.call('/deletion/preview', { source: 'archive', sessions: [{ sessionId: 'chat-a', createdAt: 99 }] });
  assert.equal(stale.status, 409);
  const hidden = await f.call('/deletion/preview', { source: 'unarchived', sessions: [{ sessionId: 'chat-a', createdAt: 10 }] });
  assert.equal(hidden.status, 409);
  const unconfirmed = await f.call('/deletion/execute', { source: 'archive', sessions: [{ sessionId: 'chat-a', createdAt: 10 }] });
  assert.equal(unconfirmed.status, 400);
  assert.equal(await exists(f.path), true);
});

test('a subagent appearing during final directory validation preserves the confirmed parent', async t => {
  const f = await fixture(t);
  const [parent] = await f.persistence.list();
  const child = { ...parent, id: 'late-child', createdAt: 20, parentSession: parent.id, origin: 'subagent' };
  let appeared = false;
  const locate = f.persistence.locate;
  f.persistence.list = async () => appeared ? [parent, child] : [parent];
  f.persistence.locate = (...args) => {
    if (existsSync(join(f.data, 'pending-deletions.json'))) appeared = true;
    return locate(...args);
  };
  const request = { source: 'archive', sessions: [{ sessionId: parent.id, createdAt: parent.createdAt }] };
  const preview = await f.call('/deletion/preview', request);
  const result = await f.call('/deletion/execute', { ...request, permanent: true, fingerprint: preview.body.plan.fingerprint });
  assert.equal(result.status, 409);
  assert.equal(result.body.failed.some(row => row.reason === 'deletion-scope-changed'), true);
  assert.equal(await exists(f.path), true);
});

test('a confirmed child starting during final directory validation preserves its parent', async t => {
  const f = await fixture(t);
  const [parent] = await f.persistence.list();
  const child = { ...parent, id: 'child', createdAt: 20, parentSession: parent.id, origin: 'subagent' };
  const childPath = join(f.root, 'sessions', 'child', 'session.jsonl');
  await mkdir(join(f.root, 'sessions', 'child'), { recursive: true });
  await writeFile(childPath, 'child');
  let running = false;
  f.services.agents = { get: id => id === 'child' && running ? { status: 'running' } : undefined };
  f.persistence.list = async () => [parent, child].filter(header => existsSync(header.id === 'child' ? childPath : f.path));
  f.persistence.locate = header => {
    if (existsSync(join(f.data, 'pending-deletions.json'))) running = true;
    return { kind: 'jsonl', path: header.id === 'child' ? childPath : f.path };
  };
  const request = { source: 'archive', sessions: [{ sessionId: parent.id, createdAt: parent.createdAt }] };
  const preview = await f.call('/deletion/preview', request);
  const result = await f.call('/deletion/execute', { ...request, permanent: true, fingerprint: preview.body.plan.fingerprint });
  assert.equal(result.status, 409);
  assert.equal(result.body.failed.some(row => row.reason === 'session-delete-running'), true);
  assert.equal(await exists(f.path), true);
  assert.equal(await exists(childPath), true);
});

for (const source of ['archive', 'unarchived']) {
  test(`${source} unified deletion removes its confirmed subtree and preserves a fork on disk`, async t => {
    const f = await fixture(t, { conversation: true });
    const [parent] = await f.persistence.list();
    const headers = [parent,
      { ...parent, id: 'child', createdAt: 20, origin: 'subagent', parentSession: parent.id },
      { ...parent, id: 'grandchild', createdAt: 30, origin: 'subagent', parentSession: 'child' },
      { ...parent, id: 'fork', createdAt: 40, isSeeded: true, parentSession: parent.id }];
    const pathFor = id => join(f.root, 'sessions', id, 'session.jsonl');
    for (const header of headers.slice(1)) {
      await mkdir(join(f.root, 'sessions', header.id), { recursive: true });
      await writeFile(pathFor(header.id), header.id);
    }
    f.persistence.list = async () => headers.filter(header => existsSync(pathFor(header.id)));
    f.persistence.locate = header => ({ kind: 'jsonl', path: pathFor(header.id) });
    const inspect = f.persistence.inspect;
    f.persistence.inspect = async id => ({ ...(await inspect(id)), meta: headers.find(header => header.id === id) });
    const workspace = { id: 'workspace', sessionIds: [parent.id, 'fork'],
      async detachSession(id) { this.sessionIds = this.sessionIds.filter(value => value !== id); } };
    f.registry.list = () => [workspace];
    f.registry.archiveSession = async () => {};
    f.registry.state.archivedSessionIds = source === 'archive' ? [parent.id] : ['grandchild'];
    const request = { source, sessions: [{ sessionId: parent.id, createdAt: parent.createdAt }] };
    const preview = await f.call('/deletion/preview', request);
    assert.equal(preview.status, 200, JSON.stringify(preview.body));
    assert.equal(preview.body.plan.total, 3);
    assert.equal(preview.body.plan.subagentCount, 2);
    const result = await f.call('/deletion/execute', { ...request, permanent: true, fingerprint: preview.body.plan.fingerprint });
    assert.equal(result.status, 200, JSON.stringify(result.body));
    assert.deepEqual(result.body.failed, []);
    assert.deepEqual(new Set(result.body.deleted), new Set([parent.id, 'child', 'grandchild']));
    assert.deepEqual((await f.persistence.list()).map(header => header.id), ['fork']);
    assert.deepEqual(workspace.sessionIds, ['fork']);
    assert.deepEqual(f.registry.archivedSessionIds, []);
  });
}

async function archiveInventoryFixture(t, { ungrouped = false } = {}) {
  const f = await fixture(t);
  await mkdir(f.data, { recursive: true });
  const headers = ['visible-chat', 'child-chat', 'pending-chat'].map(id => ({
    id, version: 1, createdAt: 10, cwd: f.root,
    ...(id === 'child-chat' ? { origin: 'subagent' } : {}),
  }));
  f.registry.state.archivedSessionIds = [];
  f.registry.list = () => ungrouped ? [] : [{ id: 'workspace-a', sessionIds: headers.map(row => row.id) }];
  f.registry.archiveSession = async id => { f.registry.state.archivedSessionIds.push(id); };
  f.persistence.list = async () => headers;
  f.persistence.inspect = async id => ({ meta: headers.find(row => row.id === id), events: [{ seq: 0, type: 'turn/start', data: {} }] });
  return f;
}

for (const ungrouped of [false, true]) {
  test(`bulk archive excludes hidden subagents and pending deletions (${ungrouped ? 'ungrouped' : 'workspace'})`, async t => {
    const f = await archiveInventoryFixture(t, { ungrouped });
    await writeFile(join(f.data, 'pending-deletions.json'), JSON.stringify({ ids: ['pending-chat'] }));
    assert.deepEqual((await f.call('/unarchived')).body.sessions.map(row => row.id), ['visible-chat']);
    const preview = await f.call('/workspace-archive/preview', { workspaceId: ungrouped ? '__dac_ungrouped__' : 'workspace-a', includeActive: true });
    assert.equal(preview.status, 200);
    assert.deepEqual(preview.body.sessions.map(row => row.id), ['visible-chat']);
    const applied = await f.call('/workspace-archive/apply', { token: preview.body.token, nonce: preview.body.nonce });
    assert.deepEqual(applied.body.archived, ['visible-chat']);
    assert.deepEqual(f.registry.archivedSessionIds, ['visible-chat']);
  });
}

for (const duringInspection of [false, true]) {
  test(`archive rechecks deletion eligibility ${duringInspection ? 'after inspection' : 'after confirmation'}`, async t => {
    const f = await archiveInventoryFixture(t);
    const preview = await f.call('/workspace-archive/preview', { workspaceId: 'workspace-a', sessionIds: ['visible-chat'] });
    assert.equal(preview.status, 200);
    const block = () => writeFile(join(f.data, 'pending-deletions.json'), JSON.stringify({ ids: ['visible-chat'] }));
    if (duringInspection) {
      const inspect = f.persistence.inspect;
      f.persistence.inspect = async id => { await block(); return inspect(id); };
    } else await block();
    const applied = await f.call('/workspace-archive/apply', { token: preview.body.token, nonce: preview.body.nonce });
    assert.deepEqual(applied.body.archived, []);
    assert.equal(applied.body.skipped[0]?.reason, 'session-ineligible');
    assert.deepEqual(f.registry.archivedSessionIds, []);
  });
}

async function searchInventoryFixture(t) {
  const f = await archiveInventoryFixture(t);
  f.registry.state.archivedSessionIds = ['visible-chat'];
  const inspect = f.persistence.inspect;
  f.persistence.inspect = async id => ({ ...(await inspect(id)), events: [
    { seq: 0, type: 'turn/start', data: {} },
    { seq: 1, type: 'user/message', surfaceOp: 'append', data: { role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: 'needle in conversation' }] } },
  ] });
  return f;
}

for (const [scope, expected] of [[undefined, ['visible-chat']], ['archive', ['visible-chat']], ['unarchived', ['pending-chat']]]) {
  test(`content search respects ${scope ?? 'default'} visibility and marks result scopes`, async t => {
    const f = await searchInventoryFixture(t);
    const result = await f.call('/search', { query: 'needle', sessionIds: ['visible-chat', 'pending-chat', 'child-chat'], ...(scope ? { scope } : {}) });
    assert.equal(result.status, 200);
    assert.deepEqual(result.body.hits.map(hit => hit.sessionId), expected);
    if (scope === 'unarchived') {
      for (const hit of result.body.hits) assert.equal(hit.session.scope, hit.sessionId === 'visible-chat' ? 'archive' : 'unarchived');
    }
    assert.deepEqual(f.registry.archivedSessionIds, ['visible-chat'], 'search never archives a conversation');
  });
}

test('unarchived search refuses pending deletions and cross-state scopes', async t => {
  const f = await searchInventoryFixture(t);
  await writeFile(join(f.data, 'pending-deletions.json'), JSON.stringify({ ids: ['pending-chat'] }));
  const result = await f.call('/search', { query: 'needle', scope: 'unarchived', sessionIds: ['pending-chat', 'child-chat'] });
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.hits, []);
  for (const scope of ['all', 'trash']) assert.equal((await f.call('/search', { query: 'needle', scope })).status, 400);
});

test('unarchived search reuses inventory across candidate visibility checks', async t => {
  const f = await searchInventoryFixture(t);
  f.registry.state.archivedSessionIds = [];
  const list = f.persistence.list;
  let listings = 0;
  f.persistence.list = async () => { listings++; return list(); };
  const result = await f.call('/search', { query: 'needle', scope: 'unarchived', sessionIds: ['visible-chat', 'pending-chat'] });
  assert.equal(result.body.hits.length, 2);
  assert.ok(listings <= 2, `bounded batch inventory reads, got ${listings}`);
});

for (const ungrouped of [false, true]) {
  test(`bulk archive reuses inventory during execution (${ungrouped ? 'ungrouped' : 'workspace'})`, async t => {
    const f = await archiveInventoryFixture(t, { ungrouped });
    const preview = await f.call('/workspace-archive/preview', { workspaceId: ungrouped ? '__dac_ungrouped__' : 'workspace-a', includeActive: true });
    const list = f.persistence.list;
    let listings = 0;
    f.persistence.list = async () => { listings++; return list(); };
    const result = await f.call('/workspace-archive/apply', { token: preview.body.token, nonce: preview.body.nonce });
    assert.deepEqual(result.body.archived, ['visible-chat', 'pending-chat']);
    assert.ok(listings <= 1, `bounded execution inventory reads, got ${listings}`);
  });
}

test('unarchived search and anchored preview read current live events without stale cache hits', async t => {
  const f = await searchInventoryFixture(t);
  let text = 'first needle';
  f.services.sessions.get = id => id === 'pending-chat' ? {
    header: { id, createdAt: 10 },
    snapshotEvents: () => [
      { seq: 0, type: 'turn/start', data: {} },
      { seq: 8, type: 'user/message', surfaceOp: 'append', data: { role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text }] } },
    ],
  } : undefined;
  const search = () => f.call('/search', { query: 'needle', scope: 'unarchived', sessionIds: ['pending-chat'] });
  assert.equal((await search()).body.hits[0]?.matches[0]?.seq, 8);
  text = 'updated needle';
  assert.match((await search()).body.hits[0]?.matches[0]?.excerpt ?? '', /updated needle/);
  const preview = await f.call('/preview', { sessionId: 'pending-chat', scope: 'unarchived', seq: 8 });
  assert.equal(preview.body.anchor?.status, 'found');
  assert.match(JSON.stringify(preview.body.messages), /updated needle/);
});

test('unarchived search drops a hit that becomes archived while its body is read', async t => {
  const f = await searchInventoryFixture(t);
  const inspect = f.persistence.inspect;
  let reads = 0;
  f.persistence.inspect = async id => {
    const result = await inspect(id);
    if (id === 'pending-chat' && ++reads === 2) f.registry.state.archivedSessionIds.push(id);
    return result;
  };
  const result = await f.call('/search', { query: 'needle', scope: 'unarchived', sessionIds: ['pending-chat'] });
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.hits, []);
  assert.equal(result.body.skipped[0]?.reason, 'session-not-visible');
  assert.ok(reads >= 2, 'the candidate body must be read before the simulated state change');
});

for (const mode of ['single', 'all', 'ungrouped']) {
  test(`permanent ${mode} deletion never exposes archived chats in intermediate sidebar frames`, async t => {
    const f = await fixture(t);
    const ids = mode === 'all' ? ['chat-a', 'chat-b'] : ['chat-a'];
    const headers = new Map(ids.map(id => [id, { id, version: 1, createdAt: 10, cwd: f.root }]));
    const pathFor = id => join(f.root, 'sessions', id, 'session.jsonl');
    if (mode === 'all') {
      await mkdir(join(f.root, 'sessions', 'chat-b'));
      await writeFile(pathFor('chat-b'), 'second chat');
    }
    f.persistence.list = async () => [...headers.values()].filter(header => existsSync(pathFor(header.id)));
    f.persistence.locate = header => ({ kind: 'jsonl', path: pathFor(header.id) });
    f.persistence.inspect = async id => ({ meta: headers.get(id), events: [] });
    f.registry.state.archivedSessionIds = [...ids];
    f.registry.headers = new Map(headers);
    f.registry.sessionPaths = new Map(ids.map(id => [id, f.root]));
    const frames = [];
    // Two connected clients retain their own cold session.list baselines.
    // Workspace feed frames do not refresh these summaries in the Host.
    const clients = [new Set(ids), new Set(ids)];
    const sample = phase => frames.push({ phase,
      visible: clients.map(client => [...client].filter(id => !f.registry.archivedSessionIds.includes(id))),
    });
    const workspace = { id: 'ws-a', sessionIds: mode === 'ungrouped' ? [] : [...ids],
      async detachSession(id) { this.sessionIds = this.sessionIds.filter(value => value !== id); sample('workspace'); },
    };
    f.registry.list = () => [workspace];
    f.registry.setState = async next => { f.registry.state = next; sample('archive'); };
    const removals = [];
    f.services.emit = (name, id) => {
      if (name !== 'api-session/removed') return;
      assert.equal(existsSync(pathFor(id)), false, 'only confirmed physical deletion can remove a client summary');
      removals.push(id);
      for (const client of clients) client.delete(id);
      sample('removed');
    };
    const result = mode === 'all'
      ? await confirmedDelete(f, '/delete-all', { sessionIds: ids, permanent: true })
      : await confirmedDelete(f, '/delete', { sessionId: ids[0], permanent: true });
    assert.equal(result.status, 200, JSON.stringify(result.body));
    assert.deepEqual(result.body.deleted, ids);
    assert.ok(frames.every(frame => frame.visible.every(visible => visible.length === 0)), JSON.stringify(frames));
    assert.deepEqual(removals, ids);
    assert.deepEqual(workspace.sessionIds, []);
    assert.deepEqual(f.registry.archivedSessionIds, []);
    assert.equal(f.registry.headers.size, 0);
  });
}

test('failed deletion does not broadcast a removed session or unarchive it', async t => {
  const f = await fixture(t);
  const notifications = [];
  f.services.emit = (...args) => notifications.push(args);
  f.persistence.locate = () => ({ path: join(f.root, 'shared', 'session.jsonl') });
  const result = await permanentlyDelete(f);
  assert.equal(result.status, 409);
  assert.equal(await exists(f.path), true);
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a']);
  assert.deepEqual(notifications, []);
});

test('failed workspace detach keeps archive protection and deletion intent until explicit retry', async t => {
  const f = await fixture(t);
  const [header] = await f.persistence.list();
  f.registry.headers = new Map([['chat-a', header]]);
  let failDetach = true;
  let members = ['chat-a'];
  const workspace = {
    // Like the Host, membership visibility depends on the header index.
    get sessionIds() { return members.filter(id => f.registry.headers.has(id)); },
    async detachSession(id) {
      assert.deepEqual(f.registry.archivedSessionIds, ['chat-a']);
      if (failDetach) throw new Error('simulated workspace write failure');
      members = members.filter(value => value !== id);
    },
  };
  f.registry.list = () => [workspace];
  const notifications = [];
  f.services.emit = (name, id) => {
    assert.equal(existsSync(f.path), false);
    notifications.push([name, id]);
  };
  const result = await permanentlyDelete(f);
  assert.equal(result.body.failed.length, 1);
  assert.equal(await exists(f.path), false);
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a']);
  assert.deepEqual(workspace.sessionIds, ['chat-a']);
  assert.deepEqual(JSON.parse(await readFile(join(f.data, 'pending-deletions.json'), 'utf8')).ids, ['chat-a']);
  assert.equal((await f.trash.get('chat-a'))?.state, 'purge-pending');

  const recovery = await f.call('/state');
  assert.deepEqual(recovery.body.sessions, []);
  assert.deepEqual(recovery.body.retryTargets, result.body.retryTargets);
  assert.deepEqual(recovery.body.retryTargets, [{ sessionId: 'chat-a', taskId: (await f.trash.get('chat-a')).taskId }]);

  failDetach = false;
  await f.restart();
  assert.deepEqual(members, []);
  assert.equal(f.registry.headers.size, 0);
  assert.deepEqual(f.registry.archivedSessionIds, []);
  assert.deepEqual(JSON.parse(await readFile(join(f.data, 'pending-deletions.json'), 'utf8')).ids, []);
  assert.equal(await f.trash.get('chat-a'), null);
  assert.deepEqual(notifications, [
    ['api-session/removed', 'chat-a'], ['api-session/removed', 'chat-a'],
  ]);
});

async function lineagePreviewFixture(t) {
  const f = await fixture(t);
  const [header] = await f.persistence.list();
  const headers = [header,
    { ...header, id: 'related-child', parentSession: 'chat-a', origin: 'subagent' },
    { ...header, id: 'unrelated-chat' }];
  f.persistence.list = async () => headers;
  return { ...f, headers };
}

test('lineage preview reads related subagents without making them unarchived-list candidates', async t => {
  const f = await lineagePreviewFixture(t);
  const result = await f.call('/preview', { sessionId: 'related-child', scope: 'lineage' });
  assert.equal(result.status, 200);
  assert.equal(result.body.session.id, 'related-child');
  assert.ok(result.body.messages.length > 0);
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a']);
  assert.equal((await f.call('/preview', { sessionId: 'unrelated-chat', scope: 'lineage' })).status, 200);
  assert.equal((await f.call('/preview/image', { sessionId: 'unrelated-chat', scope: 'lineage', attachmentId: 'image-0' })).status, 404);
});

for (const hidden of ['pending', 'trash-unavailable', 'removed']) {
  test(`lineage preview refuses a body that becomes ${hidden} during its read`, async t => {
    const f = await lineagePreviewFixture(t);
    await mkdir(f.data, { recursive: true });
    const inspect = f.persistence.inspect;
    let read = false;
    f.persistence.inspect = async id => {
      const result = await inspect(id);
      read = true;
      if (hidden === 'pending') await writeFile(join(f.data, 'pending-deletions.json'), JSON.stringify({ ids: [id] }));
      if (hidden === 'trash-unavailable') await writeFile(join(f.data, 'deletion-tasks.json'), 'invalid json');
      if (hidden === 'removed') f.headers.splice(f.headers.findIndex(header => header.id === id), 1);
      return result;
    };
    const result = await f.call('/preview', { sessionId: 'related-child', scope: 'lineage' });
    assert.ok(read, 'the candidate content was read before eligibility changed');
    assert.equal(result.status, hidden === 'trash-unavailable' ? 503 : 404);
    assert.equal(result.body.messages, undefined);
  });
}

test('lineage preview remains visible when its archived ancestor is unarchived during a read', async t => {
  const f = await lineagePreviewFixture(t);
  const inspect = f.persistence.inspect;
  f.persistence.inspect = async id => {
    const result = await inspect(id);
    f.registry.state.archivedSessionIds = [];
    return result;
  };
  const result = await f.call('/preview', { sessionId: 'related-child', scope: 'lineage' });
  assert.equal(result.status, 200);
  assert.ok(result.body.messages.length > 0);
  assert.deepEqual(f.registry.archivedSessionIds, []);
});

test('lineage includes independent unarchived chats while omitting empty workspaces', async t => {
  const f = await fixture(t);
  f.registry.state.archivedSessionIds = [];
  f.registry.list = () => [{ id: 'empty-workspace', title: 'Empty workspace', path: f.root, sessionIds: [] }];
  const result = await f.call('/lineage');
  assert.equal(result.status, 200);
  assert.equal(result.body.nodeCount, 1);
  assert.deepEqual(result.body.roots.map(node => [node.id, node.status]), [['chat-a', 'active']]);
  assert.deepEqual(result.body.workspaces, []);
  assert.equal(JSON.stringify(result.body).includes(f.root), false);
});



test('unreadable recycle metadata does not hide the official lineage inventory', async t => {
  const f = await fixture(t);
  await mkdir(f.data, { recursive: true });
  await writeFile(join(f.data, 'deletion-tasks.json'), 'invalid json');
  const result = await f.call('/lineage');
  assert.equal(result.status, 200);
  assert.equal(result.body.deletionStatus, 'unavailable');
  assert.equal(result.body.roots[0].id, 'chat-a');
  assert.equal(result.body.roots[0].status, 'archived');
});

test('archived ungrouped chats remain visible in archive and lineage despite matching workspace cwd', async t => {
  const f = await fixture(t);
  f.registry.list = () => [{ id: 'workspace-a', title: 'Workspace A', path: f.root, sessionIds: [] }];

  const archive = await f.call('/state');
  assert.equal(archive.status, 200);
  assert.deepEqual(archive.body.sessions.map(row => [row.id, row.workspaceId, row.workspaceTitle]),
    [['chat-a', null, null]]);

  const lineage = await f.call('/lineage');
  assert.equal(lineage.status, 200);
  assert.equal(lineage.body.roots[0].id, 'chat-a');
  assert.equal(lineage.body.roots[0].status, 'archived');
  assert.deepEqual(lineage.body.roots[0].workspace, { id: null, title: null });
});

test('single unarchive keeps a cwd-less cold chat reachable in Archived', async t => {
  const f = await fixture(t);
  const [header] = await f.persistence.list();
  delete header.cwd;

  const before = await readFile(f.path, 'utf8');
  const result = await f.call('/unarchive', { sessionId: 'chat-a' });

  assert.equal(result.status, 409);
  assert.deepEqual(result.body, {
    error: 'session-main-list-unreachable',
    message: 'session cannot be published in the main chat list',
    reason: 'cwd-missing',
    sessionIds: ['chat-a'],
  });
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a']);
  assert.equal(await readFile(f.path, 'utf8'), before);
});

test('batch unarchive prevalidates every archived header before one state write', async t => {
  const f = await fixture(t);
  const [valid] = await f.persistence.list();
  const blocked = { ...valid, id: 'chat-b' };
  delete blocked.cwd;
  f.registry.state.archivedSessionIds = ['chat-a', 'chat-b'];
  f.persistence.list = async () => [valid, blocked];
  let writes = 0;
  const setState = f.registry.setState.bind(f.registry);
  f.registry.setState = async next => { writes += 1; await setState(next); };

  const result = await f.call('/unarchive-all', { sessionIds: ['chat-a', 'chat-b'] });

  assert.equal(result.status, 409);
  assert.equal(result.body.error, 'session-main-list-unreachable');
  assert.equal(result.body.reason, 'cwd-missing');
  assert.deepEqual(result.body.sessionIds, ['chat-b']);
  assert.equal(writes, 0);
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a', 'chat-b']);
});

test('unarchive fails closed when the persisted header authority is unavailable', async t => {
  const f = await fixture(t);
  f.persistence.list = async () => { throw new Error('inventory offline'); };

  const result = await f.call('/unarchive', { sessionId: 'chat-a' });

  assert.equal(result.status, 503);
  assert.deepEqual(result.body, {
    error: 'session-reachability-unavailable',
    message: 'session reachability cannot be verified',
    reason: 'header-inventory-unavailable',
    sessionIds: ['chat-a'],
  });
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a']);
});

test('unarchive fails closed when its authoritative persisted header is absent', async t => {
  const f = await fixture(t);
  f.persistence.list = async () => [];

  const result = await f.call('/unarchive', { sessionId: 'chat-a' });

  assert.equal(result.status, 503);
  assert.equal(result.body.error, 'session-reachability-unavailable');
  assert.equal(result.body.reason, 'session-header-unavailable');
  assert.deepEqual(result.body.sessionIds, ['chat-a']);
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a']);
});

test('single unarchive cannot clear a legacy pending deletion reservation', async t => {
  const f = await fixture(t);
  const pendingPath = join(f.data, 'pending-deletions.json');
  await mkdir(f.data, { recursive: true });
  await writeFile(pendingPath, `${JSON.stringify({ ids: ['chat-a'] })}\n`);

  const result = await f.call('/unarchive', { sessionId: 'chat-a' });

  assert.equal(result.status, 409);
  assert.equal(result.body.error, 'session-deletion-pending');
  assert.deepEqual(result.body.sessionIds, ['chat-a']);
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a']);
  assert.deepEqual(JSON.parse(await readFile(pendingPath, 'utf8')).ids, ['chat-a']);
});

test('batch unarchive rejects a mixed pending scope before any archive write', async t => {
  const f = await fixture(t);
  const [header] = await f.persistence.list();
  f.registry.state.archivedSessionIds = ['chat-a', 'chat-b'];
  f.persistence.list = async () => [header, { ...header, id: 'chat-b' }];
  await mkdir(f.data, { recursive: true });
  await writeFile(join(f.data, 'pending-deletions.json'), `${JSON.stringify({ ids: ['chat-b'] })}\n`);
  let writes = 0;
  const setState = f.registry.setState.bind(f.registry);
  f.registry.setState = async next => { writes += 1; await setState(next); };

  const result = await f.call('/unarchive-all', { sessionIds: ['chat-a', 'chat-b'] });

  assert.equal(result.status, 409);
  assert.equal(result.body.error, 'session-deletion-pending');
  assert.deepEqual(result.body.sessionIds, ['chat-b']);
  assert.equal(writes, 0);
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a', 'chat-b']);
});

test('a cold archive preview reads only its selected conversation', async t => {
  const f = await fixture(t);
  const originalInspect = f.persistence.inspect;
  const [header] = await f.persistence.list();
  f.persistence.list = async () => [header, { ...header, id: 'unrelated-archive' }];
  f.registry.state.archivedSessionIds.push('unrelated-archive');
  const reads = [];
  f.persistence.inspect = async id => {
    reads.push(id);
    return originalInspect(id);
  };

  const result = await f.call('/preview', { sessionId: 'chat-a' });
  assert.equal(result.status, 200);
  assert.equal(result.body.session.id, 'chat-a');
  assert.ok(result.body.messages.length > 0);
  assert.ok(reads.length > 0);
  assert.deepEqual([...new Set(reads)], ['chat-a']);
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a', 'unrelated-archive']);
});

for (const route of ['/preview', '/preview/image']) {
  test(`a single unarchived ${route} reads only its selected conversation`, async t => {
    const f = await fixture(t);
    const originalInspect = f.persistence.inspect;
    const [header] = await f.persistence.list();
    f.persistence.list = async () => [header, { ...header, id: 'unrelated-unarchived' }];
    f.registry.state.archivedSessionIds = [];
    f.registry.archiveSession = async () => { throw new Error('read-only preview must not archive'); };
    const reads = [];
    f.persistence.inspect = async id => {
      reads.push(id);
      const inspected = await originalInspect(id);
      return { ...inspected, events: [...inspected.events, { seq: 4, type: 'turn/start', data: {} }] };
    };

    const result = await f.call(route, { sessionId: 'chat-a', scope: 'unarchived', attachmentId: 'missing-image' });
    if (route === '/preview') {
      assert.equal(result.status, 200, JSON.stringify(result.body));
      assert.equal(result.body.session.id, 'chat-a');
      assert.ok(result.body.messages.length > 0);
    } else {
      assert.equal(result.status, 404);
      assert.equal(result.body.error, 'preview-image-not-found');
    }
    assert.ok(reads.length > 0);
    assert.deepEqual([...new Set(reads)], ['chat-a']);
    assert.deepEqual(f.registry.archivedSessionIds, []);
  });
}

test('pending deletion is excluded before an unarchived preview reads conversation content', async t => {
  const f = await fixture(t);
  f.registry.state.archivedSessionIds = [];
  f.registry.archiveSession = async () => {};
  await mkdir(f.data, { recursive: true });
  await writeFile(join(f.data, 'pending-deletions.json'), JSON.stringify({ ids: ['chat-a'] }));
  let reads = 0;
  const originalInspect = f.persistence.inspect;
  f.persistence.inspect = async id => { reads++; return originalInspect(id); };
  const result = await f.call('/preview', { sessionId: 'chat-a', scope: 'unarchived' });
  assert.equal(result.status, 404);
  assert.equal(reads, 0);
});

test('a pending-deletion archive cannot be previewed or read for its title', async t => {
  const f = await fixture(t);
  await mkdir(f.data, { recursive: true });
  await writeFile(join(f.data, 'pending-deletions.json'), JSON.stringify({ ids: ['chat-a'] }));
  let reads = 0;
  const originalInspect = f.persistence.inspect;
  f.persistence.inspect = async id => { reads++; return originalInspect(id); };

  const result = await f.call('/preview', { sessionId: 'chat-a' });
  assert.equal(result.status, 404);
  assert.equal(reads, 0);
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a']);
});

test('fork previews include inherited history and child reasoning without permitting lossy ZIP reads', async t => {
  const f = await fixture(t, { modern: true });
  const state = await f.call('/state');
  assert.equal(state.body.sessions[0].title, 'Greeting from user (1)');
  await assert.rejects(resolvePersistenceCompat(f.persistence).inspect('chat-a'), { code: 'session-inspection-unsupported' });
  const preview = await f.call('/preview', { sessionId: 'chat-a' });
  assert.equal(preview.status, 200);
  assert.deepEqual(preview.body.messages.map(m => [m.role, m.segments.map(s => s.text)]), [
    ['user', ['inherited hello']], ['assistant', ['child reasoning', 'child reply']],
  ]);
  assert.equal(f.reads.opened, f.reads.closed);
  assert.equal(await readFile(f.path, 'utf8'), 'original');
});



test('unreadable deletion authority never removes an archived original', async t => {
  const f = await fixture(t);
  await mkdir(f.data, { recursive: true });
  await writeFile(join(f.data, 'deletion-tasks.json'), 'unreadable authority');
  const result = await permanentlyDelete(f);
  assert.equal(result.status, 503);
  assert.equal(result.body.error, 'deletion-tasks-unavailable');
  assert.equal(await exists(f.path), true);
  assert.equal(await exists(join(f.data, 'pending-deletions.json')), false);
});





test('failed cold permanent deletion keeps durable intent and completes on explicit retry after restart without the original header', async t => {
  const f = await fixture(t);
  const save = f.registry.setState;
  f.registry.setState = async () => { throw new Error('simulated state write failure'); };
  const result = await permanentlyDelete(f);
  assert.equal(result.body.failed.length, 1);
  assert.equal(await exists(f.path), false);
  assert.equal((await f.trash.get('chat-a'))?.state, 'purge-pending');
  assert.deepEqual((await f.call('/state')).body.sessions, []);
  f.registry.setState = save;
  await f.restart();
  assert.equal(await f.trash.get('chat-a'), null);
  assert.deepEqual(f.registry.archivedSessionIds, []);
  assert.deepEqual(JSON.parse(await readFile(join(f.data, 'pending-deletions.json'), 'utf8')).ids, []);
});





test('unsupported or unsafe direct deletion fails before recording intent or disposing a live chat', async t => {
  for (const unsafe of [false, true]) {
    await t.test(unsafe ? 'shared directory' : 'no locate capability', async t => {
      const f = await fixture(t);
      f.services.sessions.get = () => ({ header: { id: 'chat-a' } });
      f.persistence.locate = unsafe ? () => ({ path: join(f.root, 'shared', 'session.jsonl') }) : undefined;
      const result = await permanentlyDelete(f);
      assert.equal(result.status, 409);
      assert.equal(result.body.failed[0].reason, unsafe ? 'session-location-unsafe' : 'purge-unsupported');
      assert.equal(await exists(f.path), true);
      assert.equal((await f.trash.load()).records.size, 0);
      assert.equal(await exists(join(f.data, 'pending-deletions.json')), false);
    });
  }
});

test('permanent deletion rejects another session located inside the requested directory before intent', async t => {
  const f = await fixture(t);
  const [requested] = await f.persistence.list();
  const other = { ...requested, id: 'chat-b' };
  const otherPath = join(f.root, 'sessions', 'chat-a', 'other.jsonl');
  await writeFile(otherPath, 'other session');
  f.persistence.list = async () => [requested, other];
  f.persistence.locate = (header) => ({ kind: 'jsonl', path: header.id === 'chat-a' ? f.path : otherPath });

  const result = await permanentlyDelete(f);

  assert.equal(result.status, 409);
  assert.equal(result.body.failed[0].reason, 'session-location-unsafe');
  assert.equal(await exists(f.path), true);
  assert.equal(await readFile(otherPath, 'utf8'), 'other session');
  assert.equal((await f.trash.load()).records.size, 0);
  assert.equal(await exists(join(f.data, 'pending-deletions.json')), false);
});

test('permanent deletion rejects a symlinked session-root ancestor before intent', async t => {
  const f = await fixture(t);
  const [requested] = await f.persistence.list();
  const actualBase = join(f.root, 'actual-base');
  const actualRoot = join(actualBase, 'sessions');
  const actualDirectory = join(actualRoot, 'chat-a');
  const actualPath = join(actualDirectory, 'session.jsonl');
  const linkedBase = join(f.root, 'linked-base');
  await mkdir(actualDirectory, { recursive: true });
  await writeFile(actualPath, 'linked original');
  await symlink(actualBase, linkedBase, process.platform === 'win32' ? 'junction' : 'dir');
  f.persistence.list = async () => [requested];
  f.persistence.locate = () => ({ kind: 'jsonl', path: join(linkedBase, 'sessions', 'chat-a', 'session.jsonl') });

  const result = await permanentlyDelete(f);

  assert.equal(result.status, 409);
  assert.equal(result.body.failed[0].reason, 'session-location-unsafe');
  assert.equal(await readFile(actualPath, 'utf8'), 'linked original');
  assert.equal((await f.trash.load()).records.size, 0);
  assert.equal(await exists(join(f.data, 'pending-deletions.json')), false);
});

test('physical deletion rechecks exclusivity when another session appears after preflight', async t => {
  const f = await fixture(t);
  const [requested] = await f.persistence.list();
  const other = { ...requested, id: 'chat-b' };
  const otherPath = join(f.root, 'sessions', 'chat-a', 'other.jsonl');
  await writeFile(otherPath, 'late session');
  let inventories = 0;
  f.persistence.list = async () => {
    inventories += 1;
    return existsSync(join(f.data, 'deletion-tasks.json')) ? [requested, other] : [requested];
  };
  f.persistence.locate = (header) => ({ kind: 'jsonl', path: header.id === 'chat-a' ? f.path : otherPath });

  const result = await permanentlyDelete(f);

  assert.equal(result.status, 409);
  assert.equal(result.body.failed[0].reason, 'session-location-unsafe');
  assert.deepEqual(result.body.pending, ['chat-a']);
  assert.equal(await exists(f.path), true);
  assert.equal(await readFile(otherPath, 'utf8'), 'late session');
  assert.equal((await f.trash.get('chat-a')).state, 'purge-pending');
});

test('unarchive delegates to official queue and preserves intervening Host state', async t => {
  const f = await fixture(t);
  let called = 0;
  f.registry.setState = async () => { throw new Error('plugin must not directly overwrite registry state'); };
  f.registry.unarchiveSession = async id => {
    called++;
    await Promise.resolve();
    f.registry.state = { ...f.registry.state, archivedSessionIds: ['another-official-archive'], pinnedSessionIds: ['new-pin'] };
    assert.equal(id, 'chat-a');
  };
  const result = await f.call('/unarchive-all', { sessionIds: ['chat-a', 'chat-a'] });
  assert.equal(result.status, 200);
  assert.equal(called, 1);
  assert.deepEqual(result.body.archivedSessionIds, ['another-official-archive']);
  assert.deepEqual(f.registry.state.pinnedSessionIds, ['new-pin']);
});

test('missing official unarchive capability fails without direct state writes', async t => {
  const f = await fixture(t);
  f.registry.unarchiveSession = undefined;
  const result = await f.call('/unarchive', { sessionId: 'chat-a' });
  assert.equal(result.status, 501);
  assert.equal(result.body.error, 'unarchive-unsupported');
  assert.deepEqual(f.registry.archivedSessionIds, ['chat-a']);
});


test('unreadable fork provenance blocks purge before removing original data', async t => {
  const f = await fixture(t);
  await mkdir(f.data, { recursive: true });
  await writeFile(join(f.data, 'fork-provenance.json'), '{broken');
  const response = await f.call('/delete', { sessionId: 'chat-a' });
  assert.equal(response.body.ok, false);
  assert.equal(await exists(f.path), true);
  assert.equal(f.registry.archivedSessionIds.includes('chat-a'), true);
});

test('unarchived deletion checks the visible identity and uses the durable purge path', async t => {
  const f = await fixture(t, { conversation: true });
  f.registry.state.archivedSessionIds = [];
  f.registry.archiveSession = async () => {};

  const response = await confirmedDelete(f, '/unarchived/delete', { sessionId: 'chat-a', createdAt: 10, permanent: true });
  assert.equal(response.status, 200);
  assert.deepEqual(response.body.deleted, ['chat-a']);
  assert.equal(await exists(f.path), false);
});

test('unarchived deletion rejects replaced and newly archived chats without removing data', async t => {
  const f = await fixture(t, { conversation: true });
  f.registry.state.archivedSessionIds = [];
  f.registry.archiveSession = async () => {};

  let response = await confirmedDelete(f, '/unarchived/delete', { sessionId: 'chat-a', createdAt: 99, permanent: true });
  assert.equal(response.status, 409);
  assert.equal(await exists(f.path), true);
  f.registry.state.archivedSessionIds = ['chat-a'];
  response = await confirmedDelete(f, '/unarchived/delete', { sessionId: 'chat-a', createdAt: 10, permanent: true });
  assert.equal(response.status, 409);
  assert.equal(await exists(f.path), true);
});

test('unarchived deletion refuses running chats and unconfirmed requests', async t => {
  const f = await fixture(t, { conversation: true });
  f.registry.state.archivedSessionIds = [];
  f.registry.archiveSession = async () => {};

  f.services.agents = { get: () => ({ status: 'running' }) };
  const response = await confirmedDelete(f, '/unarchived/delete', { sessionId: 'chat-a', createdAt: 10, permanent: true });
  assert.equal(response.status, 409);
  assert.equal(response.body.error, 'unarchived-delete-running');
  assert.equal(await exists(f.path), true);
  const unconfirmed = await f.call('/unarchived/delete', { sessionId: 'chat-a', createdAt: 10 });
  assert.equal(unconfirmed.status, 400);
});

for (const startLocation of [1, 2]) {
  test(`a chat starting after deletion intent at check ${startLocation} is preserved and retry stays guarded`, async t => {
    const f = await fixture(t, { conversation: true });
    f.registry.state.archivedSessionIds = [];
    f.registry.archiveSession = async () => {};
    let running = false;
    let cancellations = 0;
    f.services.agents = { get: () => ({ status: running ? 'running' : 'idle', cancel() { cancellations++; } }) };
    const locate = f.persistence.locate;
    let locations = 0;
    f.persistence.locate = (...args) => { if (existsSync(join(f.data, 'deletion-tasks.json')) && ++locations === startLocation) running = true; return locate(...args); };
    let response = await confirmedDelete(f, '/unarchived/delete', { sessionId: 'chat-a', createdAt: 10, permanent: true });
    assert.equal(response.status, 409);
    assert.equal(cancellations, 0);
    assert.equal(await exists(f.path), true);
    const pending = await f.trash.get('chat-a');
    assert.equal(pending.purgeRequireIdle, true);
    response = await f.call('/deletion-tasks/retry', { targets: [{ sessionId: 'chat-a', taskId: pending.taskId }] });
    assert.equal(cancellations, 0);
    assert.equal(await exists(f.path), true);
    running = false;
    const originalList = f.persistence.list;
    f.persistence.list = async () => (await originalList()).map(header => ({ ...header, createdAt: 99 }));
    response = await f.call('/deletion-tasks/retry', { targets: [{ sessionId: 'chat-a', taskId: pending.taskId }] });
    assert.equal(await exists(f.path), true);
    assert.equal(response.body.failed.some(item => item.reason === 'unarchived-delete-changed' || item.reason === 'session-identity-changed'), true);
  });
}


test('workspace unarchived deletion validates membership before removing a chat', async t => {
  const f = await fixture(t, { conversation: true });
  f.registry.state.archivedSessionIds = [];
  f.registry.archiveSession = async () => {};
  const changed = await confirmedDelete(f, '/unarchived/delete', { sessionId: 'chat-a', createdAt: 10, permanent: true, workspaceId: 'old-workspace' });
  assert.equal(changed.status, 409);
  assert.equal(await exists(f.path), true);
  const removed = await confirmedDelete(f, '/unarchived/delete', { sessionId: 'chat-a', createdAt: 10, permanent: true, workspaceId: null });
  assert.equal(removed.status, 200);
  assert.deepEqual(removed.body.deleted, ['chat-a']);
});

test('lineage hides only verified independent unarchived drafts', async t => {
  const f = await fixture(t);
  const [header] = await f.persistence.list();
  const headers = [
    { ...header, id: 'empty-draft' },
    { ...header, id: 'named-draft', title: 'Renamed before chatting' },
    { ...header, id: 'untitled-chat' },
    { ...header, id: 'legacy-content' },
    { ...header, id: 'unreadable-chat' },
    { ...header, id: 'source-root' },
    { ...header, id: 'branch', parentSession: 'source-root' },
    { ...header, id: 'seeded-source-unknown', isSeeded: true },
    { ...header, id: 'archived-empty' },
    { ...header, id: 'subagent', origin: 'subagent' },
  ];
  f.registry.state.archivedSessionIds = ['archived-empty'];
  f.registry.list = () => [{ id: 'workspace-a', title: 'Workspace A', sessionIds: headers.map(row => row.id) }];
  f.persistence.list = async () => headers;
  f.persistence.inspect = async id => {
    if (id === 'unreadable-chat') throw new Error('log unavailable');
    const events = id === 'untitled-chat' ? [{ type: 'turn/start', data: {} }]
      : id === 'legacy-content' ? [{ type: 'user/message', data: { role: 'user', content: [{ type: 'text', text: 'Real content without a turn marker' }] } }]
      : [];
    return { meta: headers.find(row => row.id === id), events };
  };
  const result = await f.call('/lineage');
  assert.equal(result.status, 200);
  const ids = [];
  const pending = [...result.body.roots];
  while (pending.length > 0) {
    const node = pending.pop(); ids.push(node.id); pending.push(...node.children);
  }
  assert.deepEqual(ids.sort(), headers.filter(row => !['empty-draft', 'named-draft'].includes(row.id)).map(row => row.id).sort());
  assert.equal(result.body.nodeCount, 8);
  assert.equal((await f.call('/preview', { sessionId: 'empty-draft', scope: 'lineage' })).status, 404);
  assert.equal(headers.length, 10, 'filtering does not delete Host records');
});

test('lineage uses fresh live events to classify an independent draft', async t => {
  const f = await fixture(t);
  const [header] = await f.persistence.list();
  f.registry.state.archivedSessionIds = [];
  let events = [];
  f.services.sessions = { get: () => ({ header, snapshotEvents: () => events }) };
  assert.equal((await f.call('/lineage')).body.nodeCount, 0);
  events = [{ type: 'turn/start', data: {} }];
  assert.equal((await f.call('/lineage')).body.nodeCount, 1);
});


test('legacy recovery and retention routes are removed while task retries remain explicit', async t => {
  const f = await fixture(t);
  for (const suffix of ['/trash', '/trash/restore', '/trash/export', '/trash/purge', '/trash/empty',
    '/retention/policy', '/retention/policy/preview', '/retention/preview', '/retention/apply']) {
    assert.equal(f.routes.has('/plugins/dsh-archived-chats' + suffix), false);
  }
  assert.equal(f.routes.has('/plugins/dsh-archived-chats/deletion-tasks/retry'), true);
  const response = await f.call('/deletion-tasks/retry', { targets: [{ sessionId: 'chat-a', taskId: 'stale' }] });
  assert.equal(response.status, 409);
  assert.equal(await exists(f.path), true);
});
