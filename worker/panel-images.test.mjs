import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { handlePanelImages, hasPanelImages } from './panel-images.js';

test('raw HTMLRewriter attributes preserve localized text and current credits without decoding literal entities twice', async () => {
  const originalRewriter = globalThis.HTMLRewriter;
  const rawTexts = JSON.stringify([
    {
      id: 'front',
      alt: `H&T <Panel> "quoted" 'apostrophe' &quot; © 😀`,
      credit: 'Foto: H&T',
      canonicalCredit: 'Photo: H&T',
    },
    {
      id: 'rear',
      alt: 'Rückseite',
      credit: 'Veralteter Anbieter',
      canonicalCredit: 'Old provider',
    },
  ])
    .replace(
      /[&"'<>]/g,
      (char) => ({ '&': '&amp;', '"': '&quot;', "'": '&#39;', '<': '&lt;', '>': '&gt;' })[char],
    )
    .replace('&#39;apostrophe&#39;', '&#39;apostrophe&#x27;')
    .replace('©', '&#169;')
    .replace('😀', '&#x1F600;');
  const url = `https://assets.panel-assistant.io/published-images/${'a'.repeat(64)}.png`;
  const model = {
    id: 'vendor/panel',
    heroImageId: 'front',
    images: [
      { id: 'front', alt: 'English front', credit: 'Photo: H&T', thumb: url, large: url },
      { id: 'rear', alt: 'English rear', credit: 'Corrected provider', thumb: url, large: url },
    ],
  };
  const replacements = new Map();
  globalThis.HTMLRewriter = class {
    on(_selector, handler) {
      this.handler = handler;
      return this;
    }
    transform(response) {
      for (const slot of ['hero', 'gallery', 'thumbnail', 'tile']) {
        const attributes = {
          'data-panel-images': slot,
          'data-panel-model': model.id,
          'data-panel-locale': 'de',
          'data-panel-texts': rawTexts,
          'data-panel-href': '/hardware/panels/vendor/panel/',
          'data-panel-alt': 'H&amp;T &quot;Panel&quot; &amp;lt;',
        };
        this.handler.element({
          getAttribute: (name) => attributes[name] ?? null,
          setInnerContent: (html) => replacements.set(slot, html),
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
            new Response('<main>Static slots</main>', {
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
    const escapedAlt =
      'H&amp;T &lt;Panel&gt; &quot;quoted&quot; &#39;apostrophe&#39; &amp;quot; © 😀';
    assert.ok(replacements.get('hero').includes(`alt="${escapedAlt}"`));
    const gallery = replacements.get('gallery');
    assert.ok(gallery.includes(`alt="${escapedAlt}"`));
    assert.ok(gallery.includes('Foto: H&amp;T'));
    assert.ok(gallery.includes('Rückseite'));
    assert.ok(gallery.includes('Corrected provider'));
    assert.ok(!gallery.includes('Veralteter Anbieter'));
    assert.ok(!gallery.includes('English front'));
    assert.ok(replacements.get('thumbnail').includes(url));
    // A list picture is named by the page, not by the photo's caption in any language.
    assert.equal(
      replacements.get('tile'),
      `<img src="${url}" alt="H&amp;T &quot;Panel&quot; &amp;lt;" loading="lazy" decoding="async">`,
    );
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
