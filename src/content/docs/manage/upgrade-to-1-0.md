---
title: Upgrading to 1.0
description: Moving Home Assistant and your panels from Panel Assistant 0.9 to 1.0, and what going back means.
---

Panel Assistant 1.0 and the 1.0 panel app move together. The 1.0 integration talks only to the 1.0 panel app, and the 1.0 panel app talks only to the 1.0 integration, so neither works with a 0.9 partner. You update the integration first, then each panel from Home Assistant, and **a panel that runs the 1.0 app cannot go back to 0.9**. Read the whole page before you start.

## Before you start

**Finish everything 0.9.0 has to do.** Run Panel Assistant **0.9.0** and open **Settings**, **Repairs**. Panel Assistant 1.0 can no longer move a panel off MQTT, or a panel still running the old ha-paneld app, so it leaves both alone. If 0.9.0 lists either for any of your panels, follow its Repair until the panel has moved; [move a panel from MQTT](/home-assistant/move-from-mqtt/) explains the MQTT part. If you run a Panel Assistant older than 0.9.0, update to 0.9.0 first and let it finish.

**Make a Home Assistant backup.** Under **Settings**, **System**, **Backups**, create a backup and keep it until every panel runs 1.0 and you are happy with them. It is your way back for the Home Assistant side.

**Keep a backup of each panel.** On each panel's web interface, open **Install**, then **Backup**, and keep the downloaded `.hpb` file. Panel Assistant also saves the panel's settings before each update, but your own copy is the one you can restore yourself.

## 1. Update the integration

1.0 is offered as a pre-release first. In HACS, open **Panel Assistant**, turn on **Show beta versions**, and download the 1.0 version. Restart Home Assistant when HACS asks you to, or when the Repair **Restart Home Assistant to finish updating Panel Assistant** appears.

## 2. Check the Repairs

After the restart, open **Settings**, **Repairs** again.

- **"… needs app 1.0.0-preview1"** is expected on every panel that still runs a 0.9 app. Until it updates, Home Assistant cannot see or control that panel and its entities show as unavailable. The panel itself keeps working, with its settings and history.
- **"… cannot receive app updates"** means Panel Assistant has no way to install on that panel, usually after a change made on the panel itself, such as a firmware update or a reset. Reconnect the panel to Panel Assistant by USB, as the Repair's **Learn more** describes, and the update becomes available.
- **"… was never moved off MQTT"** or **"… still runs the old app"** means a move was not finished in 0.9.0. See [if a move was not finished](#if-a-move-was-not-finished).

## 3. Update one panel, then the rest

Each panel's update entity in Home Assistant offers the 1.0 panel app. Install it on one panel first and use that panel for a while before you install it on the others, because that panel cannot go back. Panel Assistant backs up the panel's settings, installs the update and confirms the panel came back healthy, as described in [updates and recovery](/manage/updates-and-recovery/). Settings carry over from the 0.9 panel app.

## Going back

There are two halves, and they differ.

**A panel on the 1.0 app stays on 1.0.** The panel app refuses to install an older version over itself, Panel Assistant never offers one, and a 0.9 integration cannot talk to it. If a 1.0 panel misbehaves, look in [troubleshooting](/manage/troubleshooting/), then report it with a [support report](/home-assistant/support-report/) so it can be fixed in the next preview.

**The integration can go back while no panel runs 1.0.** Restore the Home Assistant backup you made before you started. That also undoes any other change made in Home Assistant since you created it. Your panels are still on their 0.9 app and reconnect to 0.9.0. Once any panel runs the 1.0 app, restoring the backup leaves that panel out of reach from Home Assistant until the integration is on 1.0 again.

Do not go back by downloading 0.9.0 again in HACS over 1.0. The 1.0 update removes a setting 0.9.0 relies on, and without it 0.9.0 hands panels that were already moved back to MQTT, where the 1.0 panel app no longer answers. Restore the backup instead.

## If a move was not finished

If 1.0 tells you a panel was never moved off MQTT or still runs the old app, the Repair asks you to choose **Redownload** in HACS, pick 0.9.0, finish the move there, and then install 1.0 again. Do not redownload 0.9.0 over 1.0. While none of your panels runs the 1.0 app yet, return to 0.9.0 by restoring the Home Assistant backup you made before updating, for the reason above. Then finish the move in 0.9.0 and start this page again. If other panels already run the 1.0 app, or you have no backup from before the update, ask on [Discord](https://panel-assistant.io/go/discord) or in the [issues](https://github.com/panel-assistant/ha-integration/issues) before you change anything.

For a panel still on MQTT, the Repair also offers starting fresh: delete the panel's device under the MQTT integration and add the panel again. That creates new entities and keeps none of its history.
