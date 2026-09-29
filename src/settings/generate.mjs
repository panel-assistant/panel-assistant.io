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

export const versionSlug = (version) => `v${version.replaceAll('.', '-')}`;
const escape = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function page(version, groups, latest) {
  const lines = [
    '---',
    `title: Settings in ${version}`,
    `description: Every setting on the Configure page of Panel Assistant ${version}, grouped as the app shows them.`,
    'sidebar:',
    '  hidden: true',
    'pagefind: ' + (version === latest),
    '---',
    '',
    `These are the settings on the Configure page of version ${version}, in the order the app shows them. Settings marked Advanced are hidden while the page is set to Basic.`,
    '',
    '[Other versions](/reference/settings/)',
  ];
  for (const group of groups) {
    lines.push('', `## ${group.name}`);
    for (const s of group.settings) {
      lines.push(
        '',
        `<h3 id="${s.key}">${escape(s.label)}</h3>`,
        '',
        `\`${s.key}\`${s.advanced ? ' · Advanced' : ''}`,
      );
      if (s.help) lines.push('', escape(s.help));
    }
  }
  return lines.join('\n') + '\n';
}

function index(versions) {
  return [
    '---',
    'title: Settings reference',
    'description: The settings on the Configure page, for each released version of Panel Assistant.',
    '---',
    '',
    'Each release has its own list of settings, generated from that release. While a release candidate is being tested it has a list too, until the release replaces it.',
    '',
    ...versions.map((v) => `- [${v}](/reference/settings/${versionSlug(v)}/)`),
    '',
  ].join('\n');
}

if (!existsSync(cache)) execFileSync('git', ['init', '--quiet', '--bare', cache]);
const tags = git('ls-remote', '--tags', '--refs', source)
  .split('\n')
  .map((line) => line.split('refs/tags/')[1])
  .filter(Boolean);
const versions = publishedVersions(tags);
if (!versions.length) throw new Error(`No published app versions found at ${source}`);

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
const published = {};
for (const version of versions) {
  const tag = `v${version}`;
  git('fetch', '--quiet', '--depth=1', '--no-tags', source, `+refs/tags/${tag}:refs/tags/${tag}`);
  const groups = extractSettings(
    git('show', `${tag}:${registry}`),
    git('show', `${tag}:${strings}`),
  );
  writeFileSync(join(output, `${versionSlug(version)}.md`), page(version, groups, versions[0]));
  published[version] = {
    path: `/reference/settings/${versionSlug(version)}/`,
    keys: groups.flatMap((g) => g.settings.map((s) => s.key)),
  };
}
writeFileSync(join(output, 'index.md'), index(versions));
writeFileSync(manifest, JSON.stringify({ versions: published }, null, 2) + '\n');
console.log(`settings reference: ${versions.join(', ')}`);
