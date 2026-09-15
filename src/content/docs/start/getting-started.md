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

In Home Assistant, go to **Settings**, **Devices and services**, **Add integration**, and choose **Panel Assistant**. This is the whole wizard for a panel on your network:

<div class="pa-steps" role="region" aria-label="The add panel wizard, step by step" tabindex="0">
<figure>
<img class="light:sl-hidden" src="asset:ha-setup-panel-menu-dark.png" width="580" height="314" alt="The Set up a panel step in Home Assistant, offering Add a panel on your network or Install using USB on this computer">
<img class="dark:sl-hidden" src="asset:ha-setup-panel-menu-light.png" width="580" height="314" alt="The Set up a panel step in Home Assistant, offering Add a panel on your network or Install using USB on this computer">
<figcaption><span>1</span> Choose how the panel is connected</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:ha-add-panel-address-dark.png" width="580" height="377" alt="The Add a panel step, with the panel's IP address entered">
<img class="dark:sl-hidden" src="asset:ha-add-panel-address-light.png" width="580" height="377" alt="The Add a panel step, with the panel's IP address entered">
<figcaption><span>2</span> Give it the panel's address</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:ha-choose-version-dark.png" width="580" height="305" alt="The Choose a version step, with the recommended release at the top of the list">
<img class="dark:sl-hidden" src="asset:ha-choose-version-light.png" width="580" height="305" alt="The Choose a version step, with the recommended release at the top of the list">
<figcaption><span>3</span> Pick a version</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:ha-authorize-panel-dark.png" width="580" height="361" alt="The Authorize Home Assistant on the panel step, asking you to approve the debugging prompt on the panel's screen">
<img class="dark:sl-hidden" src="asset:ha-authorize-panel-light.png" width="580" height="361" alt="The Authorize Home Assistant on the panel step, asking you to approve the debugging prompt on the panel's screen">
<figcaption><span>4</span> Tap Allow on the panel</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:ha-installing-dark.png" width="580" height="420" alt="The installing step, with a progress spinner while Home Assistant installs and checks the panel app">
<img class="dark:sl-hidden" src="asset:ha-installing-light.png" width="580" height="420" alt="The installing step, with a progress spinner while Home Assistant installs and checks the panel app">
<figcaption><span>5</span> Watch it install</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:ha-panel-added-dark.png" width="580" height="210" alt="The Success step, confirming the panel was added to Home Assistant">
<img class="dark:sl-hidden" src="asset:ha-panel-added-light.png" width="580" height="210" alt="The Success step, confirming the panel was added to Home Assistant">
<figcaption><span>6</span> Done</figcaption>
</figure>
</div>

From there the wizard takes care of the messy part. It checks what is already on the panel, offers the current release of the panel app, asks you to tap **Allow** once on the panel's screen, then installs the app, starts it and confirms it is healthy. A panel that already runs the app is adopted, not reinstalled. The panel recognises its own model and loads the matching hardware profile, so its screen, buttons, LEDs and sensors arrive in Home Assistant ready to use. See [Add a panel](/install/installing-ha-paneld/).

## 4. Finish on the panel's own wizard

Home Assistant then opens the panel's own setup wizard, which asks a few quick questions. It finds Home Assistant and your MQTT broker on the network for you, so most steps are a matter of checking and pressing **Save and continue**. On the way you pick the dashboard for the wall, and the panel loads only the entities that dashboard shows, which is what keeps it fast. See [Connect a panel](/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="The panel setup wizard, step by step" tabindex="0">
<figure>
<img class="light:sl-hidden" src="asset:panel-setup-name-dark.png" width="524" height="702" alt="The panel's setup wizard asking for a panel ID and friendly name, with a preview of the entity names Home Assistant will use">
<img class="dark:sl-hidden" src="asset:panel-setup-name-light.png" width="524" height="702" alt="The panel's setup wizard asking for a panel ID and friendly name, with a preview of the entity names Home Assistant will use">
<figcaption><span>1</span> Name the panel</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:panel-setup-ha-url-dark.png" width="524" height="440" alt="The wizard showing the Home Assistant address it found on the network, ready to confirm">
<img class="dark:sl-hidden" src="asset:panel-setup-ha-url-light.png" width="524" height="440" alt="The wizard showing the Home Assistant address it found on the network, ready to confirm">
<figcaption><span>2</span> Confirm where Home Assistant is</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:panel-setup-sign-in-dark.png" width="524" height="686" alt="The wizard offering to sign in to Home Assistant from this browser, or on the panel itself">
<img class="dark:sl-hidden" src="asset:panel-setup-sign-in-light.png" width="524" height="686" alt="The wizard offering to sign in to Home Assistant from this browser, or on the panel itself">
<figcaption><span>3</span> Sign in</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:panel-setup-dashboard-dark.png" width="524" height="485" alt="The wizard with a dashboard and a Home Assistant area selected for the panel">
<img class="dark:sl-hidden" src="asset:panel-setup-dashboard-light.png" width="524" height="485" alt="The wizard with a dashboard and a Home Assistant area selected for the panel">
<figcaption><span>4</span> Pick the dashboard and area</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:panel-setup-mqtt-dark.png" width="524" height="694" alt="The wizard showing the MQTT broker it found on the network, with username and password fields">
<img class="dark:sl-hidden" src="asset:panel-setup-mqtt-light.png" width="524" height="694" alt="The wizard showing the MQTT broker it found on the network, with username and password fields">
<figcaption><span>5</span> Confirm the MQTT broker</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:panel-setup-filter-dark.png" width="524" height="629" alt="The wizard recommending the entity filter for this panel, with the Home Assistant entity count">
<img class="dark:sl-hidden" src="asset:panel-setup-filter-light.png" width="524" height="629" alt="The wizard recommending the entity filter for this panel, with the Home Assistant entity count">
<figcaption><span>6</span> Turn on the entity filter</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:panel-setup-almost-there-dark.png" width="524" height="339" alt="The wizard waiting while the panel builds its filtered entity set and loads the dashboard">
<img class="dark:sl-hidden" src="asset:panel-setup-almost-there-light.png" width="524" height="339" alt="The wizard waiting while the panel builds its filtered entity set and loads the dashboard">
<figcaption><span>7</span> Almost there</figcaption>
</figure>
<figure>
<img class="light:sl-hidden" src="asset:panel-setup-done-dark.png" width="524" height="526" alt="The wizard confirming the panel is set up, connected and showing the dashboard">
<img class="dark:sl-hidden" src="asset:panel-setup-done-light.png" width="524" height="526" alt="The wizard confirming the panel is set up, connected and showing the dashboard">
<figcaption><span>8</span> All set</figcaption>
</figure>
</div>

## What you need

- Home Assistant 2026.8.3 or newer, with HACS.
- A wall panel running Android 8.0 or newer. Most panels work with the generic hardware profile, and [Choose a panel](/install/supported-panels/) lists the models with full hardware support.
- For the USB option, a Chromium-based browser such as Chrome or Edge.

## Where the detail lives

The pages under **Keep it running** cover each feature of the panel app in depth. The reference section documents the [API](/reference/api/), [hardware profiles](/reference/profiles/) and the [security model](/reference/security/), and the [hardware pages](/hardware/) cover each supported panel.
