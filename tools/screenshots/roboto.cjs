'use strict';

const fs = require('fs');
const path = require('path');

const ROBOTO_REVISION = '389b770410cc0b7c21c85673bfa2077420fe7f65';
const ROBOTO_DIR = process.env.HA_PANELD_ROBOTO_DIR;
if (!ROBOTO_DIR) throw new Error('Set HA_PANELD_ROBOTO_DIR to the pinned Roboto font directory.');

function fontData(file) {
  const fontPath = path.join(ROBOTO_DIR, file);
  if (!fs.existsSync(fontPath)) {
    throw new Error(`Roboto screenshot font is missing: ${fontPath}; supply Roboto.ttf and Roboto-Italic.ttf`);
  }
  return fs.readFileSync(fontPath).toString('base64');
}

async function installRoboto(page) {
  const upright = fontData('Roboto.ttf');
  const italic = fontData('Roboto-Italic.ttf');
  await page.addStyleTag({
    content: `
      @font-face {
        font-family: "Roboto";
        src: url(data:font/ttf;base64,${upright}) format("truetype");
        font-style: normal;
        font-weight: 100 900;
        font-stretch: 75% 100%;
        font-display: block;
      }
      @font-face {
        font-family: "Roboto";
        src: url(data:font/ttf;base64,${italic}) format("truetype");
        font-style: italic;
        font-weight: 100 900;
        font-stretch: 75% 100%;
        font-display: block;
      }
      html,body,button,input,select,textarea {
        font-family: "Roboto","Noto Color Emoji",sans-serif !important;
      }
    `,
  });
  const loaded = await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load('400 16px "Roboto"'),
      document.fonts.load('italic 400 16px "Roboto"'),
      document.fonts.ready,
    ]);
    return document.fonts.check('400 16px "Roboto"')
      && document.fonts.check('italic 400 16px "Roboto"');
  });
  if (!loaded) throw new Error('Roboto screenshot font did not load');
}

module.exports = { installRoboto, ROBOTO_DIR, ROBOTO_REVISION };
