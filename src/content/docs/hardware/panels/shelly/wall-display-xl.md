---
title: Shelly Wall Display XL
description: Hardware facts for the Shelly Wall Display XL, a 10.1 inch RK3566 panel on Android 11, codename Blake.
vendor: Shelly
model: Wall Display XL
soc: RK3566
android: '11'
screen: 10.1 in
support: Research
root: No user-facing adb or root
webview: 'Not established (WallDisplayV2 track carries no OTA WebView package)'
sidebar:
  label: XL
  order: 5
---

:::note
**Research only: no physical unit has been tested.** See the [Wall Display family page](/hardware/panels/shelly/) for sourcing, the firmware OTA mechanism, access model and security notes shared across the whole line.
:::

The Wall Display XL, firmware codename **Blake**, is a 10.1 in panel on a Rockchip RK3566 (Cortex-A55), Android 11 — the largest and most capable model in the [Shelly Wall Display family](/hardware/panels/shelly/). It is on the modern **WallDisplayV2** (arm64-v8a) OTA track, alongside the [X1i](/hardware/panels/shelly/wall-display-x1i/), [X2i](/hardware/panels/shelly/wall-display-x2i/), Maverick and Dayna, and has access to the built-in AppStore.

## Also sold as

Shelly Wall Display XL, firmware codename Blake.

|         |                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| SoC     | Rockchip **RK3566**, Cortex-A55                                                                                    |
| Display | 10.1 in                                                                                                            |
| Android | 11                                                                                                                 |
| ABI     | arm64-v8a                                                                                                          |
| Sensors | Ambient light documented; a motion sensor (official, exact technology unverified); Android API exposure unverified |
| Relay   | 1 output                                                                                                           |
| Root    | No user-facing adb or root; the modern OTA declares no build type                                                  |

:::caution
The built-in Home Assistant browser on the XL had rendering and layout problems with Home Assistant frontend 2025.12 and a 2026.1 pre-release (tracked in [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755) and `#28746`; core compatibility in [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665)). An app using the system WebView on the same device rendered correctly, which shows the issue was specific to the built-in browser's WebView rather than the hardware.
:::

See the [Wall Display family page](/hardware/panels/shelly/) for the full access-model reasoning, the OTA update endpoints (`WallDisplayV2` track) and the firmware version history.

## Source

[Shelly Wall Display XL knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-xl).
