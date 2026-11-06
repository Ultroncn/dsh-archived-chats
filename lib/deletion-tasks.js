import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { atomicWriteFile } from './durable.js';

const WRITE_QUEUES = new Map();
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const FIELDS = new Set(['taskId', 'sessionId', 'state', 'purgeRequestedAt', 'title', 'createdAt', 'origin', 'workspace',
  'cascadeSessionIds', 'purgeSelectedOnly', 'purgeRequireIdle', 'confirmedScope']);
const unavailable = () => Object.assign(new Error('deletion tasks are unavailable'), { code: 'deletion-tasks-unavailable', status: 503 });
const conflict = () => Object.assign(new Error('deletion task changed'), { code: 'deletion-task-conflict', status: 409 });
const validId = id => typeof id === 'string' && id !== '' && !UNSAFE_KEYS.has(id);
const validTime = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const nullableString = value => value === null || typeof value === 'string';

function normalize(input, id) {
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).some(key => !FIELDS.has(key)) || !validId(id) || input.sessionId !== id || !validId(input.taskId)
    || input.state !== 'purge-pending' || !validTime(input.purgeRequestedAt)
    || !nullableString(input.title) || !nullableString(input.origin)
    || !(input.createdAt === null || Number.isSafeInteger(input.createdAt) && input.createdAt >= 0)) throw unavailable();
  const workspace = input.workspace;
  if (workspace !== null && (!workspace || typeof workspace !== 'object' || Array.isArray(workspace)
    || Object.keys(workspace).sort().join(',') !== 'id,path,title' || !validId(workspace.id)
    || !nullableString(workspace.title) || !nullableString(workspace.path))) throw unavailable();
  if ('purgeSelectedOnly' in input && input.purgeSelectedOnly !== true) throw unavailable();
  if ('purgeRequireIdle' in input && (input.purgeRequireIdle !== true || !(input.purgeSelectedOnly || input.confirmedScope))) throw unavailable();
  if ('confirmedScope' in input && (!Array.isArray(input.confirmedScope) || input.confirmedScope.length === 0
    || input.confirmedScope.length > 100000 || new Set(input.confirmedScope.map(target => target?.sessionId)).size !== input.confirmedScope.length
    || !input.confirmedScope.some(target => target?.sessionId === id && target.createdAt === input.createdAt)
    || input.confirmedScope.some(target => !target || Object.keys(target).sort().join(',') !== 'createdAt,sessionId'
      || !validId(target.sessionId) || !Number.isSafeInteger(target.createdAt) || target.createdAt < 0))) throw unavailable();
  if ('cascadeSessionIds' in input && (!Array.isArray(input.cascadeSessionIds)
    || input.cascadeSessionIds.length > 100000 || new Set(input.cascadeSessionIds).size !== input.cascadeSessionIds.length
    || input.cascadeSessionIds.some(child => !validId(child) || child === id)
    || input.purgeSelectedOnly && input.cascadeSessionIds.length > 0)) throw unavailable();
  return structuredClone(input);
}

export function createDeletionTaskStore({ path, previousPath }) {
  const filePath = resolve(path);
  async function load() {
    try {
      let value;
      try { value = JSON.parse(await readFile(filePath, 'utf8')); }
      catch (error) {
        if (error.code !== 'ENOENT') throw error;
        // Carry forward only committed permanent-deletion tasks. Old recovery
        // records and snapshot files are left on disk without being activated.
        let previous;
        try { previous = previousPath ? JSON.parse(await readFile(previousPath, 'utf8')) : undefined; }
        catch (cause) { if (cause.code !== 'ENOENT') throw cause; }
        if (previous !== undefined && (!previous || previous.version !== 1 || !previous.records || typeof previous.records !== 'object' || Array.isArray(previous.records))) throw unavailable();
        const records = Object.create(null);
        for (const [id, record] of Object.entries(previous?.records ?? {})) {
          if (record?.state !== 'purge-pending') continue;
          const task = Object.fromEntries(Object.entries(record).filter(([key]) => FIELDS.has(key)));
          task.taskId = createHash('sha256').update(JSON.stringify([id, task.createdAt, task.purgeRequestedAt])).digest('hex');
          records[id] = normalize(task, id);
        }
        value = { version: 1, records };
      }
      if (!value || Object.keys(value).sort().join(',') !== 'records,version' || value.version !== 1
        || !value.records || typeof value.records !== 'object' || Array.isArray(value.records)) throw unavailable();
      return { status: 'ready', records: new Map(Object.entries(value.records).map(([id, record]) => [id, normalize(record, id)])) };
    } catch { return { status: 'unavailable', records: new Map() }; }
  }
  async function mutate(operation) {
    const previous = WRITE_QUEUES.get(filePath) ?? Promise.resolve();
    const result = previous.then(async () => {
      const loaded = await load();
      if (loaded.status !== 'ready') throw unavailable();
      const result = operation(loaded.records);
      const records = Object.fromEntries(loaded.records);
      await atomicWriteFile(filePath, `${JSON.stringify({ version: 1, records }, null, 2)}\n`, { encoding: 'utf8' });
      return result;
    });
    const settled = result.catch(() => undefined);
    WRITE_QUEUES.set(filePath, settled);
    settled.then(() => { if (WRITE_QUEUES.get(filePath) === settled) WRITE_QUEUES.delete(filePath); });
    return result;
  }
  return {
    load,
    async get(id) {
      const loaded = await load();
      if (loaded.status !== 'ready') throw unavailable();
      return loaded.records.get(String(id)) ?? null;
    },
    put(input) {
      return mutate(records => {
        const record = normalize(input, input?.sessionId);
        if (records.has(record.sessionId)) throw conflict();
        records.set(record.sessionId, record);
        return structuredClone(record);
      });
    },
    setCascadeTargets(id, ids) {
      return mutate(records => {
        const current = records.get(id);
        if (!current) throw conflict();
        const next = normalize({ ...current, cascadeSessionIds: [...new Set([...(current.cascadeSessionIds ?? []), ...ids])] }, id);
        records.set(id, next);
        return structuredClone(next);
      });
    },
    remove(ids) {
      return mutate(records => (Array.isArray(ids) ? ids : [ids]).filter(id => records.delete(id)));
    },
  };
}
