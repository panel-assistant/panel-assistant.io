#!/usr/bin/env node
// Home Assistant "Add integration → Panel Assistant" dialogs for the website's Getting started page.
// Needs the dev Home Assistant running on 127.0.0.1:8123 and a token from an externally supplied token file.
// menu, address and USB are the real flow (no address or install is submitted). Later steps use the real frontend and
// the integration's real translations, with the config-flow REST calls answered by step JSON shaped
// like config_flow.py's, so no panel is contacted and a made-up address and name appear.
// Usage: node ha-flow.cjs [out-dir] [step ...]
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium, launchArgs, readJson } = require('./common.cjs');

const OUT = process.argv[2] || path.join(__dirname, '../../src/assets/screenshots');
const ONLY = process.argv.slice(3);
const BASE = process.env.HA_URL || 'http://127.0.0.1:8123';
const TOKEN = process.env.DEV_HA_TOKEN_FILE;
if (!TOKEN) throw new Error('Set DEV_HA_TOKEN_FILE to a local token JSON file.');
const ADDR = '192.168.1.40';
const NAME = 'Lounge panel';

const flow = { flow_id: 'docsflow0000000000000000000000001', handler: 'panel_assistant' };
const form = (step_id, placeholders, data_schema = []) => ({ ...flow, type: 'form', step_id, errors: {}, last_step: null, preview: null, description_placeholders: placeholders, data_schema });
// Each entry: the flow JSON to serve (null = drive the real flow), and what to do before the shot.
const STEPS = {
  menu: { real: true },
  address: { real: true, after: async (page) => {
    await page.getByText('Add a panel on your network').first().click();
    await page.waitForTimeout(2500);
    await page.locator('dialog-data-entry-flow input').first().click();
    await page.keyboard.type(ADDR);
  } },
  usb: { real: true, after: async (page) => {
    await page.getByText('Install using USB on this computer').first().click();
  } },
  // Refresh the version options from the current catalogue before regenerating.
  version: { json: form('choose_version', { address: ADDR }, [{ name: 'release_candidate', required: true, default: 'stable',
    selector: { select: { options: [{ value: 'stable', label: '1.0.0-preview2 build 2142 (recommended)' }], mode: 'dropdown', multiple: false, custom_value: false, sort: false } } }]),
    after: async (page) => { await page.locator('dialog-data-entry-flow ha-select, dialog-data-entry-flow ha-selector-select').first().click(); } },
  authorize: { json: { ...flow, type: 'progress', step_id: 'authorize_adb', progress_action: 'authorize_adb', description_placeholders: { address: ADDR } } },
  installing: { json: { ...flow, type: 'progress', step_id: 'install_progress', progress_action: 'installing', description_placeholders: { address: ADDR } } },
  done: { json: { ...flow, type: 'create_entry', title: NAME, description: null, description_placeholders: null, next_flow: ['options_flow', 'docsoptions000000000000000000001'], version: 1, minor_version: 1, options: {}, subentries: [],
    result: { entry_id: '01DOCS0000000000000000000A', domain: 'panel_assistant', title: NAME, source: 'user', state: 'loaded', supports_options: true, supports_remove_device: false, supports_unload: true, supports_reconfigure: false, pref_disable_new_entities: false, pref_disable_polling: false, disabled_by: null, reason: null, error_reason_translation_key: null, error_reason_translation_placeholders: null, num_subentries: 0 } } },
};

const dialogRect = (page) => page.evaluate(() => {
  let found = null;
  const walk = (root) => { for (const el of root.querySelectorAll('*')) {
    if (el.tagName === 'DIALOG' && el.classList.contains('open')) { const r = el.getBoundingClientRect(); if (r.width > 50) found = { x: r.x, y: r.y, width: r.width, height: r.height }; }
    if (el.shadowRoot) walk(el.shadowRoot);
  } };
  walk(document); return found;
});

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const tok = readJson(TOKEN);
  const browser = await chromium.launch(launchArgs);
  for (const [name, step] of Object.entries(STEPS)) {
    if (ONLY.length && !ONLY.includes(name)) continue;
    for (const scheme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2, colorScheme: scheme, locale: 'en-GB' });
      await ctx.addInitScript(([t, base]) => {
        localStorage.setItem('hassTokens', JSON.stringify({ hassUrl: base, clientId: base + '/', expires: t.exp * 1000, refresh_token: '', access_token: t.token, expires_in: 172800, token_type: 'Bearer' }));
      }, [tok, BASE]);
      if (step.json) {
        await ctx.route('**/api/config/config_entries/flow**', (route) => route.fulfill({ status: 200, contentType: 'application/json',
          body: route.request().method() === 'DELETE' ? '{}' : JSON.stringify(step.json) }));
      }
      if (name === 'done') {
        await ctx.route('**/api/config/config_entries/options/flow**', (route) => route.fulfill({ status: 200, contentType: 'application/json',
          body: JSON.stringify({ ...form('onboarding', { setup_url: `http://${ADDR}:8888/setup` }), flow_id: 'docsoptions000000000000000000001', handler: '01DOCS0000000000000000000A' }) }));
      }
      const page = await ctx.newPage();
      const realFlows = new Set();
      if (step.real) page.on('response', async (response) => {
        if (response.url().includes('/api/config/config_entries/flow') && response.request().method() === 'POST' && response.ok()) {
          const result = await response.json();
          if (result.flow_id) realFlows.add(result.flow_id);
        }
      });
      await page.goto(`${BASE}/config/integrations/dashboard/add?domain=panel_assistant`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2500);
      await page.getByRole('button', { name: 'OK' }).click();
      await page.waitForTimeout(3000);
      if (step.after) { await step.after(page); await page.waitForTimeout(1200); }
      if (name === 'done') await page.getByRole('button', { name: 'Done', exact: true }).waitFor({ state: 'visible' });
      // Keep the rounded dialog corners free of the signed-in dashboard behind it.
      await page.evaluate(() => {
        const background = document.createElement('div');
        background.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:var(--primary-background-color);pointer-events:none';
        document.body.append(background);
      });
      const clip = await dialogRect(page);
      if (!clip) throw new Error(`${name} ${scheme}: no open dialog`);
      const file = path.join(OUT, `ha-${name}-${scheme}.png`);
      await page.screenshot({ path: file, clip });
      console.log(file, Math.round(clip.width), Math.round(clip.height));
      for (const id of realFlows) {
        const response = await ctx.request.delete(`${BASE}/api/config/config_entries/flow/${id}`, { headers: { Authorization: `Bearer ${tok.token}` } });
        if (!response.ok() && response.status() !== 404) throw new Error(`Could not remove capture flow: ${response.status()}`);
      }
      await ctx.close();
    }
  }
  await browser.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
