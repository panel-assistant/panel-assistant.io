import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Panel pages carry free front matter by convention rather than contract, so unknown keys pass
// through to entry data instead of being stripped. The hardware table reads whatever is there.
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: z.looseObject({}) }),
  }),
};
