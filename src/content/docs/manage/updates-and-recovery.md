---
title: Updates and recovery
description: Keeping the app on a panel current, and what can be recovered when something goes wrong.
---

## Updating a panel

Updating a panel from inside Home Assistant is not part of the integration yet; it is one of the next things on the list. Until then there are two routes.

**From the panel, with no computer.** Panels set up with the project's [F-Droid repository](https://github.com/maxlyth/ha-paneld/blob/main/docs/fdroid.md) are told when a new version is published and the update is a tap on the panel. Stable releases go to that channel; release candidates do not.

**From a computer.** The [command-line installer](/manage/command-line-install/) run against the panel's address again fetches the current release and installs it over the top, leaving the panel's setup in place. The same tool can update several panels in one run.

## What an update protects

The installer takes a snapshot of the panel's data before it changes anything, refuses to proceed in conditions it cannot recover from, and leaves your setup in place. [Provisioning safety](https://github.com/maxlyth/ha-paneld/blob/main/docs/provisioning-safety.md) describes exactly what is protected and when it stops.

Before a change you are unsure about, export the panel's configuration. The installer can write it to a file you can restore later, as described in [provisioning](https://github.com/maxlyth/ha-paneld/blob/main/docs/provisioning.md).

## Recovery

A dashboard that will not load after an update is usually the system WebView or the dashboard itself, and the panel has its own [startup and recovery](https://github.com/maxlyth/ha-paneld/blob/main/docs/built-in-renderer.md#startup-and-recovery) behaviour for that. [Troubleshooting](/manage/troubleshooting/) covers the usual causes. Going back to an earlier release is not something the documentation currently describes, so treat a configuration export as your way back.

Recovery below the app is a different matter. Panel Assistant never touches a panel's firmware, but some rooted panels can have their firmware partitions backed up and restored by hand, and that is documented in [firmware backup and restore](https://github.com/maxlyth/ha-paneld/blob/main/docs/firmware-backup-restore.md).

:::danger
Firmware restore is experimental and has not been tested against a bricked device. Treat partition-level work on a panel as something that can leave it unusable, and read that document in full before starting.
:::
