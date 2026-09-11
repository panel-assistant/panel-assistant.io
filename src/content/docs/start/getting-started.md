---
title: Getting started
description: The four steps from a bare Android wall panel to one showing your Home Assistant dashboard, all from Home Assistant.
---

Getting a panel working takes four steps, and none of them involve a command line. Each has its own page.

## 1. Install the integration

Everything starts in Home Assistant, not on the panel. Add Panel Assistant through HACS, restart, and you have the installer, the devices and the all-panels page. See [Install the integration](/home-assistant/custom-integration/).

## 2. Choose a panel

Support is per model. Three panel families are fully supported, several more are documented, and a few ship software that cannot be worked with. Read [Choose a panel](/install/supported-panels/) before buying hardware, and check the model you already own before going further.

## 3. Prepare the panel

The panel needs developer options turned on so that it will accept an installer, and it needs an up-to-date system WebView, which is the single most common reason a first dashboard looks broken. See [Prepare the panel](/install/prepare-a-panel/).

## 4. Add the panel

In Home Assistant, add the Panel Assistant integration and give it the panel's address, or plug a brand-new panel into your laptop and install over USB from your browser. Approve one prompt on the panel and watch it through. The panel then appears as a device. See [Add a panel](/install/installing-ha-paneld/).

Once the panel is running, point it at the dashboard you want on the wall. See [Connect a panel](/home-assistant/connect-a-panel/).

## What you need

- Home Assistant 2026.8.3 or newer, with HACS.
- A wall panel running Android 8.0 or newer, ideally one from the [supported list](/install/supported-panels/).
- For the USB route, a Chromium-based browser such as Chrome or Edge on the computer you plug the panel into.

## Where the detail lives

This site is the front door. The reference documentation is kept with the code, in [the ha-paneld repository](https://github.com/maxlyth/ha-paneld/tree/main/docs), and it is the version to trust when the two disagree.
