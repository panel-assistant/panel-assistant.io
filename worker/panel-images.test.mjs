import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handlePanelImages, hasPanelImages } from './panel-images.js';

test('only hardware overview and panel routes enter the live image response path', async () => {
  for (const path of [
    '/hardware/',
    '/hardware',
    '/hardware/panels/meta/portal-go/',
    '/de/hardware/panels/meta/portal-go/',
  ])
    assert.equal(hasPanelImages(path), true, path);
  for (const path of [
    '/admin/',
    '/images/',
    '/hardware-other/',
    '/go/hardware',
    '/hardware/guides/root-access/',
    '/xx/hardware/',
  ]) {
    assert.equal(hasPanelImages(path), false, path);
    assert.equal(await handlePanelImages(new Request(`https://example.com${path}`), {}), null);
  }
});

test('hardware fallback HTML cannot retain a conditional static response or stale cache validators', async () => {
  let upstream;
  const env = {
    ASSETS: {
      fetch: async (request) => {
        upstream = request;
        return new Response('<p>Built fallback</p>', {
          headers: {
            'content-type': 'text/html; charset=utf-8',
            etag: 'old-static-tag',
            'last-modified': 'Tue, 10 Nov 2026 12:00:00 GMT',
            'cache-control': 'public, max-age=3600',
            'content-length': '21',
          },
        });
      },
    },
    PUBLIC_IMAGES: {
      get: async () => {
        throw new Error('R2 temporarily unavailable');
      },
    },
  };
  for (const method of ['GET', 'HEAD']) {
    const response = await handlePanelImages(
      new Request('https://example.com/hardware/', {
        method,
        headers: {
          'if-none-match': 'old-static-tag',
          'if-modified-since': 'yesterday',
          range: 'bytes=0-10',
        },
      }),
      env,
    );
    assert.equal(upstream.method, 'GET');
    assert.equal(upstream.headers.get('if-none-match'), null);
    assert.equal(upstream.headers.get('if-modified-since'), null);
    assert.equal(upstream.headers.get('range'), null);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('etag'), null);
    assert.equal(response.headers.get('last-modified'), null);
    assert.equal(response.headers.get('content-length'), null);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('x-panel-images'), 'unavailable');
    assert.equal(await response.text(), method === 'HEAD' ? '' : '<p>Built fallback</p>');
  }
});
