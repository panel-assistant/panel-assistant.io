import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

// Panel pages carry free front matter by convention rather than contract, so unknown keys pass
// through to entry data instead of being stripped. The hardware table reads whatever is there.
// The site's own interface text (header, homepage hero, footer, comments, sidebar) lives in
// src/content/i18n/<lang>.json beside Starlight's; a missing key falls back to English.
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: z.looseObject({}) }),
  }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
