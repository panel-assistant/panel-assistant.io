// Copies the pinned Sveltia CMS bundle into public/admin/ so the editor is served from this site
// rather than a CDN. The output is gitignored; source maps are left out.
import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';

const from = new URL('../../node_modules/@sveltia/cms/dist/', import.meta.url);
const to = new URL('../../public/admin/', import.meta.url);

rmSync(to, { recursive: true, force: true });
mkdirSync(new URL('chunks/', to), { recursive: true });
const copied = [];
for (const dir of ['', 'chunks/']) {
  for (const name of readdirSync(new URL(dir, from))) {
    if (!name.endsWith('.js')) continue;
    cpSync(new URL(dir + name, from), new URL(dir + name, to));
    copied.push(dir + name);
  }
}
if (!copied.includes('sveltia-cms.js'))
  throw new Error('Sveltia CMS bundle not found in node_modules');
console.log(`editor bundle: ${copied.join(', ')}`);
