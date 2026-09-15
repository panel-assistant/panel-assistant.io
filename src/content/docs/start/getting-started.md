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

In Home Assistant, go to **Settings**, **Devices and services**, **Add integration**, and choose **Panel Assistant**. Then pick how the panel is connected.

### Plugged into your computer

A brand-new panel can be set up before it ever goes on the wall. Plug it into your computer with a USB cable and install straight from your browser. You need Chrome or Edge for this.

<div class="pa-steps" role="region" aria-label="Installing over USB, step by step" tabindex="0">
<figure>
<figcaption><span>1</span> Choose Install using USB</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="The Set up a panel step in Home Assistant, offering Add a panel on your network or Install using USB on this computer">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="The Set up a panel step in Home Assistant, offering Add a panel on your network or Install using USB on this computer">
</figure>
<figure>
<figcaption><span>2</span> Plug the panel in</figcaption>
<img class="light:sl-hidden" src="asset:usb-connect-dark.png" width="520" height="349" alt="The USB installer asking you to plug the panel in and press Find my panel">
<img class="dark:sl-hidden" src="asset:usb-connect-light.png" width="520" height="349" alt="The USB installer asking you to plug the panel in and press Find my panel">
</figure>
<figure>
<figcaption><span>3</span> Tap Allow on the panel</figcaption>
<img class="light:sl-hidden" src="asset:usb-allow-dark.png" width="520" height="318" alt="The USB installer waiting while you tap Allow on the panel's screen">
<img class="dark:sl-hidden" src="asset:usb-allow-light.png" width="520" height="318" alt="The USB installer waiting while you tap Allow on the panel's screen">
</figure>
<figure>
<figcaption><span>4</span> Press Install</figcaption>
<img class="light:sl-hidden" src="asset:usb-confirm-dark.png" width="520" height="349" alt="The USB installer ready to install, with a single Install button">
<img class="dark:sl-hidden" src="asset:usb-confirm-light.png" width="520" height="349" alt="The USB installer ready to install, with a single Install button">
</figure>
<figure>
<figcaption><span>5</span> Watch it install</figcaption>
<img class="light:sl-hidden" src="asset:usb-progress-dark.png" width="520" height="319" alt="The USB installer's progress bar while the app installs">
<img class="dark:sl-hidden" src="asset:usb-progress-light.png" width="520" height="319" alt="The USB installer's progress bar while the app installs">
</figure>
<figure>
<figcaption><span>6</span> Done</figcaption>
<img class="light:sl-hidden" src="asset:usb-done-dark.png" width="520" height="262" alt="The USB installer confirming the install and opening the panel's setup">
<img class="dark:sl-hidden" src="asset:usb-done-light.png" width="520" height="262" alt="The USB installer confirming the install and opening the panel's setup">
</figure>
</div>

### On your network

If the panel is already on the wall, all Home Assistant needs is its address.

<div class="pa-steps" role="region" aria-label="Adding a panel on your network, step by step" tabindex="0">
<figure>
<figcaption><span>1</span> Choose Add a panel on your network</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="The Set up a panel step in Home Assistant, offering Add a panel on your network or Install using USB on this computer">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="The Set up a panel step in Home Assistant, offering Add a panel on your network or Install using USB on this computer">
</figure>
<figure>
<figcaption><span>2</span> Give it the panel's address</figcaption>
<img class="light:sl-hidden" src="asset:ha-address-dark.png" width="580" height="378" alt="The Add a panel step, with the panel's IP address entered">
<img class="dark:sl-hidden" src="asset:ha-address-light.png" width="580" height="378" alt="The Add a panel step, with the panel's IP address entered">
</figure>
<figure>
<figcaption><span>3</span> Pick a version</figcaption>
<img class="light:sl-hidden" src="asset:ha-version-dark.png" width="580" height="305" alt="The Choose a version step, with the recommended release at the top of the list">
<img class="dark:sl-hidden" src="asset:ha-version-light.png" width="580" height="305" alt="The Choose a version step, with the recommended release at the top of the list">
</figure>
<figure>
<figcaption><span>4</span> Tap Allow on the panel, and it's added</figcaption>
<img class="light:sl-hidden" src="asset:ha-done-dark.png" width="580" height="210" alt="The Success step, confirming the panel was added to Home Assistant">
<img class="dark:sl-hidden" src="asset:ha-done-light.png" width="580" height="210" alt="The Success step, confirming the panel was added to Home Assistant">
</figure>
</div>

Either way, the wizard takes care of the messy part. It checks what is already on the panel, installs the current release of the panel app, starts it and confirms it is healthy. A panel that already runs the app is adopted, not reinstalled. The panel recognises its own model and loads the matching hardware profile, so its screen, buttons, LEDs and sensors arrive in Home Assistant ready to use. See [Add a panel](/install/installing-ha-paneld/).

## 4. Finish on the panel's own wizard

Home Assistant then opens the panel's own setup wizard, which asks a few quick questions, including a name for the panel and the dashboard for the wall. The panel loads only the entities that dashboard shows, which is what keeps it fast. See [Connect a panel](/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="The panel setup wizard, step by step" tabindex="0">
<figure>
<figcaption><span>1</span> Name the panel</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-name-dark.png" width="524" height="702" alt="The panel's setup wizard asking for a panel ID and friendly name, with a preview of the entity names Home Assistant will use">
<img class="dark:sl-hidden" src="asset:panel-setup-name-light.png" width="524" height="702" alt="The panel's setup wizard asking for a panel ID and friendly name, with a preview of the entity names Home Assistant will use">
</figure>
<figure>
<figcaption><span>2</span> Pick the dashboard and area</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-dashboard-dark.png" width="524" height="485" alt="The wizard with a dashboard and a Home Assistant area selected for the panel">
<img class="dark:sl-hidden" src="asset:panel-setup-dashboard-light.png" width="524" height="485" alt="The wizard with a dashboard and a Home Assistant area selected for the panel">
</figure>
<figure>
<figcaption><span>3</span> Turn on the entity filter</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-filter-dark.png" width="524" height="629" alt="The wizard recommending the entity filter for this panel, with the Home Assistant entity count">
<img class="dark:sl-hidden" src="asset:panel-setup-filter-light.png" width="524" height="629" alt="The wizard recommending the entity filter for this panel, with the Home Assistant entity count">
</figure>
<figure>
<figcaption><span>4</span> Almost there</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-almost-there-dark.png" width="524" height="339" alt="The wizard waiting while the panel builds its filtered entity set and loads the dashboard">
<img class="dark:sl-hidden" src="asset:panel-setup-almost-there-light.png" width="524" height="339" alt="The wizard waiting while the panel builds its filtered entity set and loads the dashboard">
</figure>
<figure>
<figcaption><span>5</span> All set</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-done-dark.png" width="524" height="526" alt="The wizard confirming the panel is set up and showing the dashboard">
<img class="dark:sl-hidden" src="asset:panel-setup-done-light.png" width="524" height="526" alt="The wizard confirming the panel is set up and showing the dashboard">
</figure>
</div>

## What you need

- Home Assistant 2026.8.3 or newer, with HACS.
- A wall panel running Android 8.0 or newer. Most panels work with the generic hardware profile, and [Choose a panel](/install/supported-panels/) lists the models with full hardware support.
- For the USB option, a Chromium-based browser such as Chrome or Edge.

## Where the detail lives

The pages under **Keep it running** cover each feature of the panel app in depth. The reference section documents the [API](/reference/api/), [hardware profiles](/reference/profiles/) and the [security model](/reference/security/), and the [hardware pages](/hardware/) cover each supported panel.
