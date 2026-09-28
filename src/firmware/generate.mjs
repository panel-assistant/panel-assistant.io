// Build the public catalogue from the three source .dat files and the preserved data branches.
// Generated Markdown is ignored by Git; no page is edited by hand.
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const data = join(root, 'tools/firmware-index');
const output = join(root, 'src/content/docs/hardware/firmware/builds');
const sonoffHost = 'https://global-otadl2bsy.coolkit.cc';
const models = [
  { slug: 'sonoff-nspanel-pro-86p', name: 'Sonoff NSPanel Pro 86P', source: 'fw-86p.dat' },
  { slug: 'sonoff-nspanel-pro-120p', name: 'Sonoff NSPanel Pro 120P', source: 'fw-120p.dat' },
  { slug: 'shelly-wall-display', name: 'Shelly Wall Display', track: 'WallDisplay' },
  { slug: 'shelly-wall-display-x2', name: 'Shelly Wall Display X2', track: 'WallDisplay' },
  { slug: 'shelly-wall-display-x1i', name: 'Shelly Wall Display X1i', track: 'WallDisplayV2' },
  { slug: 'shelly-wall-display-x2i', name: 'Shelly Wall Display X2i', track: 'WallDisplayV2' },
  { slug: 'shelly-wall-display-xl', name: 'Shelly Wall Display XL', track: 'WallDisplayV2' },
];
const versionPattern = /^\d+(?:\.\d+){1,3}(?:-[A-Za-z0-9]+)?$/;
const clean = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('|', '&#124;');
const versionOrder = (a, b) => b.localeCompare(a, undefined, { numeric: true });
const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const versionSlug = (version) => `v${version.replaceAll('.', '-').toLowerCase()}`;
const pathFor = (slug, version) =>
  `/hardware/firmware/builds/${slug}/${version ? `${versionSlug(version)}/` : ''}`;

function assertVersion(version) {
  if (!versionPattern.test(version)) throw new Error(`Invalid firmware version: ${version}`);
}

function record(records, version, artifact) {
  assertVersion(version);
  if (!records.has(version)) records.set(version, []);
  records.get(version).push(artifact);
}

function parseSonoff(source) {
  const rows = readFileSync(join(data, source), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim());
  const metadata = Object.fromEntries(
    rows
      .filter((line) => /^(channel|diffsuffix|apkfmt) /.test(line))
      .map((line) => line.split(/ (.*)/s).slice(0, 2)),
  );
  if (
    !/^nspanel-pro(?:-ver120)?$/.test(metadata.channel) ||
    !/^(?:|V228)$/.test(metadata.diffsuffix ?? '') ||
    !/^(?:app|228V)$/.test(metadata.apkfmt)
  )
    throw new Error(`Invalid Sonoff metadata: ${source}`);
  const records = new Map();
  const base = `${sonoffHost}/${metadata.channel}`;
  for (const row of rows.filter((line) => /^(full|diff|apk)\|/.test(line))) {
    const [kind, version, index, ...rest] = row.split('|');
    if (!/^\d+$/.test(index)) throw new Error(`Invalid CDN index: ${row}`);
    if (kind === 'full') {
      const [filename, bytes] = rest;
      if (!/^[A-Za-z0-9_.-]+\.zip$/.test(filename) || !/^\d+$/.test(bytes))
        throw new Error(`Invalid ROM: ${row}`);
      record(records, version, {
        type: 'Full ROM',
        bytes: Number(bytes),
        url: `${base}/rom/${index}/${filename}`,
      });
    } else if (kind === 'diff') {
      for (const entry of rest) {
        const [from, bytes] = entry.split(':');
        assertVersion(from);
        if (!/^\d+$/.test(bytes)) throw new Error(`Invalid diff: ${row}`);
        record(records, version, {
          type: `Diff from ${from}`,
          bytes: Number(bytes),
          url: `${base}/rom-diff/${index}/CK_${from}_${version}${metadata.diffsuffix ?? ''}-diff.zip`,
        });
      }
    } else {
      const [bytes] = rest;
      if (!/^\d+$/.test(bytes)) throw new Error(`Invalid APK: ${row}`);
      record(records, version, {
        type: 'App APK',
        bytes: Number(bytes),
        url: `${base}/apk/${index}/${metadata.apkfmt}${version}.apk`,
      });
    }
  }
  return records;
}

function parseShelly() {
  const tracks = new Map([
    ['WallDisplay', new Map()],
    ['WallDisplayV2', new Map()],
  ]);
  for (const row of readFileSync(join(data, 'fw-shelly-walldisplay.dat'), 'utf8').split(/\r?\n/)) {
    if (!row || row.startsWith('#')) continue;
    const [track, version, buildId, bytes, discovered, url, capture] = row.split('|');
    if (
      !tracks.has(track) ||
      !/^\d+$/.test(bytes) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(discovered) ||
      !/^https:\/\/fwcdn\.shelly\.cloud\/gen2-ntest\//.test(url) ||
      (capture && !/^\d{14}$/.test(capture))
    )
      throw new Error(`Invalid Shelly entry: ${row}`);
    record(tracks.get(track), version, {
      type: 'OTA package',
      bytes: Number(bytes),
      url,
      buildId,
      discovered,
      capture,
    });
  }
  return tracks;
}

function branchJson(branch, path) {
  return JSON.parse(git('show', `${branch}:${path}`));
}

function availabilityHistory() {
  const commits = git('log', '--format=%H', 'firmware-status', '--', 'history.json')
    .trim()
    .split('\n')
    .filter(Boolean);
  if (!commits.length) throw new Error('firmware-status has no history.json commits');
  const byTime = new Map();
  for (const commit of commits) {
    for (const sample of branchJson(commit, 'history.json').samples ?? []) {
      if (!Number.isInteger(sample.t) || typeof sample.r !== 'object')
        throw new Error(`Invalid availability sample in ${commit}`);
      byTime.set(sample.t, sample.r);
    }
  }
  return [...byTime].sort(([a], [b]) => a - b);
}

function status(history, url) {
  const checks = history.filter(([, results]) => Object.hasOwn(results, url));
  if (!checks.length)
    return {
      summary: 'No checks recorded',
      full: 'No checks recorded yet.',
      first: '—',
      last: '—',
    };
  const latestDay = new Map();
  for (const [time, results] of checks)
    latestDay.set(new Date(time * 1000).toISOString().slice(0, 10), Boolean(results[url]));
  const months = new Map();
  for (const [day, up] of latestDay) {
    const month = day.slice(0, 7);
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(`${day.slice(8)}${up ? '✓' : '×'}`);
  }
  const [lastTime, results] = checks.at(-1);
  const last = new Date(lastTime * 1000).toISOString().slice(0, 10);
  const available = checks.filter(([, results]) => results[url]);
  return {
    summary: `${results[url] ? 'Available' : 'Unavailable'} on ${last}; ${checks.length} checks since ${new Date(checks[0][0] * 1000).toISOString().slice(0, 10)}`,
    full: [...months].map(([month, days]) => `${month}: ${days.join(' ')}`).join('\n'),
    first: available.length ? new Date(available[0][0] * 1000).toISOString().slice(0, 10) : '—',
    last: available.length ? new Date(available.at(-1)[0] * 1000).toISOString().slice(0, 10) : '—',
  };
}

function archiveLink(artifact, wayback) {
  const stamp = artifact.capture ?? wayback.files?.[artifact.url]?.wb;
  return stamp
    ? `[${stamp.slice(0, 4)}-${stamp.slice(4, 6)}-${stamp.slice(6, 8)}](https://web.archive.org/web/${stamp}/${artifact.url})`
    : 'No capture recorded';
}

function write(relative, body) {
  const target = join(output, relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, body);
}

const shelly = parseShelly();
const history = availabilityHistory();
const wayback = branchJson('wayback-state', 'wayback.json');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
const catalogue = [
  '---',
  'title: Firmware builds',
  'description: Browse the complete indexed Sonoff and Shelly firmware histories by model and version.',
  '---',
  '',
  '<style>.sl-markdown-content table th, .sl-markdown-content table td { white-space: nowrap; }</style>',
  '',
  'Browse every indexed build by model and version. Availability is measured by the daily URL monitor. A Wayback link appears only when a capture is recorded.',
  '',
  'The index is generated from [the source data files](https://github.com/panel-assistant/panel-assistant.io/tree/main/tools/firmware-index). A missing version means it has not been found; it does not prove that the vendor never released it.',
  '',
  'First and last seen are dates when our monitor successfully fetched that download, not release or removal dates. A dash means no successful check is recorded. Sizes are from the source index; open a version for exact bytes, downloads and archives. On a phone, swipe a table sideways to see every column.',
  '',
];
let versionPages = 0;
let artifactCount = 0;
for (const model of models) {
  const records = model.track ? shelly.get(model.track) : parseSonoff(model.source);
  const versions = [...records.keys()].sort(versionOrder);
  if (!versions.length) throw new Error(`No builds for ${model.name}`);
  catalogue.push(
    `## [${model.name}](${pathFor(model.slug, '')})`,
    '',
    `${versions.length} indexed versions${model.track ? ` on the shared ${model.track} OTA track` : ''}.`,
    '',
    '| Version | Download | Size | First seen | Last seen |',
    '| --- | --- | ---: | --- | --- |',
  );
  const modelPage = [
    '---',
    `title: ${model.name} firmware`,
    `description: Every indexed firmware version for ${model.name}.`,
    '---',
    '',
    '<style>.sl-markdown-content table th, .sl-markdown-content table td { white-space: nowrap; }</style>',
    '',
    model.track
      ? `This model uses Shelly’s shared **${model.track}** OTA track. The same package is also listed under the other models on that track.`
      : 'These URLs belong to this model’s own Sonoff CDN channel.',
    '',
    'The list records found builds, not an installation recommendation. [Read the firmware guide](/hardware/firmware/) before updating a panel.',
    '',
    'First and last seen are successful monitor checks, not release or removal dates. A dash means no successful check is recorded.',
    '',
    '| Version | Download | Size | First seen | Last seen |',
    '| --- | --- | ---: | --- | --- |',
  ];
  for (const version of versions) {
    const artifacts = records.get(version);
    artifactCount += artifacts.length;
    for (const artifact of artifacts) {
      const observed = status(history, artifact.url);
      const row = `| [${version}](${pathFor(model.slug, version)}) | ${clean(artifact.type)} | ${(artifact.bytes / 1048576).toFixed(1)} MiB | ${observed.first} | ${observed.last} |`;
      catalogue.push(row);
      modelPage.push(row);
    }
    const page = [
      '---',
      `title: ${model.name} ${version}`,
      `description: Download objects, availability history and archive links for ${model.name} firmware ${version}.`,
      '---',
      '',
      `[All ${model.name} versions](${pathFor(model.slug, '')}) · [Firmware guide](/hardware/firmware/)`,
      '',
      model.track
        ? `This is a **${model.track}** OTA package shared with other models on that track. Shelly replaces old CDN objects when a new version ships; use the archive link for an older build.`
        : 'A URL here is a CDN observation, not a claim that this upgrade path has been tested on hardware.',
      '',
    ];
    for (const artifact of artifacts) {
      const observed = status(history, artifact.url);
      page.push(
        `## ${clean(artifact.type)}`,
        '',
        `- [Vendor download](${artifact.url})`,
        `- Archive: ${archiveLink(artifact, wayback)}`,
        `- Size: ${artifact.bytes.toLocaleString('en-US')} bytes`,
        `- Availability: ${observed.summary}`,
      );
      if (artifact.buildId)
        page.push(
          `- Build ID: \`${clean(artifact.buildId)}\``,
          `- Discovered: ${artifact.discovered}`,
        );
      page.push(
        '',
        '<details>',
        `<summary>Full availability history (${observed.full === 'No checks recorded yet.' ? 'no checks' : 'daily result'})</summary>`,
        '',
        '✓ available · × unavailable · days without a check are omitted',
        '',
        `<p>${observed.full.replaceAll('\n', '<br>')}</p>`,
        '</details>',
        '',
      );
    }
    write(`${model.slug}/${versionSlug(version)}.md`, page.join('\n'));
    versionPages++;
  }
  catalogue.push('');
  write(`${model.slug}/index.md`, modelPage.join('\n') + '\n');
}
write('index.md', catalogue.join('\n') + '\n');
console.log(
  `Generated ${models.length} model pages, ${versionPages} version pages and ${artifactCount} model artifact rows from .dat and data branches`,
);
