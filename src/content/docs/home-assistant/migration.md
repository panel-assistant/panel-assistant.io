---
title: After the 0.9.8 update
description: What to do when ha-paneld updates to the Panel Assistant Android app.
---

Version 0.9.8 updates ha-paneld to the **Panel Assistant Android app**, including when your panel updates unattended. Your existing dashboard choice and panel settings carry over. You do not need to reinstall or reset the panel.

The **Panel Assistant integration in Home Assistant is required** going forward:

1. [Install the Panel Assistant integration through HACS](/home-assistant/custom-integration/), choosing **0.9.0** before the first restart if your panel still runs the old app or uses MQTT. If you already run 0.9.0, finish its moves before updating to 1.0. Restart Home Assistant when HACS asks you to.
2. If your panel already appears under **Settings → Devices and services → Panel Assistant**, there is nothing to add again. Otherwise, add your **existing panel** there using its hostname or address; this is not a new panel installation.

If Panel Assistant says the panel still runs the old ha-paneld app, Panel Assistant 1.0 cannot move it to the new app. For an installation that has not run 1.0 yet, install Panel Assistant 0.9.0 first (in HACS, open Panel Assistant, choose **Redownload** and pick version 0.9.0), add the panel and move it with its Repair, then update to 1.0. If you already installed 1.0, follow [if a move was not finished](/manage/upgrade-to-1-0/#if-a-move-was-not-finished) before changing versions.

If your panel's hardware entities still use MQTT, that connection does not move them by itself. [Move a panel from MQTT](/home-assistant/move-from-mqtt/) explains the separate handover, which Panel Assistant 0.9.0 completes before you update to 1.0. If you already have 1.0 and see a Repair about the MQTT move, follow [if a move was not finished](/manage/upgrade-to-1-0/#if-a-move-was-not-finished) before changing versions.

For help finding your panel's address or checking its connection, see [Connect a panel](/home-assistant/connect-a-panel/) and [Troubleshooting](/manage/troubleshooting/).
