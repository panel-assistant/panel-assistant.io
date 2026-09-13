// Rewrites `asset:<key>` image URLs in Markdown to the asset host, so pages never spell out the
// host and moving the images to another provider is one change to the base URL in the site config.
// A Sätteri mdast plugin: Astro 7's default Markdown processor.
const PREFIX = 'asset:';

export function rewriteAssetUrl(url, base) {
  if (typeof url !== 'string' || !url.startsWith(PREFIX)) return url;
  return `${base.replace(/\/+$/, '')}/${url.slice(PREFIX.length).replace(/^\/+/, '')}`;
}

export function assetUrls({ base }) {
  if (!base) throw new Error('asset-urls needs a base URL');
  const url = (node, ctx) => {
    const next = rewriteAssetUrl(node.url, base);
    if (next !== node.url) ctx.setProperty(node, 'url', next);
  };
  return {
    name: 'asset-urls',
    image: url,
    definition: url,
    html(node, ctx) {
      const next = node.value.replace(/(src|srcset)="asset:([^"]+)"/g, (_, attr, key) => {
        return `${attr}="${rewriteAssetUrl(PREFIX + key, base)}"`;
      });
      if (next !== node.value) ctx.setProperty(node, 'value', next);
    },
  };
}
