// The hardware table has no declared field list. Its columns are the union of the front-matter keys
// the panel pages actually carry, so a new key on one page becomes a column with no code change.
// Near-duplicate spellings are reported so conventions converge instead of splitting a column.

// Keys that Starlight itself defines for every page. They describe the page, not the panel.
const PAGE_KEYS = new Set([
  'title',
  'description',
  'slug',
  'editUrl',
  'head',
  'tableOfContents',
  'template',
  'hero',
  'lastUpdated',
  'prev',
  'next',
  'sidebar',
  'banner',
  'badge',
  'pagefind',
  'draft',
  // Vendor product photos: shown as a thumbnail (HardwareTable) or a gallery (PageTitle), never as
  // a text column, and curated by maintainers rather than offered as an editor form field.
  'photos',
  'photoCredit',
]);

/** Panel fields across all entries: most widely used first, then first appearance. */
export function collectFields(entries) {
  const counts = new Map();
  for (const data of entries) {
    for (const key of Object.keys(data ?? {})) {
      if (PAGE_KEYS.has(key)) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([key]) => key);
}

const normalise = (key) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const next = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = next;
    }
  }
  return row[b.length];
}

/**
 * Pairs of keys that are probably the same field spelled two ways: identical once case and
 * separators are ignored (`soc`, `SoC`, `android_version`, `androidVersion`), or one edit apart
 * when both are long enough for that to be a typo rather than a different word (`screen`, `sreen`).
 */
export function nearDuplicates(keys) {
  const pairs = [];
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const a = normalise(keys[i]);
      const b = normalise(keys[j]);
      const close = a === b || (Math.min(a.length, b.length) >= 5 && editDistance(a, b) <= 1);
      if (close) pairs.push([keys[i], keys[j]]);
    }
  }
  return pairs;
}

/** Column heading from a key: `android_version` reads `Android version`, `soc` reads `SOC`. */
export function fieldLabel(key) {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
  if (words.length === 1 && words[0].length <= 3) return words[0].toUpperCase();
  const text = words.join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Table cell text for any front-matter value. */
export function cellText(value) {
  if (value === undefined || value === null || value === '') return '';
  if (Array.isArray(value)) return value.map(cellText).filter(Boolean).join(', ');
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([k, v]) => `${fieldLabel(k)}: ${cellText(v)}`)
      .join('; ');
  }
  return String(value);
}
