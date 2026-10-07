// Builds the brand asset matrix served at /brand/ before every build and dev server, from the two
// tracked masters beside this file: icon.svg (the mark) and name.svg (the outlined name). The lock-up
// below is the one definition of how the two sit together; the page at /brand/ states the same rule,
// and the app and Panel Assistant copy the files this writes rather than drawing their own.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = new URL('.', import.meta.url);
const inner = (svg) => svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1].trim();
const icon = inner(readFileSync(new URL('./icon.svg', here), 'utf8'));
const nameSvg = readFileSync(new URL('./name.svg', here), 'utf8');
const name = {
  path: nameSvg.match(/ d="([^"]+)"/)[1],
  width: Number(nameSvg.match(/ width="([^"]+)"/)[1]),
};

// The mark's viewBox is the device frame, 60 by 45 in its own units.
export const MARK = { x: 24, y: 32, w: 60, h: 45 };
// The bottom edge of the house inside the mark, in the same units (the house group's translate plus
// its path's lowest point at scale 0.1). The name's baseline sits on it.
const HOUSE_BOTTOM = 42.5 + 239.813 * 0.1;
// The lock-up, decided 2026-10-07 and measured on the canvas: beside a mark H high, the name is
// 0.71 H high (40 beside 56), the gap is 10/56 H, and the mark hangs below the baseline by the part
// of it under the house's bottom edge, 0.233 H. name.svg is drawn at 40 px, so at H = 56 it is used
// as it is and everything scales from there.
export const LOCKUP = {
  markHeight: 56,
  nameHeight: 40,
  gap: 10,
  belowBaseline: (MARK.y + MARK.h - HOUSE_BOTTOM) / MARK.h,
};
// Every usual size, as the longer side of an icon or the mark height of the wordmark.
export const SIZES = [16, 24, 32, 48, 64, 96, 128, 180, 192, 256, 384, 512, 1024];
// Surfaces for the JPEGs, which cannot be transparent.
const SURFACES = { white: '#FFFFFF', dark: '#0F1113' };
// Ink for the name on each surface.
const INK = { dark: '#F3F5F7', light: '#15181C' };

const fmt = (v) => Number(v.toFixed(2)).toString();
const svg = (viewBox, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.map(fmt).join(' ')}">\n${body}\n</svg>\n`;
const mark = (x, y, w, h) =>
  `<svg x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" viewBox="${MARK.x} ${MARK.y} ${MARK.w} ${MARK.h}">\n${icon}\n</svg>`;

// Three margins. Tight is the device frame itself. Square sets the frame in a square with a small
// margin. Avatar leaves room for a circular crop: the frame's diagonal is 75 units, and a 96 unit
// square puts a clear ring of 10.5 units between the frame's corners and the inscribed circle.
const ICONS = {
  tight: svg([MARK.x, MARK.y, MARK.w, MARK.h], icon),
  square: svg([0, 0, 70, 70], mark(5, 12.5, MARK.w, MARK.h)),
  avatar: svg([0, 0, 96, 96], mark(18, 25.5, MARK.w, MARK.h)),
};
const iconSize = (variant, n) => (variant === 'tight' ? [n, (n * MARK.h) / MARK.w] : [n, n]);

// The wordmark at H = 56, baseline at y = 0.
const H = LOCKUP.markHeight;
const markW = (H * MARK.w) / MARK.h;
const markTop = H * LOCKUP.belowBaseline - H;
const nameX = markW + LOCKUP.gap;
export const WORDMARK = { width: nameX + name.width, height: H, markWidth: markW, nameX };
const wordmark = (ink) =>
  svg(
    [0, markTop, WORDMARK.width, H],
    `${mark(0, markTop, markW, H)}\n<path fill="${ink}" transform="translate(${fmt(nameX)} 0)" d="${name.path}"/>`,
  );
const WORDMARKS = { dark: wordmark(INK.dark), light: wordmark(INK.light) };
const wordmarkSize = (n) => [(n * WORDMARK.width) / H, n];

// librsvg renders an SVG at the pixel size its root width and height name, so each raster is drawn
// at its own size rather than scaled from one bitmap.
const sized = (source, [w, h]) =>
  Buffer.from(source.replace('<svg ', `<svg width="${Math.round(w)}" height="${Math.round(h)}" `));
const rasters = (source, size, stem, surfaces) => [
  [`${stem}.png`, sharp(sized(source, size)).png()],
  [`${stem}.webp`, sharp(sized(source, size)).webp({ lossless: true })],
  ...surfaces.map((surface) => [
    `${stem}-on-${surface}.jpg`,
    sharp(sized(source, size)).flatten({ background: SURFACES[surface] }).jpeg({ quality: 92 }),
  ]),
];

/** Writes the whole matrix into `outDir`, replacing what was there, and returns the file names. */
export async function generateBrand(outDir) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const files = [];
  const jobs = [];
  const write = (file, data) => {
    files.push(file);
    jobs.push(Promise.resolve(data).then((buf) => writeFileSync(`${outDir}/${file}`, buf)));
  };
  for (const [variant, source] of Object.entries(ICONS)) {
    write(`icon-${variant}.svg`, source);
    for (const n of SIZES) {
      for (const [file, image] of rasters(source, iconSize(variant, n), `icon-${variant}-${n}`, [
        'white',
        'dark',
      ])) {
        write(file, image.toBuffer());
      }
    }
  }
  for (const [surface, source] of Object.entries(WORDMARKS)) {
    write(`wordmark-on-${surface}.svg`, source);
    for (const n of SIZES) {
      // The JPEG takes the surface the ink was chosen for: white under dark ink, dark under light ink.
      const jpeg = surface === 'light' ? 'white' : 'dark';
      for (const [file, image] of rasters(source, wordmarkSize(n), `wordmark-on-${surface}-${n}`, [
        jpeg,
      ])) {
        write(file.replace(`-on-${jpeg}.jpg`, '.jpg'), image.toBuffer());
      }
    }
  }
  await Promise.all(jobs);
  return files.sort();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = fileURLToPath(new URL('../../public/brand', import.meta.url));
  const started = Date.now();
  const files = await generateBrand(out);
  console.log(`brand: ${files.length} files written to ${out} in ${Date.now() - started} ms`);
}
