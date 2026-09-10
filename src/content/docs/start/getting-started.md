---
title: Getting started
description: The four steps from a bare Android wall panel to one showing a Home Assistant dashboard.
---

Getting a panel working takes four steps, in this order. Each one has its own page.

## 1. Install the integration

Setting up a panel starts in Home Assistant, not on the panel. The Panel Assistant custom integration is added through HACS as a custom repository, and it is what puts ha-paneld onto a panel for you. It is a beta and its own readme calls it a proof of concept, so read the caveats before you rely on it. See [Custom integration](/home-assistant/custom-integration/).

## 2. Choose a panel

Support is per model, and it ranges from fully supported to research only. Some panels ship software that cannot be worked with at all. Read [Choose a panel](/install/supported-panels/) before buying hardware, and check the model you already own before going further.

## 3. Prepare the panel

The panel needs to be on your network, reachable over ADB, and running a current system WebView. That last one is the single most common reason a first run looks broken. See [Prepare the panel](/install/prepare-a-panel/).

## 4. Add the panel

Add the integration in Home Assistant and give it the panel's address. It installs ha-paneld over the network, or adopts a panel already running it, and the panel then appears as a device. See [Install ha-paneld](/install/installing-ha-paneld/) for that step and for the manual route if you would rather not use the integration.

Once ha-paneld is running, point it at the dashboard you want on the wall and let MQTT discovery bring the panel's screen, buttons, sensors and relays into Home Assistant as entities. See [Connect a panel](/home-assistant/connect-a-panel/).

## What you need before you start

- Home Assistant 2026.8.3 or newer, and HACS, to use the integration. ha-paneld itself works with 2026.4.2 or newer.
- An MQTT broker that Home Assistant is already using, if you want the panel's hardware as entities.
- A computer on the same network as the panel, with `adb` and `curl` available, if you install ha-paneld by hand rather than through the integration. On Windows that means Git Bash or WSL rather than PowerShell.
- The panel itself, running Android 8.0 or newer.

## Where the detail lives

This site summarises and points onward. The reference documentation is kept with the code, in [the ha-paneld repository](https://github.com/maxlyth/ha-paneld/tree/main/docs), and it is the version to trust when the two disagree.
