---
title: Shelly Wall Display X2
description: Hardware facts for the Shelly Wall Display X2, a 6.9 inch SC7731E panel on Android 8.1, codename Pegasus.
vendor: Shelly
model: Wall Display X2
soc: SC7731E
android: '8.1'
screen: 6.9 in, 1440 × 720
support: Research
root: No user-facing adb or root
webview: 'Not established (WallDisplay track carries no OTA WebView package for this model)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x2-front.jpg'
    alt: Shelly Wall Display X2, front
photoCredit: 'Photo: Shelly'
sidebar:
  label: X2
  order: 2
---

:::note
**Research only: no physical unit has been tested.** See the [Wall Display family page](/hardware/panels/shelly/) for sourcing, the firmware OTA mechanism, access model and security notes shared across the whole line.
:::

The Wall Display X2, firmware codename **Pegasus**, is a 6.9 in 1440×720 panel on a Spreadtrum/UNISOC SC7731E (Cortex-A7), Android 8.1. It is on the legacy **WallDisplay** (armeabi-v7a) OTA track, alongside the [original](/hardware/panels/shelly/wall-display/).

## Also sold as

Shelly Wall Display X2, SAWD-2A1XX10EU1, firmware codename Pegasus, device ID e500_7731e_32u_o.

|         |                                                                                                |
| ------- | ---------------------------------------------------------------------------------------------- |
| SoC     | Spreadtrum/UNISOC **SC7731E**, Cortex-A7                                                       |
| Display | **1440×720**, 6.9 in                                                                           |
| Android | 8.1                                                                                            |
| ABI     | armeabi-v7a                                                                                    |
| Sensors | Temperature, humidity, ambient light and proximity documented; Android API exposure unverified |
| Relay   | 1 output                                                                                       |
| Root    | No user-facing adb or root; no OTA build-type evidence established for this model specifically |

See the [Wall Display family page](/hardware/panels/shelly/) for the full access-model reasoning, the OTA update endpoints (`WallDisplay` track) and the firmware version history.

## Source

[Shelly Wall Display X2 knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2).
