// Maps a /go/<topic> request to its redirect target. Pure, so it can be tested
// without a Worker runtime. Query parameters travel through untouched: shipped
// software sends v and build today, and may send more later without the site
// needing to know in advance.
const PREFIX = '/go/';

export function resolve(requestUrl, topics) {
  const url = new URL(requestUrl);
  if (url.pathname !== '/go' && !url.pathname.startsWith(PREFIX)) return null;
  const topic = decodeURIComponent(url.pathname.slice(PREFIX.length)).replace(/\/+$/, '');
  const known = Object.prototype.hasOwnProperty.call(topics, topic) && !topic.startsWith('$');
  const target = new URL(known ? topics[topic] : '/', url.origin);
  for (const [key, value] of url.searchParams) target.searchParams.append(key, value);
  if (!known && topic) target.searchParams.set('go', topic);
  return { location: target.toString(), known, topic };
}
