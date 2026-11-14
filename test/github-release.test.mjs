import assert from 'node:assert/strict';
import test from 'node:test';
import { syncRelease } from '../scripts/github-release.mjs';

const options = { repository: 'owner/repo', tag: 'v2.0.3', notes: 'Reviewed notes', token: 'test-token' };
function transport(status, release) {
  const calls = [];
  return { calls, request: async (url, init) => {
    calls.push({ url, ...init });
    return calls.length === 1
      ? new Response(JSON.stringify(release ?? {}), { status })
      : new Response(JSON.stringify({ html_url: 'https://github.com/owner/repo/releases/tag/v2.0.3' }), { status: 200 });
  } };
}
test('updates only the existing release with the exact requested tag', async () => {
  const io = transport(200, { id: 42, tag_name: 'v2.0.3' });
  await syncRelease({ ...options, request: io.request });
  assert.equal(io.calls[1].url, 'https://api.github.com/repos/owner/repo/releases/42');
  assert.equal(io.calls[1].method, 'PATCH');
  assert.deepEqual(JSON.parse(io.calls[1].body), { name: 'v2.0.3', body: 'Reviewed notes', make_latest: 'true' });
});
test('creates a release only after a confirmed 404', async () => {
  const io = transport(404);
  await syncRelease({ ...options, request: io.request });
  assert.equal(io.calls[1].method, 'POST');
  assert.deepEqual(JSON.parse(io.calls[1].body), { name: 'v2.0.3', body: 'Reviewed notes', make_latest: 'true', tag_name: 'v2.0.3' });
});
for (const status of [401,403,429,500]) test(`does not create after HTTP ${status}`, async () => {
  const io = transport(status);
  await assert.rejects(syncRelease({ ...options, request: io.request }), /lookup failed/);
  assert.equal(io.calls.length, 1);
});
test('does not create after a network failure', async () => {
  await assert.rejects(syncRelease({ ...options, request: async () => { throw new Error('network unavailable'); } }), /network unavailable/);
});
test('rejects mismatched release identity before any write', async () => {
  const io = transport(200, { id: 42, tag_name: 'v2.0.2' });
  await assert.rejects(syncRelease({ ...options, request: io.request }), /identity/);
  assert.equal(io.calls.length, 1);
});
test('propagates mutation failure without retrying or changing action', async () => {
  let count = 0;
  await assert.rejects(syncRelease({ ...options, request: async () => ++count === 1
    ? new Response('{}', { status: 404 }) : new Response('{}', { status: 403 }) }), /write failed/);
  assert.equal(count, 2);
});
