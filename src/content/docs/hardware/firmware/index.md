---
title: Firmware
description: What the panel firmware index records, where the complete Sonoff NSPanel Pro index lives, and the per-vendor firmware pages.
sidebar:
  label: Overview
  order: 0
---

Wall panel vendors publish almost nothing about their firmware. Download URLs are unlisted, change without notice and disappear when a newer release ships, and release notes are often missing. The firmware index records what has been found so that a known build can still be located, verified and, where it has been archived, recovered after the vendor removes it.

## What the index records

For each firmware object the index records the model and channel, the version, whether it is a full ROM, a diff between two versions or an app-only update, the verified CDN URL, the object's size, and whether a copy has been captured by the Wayback Machine. The source of truth is a set of plain data files in [`tools/firmware-index/`](https://github.com/maxlyth/ha-paneld/tree/main/tools/firmware-index) in the ha-paneld repository. Everything else is generated from them:

- The **complete index** lists every verified OTA URL for the Sonoff NSPanel Pro 86P and 120P, with sizes, CDN indices and archival status: [nspanel-pro-firmware-archive.md](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/nspanel-pro-firmware-archive.md).
- The **community Discussion** carries the recent upgrade targets and current community evidence, and takes contributions: [NSPanel Pro firmware: OTA URL index](https://github.com/maxlyth/ha-paneld/discussions/7). A scheduled job regenerates it from the data files.

The Discussion can lag the data files until the scheduled job next runs. When they disagree, the data files are the authority.

:::note
An entry exists only because a probe found it. Vendor CDNs cannot be listed, so a build missing from the index has not been found, which is not proof that it does not exist.
:::

## Firmware by vendor

- [Sonoff NSPanel Pro](/hardware/firmware/nspanel-pro/): the CoolKit CDN URL scheme, how to verify a URL, the update path and the hardware-verified flashing procedure.
- Shelly Wall Display: the OTA tracks, update endpoints and file format are on the [Shelly Wall Display](/hardware/panels/shelly-wall-display/#firmware-ota-mechanism) page. Its release URLs are tracked in the same index.
- Smatek S9E: the two analysed stock images and their differences are on the [Smatek S9E](/hardware/panels/smatek-s9e/#firmware-versions) page.

Before changing firmware on any panel, read [Firmware backup and restore](/hardware/guides/firmware-backup-and-restore/).
