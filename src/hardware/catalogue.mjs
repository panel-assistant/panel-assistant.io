// Hardware → Panels, grouped by manufacturer. Each physical board has one page, under the maker that
// builds it; its `sold_as` front matter names the other brands and product names it is sold under,
// and each of those becomes an entry under that brand linking to the same page. A family page's
// `covers` names models it covers without a page of their own. Nothing here is a list of panels:
// add a page or a front-matter entry and the sidebar follows.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'yaml';

export const PANELS_DIR = 'src/content/docs/hardware/panels';

// URLs from before the catalogue was grouped by manufacturer (2026-10-09). They must keep working.
export const OLD_PANEL_URLS = {
  '/hardware/panels/electron-wf1589t': '/hardware/panels/electron/wf1589t/',
  '/hardware/panels/zhicai-smt1019': '/hardware/panels/electron/wf2489t/',
  '/hardware/panels/zx-smt156': '/hardware/panels/electron/smt156/',
  '/hardware/panels/smatek-s9e': '/hardware/panels/smatek/s9e/',
  '/hardware/panels/tuya-tpa10': '/hardware/panels/tuya/tpa10/',
  '/hardware/panels/sonoff-nspanel-pro': '/hardware/panels/sonoff/',
  '/hardware/panels/sonoff-nspanel-pro/86p': '/hardware/panels/sonoff/nspanel-pro-86p/',
  '/hardware/panels/sonoff-nspanel-pro/120p': '/hardware/panels/sonoff/nspanel-pro-120p/',
  '/hardware/panels/meta-portal': '/hardware/panels/meta/',
  '/hardware/panels/meta-portal/portal-10-gen2': '/hardware/panels/meta/portal-10-gen2/',
};

/** `OLD_PANEL_URLS` under each language prefix ('' for English). */
export const panelRedirects = (prefixes) =>
  Object.fromEntries(
    prefixes.flatMap((p) => Object.entries(OLD_PANEL_URLS).map(([from, to]) => [p + from, p + to])),
  );

/** The manufacturer a `vendor` value names: "Electron (probable)" is grouped under Electron. */
export const maker = (vendor) => String(vendor ?? '').replace(/\s*\(.*\)\s*$/, '');

/**
 * Every name a panel page answers to, its own first: other names for the same hardware
 * (`sold_as`) and other models the page covers (`covers`, the page's own maker). Each carries the
 * `note` saying how it differs, if it does.
 */
export function soldAs(data) {
  const own = maker(data.vendor);
  const extra = [
    ...(Array.isArray(data.sold_as) ? data.sold_as : []),
    ...(Array.isArray(data.covers) ? data.covers : []).map((c) => ({ brand: own, ...c })),
  ];
  if (extra.length === 0) return [];
  return [
    { brand: own, name: data.sidebar?.label ?? data.model, note: data.sold_as_note },
    ...extra,
  ];
}

function readPages(dir) {
  const pages = [];
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    // A leading underscore marks a shared partial, not a page.
    if (!entry.isFile() || !/^[^_].*\.mdx?$/.test(entry.name)) continue;
    const file = join(entry.parentPath, entry.name);
    const data = parse(readFileSync(file, 'utf8').split(/^---$/m)[1]);
    const path = relative(join(dir, '..', '..'), file)
      .replace(/\.mdx?$/, '')
      .replace(/(^|\/)index$/, '');
    pages.push({ slug: path, data });
  }
  return pages;
}

/**
 * The catalogue grouped by brand, alphabetical: each panel page under its maker, the other
 * models a page covers, and another brand's name for the same hardware under that brand. Each
 * entry is `{ label, slug, anchor, data }`, `data` being the front matter of the page it leads to.
 * The menu and the supported-panels page both list the catalogue from this.
 */
export function catalogueGroups(pages) {
  const groups = new Map();
  const add = (brand, entry, rank) => {
    if (!groups.has(brand)) groups.set(brand, []);
    groups.get(brand).push({ entry, rank });
  };
  for (const { slug, data } of pages) {
    const order = data.sidebar?.order ?? 50;
    const label = data.sidebar?.label ?? data.title;
    // Status (untested, maker unconfirmed) is stated on the page, never as a menu badge.
    add(maker(data.vendor), { label, slug, data }, [0, order, label]);
    // Other models a page covers: own entries, landing on the page's table of differences.
    for (const { name } of data.covers ?? []) {
      add(maker(data.vendor), { label: name, slug, anchor: 'sold-as', data }, [1, 0, name]);
    }
    // Another brand's name for the same hardware gets an entry under that brand. The maker's own
    // alternative names are listed on the page only. The anchor keeps an alias from being taken
    // for the page itself, so the menu opens the page's own manufacturer.
    for (const { brand, name } of data.sold_as ?? []) {
      if (brand === maker(data.vendor)) continue;
      add(brand, { label: name, slug, anchor: 'sold-as', data }, [2, 0, name]);
    }
  }
  const byRank = (a, b) =>
    a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1] || a.rank[2].localeCompare(b.rank[2]);
  return [...groups.keys()]
    .sort((a, b) => a.localeCompare(b))
    .map((brand) => ({
      brand,
      entries: groups
        .get(brand)
        .sort(byRank)
        .map((e) => e.entry),
    }));
}

/** Sidebar items for Hardware → Panels: one group per brand, alphabetical. */
export function panelsSidebar(dir = PANELS_DIR) {
  return catalogueGroups(readPages(dir)).map(({ brand, entries }) => ({
    label: brand,
    items: entries.map(({ label, slug, anchor }) =>
      anchor ? { label, link: `/${slug}/#${anchor}` } : { label, slug },
    ),
  }));
}

/**
 * What raises confidence that a panel runs well. A panel we have inspected on a unit of our own
 * scores 8, and 9 or 10 as its maker's firmware is mostly or fully open to Panel Assistant
 * (maintainer, 2026-10-11). Any other panel scores from the rest of the evidence, up to 7, so an
 * inspected panel always ranks above one that is not. A panel we have not inspected starts at 4 for
 * the research behind its page. Reweight here; every bar follows.
 */
export const EVIDENCE = {
  bench: { points: 8, text: 'inspected on a unit we run' },
  open: { points: 2, text: "the maker's firmware leaves the panel fully open" },
  'mostly-open': { points: 1, text: "the maker's firmware leaves the panel mostly open" },
  firmware: { points: 1, text: "the maker's firmware examined" },
  documented: { points: 1, text: 'documented by the manufacturer or published specifications' },
  // Where nothing shows a difference, a panel from the same release or platform as one we have
  // inspected is trusted to behave like it (maintainer, 2026-10-11: err on the side of confidence).
  platform: { points: 5, text: 'same platform as a panel we have inspected' },
  owners: { points: 2, text: 'an owner reports it running Panel Assistant' },
};
const OPENNESS = ['open', 'mostly-open'];
// Every panel with its own page has been actively researched to write it and its profile, which
// counts for more than a passive report (maintainer, 2026-10-11).
const RESEARCHED = 4;
const OLD_ANDROID = 10;
const OLD_PENALTY = 2;

/** A panel's confidence, 0 to 10, and the evidence behind it, from its `evidence` front matter. */
export function confidence(data) {
  const have = (Array.isArray(data.evidence) ? data.evidence : []).filter((k) => EVIDENCE[k]);
  const sum = (keys) => keys.reduce((n, k) => n + EVIDENCE[k].points, 0);
  const reasons = have.map((k) => EVIDENCE[k].text);
  if (have.includes('bench')) {
    return { score: Math.min(10, 8 + sum(have.filter((k) => OPENNESS.includes(k)))), reasons };
  }
  // Old hardware running software we have not seen counts against a panel we have not inspected;
  // an inspected panel has already shown what its age means (maintainer, 2026-10-11).
  const android = parseFloat(String(data.android));
  const old = android < OLD_ANDROID;
  if (old) reasons.push(`runs Android ${data.android} and has not been inspected on a unit we run`);
  return {
    score: Math.max(0, Math.min(7, RESEARCHED + sum(have)) - (old ? OLD_PENALTY : 0)),
    reasons,
  };
}
