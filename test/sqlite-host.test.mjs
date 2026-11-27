import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { EventEmitter, once } from 'node:events';
import { PassThrough } from 'node:stream';
import { buffer } from 'node:stream/consumers';
import { unzipSync } from 'fflate';
import { apply } from '../lib/index.js';
import { createExportZip, planExport } from '../lib/export.js';
import { createMetadataStore } from '../lib/metadata.js';
import { resolvePersistenceCompat } from '../lib/persistence-compat.js';
import { createRestoreAdapter } from '../lib/restore.js';

// SQLite is an explicit Host opt-in. Never open the user's persistence root.
const nativeRoot = process.env.DSH_NATIVE_MODULE_ROOT;
if (process.env.DSH_REQUIRE_NATIVE === '1' && !nativeRoot) {
  throw new Error('DSH_NATIVE_MODULE_ROOT is required for SQLite release validation');
}
const native = name => import(pathToFileURL(join(nativeRoot, '@deepseek-ai', name, 'lib/index.js')));

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'dac-sqlite-native-'));
  const previous = process.env.DSH_HOME;
  process.env.DSH_HOME = root;
  const { Context } = await native('cordis');
  const { SESSION_FORMAT_VERSION } = await native('dsh-session');
  const provider = await native('dsh-session-persistence-sqlite');
  const ctx = new Context();
  t.after(async () => {
    try { await ctx.fiber.dispose(); }
    finally {
      if (previous === undefined) delete process.env.DSH_HOME;
      else process.env.DSH_HOME = previous;
      await rm(root, { recursive: true, force: true });
    }
  });
  await ctx.plugin(provider.default ?? provider, { root: join(root, 'sessions') }).await();
  const raw = ctx.get('sessionPersistence');
  assert.ok(raw, 'official SQLite provider must expose persistence');
  const workspace = { id: 'ws-sqlite', title: 'SQLite workspace', sessionIds: [],
    async attachSession(id) { this.sessionIds.push(id); },
    async detachSession(id) { this.sessionIds = this.sessionIds.filter(value => value !== id); } };
  const registry = { state: { archivedSessionIds: [], workspaceIds: [workspace.id] },
    get archivedSessionIds() { return this.state.archivedSessionIds; },
    list: () => [workspace], get: id => id === workspace.id ? workspace : undefined,
    async archiveSession(id) { if (!this.state.archivedSessionIds.includes(id)) this.state.archivedSessionIds.push(id); },
    async unarchiveSession(id) { this.state.archivedSessionIds = this.state.archivedSessionIds.filter(value => value !== id); },
    async setState(state) { this.state = state; } };
  const routes = new Map();
  const services = { workspaceRegistry: registry, sessionPersistence: raw,
    sessions: { get: () => undefined },
    webServer: { register({ path, handler }) { routes.set(path, handler); } } };
  apply({ get: key => services[key], on() {}, logger: { warn() {} },
    effect(fn, label) { if (label !== 'archived-chats: automatic recycle cleanup') fn(); } });
  async function call(path, body, headers = {}) {
    const req = new EventEmitter();
    req.method = body === undefined ? 'GET' : 'POST';
    req.headers = { 'x-dsh-archived-chats': '1', ...headers };
    const res = new PassThrough();
    let status;
    res.writeHead = code => { status = code; return res; };
    const chunks = [];
    res.on('data', chunk => chunks.push(chunk));
    const ended = once(res, 'end');
    queueMicrotask(() => {
      if (body !== undefined) req.emit('data', Buffer.isBuffer(body) ? body : Buffer.from(JSON.stringify(body)));
      req.emit('end');
    });
    await routes.get('/plugins/dsh-archived-chats' + path)(req, res);
    await ended;
    const bytes = Buffer.concat(chunks);
    return { status, bytes, json: () => JSON.parse(bytes) };
  }
  async function read(id) {
    const handle = await raw.open(id, 'read');
    try { return { meta: handle.header, events: (await handle.read()).events, inheritedEventCount: handle.inheritedEventCount }; }
    finally { await handle.close(); }
  }
  function record(id) {
    return {
      meta: { version: SESSION_FORMAT_VERSION, id, createdAt: 42, cwd: root, isSeeded: false, delegationDepth: 0 },
      events: [
        { seq: 0, time: 42, type: 'session/title', data: { title: 'SQLite conversation', messageSeqs: [], source: { kind: 'user' } } },
        { seq: 1, time: 43, type: 'turn/start', data: { turn: 1 } },
        { seq: 2, time: 44, type: 'user/message', surfaceOp: 'append', data: { id: 'message-sqlite', role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: 'SQLite keeps this message' }] } },
      ],
      inheritedEventCount: 0,
    };
  }
  async function seed(id) {
    const value = record(id);
    const handle = await raw.create(value.meta);
    try { await handle.append(value.events); await handle.flush(); }
    finally { await handle.close(); }
    await workspace.attachSession(id);
    return value;
  }
  async function exportSession(id, archived = true) {
    const response = await call(archived ? '/export' : '/unarchived/export',
      Buffer.from(new URLSearchParams({ sessionIds: JSON.stringify([id]) }).toString()),
      { 'content-type': 'application/x-www-form-urlencoded' });
    assert.equal(response.status, 200, response.bytes.toString());
    const files = unzipSync(response.bytes);
    const manifest = JSON.parse(new TextDecoder().decode(files['manifest.json']));
    return JSON.parse(new TextDecoder().decode(files[manifest.sessions[0].files.json]));
  }
  return { root, raw, registry, workspace, call, read, record, seed, exportSession };
}

test('official SQLite: archived and unarchived preview and ZIP export preserve stored messages', { skip: !nativeRoot }, async t => {
  const f = await fixture(t);
  const id = 'sqlite-readable';
  const stored = await f.seed(id);
  const unarchived = await f.call('/unarchived');
  assert.equal(unarchived.status, 200, unarchived.bytes.toString());
  assert.ok(unarchived.json().sessions.some(row => row.id === id), unarchived.bytes.toString());
  const preview = await f.call('/preview', { sessionId: id, scope: 'unarchived' });
  assert.equal(preview.status, 200, preview.bytes.toString());
  assert.equal(preview.json().messages[0].segments[0].text, 'SQLite keeps this message');
  assert.deepEqual((await f.exportSession(id, false)).source, stored);
  const archivePreview = await f.call('/workspace-archive/preview', { workspaceId: f.workspace.id, sessionIds: [id] });
  assert.equal(archivePreview.status, 200, archivePreview.bytes.toString());
  const archive = await f.call('/workspace-archive/apply', { token: archivePreview.json().token, nonce: archivePreview.json().nonce });
  assert.equal(archive.status, 200, archive.bytes.toString());
  assert.deepEqual(f.registry.archivedSessionIds, [id]);
  assert.equal((await f.call('/state')).json().sessions[0].title, 'SQLite conversation');
  assert.deepEqual((await f.exportSession(id)).source, stored);
  assert.equal((await f.call('/unarchive', { sessionId: id })).status, 200);
  assert.deepEqual(f.registry.archivedSessionIds, []);
  assert.deepEqual(await f.read(id), stored);
});

test('official SQLite: permanent deletion refuses a shared store and retains every session', { skip: !nativeRoot }, async t => {
  const f = await fixture(t);
  const target = await f.seed('sqlite-delete-target');
  const other = await f.seed('sqlite-delete-neighbor');
  f.registry.state.archivedSessionIds = [target.meta.id, other.meta.id];
  const preview = await f.call('/deletion/preview', { source: 'archive', sessions: [{ sessionId: target.meta.id, createdAt: 42 }] });
  assert.equal(preview.status, 409, preview.bytes.toString());
  assert.equal(preview.json().error, 'session-location-unsafe');
  const deleted = await f.call('/delete-all', { sessionIds: [target.meta.id], permanent: true, fingerprint: 'stale-confirmation' });
  assert.equal(deleted.status, 409, deleted.bytes.toString());
  assert.deepEqual(deleted.json().deleted, []);
  assert.deepEqual(deleted.json().failed, [{ id: target.meta.id, reason: 'session-location-unsafe' }]);
  assert.deepEqual(await f.read(target.meta.id), target);
  assert.deepEqual(await f.read(other.meta.id), other);
  assert.deepEqual(f.registry.archivedSessionIds, [target.meta.id, other.meta.id]);
  assert.deepEqual((await f.raw.list()).map(row => row.header.id).sort(), [other.meta.id, target.meta.id].sort());
});

test('official SQLite: ZIP restore refuses before creating an unrollbackable session', { skip: !nativeRoot }, async t => {
  const f = await fixture(t);
  const existing = await f.seed('sqlite-existing');
  const adapter = createRestoreAdapter({ persistence: resolvePersistenceCompat(f.raw), registry: f.registry,
    metadataStore: createMetadataStore({ filePath: join(f.root, 'test-metadata.json') }), tempRoot: f.root });
  assert.deepEqual(adapter.capability, { supported: false, reason: 'writer-missing' });
  const incoming = f.record('sqlite-import-target');
  const zip = await createExportZip({ plan: planExport([{ id: incoming.meta.id, title: 'Import title' }]),
    inspect: async () => incoming, generatorVersion: 'test' });
  const [bytes] = await Promise.all([buffer(zip.stream), zip.completion]);
  const boundary = 'sqlite-import';
  const body = Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="backup.zip"\r\nContent-Type: application/zip\r\n\r\n`), bytes, Buffer.from(`\r\n--${boundary}--\r\n`)]);
  const inspected = await f.call('/import/inspect', body, { 'content-type': `multipart/form-data; boundary=${boundary}` });
  assert.equal(inspected.status, 200, inspected.bytes.toString());
  const selection = inspected.json();
  const restored = await f.call('/import/restore', { token: selection.token, nonce: selection.nonce, sessionIds: [incoming.meta.id] });
  assert.equal(restored.status, 501, restored.bytes.toString());
  assert.equal(restored.json().error, 'restore-unsupported');
  assert.equal(await f.raw.stat(incoming.meta.id), undefined);
  assert.deepEqual((await f.raw.list()).map(row => row.header.id), [existing.meta.id]);
  assert.deepEqual(await f.read(existing.meta.id), existing);
  assert.deepEqual(f.registry.archivedSessionIds, []);
  assert.deepEqual(f.workspace.sessionIds, [existing.meta.id]);
});

test('official SQLite: exported fork retains its inherited cut and excludes later parent messages', { skip: !nativeRoot }, async t => {
  const f = await fixture(t);
  const { Session } = await native('dsh-session');
  const parent = await f.seed('sqlite-fork-parent');
  const meta = { ...parent.meta, id: 'sqlite-fork-child', isSeeded: true, parentSession: parent.meta.id };
  const session = Session.create(meta.id, parent.events, meta, parent.events.length);
  session.append('session/title', { title: 'SQLite fork', messageSeqs: [], source: { kind: 'user' } });
  const events = session.snapshotEvents();
  const handle = await f.raw.create(meta, { inheritedEventCount: parent.events.length,
    parentSource: { sessionId: parent.meta.id, endSeq: parent.events.length, events } });
  await handle.close();
  const parentWriter = await f.raw.open(parent.meta.id, 'write');
  try {
    await parentWriter.append([{ seq: parent.events.length, time: 44, type: 'session/title', data: { title: 'Later parent title', messageSeqs: [], source: { kind: 'user' } } }]);
    await parentWriter.flush();
  } finally { await parentWriter.close(); }
  await f.workspace.attachSession(meta.id);
  f.registry.state.archivedSessionIds = [meta.id];
  const exported = await f.exportSession(meta.id);
  assert.deepEqual(exported.source, { meta, events, inheritedEventCount: 3 });
  assert.ok(!exported.source.events.some(event => event.data?.title === 'Later parent title'));
});
