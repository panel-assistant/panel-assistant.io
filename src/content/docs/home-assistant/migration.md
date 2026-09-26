---
title: After the 0.9.8 update
description: What to do when ha-paneld updates to the Panel Assistant Android app.
---

Version 0.9.8 updates ha-paneld to the **Panel Assistant Android app**, including when your panel updates unattended. Your existing dashboard choice and panel settings carry over. You do not need to reinstall or reset the panel.

The **Panel Assistant integration in Home Assistant is required** going forward:

1. [Install the Panel Assistant integration through HACS](/home-assistant/custom-integration/), or update it in HACS if you already have it. Restart Home Assistant when HACS asks you to.
2. If your panel already appears under **Settings → Devices and services → Panel Assistant**, there is nothing to add again. Otherwise, add your **existing panel** there using its hostname or address. The integration connects to the app already on the panel; this is not a new panel installation.

If your panel's hardware entities still use MQTT, that connection does not move them by itself. [Move a panel from MQTT](/home-assistant/move-from-mqtt/) explains the separate handover. MQTT remains available for now, but support will be removed in a later release.

For help finding your panel's address or checking its connection, see [Connect a panel](/home-assistant/connect-a-panel/) and [Troubleshooting](/manage/troubleshooting/).
