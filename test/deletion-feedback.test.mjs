import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

let definition;
const jsx = (type, props) => ({ type, props });
vm.runInNewContext(await readFile(new URL('../lib/client.js', import.meta.url), 'utf8'), {
  window: { __ModuleLoader__: { load(value) { definition = value; } } }, Symbol,
});
const exports = definition.factory(name => name === 'react/jsx-runtime' ? { jsx, jsxs: jsx } : {});
const { deletionFailureNotice, NoticeBanner } = exports.__test;

test('deletion failure offers an explicit retry using the returned task identities', () => {
  const requests = [];
  const targets = [{ sessionId: 'chat-a', taskId: 'task-a' }];
  const notice = deletionFailureNotice({ retryTargets: targets }, 'disk error', rows => requests.push(rows));
  assert.equal(requests.length, 0);
  const banner = NoticeBanner({ t: key => key, notice, onDismiss() {} });
  const retry = banner.props.children.find(child => child?.type === 'button' && child.props.children === 'state.retry');
  assert.ok(retry);
  retry.props.onClick();
  assert.equal(JSON.stringify(requests), JSON.stringify([targets]));
});

test('a preflight failure without a durable deletion never offers a retry of another task', () => {
  const notice = deletionFailureNotice({ retryTargets: [{ sessionId: 'chat-a' }] }, 'changed', () => assert.fail());
  const banner = NoticeBanner({ t: key => key, notice, onDismiss() {} });
  assert.equal(banner.props.children.some(child => child?.type === 'button' && child.props.children === 'state.retry'), false);
});
