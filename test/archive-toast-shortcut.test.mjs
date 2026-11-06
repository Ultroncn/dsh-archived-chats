import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

let definition;
const jsx = (type, props) => ({ type, props });
vm.runInNewContext(await readFile(new URL('../lib/client.js', import.meta.url), 'utf8'), {
  window: { __ModuleLoader__: { load(value) { definition = value; } } },
  Symbol,
});
const exports = definition.factory(name => name === 'react/jsx-runtime' ? { jsx, jsxs: jsx } : {});
const { createArchiveViewNavigation, registerArchiveToastShortcut } = exports.__test;

function fixture() {
  const entries = [];
  const listeners = new Set();
  const changes = [];
  let disposed = false;
  const shell = { actions: { openSection: id => changes.push(['open', id]) } };
  const store = { create: () => shell };
  const notify = () => { for (const listener of listeners) listener(); };
  const slots = {
    inject(name, callback) { assert.equal(name, 'workspace.toast'); return callback(); },
    entries() { return [...entries].sort((a, b) => (a.options.priority ?? 0) - (b.options.priority ?? 0)); },
    entriesOfSlot(name) { assert.equal(name, 'sidebar.settings'); return disposed ? [] : [{ store }]; },
    subscribe(name, callback) { listeners.add(callback); return () => listeners.delete(callback); },
    register(options, component) {
      const entry = { component, options: { key: options.key, priority: options.priority }, store: options.store, locale: options.locale, inject: options.inject };
      assert(!entries.some(item => item.options.key === options.key && (item.options.priority ?? 0) === options.priority));
      entries.push(entry); notify();
      return () => { const index = entries.indexOf(entry); if (index >= 0) { entries.splice(index, 1); notify(); } };
    },
  };
  function addOfficial(key) {
    const component = function OfficialArchiveToast(props) { return props; };
    const entry = { options: { key }, component, store: { create() {} }, locale: 'workspace', inject: () => ({ original: true }) };
    entries.push(entry); notify();
    return entry;
  }
  return { slots, changes, listeners, addOfficial, entries, removeSettings() { disposed = true; },
    selected: key => slots.entries().find(item => item.options.key === key) };
}

test('View augments the official archive notice and opens Archive Management', () => {
  const f = fixture();
  const original = f.addOfficial('archived');
  const undo = () => f.changes.push(['undo']);
  let dismissed = 0;
  const display = () => ({ text: '会话已归档，可', tone: 'success', holdMs: 6000, actions: [{ label: '撤销', onClick: undo }] });
  const navigation = createArchiveViewNavigation();
  const cleanup = registerArchiveToastShortcut({ slots: f.slots }, () => '查看', navigation);
  const selected = f.selected('archived');
  assert.equal(selected.store, original.store);
  assert.equal(selected.inject, original.inject);
  assert.equal(selected.locale, original.locale);
  const wrapped = selected.component({ display, dismissToast: () => { dismissed++; }, seq: 7 });
  assert.equal(wrapped.type, original.component);
  assert.equal(wrapped.props.seq, 7);
  const fields = wrapped.props.display();
  assert.equal(fields.text, '会话已归档，可');
  assert.equal(fields.holdMs, 6000);
  assert.equal(fields.actions.length, 2);
  assert.equal(fields.actions[0].onClick, undo);
  assert.equal(fields.actions[1].label, '查看');
  assert.equal(display().actions.length, 1);
  fields.actions[1].onClick();
  assert.deepEqual(f.changes, [['open', 'archived-chats']]);
  assert.equal(dismissed, 1);
  assert.equal(navigation.consume(), true);
  assert.equal(navigation.consume(), false);
  cleanup();
  assert.equal(f.selected('archived'), original);
  assert.equal(f.listeners.size, 0);
});

test('late official registrations, replacement and stopped-and-archived notices receive View', () => {
  const f = fixture();
  const cleanup = registerArchiveToastShortcut({ slots: f.slots }, () => 'View', createArchiveViewNavigation());
  const first = f.addOfficial('archived');
  assert.notEqual(f.selected('archived'), first);
  const stopped = f.addOfficial('stoppedAndArchived');
  assert.notEqual(f.selected('stoppedAndArchived'), stopped);
  f.entries.splice(f.entries.indexOf(first), 1);
  const replacement = f.addOfficial('archived');
  assert.equal(f.selected('archived').inject, replacement.inject);
  cleanup();
  assert.equal(f.selected('archived'), replacement);
  assert.equal(f.selected('stoppedAndArchived'), stopped);
});

test('unrelated notices and hosts without the required slot APIs keep their own presentation', () => {
  const f = fixture();
  const unrelated = f.addOfficial('pinFailed');
  const original = f.addOfficial('archived');
  const cleanup = registerArchiveToastShortcut({ slots: f.slots }, () => 'View', createArchiveViewNavigation());
  assert.equal(f.selected('pinFailed'), unrelated);
  f.removeSettings();
  const display = () => ({ actions: [] });
  const tree = f.selected('archived').component({ display });
  assert.equal(tree.type, original.component);
  assert.equal(tree.props.display, display);
  cleanup();
  assert.equal(registerArchiveToastShortcut({ slots: {} }, () => 'View', createArchiveViewNavigation()), undefined);
});

test('navigation requests reach an already mounted page and survive until a later mount', () => {
  const navigation = createArchiveViewNavigation();
  let viewed = 0;
  const unsubscribe = navigation.subscribe(() => { if (navigation.consume()) viewed++; });
  navigation.request();
  assert.equal(viewed, 1);
  unsubscribe();
  navigation.request();
  assert.equal(viewed, 1);
  assert.equal(navigation.consume(), true);
});

test('unarchived deletion confirms one identity-bound batch and preserves partial results', async () => {
  const calls = [];
  const send = async (path, body) => {
    calls.push({ path, body });
    if (path.endsWith('/preview')) return { plan: { fingerprint: 'confirmed-scope',
      selectedCount: 3, subagentCount: 0, total: 3, targets: body.sessions } };
    return { deleted: ['one', 'three'], pending: ['two'], failed: [{ id: 'two', reason: 'disk-busy' }] };
  };
  const preview = await exports.__test.previewDeletion([
    { id: 'one', createdAt: 1 }, { id: 'two', createdAt: 2 }, { id: 'three', createdAt: 3 },
  ], 'unarchived', send);
  const result = await exports.__test.executeDeletion(preview, send);
  assert.deepEqual(result.deleted, ['one', 'three']);
  assert.deepEqual(result.pending, ['two']);
  assert.equal(result.failed[0].reason, 'disk-busy');
  assert.equal(calls.length, 2);
  assert.equal(calls[0].path, '/deletion/preview');
  assert.equal(calls[1].path, '/deletion/execute');
  assert.equal(calls[1].body.fingerprint, 'confirmed-scope');
  assert.equal(calls[1].body.permanent, true);
  assert.equal(calls[1].body.source, 'unarchived');
  assert.deepEqual(JSON.parse(JSON.stringify(calls[1].body.sessions)), [
    { sessionId: 'one', createdAt: 1, workspaceId: null },
    { sessionId: 'two', createdAt: 2, workspaceId: null },
    { sessionId: 'three', createdAt: 3, workspaceId: null },
  ]);
});
