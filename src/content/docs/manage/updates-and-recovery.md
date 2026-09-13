---
title: Updates and recovery
description: Keeping the app on a panel current, and what can be recovered when something goes wrong.
---

## Updating a panel

**From Home Assistant.** Each panel has an update entity. When a newer version is published the entity offers it, and installing is a button press; Home Assistant asks the panel to update itself and then confirms it came back healthy. This is the route to use.

**From a computer.** The [command-line installer](/manage/command-line-install/) run against the panel's address fetches the current release and installs it over the top, leaving the panel's setup in place. The same tool can update several panels in one run, which is why it is still the better option for a large change across many panels.

## What an update protects

The installer takes a snapshot of the panel's data before it changes anything, refuses to proceed in conditions it cannot recover from, and leaves your setup in place. [Install safety](/manage/install-safety/) describes exactly what is protected and when it stops.

Before a change you are unsure about, export the panel's configuration. The installer can write it to a file you can restore later, as described in [command-line install](/manage/command-line-install/#check-or-export-an-existing-installation).

## Recovery

A dashboard that will not load after an update is usually the system WebView or the dashboard itself, and the panel has its own [startup and recovery](/manage/built-in-renderer/#startup-and-recovery) behaviour for that. [Troubleshooting](/manage/troubleshooting/) covers the usual causes. Going back to an earlier release is not something the documentation currently describes, so treat a configuration export as your way back.

Recovery below the app is a different matter. Panel Assistant never touches a panel's firmware, but some rooted panels can have their firmware partitions backed up and restored by hand, and that is documented in [firmware backup and restore](/hardware/guides/firmware-backup-and-restore/).

:::danger
Firmware restore is experimental and has not been tested against a bricked device. Treat partition-level work on a panel as something that can leave it unusable, and read that document in full before starting.
:::
