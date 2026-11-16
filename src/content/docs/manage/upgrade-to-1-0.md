---
title: Upgrading to 1.0
description: Moving Home Assistant and your panels from Panel Assistant 0.9 to 1.0, and what going back means.
---

Panel Assistant 1.0 and the 1.0 panel app move together. The 1.0 integration talks only to the 1.0 panel app, and the 1.0 panel app talks only to the 1.0 integration, so neither works with a 0.9 partner. You update the integration first, then each panel from Home Assistant, and **a panel that runs the 1.0 app cannot go back to 0.9**. Read the whole page before you start. The [1.0.0 release notes](/release-notes/#panel-assistant-100) list everything that changed.

## Before you start

**Finish everything 0.9.0 has to do.** Run Panel Assistant **0.9.0** and open **Settings**, **Repairs**. Panel Assistant 1.0 can no longer move a panel off MQTT, or a panel still running the old ha-paneld app, so it leaves both alone. If 0.9.0 lists either for any of your panels, follow its Repair until the panel has moved; [move a panel from MQTT](/home-assistant/move-from-mqtt/) explains the MQTT part. If you run a Panel Assistant older than 0.9.0, update to 0.9.0 first and let it finish.

**Make a Home Assistant backup.** Under **Settings**, **System**, **Backups**, create a backup and keep it until every panel runs 1.0 and you are happy with them. It is your way back for the Home Assistant side.

**Keep a backup of each panel.** On each panel's web interface, open **Install**, then **Backup**, and keep the downloaded `.hpb` file. Panel Assistant also saves the panel's settings before each update, but your own copy is the one you can restore yourself.

## 1. Update the integration

On Home Assistant **2026.11 or newer**, install the Panel Assistant update from **Settings**, **Updates**. On supported older versions, **2026.8.3 through 2026.10**, download the update in HACS. Then restart Home Assistant to load the new integration, following the restart Repair or HACS prompt. [Install the integration](/home-assistant/custom-integration/#updates) explains updates through Marketplace or HACS.

## 2. Check the Repairs

After the restart, open **Settings**, **Repairs** again.

- **"… needs app …"** is expected on every panel that still runs a 0.9 app. Until it updates, Home Assistant cannot see or control that panel and its entities show as unavailable. The panel itself keeps working, with its settings and history.
- **"… cannot receive app updates"** means Panel Assistant has no way to install on that panel, usually after a change made on the panel itself, such as a firmware update or a reset. Reconnect the panel to Panel Assistant by USB, as the Repair's **Learn more** describes, and the update becomes available. Nothing is removed: on a panel that already has the app, the USB installer installs nothing and only lets Panel Assistant reach it again.
- **"… was never moved off MQTT"** means its MQTT move was not finished in 0.9.0. See [if a move was not finished](#if-a-move-was-not-finished).
- **"… still runs the old app"** means the old ha-paneld app needs replacing. Follow the [manual route](#a-panel-still-runs-the-old-app).

## 3. Update one panel, then the rest

Each panel's update entity in Home Assistant offers the latest 1.0 panel app. Install it on one panel first and use that panel for a while before you install it on the others, because that panel cannot go back. Panel Assistant backs up the panel's settings, installs the update and confirms the panel came back healthy, as described in [updates and recovery](/manage/updates-and-recovery/). Settings carry over from the 0.9 panel app.

## Going back

There are two halves, and they differ.

**A panel on the 1.0 app stays on 1.0.** The panel app refuses to install an older version over itself, Panel Assistant never offers one, and a 0.9 integration cannot talk to it. If a 1.0 panel misbehaves, look in [troubleshooting](/manage/troubleshooting/), then report it with a [support report](/home-assistant/support-report/) so it can be fixed in a future release.

**The integration can go back while no panel runs 1.0.** Restore the Home Assistant backup you made before you started. That also undoes any other change made in Home Assistant since you created it. Your panels are still on their 0.9 app and reconnect to 0.9.0. Once any panel runs the 1.0 app, restoring the backup leaves that panel out of reach from Home Assistant until the integration is on 1.0 again.

Do not go back by installing 0.9.0 over 1.0 through Marketplace or HACS. The 1.0 update removes a setting 0.9.0 relies on, and without it 0.9.0 hands panels that were already moved back to MQTT, where the 1.0 panel app no longer answers. Restore the backup instead.

## If a move was not finished

If 1.0 tells you a panel was never moved off MQTT, follow the Repair’s safe recovery steps to finish the move with Panel Assistant 0.9.0, then return to 1.0. Do not install 0.9.0 over 1.0 through Marketplace or HACS.

While none of your panels runs the 1.0 app yet, return to 0.9.0 by restoring the Home Assistant backup you made before updating, for the reason above. Then finish the move in 0.9.0 and start this page again. If other panels already run the 1.0 app, or you have no backup from before the update, ask on [Discord](https://panel-assistant.io/go/discord) or in the [issues](https://github.com/panel-assistant/ha-integration/issues) before you change anything.

For a panel still on MQTT, the Repair also offers starting fresh: delete the panel's device under the MQTT integration and add the panel again. That creates new entities and keeps none of its history.

### A panel still runs the old app

The 0.9.0 move remains the supported route for panels it handles. If a panel still runs the old ha-paneld app and that move cannot finish, use the manual route below with the current Panel Assistant. This replaces the app and creates a new Home Assistant device; history starts again, and automations using the old entities need checking. It does not require downgrading Panel Assistant.

1. On the old app’s web interface, open **Install** and use **Export settings**. Keep the file before removing the app. The export leaves out passwords and tokens by default, so keep any credentials you will need to enter again.
2. If you used the old app to quieten vendor apps, use **Restore the home screen** on its **Install** page before removing it. Keep network ADB enabled on port **5555** so Panel Assistant can install the new app.
3. Connect to the panel with ADB and remove only the old app:

   ```sh
   adb connect PANEL_IP:5555
   adb uninstall io.github.maxlyth.hapaneld
   ```

   Replace `PANEL_IP` with your panel’s address. Do not reset the panel.

4. Remove this panel’s existing entry from Panel Assistant in Home Assistant, if it has one. With the current Panel Assistant installed, [add the panel](/install/installing-ha-paneld/) to install the current app. Finish the linked panel setup page, including its name, Home Assistant address, sign-in and dashboard, then return to Home Assistant and select **Submit**.
5. On the new app’s web interface, open **Install**, choose **Import settings…** and select your export. Review the list of changes before applying them. MQTT settings do not come across. Settings saved at the old app’s defaults can replace the new app’s defaults, so inspect the voice assistant and entity filter on **Configure** afterwards.
6. After importing, open **Configure → Home Assistant connection** and use **Reconnect** next to **Browser sign-in** to sign in again. The import can clear part of the sign-in and cause **Home Assistant sign-in rejected** when the token next refreshes. Verify that the dashboard loads and that the panel connects in Home Assistant, then check your settings and automations.
