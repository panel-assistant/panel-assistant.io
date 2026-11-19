import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  panelIdentity,
  renderHero,
  renderGallery,
  renderThumbnail,
  renderTile,
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

test('a list picture is the chosen hero, named by the caller, and nothing when there is no image', () => {
  const model = { images: [{ ...front, width: 800, height: 600 }, rear], heroImageId: 'rear' };
  const hero = renderTile(model, 'Vendor Panel');
  assert.match(hero, /src="https:\/\/assets.example\/rear-small.webp"/);
  assert.match(hero, /alt="Vendor Panel"/);
  assert.doesNotMatch(hero, /alt="Rear"|width=/);
  // No hero chosen: the first image, with its proportions so the page does not shift.
  const first = renderTile({ images: model.images }, 'Vendor Panel');
  assert.match(
    first,
    /front-small.webp" alt="Vendor Panel" width="800" height="600" loading="lazy"/,
  );
  assert.equal(renderTile({ images: [] }, 'Vendor Panel'), '');
  assert.equal(renderTile({ images: [{ ...front, thumb: 'javascript:alert(1)' }] }, 'x'), '');
  assert.match(
    renderTile({ images: [{ ...front, width: '1" onload="x', height: 2 }] }, '"><script>'),
    /^<img src="[^"]+" alt="&quot;&gt;&lt;script&gt;" loading="lazy" decoding="async">$/,
  );
});
