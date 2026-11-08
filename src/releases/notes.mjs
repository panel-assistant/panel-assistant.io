// The release-notes page, built from the full notes kept beside this file: one Markdown file per
// release and rc, under notes/panel-assistant/ and notes/panel-app/. These files are the only
// copy of the full notes. GitHub release bodies and the Home Assistant update dialog carry a
// short summary that links here, and rc tags are deleted on GitHub at a promote, so nothing else
// keeps the record. Each Panel Assistant file names the panel app releases it pairs with in its
// `app` list; their notes are shown inside its section, marked with the app version.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { compareVersions, parseVersion } from '../settings/extract.mjs';

export const COMPONENTS = {
  'panel-assistant': 'Panel Assistant',
  'panel-app': 'panel app',
};

export const anchor = (component, version) => `${component}-${version.replace(/\./g, '-')}`;

// The small front matter these files use: `key: value` lines, and `[a, b]` lists.
export function parseNote(text, file) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!m) throw new Error(`${file}: no front matter`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = /^(\w+):\s*(.*)$/.exec(line);
    if (!kv) throw new Error(`${file}: unreadable front matter line "${line}"`);
    const raw = kv[2].trim();
    meta[kv[1]] = raw.startsWith('[')
      ? raw
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : raw;
  }
  if (!parseVersion(meta.version)) throw new Error(`${file}: bad version "${meta.version}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? '')) throw new Error(`${file}: bad date`);
  if (meta.prerelease !== String(meta.version.includes('-')))
    throw new Error(`${file}: prerelease must be ${meta.version.includes('-')}`);
  return {
    version: meta.version,
    date: meta.date,
    prerelease: meta.prerelease === 'true',
    app: meta.app ?? [],
    body: m[2].trim(),
  };
}

export function readNotes(dir) {
  const notes = {};
  for (const component of Object.keys(COMPONENTS)) {
    notes[component] = new Map();
    for (const file of readdirSync(join(dir, component)).filter((f) => f.endsWith('.md'))) {
      const note = parseNote(readFileSync(join(dir, component, file), 'utf8'), file);
      if (file !== `${note.version}.md`) throw new Error(`${file}: name must match its version`);
      notes[component].set(note.version, note);
    }
  }
  for (const pa of notes['panel-assistant'].values())
    for (const v of pa.app)
      if (!notes['panel-app'].has(v))
        throw new Error(
          `Panel Assistant ${pa.version} pairs with panel app ${v}, which has no notes`,
        );
  return notes;
}

// Headings inside a release sit below the release's own heading.
const demote = (body, levels) =>
  body.replace(/^(#{1,5}) /gm, (_, h) => '#'.repeat(Math.min(6, h.length + levels)) + ' ');

function section(component, note, inner) {
  const id = anchor(component, note.version);
  const label = component === 'panel-app' ? 'Panel app' : COMPONENTS[component];
  const kind = note.prerelease ? ' · pre-release' : '';
  return [
    `<section class="release" id="${id}" data-version="${note.version}" data-prerelease="${note.prerelease}">`,
    `<details open>`,
    `<summary><span class="release-title">${label} ${note.version}</span> <span class="release-meta">${note.date}${kind}</span></summary>`,
    '',
    inner,
    '',
    `</details>`,
    `</section>`,
  ].join('\n');
}

function appBlock(note) {
  return [
    `<div class="release-app" id="${anchor('panel-app', note.version)}" data-component="panel-app">`,
    '',
    `### Panel app changes (panel app ${note.version})`,
    '',
    demote(note.body, 1),
    '',
    `</div>`,
  ].join('\n');
}

export function render(notes) {
  const pas = [...notes['panel-assistant'].values()].sort((a, b) =>
    compareVersions(b.version, a.version),
  );
  const paired = new Set(pas.flatMap((p) => p.app));
  const orphans = [...notes['panel-app'].values()].filter((n) => !paired.has(n.version));
  const entries = [
    ...pas.map((p) => ({ date: p.date, version: p.version, html: paSection(p) })),
    ...orphans.map((n) => ({ date: n.date, version: n.version, html: orphanSection(n) })),
  ].sort((a, b) => b.date.localeCompare(a.date) || compareVersions(b.version, a.version));

  function paSection(p) {
    const inner = [
      `<div data-component="panel-assistant">`,
      '',
      demote(p.body, 0),
      '',
      `</div>`,
      ...p.app.map((v) => appBlock(notes['panel-app'].get(v))),
    ].join('\n\n');
    return section('panel-assistant', p, inner);
  }
  // An app release no Panel Assistant release pairs with yet still has its own section.
  function orphanSection(n) {
    return section('panel-app', n, appBlock(n).replace(/ id="[^"]*"/, ''));
  }

  const options = entries
    .map((e) => {
      const id = e.html.match(/id="([^"]+)"/)[1];
      return `<option value="${id}" data-prerelease="${e.version.includes('-')}">${e.html.match(/release-title">([^<]+)</)[1]}</option>`;
    })
    .join('');

  return `---
title: Release notes
description: What changed in every Panel Assistant and panel app release, newest first.
tableOfContents: false
editUrl: false
---

Every Panel Assistant release, newest first, with the panel app changes it brings. Home Assistant's update dialog shows a short summary; this page has the full notes. Lines from the panel app are marked with its version.

<form class="release-controls" hidden>
<label><input type="checkbox" id="release-show-pre"> Show pre-releases</label>
<label>Show <select id="release-component"><option value="all">All</option><option value="panel-assistant">Panel Assistant</option><option value="panel-app">Panel app</option></select></label>
<label>Go to <select id="release-jump"><option value="">Version…</option>${options}</select></label>
</form>

${entries.map((e) => e.html).join('\n\n')}

<script>
${CLIENT}
</script>
`;
}

// Without JavaScript every release is shown and open. With it, pre-releases hide unless asked
// for, only the newest release stays open, and a linked release opens and shows even if it is
// a pre-release.
const CLIENT = `(() => {
  const form = document.querySelector('.release-controls');
  if (!form) return;
  const pre = document.getElementById('release-show-pre');
  const component = document.getElementById('release-component');
  const jump = document.getElementById('release-jump');
  const sections = [...document.querySelectorAll('section.release')];
  const target = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && document.getElementById(id);
    return el ? el.closest('section.release') : null;
  };
  const apply = () => {
    const t = target();
    if (t && t.dataset.prerelease === 'true') pre.checked = true;
    for (const s of sections) s.hidden = s.dataset.prerelease === 'true' && !pre.checked;
    for (const o of jump.options) if (o.dataset.prerelease === 'true') o.hidden = !pre.checked;
    for (const b of document.querySelectorAll('section.release [data-component]'))
      b.hidden = component.value !== 'all' && b.dataset.component !== component.value;
    for (const s of sections)
      if (s.querySelector(':scope > details > [data-component]') &&
          ![...s.querySelectorAll(':scope > details > [data-component]')].some((b) => !b.hidden))
        s.hidden = true;
  };
  const visible = sections.filter((s) => s.dataset.prerelease !== 'true');
  for (const s of sections) s.querySelector('details').open = s === (target() ?? visible[0] ?? sections[0]);
  pre.addEventListener('change', apply);
  component.addEventListener('change', apply);
  jump.addEventListener('change', () => {
    if (!jump.value) return;
    location.hash = jump.value;
    jump.value = '';
  });
  addEventListener('hashchange', () => {
    apply();
    const t = target();
    if (t) { t.querySelector('details').open = true; document.getElementById(decodeURIComponent(location.hash.slice(1))).scrollIntoView(); }
  });
  form.hidden = false;
  apply();
  const t = target();
  if (t) document.getElementById(decodeURIComponent(location.hash.slice(1))).scrollIntoView();
})();`;
