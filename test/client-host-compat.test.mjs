import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

const moduleRoot = process.env.DSH_CLIENT_MODULE_ROOT;
const skip = !moduleRoot && 'Run scripts/check-client-host.mjs with a pinned client fixture';
let host;

if (moduleRoot) {
  const root = resolve(moduleRoot);
  const { registerHooks } = await import('node:module');
  // rc.5 publishes CSS module imports. Node supplies class names for semantic
  // rendering only; this test deliberately makes no layout or browser claim.
  const hooks = registerHooks({
    load(url, context, nextLoad) {
      if (url.endsWith('.css')) {
        readFileSync(new URL(url), 'utf8');
        return { format: 'module', shortCircuit: true,
          source: 'export default new Proxy({}, { get: (_, key) => String(key) });' };
      }
      return nextLoad(url, context);
    },
  });
  test.after(() => hooks.deregister());
  const require = createRequire(join(root, '__client-contract.cjs'));
  const native = name => import(pathToFileURL(join(root, '@deepseek-ai', name, 'lib/index.js')).href);
  const [cordis, slots, primitives, store] = await Promise.all([
    native('cordis'), native('dsh-client-ui-slots'), native('dsh-client-ui-primitives'), native('dsh-client-store'),
  ]);
  const modules = new Map([
    ['@deepseek-ai/cordis', cordis], ['@deepseek-ai/dsh-client-ui-slots', slots],
    ['@deepseek-ai/dsh-client-ui-primitives', primitives], ['@deepseek-ai/dsh-client-store', store],
    ...['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'].map(name => [name, require(name)]),
  ]);
  const evaluate = async (path, target) => {
    const styles = new Map();
    vm.runInNewContext(await readFile(path, 'utf8'), {
      window: { __ModuleLoader__: target },
      navigator: { language: 'en', languages: ['en'] },
      document: { body: null, querySelector: () => null, querySelectorAll: () => [],
        getElementById: id => styles.get(id) ?? null,
        createElement: () => ({ dataset: {}, setAttribute() {}, remove() { styles.delete(this.id); } }),
        head: { appendChild(node) { styles.set(node.id, node); } } },
      Symbol, console, setTimeout, clearTimeout, queueMicrotask,
    }, { filename: path });
  };
  const load = async path => {
    let definition;
    await evaluate(path, { load(value) { definition = value; } });
    assert.equal(typeof definition?.factory, 'function', `${path} must register a client factory`);
    return definition.factory(name => {
      assert.ok(modules.has(name), `Unprovided client dependency: ${name}`);
      return modules.get(name);
    });
  };
  const locale = await load(join(root, '@deepseek-ai/dsh-client-locale/lib/client.js'));
  const renderer = await load(join(root, '@deepseek-ai/dsh-client-ui-renderer/lib/client.js'));
  const moduleSystem = await load(join(root, '@deepseek-ai/dsh-client-modules/lib/client.js'));
  const pluginPath = fileURLToPath(new URL('../lib/client.js', import.meta.url));
  const plugin = await load(pluginPath);
  host = { ...cordis, ...renderer, ...locale, primitives, plugin, React: require('react'),
    render: require('react-dom/server').renderToStaticMarkup, moduleSystem, modules, evaluate, pluginPath };
}

test('published Host module loader accepts and materializes the plugin lazy-CJS entry', { skip }, async t => {
  const target = { mode: 'queue', pendingQueue: [], load(value) { this.pendingQueue.push(value); } };
  const system = new host.moduleSystem.ClientModuleSystem({
    manifest: { rev: 'isolated-client-contract', modules: [], plugins: [] },
    staticModules: [], registrationTarget: target,
    bootstrapModule: { id: '@deepseek-ai/dsh-client-modules', exports: host.moduleSystem },
    loadBundle: () => assert.fail('The isolated contract must not fetch a browser bundle'),
  });
  t.after(() => system.dispose?.());
  for (const id of ['react', 'react/jsx-runtime', '@deepseek-ai/dsh-client-ui-primitives']) {
    target.load({ id, factory: () => host.modules.get(id) });
  }
  await host.evaluate(host.pluginPath, target);
  const entry = await system.import('dsh-archived-chats/client');
  assert.equal(typeof entry.apply, 'function');
  assert.deepEqual(Array.from(entry.inject), ['slots', 'locale']);
  assert.equal(entry.__test.HostButton({ children: 'Archive' }).type, host.primitives.Button);
  assert.equal(await system.import('dsh-archived-chats'), entry, 'Host caches the same materialized entry');
});

test('published Host primitives render archive controls with their real React implementations', { skip }, () => {
  const { plugin, primitives, render } = host;
  const api = plugin.__test;
  const resolved = api.resolvePreviewPrimitives(name => {
    assert.equal(name, '@deepseek-ai/dsh-client-ui-primitives');
    return primitives;
  });
  for (const name of ['Button', 'Input', 'Modal', 'Menu', 'Tooltip', 'MarkdownText', 'Toast']) {
    assert.equal(resolved[name], primitives[name]);
    assert.ok(resolved[name], `Host must export ${name}`);
  }
  const button = api.HostButton({ className: 'dac-btn-primary', disabled: true, children: 'Archive' });
  assert.equal(button.type, primitives.Button);
  const buttonMarkup = render(button);
  assert.match(buttonMarkup, /<button\b/);
  assert.match(buttonMarkup, /disabled=""/);
  assert.match(buttonMarkup, />Archive<\/button>/);
  const input = api.HostInput({ type: 'text', defaultValue: 'release check', 'aria-label': 'Tags' });
  assert.equal(input.type, primitives.Input);
  const inputMarkup = render(input);
  assert.match(inputMarkup, /aria-label="Tags"/);
  assert.match(inputMarkup, /value="release check"/);
});

async function runtime(t) {
  const ctx = new host.Context();
  t.after(() => ctx.fiber.dispose());
  new host.SlotRegistry(ctx);
  const locale = new host.LocaleRuntime(ctx);
  ctx.provide('locale', locale);
  const slots = ctx.get('slots');
  slots.register({ name: 'root', children: {
    'settings.section': { kind: 'list', scope: 'root' },
    'workspace.toast': { kind: 'keyed', scope: 'root' },
    'sidebar.settings': { kind: 'single', scope: 'root' },
  } }, () => null);
  return { ctx, slots, locale };
}

test('published Cordis, slot registry and locale activate and unload the archive settings contribution', { skip }, async t => {
  const { ctx, slots, locale } = await runtime(t);
  const fiber = ctx.plugin(host.plugin);
  await fiber.await();
  const sections = slots.entriesOfSlot('settings.section');
  assert.equal(sections.length, 1);
  assert.equal(sections[0].options.id, 'archived-chats');
  assert.equal(sections[0].options.label(), 'Archive Management');
  locale.setLocale('zh');
  assert.equal(sections[0].options.label(), '归档管理');
  const injected = sections[0].inject();
  assert.equal(typeof injected.subscribeArchiveChanges(() => {}), 'function');
  await injected.refreshWorkspaceArchiveConsumers();
  await fiber.dispose();
  assert.equal(slots.entriesOfSlot('settings.section').length, 0);
  assert.equal(locale.bind(host.plugin.SETTINGS_NS)('nav'), 'nav');
});

test('published slot registry accepts the archive toast shadow and releases it on plugin unload', { skip }, async t => {
  const { ctx, slots } = await runtime(t);
  let opened;
  let dismissed = 0;
  slots.register({ name: 'sidebar.settings', store: {
    create: () => ({ actions: { openSection(id) { opened = id; } } }),
  } }, () => null);
  const original = props => host.React.createElement('span', null, props.display().text);
  slots.register({ name: 'workspace.toast', key: 'archived', inject: () => ({}) }, original);
  const fiber = ctx.plugin(host.plugin);
  await fiber.await();
  const winner = slots.entriesOfSlot('workspace.toast')[0];
  assert.notEqual(winner.component, original);
  const wrapped = winner.component({ display: () => ({ text: 'Archived', actions: [] }),
    dismissToast() { dismissed++; } });
  assert.equal(wrapped.type, original);
  const view = wrapped.props.display().actions.at(-1);
  assert.equal(view.label, 'View');
  view.onClick();
  assert.equal(opened, 'archived-chats');
  assert.equal(dismissed, 1);
  await fiber.dispose();
  assert.equal(slots.entriesOfSlot('workspace.toast')[0].component, original);
});
