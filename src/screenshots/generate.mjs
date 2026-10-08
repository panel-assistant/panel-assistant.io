// Publish tracked screenshots at stable paths through the website's normal build.
import { mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export async function generateScreenshots(
  source = fileURLToPath(new URL('../assets/screenshots/', import.meta.url)),
  output = fileURLToPath(new URL('../../public/screenshots/', import.meta.url)),
) {
  await rm(output, { recursive: true, force: true });
  async function visit(relative = '') {
    for (const entry of await readdir(join(source, relative), { withFileTypes: true })) {
      const path = join(relative, entry.name);
      if (entry.isDirectory()) {
        await visit(path);
      } else if (/^\.(png|gif|webp|jpe?g)$/i.test(extname(entry.name))) {
        const target = join(output, path);
        await mkdir(dirname(target), { recursive: true });
        // Sharp strips metadata by default; animated input keeps every frame and its timing.
        const image = sharp(join(source, path), { animated: true });
        if (/\.gif$/i.test(path))
          image.gif({ keepDuplicateFrames: true, interFrameMaxError: 0, interPaletteMaxError: 0 });
        if (/\.webp$/i.test(path)) image.webp({ lossless: true });
        await image.toFile(target);
      }
    }
  }
  await visit();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateScreenshots();
}
