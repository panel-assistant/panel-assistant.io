---
title: Shelly Wall Display X2i
description: Hardware facts for the Shelly Wall Display X2i, a 6.9 inch RK3326-S panel on Android 11, codename Jenna.
vendor: Shelly
model: Wall Display X2i
soc: RK3326-S
android: '11'
screen: 6.9 in, 1440 × 720
support: Research
root: No user-facing adb or root
webview: 'Not established (WallDisplayV2 track carries no OTA WebView package)'
sidebar:
  label: X2i
  order: 4
---

:::note
**Research only: no physical unit has been tested.** See the [Wall Display family page](/hardware/panels/shelly/) for sourcing, the firmware OTA mechanism, access model and security notes shared across the whole line.
:::

:::caution
An archived partition image filed under an XL-like SKU identifies itself as `Jenna` and describes a different display platform than this page's official specification. It is evidence about that image, not about current retail X2i units; use runtime identifiers when matching an actual device.
:::

The Wall Display X2i, firmware codename **Jenna**, is a 6.9 in 1440×720 panel on a Rockchip RK3326-S (Cortex-A35), Android 11. It is on the modern **WallDisplayV2** (arm64-v8a) OTA track, alongside the [X1i](/hardware/panels/shelly/wall-display-x1i/), [XL](/hardware/panels/shelly/wall-display-xl/), Maverick and Dayna, and has access to the built-in AppStore.

## Also sold as

Shelly Wall Display X2i, firmware codename Jenna.

|         |                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------- |
| SoC     | Rockchip **RK3326-S**, Cortex-A35                                                                          |
| Display | **1440×720**, 6.9 in                                                                                       |
| Android | 11                                                                                                         |
| ABI     | arm64-v8a                                                                                                  |
| Sensors | Ambient light and proximity documented; no temperature or humidity sensor; Android API exposure unverified |
| Relay   | Interchangeable base: 1 output as standard, optional 2-output base                                         |
| Root    | No user-facing adb or root; the modern OTA declares no build type                                          |

See the [Wall Display family page](/hardware/panels/shelly/) for the full access-model reasoning, the OTA update endpoints (`WallDisplayV2` track) and the firmware version history.

## Source

[Shelly Wall Display X2i knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2i).
