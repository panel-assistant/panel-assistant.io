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
  soldAs,
  supportedPanels,
} from './catalogue.mjs';

const page = (path) => readFileSync(`dist${path}index.html`, 'utf8');
const isRedirect = (html) => html.includes('http-equiv="refresh"');
const soldAsSection = (html) => html.match(/<div id="sold-as"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';

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
    const statement = soldAsSection(html).replace(/<[^>]+>/g, ' ');
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
    const table = soldAsSection(page(slug)).replace(/<[^>]+>/g, ' ');
    for (const { name, note } of data.covers) {
      assert.ok(note, `${slug}: ${name} has no note saying how it differs`);
      assert.ok(table.includes(name) && table.includes(note), `${slug} does not describe ${name}`);
    }
  }
});

test('alias links land before product images with compact names or explicit differences', () => {
  for (const { slug, data } of panels) {
    if (!soldAs(data).length) continue;
    for (const prefix of prefixes) {
      const localizedPath = `src/content/docs${prefix}${slug.slice(0, -1)}.md`;
      const localData = existsSync(localizedPath)
        ? parse(readFileSync(localizedPath, 'utf8').split(/^---$/m)[1])
        : data;
      const names = soldAs(localData);
      const html = page(prefix + slug);
      const section = soldAsSection(html);
      assert.ok(section, `${prefix}${slug}: missing alias section`);
      assert.ok(
        html.indexOf('id="sold-as"') < html.indexOf('data-panel-images="hero"'),
        `${prefix}${slug}: aliases skip past product hero`,
      );
      if (names.some((name) => name.note?.trim())) {
        assert.match(section, /<table[\s>]/, `${prefix}${slug}: missing comparison`);
        for (const { note } of names) {
          if (note)
            assert.ok(
              section.replaceAll('&#39;', "'").replaceAll('&amp;', '&').includes(note),
              `${prefix}${slug}: missing name note`,
            );
        }
      } else {
        assert.match(
          section,
          /<ul\b[^>]*\bclass="[^"]*\bsold-as-names\b/,
          `${prefix}${slug}: missing names list`,
        );
        assert.doesNotMatch(section, /<table[\s>]/, `${prefix}${slug}: redundant names table`);
        assert.equal((section.match(/<li[\s>]/g) ?? []).length, names.length);
      }
    }
  }
});

test('the panel menu carries no badges', () => {
  const sidebar = page('/hardware/').match(/<nav[^>]*aria-label="Main"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.ok(sidebar.includes('Electron'));
  assert.doesNotMatch(sidebar, /sl-badge/);
});

// The list on the supported-panels page, up to the section that follows it.
const panelList = (html) => html.match(/data-panel-list[\s\S]*?<p class="none/)?.[0] ?? '';

test('the supported-panels page lists every brand and model that runs Panel Assistant', () => {
  const html = page('/install/supported-panels/');
  const listed = panelList(html);
  assert.ok(listed, 'no panel list on the page');
  for (const { slug, data } of panels) {
    const href = `href="${slug}`;
    if (data.panelIndex) continue;
    if (parseFloat(String(data.android)) < 8) {
      assert.ok(!listed.includes(`${href}"`), `${slug} is below Android 8 but listed`);
      continue;
    }
    assert.ok(listed.includes(`${href}"`), `${slug} is missing`);
    // Another brand's name for the hardware has a card of its own, leading to the same page.
    for (const { brand } of data.sold_as ?? []) {
      if (brand === maker(data.vendor)) continue;
      assert.match(
        listed,
        new RegExp(`data-search="${brand} [^"]*"[\\s\\S]{0,600}?href="${slug}#sold-as"`),
        `${brand} has no card for ${slug}`,
      );
    }
  }
});

test('every card has a picture slot for its page, named by brand and model', () => {
  const cards = panelList(page('/install/supported-panels/')).split('<li class="card').slice(1);
  assert.ok(cards.length > 20, `only ${cards.length} cards`);
  for (const card of cards) {
    const model = card.match(/data-panel-images="tile" data-panel-model="([^"]+)"/)?.[1];
    assert.ok(model, `a card has no picture slot: ${card.slice(0, 120)}`);
    assert.match(card, new RegExp(`href="/hardware/panels/${model}/(#sold-as)?"`));
    assert.match(card, /data-panel-alt="[^"]{4,}"/);
  }
});

test('the page menu lists every brand alphabetically, each reaching its shelf or first card', () => {
  for (const prefix of prefixes) {
    const html = page(`${prefix}/install/supported-panels/`);
    const menu = html.match(/<starlight-toc[\s\S]*?<\/starlight-toc>/)?.[0] ?? '';
    const brands = [...menu.matchAll(/href="#(brand-[a-z0-9-]+)"[^>]*>\s*<span[^>]*>([^<]+)</g)];
    assert.ok(brands.length > 10, `${prefix}: ${brands.length} brands in the menu`);
    const names = brands.map((b) => b[2].trim());
    assert.deepEqual(
      names,
      [...names].sort((a, b) => a.localeCompare(b)),
      prefix,
    );
    for (const [, id] of brands)
      assert.equal(
        html.split(` id="${id}"`).length,
        2,
        `${prefix}: #${id} is not on the page once`,
      );
  }
});

const sample = (vendor, label, evidence, extra = {}) => ({
  slug: `hardware/panels/${vendor.toLowerCase()}/${label.toLowerCase()}`,
  data: {
    vendor,
    title: `${vendor} ${label}`,
    sidebar: { label },
    android: '11',
    evidence,
    ...extra,
  },
});

test('brands are shelved by confidence, small brands share the last shelf, and nothing is lost', () => {
  const { names, shelves, index } = supportedPanels([
    sample('Zed', 'One', ['documented']),
    sample('Tuya', 'Solo', ['documented']),
    sample('Big', 'M', ['documented'], { sidebar: { label: 'M', order: 1 } }),
    sample('Big', 'B', ['bench', 'open'], {
      sold_as: [
        { brand: 'Relabel', name: 'B2' },
        { brand: 'Big', name: 'B Plus' },
      ],
      covers: [{ name: 'B Mini' }],
    }),
    sample('Big', 'C', ['documented'], { sidebar: { label: 'C', order: 2 } }),
    sample('Old', 'Seven', ['documented'], { android: '7.0' }),
    { slug: 'hardware/panels/big', data: { vendor: 'Big', title: 'Big', panelIndex: true } },
  ]);
  assert.deepEqual(
    shelves.map((s) => [s.brand, s.cards.map((c) => `${c.brand} ${c.name}`)]),
    [
      // Equal confidence keeps the order of the brand's menu, not the alphabet.
      ['Big', ['Big B', 'Big M', 'Big C']],
      // A relabelled panel is as sure as the hardware it is, so it leads the shared shelf.
      // A brand visitors look for by name keeps a shelf of its own, one card wide.
      ['Tuya', ['Tuya Solo']],
      [null, ['Relabel B2', 'Zed One']],
    ],
  );
  assert.deepEqual(
    shelves.map((s) => s.span),
    [3, 1, 3],
  );
  const [best] = shelves[0].cards;
  assert.deepEqual([best.also, best.covers, best.sameAs], [['B Plus'], ['B Mini'], undefined]);
  const [relabel, zed] = shelves[2].cards;
  assert.deepEqual(
    [relabel.sameAs, relabel.anchor, relabel.id],
    ['Big B', 'sold-as', 'brand-relabel'],
  );
  assert.equal(zed.id, 'brand-zed');
  assert.match(best.search, /Big B .*B Plus B Mini/);
  // Seven names: six cards and the model one of them also covers.
  assert.equal(names, 7);
  assert.deepEqual(
    index.map((i) => i.brand),
    ['Big', 'Relabel', 'Tuya', 'Zed'],
  );
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
        new RegExp(`href="${slug}"[\\s\\S]{0,1200}?aria-label="Confidence: `),
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
      ...html.matchAll(/class="item (hit|part|miss)[^"]*"[^>]*>[\s\S]*?<\/span>([^<]*)/g),
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
