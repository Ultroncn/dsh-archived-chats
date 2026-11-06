import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

let definition;
vm.runInNewContext(await readFile(new URL('../lib/client.js', import.meta.url), 'utf8'), {
  window: { __ModuleLoader__: { load(value) { definition = value; } } }, Symbol,
});
const exports = definition.factory(() => ({}));
const { preserveArchiveSettings } = exports.__test;

function fixture({ activeId = 'archived-chats', open = true } = {}) {
  let state = { activeId, open };
  const listeners = new Set();
  const events = new Map();
  const frames = new Map();
  let nextFrame = 0;
  let restores = 0;
  const notify = () => { for (const listener of [...listeners]) listener(); };
  const shell = {
    getSnapshot: () => state,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    actions: {
      close() { state = { open: false, activeId: undefined }; notify(); },
      openSection(id) { restores++; state = { open: true, activeId: id }; notify(); },
      select(id) { state = { open: true, activeId: id }; notify(); },
    },
  };
  const slots = { entriesOfSlot: () => [{ store: { create: () => shell } }] };
  const target = {
    addEventListener(type, listener) { events.set(type, listener); },
    removeEventListener(type, listener) { if (events.get(type) === listener) events.delete(type); },
  };
  const options = { target,
    requestFrame(callback) { frames.set(++nextFrame, callback); return nextFrame; },
    cancelFrame(id) { frames.delete(id); },
  };
  const frame = () => { const callbacks = [...frames.values()]; frames.clear(); for (const callback of callbacks) callback(); };
  return { shell, slots, options, frame, listeners, events, frames, state: () => state,
    input(type, fields = {}) { events.get(type)?.({ type, ...fields }); }, restores: () => restores };
}

test('archive interaction restores a settings close caused by Host navigation', () => {
  const f = fixture();
  const interaction = preserveArchiveSettings(f.slots, f.options);
  f.shell.actions.close();
  assert.deepEqual(f.state(), { open: true, activeId: 'archived-chats' });
  assert.equal(f.restores(), 1);
  interaction.finish();
  f.frame();
  f.shell.actions.close();
  assert.equal(f.state().open, true, 'late Host effects in the settling frame are protected');
  f.frame();
  f.shell.actions.close();
  assert.equal(f.state().open, false, 'completed operations release protection');
  assert.equal(f.listeners.size, 0);
  assert.equal(f.events.size, 0);
});

for (const type of ['pointerdown', 'click', 'keydown']) {
  test(`explicit ${type} releases archive protection before the user closes settings`, () => {
    const f = fixture();
    const interaction = preserveArchiveSettings(f.slots, f.options);
    f.input(type);
    f.shell.actions.close();
    assert.equal(f.state().open, false);
    assert.equal(f.restores(), 0);
    interaction.finish(); interaction.dispose();
    assert.equal(f.listeners.size, 0);
    assert.equal(f.events.size, 0);
    assert.equal(f.frames.size, 0);
  });
}

test('switching settings sections releases archive protection', () => {
  const f = fixture();
  const interaction = preserveArchiveSettings(f.slots, f.options);
  f.shell.actions.select('general');
  f.shell.actions.close();
  assert.equal(f.state().open, false);
  assert.equal(f.restores(), 0);
  interaction.dispose();
});

test('repeated archive-page clicks and typing do not release an in-flight transaction', () => {
  const f = fixture();
  const input = {};
  const content = { contains: target => target === input };
  const interaction = preserveArchiveSettings(f.slots, { ...f.options, content });
  f.input('pointerdown', { target: input });
  f.input('click', { target: input });
  f.input('keydown', { target: input, key: 'a' });
  f.shell.actions.close();
  assert.equal(f.state().open, true);
  assert.equal(f.restores(), 1);
  interaction.dispose();
});

for (const backdrop of [false, true]) {
  test(`official plugin modal ${backdrop ? 'backdrop' : 'content'} stays inside the archive interaction`, () => {
    const f = fixture();
    const modal = {};
    const input = { closest(selector) {
      if (selector === '[data-shortcut-modal="dsh-archived-chats"]') return backdrop ? null : modal;
      if (selector === '[role="presentation"]') return { querySelector: () => modal };
      return null;
    } };
    const interaction = preserveArchiveSettings(f.slots, { ...f.options, content: { contains: () => false } });
    f.input('pointerdown', { target: input });
    f.input('click', { target: input });
    f.shell.actions.close();
    assert.equal(f.state().open, true);
    interaction.dispose();
  });
}

for (const key of [{ key: 'Escape' }, { key: ',', metaKey: true }, { key: ',', ctrlKey: true }]) {
  test(`explicit dismissal shortcut releases protection inside the archive page (${JSON.stringify(key)})`, () => {
    const f = fixture();
    const interaction = preserveArchiveSettings(f.slots, { ...f.options, content: { contains: () => true } });
    f.input('keydown', key);
    f.shell.actions.close();
    assert.equal(f.state().open, false);
    interaction.dispose();
  });
}

test('disposal cancels pending frames and removes listeners', () => {
  const f = fixture();
  const interaction = preserveArchiveSettings(f.slots, f.options);
  interaction.finish();
  interaction.dispose();
  f.shell.actions.close();
  assert.equal(f.state().open, false);
  assert.equal(f.listeners.size, 0);
  assert.equal(f.events.size, 0);
  assert.equal(f.frames.size, 0);
});

for (const initial of [{ activeId: 'general', open: true }, { activeId: 'archived-chats', open: false }]) {
  test(`archive protection only owns an open archive section (${JSON.stringify(initial)})`, () => {
    const f = fixture(initial);
    const interaction = preserveArchiveSettings(f.slots, f.options);
    assert.equal(f.listeners.size, 0);
    assert.equal(f.events.size, 0);
    f.shell.actions.close();
    assert.equal(f.state().open, false);
    interaction.finish(); interaction.dispose();
  });
}

test('older Hosts without a settings state source retain normal archive behavior', () => {
  const interaction = preserveArchiveSettings({ entriesOfSlot: () => [] }, { target: {} });
  interaction.finish(); interaction.dispose();
});
