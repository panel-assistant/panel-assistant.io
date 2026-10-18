// Checks the built site: run after `npm run build`, like the topic tests.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import {
  EVIDENCE,
  confidence,
  confidenceChecklist,
  maker,
  OLD_PANEL_URLS,
  PANELS_DIR,
  panelRedirects,
} from './catalogue.mjs';

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
    const statement = (html.match(/<div id="sold-as"[^>]*>([\s\S]*?)<\/table>/)?.[1] ?? '').replace(
      /<[^>]+>/g,
      ' ',
    );
    for (const { brand, name } of data.sold_as) {
      assert.match(
        statement,
        new RegExp(`${brand}\\s+${name.replace(/[+()]/g, '\\$&')}\\s`),
        `${slug} does not say it is sold as ${brand} ${name}`,
      );
      // Another brand's group in the sidebar holds a link with this name to this page; the
      // maker's own other names are listed on the page only.
      const group =
        sidebar.match(new RegExp(`<summary[^>]*>[\\s\\S]*?>${brand}<[\\s\\S]*?</details>`))?.[0] ??
        '';
      const entry = new RegExp(
        `href="${slug}#sold-as"[^>]*>\\s*<span[^>]*>${name.replace(/[+()]/g, '\\$&')}<`,
      );
      if (brand === maker(data.vendor))
        assert.doesNotMatch(group, entry, `${brand} lists its own alias ${name}`);
      else assert.match(group, entry, `${brand} has no ${name} entry`);
    }
  }
});

test('a page that several menu entries lead to says how those models differ', () => {
  const covering = panels.filter((p) => p.data.covers?.length);
  assert.ok(covering.length >= 1);
  for (const { slug, data } of covering) {
    const table = (
      page(slug).match(/<div id="sold-as"[^>]*>([\s\S]*?)<\/table>/)?.[1] ?? ''
    ).replace(/<[^>]+>/g, ' ');
    for (const { name, note } of data.covers) {
      assert.ok(note, `${slug}: ${name} has no note saying how it differs`);
      assert.ok(table.includes(name) && table.includes(note), `${slug} does not describe ${name}`);
    }
  }
});

test('the panel menu carries no badges', () => {
  const sidebar = page('/hardware/').match(/<nav[^>]*aria-label="Main"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.ok(sidebar.includes('Electron'));
  assert.doesNotMatch(sidebar, /sl-badge/);
});

test('the supported-panels page lists every brand and model that runs Panel Assistant', () => {
  const html = page('/install/supported-panels/');
  const listed = html.match(/<div class="brands[\s\S]*?<\/div>/)?.[0] ?? '';
  for (const { slug, data } of panels) {
    const href = `href="${slug}`;
    if (data.panelIndex) continue;
    if (parseFloat(String(data.android)) < 8) {
      assert.ok(!listed.includes(`${href}"`), `${slug} is below Android 8 but listed`);
      continue;
    }
    assert.ok(listed.includes(`${href}"`), `${slug} is missing`);
    for (const { brand } of data.sold_as ?? [])
      assert.ok(listed.includes(`>${brand}<`), `${brand} is missing`);
  }
});

test('every panel records its evidence, and its confidence bar shows on its page and in the guide', () => {
  const guide = page('/install/supported-panels/');
  for (const { slug, data } of panels) {
    if (data.panelIndex) continue;
    assert.ok(Array.isArray(data.evidence), `${slug} has no evidence list`);
    for (const k of data.evidence) assert.ok(EVIDENCE[k], `${slug}: unknown evidence "${k}"`);
    // An inspected panel scores 8 to 10 and always ranks above one that is not.
    const { score } = confidence(data);
    if (data.evidence.includes('bench')) assert.ok(score >= 8 && score <= 10, `${slug}: ${score}`);
    else assert.ok(score >= 0 && score <= 7, `${slug}: ${score}`);
    assert.match(
      page(slug),
      /class="confidence[^"]*"[^>]*aria-label="Confidence: /,
      `${slug} shows no bar`,
    );
    if (parseFloat(String(data.android)) >= 8) {
      assert.match(
        guide,
        new RegExp(`href="${slug}"[\\s\\S]{0,400}?aria-label="Confidence: `),
        `${slug} has no bar in the guide`,
      );
    }
  }
});

test('each panel page lists its evidence with every hit and miss marked', () => {
  for (const { slug, data } of panels) {
    if (data.panelIndex) continue;
    const html = page(slug);
    const shown = [
      ...html.matchAll(/class="item (hit|part|miss)[^"]*">[\s\S]*?<\/span>([^<]*)/g),
    ].map((m) => `${m[1]} ${m[2].replace(/&#39;/g, "'").trim()}`);
    const expected = confidenceChecklist(data).map((c) => `${c.state} ${c.text}`);
    // The page shows its list open under the title; the same list is in the bar's hover panel.
    assert.deepEqual(shown.slice(0, expected.length), expected, slug);
  }
});

test('the hardware overview defines every support label its table shows', () => {
  const html = page('/hardware/');
  const terms = html.match(/column uses ([\s\S]*?)<\/p>/)?.[1] ?? '';
  for (const { slug, data } of panels) {
    if (data.panelIndex) continue;
    const label = String(data.support).toLowerCase();
    assert.ok(
      terms.includes(`${label} (`),
      `${slug}: "${data.support}" is not defined on /hardware/`,
    );
  }
});
