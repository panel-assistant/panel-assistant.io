import { createHash } from 'node:crypto';

// Pure pieces of the settings reference: which app versions get a page, and what a version's
// settings are, read from that version's own settings registry and English strings.

// The first release whose English strings live in app/src/main/assets/i18n/en.json.
export const FIRST_VERSION = '0.9.7';
const TAG = /^v(\d+)\.(\d+)\.(\d+)(?:-rc(\d+))?$/;
const VERSION = /^(\d+)\.(\d+)\.(\d+)(?:-rc(\d+))?$/;

// [major, minor, patch, rc], with a release sorting after every rc of its line.
export function parseVersion(text) {
  const m = VERSION.exec(String(text ?? '').trim());
  return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? Infinity : +m[4]] : null;
}

export function compareVersions(a, b) {
  const [x, y] = [parseVersion(a), parseVersion(b)];
  for (let i = 0; i < 4; i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  return 0;
}

// One set per release, plus each rc of a line that has no release yet: once a release is
// tagged, its rcs collapse into it. Newest first.
export function publishedVersions(tags) {
  const versions = tags.map((t) => TAG.exec(t)?.[0].slice(1)).filter(Boolean);
  const released = new Set(versions.filter((v) => !v.includes('-')));
  return [...new Set(versions)]
    .filter((v) => compareVersions(v, FIRST_VERSION) >= 0)
    .filter((v) => !v.includes('-') || !released.has(v.split('-')[0]))
    .sort((a, b) => compareVersions(b, a));
}

// The body of each top-level `SettingSpec(...)` in the SPECS list, skipping strings so a
// parenthesis inside help text cannot end a block early.
function specBlocks(source) {
  const start = source.indexOf('val SPECS: List<SettingSpec> = listOf(');
  const end = source.indexOf('\n    )', start);
  if (start < 0 || end < 0) throw new Error('SettingsRegistry.kt has no SPECS list');
  const list = source.slice(start, end);
  const blocks = [];
  const open = /\n\s*SettingSpec\(/g;
  let m;
  while ((m = open.exec(list))) {
    let depth = 1;
    let i = open.lastIndex;
    for (; depth > 0 && i < list.length; i++) {
      const c = list[i];
      if (c === '"') {
        for (i++; i < list.length && list[i] !== '"'; i++) if (list[i] === '\\') i++;
      } else if (c === '(') depth++;
      else if (c === ')') depth--;
    }
    blocks.push(list.slice(open.lastIndex, i - 1));
    open.lastIndex = i;
  }
  return blocks;
}

// A short fingerprint of one spec as written, so an explanation written against it can tell
// when the setting has changed under it.
export function specHash(block) {
  return createHash('sha256').update(block.replace(/\s+/g, ' ').trim()).digest('hex').slice(0, 12);
}

// Only facts that read well without explanation: an on/off default, a plain number or range,
// and the kind of Home Assistant entity. Codes and blank defaults are left to the prose.
function facts(block, constants) {
  const out = [];
  const def = /\bdefault = (?:"([^"]*)"|(\w+))/.exec(block);
  const value = def?.[1] ?? constants[def?.[2]];
  const type = /\btype = SettingType\.(\w+)/.exec(block)?.[1];
  if (type === 'BOOL' && (value === 'true' || value === 'false'))
    out.push(`Default ${value === 'true' ? 'on' : 'off'}`);
  else if (/^-?\d+(\.\d+)?$/.test(value ?? '')) out.push(`Default ${value}`);
  const bound = (name) => {
    const m = new RegExp(`\\b${name} = (-?[\\d.]+)`).exec(block);
    return m ? String(Number(m[1])) : null;
  };
  const [min, max] = [bound('min'), bound('max')];
  if (min !== null && max !== null) out.push(`${min} to ${max}`);
  const entity = /\bha = haEntity\("(\w+)"/.exec(block)?.[1];
  if (entity) out.push(`Home Assistant ${entity.replaceAll('_', ' ')}`);
  return out;
}

// The settings the app's Configure page shows (SettingsRegistry.schemaVisibleSpecs: a read-only
// spec always carries an HA entity, so only `hidden` removes one), in the app's order, grouped
// by card, with the English label and help from en.json.
export function extractSettings(registrySource, enJson) {
  const strings = JSON.parse(enJson).strings;
  const text = (key) => strings[key]?.text;
  // A key may be written as one of the registry's own string constants.
  const constants = Object.fromEntries(
    [...registrySource.matchAll(/\bconst val (\w+) = "([^"]*)"/g)].map((m) => [m[1], m[2]]),
  );
  const groups = [];
  for (const block of specBlocks(registrySource)) {
    const written = /\bkey = (?:"([a-z0-9_]+)"|(\w+))/.exec(block);
    const key = written?.[1] ?? constants[written?.[2]];
    const group = /\bgroup = "([^"]+)"/.exec(block)?.[1];
    if (!key || !group) throw new Error(`Unreadable SettingSpec: ${block.slice(0, 80)}`);
    if (/\bhidden = true\b/.test(block)) continue;
    const label = text(`settings.${key}.label`);
    if (!label) throw new Error(`en.json has no label for setting ${key}`);
    let card = groups.find((g) => g.name === group);
    if (!card) groups.push((card = { name: group, settings: [] }));
    card.settings.push({
      key,
      label,
      help: text(`settings.${key}.help`) ?? '',
      advanced: !/\btier = Tier\.BASIC\b/.test(block),
      facts: facts(block, constants),
      spec: specHash(block),
    });
  }
  const known = new Set(groups.flatMap((g) => g.settings.map((s) => s.key)));
  const hiddenOrUnknown = Object.keys(strings)
    .map((k) => /^settings\.([a-z0-9_]+)\.label$/.exec(k)?.[1])
    .filter((k) => k && !known.has(k) && !registrySource.includes(`"${k}"`));
  if (hiddenOrUnknown.length)
    throw new Error(`en.json labels settings the registry lacks: ${hiddenOrUnknown.join(', ')}`);
  return groups;
}
