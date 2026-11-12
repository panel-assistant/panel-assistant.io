import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  panelIdentity,
  staticGallery,
  renderHero,
  renderGallery,
  renderThumbnail,
} from './gallery.mjs';

const front = {
  id: 'front',
  alt: 'Front',
  credit: 'Front photographer',
  source: 'https://vendor.example/front',
  thumb: 'https://assets.example/front-small.webp',
  large: 'https://assets.example/front-large.webp',
};
const rear = {
  ...front,
  id: 'rear',
  alt: 'Rear',
  credit: 'Rear photographer',
  source: 'https://vendor.example/rear',
  thumb: 'https://assets.example/rear-small.webp',
  large: 'https://assets.example/rear-large.webp',
};

test('hero opens the selected gallery position without changing image order or credit', () => {
  const model = { images: [front, rear], heroImageId: 'rear' };
  const hero = renderHero(model);
  assert.match(hero, /data-open-photo="1"/);
  assert.match(hero, /src="https:\/\/assets.example\/rear-large.webp"/);
  const gallery = renderGallery(model);
  assert.ok(gallery.indexOf(front.thumb) < gallery.indexOf(rear.thumb));
  assert.match(gallery, /data-full-photo="https:\/\/assets.example\/rear-large.webp"/);
  assert.match(gallery, /<dialog class="photo-viewer">/);
  assert.match(gallery, /data-photo-credit="0" data-active>Front photographer/);
  assert.match(gallery, /data-photo-credit="1">Rear photographer/);
  assert.match(gallery, /href="https:\/\/vendor.example\/rear"/);
  assert.match(renderThumbnail(model, '/hardware/panels/example/panel/'), /rear-small.webp/);
});

test('empty and unselected galleries never invent a hero or broken image', () => {
  assert.equal(renderHero({ images: [front] }), '');
  assert.equal(renderHero({ images: [front], heroImageId: 'absent' }), '');
  assert.equal(renderGallery({ images: [] }), '');
  assert.equal(renderThumbnail({ images: [] }, '/hardware/'), '');
  const single = renderGallery({ images: [front] });
  assert.doesNotMatch(single, /data-prev-photo|data-next-photo/);
  assert.match(renderThumbnail({ images: [front] }, '/hardware/'), /front-small.webp/);
});

test('untrusted image text is escaped and unsafe URLs cannot become executable markup', () => {
  const malicious = {
    ...front,
    alt: '\"><script>alert(1)</script>',
    credit: '<img src=x onerror=alert(1)>',
    source: 'javascript:alert(1)',
    large: 'javascript:alert(1)',
  };
  const html =
    renderHero({ images: [malicious], heroImageId: 'front' }) +
    renderGallery({ images: [malicious] });
  assert.doesNotMatch(html, /<script>|<img src=x|javascript:/);
  assert.match(html, /&quot;&gt;&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /data-full-photo="https:\/\/assets.example\/front-small.webp"/);
  for (const thumb of [
    'javascript:alert(1)',
    'data:image/svg+xml,hello',
    'https://user:secret@example.com/a',
  ])
    assert.equal(renderGallery({ images: [{ ...front, thumb }] }), '');
  assert.equal(renderThumbnail({ images: [front] }, 'javascript:alert(1)'), '');
});

test('legacy localized page images retain their own text and fallback credit', () => {
  const model = staticGallery(
    {
      heroImageId: 'front',
      photoCredit: 'Legacy photographer',
      photos: [
        {
          id: 'front',
          src: 'asset:front.jpg',
          full: 'asset:full.jpg',
          alt: 'Vorne',
          credit: 'Eigener Fotograf',
        },
        { src: 'asset:rear.jpg', alt: 'Hinten' },
      ],
    },
    (src) => src.replace('asset:', 'https://assets.example/'),
  );
  assert.equal(model.images[0].large, 'https://assets.example/full.jpg');
  assert.equal(model.images[0].credit, 'Eigener Fotograf');
  assert.equal(model.images[1].credit, 'Legacy photographer');
  assert.match(renderGallery(model), /alt="Vorne"/);
  assert.match(renderHero(model), /full.jpg/);
});

test('only exact model entry IDs produce canonical identity across locales', () => {
  assert.deepEqual(panelIdentity('hardware/panels/electron/wf1589t'), {
    id: 'electron/wf1589t',
    locale: 'en',
  });
  assert.deepEqual(panelIdentity('zh-hans/hardware/panels/electron/wf1589t'), {
    id: 'electron/wf1589t',
    locale: 'zh-hans',
  });
  for (const page of [
    'hardware/panels/electron',
    'hardware/panels/index',
    'hardware/panels/electron/index',
    'hardware/panels/electron/wf1589t/extra',
    'guides/hardware/panels/electron/wf1589t',
  ])
    assert.equal(panelIdentity(page), null);
});
