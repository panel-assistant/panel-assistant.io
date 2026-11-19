import {
  renderHero,
  renderGallery,
  renderThumbnail,
  renderTile,
} from '../src/product-images/gallery.mjs';

// The hardware overview, every panel page, and the list of panels to choose from.
const page =
  /^\/(?:de\/|es\/|fr\/|it\/|nl\/|pl\/|uk\/|zh-hans\/)?(?:hardware(?:\/?$|\/panels\/)|install\/supported-panels\/?$)/;
const asset =
  /^https:\/\/assets\.panel-assistant\.io\/published-images\/[a-f0-9]{64}\.(?:webp|png)$/;

export function hasPanelImages(pathname) {
  return page.test(pathname);
}

// HTMLRewriter exposes Astro's escaped attribute bytes, unlike a browser DOM. Decode
// once so literal entity text (for example &amp;quot;) is not interpreted a second time.
function attributeText(value) {
  const named = { amp: '&', quot: '"', lt: '<', gt: '>', apos: "'" };
  return value.replace(/&(?:amp|quot|lt|gt|apos|#\d+|#x[a-f0-9]+);/gi, (entity) => {
    const name = entity.slice(1, -1).toLowerCase();
    if (name[0] !== '#') return named[name];
    const point = name[1] === 'x' ? parseInt(name.slice(2), 16) : Number(name.slice(1));
    return String.fromCodePoint(
      point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff) ? point : 0xfffd,
    );
  });
}

function validModel(model) {
  return (
    model &&
    typeof model.id === 'string' &&
    /^[a-z0-9-]+\/[a-z0-9-]+$/.test(model.id) &&
    Array.isArray(model.images) &&
    model.images.length <= 200 &&
    model.images.every(
      (image) =>
        image &&
        typeof image.id === 'string' &&
        typeof image.alt === 'string' &&
        typeof image.credit === 'string' &&
        asset.test(image.thumb) &&
        asset.test(image.large),
    )
  );
}

// R2 is read directly on every applicable request. Immutable image bytes may be cached;
// the active selection and rendered HTML must reflect the next successful publication.
export async function handlePanelImages(request, env) {
  const { pathname } = new URL(request.url);
  if (!hasPanelImages(pathname) || !['GET', 'HEAD'].includes(request.method)) return null;

  const headers = new Headers(request.headers);
  for (const name of ['if-none-match', 'if-modified-since', 'if-range', 'range'])
    headers.delete(name);
  const template = await env.ASSETS.fetch(new Request(request.url, { method: 'GET', headers }));
  if (template.status !== 200 || !template.headers.get('content-type')?.includes('text/html'))
    return request.method === 'HEAD' ? new Response(null, template) : template;

  const responseHeaders = new Headers(template.headers);
  for (const name of ['etag', 'last-modified', 'content-length', 'content-encoding'])
    responseHeaders.delete(name);
  responseHeaders.set('cache-control', 'no-store');
  let snapshot;
  try {
    const current = await env.PUBLIC_IMAGES?.get('published-images/current.json');
    if (current) {
      const text = await current.text();
      if (text.length > 2 * 1024 * 1024) throw new Error('Image publication exceeds size limit');
      snapshot = JSON.parse(text);
    }
  } catch {
    // A storage outage retains the built fallback; it must not cache that fallback as a
    // replacement for an intentional published empty gallery.
    responseHeaders.set('x-panel-images', 'unavailable');
  }
  const response = new Response(template.body, { status: 200, headers: responseHeaders });
  if (!snapshot || !Array.isArray(snapshot.models) || typeof snapshot.revision !== 'string')
    return request.method === 'HEAD' ? new Response(null, response) : response;

  const models = new Map(snapshot.models.filter(validModel).map((model) => [model.id, model]));
  response.headers.set('x-panel-images-revision', snapshot.revision);
  const transformed = new HTMLRewriter()
    .on('[data-panel-images][data-panel-model]', {
      element(element) {
        const model = models.get(element.getAttribute('data-panel-model'));
        if (!model) return;
        const slot = element.getAttribute('data-panel-images');
        const html =
          slot === 'hero'
            ? renderHero(model)
            : slot === 'gallery'
              ? renderGallery(model)
              : slot === 'thumbnail'
                ? renderThumbnail(model, element.getAttribute('data-panel-href'))
                : slot === 'tile'
                  ? renderTile(model, attributeText(element.getAttribute('data-panel-alt') ?? ''))
                  : null;
        if (html !== null) element.setInnerContent(html, { html: true });
      },
    })
    .transform(response);
  return request.method === 'HEAD' ? new Response(null, transformed) : transformed;
}
