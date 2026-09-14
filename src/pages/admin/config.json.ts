// The editor's configuration, generated from the panel pages at build time. See src/editor/config.mjs.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { editorConfig } from '../../editor/config.mjs';
import settings from '../../../worker/editor.json' with { type: 'json' };

export const GET: APIRoute = async () => {
  const panels = await getCollection('docs', (e) => e.id.startsWith('hardware/panels/'));
  const entries = panels.map((p): Record<string, unknown> => p.data);
  return new Response(JSON.stringify(editorConfig(entries, settings), null, 2) + '\n', {
    headers: { 'content-type': 'application/json' },
  });
};
