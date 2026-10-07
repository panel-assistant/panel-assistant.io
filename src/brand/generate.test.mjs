// The matrix is complete and the rendered lock-up holds: the bottom pixel row of the house is the
// bottom pixel row of the P, measured as the canvas audit measured it, on the files the site serves.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { generateBrand, SIZES, WORDMARK } from './generate.mjs';

const out = mkdtempSync(join(tmpdir(), 'brand-'));
const files = await generateBrand(out);

test('every icon margin and wordmark surface is served in every format at every size', () => {
  const expected = [];
  for (const variant of ['tight', 'square', 'avatar']) {
    expected.push(`icon-${variant}.svg`);
    for (const n of SIZES) {
      for (const tail of ['.png', '.webp', '-on-white.jpg', '-on-dark.jpg'])
        expected.push(`icon-${variant}-${n}${tail}`);
    }
  }
  for (const surface of ['dark', 'light']) {
    expected.push(`wordmark-on-${surface}.svg`);
    for (const n of SIZES)
      for (const ext of ['png', 'webp', 'jpg']) expected.push(`wordmark-on-${surface}-${n}.${ext}`);
  }
  assert.deepEqual(files, expected.sort());
  for (const file of files) assert.ok(existsSync(join(out, file)), file);
});

test('rasters are drawn at the size their name says, transparent or on the named surface', async () => {
  const meta = async (file) => sharp(join(out, file)).metadata();
  assert.deepEqual(pick(await meta('icon-square-256.png')), {
    width: 256,
    height: 256,
    hasAlpha: true,
  });
  assert.deepEqual(pick(await meta('icon-tight-1024.webp')), {
    width: 1024,
    height: 768,
    hasAlpha: true,
  });
  assert.deepEqual(pick(await meta('icon-avatar-16.png')), {
    width: 16,
    height: 16,
    hasAlpha: true,
  });
  const wordmark = await meta('wordmark-on-light-48.png');
  assert.deepEqual(pick(wordmark), {
    width: Math.round((48 * WORDMARK.width) / WORDMARK.height),
    height: 48,
    hasAlpha: true,
  });
  // The top right pixel: the mark fills the wordmark's top left.
  const corner = async (file) => {
    const { data, info } = await sharp(join(out, file)).raw().toBuffer({ resolveWithObject: true });
    return data.subarray((info.width - 1) * info.channels, info.width * info.channels);
  };
  // JPEG colour rounding moves a channel by a step or two.
  const near = (actual, wanted) => actual.every((v, i) => Math.abs(v - wanted[i]) <= 3);
  assert.ok(near([...(await corner('icon-square-64-on-white.jpg'))], [255, 255, 255]));
  assert.ok(near([...(await corner('wordmark-on-dark-64.jpg'))], [0x0f, 0x11, 0x13]));
  assert.equal((await meta('wordmark-on-light-64.jpg')).hasAlpha, false);
});

test('the avatar keeps a clear ring inside the inscribed circle', async () => {
  const n = 512;
  const { data, info } = await sharp(join(out, `icon-avatar-${n}.png`))
    .raw()
    .toBuffer({ resolveWithObject: true });
  const r = n / 2;
  let outermost = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 0)
        outermost = Math.max(outermost, Math.hypot(x + 0.5 - r, y + 0.5 - r));
    }
  }
  // The frame's corners stay at least a tenth of the radius inside the circle a circular crop keeps.
  assert.ok(
    outermost <= r * 0.9,
    `ink reaches ${outermost.toFixed(1)} px from the centre of a ${r} px radius`,
  );
});

for (const height of [56, 560]) {
  test(`the house's bottom pixel row is the P's bottom pixel row at ${height} px`, async () => {
    const svg = readFileSync(join(out, 'wordmark-on-dark.svg'), 'utf8').replace(
      '<svg ',
      `<svg width="${Math.round((height * WORDMARK.width) / WORDMARK.height)}" height="${height}" `,
    );
    const { data, info } = await sharp(Buffer.from(svg))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const scale = height / WORDMARK.height;
    // The P is the first glyph; its ink spans the first 25 px of the name at 56.
    const pStart = WORDMARK.nameX * scale;
    const pEnd = (WORDMARK.nameX + 25) * scale;
    let house = -1;
    let p = -1;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const i = (y * info.width + x) * 4;
        if (data[i + 3] < 128) continue;
        // The house is the only blue in the mark; the bezel and the screen are grey and navy.
        if (
          x < WORDMARK.markWidth * scale &&
          data[i] < 100 &&
          data[i + 1] > 150 &&
          data[i + 2] > 200
        )
          house = y;
        if (x >= pStart && x <= pEnd) p = y;
      }
    }
    assert.ok(house > 0 && p > 0, `found house row ${house} and P row ${p}`);
    assert.equal(house, p);
  });
}

function pick({ width, height, hasAlpha }) {
  return { width, height, hasAlpha };
}
