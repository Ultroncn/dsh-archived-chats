import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8');
function client(primitives = {}, react = {}) {
  let definition;
  const jsx = (type, props) => ({ type, props });
  vm.runInNewContext(source, { window: { __ModuleLoader__: { load(value) { definition = value; } } }, Symbol });
  return definition.factory(name => name === 'react/jsx-runtime' ? { jsx, jsxs: jsx }
    : name === '@deepseek-ai/dsh-client-ui-primitives' ? primitives : name === 'react' ? react : {}).__test;
}
const plain = value => JSON.parse(JSON.stringify(value));

test('shared buttons forward actions, disabled state, refs and official size variants', () => {
  function Button() {}
  const api = client({ Button });
  const ref = {};
  const onClick = () => {};
  const native = api.HostButton({ className: 'dac-btn-primary', children: 'Save', disabled: true, onClick }, ref);
  assert.equal(native.type, Button);
  assert.equal(native.props.variant, 'primary');
  assert.equal(native.props.size, 'md');
  assert.equal(native.props.disabled, true);
  assert.equal(native.props.onClick, onClick);
  assert.equal(native.props.ref, ref);
  assert.equal(native.props.children, 'Save');
  assert.equal(api.HostButton({ className: 'dac-iconbtn', children: 'X' }).props.variant, 'ghost');
});

test('shared inputs forward the real input ref and editing events to the Host', () => {
  function Input() {}
  const api = client({ Input });
  const ref = {};
  const onChange = () => {};
  const result = api.HostInput({ type: 'text', className: 'dac-meta-input', value: 'query', onChange, 'aria-label': 'Tags' }, ref);
  assert.equal(result.type, Input);
  assert.equal(result.props.ref, ref);
  assert.equal(result.props.onChange, onChange);
  assert.equal(result.props.value, 'query');
  assert.equal(result.props['aria-label'], 'Tags');
});

test('search fields match the built-in plugin inventory label and input on every Host', () => {
  function Input() {}
  const icon = { type: 'svg', props: {} };
  const ref = {};
  const onChange = () => {};
  for (const primitives of [{ Input }, {}]) {
    const api = client(primitives);
    for (const className of ['dac-search']) {
      const result = api.HostInput({ type: 'search', className, icon, value: 'query', onChange, 'aria-label': 'Search' }, ref);
      assert.equal(result.type, 'label');
      assert.equal(result.props.className, 'dac-search');
      assert.equal(result.props.children[0], icon);
      const input = result.props.children[1];
      assert.equal(input.type, 'input');
      assert.equal(input.props.ref, ref);
      assert.equal(input.props.type, 'search');
      assert.equal(input.props.value, 'query');
      assert.equal(input.props.onChange, onChange);
      assert.equal(input.props['aria-label'], 'Search');
      assert.equal(input.props.className, undefined);
    }
  }
  assert.match(source, /@media \(pointer:coarse\)\{\.dac-search input\{font-size:16px\}\}/);
});

test('dialog framing delegates layering and dismissal to the official Modal', () => {
  function Modal() {}
  const api = client({ Modal });
  const children = { type: 'div', props: { children: 'Body' } };
  const close = () => {};
  const result = api.HostModal({ title: 'Confirm', className: 'dac-confirm-overlay', onClick: close, children });
  assert.equal(result.type, Modal);
  assert.equal(result.props.open, true);
  assert.equal(result.props.title, 'Confirm');
  assert.equal(result.props.headless, true);
  assert.equal(result.props.onClose, close);
  assert.equal(result.props.children, children);
});

test('older Hosts keep functional inputs, buttons and dismissible dialog overlays', () => {
  const api = client();
  const onChange = () => {};
  assert.equal(api.HostInput({ type: 'text', className: 'dac-meta-input', onChange }).type, 'input');
  assert.equal(api.HostButton({ className: 'dac-btn', disabled: true }).props.disabled, true);
  const close = () => {};
  const dialog = api.HostModal({ title: 'Confirm', className: 'dac-confirm-overlay', onClick: close, children: 'Body' });
  assert.equal(dialog.type, 'div');
  assert.equal(dialog.props.onClick, close);
  assert.deepEqual(plain(dialog.props.children), 'Body');
});

test('toolbar more uses official tooltip and menu with a toggleable accessible button', () => {
  function Button() {}
  function Tooltip() {}
  function Menu() {}
  function IconEllipsisOutlineRegular() {}
  const updates = [];
  const api = client({ Button, Tooltip, Menu, IconEllipsisOutlineRegular }, {
    useState: () => [false, update => updates.push(typeof update === 'function' ? update(false) : update)],
  });
  const menu = api.ToolbarMoreMenu({ t: key => key, triggerLabel: 'More archive actions', children: 'actions' });
  assert.equal(menu.type, Menu);
  assert.equal(menu.props.portal, true);
  assert.equal(menu.props.autoFocus, true);
  assert.equal(menu.props.children, 'actions');
  const tooltip = menu.props.anchor;
  assert.equal(tooltip.type, Tooltip);
  assert.equal(tooltip.props.label, 'More archive actions');
  assert.equal(tooltip.props.portal, true);
  const button = tooltip.props.children;
  assert.equal(button.type, Button);
  assert.equal(button.props.size, 'sm');
  assert.equal(button.props['aria-label'], 'More archive actions');
  assert.equal(button.props['aria-haspopup'], 'menu');
  assert.equal(button.props['aria-expanded'], false);
  assert.equal(button.props.children.type, IconEllipsisOutlineRegular);
  assert.equal(button.props.children.props.size, 13);
  button.props.onClick();
  menu.props.onClose();
  assert.deepEqual(updates, [true, false]);
});

test('workspace more shares the native menu and forwards controlled state and its stable focus marker', () => {
  function Button() {}
  function Tooltip() {}
  function Menu() {}
  const changes = [];
  const api = client({ Button, Tooltip, Menu }, { useState: () => [false, () => assert.fail('controlled menu must notify its owner')] });
  const menu = api.ToolbarMoreMenu({ t: key => key, triggerLabel: 'Workspace actions', open: true,
    onOpenChange: value => changes.push(value), triggerProps: { 'data-dac-workspace-menu': true }, children: 'workspace actions' });
  assert.equal(menu.type, Menu);
  assert.equal(menu.props.open, true);
  const trigger = menu.props.anchor.props.children;
  assert.equal(trigger.props['data-dac-workspace-menu'], true);
  assert.equal(trigger.props['aria-expanded'], true);
  trigger.props.onClick();
  menu.props.onClose();
  assert.deepEqual(changes, [false, false]);
});

test('workspace more remains controlled and actionable on older Hosts', () => {
  const changes = [];
  const api = client({}, { useState: () => [false, () => assert.fail('controlled menu must notify its owner')] });
  const menu = api.ToolbarMoreMenu({ t: key => key, triggerLabel: 'Workspace actions', open: true,
    onOpenChange: value => changes.push(value), triggerProps: { 'data-dac-workspace-menu': true }, children: 'actions' });
  const [trigger, surface] = menu.props.children;
  assert.equal(trigger.type, 'button');
  assert.equal(trigger.props['data-dac-workspace-menu'], true);
  assert.equal(surface.props.role, 'menu');
  assert.equal(surface.props.children, 'actions');
  trigger.props.onClick();
  assert.deepEqual(changes, [false]);
});

test('native filter surfaces retain their scrolling and alignment selectors', () => {
  function MenuSurface() {}
  const api = client({ MenuSurface });
  const result = api.HostMenuSurface({ className: 'dac-menu dac-row-menu', children: 'Options' });
  assert.equal(result.type, MenuSurface);
  assert(result.props.className.split(' ').includes('dac-row-menu'));
  assert.equal(result.props.style, undefined);
});

test('filter dropdowns share the official dense Menu and close only for available options', () => {
  function Menu() {}
  const changes = [];
  const selected = [];
  const items = [{ type: 'label', id: 'type', text: 'Type' },
    { id: 'all', label: 'All chats' }, { id: 'disabled', label: 'Unavailable', disabled: true }];
  const selectedIds = ['all'];
  const api = client({ Menu }, { useState: () => [true, value => changes.push(value)] });
  const menu = api.NativeFilterMenu({ title: 'Recently updated', triggerLabel: 'All chats', trigger: 'Filter',
    items, selectedIds, onSelect: id => selected.push(id) });
  assert.equal(menu.type, Menu);
  assert.equal(menu.props.dense, true);
  assert.equal(menu.props.portal, true);
  assert.equal(menu.props.autoFocus, true);
  assert.equal(menu.props.listClassName, 'dac-native-filter-menu');
  assert.equal(menu.props.anchor.type, 'button');
  assert.equal(menu.props.anchor.props.className, 'dac-action-trigger dac-native-filter-trigger');
  assert.equal(menu.props.anchor.props['aria-label'], 'All chats');
  assert.equal(menu.props.anchor.props['aria-expanded'], true);
  assert.equal(menu.props.children, undefined);
  assert.equal(menu.props.items, items);
  assert.equal(menu.props.selectedIds, selectedIds);
  menu.props.onSelect('disabled');
  menu.props.onSelect('type');
  assert.deepEqual(changes, []);
  assert.deepEqual(selected, []);
  menu.props.onSelect('all');
  assert.deepEqual(selected, ['all']);
  menu.props.onClose();
  menu.props.anchor.props.onClick();
  assert.deepEqual(changes, [false, false, false]);
});

test('native menu entries retain unavailable-option explanations and selected values', () => {
  function MenuItemButton() {}
  const api = client({ MenuItemButton });
  const result = api.HostMenuItem({ className: 'dac-menu-item', disabled: true, title: 'Schedule unavailable',
    'aria-pressed': true, children: 'Automation' });
  assert.equal(result.type, MenuItemButton);
  assert.equal(result.props.disabledReason, 'Schedule unavailable');
  assert.equal(result.props.disabled, true);
  assert.equal(result.props.current, true);
});

test('native filter options keep the label and selected marker in one content row', () => {
  function MenuItemButton() {}
  const api = client({ MenuItemButton });
  const label = { type: 'span', props: { children: 'All workspaces' } };
  const check = { type: 'svg', props: { 'aria-hidden': true } };
  const result = api.HostMenuItem({ className: 'dac-menu-item', 'aria-pressed': true, children: [label, check] });
  assert.equal(result.type, MenuItemButton);
  assert.equal(result.props.current, true);
  const content = result.props.children;
  assert.equal(content.type, 'span');
  assert.equal(content.props.className, 'dac-native-menu-content');
  assert.deepEqual(content.props.children, [label, check]);
});

test('native buttons preserve preview layout, selection cancellation and stop-action semantics', () => {
  function Button() {}
  const api = client({ Button });
  assert(api.HostButton({ className: 'dac-btn dac-preview-more' }).props.className.includes('dac-preview-more'));
  assert.equal(api.HostButton({ className: 'dac-action-trigger dac-selection-cancel' }).props.variant, 'ghost');
  assert(api.HostButton({ className: 'dac-btn-primary dac-stop-archive' }).props.className.includes('dac-native-danger'));
});

test('native confirmations use official headings and guard dismissal during pending submissions', async () => {
  function Modal() {}
  const api = client({ Modal }, { useRef: current => ({ current }), useEffect() {} });
  let cancelled = 0;
  let finish;
  let submitted = 0;
  const tree = api.ConfirmDialog({ title: 'Delete?', body: 'Permanent deletion', confirmLabel: 'Delete', cancelLabel: 'Cancel',
    onCancel: () => { cancelled++; }, onConfirm: () => { submitted++; return new Promise(resolve => { finish = resolve; }); } });
  assert.equal(tree.type, Modal);
  assert.equal(tree.props.title, 'Delete?');
  assert.equal(tree.props.description, 'Permanent deletion');
  assert.equal(tree.props.headless, undefined);
  const confirm = tree.props.footer.props.children[1];
  const applying = confirm.props.onClick();
  await confirm.props.onClick();
  tree.props.onClose();
  assert.equal(cancelled, 0);
  assert.equal(submitted, 1);
  finish(); await applying;
  tree.props.onClose();
  assert.equal(cancelled, 1);
  const busy = api.ConfirmDialog({ title: 'Busy', body: 'Working', busy: true, onCancel: () => { cancelled++; }, onConfirm() {} });
  busy.props.onClose();
  assert.equal(cancelled, 1);
  assert.equal(busy.props.footer.props.children[0].props.disabled, true);
  assert.equal(busy.props.footer.props.children[1].props.disabled, true);
});
