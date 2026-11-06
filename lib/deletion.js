import { createHash, randomUUID } from 'node:crypto';
import { normalizeSessionId, resolveSubagentDescendants } from './session-graph.js';

export class DeletionError extends Error {
  constructor(code, message, status = 500, details = undefined) {
    super(message);
    this.name = 'DeletionError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const error = (code, message, status = 500, details) => new DeletionError(code, message, status, details);

function uniqueIds(ids) {
  return [...new Set((Array.isArray(ids) ? ids : []).filter((id) => typeof id === 'string' && id !== ''))];
}

function stableCode(cause, fallback = 'deletion-failed') {
  return typeof cause?.code === 'string' && cause.code !== '' ? cause.code : fallback;
}

function sessionIds(workspace) {
  const ids = workspace?.sessionIds;
  if (Array.isArray(ids)) return ids.map(String);
  if (ids instanceof Set) return [...ids].map(String);
  return [];
}

function extractTitle(events) {
  let title = null;
  for (const event of Array.isArray(events) ? events : []) {
    if (event?.type === 'session/title' && typeof event.data?.title === 'string' && event.data.title.trim() !== '') {
      title = event.data.title;
    }
  }
  return title;
}

function failure(id, cause) {
  return { id, reason: stableCode(cause) };
}

export function assertConfirmedDeletionScope(headers, scope) {
  const byId = new Map(headers.map(header => [header.id, header]));
  const allowed = new Set(scope.map(target => target.sessionId));
  for (const target of scope) {
    const header = byId.get(target.sessionId);
    if (header && header.createdAt !== target.createdAt) throw error('session-identity-changed', 'session identity changed', 409);
  }
  // Keep confirmed identities in the graph after their files disappear. Late
  // children of a removed parent must still invalidate the remaining scope.
  const graphHeaders = [...headers, ...scope.filter(target => !byId.has(target.sessionId))
    .map(target => ({ id: target.sessionId, createdAt: target.createdAt }))];
  const descendants = resolveSubagentDescendants(graphHeaders, [...allowed]);
  if ([...descendants].some(child => !allowed.has(child))) throw error('deletion-scope-changed', 'confirm the changed deletion scope', 409);
}

export function createDeletionService({ registry, persistence, metadataStore, taskStore, pendingStore,
  lifecycle, disposeLive, assertIdle, verifyPurgeScope, purgePhysical, invalidate, now = () => new Date() }) {
  if (typeof persistence?.list !== 'function' || typeof taskStore?.load !== 'function'
    || typeof lifecycle?.run !== 'function') throw new TypeError('deletion capabilities are required');

  // Short-lived response receipts let a disconnected client safely repeat the
  // same request. They never authorize deletion of a missing or reused ID.
  const completedRequests = new Map();
  function completedResult(key) {
    const receipt = completedRequests.get(key);
    if (!receipt) return null;
    if (now().getTime() - receipt.completedAt >= 10 * 60 * 1000) {
      completedRequests.delete(key);
      return null;
    }
    return structuredClone(receipt.result);
  }
  function rememberCompleted(key, result) {
    if (result.failed.length > 0 || result.pending.length > 0) return;
    completedRequests.set(key, { completedAt: now().getTime(), result: structuredClone(result) });
    if (completedRequests.size > 128) completedRequests.delete(completedRequests.keys().next().value);
  }

  async function loadedTasks() {
    const loaded = await taskStore.load();
    if (loaded.status !== 'ready') throw error('deletion-tasks-unavailable', 'deletion tasks are unavailable', 503);
    return loaded.records;
  }

  async function list() {
    return lifecycle.run(async () => {
      const records = await loadedTasks();
      const pending = await pendingStore?.load() ?? new Set();
      const missing = [...pending].filter(id => !records.has(id));
      if (missing.length > 0) {
        const headers = await headerInventory();
        for (const id of missing) {
          const header = headers.find(row => row.id === id);
          const workspace = registry.list?.().find(row => sessionIds(row).includes(id));
          await taskStore.put({ sessionId: id, taskId: randomUUID(), state: 'purge-pending', purgeRequestedAt: now().toISOString(),
            title: header?.title ?? null, createdAt: header?.createdAt ?? null, origin: header?.origin ?? null,
            workspace: workspace ? { id: String(workspace.id), title: workspace.title ?? null, path: workspace.path ?? null } : null });
        }
      }
      return [...(await loadedTasks()).values()];
    });
  }

  async function descriptor(id, { requireArchived = true } = {}) {
    // Validated unarchived chats and subagent descendants may skip archive membership.
    // They take the direct permanent-delete path; every
    // other step below and in `purgeOne` is shared with an archived session.
    if (requireArchived && !(registry.archivedSessionIds ?? []).map(String).includes(id)) {
      throw error('session-not-archived', 'session is not archived', 404);
    }
    const records = await loadedTasks();
    if (records.has(id)) throw error('session-deletion-pending', 'session deletion is pending', 409);
    const headers = await persistence.list();
    const header = (Array.isArray(headers) ? headers : []).find((item) => String(item?.id) === id);
    if (header === undefined) throw error('session-location-unavailable', 'session is unavailable', 404);
    let title = typeof header.title === 'string' ? header.title : null;
    if (typeof persistence.readTitle === 'function') {
      try { title = await persistence.readTitle(id) ?? title; }
      catch { /* The title is optional; deletion preflight still validates the session. */ }
    } else if (typeof persistence.inspect === 'function') {
      try { title = extractTitle((await persistence.inspect(id))?.events) ?? title; }
      catch { /* The title is optional; deletion preflight still validates the session. */ }
    }
    const workspace = (registry.list?.() ?? []).find((item) => sessionIds(item).includes(id));
    const metadata = await metadataStore.getMany([id]);
    if (metadata?.status !== 'ready') throw error('metadata-store-unavailable', 'metadata store is unavailable', 503);
    return {
      archive: {
        title,
        createdAt: Number.isFinite(header.createdAt) ? header.createdAt : null,
        origin: typeof header.origin === 'string' ? header.origin : null,
        workspace: workspace === undefined ? null : {
          id: String(workspace.id),
          title: typeof workspace.title === 'string' ? workspace.title : null,
          path: typeof workspace.path === 'string' ? workspace.path : null,
        },
      },
    };
  }

  async function purgeOne(id, cascadeEnabled = true) {
    if (typeof purgePhysical !== 'function' || typeof verifyPurgeScope !== 'function'
      || typeof persistence.locate !== 'function') {
      throw error('purge-unsupported', 'physical purge is unavailable', 501);
    }
    const recordBefore = (await loadedTasks()).get(id);
    if (recordBefore === undefined) throw error('deletion-task-missing', 'deletion task is missing', 404);
    const current = (await headerInventory()).find(header => header.id === id);
    if (current && current.createdAt !== recordBefore.createdAt) throw error(recordBefore.purgeRequireIdle ? 'unarchived-delete-changed' : 'session-identity-changed', 'session identity changed', 409);
    await verifyPurgeScope(id);
    let record = recordBefore;
    if (record.confirmedScope) await verifyConfirmedScope(record);
    if (record.purgeSelectedOnly === true) cascadeEnabled = false;
    // Persist the complete graph before the first directory disappears. The
    // parent intent remains until every child finishes, including after restart.
    if (cascadeEnabled) {
      const targets = new Set(record.confirmedScope
        ? record.confirmedScope.filter(target => target.sessionId !== id).map(target => target.sessionId)
        : record.cascadeSessionIds ?? []);
      const settled = new Set();
      for (let round = 0; ; round += 1) {
        if (round >= 16) throw error('cascade-inventory-unstable', 'subagent inventory keeps changing', 409);
        for (const target of [id, ...targets]) {
          if (settled.has(target)) continue;
          const disposition = await disposeLive?.(target, { requireIdle: record.purgeRequireIdle === true });
          if (disposition?.disposition === 'parked') throw error('session-live-purge-pending', 'live session remains parked', 409);
          settled.add(target);
        }
        // Cancelling a running parent can finish a spawn already in flight.
        // Inventory after quiescence captures it; settle new children in turn.
        if (record.confirmedScope) await verifyConfirmedScope(record);
        else for (const child of await cascadeTargets(id)) targets.add(child);
        if ([...targets].every(child => settled.has(child))) break;
      }
      record = await taskStore.setCascadeTargets(id, [...targets]);
    }
    await purgePhysical(id, record);
    let cascade = { deleted: [], pending: [], failed: [] };
    if (cascadeEnabled && record.cascadeSessionIds?.length > 0) {
      const headers = await headerInventory();
      const present = new Set(headers.map(header => header.id));
      const currentRecords = await loadedTasks();
      const targets = record.cascadeSessionIds.filter(child => present.has(child) || currentRecords.has(child));
      cascade = await purgeDirect(targets, { allowUnarchived: new Set(targets), cascadeEnabled: false,
        requireIdle: record.purgeRequireIdle === true, confirmedScope: record.confirmedScope });
      if (cascade.failed.length > 0) {
        throw error('cascade-purge-pending', 'subagent deletion requires retry', 409, { ...cascade, deleted: [id, ...cascade.deleted] });
      }
    }
    const removed = await taskStore.remove(id);
    if (!removed.includes(id)) throw error('deletion-task-conflict', 'deletion task changed during purge', 409);
    invalidate?.([id]);
    return [id, ...cascade.deleted];
  }

  async function headerInventory() {
    let headers;
    try { headers = await persistence.list(); }
    catch { throw error('session-inventory-unavailable', 'session inventory is unavailable', 503); }
    if (!Array.isArray(headers) || headers.some(header => typeof header?.id !== 'string' || header.id === '')) {
      throw error('session-inventory-unavailable', 'session inventory is invalid', 503);
    }
    const seen = new Set();
    for (const header of headers) {
      const key = normalizeSessionId(header.id);
      if (key === null || key === '' || seen.has(key)) throw error('session-inventory-unavailable', 'session identity is ambiguous', 503);
      seen.add(key);
    }
    return headers;
  }

  async function cascadeTargets(id) {
    const headers = await headerInventory();
    const records = await loadedTasks();
    return [...resolveSubagentDescendants(headers, [id], { preserveIds: [...records.keys()].filter(key => key !== id) })];
  }

  async function verifyConfirmedScope(record) {
    const headers = await headerInventory();
    assertConfirmedDeletionScope(headers, record.confirmedScope);
    for (const target of record.confirmedScope) {
      await verifyPurgeScope(target.sessionId);
      await assertIdle?.(target.sessionId);
    }
  }

  async function buildPlan(ids, { requireArchived = true, validate } = {}) {
    const selected = uniqueIds(ids).sort();
    if (selected.length === 0) throw error('sessionIds-required', 'select chats to delete', 400);
    await validate?.(selected);
    const headers = await headerInventory();
    const records = await loadedTasks();
    const pending = await pendingStore?.load() ?? new Set();
    const archived = new Set((registry.archivedSessionIds ?? []).map(String));
    const descendants = resolveSubagentDescendants(headers, selected);
    const targets = [...selected, ...[...descendants].filter(id => !selected.includes(id)).sort()].map(id => {
      const header = headers.find(row => row.id === id);
      if (!header || !Number.isSafeInteger(header.createdAt) || header.createdAt < 0) throw error('session-location-unavailable', 'session identity is unavailable', 409);
      if (records.has(id) || pending.has(id)) throw error('session-deletion-pending', 'session deletion is pending', 409);
      if (requireArchived && selected.includes(id) && !archived.has(id)) throw error('session-not-archived', 'session is not archived', 404);
      return { sessionId: id, createdAt: header.createdAt };
    });
    if (typeof assertIdle !== 'function' || typeof verifyPurgeScope !== 'function'
      || typeof purgePhysical !== 'function' || typeof persistence.locate !== 'function') {
      throw error('purge-unsupported', 'physical purge is unavailable', 501);
    }
    for (const target of targets) {
      await verifyPurgeScope(target.sessionId);
      await assertIdle?.(target.sessionId);
    }
    const state = targets.map(target => [target.sessionId, target.createdAt, archived.has(target.sessionId),
      (registry.list?.() ?? []).filter(workspace => sessionIds(workspace).includes(target.sessionId)).map(workspace => String(workspace.id)).sort()]);
    const fingerprint = createHash('sha256').update(JSON.stringify([selected, state])).digest('hex');
    return { sessionIds: selected, targets, selectedCount: selected.length,
      subagentCount: targets.length - selected.length, total: targets.length, fingerprint };
  }

  const preview = (ids, options) => lifecycle.run(() => buildPlan(ids, options));

  async function remove(ids, options = {}) {
    return lifecycle.run(async () => {
      if (typeof options.fingerprint !== 'string' || options.fingerprint === '') {
        throw error('deletion-confirmation-required', 'preview and confirm the deletion scope', 400);
      }
      const key = JSON.stringify(['delete', uniqueIds(ids).sort(), options.requireArchived !== false,
        options.fingerprint, options.confirmationKey ?? null]);
      const completed = completedResult(key);
      if (completed) return completed;
      const plan = await buildPlan(ids, options);
      if (options.fingerprint !== plan.fingerprint) {
        throw error('deletion-scope-changed', 'confirm the changed deletion scope', 409);
      }
      const result = await purgeDirect(plan.sessionIds, { allowUnarchived: new Set(plan.sessionIds), requireIdle: true,
        confirmedScope: plan.targets, validate: options.validate });
      rememberCompleted(key, result);
      return result;
    });
  }

  // Called only with the lifecycle lock held. Retry existing durable intent,
  // rather than replacing it and losing a previously captured descendant set.
  async function purgeDirect(ids, { allowUnarchived = new Set(), cascadeEnabled = true, validate, requireIdle = false, confirmedScope } = {}) {
    const deleted = [];
    const pending = [];
    const failed = [];
    for (const id of uniqueIds(ids)) {
      if (deleted.includes(id)) continue;
      try {
        const existing = (await loadedTasks()).get(id);
        if (existing === undefined) {
          if (typeof purgePhysical !== 'function' || typeof verifyPurgeScope !== 'function'
            || typeof persistence.locate !== 'function') throw error('purge-unsupported', 'physical purge is unavailable', 501);
          const source = await descriptor(id, { requireArchived: !allowUnarchived.has(id) });
          await verifyPurgeScope(id);
          await validate?.([id]);
          let scope;
          if (confirmedScope) {
            const descendants = cascadeEnabled ? await cascadeTargets(id) : [];
            const scopeIds = new Set([id, ...descendants]);
            scope = cascadeEnabled ? confirmedScope.filter(target => scopeIds.has(target.sessionId)) : confirmedScope;
            if ([...scopeIds].some(target => !scope.some(row => row.sessionId === target))
              || scope.find(target => target.sessionId === id)?.createdAt !== source.archive.createdAt) {
              throw error('deletion-scope-changed', 'confirm the changed deletion scope', 409);
            }
          }
          const at = now().toISOString();
          await taskStore.put({
            sessionId: id, taskId: randomUUID(), state: 'purge-pending', purgeRequestedAt: at,
            ...source.archive,
            ...(!cascadeEnabled ? { purgeSelectedOnly: true } : {}),
            ...(requireIdle ? { purgeRequireIdle: true } : {}),
            ...(scope ? { confirmedScope: scope } : {}),
          });
          invalidate?.([id]);
        }
        deleted.push(...await purgeOne(id, cascadeEnabled));
      } catch (cause) {
        failed.push(failure(id, cause));
        if ((await taskStore.get(id))?.state === 'purge-pending') pending.push(id);
        if (cause?.details?.failed) {
          failed.push(...cause.details.failed);
          pending.push(...cause.details.pending);
          deleted.push(...cause.details.deleted);
        }
      }
    }
    const records = await loadedTasks();
    const retryTargets = [...new Set(pending)].filter(id => records.has(id))
      .map(id => ({ sessionId: id, taskId: records.get(id).taskId }));
    return { deleted: [...new Set(deleted)], pending: [...new Set(pending)], failed, retryTargets };
  }

  async function legacyRemove(ids, options) {
    try { return await remove(ids, options); }
    catch (cause) {
      if (cause?.status === 503) throw cause;
      return { deleted: [], pending: [], failed: uniqueIds(ids).map(id => failure(id, cause)), retryTargets: [] };
    }
  }
  const deleteArchived = (ids, options) => legacyRemove(ids, options);

  async function retry(targets) {
    return lifecycle.run(async () => {
      if (!Array.isArray(targets) || targets.length === 0 || targets.some(target => typeof target?.sessionId !== 'string' || target.sessionId === ''
        || typeof target.taskId !== 'string' || target.taskId === '')) throw error('deletion-task-missing', 'deletion task is missing', 409);
      const key = JSON.stringify(['retry', targets.map(target => [target.sessionId, target.taskId]).sort()]);
      const completed = completedResult(key);
      if (completed) return completed;
      const records = await loadedTasks();
      if (targets.some(target => records.get(target.sessionId)?.taskId !== target.taskId)) throw error('deletion-task-missing', 'deletion task is missing', 409);
      const result = await purgeDirect(targets.map(target => target.sessionId));
      rememberCompleted(key, result);
      return result;
    });
  }

  async function deleteUnarchived(ids, validate, options = {}) {
    if (typeof validate !== 'function') throw error('unarchived-validation-required', 'unarchived validation is required', 409);
    await validate(uniqueIds(ids));
    return legacyRemove(ids, { ...options, requireArchived: false, validate });
  }

  return Object.freeze({ list, retry, preview, remove, deleteArchived, deleteUnarchived });
}
