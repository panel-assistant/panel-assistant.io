---
title: Updates and recovery
description: Keeping the app on a panel current, and what can be recovered when something goes wrong.
---

## Updating a panel

**From Home Assistant.** Each panel has an update entity. When a newer version is published the entity offers it, and installing is a button press; Panel Assistant installs the update and confirms the panel came back healthy. This is the route to use.

An update starts when Panel Assistant or you explicitly request it. The panel app does not install scheduled updates. Its web interface's **Install** tab also lets you choose and install a panel-app version or a separate Home Assistant app version, including a pre-release. That choice applies to the installation you start; there is no saved update channel.

Android System WebView is maintained separately, through the Play Store, vendor firmware or a manual installation as appropriate for your panel. See [updating the system WebView](/hardware/guides/update-the-webview/).

### Panels that need ADB

When you install an update from Home Assistant, Panel Assistant uses ADB automatically for panels that cannot install the update themselves. If the panel accepts the connection without an on-screen tap, your original consent to install Panel Assistant also covers creating and storing an ADB key for future updates. If the panel requires approval on its screen, Home Assistant raises a Repair that names the panel and starts authorization. Follow the Repair to approve the prompt on that panel.

### A panel that cannot be updated

Some panels can only be updated over ADB, because they have no way to install an app themselves. On those, ADB is not a convenience: it is the whole update path, and if it stops working the panel keeps running normally while quietly staying on the version it has. Home Assistant shows a Repair naming the panel when this happens.

The usual cause is a change made on the panel rather than in Home Assistant. A vendor firmware update, a factory reset, or a vendor option that restores the shipped software can all switch Android's developer options back off, and that takes ADB with it. Nothing warns you at the time, because from the panel's point of view nothing is wrong.

Turning developer options and USB debugging back on restores the update path, and the steps are the same ones used when first preparing that panel: see [prepare a panel](/install/prepare-a-panel/#1-developer-options-and-debugging-are-on). Panels differ in how those settings are reached, and some vendors hide them behind a sequence of taps on an About screen.

## What an update protects

The installer takes a snapshot of the panel's data before it changes anything, refuses to proceed in conditions it cannot recover from, and leaves your setup in place. [Install safety](/manage/install-safety/) describes exactly what is protected and when it stops.

Before a change you are unsure about, export the panel's configuration. The installer can write it to a file you can restore later, as described in [command-line install](/manage/command-line-install/#check-or-export-an-existing-installation).

## Recovery

A dashboard that will not load after an update is usually the system WebView or the dashboard itself, and the panel has its own [startup and recovery](/manage/built-in-renderer/#startup-and-recovery) behaviour for that. [Troubleshooting](/manage/troubleshooting/) covers the usual causes. Going back to an earlier release is not something the documentation currently describes, so treat a configuration export as your way back.

Recovery below the app is a different matter. Panel Assistant never touches a panel's firmware, but some rooted panels can have their firmware partitions backed up and restored by hand, and that is documented in [firmware backup and restore](/hardware/guides/firmware-backup-and-restore/).

:::danger
Firmware restore is experimental and has not been tested against a bricked device. Treat partition-level work on a panel as something that can leave it unusable, and read that document in full before starting.
:::
