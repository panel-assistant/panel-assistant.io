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

/** Every brand and product name a panel page is sold under, its own maker first. */
export function soldAs(data) {
  const extra = Array.isArray(data.sold_as) ? data.sold_as : [];
  if (extra.length === 0) return [];
  return [{ brand: maker(data.vendor), name: data.sidebar?.label ?? data.model }, ...extra];
}

function readPages(dir) {
  const pages = [];
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !/\.mdx?$/.test(entry.name)) continue;
    const file = join(entry.parentPath, entry.name);
    const data = parse(readFileSync(file, 'utf8').split(/^---$/m)[1]);
    const path = relative(join(dir, '..', '..'), file)
      .replace(/\.mdx?$/, '')
      .replace(/(^|\/)index$/, '');
    pages.push({ slug: path, data });
  }
  return pages;
}

/** Sidebar items for Hardware → Panels: one group per brand, alphabetical. */
export function panelsSidebar(dir = PANELS_DIR) {
  const groups = new Map();
  const add = (brand, item, rank) => {
    if (!groups.has(brand)) groups.set(brand, []);
    groups.get(brand).push({ item, rank });
  };
  for (const { slug, data } of readPages(dir)) {
    const order = data.sidebar?.order ?? 50;
    const label = data.sidebar?.label ?? data.title;
    const badge = data.sidebar?.badge;
    add(maker(data.vendor), { label, slug, ...(badge && { badge }) }, [0, order, label]);
    for (const { name, badge } of data.covers ?? []) {
      add(maker(data.vendor), { label: name, link: `/${slug}/`, badge }, [1, 0, name]);
    }
    // The anchor keeps an alias from being taken for the page itself, so the sidebar opens the
    // page's own manufacturer, not whichever brand sorts first.
    for (const { brand, name } of data.sold_as ?? []) {
      add(brand, { label: name, link: `/${slug}/#sold-as` }, [2, 0, name]);
    }
  }
  const byRank = (a, b) =>
    a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1] || a.rank[2].localeCompare(b.rank[2]);
  return [...groups.keys()]
    .sort((a, b) => a.localeCompare(b))
    .map((brand) => ({
      label: brand,
      items: groups
        .get(brand)
        .sort(byRank)
        .map((e) => e.item),
    }));
}
