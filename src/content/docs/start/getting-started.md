---
title: Getting started
description: From a bare Android wall panel to your Home Assistant dashboard in minutes, with Home Assistant guiding you through every step.
---

If you have tried to turn a wall panel or kiosk into a Home Assistant display before, you may remember how it went: sideloading apps, hunting for a browser engine that could draw a dashboard, guessing at settings, and never quite knowing whether the next reboot would undo it all. Setting up a panel with Panel Assistant will come as a pleasant shock. You can be done in minutes, and apart from a couple of taps on the panel itself, you can do all of it in Home Assistant without leaving your chair.

## 1. Install the integration

Add Panel Assistant through HACS and restart Home Assistant. This is the only thing you install by hand. From here on, Home Assistant guides you. See [Install the integration](/home-assistant/custom-integration/).

## 2. Switch on debugging on the panel

Open developer options on the panel and turn on wireless debugging, or USB debugging if you would rather plug the panel into your computer. That is what lets Home Assistant do the installing for you. The [hardware pages](/hardware/) show where the switch is on each model, and [Prepare the panel](/install/prepare-a-panel/) has the details.

## 3. Add the panel

In Home Assistant, go to **Settings**, **Devices and services**, **Add integration**, and choose **Panel Assistant**. The wizard asks where the panel is: type its address, or choose the USB option to set up a brand-new panel from your browser.

From there the wizard takes care of the messy part. It checks what is already on the panel, offers the current release of the panel app, asks you to tap **Allow** once on the panel's screen, then installs the app, starts it and confirms it is healthy. A panel that already runs the app is adopted, not reinstalled. The panel recognises its own model and loads the matching hardware profile, so its screen, buttons, LEDs and sensors arrive in Home Assistant ready to use. See [Add a panel](/install/installing-ha-paneld/).

## 4. Choose your dashboard

Home Assistant then offers the panel's own setup wizard. It connects the panel to Home Assistant and lets you pick the dashboard for the wall, and the panel loads only the entities that dashboard shows, which is what keeps it fast. See [Connect a panel](/home-assistant/connect-a-panel/).

## What you need

- Home Assistant 2026.8.3 or newer, with HACS.
- A wall panel running Android 8.0 or newer. Most panels work with the generic hardware profile, and [Choose a panel](/install/supported-panels/) lists the models with full hardware support.
- For the USB option, a Chromium-based browser such as Chrome or Edge.

## Where the detail lives

The pages under **Keep it running** cover each feature of the panel app in depth. The reference section documents the [API](/reference/api/), [hardware profiles](/reference/profiles/) and the [security model](/reference/security/), and the [hardware pages](/hardware/) cover each supported panel.
