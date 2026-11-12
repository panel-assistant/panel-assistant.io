// Shared by the static pages and the public image Worker. All catalogue text is untrusted HTML.
const escape = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );

function publicUrl(value) {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : '';
  } catch {
    return '';
  }
}

function images(model) {
  return (Array.isArray(model?.images) ? model.images : []).flatMap((image) => {
    if (!image || typeof image !== 'object') return [];
    const thumb = publicUrl(image.thumb);
    if (!thumb) return [];
    return [{ ...image, thumb, large: publicUrl(image.large) || thumb }];
  });
}

function heroIndex(model, photos) {
  return typeof model?.heroImageId === 'string'
    ? photos.findIndex((photo) => photo.id === model.heroImageId)
    : -1;
}

/** Resolve a documentation entry to a real model, independently of its locale. */
export function panelIdentity(entryId) {
  const match = String(entryId ?? '')
    .replace(/^\/+|\/+$/g, '')
    .match(/^(?:([a-z]{2}(?:-[a-z0-9]+)*)\/)?hardware\/panels\/([a-z0-9-]+)\/([a-z0-9-]+)$/);
  if (!match || match[2] === 'index' || match[3] === 'index') return null;
  return { id: `${match[2]}/${match[3]}`, locale: match[1] || 'en' };
}

/** Adapt legacy page metadata without changing localized captions or provenance. */
export function staticGallery(data, resolveAsset) {
  return {
    heroImageId: data.heroImageId,
    images: (Array.isArray(data.photos) ? data.photos : []).map((photo) => ({
      id: photo.id,
      alt: photo.alt,
      credit: photo.credit?.trim() || data.photoCredit || '',
      source: photo.source,
      thumb: resolveAsset(photo.src),
      large: resolveAsset(photo.full?.trim() || photo.src),
      width: photo.width,
      height: photo.height,
    })),
  };
}

export function renderHero(model) {
  const photos = images(model);
  const index = heroIndex(model, photos);
  if (index < 0) return '';
  const photo = photos[index];
  return `<figure class="product-hero not-content"><button type="button" class="photo-hero" data-open-photo="${index}" aria-label="${escape(`View larger: ${photo.alt ?? ''}`)}"><img src="${escape(photo.large)}" alt="${escape(photo.alt)}" width="960" height="720" loading="eager" fetchpriority="high" decoding="async"></button></figure>`;
}

export function renderGallery(model) {
  const photos = images(model);
  if (!photos.length) return '';
  const thumbnails = photos
    .map(
      (photo, index) =>
        `<li><button type="button" class="photo-thumb" data-open-photo="${index}" data-full-photo="${escape(photo.large)}" aria-label="${escape(`View larger: ${photo.alt ?? ''}`)}"><img src="${escape(photo.thumb)}" alt="${escape(photo.alt)}" loading="lazy" width="320" height="320"></button></li>`,
    )
    .join('');
  const credits = photos
    .map((photo, index) => {
      const source = publicUrl(photo.source);
      return `<p class="photo-viewer-credit" data-photo-credit="${index}"${index === 0 ? ' data-active' : ''}>${escape(photo.credit)}${source ? ` <a href="${escape(source)}">Image source</a>` : ''}</p>`;
    })
    .join('');
  const navigation = (direction, label, glyph) =>
    photos.length > 1
      ? `<button type="button" class="photo-viewer-nav photo-viewer-${direction}" data-${direction}-photo aria-label="${label}">${glyph}</button>`
      : '';
  return `<figure class="hardware-photos not-content"><ul>${thumbnails}</ul></figure><dialog class="photo-viewer"><button type="button" class="photo-viewer-close" data-close-photo aria-label="Close">✕</button>${navigation('prev', 'Previous photo', '‹')}<img class="photo-viewer-img" alt=""><p class="photo-viewer-caption"></p><div class="photo-viewer-credits">${credits}</div>${navigation('next', 'Next photo', '›')}</dialog>`;
}

export function renderThumbnail(model, href) {
  const photos = images(model);
  const photo = photos[heroIndex(model, photos)] || photos[0];
  if (!photo || typeof href !== 'string') return '';
  let target;
  try {
    target = new URL(href, 'https://panel-assistant.io');
  } catch {
    return '';
  }
  if (!['https:', 'http:'].includes(target.protocol) || target.username || target.password)
    return '';
  return `<a href="${escape(href)}" tabindex="-1" aria-hidden="true"><img src="${escape(photo.thumb)}" alt="" loading="lazy" width="48" height="48"></a>`;
}
