---
title: Shelly Wall Display X1i
description: Hardware facts for the Shelly Wall Display X1i, a 4 inch RK3326-S panel on Android 11, codename Cally.
vendor: Shelly
model: Wall Display X1i
soc: RK3326-S
android: '11'
screen: 4 in, 720 × 720
support: Research
root: No user-facing adb or root
webview: 'Not established (WallDisplayV2 track carries no OTA WebView package)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x1i-front.jpg'
    alt: Shelly Wall Display X1i, front
  - src: 'asset:hardware-shelly-wall-display-x1i-silver.jpg'
    alt: Shelly Wall Display X1i, silver finish, front
  - src: 'asset:hardware-shelly-wall-display-x1i-rear-label.jpg'
    alt: Shelly Wall Display X1i, rear, showing the model label SAWD-6A1XX10EU0
photoCredit: 'Photo: Shelly'
sidebar:
  label: X1i
  order: 3
---

:::note
**Research only: no physical unit has been tested.** See the [Wall Display family page](/hardware/panels/shelly/) for sourcing, the firmware OTA mechanism, access model and security notes shared across the whole line.
:::

The Wall Display X1i, firmware codename **Cally**, is a 4 in 720×720 panel on a Rockchip RK3326-S (Cortex-A35), Android 11. It is on the modern **WallDisplayV2** (arm64-v8a) OTA track, alongside the [X2i](/hardware/panels/shelly/wall-display-x2i/), [XL](/hardware/panels/shelly/wall-display-xl/), Maverick and Dayna, and has access to the built-in AppStore.

## Also sold as

Shelly Wall Display X1i, firmware codename Cally.

|         |                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------- |
| SoC     | Rockchip **RK3326-S**, Cortex-A35                                                                          |
| Display | **720×720 square**, 4 in                                                                                   |
| Android | 11                                                                                                         |
| ABI     | arm64-v8a                                                                                                  |
| Sensors | Ambient light and proximity documented; no temperature or humidity sensor; Android API exposure unverified |
| Relay   | Interchangeable base: 1 output as standard, optional 2-output base                                         |
| Root    | No user-facing adb or root; the modern OTA declares no build type                                          |

See the [Wall Display family page](/hardware/panels/shelly/) for the full access-model reasoning, the OTA update endpoints (`WallDisplayV2` track) and the firmware version history.

## Source

[Shelly Wall Display X1i knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x1i).
