// Build the settings reference from the Android app's published tags: one page per version,
// written from that tag's own settings registry and English strings, so a page cannot drift
// from the build it describes. Generated Markdown and the version manifest are ignored by Git.
//
// SETTINGS_SOURCE names the app repository (a URL or a local clone); tags are fetched shallowly
// into a cache under node_modules and read with git show.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractSettings, publishedVersions } from './extract.mjs';
import { depthMatches, index, page, pageTitle, readDepth, versionSlug } from './render.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const source = process.env.SETTINGS_SOURCE ?? 'https://github.com/panel-assistant/android.git';
const cache = join(root, 'node_modules/.cache/settings-reference.git');
const output = join(root, 'src/content/docs/reference/settings');
const manifest = join(root, 'public/settings-versions.json');
const registry = 'app/src/main/kotlin/io/github/maxlyth/hapaneld/config/SettingsRegistry.kt';
const strings = 'app/src/main/assets/i18n/en.json';
const git = (...args) =>
  execFileSync('git', ['--git-dir', cache, ...args], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'inherit'],
  });

if (!existsSync(cache)) execFileSync('git', ['init', '--quiet', '--bare', cache]);
const tags = git('ls-remote', '--tags', '--refs', source)
  .split('\n')
  .map((line) => line.split('refs/tags/')[1])
  .filter(Boolean);
const versions = publishedVersions(tags);
if (!versions.length) throw new Error(`No published app versions found at ${source}`);

const depth = readDepth(join(root, 'src/settings/depth'));
const titleOf = (path) => pageTitle(join(root, 'src/content/docs'), path);
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
const published = {};
// One fetch for every tag rather than one per version. Each shallow fetch
// rewrites the repository's shallow bookkeeping, and doing that N times in a row
// is what produced "fatal: shallow file has changed since we read it" on the
// runner, on a different tag each run, while never reproducing locally.
git(
  'fetch',
  '--quiet',
  '--depth=1',
  '--no-tags',
  source,
  ...versions.map((version) => `+refs/tags/v${version}:refs/tags/v${version}`),
);
for (const version of versions) {
  const tag = `v${version}`;
  const groups = extractSettings(
    git('show', `${tag}:${registry}`),
    git('show', `${tag}:${strings}`),
  );
  // Retired settings stay out of the reference, including pages for older releases.
  for (const group of groups)
    group.settings = group.settings.filter((setting) => setting.key !== 'kiosk_companion_packages');
  writeFileSync(
    join(output, `${versionSlug(version)}.md`),
    page(version, groups, versions[0], versions.indexOf(version) + 1, depth, titleOf),
  );
  if (version === versions[0]) {
    const stale = groups
      .flatMap((g) => g.settings)
      .filter((st) => depth[st.key] && !depthMatches(depth[st.key], st.spec))
      .map((st) => st.key);
    if (stale.length)
      console.log(`settings reference: explanation out of date for ${stale.join(', ')}`);
  }
  published[version] = {
    path: `/reference/settings/${versionSlug(version)}/`,
    keys: groups.flatMap((g) => g.settings.map((s) => s.key)),
  };
}
const newest = published[versions[0]].keys;
const unexplained = newest.filter((key) => !depth[key]);
if (unexplained.length)
  console.log(`settings reference: no explanation yet for ${unexplained.join(', ')}`);
writeFileSync(join(output, 'index.md'), index(versions));
writeFileSync(manifest, JSON.stringify({ versions: published }, null, 2) + '\n');
console.log(`settings reference: ${versions.join(', ')}`);
