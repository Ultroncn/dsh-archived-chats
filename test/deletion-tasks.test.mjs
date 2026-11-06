import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDeletionTaskStore } from '../lib/deletion-tasks.js';
import { createDeletionService } from '../lib/deletion.js';

const task = (id, taskId = `task-${id}`) => ({ sessionId: id, taskId, state: 'purge-pending',
  purgeRequestedAt: '2026-11-07T00:00:00.000Z', title: id, createdAt: 10, origin: null, workspace: null });
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'dac-deletion-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const path = join(root, 'deletion-tasks.json');
  return { root, path, store: createDeletionTaskStore({ path }) };
}

test('deletion tasks persist independently and reject invalid state transitions', async t => {
  const f = await fixture(t);
  assert.equal((await f.store.load()).records.size, 0);
  await f.store.put(task('a'));
  assert.equal((await createDeletionTaskStore({ path: f.path }).get('a')).taskId, 'task-a');
  await assert.rejects(f.store.put(task('a')), { code: 'deletion-task-conflict' });
  await assert.rejects(f.store.put({ ...task('b'), state: 'trashed' }), { code: 'deletion-tasks-unavailable' });
  await assert.rejects(f.store.put({ ...task('b'), cascadeSessionIds: ['b'] }), { code: 'deletion-tasks-unavailable' });
  await assert.rejects(f.store.put({ ...task('b'), purgeRequireIdle: true }), { code: 'deletion-tasks-unavailable' });
  assert.deepEqual(await f.store.remove(['a']), ['a']);
  assert.equal(await f.store.get('a'), null);
});

test('store instances serialize concurrent writes and isolate returned records', async t => {
  const f = await fixture(t);
  const other = createDeletionTaskStore({ path: f.path });
  await Promise.all([f.store.put(task('a')), other.put(task('b'))]);
  const loaded = await f.store.load();
  loaded.records.get('a').title = 'mutated';
  assert.equal((await f.store.get('a')).title, 'a');
  assert.equal((await f.store.load()).records.size, 2);
});

test('unreadable task storage fails closed and preserves original bytes', async t => {
  const f = await fixture(t);
  const bytes = '{broken';
  await writeFile(f.path, bytes);
  assert.equal((await f.store.load()).status, 'unavailable');
  await assert.rejects(f.store.put(task('a')), { code: 'deletion-tasks-unavailable' });
  assert.equal(await readFile(f.path, 'utf8'), bytes);
});

test('upgrade carries only committed deletions and preserves the previous recovery file', async t => {
  const f = await fixture(t);
  const previousPath = join(f.root, 'trash.json');
  const pending = { ...task('a'), snapshotId: null, tags: ['private'], note: 'private' };
  delete pending.taskId;
  const bytes = JSON.stringify({ version: 1, records: { a: pending, old: { state: 'trashed' } } });
  await writeFile(previousPath, bytes);
  const store = createDeletionTaskStore({ path: f.path, previousPath });
  const first = await store.load();
  assert.deepEqual([...first.records.keys()], ['a']);
  assert.equal(first.records.get('a').note, undefined);
  assert.equal((await store.get('a')).taskId, first.records.get('a').taskId);
  await store.put(task('b'));
  assert.equal(await readFile(previousPath, 'utf8'), bytes);
  assert.equal((await createDeletionTaskStore({ path: f.path }).load()).records.size, 2);
});

async function serviceFixture(t, { now } = {}) {
  const f = await fixture(t);
  let headers = [{ id: 'parent', createdAt: 10 },
    { id: 'child', createdAt: 20, parentSession: 'parent', origin: 'subagent' },
    { id: 'branch', createdAt: 30, parentSession: 'parent', isSeeded: true },
    { id: 'branch-agent', createdAt: 40, parentSession: 'branch', origin: 'subagent' }];
  const calls = [];
  let failing = null;
  const registry = { archivedSessionIds: ['parent'], list: () => [] };
  const busy = new Set();
  const service = createDeletionService({
    registry,
    persistence: { list: async () => structuredClone(headers), locate: () => ({ kind: 'jsonl', path: '/unused' }) },
    metadataStore: { getMany: async () => ({ status: 'ready', entries: {} }) },
    taskStore: f.store, lifecycle: { run: operation => operation() },
    now,
    verifyPurgeScope: async id => { calls.push(`verify:${id}`); },
    assertIdle: async id => { if (busy.has(id)) throw Object.assign(new Error('running'), { code: 'session-delete-running' }); },
    disposeLive: async id => { calls.push(`dispose:${id}`); return { disposition: 'cold' }; },
    purgePhysical: async (id, record) => {
      assert.equal((await f.store.get(id)).taskId, record.taskId);
      calls.push(`delete:${id}`);
      if (failing === id) throw Object.assign(new Error('disk busy'), { code: 'disk-busy' });
      headers = headers.filter(row => row.id !== id);
    },
  });
  return { ...f, service, calls, registry, busy, fail: id => { failing = id; }, headers: () => headers };
}

test('preview reports exact scope without deleting and remove uses the same scope across archive states', async t => {
  for (const archived of [true, false]) {
    const f = await serviceFixture(t);
    f.registry.archivedSessionIds = archived ? ['parent'] : [];
    const options = { requireArchived: archived, validate: async () => {} };
    const plan = await f.service.preview(['parent'], options);
    assert.deepEqual(plan.targets.map(row => row.sessionId), ['parent', 'child']);
    assert.equal(plan.selectedCount, 1);
    assert.equal(plan.subagentCount, 1);
    assert.equal((await f.store.load()).records.size, 0);
    assert.equal(f.calls.some(call => call.startsWith('dispose:') || call.startsWith('delete:')), false);
    const result = await f.service.remove(['parent'], { ...options, fingerprint: plan.fingerprint });
    assert.deepEqual(result.deleted, ['parent', 'child']);
    assert.deepEqual(result.failed, []);
    assert.deepEqual(f.headers().map(row => row.id), ['branch', 'branch-agent']);
  }
});

test('changed descendants require new confirmation before any deletion', async t => {
  const f = await serviceFixture(t);
  const plan = await f.service.preview(['parent']);
  f.headers().push({ id: 'new-child', createdAt: 50, origin: 'subagent', parentSession: 'parent' });
  await assert.rejects(f.service.remove(['parent'], { fingerprint: plan.fingerprint }), { code: 'deletion-scope-changed' });
  assert.equal(f.calls.some(call => call.startsWith('delete:') || call.startsWith('dispose:')), false);
  assert.equal((await f.store.load()).records.size, 0);
});

test('legacy deletion requires the same preview fingerprint and rejects added descendants', async t => {
  const f = await serviceFixture(t);
  const missing = await f.service.deleteArchived(['parent']);
  assert.equal(missing.failed[0]?.reason, 'deletion-confirmation-required');
  assert.equal(f.calls.some(call => call.startsWith('delete:')), false);
  const plan = await f.service.preview(['parent']);
  f.headers().push({ id: 'late-child', createdAt: 50, origin: 'subagent', parentSession: 'parent' });
  const stale = await f.service.deleteArchived(['parent'], { fingerprint: plan.fingerprint });
  assert.equal(stale.failed[0]?.reason, 'deletion-scope-changed');
  assert.equal(f.calls.some(call => call.startsWith('delete:')), false);
});

test('failed deletion returns durable retry identities that resume only the saved scope', async t => {
  const f = await serviceFixture(t);
  const plan = await f.service.preview(['parent']);
  f.fail('child');
  const result = await f.service.remove(['parent'], { fingerprint: plan.fingerprint });
  const parent = await f.store.get('parent');
  const child = await f.store.get('child');
  assert.deepEqual(result.retryTargets, [{ sessionId: 'parent', taskId: parent.taskId },
    { sessionId: 'child', taskId: child.taskId }]);
  f.fail(null);
  const retried = await f.service.retry(result.retryTargets);
  assert.deepEqual(retried.failed, []);
  assert.deepEqual(retried.retryTargets, []);
  assert.deepEqual(f.headers().map(row => row.id), ['branch', 'branch-agent']);
});

test('replaying a completed confirmed deletion does not repeat physical operations', async t => {
  const f = await serviceFixture(t);
  const plan = await f.service.preview(['parent']);
  const first = await f.service.remove(['parent'], { fingerprint: plan.fingerprint });
  const calls = [...f.calls];
  const replayed = await f.service.remove(['parent'], { fingerprint: plan.fingerprint });
  assert.deepEqual(replayed, first);
  assert.deepEqual(f.calls, calls);
  f.headers().push({ id: 'parent', createdAt: 99 });
  await f.service.remove(['parent'], { fingerprint: plan.fingerprint });
  assert.equal(f.headers().find(row => row.id === 'parent')?.createdAt, 99);
  assert.deepEqual(f.calls, calls);
  f.registry.archivedSessionIds.push('branch');
  await assert.rejects(f.service.remove(['branch'], { fingerprint: plan.fingerprint }), { code: 'deletion-scope-changed' });
  assert.deepEqual(f.calls.filter(call => call.startsWith('delete:')), calls.filter(call => call.startsWith('delete:')));
});

test('expired response receipts do not turn an unknown session into a successful deletion', async t => {
  let time = 0;
  const f = await serviceFixture(t, { now: () => new Date(time) });
  const plan = await f.service.preview(['parent']);
  await f.service.remove(['parent'], { fingerprint: plan.fingerprint });
  const calls = [...f.calls];
  time = 10 * 60 * 1000;
  await assert.rejects(f.service.remove(['parent'], { fingerprint: plan.fingerprint }), { code: 'session-location-unavailable' });
  assert.deepEqual(f.calls, calls);
});

test('a running descendant blocks the whole confirmed deletion before removing its parent', async t => {
  const f = await serviceFixture(t);
  const plan = await f.service.preview(['parent']);
  f.busy.add('child');
  await assert.rejects(f.service.remove(['parent'], { fingerprint: plan.fingerprint }), { code: 'session-delete-running' });
  assert.equal(f.calls.some(call => call.startsWith('delete:') || call.startsWith('dispose:')), false);
});

test('confirmed retry protects reused child identities and never adds new descendants', async t => {
  const f = await serviceFixture(t);
  f.fail('parent');
  const plan = await f.service.preview(['parent']);
  await f.service.remove(['parent'], { fingerprint: plan.fingerprint });
  const pending = await f.store.get('parent');
  assert.deepEqual(pending.confirmedScope, [{ sessionId: 'parent', createdAt: 10 }, { sessionId: 'child', createdAt: 20 }]);
  f.headers().find(row => row.id === 'child').createdAt = 99;
  f.fail(null);
  const result = await f.service.retry([{ sessionId: 'parent', taskId: pending.taskId }]);
  assert.equal(result.failed.some(row => row.reason === 'session-identity-changed'), true);
  assert.equal(f.headers().length, 4);
  f.headers().find(row => row.id === 'child').createdAt = 20;
  f.headers().push({ id: 'new-child', createdAt: 50, origin: 'subagent', parentSession: 'parent' });
  const changed = await f.service.retry([{ sessionId: 'parent', taskId: pending.taskId }]);
  assert.equal(changed.failed.some(row => row.reason === 'deletion-scope-changed'), true);
  assert.equal(f.headers().length, 5);
});

test('permanent deletion removes subagents while preserving independent branches', async t => {
  const f = await serviceFixture(t);
  const plan = await f.service.preview(['parent']);
  const result = await f.service.deleteArchived(['parent'], { fingerprint: plan.fingerprint });
  assert.deepEqual(result.deleted, ['parent', 'child']);
  assert.deepEqual(result.failed, []);
  assert.deepEqual(f.headers().map(row => row.id), ['branch', 'branch-agent']);
  assert.equal((await f.store.load()).records.size, 0);
});

test('failed deletion keeps durable scope and retries the captured task', async t => {
  const f = await serviceFixture(t);
  f.fail('child');
  const plan = await f.service.preview(['parent']);
  const first = await f.service.deleteArchived(['parent'], { fingerprint: plan.fingerprint });
  assert.equal(first.failed.some(row => row.id === 'child'), true);
  const parent = await f.store.get('parent');
  assert.deepEqual(parent.cascadeSessionIds, ['child']);
  assert.equal(f.headers().some(row => row.id === 'parent'), false);
  f.fail(null);
  const result = await f.service.retry([{ sessionId: 'parent', taskId: parent.taskId }]);
  assert.deepEqual(result.failed, []);
  assert.equal((await f.store.load()).records.size, 0);
});

test('a new child of an already removed parent blocks retry without widening confirmed scope', async t => {
  const f = await serviceFixture(t);
  f.fail('child');
  const plan = await f.service.preview(['parent']);
  await f.service.remove(['parent'], { fingerprint: plan.fingerprint });
  assert.equal(f.headers().some(row => row.id === 'parent'), false);
  const pending = await f.store.get('parent');
  f.headers().push({ id: 'late-child', createdAt: 60, parentSession: 'parent', origin: 'subagent' });
  f.fail(null);
  const result = await f.service.retry([{ sessionId: 'parent', taskId: pending.taskId }]);
  assert.equal(result.failed.some(row => row.reason === 'deletion-scope-changed'), true);
  assert.equal(f.headers().some(row => row.id === 'child'), true);
  assert.equal(f.headers().some(row => row.id === 'late-child'), true);
  assert.notEqual(await f.store.get('parent'), null);
});

test('stale or unknown retry identities are rejected before any physical deletion', async t => {
  const f = await serviceFixture(t);
  await f.store.put(task('parent', 'replacement'));
  await assert.rejects(f.service.retry([{ sessionId: 'parent', taskId: 'old-task' }]), { code: 'deletion-task-missing' });
  await assert.rejects(f.service.retry([{ sessionId: 'unknown', taskId: 'unknown' }]), { code: 'deletion-task-missing' });
  await assert.rejects(f.service.retry([{}]), { code: 'deletion-task-missing' });
  assert.deepEqual(f.calls, []);
});

test('historical selected-only deletion preserves descendants and its scope through retry', async t => {
  const f = await serviceFixture(t);
  await f.store.put({ ...task('parent'), purgeSelectedOnly: true, purgeRequireIdle: true });
  const pending = await f.store.get('parent');
  assert.equal(pending.purgeSelectedOnly, true);
  assert.equal(pending.purgeRequireIdle, true);
  f.fail(null);
  await f.service.retry([{ sessionId: 'parent', taskId: pending.taskId }]);
  assert.deepEqual(f.headers().map(row => row.id), ['child', 'branch', 'branch-agent']);
});

test('reading pending tasks never deletes or disposes sessions', async t => {
  const f = await serviceFixture(t);
  await f.store.put(task('parent'));
  const result = await f.service.list();
  assert.equal(result.length, 1);
  assert.deepEqual(f.calls, []);
});

test('task listing reads pending authority inside the lifecycle queue', async t => {
  const f = await fixture(t);
  const queue = [];
  let pendingReads = 0;
  const service = createDeletionService({
    registry: { list: () => [] }, persistence: { list: async () => [] }, taskStore: f.store,
    pendingStore: { load: async () => { pendingReads++; return new Set(); } },
    lifecycle: { run: operation => new Promise((resolve, reject) => {
      queue.push(() => Promise.resolve().then(operation).then(resolve, reject));
    }) },
  });
  const listing = service.list();
  assert.equal(queue.length, 1, 'the lock is queued before reading task or pending state');
  assert.equal(pendingReads, 0);
  await queue.shift()();
  assert.deepEqual(await listing, []);
});
