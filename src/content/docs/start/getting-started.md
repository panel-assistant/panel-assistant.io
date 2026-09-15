---
title: Getting started
description: From a bare Android wall panel to your Home Assistant dashboard in minutes, with Home Assistant guiding you through every step.
---

If you have set up a wall panel or kiosk before, you probably remember how it went: sideloading apps, hunting for a browser engine that could draw a dashboard, guessing at settings, and never quite trusting the next reboot. Setting up a panel with Panel Assistant will come as a pleasant shock. You can be done in minutes, and even with the panel on the wall you won't have to get up from your chair. OK, maybe once ;-)

The hard part of any panel is the first hour. Panel Assistant does that hour for you, from inside Home Assistant. If the panel is already on your network, give the integration its address and it does the rest. If it is still in the box, plug it into your laptop with a USB cable and install straight from your browser, before it ever goes on the wall. Either way you approve one prompt on the panel and watch it through.

## 1. Install the integration

Add Panel Assistant through HACS and restart Home Assistant. This is the only thing you install by hand. From here on, Home Assistant guides you. See [Install the integration](/home-assistant/custom-integration/).

## 2. Switch on debugging on the panel

Open developer options on the panel and turn on wireless debugging, or USB debugging if you are plugging the panel in. That is what lets Home Assistant do the installing for you. The [hardware pages](/hardware/) show where the switch is on each model, and [Prepare the panel](/install/prepare-a-panel/) has the details.

## 3. Add the panel

In Home Assistant, go to **Settings**, **Devices and services**, **Add integration**, and choose **Panel Assistant**. The wizard starts by asking how the panel is connected.

<figure class="pa-shot">
<img class="light:sl-hidden" src="asset:ha-setup-panel-menu-dark.png" width="580" height="314" alt="The Set up a panel step in Home Assistant, offering Add a panel on your network or Install using USB on this computer">
<img class="dark:sl-hidden" src="asset:ha-setup-panel-menu-light.png" width="580" height="314" alt="The Set up a panel step in Home Assistant, offering Add a panel on your network or Install using USB on this computer">
</figure>

For a panel on your network, all it needs from you is the address.

<figure class="pa-shot">
<img class="light:sl-hidden" src="asset:ha-add-panel-address-dark.png" width="580" height="377" alt="The Add a panel step in Home Assistant, with the panel's IP address entered and a Submit button">
<img class="dark:sl-hidden" src="asset:ha-add-panel-address-light.png" width="580" height="377" alt="The Add a panel step in Home Assistant, with the panel's IP address entered and a Submit button">
</figure>

From there the wizard takes care of the messy part. It checks what is already on the panel, offers the current release of the panel app, asks you to tap **Allow** once on the panel's screen, then installs the app, starts it and confirms it is healthy. A panel that already runs the app is adopted, not reinstalled. The panel recognises its own model and loads the matching hardware profile, so its screen, buttons, LEDs and sensors arrive in Home Assistant ready to use. See [Add a panel](/install/installing-ha-paneld/).

## 4. Choose your dashboard

Home Assistant then offers the panel's own setup wizard. It connects the panel to Home Assistant and lets you pick the dashboard for the wall, and the panel loads only the entities that dashboard shows, which is what keeps it fast. See [Connect a panel](/home-assistant/connect-a-panel/).

## What you need

- Home Assistant 2026.8.3 or newer, with HACS.
- A wall panel running Android 8.0 or newer. Most panels work with the generic hardware profile, and [Choose a panel](/install/supported-panels/) lists the models with full hardware support.
- For the USB option, a Chromium-based browser such as Chrome or Edge.

## Where the detail lives

The pages under **Keep it running** cover each feature of the panel app in depth. The reference section documents the [API](/reference/api/), [hardware profiles](/reference/profiles/) and the [security model](/reference/security/), and the [hardware pages](/hardware/) cover each supported panel.
