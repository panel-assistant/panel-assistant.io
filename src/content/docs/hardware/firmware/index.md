---
title: Firmware
description: Browse indexed Sonoff and Shelly firmware builds by model and version, with availability history and archive links.
sidebar:
  label: Overview
  order: 0
---

Wall panel vendors publish almost nothing about their firmware. Download URLs are unlisted, change without notice and disappear when a newer release ships, and release notes are often missing. The firmware index records what has been found so that a known build can still be located, verified and, where it has been archived, recovered after the vendor removes it.

## What the index records

For each firmware object the index records the model, version, download URL, size, availability checks and Wayback capture where one is recorded. [Browse all indexed builds by model and version](/hardware/firmware/builds/). The pages are generated from the [source `.dat` files](https://github.com/panel-assistant/panel-assistant.io/tree/main/tools/firmware-index) and the monitor's data history.

:::note
An entry exists only because a probe found it. Vendor CDNs cannot be listed, so a build missing from the index has not been found, which is not proof that it does not exist.
:::

## Firmware by vendor

- [Sonoff NSPanel Pro](/hardware/firmware/nspanel-pro/): the CoolKit CDN URL scheme, how to verify a URL, the update path and the hardware-verified flashing procedure. Its [86P and 120P builds](/hardware/firmware/builds/) are listed separately.
- Shelly Wall Display: the OTA tracks, update endpoints and file format are on the [Shelly Wall Display family page](/hardware/panels/shelly/#firmware-ota-mechanism). The [build index](/hardware/firmware/builds/) maps shared OTA tracks to each documented model.
- Smatek S9E: the two analysed stock images and their differences are on the [Smatek S9E](/hardware/panels/smatek-s9e/#firmware-versions) page.

Before changing firmware on any panel, read [Firmware backup and restore](/hardware/guides/firmware-backup-and-restore/).
