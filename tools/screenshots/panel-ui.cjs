#!/usr/bin/env node
/*
 * panel-ui.cjs — hero and documentation screenshot capture for ha-paneld. Renders the LIVE info page off a real panel but substitutes
 * leak-safe synthetic data at render time, so no app changes / `?demo` build patch are needed:
 *
 *   - mocks /perf, /proximity, /screenshot.png with the JSON/PNG under SCREENSHOT_FIXTURES_DIR
 *   - rewrites identity (panel_id, friendly name, IPs, device id, MQTT host/user) per identity.json
 *   - leaves the page's own secret-field blur in place (shows the screenshot-hygiene feature)
 *
 * Usage: node panel-ui.cjs <url> <out.png> [width=1920] [height=auto] [dpr=1] [text-scale=1]
 *   height=auto (default) captures the full page so no card is clipped; pass a number to force a clip.
 *   e.g. node panel-ui.cjs http://panel.local:8888/ src/assets/screenshots/hero-dark.png 1600 1024 1
 *
 * Requires: Node >=18, playwright-core + a chromium under PLAYWRIGHT_BROWSERS_PATH (see README).
 */
const fs = require('fs');
const path = require('path');
const { installRoboto } = require('./roboto.cjs');

const [url, out, W = '1920', H = 'auto', DPR = '1', ZOOM = '1'] = process.argv.slice(2);
if (!url || !out) {
  console.error('usage: node panel-ui.cjs <url> <out.png> [width=1920] [height=auto] [dpr=1]');
  process.exit(2);
}
const width = +W, dpr = +DPR, textScale = +ZOOM;
if (!Number.isFinite(textScale) || textScale < 0.75 || textScale > 1) throw new Error('text scale must be between 0.75 and 1');
const fullPage = (H === 'auto'); // capture whole page (no card clipped) unless an explicit height is given
const height = fullPage ? 800 : +H; // compact baseline; fullPage expands to exactly fit taller content
const FX = process.env.SCREENSHOT_FIXTURES_DIR;
if (!FX) throw new Error('Set SCREENSHOT_FIXTURES_DIR to the reviewed synthetic fixtures.');
const perf = JSON.parse(fs.readFileSync(path.join(FX, 'perf.json'), 'utf8'));
const prox = JSON.parse(fs.readFileSync(path.join(FX, 'proximity.json'), 'utf8'));
const ident = JSON.parse(fs.readFileSync(path.join(FX, 'identity.json'), 'utf8')).replace;
// Screenshot card image: prefer a real panel capture (fixtures/dashboard.png — for example via
// `curl http://<panel>:8888/api/v1/screenshot.png`); else render the faux fixtures/dashboard.html.
const dashPngPath = path.join(FX, 'dashboard.png');
const haveDashPng = fs.existsSync(dashPngPath);
const dashHtml = haveDashPng ? null : fs.readFileSync(path.join(FX, 'dashboard.html'), 'utf8');

// Parse a PNG's pixel dimensions from its IHDR (bytes 16..24) — to size the card to the shot's real ratio.
function pngDims(buf) { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; }

const { chromium, launchArgs } = require('./common.cjs');

// Realistic activity history: a low baseline with sharp spikes (dashboard reloads / entity bursts) and
// one sustained-busy plateau — real panel telemetry is spiky, not a gentle sine (see the README hero).
// Seeded (Mulberry32) so the hero is stable across re-shoots. spikes = [center, height, width].
function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function activity(n, base, noise, spikes, plateau, floor = 2, cap = 98, rnd) {
  const a = [];
  for (let i = 0; i < n; i++) {
    let v = base + (rnd() - 0.5) * 2 * noise;
    for (const [c, h, w] of spikes) v += h * Math.exp(-((i - c) ** 2) / (2 * w * w));
    if (plateau && i >= plateau[0] && i <= plateau[1]) v = Math.max(v, plateau[2] + (rnd() - 0.5) * 6);
    a.push(Math.max(floor, Math.min(cap, Math.round(v * 10) / 10)));
  }
  return a;
}

function perfBody() {
  const ramPct = Math.round((perf.memUsedMb * 100) / perf.memTotalMb);
  const d = { ...perf };
  const r = rng(1013158);
  d.hist = {
    cpu: activity(120, 16, 4, [[14, 62, 3], [38, 74, 2.5], [70, 50, 4], [101, 80, 2]], [50, 64, 44], 2, 98, r),
    // RAM: gentle accretion with a step-down at a reload (~point 70) — not spiky, but not flat either.
    ram: (() => { const a = []; let lvl = ramPct - 2; for (let i = 0; i < 120; i++) { lvl += (r() - 0.35) * 1.0; if (i === 70) lvl -= 9; a.push(Math.max(22, Math.min(60, Math.round((lvl + (r() - 0.5) * 2) * 10) / 10))); } return a; })(),
    gpu: activity(120, 7, 3, [[14, 30, 3], [38, 38, 2.5], [70, 26, 4], [101, 42, 2]], [50, 64, 20], 1, 60, r),
  };
  // Responsiveness: snappy baseline with sharp interaction/reload spikes; last point low → green verdict.
  const rh = activity(120, 11, 3, [[20, 70, 2], [38, 88, 1.8], [70, 55, 3], [110, 78, 2]], [50, 60, 40], 2, 100, r);
  rh[rh.length - 1] = 9;
  d.render = { ...perf.render, hist: rh };
  // Current built-in-renderer diagnostics (0.9.4): synthetic, content-free interaction/state/blocking
  // history so the README hero demonstrates the shipped diagnosis surface without using fleet telemetry.
  const points = 48;
  const interactions = activity(points, 48, 12, [[10, 210, 1.5], [29, 360, 1.2], [41, 150, 2]], null, 24, 600, r);
  const updates = activity(points, 1.7, 0.7, [[10, 12, 1.8], [29, 22, 1.4], [41, 8, 2]], null, 0, 40, r);
  const blocked = activity(points, 12, 6, [[10, 150, 1.5], [29, 440, 1.2], [41, 90, 2]], null, 0, 700, r);
  d.dashboard = {
    schema: 1, mode: 'builtin_direct', generation: 7, windowMs: 240000, sampleCount: points,
    interaction: {
      count: 26, percentilesApproximate: true, p50Ms: 54, p95Ms: 138, worstMs: 412,
      inputDelayMs: 18, processingMs: 47, presentationMs: 73,
    },
    stateStream: {
      framesPerSec: 1.8, updatesPerSec: 2.1, updatesP95PerSec: 13.7,
      payloadBytesPerSec: 2840, payloadP95BytesPerSec: 18320, hydrationUpdates: 42,
      mainThreadMsPerSec: 14.6, mainThreadP95MsPerSec: 58, longestStateTaskMs: 96,
      observerMicros: 910000, droppedFrames: 0,
    },
    blocking: {
      blockedMsPerSec: 11.8, blockedP95MsPerSec: 164, longestFrameMs: 428,
      scriptMsPerSec: 7.4, renderMsPerSec: 4.4, longAnimationFrames: 9, longTasks: 2,
    },
    filter: { active: true, entityCount: 42 },
    topEntities: [
      { entityId: 'sensor.living_room_temperature', updates1h: 1080, payloadBytes1h: 345600 },
      { entityId: 'light.living_room', updates1h: 420, payloadBytes1h: 187200 },
      { entityId: 'binary_sensor.front_door', updates1h: 180, payloadBytes1h: 64800 },
    ],
    likelyCause: 'state_stream', confidence: 'medium',
    history: {
      interactionMs: interactions,
      updatesPerSec: updates,
      payloadBytesPerSec: updates.map(v => Math.round(v * 1320)),
      mainThreadMsPerSec: updates.map(v => Math.round((5 + v * 2.8) * 10) / 10),
      blockedMsPerSec: blocked,
    },
  };
  return JSON.stringify(d);
}

(async () => {
  const browser = await chromium.launch(launchArgs);

  // 1) The Screenshot-card image: a real panel capture if present, else render the faux dashboard.
  let dashPng;
  if (haveDashPng) {
    dashPng = fs.readFileSync(dashPngPath);
  } else {
    const dctx = await browser.newContext({ viewport: { width: 480, height: 480 }, deviceScaleFactor: 2 });
    const dpage = await dctx.newPage();
    await dpage.setContent(dashHtml, { waitUntil: 'load' });
    dashPng = await dpage.screenshot({ type: 'png' });
    await dctx.close();
  }
  const dash = pngDims(dashPng);

  // 2) The info page, with live endpoints mocked + identity rewritten.
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr });
  const page = await ctx.newPage();
  await page.route('**/perf', r => r.fulfill({ contentType: 'application/json', body: perfBody() }));
  await page.route('**/proximity', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(prox) }));
  await page.route('**/screenshot.png*', r => r.fulfill({ contentType: 'image/png', body: dashPng }));

  await page.goto(url, { waitUntil: 'load', timeout: 30000 }); // /health poll means networkidle never settles
  // Roboto mirrors Android's neutral UI typography while remaining deterministic in offline captures.
  // This screenshot-only override does not change the application's platform-native runtime CSS.
  await installRoboto(page);
  // Root-font scaling, rather than CSS zoom, preserves the requested screenshot canvas width.
  if (textScale !== 1) await page.addStyleTag({ content: `html{font-size:${16 * textScale}px}` });
  await page.waitForTimeout(2600); // let perf()/prox() fire at least once and the canvases draw

  // Rewrite identity in visible text nodes + form input values (synthetic, leak-safe).
  await page.evaluate((map) => {
    const sub = (s) => { for (const [k, v] of Object.entries(map)) s = s.split(k).join(v); return s; };
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = []; let n; while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(t => { const r = sub(t.nodeValue); if (r !== t.nodeValue) t.nodeValue = r; });
    document.querySelectorAll('input').forEach(i => {
      if (i.value) { const r = sub(i.value); if (r !== i.value) i.value = r; }
    });
    document.title = sub(document.title);
  }, ident);

  // Size the Screenshot card to the real capture's aspect ratio (the page reserves the render-panel's
  // ratio — a square panel is 1:1 — but the mocked image may be another panel, a 750×1334 portrait display).
  await page.evaluate(({ w, h }) => {
    const s = document.querySelector('.shot');
    if (s) s.style.aspectRatio = `${w}/${h}`;
  }, dash);

  await page.waitForTimeout(300);
  if (fullPage) await page.screenshot({ path: out, fullPage: true });
  else await page.screenshot({ path: out, clip: { x: 0, y: 0, width, height } });
  await browser.close();
  // The website build normalizes every source image before publication.
  const dim = fullPage ? `${width}x(full)` : `${width}x${height}`;
  console.log(`wrote ${out} (${dim} @${dpr}x)`);
})().catch(e => { console.error(e); process.exit(1); });
