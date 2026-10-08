# Documentation screenshots

Screenshot sources live in `src/assets/screenshots/`. The website build normalizes their metadata, preserves animation, and serves them at `https://panel-assistant.io/screenshots/<filename>`. The existing website deployment publishes the images and pages together; no separate bucket uploader or image publishing credential is needed. Hardware photographs retain their existing asset host.

## Capture

Install the website dependencies and supply Chromium through `CHROMIUM` (default `/usr/bin/chromium`). Set `HA_PANELD_ROBOTO_DIR` to the pinned Roboto revision `389b770410cc0b7c21c85673bfa2077420fe7f65`, containing `Roboto.ttf` and `Roboto-Italic.ttf`. `PLAYWRIGHT_CORE` can select an existing Playwright installation.

Run from the website checkout; every capture command accepts an output directory. The wizard captures default to `src/assets/screenshots/`. Review each image for identifying information before committing it. Targets, token files and identity replacement maps are local inputs and must never be committed.

| Command                                                                                       | Input                                                                         | Captures                                                                                                                                |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `node tools/screenshots/ha-flow.cjs <output> [step ...]`                                      | `HA_URL`, `DEV_HA_TOKEN_FILE` (JSON with `token` and `exp`)                   | Home Assistant setup dialogs; later steps use synthetic responses                                                                       |
| `node tools/screenshots/usb-installer.cjs <output>`                                           | `USB_INSTALLER_URL` (defaults to `https://install.panel-assistant.io/`)       | USB installer screens with a stub USB interface; no device is installed                                                                 |
| `node tools/screenshots/panel-setup.cjs <output>`                                             | `PANEL_URL`, `ANDROID_REPO`, `ANDROID_REF`, `PANEL_REWRITE`; optional `STEPS` | Panel setup using the exact app source and synthetic API responses; unmocked API and non-GET requests are blocked                       |
| `node tools/screenshots/panel-ui.cjs <url> <output.png> [width] [height] [dpr] [text-scale]`  | `SCREENSHOT_FIXTURES_DIR`                                                     | Panel UI with reviewed synthetic `perf.json`, `proximity.json`, `identity.json` replacement map and `dashboard.png` or `dashboard.html` |
| `python3 tools/screenshots/sanitize-standing.py <input.png> <output.png> [--ip 192.168.1.42]` | Raw standing-screen capture and screenshot fonts                              | Replaces address text and QR together, refusing output unless the QR decodes to the printed address                                     |

The standing-screen sanitizer additionally needs Pillow, OpenCV, NumPy and Segno. Token issuance, physical-device capture and restoration are environment operations outside this repository. Capture adapters retain the response shapes used for the existing images; when a product changes those shapes, update the corresponding adapter before refreshing its images.

## Build and publish

```bash
npm run build
npm test
```

`src/screenshots/generate.mjs` produces `public/screenshots/` from the tracked sources before dev and build. Build output is ignored; commit reviewed sources and let the existing CI publish the tested `dist/` directory. Use `/screenshots/<filename>` in website pages and absolute `https://panel-assistant.io/screenshots/<filename>` URLs in other repositories. Preserve an existing filename when refreshing an image so its consumers keep resolving.

The modern brand matrix comes from `src/brand/generate.mjs` and is served at `/brand/`. The relocated `gen-wordmark.py` is retained for reproducing older Android wordmark resources; run it from an Android checkout with a font path. Its output is separate from the documentation screenshots.
