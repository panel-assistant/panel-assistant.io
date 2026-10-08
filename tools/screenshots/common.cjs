'use strict';
// Shared pieces for the docs screenshot scripts: Playwright, launch flags and the pinned Roboto face.
const fs = require('fs');
const path = require('path');

const PLAYWRIGHT = process.env.PLAYWRIGHT_CORE
  || 'playwright-core';
const { chromium } = require(PLAYWRIGHT);

const launchArgs = {
  executablePath: process.env.CHROMIUM || '/usr/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb'],
};

// Screenshot fonts are supplied through HA_PANELD_ROBOTO_DIR.
const { installRoboto } = require('./roboto.cjs');
async function ROBOTO(page, selector) {
  await installRoboto(page);
  if (selector) await page.addStyleTag({ content: `${selector}{font-family:Roboto,sans-serif!important}` });
}

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }

module.exports = { chromium, launchArgs, ROBOTO, readJson };
