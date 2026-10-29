import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from './index.js';

const key = `${'a'.repeat(64)}.apk`;
const bytes = new Uint8Array([0x50, 0x4b, 0, 255]);
const object = () => ({ body: bytes, size: bytes.length, httpEtag: '"apk-etag"' });
const env = {
  WEBVIEWS: {
    get: async (name) => (name === key ? object() : null),
    head: async (name) => (name === key ? object() : null),
  },
};
const request = (name = key, init) =>
  new Request(`https://panel-assistant.io/downloads/webview/${name}`, init);

test('APK download preserves binary bytes and immutable download headers', async () => {
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 200);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
  assert.equal(response.headers.get('content-type'), 'application/vnd.android.package-archive');
  assert.equal(response.headers.get('content-length'), '4');
  assert.equal(response.headers.get('etag'), '"apk-etag"');
  assert.equal(response.headers.get('cache-control'), 'public, max-age=31536000, immutable');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('content-disposition'), `attachment; filename="${key}"`);
});

test('HEAD reports the same APK metadata without a body', async () => {
  const response = await worker.fetch(request(key, { method: 'HEAD' }), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-length'), '4');
  assert.equal(await response.text(), '');
});

test('missing APK and non-hash paths are honest 404s', async () => {
  for (const path of [
    `${'b'.repeat(64)}.apk`,
    '',
    'folder/file.apk',
    key.toUpperCase(),
    `${key}%2fother`,
  ]) {
    const response = await worker.fetch(request(path), env);
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.has('cache-control'), false);
  }
});

test('download endpoint rejects writes', async () => {
  const response = await worker.fetch(request(key, { method: 'POST' }), env);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, HEAD');
});

test('matching ETags revalidate without a response body', async () => {
  const response = await worker.fetch(
    request(key, { headers: { 'if-none-match': '"old", W/"apk-etag"' } }),
    env,
  );
  assert.equal(response.status, 304);
  assert.equal(await response.text(), '');
  assert.equal(response.headers.has('content-length'), false);
});

test('nonmatching ETags still deliver the APK', async () => {
  const response = await worker.fetch(request(key, { headers: { 'if-none-match': '"old"' } }), env);
  assert.equal(response.status, 200);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
});
test('combined installer Repair redirects to the published recovery guidance', async () => {
  const response = await worker.fetch(
    new Request('https://panel-assistant.io/go/repair?issue=installer_failure_update'),
    env,
  );
  assert.equal(response.status, 302);
  assert.ok(
    response.headers.get('location').endsWith('/home-assistant/repairs/#installer-failure-update'),
  );
});
