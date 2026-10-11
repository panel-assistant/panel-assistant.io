---
title: Meta Portal Go
description: Hardware facts for the Meta Portal Go, the battery-powered 10.1 inch 2021 Portal, and what to expect running Panel Assistant on it based on the measured Portal 10 inch (2nd gen).
vendor: Meta
model: Portal Go
soc: Not published
android: '10'
screen: 10.1 in, 1280 × 800
support: Untested
root: No root; Meta's ADB switch is expected to be enough
webview: Meta's own WebView (expected)
released: '2021'
sidebar:
  label: Portal Go
  order: 4
---

:::note
**Untested.** No Portal Go has been run with Panel Assistant yet, and the Android codename it reports has not been seen. The panel app gives it the Meta Portal family profile only if it reports `omni` or `aloha`; otherwise it runs on the Generic profile.
:::

The Portal Go is the portable 2021 Portal: the same 10.1 in, 1280×800 screen size as the 10" (2nd gen), with a 44 Wh battery and a charging cradle. As a wall panel it would normally sit on its cradle; the battery mainly matters because a panel that is always on keeps it fully charged. Meta's ADB documentation covers it, with its USB-C port behind a rubber cover.

|          | Portal Go                                   | Portal 10" (2nd gen), measured |
| -------- | ------------------------------------------- | ------------------------------ |
| Screen   | 10.1 in, 1280×800                           | 10.1 in, 1280×800              |
| SoC      | Not published                               | Qualcomm QCS605                |
| Camera   | 12 MP ultra-wide                            | 13 MP sensor                   |
| Audio    | Four microphones, two speakers and a woofer | Two microphones, one speaker   |
| Power    | 44 Wh battery, charging cradle              | Mains adapter                  |
| Android  | 10                                          | 10                             |
| Released | 2021                                        | 2019                           |

## Setup and use

Everything below was measured on the [Portal 10" (2nd gen)](/hardware/panels/meta/portal-10-gen2/) and is expected to apply here, because this model runs the same Meta software on the same Android 10 platform. It has not been checked on this model. Read each section on that page:

- [Before you buy](/hardware/panels/meta/portal-10-gen2/#before-you-buy): the Meta account that has to stay signed in, and ADB that does not survive a restart.
- [Enabling ADB](/hardware/panels/meta/portal-10-gen2/#enabling-adb) and [installing Panel Assistant](/hardware/panels/meta/portal-10-gen2/#installing-panel-assistant).
- [What works](/hardware/panels/meta/portal-10-gen2/#what-works) and [current limitations](/hardware/panels/meta/portal-10-gen2/#current-limitations).
- [Updates](/hardware/panels/meta/portal-10-gen2/#updates), [privacy](/hardware/panels/meta/portal-10-gen2/#privacy) and the [factory reset](/hardware/panels/meta/portal-10-gen2/#recovery-factory-reset).

On first start the panel app picks the profile from what the Portal reports about itself; see [how the panel app recognises a Portal](/hardware/panels/meta/#how-to-tell-which-model-you-have). The device codename this model reports is the most useful thing an owner can [send in](https://github.com/panel-assistant/android/issues).

## Sources

- [Tech Advisor, Portal Go](https://www.techadvisor.com/article/744754/portal-go-everything-you-need-to-know-about-the-portable-portal.html) and [Meta, Portal Go tech specs](https://www.meta.com/gb/portal/products/portal-go/tech-specs/): screen, camera, audio and battery.
- [Meta for Developers: Portal setup for Android apps](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/): Android version, the ADB procedure and the USB-C port.
