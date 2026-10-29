---
title: Shelly Wall Display X2
description: Hardware facts for the Shelly Wall Display X2, a 6.9 inch SC7731E panel on Android 8.1, codename Pegasus.
vendor: Shelly
model: Wall Display X2
soc: SC7731E
android: '8.1'
screen: 6.9 in, 1440 × 720
support: Untested
root: Not established on this model
webview_ships_with: 'Not established'
webview_can_reach: 'Not established — no verified provider update route for this model'
released: '2025-01 (est.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x2-front.jpg'
    alt: Shelly Wall Display X2, front
photoCredit: 'Photo: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display X2
  order: 2
---

:::note
**No unit of this model has been tested.** Panel Assistant matches it to the bundled legacy Shelly profile, which no X2 has run yet. See the [Wall Display family page](/hardware/panels/shelly/) for sourcing, the firmware OTA mechanism, access model and security notes shared across the whole line.
:::

The Wall Display X2, firmware codename **Pegasus**, is a 6.9 in 1440×720 panel on a Spreadtrum/UNISOC SC7731E (Cortex-A7), Android 8.1. It is on the legacy **WallDisplay** (armeabi-v7a) OTA track, alongside the [original](/hardware/panels/shelly/wall-display/).

## Initial debugging access

**Network ADB on TCP port 5555 without a computer: not established on this model.** Initial USB debugging and the vendor-menu unlock are also unverified here. The [X2i procedure](/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) is confirmed on the X2i only; shared firmware does not prove that it works here. Ask Shelly for the procedure for your model and firmware. Use the [USB installer](/install/install-over-usb/) only once USB debugging and a USB data connection are available. A root-capable build alone does not enable debugging.

## Also sold as

Shelly Wall Display X2, SAWD-2A1XX10EU1, firmware codename Pegasus, device ID e500_7731e_32u_o.

|          |                                                                                                                                                                                                                                          |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | Spreadtrum/UNISOC **SC7731E**, Cortex-A7                                                                                                                                                                                                 |
| Display  | **1440×720**, 6.9 in                                                                                                                                                                                                                     |
| Android  | 8.1                                                                                                                                                                                                                                      |
| ABI      | armeabi-v7a                                                                                                                                                                                                                              |
| Sensors  | Temperature, humidity, ambient light and proximity documented; Android API exposure unverified                                                                                                                                           |
| Relay    | 1 output                                                                                                                                                                                                                                 |
| Root     | Not established on this model; no OTA build-type evidence established for this model specifically                                                                                                                                        |
| Released | About January 2025 (est.); announced with Shelly's Gen4 series at CES 2025 ([Shelly's own CES 2025 press page](https://us.shelly.com/blogs/media-kit/shelly-is-set-to-launch-shelly-dimmer-gen3-and-shelly-wall-display-x2-at-ces-2025)) |

See the [Wall Display family page](/hardware/panels/shelly/) for the full access-model reasoning, the OTA update endpoints (`WallDisplay` track) and the firmware version history.

## Source

[Shelly Wall Display X2 knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2).
