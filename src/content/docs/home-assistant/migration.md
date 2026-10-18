---
title: Panel Assistant is required
description: What to do when a panel says Panel Assistant is required, and the way from a 0.9 panel app to Panel Assistant 1.0.
---

A panel that shows **Panel Assistant is required** with this page's address runs a 0.9 panel app that has not connected to the Panel Assistant integration in Home Assistant yet. Your dashboard choice and panel settings are still on the panel. You do not need to reinstall or reset it.

Panel Assistant 1.0 cannot take over a panel that still runs the old ha-paneld app or uses MQTT, so the way to 1.0 goes through Panel Assistant 0.9.0:

1. [Install the Panel Assistant integration through HACS](/home-assistant/custom-integration/) and choose version **0.9.0** before the first restart. If you already have Panel Assistant 1.0, follow [if a move was not finished](/manage/upgrade-to-1-0/#if-a-move-was-not-finished) before changing versions. Restart Home Assistant when HACS asks you to.
2. If your panel already appears under **Settings → Devices and services → Panel Assistant**, there is nothing to add again. Otherwise, add your **existing panel** there using its hostname or address; this is not a new panel installation.
3. Open **Settings → Repairs**. If Panel Assistant says the panel still runs the old ha-paneld app, follow its Repair to move the panel to the Panel Assistant app. If the panel's hardware entities still use MQTT, [move a panel from MQTT](/home-assistant/move-from-mqtt/) explains that handover, which 0.9.0 completes.
4. Once 0.9.0 lists no move for any of your panels, update to 1.0 as [upgrading to 1.0](/manage/upgrade-to-1-0/) describes.

For help finding your panel's address or checking its connection, see [Connect a panel](/home-assistant/connect-a-panel/) and [Troubleshooting](/manage/troubleshooting/).
