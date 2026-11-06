import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createForkProvenanceStore, observeOfficialForks, applyForkProvenance } from '../lib/fork-provenance.js';

const parent = { id: 'parent', version: 4, createdAt: 10, isSeeded: false };
const child = { id: 'child', version: 4, createdAt: 20, isSeeded: true };
const entry = { childId: child.id, childCreatedAt: 20, parentId: parent.id, parentCreatedAt: 10 };
async function storeFixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'dac-provenance-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const filePath = join(root, 'forks.json');
  return { filePath, store: createForkProvenanceStore({ filePath }) };
}

test('fork provenance survives restart and concurrent writers without losing records', async t => {
  const { store, filePath } = await storeFixture(t);
  const other = createForkProvenanceStore({ filePath });
  await Promise.all(Array.from({ length: 20 }, (_, index) => (index % 2 ? store : other).record({ ...entry, childId: `child-${index}` })));
  const loaded = await createForkProvenanceStore({ filePath }).load();
  assert.equal(loaded.status, 'ready');
  assert.equal(loaded.entries.length, 20);
});

test('unreadable catalog is reported and never overwritten', async t => {
  const { store, filePath } = await storeFixture(t);
  await writeFile(filePath, '{broken');
  assert.equal((await store.load()).status, 'unavailable');
  await assert.rejects(store.record(entry));
  assert.equal(await readFile(filePath, 'utf8'), '{broken');
});

test('record validation rejects self links and conflicting sources', async t => {
  const { store } = await storeFixture(t);
  await assert.rejects(store.record({ ...entry, parentId: 'child' }));
  await store.record(entry);
  await assert.rejects(store.record({ ...entry, parentId: 'other' }));
  assert.deepEqual((await store.load()).entries, [entry]);
});

test('projection preserves official fields and rejects reused identities', () => {
  assert.equal(applyForkProvenance([parent, child], [entry])[1].parentSession, 'parent');
  assert.equal(child.parentSession, undefined);
  const official = { ...child, parentSession: 'official' };
  assert.equal(applyForkProvenance([parent, official], [entry])[1].parentSession, 'official');
  assert.equal(applyForkProvenance([parent, { ...child, createdAt: 99 }], [entry])[1].parentSession, undefined);
  assert.equal(applyForkProvenance([{ ...parent, createdAt: 99 }, child], [entry])[1].parentSession, undefined);
  assert.equal(applyForkProvenance([child], [entry])[0].parentSession, 'parent');
  assert.equal(applyForkProvenance([parent, { ...child, origin: 'subagent' }], [entry])[1].parentSession, undefined);
});

function observerFixture(store, fork) {
  const disposers = [];
  const listeners = [];
  const warnings = [];
  const controller = { typertRemote: { namespace: 'session' }, fork };
  const services = { sessionController: controller, sessions: { get: id => ({ header: id === 'child' ? child : parent }) } };
  const ctx = { get: key => services[key], on: (name, callback) => listeners.push(callback),
    effect(callback) { const dispose = callback(); if (typeof dispose === 'function') disposers.push(dispose); },
    logger: { warn: message => warnings.push(message) } };
  const tracking = observeOfficialForks({ ctx, store });
  return { controller, tracking, warnings, services, changed: () => tracking.refresh(),
    dispose: () => [...disposers].reverse().forEach(callback => callback()) };
}

test('official fork retains receiver, request and result and records only after success', async t => {
  const { store } = await storeFixture(t);
  const request = { sessionId: 'parent', atSeq: 3 };
  const result = { sessionId: 'child' };
  let receiver;
  const original = async function (input) { receiver = this; assert.equal(input, request); assert.equal((await store.load()).entries.length, 0); return result; };
  const f = observerFixture(store, original);
  assert.equal(await f.controller.fork(request), result);
  assert.equal(receiver, f.controller);
  assert.deepEqual((await store.load()).entries, [entry]);
  assert.equal(f.tracking.status(), 'active');
  f.dispose();
  assert.equal(f.controller.fork, original);
});

test('official fork rejection is preserved and creates no relation', async t => {
  const { store } = await storeFixture(t);
  const failure = new Error('official failure');
  const f = observerFixture(store, async () => { throw failure; });
  await assert.rejects(f.controller.fork({ sessionId: 'parent' }), error => error === failure);
  assert.deepEqual((await store.load()).entries, []);
  f.dispose();
});

test('record failure preserves a successful fork and reports degraded tracking', async () => {
  const result = { sessionId: 'child' };
  const f = observerFixture({ record: async () => { throw new Error('disk unavailable'); } }, async () => result);
  assert.equal(await f.controller.fork({ sessionId: 'parent' }), result);
  assert.equal(f.tracking.status(), 'degraded');
  assert.equal(f.warnings.length, 1);
  f.dispose();
});

test('service replacement is observed once and unloading preserves a later wrapper', async t => {
  const { store } = await storeFixture(t);
  const f = observerFixture(store, async () => ({ sessionId: 'child' }));
  const replacement = { typertRemote: { namespace: 'session' }, fork: async () => ({ sessionId: 'child' }) };
  f.services.sessionController = replacement;
  f.changed();
  const observed = replacement.fork;
  f.changed();
  assert.equal(replacement.fork, observed);
  replacement.fork = async input => observed(input);
  f.dispose();
  await replacement.fork({ sessionId: 'parent' });
  assert.deepEqual((await store.load()).entries, []);
});

test('unseeded or already linked children do not acquire extra provenance', async t => {
  const { store } = await storeFixture(t);
  for (const header of [{ ...child, isSeeded: false }, { ...child, parentSession: 'official' }]) {
    const f = observerFixture(store, async () => ({ sessionId: 'child' }));
    f.services.sessions.get = () => ({ header });
    await f.controller.fork({ sessionId: 'parent' });
    f.dispose();
  }
  assert.deepEqual((await store.load()).entries, []);
});

test('deleting a chat removes its record while retaining surviving child references', async t => {
  const { store } = await storeFixture(t);
  await store.record(entry);
  await store.record({ childId: 'grandchild', childCreatedAt: 30, parentId: 'child', parentCreatedAt: 20 });
  await store.remove(['child']);
  assert.deepEqual((await store.load()).entries.map(item => item.childId), ['grandchild']);
});

test('late service arrival and a fork settling after disposal remain safe', async t => {
  const { store } = await storeFixture(t);
  let finish;
  const f = observerFixture(store, () => new Promise(resolve => { finish = resolve; }));
  const pending = f.controller.fork({ sessionId: 'parent' });
  await new Promise(resolve => setImmediate(resolve));
  f.dispose();
  finish({ sessionId: 'child' });
  assert.deepEqual(await pending, { sessionId: 'child' });
  assert.deepEqual((await store.load()).entries, []);
});

test('plugin route reads recorded forks after restart through normal lifecycle', async t => {
  const { apply } = await import('../lib/index.js');
  const { EventEmitter } = await import('node:events');
  const root = await mkdtemp(join(tmpdir(), 'dac-provenance-route-'));
  const previous = process.env.DSH_HOME;
  process.env.DSH_HOME = root;
  const disposers = [];
  t.after(async () => {
    for (const dispose of disposers.reverse()) await dispose();
    if (previous === undefined) delete process.env.DSH_HOME;
    else process.env.DSH_HOME = previous;
    await rm(root, { recursive: true, force: true });
  });
  const routes = new Map();
  const headers = [parent, child];
  const services = {
    sessions: { get: id => ({ header: headers.find(header => header.id === id) }) },
    sessionController: { typertRemote: { namespace: 'session' }, fork: async () => ({ sessionId: 'child' }) },
    sessionPersistence: { list: async () => headers, inspect: async id => ({ meta: headers.find(header => header.id === id), events: [{ type: 'turn/start', data: {} }] }) },
    workspaceRegistry: { archivedSessionIds: ['child'], list: () => [] },
    webServer: { register({ path, handler }) { routes.set(path, handler); } },
  };
  const ctx = { get: key => services[key], on() {}, logger: { warn() {} }, effect(callback) {
    const dispose = callback(); if (typeof dispose === 'function') disposers.push(dispose);
  } };
  apply(ctx);
  await services.sessionController.fork({ sessionId: 'parent' });
  const originalHeader = child.parentSession;
  async function readGraph() {
    const req = new EventEmitter(); req.method = 'GET';
    let status; let body;
    await routes.get('/plugins/dsh-archived-chats/lineage')(req, { writeHead(code) { status = code; }, end(data) { body = JSON.parse(data); } });
    assert.equal(status, 200);
    return body;
  }
  let graph = await readGraph();
  assert.equal(graph.forkTrackingStatus, 'active');
  assert.equal(graph.roots[0].id, 'parent');
  assert.equal(graph.roots[0].children[0].id, 'child');
  assert.equal(child.parentSession, originalHeader);
  for (const dispose of disposers.splice(0).reverse()) await dispose();
  apply(ctx);
  graph = await readGraph();
  assert.equal(graph.roots[0].children[0].id, 'child');
  assert.equal(graph.provenanceStatus, 'ready');
  await writeFile(join(root, 'plugin-data', 'archived-chats', 'fork-provenance.json'), '{broken');
  graph = await readGraph();
  assert.equal(graph.provenanceStatus, 'unavailable');
  assert.deepEqual(graph.roots.map(node => [node.id, node.children.length]), [['parent', 0], ['child', 0]]);
});

test('observer works through real Cordis service proxies and restores prototype methods', async t => {
  const { Context, Service } = await import('@deepseek-ai/cordis');
  const { store } = await storeFixture(t);
  const ctx = new Context();
  class Controller extends Service {
    constructor(ctx) { super(ctx, 'sessionController'); this.typertRemote = { namespace: 'session' }; }
    async fork() { assert.equal(this.ctx.marker, 'caller'); return { sessionId: 'child' }; }
  }
  ctx.provide('sessions', { get: id => ({ header: id === 'child' ? child : parent }) });
  await ctx.plugin(Controller).await();
  t.after(() => ctx.fiber.dispose());
  const tracking = observeOfficialForks({ ctx, store });
  const caller = ctx.extend({ marker: 'caller' });
  await caller.get('sessionController').fork({ sessionId: 'parent' });
  assert.equal(tracking.status(), 'active');
  assert.deepEqual((await store.load()).entries, [entry]);
});

test('parent identity replacement during official fork is reported without connecting the replacement', async t => {
  const { store } = await storeFixture(t);
  let currentParent = parent;
  const f = observerFixture(store, async () => { currentParent = { ...parent, createdAt: 99 }; return { sessionId: 'child' }; });
  f.services.sessions.get = id => ({ header: id === 'child' ? child : currentParent });
  await f.controller.fork({ sessionId: 'parent' });
  assert.deepEqual((await store.load()).entries, []);
  assert.equal(f.tracking.status(), 'degraded');
  f.dispose();
});

test('record submission rechecks the child under the shared lifecycle lock', async t => {
  const { store } = await storeFixture(t);
  let release;
  let entered;
  const waiting = new Promise(resolve => { entered = resolve; });
  const blocked = new Promise(resolve => { release = resolve; });
  let present = true;
  const controller = { typertRemote: { namespace: 'session' }, fork: async () => ({ sessionId: 'child' }) };
  const disposers = [];
  const ctx = { get: () => controller, effect(callback) { const d = callback(); if (d) disposers.push(d); }, logger: { warn() {} } };
  observeOfficialForks({ ctx, store,
    readHeader: async id => id === 'parent' ? parent : present ? child : undefined,
    runExclusive: async callback => { entered(); await blocked; return callback(); } });
  const pending = controller.fork({ sessionId: 'parent' });
  await waiting;
  present = false;
  await store.remove(['child']);
  release();
  await pending;
  assert.deepEqual((await store.load()).entries, []);
  for (const dispose of disposers.reverse()) dispose();
});

test('child identity replacement while awaiting lifecycle lock never acquires the old source', async t => {
  const { store } = await storeFixture(t);
  let currentChild = child;
  const controller = { typertRemote: { namespace: 'session' }, fork: async () => ({ sessionId: 'child' }) };
  const disposers = [];
  const ctx = { get: () => controller, effect(callback) { const d = callback(); if (d) disposers.push(d); }, logger: { warn() {} } };
  const tracking = observeOfficialForks({ ctx, store,
    readHeader: async id => id === 'parent' ? parent : currentChild,
    runExclusive: async callback => { currentChild = { ...child, createdAt: 99 }; return callback(); } });
  await controller.fork({ sessionId: 'parent' });
  assert.deepEqual((await store.load()).entries, []);
  assert.equal(tracking.status(), 'degraded');
  for (const dispose of disposers.reverse()) dispose();
});
