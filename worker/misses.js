// What gets recorded when a /go topic is unknown: the topic alone, never its
// parameters, reduced to a short safe key so the record cannot be inflated with
// random strings. Anything that is not a plausible topic is counted once under
// "malformed". Recording is fire-and-forget into Workers Analytics Engine, which
// samples under load, so a flood costs the sender bandwidth and the site nothing.
const MAX_KEY = 48;
const SAFE = /^[a-z0-9-]+$/;

export function missKey(topic) {
  const key = String(topic ?? '')
    .trim()
    .toLowerCase();

  if (!key || key.length > MAX_KEY || !SAFE.test(key)) return 'malformed';
  return key;
}

export function recordMiss(sink, topic) {
  if (!sink) return null;
  const key = missKey(topic);
  try {
    sink.writeDataPoint({ indexes: [key], blobs: [key], doubles: [1] });
  } catch {
    // A recording failure must never affect the redirect.
  }
  return key;
}
