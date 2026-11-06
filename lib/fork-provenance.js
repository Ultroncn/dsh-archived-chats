import { readFile } from 'node:fs/promises';
import { atomicWriteFile } from './durable.js';

const WRITE_QUEUES = new Map();
const ORIGINAL = Symbol.for('cordis.original');
const validId = value => typeof value === 'string' && value.trim() !== '' && value.length <= 1024;
const validTime = value => Number.isSafeInteger(value) && value >= 0;
const unavailable = () => Object.assign(new Error('fork provenance catalog is unavailable'), { code: 'fork-provenance-unavailable' });

function validateEntry(value) {
  if (!value || !validId(value.childId) || !validId(value.parentId) || value.childId === value.parentId
    || !validTime(value.childCreatedAt) || !(value.parentCreatedAt === null || validTime(value.parentCreatedAt))) {
    throw unavailable();
  }
  return { childId: value.childId, childCreatedAt: value.childCreatedAt,
    parentId: value.parentId, parentCreatedAt: value.parentCreatedAt };
}

/** Plugin-owned relations, serialized across instances sharing the same catalog. */
export function createForkProvenanceStore({ filePath }) {
  async function load() {
    try {
      const value = JSON.parse(await readFile(filePath, 'utf8'));
      if (value?.version !== 1 || !Array.isArray(value.entries)) throw unavailable();
      const entries = value.entries.map(validateEntry);
      if (new Set(entries.map(entry => entry.childId)).size !== entries.length) throw unavailable();
      return { status: 'ready', entries };
    } catch (error) {
      return { status: error?.code === 'ENOENT' ? 'ready' : 'unavailable', entries: [] };
    }
  }
  function mutate(change) {
    const previous = WRITE_QUEUES.get(filePath) ?? Promise.resolve();
    const operation = previous.then(async () => {
      const loaded = await load();
      if (loaded.status !== 'ready') throw unavailable();
      const entries = new Map(loaded.entries.map(item => [item.childId, item]));
      if (!change(entries)) return;
      await atomicWriteFile(filePath, `${JSON.stringify({ version: 1, entries: [...entries.values()] }, null, 2)}\n`, { encoding: 'utf8' });
    });
    const settled = operation.catch(() => undefined);
    WRITE_QUEUES.set(filePath, settled);
    void settled.then(() => {
      if (WRITE_QUEUES.get(filePath) === settled) WRITE_QUEUES.delete(filePath);
    });
    return operation;
  }
  return {
    load,
    async assertReadable() {
      if ((await load()).status !== 'ready') throw unavailable();
    },
    record(input) {
      return mutate(entries => {
        const entry = validateEntry(input);
        const old = entries.get(entry.childId);
        if (old?.childCreatedAt === entry.childCreatedAt) {
          if (old.parentId !== entry.parentId || old.parentCreatedAt !== entry.parentCreatedAt) throw unavailable();
          return false;
        }
        entries.set(entry.childId, entry);
        return true;
      });
    },
    remove(ids) {
      return mutate(entries => {
        let changed = false;
        for (const id of ids) changed = entries.delete(String(id)) || changed;
        return changed;
      });
    },
  };
}

/** Overlay only identities that still match the recorded creation metadata. */
export function applyForkProvenance(headers, entries) {
  const byId = new Map(headers.map(header => [header.id, header]));
  const relations = new Map(entries.map(entry => [entry.childId, entry]));
  return headers.map(header => {
    const entry = relations.get(header.id);
    if (!entry || header.version !== 4 || header.isSeeded !== true || header.parentSession
      || header.origin === 'subagent' || entry.childCreatedAt !== header.createdAt) return header;
    const parent = byId.get(entry.parentId);
    if (parent && (entry.parentCreatedAt === null || parent.createdAt !== entry.parentCreatedAt)) return header;
    return { ...header, parentSession: entry.parentId };
  });
}

/**
 * Compatibility observer for the verified sessionController.fork(request) contract.
 * The original creates the Session. Recording runs only after it succeeds, and
 * its failures never turn an already-created official fork into a failed call.
 */
export function observeOfficialForks({ ctx, store, readHeader = async id => ctx.get('sessions')?.get(id)?.header, runExclusive = operation => operation() }) {
  const observed = new WeakMap();
  let disposed = false;
  let failed = false;
  const rawController = () => {
    const service = ctx.get('sessionController');
    return service?.[ORIGINAL] ?? service;
  };
  function install() {
    const controller = rawController();
    if (disposed || !controller || observed.has(controller)
      || controller.typertRemote?.namespace !== 'session' || typeof controller.fork !== 'function') return;
    ctx.effect(() => {
      const own = Object.getOwnPropertyDescriptor(controller, 'fork');
      const original = controller.fork;
      async function fork(request, ...args) {
        // Snapshot before awaiting: callers may reuse or mutate their input object.
        const parentId = request?.sessionId;
        let parentBefore;
        try { if (validId(parentId)) parentBefore = await readHeader(parentId); }
        catch { /* The official call still owns its failure semantics. */ }
        const parentCreatedAt = parentBefore?.createdAt;
        const result = await original.call(this, request, ...args);
        if (disposed || !validId(parentId) || !validId(result?.sessionId) || result.sessionId === parentId) return result;
        try {
          const childBefore = await readHeader(result.sessionId);
          if (!childBefore || childBefore.id !== result.sessionId || childBefore.version !== 4
            || childBefore.isSeeded !== true || childBefore.parentSession || childBefore.origin === 'subagent') return result;
          const childCreatedAt = childBefore.createdAt;
          await runExclusive(async () => {
            if (disposed) return;
            if (request?.sessionId !== parentId) throw unavailable();
            const child = await readHeader(result.sessionId);
            if (!child || child.id !== result.sessionId || child.version !== 4 || child.isSeeded !== true
              || child.parentSession || child.origin === 'subagent') return;
            if (!validTime(childCreatedAt) || child.createdAt !== childCreatedAt) throw unavailable();
            const parent = await readHeader(parentId);
            if (parentBefore?.id !== parentId || !validTime(parentCreatedAt)
              || (parent && (parent.id !== parentId || parent.createdAt !== parentCreatedAt))) throw unavailable();
            if (disposed) return;
            await store.record({ childId: child.id, childCreatedAt: child.createdAt, parentId, parentCreatedAt });
          });
        } catch {
          failed = true;
          ctx.logger.warn('archived-chats: fork source could not be recorded (fork-provenance-unavailable)');
        }
        return result;
      }
      try {
        Object.defineProperty(controller, 'fork', { configurable: true, writable: true, value: fork });
      } catch {
        failed = true;
        ctx.logger.warn('archived-chats: official fork tracking could not be attached');
        return;
      }
      observed.set(controller, fork);
      return () => {
        if (controller.fork !== fork) return;
        if (own) Object.defineProperty(controller, 'fork', own);
        else delete controller.fork;
      };
    }, 'archived-chats: official fork observer');
  }
  ctx.effect(() => () => { disposed = true; }, 'archived-chats: fork observer lifetime');
  install();
  return { refresh: install, status() {
    if (failed) return 'degraded';
    const current = rawController();
    return !disposed && current && observed.has(current) && current.fork === observed.get(current) ? 'active' : 'unsupported';
  } };
}
