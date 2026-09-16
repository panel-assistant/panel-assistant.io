---
title: Shelly Wall Display (original)
description: Hardware facts for the original Shelly Wall Display, a 4 inch MT6580 panel on Android 7, codename Stargate.
vendor: Shelly
model: Wall Display (original)
soc: MT6580
android: '7.0'
screen: 4 in, 480 × 480
support: Research
root: No user-facing adb; userdebug base build, unconfirmed
webview: 'com.google.android.webview 119.0.6045.194 via official ZIP'
photos:
  - src: 'asset:hardware-shelly-wall-display-front.jpg'
    alt: Shelly Wall Display, original model, with its H&T sensor accessory
photoCredit: 'Photo: Shelly'
sidebar:
  label: Original
  order: 1
---

:::note
**Research only: no physical unit has been tested.** See the [Wall Display family page](/hardware/panels/shelly/) for sourcing, the firmware OTA mechanism, access model and security notes shared across the whole line.
:::

:::caution
**Ships Android 7.0**, which is below the minimum Android version Panel Assistant supports.
:::

The original Wall Display, firmware codename **Stargate**, is the entry model of the [Shelly Wall Display family](/hardware/panels/shelly/): a 4 in 480×480 panel on a MediaTek MT6580, Android 7. It is on the legacy **WallDisplay** (armeabi-v7a) OTA track, alongside the [X2](/hardware/panels/shelly/wall-display-x2/).

## Also sold as

Shelly Wall Display, Wall Display U1 (US), Wall Display D1, SAWD-0A1XX10EU1, firmware codename Stargate, device ID k400_mt6580_32_n.

|         |                                                                                                                                                                                                                                                 |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | MediaTek **MT6580**                                                                                                                                                                                                                             |
| Display | **480×480 square**, 4 in                                                                                                                                                                                                                        |
| Android | 7.0                                                                                                                                                                                                                                             |
| ABI     | armeabi-v7a                                                                                                                                                                                                                                     |
| Sensors | Temperature, humidity and ambient light documented; Android API exposure unverified                                                                                                                                                             |
| Relay   | 1 output                                                                                                                                                                                                                                        |
| WebView | Not in the standard OTA; Shelly publishes a separate ZIP installing `com.google.android.webview` **119.0.6045.194**                                                                                                                             |
| Root    | No user-facing adb or root. The OTA declares a `userdebug` base build (`alps/full_k400_mt6580_32_n/...:7.0/.../userdebug/test-keys`), so `adb root` may work **if** an adb connection can be established, though this is unconfirmed on a unit. |

See the [Wall Display family page](/hardware/panels/shelly/) for the full access-model reasoning, the OTA update endpoints (`WallDisplay` track) and the firmware version history.

## Source

[Shelly Wall Display knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display).
