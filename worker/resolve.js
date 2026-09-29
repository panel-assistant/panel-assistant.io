// Maps a /go/<topic> request to its redirect target. Pure, so it can be tested
// without a Worker runtime. Query parameters travel through untouched to the
// site's own pages: shipped software sends v and build today, and may send more
// later without the site needing to know in advance. A destination off the site
// receives none of them, because a third party has no use for them and the
// reader's version is not theirs to collect.
import { pageMissKey } from './misses.js';
import { compareVersions, parseVersion } from '../src/settings/extract.mjs';

const PREFIX = '/go/';
// The docs topic takes `page=<old ha-paneld docs/ path>` and resolves it through the nested
// map at topics.docs, so an old link can be re-pointed with a one-line change
// there instead of a code change here.
const DOCS_TOPIC = 'docs';
const FIRMWARE_TOPIC = 'firmware';
// The settings topic takes `v=<app version>`, `lang` and `section=<setting key>` and lands on the
// reference page for the nearest published version, at that setting. The app never learns page
// paths; the published versions come from the build's settings-versions.json.
const SETTINGS_TOPIC = 'settings';

// The newest published version at or below the reader's, else the oldest one; a version the
// router cannot read gets the newest. Every page is English, so `lang` needs no lookup yet.
function nearestVersion(requested, published) {
  const ordered = Object.keys(published).sort(compareVersions);
  if (!parseVersion(requested)) return ordered.at(-1);
  return ordered.filter((v) => compareVersions(v, requested) <= 0).at(-1) ?? ordered[0];
}

function resolveSettingsTopic(url, base, settings) {
  const published = settings?.versions ?? {};
  const version = nearestVersion(url.searchParams.get('v'), published);
  const section = url.searchParams.get('section');
  const target = new URL(version ? published[version].path : base, url.origin);
  for (const [key, value] of url.searchParams) {
    if (key !== 'section') target.searchParams.append(key, value);
  }
  const known = !section || Boolean(version && published[version].keys.includes(section));
  if (section && known) target.hash = section;
  return {
    location: target.toString(),
    known,
    topic: SETTINGS_TOPIC,
    missKey: known ? undefined : pageMissKey(section, 'settings-'),
  };
}

// Old paths arrive as e.g. "docs/hardware/nspanel-pro.md", "hardware/nspanel-pro",
// or "Hardware/NSPanel-Pro.md" — all of these must land on the same map entry.
function normalizeDocsPage(page) {
  return String(page ?? '')
    .trim()
    .toLowerCase()
    .replace(/^docs\//, '')
    .replace(/\.md$/, '')
    .replace(/^\/+|\/+$/g, '');
}

function resolveDocsTopic(url, docsMap) {
  const page = url.searchParams.get('page');
  const key = normalizeDocsPage(page);
  const known = key !== '' && Object.prototype.hasOwnProperty.call(docsMap, key);
  const target = new URL(known ? docsMap[key] : '/', url.origin);
  if (target.origin === url.origin) {
    for (const [paramKey, value] of url.searchParams) {
      if (paramKey === 'page') continue; // consumed by this resolver, not the destination page
      target.searchParams.append(paramKey, value);
    }
  }
  if (!known) {
    target.searchParams.set('go', DOCS_TOPIC);
    if (page) target.searchParams.set('page', page);
  }
  return {
    location: target.toString(),
    known,
    topic: DOCS_TOPIC,
    missKey: known ? undefined : pageMissKey(page),
  };
}

export function resolve(requestUrl, topics, settings) {
  const url = new URL(requestUrl);
  if (url.pathname !== '/go' && !url.pathname.startsWith(PREFIX)) return null;
  const topic = decodeURIComponent(url.pathname.slice(PREFIX.length)).replace(/\/+$/, '');
  if (topic === DOCS_TOPIC && typeof topics[DOCS_TOPIC] === 'object' && topics[DOCS_TOPIC]) {
    return resolveDocsTopic(url, topics[DOCS_TOPIC]);
  }
  if (topic === SETTINGS_TOPIC && typeof topics[SETTINGS_TOPIC] === 'string') {
    return resolveSettingsTopic(url, topics[SETTINGS_TOPIC], settings);
  }
  if (topic === FIRMWARE_TOPIC && typeof topics[FIRMWARE_TOPIC] === 'object') {
    const device = url.searchParams.get('device');
    const known = !device || Object.prototype.hasOwnProperty.call(topics.firmware, device);
    const target = new URL(topics.firmware[known ? device || 'all' : 'all'], url.origin);
    for (const [key, value] of url.searchParams) {
      if (key !== 'device') target.searchParams.append(key, value);
    }
    return {
      location: target.toString(),
      known,
      topic,
      missKey: known ? undefined : `firmware-${device}`,
    };
  }
  const known = Object.prototype.hasOwnProperty.call(topics, topic) && !topic.startsWith('$');
  const target = new URL(known ? topics[topic] : '/', url.origin);
  if (target.origin === url.origin) {
    for (const [key, value] of url.searchParams) target.searchParams.append(key, value);
  }
  if (!known && topic) target.searchParams.set('go', topic);
  return { location: target.toString(), known, topic };
}
