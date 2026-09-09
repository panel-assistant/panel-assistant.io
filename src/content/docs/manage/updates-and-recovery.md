---
title: Updates and recovery
description: Updating ha-paneld on one panel or several, and what can be recovered when something goes wrong.
---

## Updating one panel

An update is the same command as an install. Point it at the panel again and it fetches the current release and provisions it:

```sh
curl -fsSL https://raw.githubusercontent.com/maxlyth/ha-paneld/main/scripts/install.sh | bash -s -- --provision 192.168.1.50:5555
```

Without `--prerelease` it follows stable releases only. An update leaves the panel's existing setup in place; the separate `--reset-config` option is what erases it and starts guided setup as a genuine first run.

Panels set up through the project's [F-Droid repository](https://github.com/maxlyth/ha-paneld/blob/main/docs/fdroid.md) can be updated from the panel instead. F-Droid notifies the panel when a new version is published and the update is a tap, with no computer involved. Stable releases go to that channel; release candidates do not.

## Updating several panels

There is a script for updating a set of panels in one run, described under _Updating a whole fleet_ in [provisioning](https://github.com/maxlyth/ha-paneld/blob/main/docs/provisioning.md). It takes a list of addresses and applies the same release to each.

## What the installer protects

[Provisioning safety](https://github.com/maxlyth/ha-paneld/blob/main/docs/provisioning-safety.md) is the document to read before any update that matters. It covers the snapshot the installer takes of a panel's database before it changes anything, the conditions under which a run refuses to proceed, and the boundaries that apply when several panels are updated together.

Export a panel's configuration before a change you are unsure about. The installer's `--export` option writes it to a file you can restore later, and it is documented in [provisioning](https://github.com/maxlyth/ha-paneld/blob/main/docs/provisioning.md).

## Recovery

For a dashboard that will not load after an update, the built-in renderer has its own [startup and recovery](https://github.com/maxlyth/ha-paneld/blob/main/docs/built-in-renderer.md#startup-and-recovery) behaviour, and [troubleshooting](/manage/troubleshooting/) covers the usual causes. Returning a panel to an earlier release is not something the documentation currently describes, so treat a configuration export as your way back rather than assuming you can reinstall over the top.

Recovery below the app is a different matter. Some rooted panels can have their firmware partitions backed up and restored, and that is documented in [firmware backup and restore](https://github.com/maxlyth/ha-paneld/blob/main/docs/firmware-backup-restore.md).

:::danger
Firmware restore is experimental and has not been tested against a bricked device. Treat partition-level work on a panel as something that can leave it unusable, and read that document in full before starting.
:::

## Before you change anything on a panel you depend on

Take the configuration export first and check you can still reach the panel over ADB, because most of what goes wrong during an update is far easier to undo when you have both.
