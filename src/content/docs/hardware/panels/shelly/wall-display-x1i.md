---
title: Shelly Wall Display X1i
description: Hardware facts for the Shelly Wall Display X1i, a 4 inch RK3326-S panel on Android 11, codename Cally.
vendor: Shelly
model: Wall Display X1i
soc: RK3326-S
android: '11'
screen: 4 in, 720 × 720
support: Research
root: Not established on this model
webview: 'Not established (WallDisplayV2 track carries no OTA WebView package)'
released: '2026-07 (est.)'
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
**Research only: no unit of this model has been tested.** See the [Wall Display family page](/hardware/panels/shelly/) for sourcing, the firmware OTA mechanism, access model and security notes shared across the whole line.
:::

The Wall Display X1i, firmware codename **Cally**, is a 4 in 720×720 panel on a Rockchip RK3326-S (Cortex-A35), Android 11. It is on the modern **WallDisplayV2** (arm64-v8a) OTA track, alongside the [X2i](/hardware/panels/shelly/wall-display-x2i/), [XL](/hardware/panels/shelly/wall-display-xl/), Maverick and Dayna, and has access to the built-in AppStore.

## Also sold as

Shelly Wall Display X1i, firmware codename Cally.

|          |                                                                                                                                                                                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC      | Rockchip **RK3326-S**, Cortex-A35                                                                                                                                                                                                                                                                                                          |
| Display  | **720×720 square**, 4 in                                                                                                                                                                                                                                                                                                                   |
| Android  | 11                                                                                                                                                                                                                                                                                                                                         |
| ABI      | arm64-v8a                                                                                                                                                                                                                                                                                                                                  |
| Sensors  | Ambient light and proximity documented; no temperature or humidity sensor; Android API exposure unverified                                                                                                                                                                                                                                 |
| Relay    | Interchangeable base: 1 output as standard, optional 2-output base                                                                                                                                                                                                                                                                         |
| Root     | Not established on this model; the modern OTA declares no build type. On a [Wall Display X2i](/hardware/panels/shelly/wall-display-x2i/) tested on factory firmware 2.5.4, developer options and USB debugging unlock from the Settings app and adb then connects, still without root; whether the same applies to this model is untested. |
| Released | About July 2026 (est.); Shelly announced the X1i on 15 July 2026 ([launch coverage, TechBuzz Ireland, July 2026](https://techbuzzireland.com/2026/07/15/shelly-expands-its-smart-home-portfolio-with-wall-display-x1i-and-blu-motion-zb/))                                                                                                 |

From Panel Assistant 1.0 the X1i uses the shared Shelly profile, which carries what the [X2i](/hardware/panels/shelly/wall-display-x2i/) showed about this firmware: full screen-off without root, and Back and Home without Recents. Its own sensors are checked on the panel when Panel Assistant starts. No X1i has been confirmed yet, so a report from an owner is welcome; see [What the X2i means for the rest of the line](/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

See the [Wall Display family page](/hardware/panels/shelly/) for the full access-model reasoning, the OTA update endpoints (`WallDisplayV2` track) and the firmware version history.

## Source

[Shelly Wall Display X1i knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x1i).
