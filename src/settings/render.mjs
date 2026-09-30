// Markdown for the settings reference pages. Pure apart from reading the explanation files and
// related page titles from disk, so the rules for what a page shows can be tested directly.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Explanations written from the code and documents that delivered each setting, one file per
// setting key. Each names the spec fingerprint it was written against; a version whose spec
// differs shows the setting without it rather than an explanation that may no longer be true.
export function readDepth(dir) {
  const depth = {};
  for (const file of existsSync(dir) ? readdirSync(dir) : []) {
    if (!file.endsWith('.md')) continue;
    const text = readFileSync(join(dir, file), 'utf8');
    const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
    if (!m) throw new Error(`${file}: missing front matter`);
    const spec = /^spec: ([0-9a-f]{12})$/m.exec(m[1])?.[1];
    if (!spec) throw new Error(`${file}: missing spec fingerprint`);
    const related = [...m[1].matchAll(/^ {2}- (\/[^\s#]*\/(?:#[\w-]+)?)$/gm)].map((r) => r[1]);
    depth[file.slice(0, -3)] = { spec, related, body: m[2].trim() };
  }
  return depth;
}

// A related page is named by its own title, so a renamed page never leaves a stale link text.
export function pageTitle(docs, path) {
  const base = join(docs, path.split('#')[0].replace(/^\/|\/$/g, ''));
  for (const candidate of [
    `${base}.md`,
    `${base}.mdx`,
    join(base, 'index.md'),
    join(base, 'index.mdx'),
  ]) {
    if (!existsSync(candidate)) continue;
    const title = /^title: (.+)$/m.exec(readFileSync(candidate, 'utf8'))?.[1];
    if (title) return title.replace(/^['"]|['"]$/g, '');
  }
  throw new Error(`Related page ${path} does not exist`);
}

export const versionSlug = (version) => `v${version.replaceAll('.', '-')}`;
const escape = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function page(version, groups, latest, order, depth, titleOf) {
  const lines = [
    '---',
    `title: Settings in ${version}`,
    `description: Every setting on the Configure page of Panel Assistant ${version}, grouped as the app shows them.`,
    'sidebar:',
    `  label: "${version}"`,
    `  order: ${order}`,
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
        `<p class="setting-facts">${[s.advanced ? 'Advanced' : 'Basic', ...s.facts]
          .map(escape)
          .join(' · ')} · <code>${s.key}</code></p>`,
      );
      if (s.help) lines.push('', `<p>${escape(s.help)}</p>`);
      const more = depth[s.key]?.spec === s.spec ? depth[s.key] : null;
      if (more?.body) lines.push('', more.body);
      if (more?.related.length)
        lines.push(
          '',
          `Related: ${more.related.map((path) => `[${titleOf(path)}](${path})`).join(', ')}`,
        );
    }
  }
  return lines.join('\n') + '\n';
}

export function index(versions) {
  return [
    '---',
    'title: Settings reference',
    'sidebar:',
    '  label: All versions',
    '  order: 0',
    'description: The settings on the Configure page, for each released version of Panel Assistant.',
    '---',
    '',
    'Each release has its own list of settings, generated from that release. While a release candidate is being tested it has a list too, until the release replaces it.',
    '',
    ...versions.map((v) => `- [${v}](/reference/settings/${versionSlug(v)}/)`),
    '',
  ].join('\n');
}
