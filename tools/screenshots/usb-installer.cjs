#!/usr/bin/env node
// Screens of the USB installer (install.panel-assistant.io) for the website's Getting started page.
// Headless Chromium has no WebUSB, so the page is loaded with a stub navigator.usb and each screen is
// shown by toggling the installer's own step sections, exactly as install-main.mjs does. No device,
// no USB traffic, nothing is installed. Usage: node usb-installer.js [out-dir]
'use strict';
const path = require('path');
const { chromium, ROBOTO, launchArgs } = require('./common.cjs');

const OUT = process.argv[2] || path.join(__dirname, '../../src/assets/screenshots');
const URL = process.env.USB_INSTALLER_URL || 'https://install.panel-assistant.io/';

// step section, journey stop (install-main.mjs JOURNEY_STOP), extra DOM state
const SCREENS = {
  connect: { step: 'connect', stop: 1 },
  allow: { step: 'allow', stop: 1 },
  confirm: { step: 'confirm', stop: 2 },
  progress: { step: 'progress', stop: 2, activity: 'stepInstalling', percent: 60 },
  done: { step: 'done', stop: 3, doneText: 'doneOpening' },
};

(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch(launchArgs);
  for (const theme of ['light', 'dark']) {
    for (const [name, s] of Object.entries(SCREENS)) {
      const ctx = await browser.newContext({ viewport: { width: 560, height: 900 }, deviceScaleFactor: 2, colorScheme: theme, reducedMotion: 'reduce', locale: 'en-GB' });
      await ctx.addInitScript(() => {
        const usb = { getDevices: async () => [], requestDevice: async () => { throw new DOMException('No device selected.', 'NotFoundError'); }, addEventListener() {}, removeEventListener() {} };
        Object.defineProperty(Navigator.prototype, 'usb', { get: () => usb, configurable: true });
      });
      const page = await ctx.newPage();
      await page.goto(URL, { waitUntil: 'networkidle' });
      await ROBOTO(page, 'main.wiz, main.wiz *');
      await page.evaluate(({ s, journey }) => {
        const el = (id) => document.getElementById(id);
        const say = (key) => document.querySelector(`[data-screen-message="${key}"]`)?.textContent;
        for (const n of ['preparing', 'connect', 'allow', 'confirm', 'progress', 'done', 'error']) el(`step-${n}`).hidden = n !== s.step;
        el('connect').disabled = false;
        el('journey').innerHTML = journey.map((j, i) => i < s.stop ? `<li class="done">${j}</li>` : i === s.stop ? `<li class="current" aria-current="step">${j}</li>` : `<li>${j}</li>`).join('');
        if (s.activity) { el('activity').textContent = ({ stepInstalling: 'Installing…' })[s.activity]; el('progress-fill').style.width = `${s.percent}%`; }
        if (s.doneText) el('done-text').textContent = 'Taking you to your panel’s setup…';
        document.querySelector('footer').hidden = true;
        void say;
      }, { s, journey: ['Version', 'Connect', 'Install', 'Set up'] });
      await page.waitForTimeout(300);
      const file = path.join(OUT, `usb-${name}-${theme}.png`);
      await page.locator('main.wiz').screenshot({ path: file });
      console.log(file);
      await ctx.close();
    }
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
