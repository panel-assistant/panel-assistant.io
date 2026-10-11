---
title: Meta Portal+ (2nd gen)
description: Hardware facts for the Meta Portal+ (2nd gen), the 14 inch 2021 Portal, and what to expect running Panel Assistant on it based on the measured Portal 10 inch (2nd gen).
vendor: Meta
model: Portal+ (2nd gen)
soc: Not published
android: '10'
screen: 14 in, 2160 × 1440
support: Untested
root: No root; Meta's ADB switch is expected to be enough
webview: Meta's own WebView (expected)
released: '2021'
evidence: [documented, platform]
sidebar:
  label: Portal+ (2nd gen)
  order: 3
---

:::note
**Untested.** No Portal+ (2nd gen) has been run with Panel Assistant yet, and the Android codename it reports has not been seen. The panel app gives it the Meta Portal family profile only if it reports `omni` or `aloha`; otherwise it runs on the Generic profile.
:::

The Portal+ (2nd gen) is the 2021 large-screen Portal: a 14 in landscape screen on a tilting stand, replacing the rotating 15.6 in [Portal+ (1st gen)](/hardware/panels/meta/portal-gen1/). Meta has not published its processor, but it runs the same Android 10 Portal software as the 10" (2nd gen), and the differences that matter for a panel are the larger, sharper screen and the camera.

|          | Portal+ (2nd gen)                                       | Portal 10" (2nd gen), measured |
| -------- | ------------------------------------------------------- | ------------------------------ |
| Screen   | 14 in, 2160×1440, landscape, tilting stand              | 10.1 in, 1280×800              |
| SoC      | Not published                                           | Qualcomm QCS605                |
| Camera   | 12 MP, 131° field of view                               | 13 MP sensor                   |
| Privacy  | Camera and microphone off button, built-in camera cover | Three-position slider          |
| Network  | Dual-band Wi-Fi, Bluetooth 5.1                          | Wi-Fi, Bluetooth LE            |
| Android  | 10                                                      | 10                             |
| Released | 2021                                                    | 2019                           |

## Setup and use

Everything below was measured on the [Portal 10" (2nd gen)](/hardware/panels/meta/portal-10-gen2/) and is expected to apply here, because this model runs the same Meta software on the same Android 10 platform. It has not been checked on this model. Read each section on that page:

- [Before you buy](/hardware/panels/meta/portal-10-gen2/#before-you-buy): the Meta account that has to stay signed in, and ADB that does not survive a restart.
- [Enabling ADB](/hardware/panels/meta/portal-10-gen2/#enabling-adb) and [installing Panel Assistant](/hardware/panels/meta/portal-10-gen2/#installing-panel-assistant).
- [What works](/hardware/panels/meta/portal-10-gen2/#what-works) and [current limitations](/hardware/panels/meta/portal-10-gen2/#current-limitations).
- [Updates](/hardware/panels/meta/portal-10-gen2/#updates), [privacy](/hardware/panels/meta/portal-10-gen2/#privacy) and the [factory reset](/hardware/panels/meta/portal-10-gen2/#recovery-factory-reset).

On first start the panel app picks the profile from what the Portal reports about itself; see [how the panel app recognises a Portal](/hardware/panels/meta/#how-to-tell-which-model-you-have). The device codename this model reports is the most useful thing an owner can [send in](https://github.com/panel-assistant/android/issues).

## Sources

- [QVC, Portal+ listing](https://www.qvc.com/p/Facebook-Portal-Plus---Smart-Video-Calling-with-14%22-Touchscreen/E241037) and [Stuff review](https://www.stuff.tv/review/facebook-portal-review-brilliant-at-the-basics): screen, camera, privacy controls and radios.
- [Meta for Developers: Portal setup for Android apps](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/): Android version and the ADB procedure.
