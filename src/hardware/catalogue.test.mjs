// Checks the built site: run after `npm run build`, like the topic tests.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { maker, OLD_PANEL_URLS, PANELS_DIR, panelRedirects } from './catalogue.mjs';

const page = (path) => readFileSync(`dist${path}index.html`, 'utf8');
const isRedirect = (html) => html.includes('http-equiv="refresh"');

// Every language the built site serves the hardware pages under.
const prefixes = [
  '',
  ...readdirSync('dist', { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(`dist/${d.name}/hardware/panels`))
    .map((d) => `/${d.name}`),
];

test('every old panel URL, in every language, redirects to a real page', () => {
  assert.ok(prefixes.length > 1, 'expected language prefixes in dist');
  const redirects = Object.entries(panelRedirects(prefixes));
  assert.equal(redirects.length, Object.keys(OLD_PANEL_URLS).length * prefixes.length);
  for (const [from, to] of redirects) {
    const html = page(`${from}/`);
    assert.ok(
      isRedirect(html) && html.includes(`url=${to}"`),
      `${from} does not redirect to ${to}`,
    );
    assert.ok(!isRedirect(page(to)), `${to} is not a page`);
  }
});

const panels = readdirSync(PANELS_DIR, { recursive: true })
  .filter((f) => f.endsWith('.md'))
  .map((f) => ({
    slug: `/hardware/panels/${f.replace(/(\/?index)?\.md$/, '')}/`.replace('//', '/'),
    data: parse(readFileSync(`${PANELS_DIR}/${f}`, 'utf8').split(/^---$/m)[1]),
  }));

test('each brand name a board is sold under appears once and links to its one page', () => {
  const seen = new Map();
  for (const { slug, data } of panels) {
    const names = [
      [maker(data.vendor), data.sidebar?.label ?? data.title],
      ...(data.sold_as ?? []).map((s) => [s.brand, s.name]),
    ];
    for (const [brand, name] of names) {
      const key = `${brand} ${name}`;
      assert.ok(!seen.has(key), `${key} is on both ${seen.get(key)} and ${slug}`);
      seen.set(key, slug);
    }
  }
});

test('a board sold under other names lists them on its page and under each brand', () => {
  const sidebar = page('/hardware/');
  const oem = panels.filter((p) => p.data.sold_as?.length);
  assert.ok(oem.length >= 5);
  for (const { slug, data } of oem) {
    const html = page(slug);
    const statement = html.match(/<p id="sold-as"[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '';
    for (const { brand, name } of data.sold_as) {
      assert.ok(
        statement.includes(`${brand} ${name}`),
        `${slug} does not say it is sold as ${brand} ${name}`,
      );
      // The brand's group in the sidebar holds a link with this name to this page.
      const group =
        sidebar.match(new RegExp(`<summary[^>]*>[\\s\\S]*?>${brand}<[\\s\\S]*?</details>`))?.[0] ??
        '';
      assert.match(
        group,
        new RegExp(`href="${slug}#sold-as"[^>]*>\\s*<span[^>]*>${name.replace(/[+()]/g, '\\$&')}<`),
        `${brand} has no ${name} entry`,
      );
    }
  }
});
