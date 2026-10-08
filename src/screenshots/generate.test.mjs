import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { generateScreenshots } from './generate.mjs';

test('published screenshots retain nested paths, pixels and animation while dropping metadata', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'screenshots-'));
  try {
    const source = join(temp, 'source');
    const output = join(temp, 'public');
    await mkdir(join(source, 'de'), { recursive: true });
    const png = await sharp({ create: { width: 3, height: 2, channels: 3, background: 'red' } })
      .withMetadata()
      .png()
      .toBuffer();
    await writeFile(join(source, 'de', 'screen.png'), png);
    // Two differently coloured frames, with non-default timing and looping.
    const pixels = Buffer.from([
      ...Array(6).fill([255, 0, 0]).flat(),
      ...Array(6).fill([255, 0, 0]).flat(),
    ]);
    const gif = await sharp(pixels, { raw: { width: 3, height: 4, channels: 3, pageHeight: 2 } })
      .gif({ delay: [120, 230], loop: 3, keepDuplicateFrames: true })
      .toBuffer();
    await writeFile(join(source, 'motion.gif'), gif);
    await generateScreenshots(source, output);
    const published = await readFile(join(output, 'de', 'screen.png'));
    const metadata = await sharp(published).metadata();
    assert.equal(metadata.width, 3);
    assert.equal(metadata.height, 2);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.icc, undefined);
    assert.deepEqual(await sharp(published).raw().toBuffer(), await sharp(png).raw().toBuffer());
    const motion = await readFile(join(output, 'motion.gif'));
    const animation = await sharp(motion, { animated: true }).metadata();
    assert.equal(animation.width, 3);
    assert.equal(animation.pageHeight, 2);
    assert.equal(animation.pages, 2);
    assert.deepEqual(animation.delay, [120, 230]);
    assert.equal(animation.loop, 3);
    assert.deepEqual(
      await sharp(motion, { animated: true }).raw().toBuffer(),
      await sharp(gif, { animated: true }).raw().toBuffer(),
    );
    await generateScreenshots(source, output);
    assert.deepEqual(await readFile(join(output, 'motion.gif')), motion);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
