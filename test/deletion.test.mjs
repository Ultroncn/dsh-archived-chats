import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDeletionTaskStore } from '../lib/deletion-tasks.js';
import { createDeletionService } from '../lib/deletion.js';

const task = (id) => ({
  sessionId: id, taskId: `task-${id}`, state: 'purge-pending',
  purgeRequestedAt: '2026-11-07T00:00:00.000Z', title: id, createdAt: 10, origin: null, workspace: null,
});

/**
 * The retry pre-check sees the seeded record, but a concurrent actor removes
 * it before the purge re-reads the store. The purge must then rebuild the
 * descriptor from live state instead of trusting the vanished record.
 */
function racedRemovalStore(store, id) {
  let loads = 0;
  return {
    ...store,
    load: async (...args) => {
      loads += 1;
      if (loads === 2) {
        await store.remove([id]);
        return { status: 'ready', records: new Map() };
      }
      if (loads === 3) return { status: 'ready', records: new Map() };
      return store.load(...args);
    },
  };
}

async function fixture(t, options = {}) {
  const root = await mkdtemp(join(tmpdir(), 'dac-deletion-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const store = createDeletionTaskStore({ path: join(root, 'deletion-tasks.json') });
  let headers = structuredClone(options.headers ?? [{ id: 's1', createdAt: 10, title: 'Header Title' }]);
  const calls = [];
  const service = createDeletionService({
    registry: { archivedSessionIds: options.archived ?? ['s1'], list: options.registryList ?? (() => []) },
    persistence: {
      list: async () => structuredClone(headers),
      locate: () => ({ kind: 'jsonl', path: '/unused' }),
      ...(options.readTitle ? { readTitle: options.readTitle } : {}),
    },
    metadataStore: { getMany: async () => ({ status: 'ready', entries: {} }) },
    taskStore: options.wrapStore ? options.wrapStore(store) : store,
    lifecycle: { run: (operation) => operation() },
    verifyPurgeScope: async (id) => { calls.push(`verify:${id}`); },
    assertIdle: async () => {},
    disposeLive: async (id) => { calls.push(`dispose:${id}`); return { disposition: 'cold' }; },
    purgePhysical: options.purgePhysical ?? (async (id) => {
      calls.push(`delete:${id}`);
      if (options.failing === id) throw Object.assign(new Error('disk busy'), { code: 'disk-busy' });
      headers = headers.filter((row) => row.id !== id);
    }),
  });
  return { root, store, service, calls, headers: () => headers };
}

test('retry of a concurrently removed task fails closed when the session is not archived', async (t) => {
  const f = await fixture(t, { archived: [], wrapStore: (store) => racedRemovalStore(store, 's1') });
  await f.store.put(task('s1'));
  const result = await f.service.retry([{ sessionId: 's1', taskId: 'task-s1' }]);
  assert.deepEqual(result.failed, [{ id: 's1', reason: 'session-not-archived' }]);
  assert.deepEqual(result.deleted, []);
  assert.equal(f.calls.some((call) => call.startsWith('delete:') || call.startsWith('dispose:')), false);
});

test('retry of a concurrently removed task fails closed when the session location is gone', async (t) => {
  const f = await fixture(t, {
    headers: [],
    archived: ['s1'],
    wrapStore: (store) => racedRemovalStore(store, 's1'),
  });
  await f.store.put(task('s1'));
  const result = await f.service.retry([{ sessionId: 's1', taskId: 'task-s1' }]);
  assert.deepEqual(result.failed, [{ id: 's1', reason: 'session-location-unavailable' }]);
  assert.deepEqual(result.deleted, []);
  assert.equal(f.calls.some((call) => call.startsWith('delete:') || call.startsWith('dispose:')), false);
});

test('deletion preflight keeps the header title when the title reader fails', async (t) => {
  const f = await fixture(t, {
    failing: 's1',
    readTitle: async () => { throw new Error('title reader down'); },
    wrapStore: (store) => racedRemovalStore(store, 's1'),
  });
  await f.store.put(task('s1'));
  const result = await f.service.retry([{ sessionId: 's1', taskId: 'task-s1' }]);
  assert.deepEqual(result.failed, [{ id: 's1', reason: 'disk-busy' }]);
  assert.deepEqual(result.pending, ['s1']);
  // The rebuilt descriptor kept the header title instead of the failed reader.
  assert.equal((await f.store.get('s1')).title, 'Header Title');
});

test('deletion preflight records a workspace whose sessions are a Set', async (t) => {
  const f = await fixture(t, {
    failing: 's1',
    registryList: () => [{ id: 'ws1', title: 'WS', path: '/ws', sessionIds: new Set(['s1']) }],
    wrapStore: (store) => racedRemovalStore(store, 's1'),
  });
  await f.store.put(task('s1'));
  const result = await f.service.retry([{ sessionId: 's1', taskId: 'task-s1' }]);
  assert.deepEqual(result.failed, [{ id: 's1', reason: 'disk-busy' }]);
  assert.deepEqual((await f.store.get('s1')).workspace, { id: 'ws1', title: 'WS', path: '/ws' });
});

test('deletion preflight leaves the workspace blank when no workspace lists the session', async (t) => {
  const f = await fixture(t, {
    failing: 's1',
    registryList: () => [{ id: 'ws1', title: 'WS', path: '/ws' }],
    wrapStore: (store) => racedRemovalStore(store, 's1'),
  });
  await f.store.put(task('s1'));
  const result = await f.service.retry([{ sessionId: 's1', taskId: 'task-s1' }]);
  assert.deepEqual(result.failed, [{ id: 's1', reason: 'disk-busy' }]);
  assert.equal((await f.store.get('s1')).workspace, null);
});
