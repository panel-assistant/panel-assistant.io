---
title: SMT97T
description: Hardware facts for the Electron SMT97T, a 9.7 inch Rockchip rk3566 wall panel with two relays and an app-direct RGB LED, identified by its ZX-SMT97 build string.
vendor: Electron (ELC)
model: SMT97T
soc: Rockchip RK3566
android: '13'
screen: 9.7 in
support: Owner report only
root: Not established
webview_ships_with: 'Not established'
webview_can_reach: 'Not established'
sold_as:
  - brand: ELC
    name: 'SMT97T'
evidence: [owners]
sidebar:
  label: SMT97T
---

:::note
This page and the panel app's `zx-smt97` profile come from [an owner's hardware report](https://github.com/panel-assistant/ha-integration/issues/37). The profile arrives with panel app 1.0.5. Its relay support follows the owner's description of the vendor's relay interface and has not yet been confirmed on a unit running Panel Assistant.
:::

The SMT97T is a 9.7 in Android 13 wall panel from **Electron** (ELC). It reports exactly the same `rk3566_t` model and device as the [SMT156](/hardware/panels/electron/smt156/), so the panel app tells them apart by the firmware build string, `ro.build.display.id`, which starts with `ZX-SMT97`.

## Initial debugging access

**Network ADB on TCP port 5555 without a computer: not established.** The owner report does not show how debugging is first turned on for a new panel.

**The initial USB debugging procedure is not established either.** Ask the supplier for the debugging instructions for your exact firmware and confirmation of a USB data port. If it provides USB debugging, use the [USB installer](/install/install-over-usb/).

Root checks require an already working ADB connection. Root access and initial debugging access are separate questions.

## What the owner reported

|                     |                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Profile fingerprint | model and device `rk3566_t`; firmware `ZX-SMT97-R128V1.2A-GG-9.7-J4.62-20250106`                                                      |
| SoC                 | Rockchip rk3566                                                                                                                       |
| Android             | 13 (API 33), `userdebug` build, SELinux permissive                                                                                    |
| Dashboard           | works, including a live camera card, in portrait                                                                                      |
| Brightness, sleep   | work from Home Assistant; the hardware power button is not yet reported to Home Assistant                                             |
| RGB LED             | works, including colour and effects                                                                                                   |
| Light sensor        | reports coarse steps only                                                                                                             |
| Proximity           | no readings; wake on hand wave does not work                                                                                          |
| Speaker, microphone | work, including the on-device wake word                                                                                               |
| Relays              | **two**, GPIO 4 and 5 on the vendor's `/dev/gpio_control` device, which an ordinary app can use; the panel app drives them from 1.0.5 |

## Relays

The relays are not a sysfs class like those on the [NSPanel Pro Gen2](/hardware/panels/sonoff/nspanel-pro-gen2-86/). The vendor's relay app switches them through an ioctl on `/dev/gpio_control`, with the GPIO number as the argument: relay 1 is GPIO 4 and relay 2 is GPIO 5. The node is world-readable and writable, so the panel app drives it with its own native code, without root or a helper. The relays appear in Home Assistant only when that node is present, and the SMT97 profile cannot be selected on other hardware.

If you have an SMT97T, a [bug report or support report](https://github.com/panel-assistant/android/issues/new/choose) helps, especially one confirming that both relays switch and report their state.
