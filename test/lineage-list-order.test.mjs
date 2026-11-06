import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
let definition;
vm.runInNewContext(await readFile(new URL('../lib/client.js', import.meta.url), 'utf8'), {
  Symbol, window: { __ModuleLoader__: { load(value) { definition = value; } } },
});
const { orderLineageListGroups, readLineageListOrder } = definition.factory(() => ({})).__test;
const node = (id, createdAt, children = []) => ({ id, createdAt, children, status: 'archived' });
const group = (key, roots) => ({ key, roots });

test('lineage follows official workspace order and recent session updates without changing its tree', () => {
  const groups = [group('a', [node('parent', 1, [node('child', 20)])]), group('ungrouped', [node('loose', 30)]), group('b', [node('b-chat', 2)])];
  const before = JSON.stringify(groups);
  const ordered = orderLineageListGroups(groups, { workspaces: [{ workspaceId: 'b' }, { workspaceId: 'a' }], summaries: { parent: { updatedAt: 100 }, child: { updatedAt: 50 } } });
  assert.equal(ordered.map(item => item.key).join(','), 'b,a,ungrouped');
  assert.equal(ordered[1].sessionOrder.join(','), 'parent,child');
  assert.equal(JSON.stringify(groups), before);
  assert.equal(ordered[1].roots, groups[0].roots);
});

test('lineage defaults to newest chats first with stable identity ties when summaries are unavailable', () => {
  const ordered = orderLineageListGroups([group('a', [node('old', 10, [node('z', 30), node('a', 30)])])]);
  assert.equal(ordered[0].sessionOrder.join(','), 'a,z,old');
});

test('lineage honors saved manual order and supplements it with the official pin and archive rules', () => {
  const ordered = orderLineageListGroups([group('a', [node('saved', 10), node('pin', 1), node('new', 30), node('archived', 40)])], {
    view: { orderBy: 'manual', sessionOrderByAccount: { a: ['gone', 'saved', 'saved'] } },
    pinnedSessionIds: ['pin'], archivedSessionIds: ['archived'],
  });
  assert.equal(ordered[0].sessionOrder.join(','), 'pin,saved,new,archived');
});

test('lineage reads the same official workspace, summary and viewing stores as the sidebar', () => {
  const view = { orderBy: 'manual' };
  const workspaces = { items: [{ workspaceId: 'b' }], pinnedSessionIds: ['pin'] };
  const summaries = { chat: { updatedAt: 99 } };
  const order = readLineageListOrder({
    get: name => ({ list: { getSnapshot: () => name === 'workspaces' ? workspaces : { byId: summaries } } }),
    slots: { entriesOfSlot: name => { assert.equal(name, 'sidebar.workspaces'); return [{ store: { create: () => ({ getSnapshot: () => view }) } }]; } },
  });
  assert.equal(order.workspaces, workspaces.items);
  assert.equal(order.summaries, summaries);
  assert.equal(order.view, view);
});
