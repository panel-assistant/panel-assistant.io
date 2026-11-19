import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { handlePanelImages, hasPanelImages } from './panel-images.js';

test('each slot is filled from the published image set, and a list picture is named by its page', async () => {
  const originalRewriter = globalThis.HTMLRewriter;
  const url = `https://assets.panel-assistant.io/published-images/${'a'.repeat(64)}.png`;
  const model = {
    id: 'vendor/panel',
    heroImageId: 'rear',
    images: [
      { id: 'front', alt: 'Front & "side"', credit: 'Photo: H&T', thumb: url, large: url },
      { id: 'rear', alt: 'Rear', credit: 'Corrected provider', thumb: url, large: url },
    ],
  };
  const replacements = new Map();
  globalThis.HTMLRewriter = class {
    on(_selector, handler) {
      this.handler = handler;
      return this;
    }
    transform(response) {
      for (const [slot, id] of [
        ['hero', model.id],
        ['gallery', model.id],
        ['thumbnail', model.id],
        ['tile', model.id],
        ['tile', 'vendor/unpublished'],
        ['other', model.id],
      ]) {
        // HTMLRewriter hands over the attribute as written in the page, entities included.
        const attributes = {
          'data-panel-images': slot,
          'data-panel-model': id,
          'data-panel-locale': 'de',
          'data-panel-href': '/hardware/panels/vendor/panel/',
          'data-panel-alt': 'H&amp;T &quot;Panel&quot; &amp;lt; &#169; &#x1F600;',
        };
        this.handler.element({
          getAttribute: (name) => attributes[name] ?? null,
          setInnerContent: (html) => replacements.set(`${slot} ${id}`, html),
        });
      }
      return response;
    }
  };
  try {
    const response = await handlePanelImages(
      new Request('https://example.com/de/hardware/panels/vendor/panel/'),
      {
        ASSETS: {
          fetch: async () =>
            new Response('<main>Empty slots</main>', {
              headers: { 'content-type': 'text/html' },
            }),
        },
        PUBLIC_IMAGES: {
          get: async () => ({
            text: async () => JSON.stringify({ revision: 'r1', models: [model] }),
          }),
        },
      },
    );
    assert.equal(response.headers.get('x-panel-images-revision'), 'r1');
    assert.match(
      replacements.get('hero vendor/panel'),
      /data-open-photo="1"[^>]*>\s*<img[^>]*alt="Rear"/,
    );
    const gallery = replacements.get('gallery vendor/panel');
    assert.ok(gallery.includes('alt="Front &amp; &quot;side&quot;"'));
    assert.ok(gallery.includes('Photo: H&amp;T'));
    assert.ok(gallery.includes('Corrected provider'));
    assert.ok(replacements.get('thumbnail vendor/panel').includes(url));
    // A list picture is named by the page, decoded once: a literal "&lt;" stays text.
    assert.equal(
      replacements.get('tile vendor/panel'),
      `<img src="${url}" alt="H&amp;T &quot;Panel&quot; &amp;lt; © 😀" loading="lazy" decoding="async">`,
    );
    // A model with nothing published, and a slot this Worker does not know, are left as built.
    assert.deepEqual([...replacements.keys()].sort(), [
      'gallery vendor/panel',
      'hero vendor/panel',
      'thumbnail vendor/panel',
      'tile vendor/panel',
    ]);
  } finally {
    if (originalRewriter === undefined) delete globalThis.HTMLRewriter;
    else globalThis.HTMLRewriter = originalRewriter;
  }
});

test('only the hardware overview, panel pages and the list of panels enter the live image response path', async () => {
  for (const path of [
    '/hardware/',
    '/hardware',
    '/hardware/panels/meta/portal-go/',
    '/de/hardware/panels/meta/portal-go/',
    '/install/supported-panels/',
    '/install/supported-panels',
    '/zh-hans/install/supported-panels/',
  ])
    assert.equal(hasPanelImages(path), true, path);
  for (const path of [
    '/admin/',
    '/images/',
    '/hardware-other/',
    '/go/hardware',
    '/hardware/guides/root-access/',
    '/xx/hardware/',
    '/install/',
    '/install/supported-panels/extra/',
    '/install/prepare-a-panel/',
    '/xx/install/supported-panels/',
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

test('every address that carries picture slots is routed to the Worker before the static page', () => {
  const config = readFileSync(new URL('./wrangler.jsonc', import.meta.url), 'utf8');
  const routed = [...config.matchAll(/"(\/[^"]*)\*"/g)].map((match) => match[1]);
  for (const locale of ['', '/de', '/es', '/fr', '/it', '/nl', '/pl', '/uk', '/zh-hans'])
    for (const path of [
      '/hardware/',
      '/hardware/panels/meta/portal-go/',
      '/install/supported-panels/',
    ]) {
      assert.equal(hasPanelImages(locale + path), true, locale + path);
      assert.ok(
        routed.some((prefix) => (locale + path).startsWith(prefix)),
        `${locale + path} is served without its pictures`,
      );
    }
});
