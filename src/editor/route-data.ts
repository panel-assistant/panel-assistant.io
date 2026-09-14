// Gives each panel page Starlight's own "Edit page" link, pointing at that page in the editor. Pages
// the editor does not handle keep no edit link.
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { editUrlFor } from './config.mjs';
import settings from '../../worker/editor.json' with { type: 'json' };

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const url = editUrlFor(route.entry.id, settings);
  if (url) route.editUrl = new URL(url);
});
