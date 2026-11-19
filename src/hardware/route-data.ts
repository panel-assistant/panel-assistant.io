// The supported-panels page lists its brands in order of confidence, so its "On this page" menu
// carries them alphabetically, each leading to that brand's shelf or first card.
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { getCollection } from 'astro:content';
import { supportedPanels } from './catalogue.mjs';

const LIST_HEADING = 2;

export const onRequest = defineRouteMiddleware(async (context) => {
  const route = context.locals.starlightRoute;
  if (!/(^|\/)install\/supported-panels$/.test(route.entry.id) || !route.toc) return;
  // The list sits under the page's first section heading, whatever language names it.
  const section = route.toc.items.find(
    (item) => item.depth === LIST_HEADING && item.slug !== '_top',
  );
  if (!section) return;
  const pages = (await getCollection('docs', (e) => e.id.startsWith('hardware/panels/'))).map(
    (e) => ({ slug: e.id, data: e.data }),
  );
  section.children = supportedPanels(pages).index.map(({ brand, id }) => ({
    depth: LIST_HEADING + 1,
    slug: id,
    text: brand,
    children: [],
  }));
});
