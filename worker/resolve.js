// Maps a /go/<topic> request to its redirect target. Pure, so it can be tested
// without a Worker runtime. Query parameters travel through untouched to the
// site's own pages: shipped software sends v and build today, and may send more
// later without the site needing to know in advance. A destination off the site
// receives none of them, because a third party has no use for them and the
// reader's version is not theirs to collect.
import { pageMissKey } from './misses.js';

const PREFIX = '/go/';
// The only topic whose destination is parameter-driven rather than fixed: it
// takes `page=<old ha-paneld docs/ path>` and resolves it through the nested
// map at topics.docs, so an old link can be re-pointed with a one-line change
// there instead of a code change here.
const DOCS_TOPIC = 'docs';

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

export function resolve(requestUrl, topics) {
  const url = new URL(requestUrl);
  if (url.pathname !== '/go' && !url.pathname.startsWith(PREFIX)) return null;
  const topic = decodeURIComponent(url.pathname.slice(PREFIX.length)).replace(/\/+$/, '');
  if (topic === DOCS_TOPIC && typeof topics[DOCS_TOPIC] === 'object' && topics[DOCS_TOPIC]) {
    return resolveDocsTopic(url, topics[DOCS_TOPIC]);
  }
  const known = Object.prototype.hasOwnProperty.call(topics, topic) && !topic.startsWith('$');
  const target = new URL(known ? topics[topic] : '/', url.origin);
  if (target.origin === url.origin) {
    for (const [key, value] of url.searchParams) target.searchParams.append(key, value);
  }
  if (!known && topic) target.searchParams.set('go', topic);
  return { location: target.toString(), known, topic };
}
