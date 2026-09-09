---
title: Getting started
description: The four steps from a bare Android wall panel to one showing a Home Assistant dashboard.
---

Getting a panel working takes four steps, in this order. Each one has its own page.

## 1. Choose a panel

Support is per model, and it ranges from fully supported to research only. Some panels ship software that cannot be worked with at all. Read [Choose a panel](/install/supported-panels/) before buying hardware, and check the model you already own before going further.

## 2. Prepare the panel

The panel needs to be on your network, reachable over ADB, and running a current system WebView. That last one is the single most common reason a first run looks broken. See [Prepare the panel](/install/prepare-a-panel/).

## 3. Install ha-paneld

ha-paneld is sideloaded. The usual route is a one-line installer run from a computer on the same network as the panel; there is also an on-panel route through the project's own F-Droid repository. See [Install ha-paneld](/install/installing-ha-paneld/).

## 4. Connect it to Home Assistant

Point ha-paneld at the dashboard you want on the wall, and let MQTT discovery bring the panel's screen, buttons, sensors and relays into Home Assistant as entities. See [Connect a panel](/home-assistant/connect-a-panel/).

## What you need before you start

- Home Assistant 2026.4.2 or newer.
- An MQTT broker that Home Assistant is already using, if you want the panel's hardware as entities.
- A computer on the same network as the panel, with `adb` and `curl` available. On Windows that means Git Bash or WSL rather than PowerShell.
- The panel itself, running Android 8.0 or newer.

## Where the detail lives

This site summarises and points onward. The reference documentation is kept with the code, in [the ha-paneld repository](https://github.com/maxlyth/ha-paneld/tree/main/docs), and it is the version to trust when the two disagree.
