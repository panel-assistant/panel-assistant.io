#!/usr/bin/env node
// The panel's own guided setup (/setup on port 8888) for the website's Getting started page.
// Loads a real panel's /setup page and assets with GET only, swaps in setup.js from an Android ref, and answers
// /api/v1/setup and every /api/v1/config helper from mock JSON, so each wizard step renders with a made-up panel.
// Every non-GET request, unmocked /api/ path and other host is aborted; see the request log.
// Usage: PANEL_URL=http://<panel>:8888 [ANDROID_REF=<ref>] node panel-setup.js [out-dir]
// ANDROID_REPO and ANDROID_REF select the exact app source to capture.
// PANEL_REWRITE="Real Name=Lounge panel,real_id=lounge_panel" rewrites identity in the served HTML.
// STEPS=identity,dashboard,... limits the steps (default: all the journey offers).
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium, launchArgs } = require('./common.cjs');
const { installRoboto } = require('./roboto.cjs');

const PANEL = process.env.PANEL_URL;
if (!PANEL) { console.error('set PANEL_URL=http://<panel>:8888'); process.exit(2); }
const OUT = process.argv[2] || path.join(__dirname, '../../src/assets/screenshots');
const LOG = path.join(OUT, 'panel-setup-requests.log');
fs.mkdirSync(OUT, { recursive: true });
const ANDROID_REPO = process.env.ANDROID_REPO;
const ANDROID_REF = process.env.ANDROID_REF;
if (!ANDROID_REPO || !ANDROID_REF) throw new Error('Set ANDROID_REPO and ANDROID_REF.');
const SETUP_JS = execFileSync('git', ['-C', ANDROID_REPO, 'show', `${ANDROID_REF}:app/src/main/assets/setup.js`]);
fs.writeFileSync(LOG, '');
const log = (s) => fs.appendFileSync(LOG, s + '\n');

const ST = (stage, status, blocking, detail = '') => ({ stage, status, blocking, detail });
const HA = 'http://homeassistant.local:8123';
function journey(k) {
  const order = ['identity', 'ha_url', 'signin', 'dashboard', 'mqtt', 'filter', 'proof', 'done'];
  const i = order.indexOf(k);
  const at = (n) => i > order.indexOf(n);
  const pre = 'prerequisites_missing';
  const signed = at('signin');
  const steps = [
    ST('identity', at('identity') ? 'satisfied' : 'blocked', true, 'lounge_panel'),
    ST('renderer', 'satisfied', true, 'builtin'),
    ST('ha_url', at('ha_url') ? 'satisfied' : 'blocked', true, at('ha_url') ? HA : 'found'),
    ST('ha_credentials', signed ? 'satisfied' : 'blocked', true),
    ST('home_dashboard', !signed ? 'unknown' : at('dashboard') ? 'satisfied' : 'blocked', true, signed ? '' : pre),
    ST('mqtt_broker', at('mqtt') ? 'satisfied' : 'blocked', false),
    ST('mqtt_credentials', at('mqtt') ? 'satisfied' : 'blocked', false),
    ST('mqtt_connection', at('mqtt') ? 'satisfied' : 'skipped', false, at('mqtt') ? 'connected' : 'disabled'),
    ST('entity_filter', !signed ? 'unknown' : at('filter') ? 'satisfied' : 'blocked', true, signed ? '' : pre),
    at('proof') ? ST('render_proof', 'satisfied', true, 'builtin_frontend_connected')
      : at('filter') ? ST('render_proof', 'in_flight', true, 'awaiting_frontend')
      : ST('render_proof', 'unknown', true, pre),
  ];
  const nextOf = { identity: 'identity', ha_url: 'ha_url', signin: 'ha_credentials', dashboard: 'home_dashboard', mqtt: 'mqtt_broker', filter: 'entity_filter', proof: 'render_proof', done: null };
  const filterOn = at('filter');
  return {
    complete: k === 'done', repair: false,
    entity_filter: { relevant: true, enabled: filterOn, answered: filterOn, count: 412, counting: false, tier: 'middling', tier_source: 'profile', level: 'amber', confidence: 'estimated', recommend_above: 300, struggle_above: 800, learning: { applied: false, scanned: -1, catalog: filterOn ? 412 : -1 } },
    home_dashboard: { value: at('dashboard') ? '/lovelace' : '', answered: at('dashboard') },
    renderer: { builtin: true, package: '' },
    next: nextOf[k],
    panel: { id: 'lounge_panel', name: 'Lounge panel' },
    steps,
    discovery: { outcome: 'found', reason: 'none', explanation: '' },
  };
}
const MOCK = {
  '/api/v1/config/discovery': { mqtt_broker: 'tcp://core-mosquitto:1883', ha_url: HA },
  '/api/v1/config/home-dashboards': { queried: true, items: [
    { path: '/lovelace', title: 'Home', icon: 'mdi:home', group: 'panel' },
    { path: '/map', title: 'Map', icon: 'mdi:map', group: 'panel' },
    { path: '/lounge', title: 'Lounge', icon: 'mdi:sofa', group: 'dashboard' },
  ], default: { explicit: true, path: '/lovelace' } },
  '/api/v1/config/ha-area': { areas: [
    { area_id: 'dining_room', name: 'Dining room', icon: '' },
    { area_id: 'garden', name: 'Garden', icon: '' },
    { area_id: 'lounge', name: 'Lounge', icon: '' },
    { area_id: 'study', name: 'Study', icon: '' },
  ], device: { found: false, area_id: '', area_name: '' }, admin: true, queried: true, requested: 'Lounge', ha_username: 'panel' },
  '/api/v1/config/probe-broker': { ok: true },
  '/api/v1/peers': [],
  '/health': {},
};
const HEAD = { identity: 'Name this panel', ha_url: 'Where is Home Assistant?', signin: 'Sign in to Home Assistant', dashboard: 'Select the HA dashboard for this panel', mqtt: 'Connect to MQTT', filter: 'One thing before we load your dashboard', proof: 'Almost there', done: '✓ This panel is set up' };
const FILE = { identity: 'name', ha_url: 'ha-url', signin: 'sign-in', dashboard: 'dashboard', mqtt: 'mqtt', filter: 'filter', proof: 'almost-there', done: 'done' };

(async () => {
  const browser = await chromium.launch(launchArgs);
  const only = (process.env.STEPS || '').split(',').filter(Boolean);
  for (const theme of ['light', 'dark']) for (const k of Object.keys(HEAD).filter((x) => !only.length || only.includes(x))) {
    const ctx = await browser.newContext({ viewport: { width: 560, height: 1400 }, deviceScaleFactor: 2, colorScheme: theme, reducedMotion: 'reduce', locale: 'en-GB' });
    const page = await ctx.newPage();
    // Safety net first (Playwright matches last-registered first).
    await page.route('**/*', async (r) => {
      const m = r.request().method(); const u = new URL(r.request().url()); const p = u.pathname;
      if (m !== 'GET') { log(`ABORT-NONGET ${m} ${p}`); return r.abort(); }
      if (u.origin !== PANEL) { log(`ABORT-EXTERNAL ${u.href}`); return r.abort(); }
      if (p.startsWith('/api/')) { log(`ABORT-UNMOCKED-API ${p}`); return r.abort(); }
      if (p === '/assets/setup.js') { log(`FULFIL-BRANCH ${p}`); return r.fulfill({ contentType: 'application/javascript', body: SETUP_JS }); }
      if (p === '/setup') {
        const resp = await r.fetch(); let html = await resp.text();
        for (const pair of (process.env.PANEL_REWRITE || '').split(',').filter(Boolean)) { const [from, to] = pair.split('='); html = html.split(from).join(to); }
        log(`CONTINUE-REWRITE GET ${p}`);
        return r.fulfill({ status: resp.status(), contentType: 'text/html; charset=utf-8', body: html });
      }
      if (p === '/info.css' || p.startsWith('/assets/') || p === '/icon.svg' || p === '/favicon.svg') { const resp = await r.fetch(); log(`FETCH-FULFIL GET ${p} ${resp.status()}`); return r.fulfill({ status: resp.status(), contentType: resp.headers()['content-type'], body: await resp.body() }); }
      log(`ABORT-OTHER ${m} ${p}`); return r.abort();
    });
    for (const [p, body] of Object.entries(MOCK)) {
      await page.route((url) => url.pathname === p, (r) => {
        if (r.request().method() !== 'GET') { log(`ABORT-NONGET ${r.request().method()} ${p}`); return r.abort(); }
        log(`MOCK ${p}`); return r.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
      });
    }
    await page.route((url) => url.pathname === '/api/v1/setup', (r) => {
      if (r.request().method() !== 'GET') { log(`ABORT-NONGET ${r.request().method()} /api/v1/setup`); return r.abort(); }
      log(`MOCK /api/v1/setup (${k})`); return r.fulfill({ contentType: 'application/json', body: JSON.stringify(journey(k)) });
    });

    await page.goto(PANEL + '/setup', { waitUntil: 'load' });
    await installRoboto(page);
    await page.waitForFunction((h) => { const e = document.querySelector('#wiz-step h2'); return e && e.textContent === h; }, HEAD[k], { timeout: 15000 });
    if (k === 'ha_url' || k === 'mqtt') await page.waitForSelector('#wiz-step .setup.info');
    if (k === 'dashboard') { await page.waitForSelector('#wiz-home_dashboard'); await page.waitForSelector('#wiz-ha_area'); }
    if (k === 'mqtt') await page.waitForFunction(() => document.getElementById('wiz-mqtt_user').value === 'panel');
    if (k === 'filter') await page.waitForFunction(() => document.getElementById('ef-count').textContent === '412');
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      document.title = document.title.replace(/^\d+ · /, '');
      const a = document.activeElement; if (a && a.blur) a.blur();
    });
    const leak = await page.evaluate(() => ({
      bars: ['halifebar', 'hanetbar', 'verbar'].map((id) => getComputedStyle(document.getElementById(id)).display),
      text: document.documentElement.outerHTML,
    }));
    const file = `${OUT}/panel-setup-${FILE[k]}-${theme}.png`;
    await page.locator('#wiz').screenshot({ path: file });
    const identities = (process.env.PANEL_REWRITE || '').split(',').filter(Boolean).map((pair) => pair.split('=')[0]);
    if (identities.some((identity) => leak.text.includes(identity))) throw new Error('Original panel identity remains in the rendered page.');
    console.log(file, JSON.stringify({ bars: leak.bars }));
    await ctx.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
