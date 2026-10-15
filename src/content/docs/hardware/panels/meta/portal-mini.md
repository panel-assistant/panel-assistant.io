---
title: Meta Portal Mini
description: Hardware facts for the Meta Portal Mini, an 8 inch 2nd-generation Portal on the same Qualcomm QCS605 platform as the measured Portal 10 inch (2nd gen), and what to expect running Panel Assistant on it.
vendor: Meta
model: Portal Mini
soc: Qualcomm QCS605
android: '10'
screen: 8 in, 1280 × 800
support: Untested
root: No root; Meta's ADB switch is expected to be enough
webview: Meta's own WebView (expected)
released: '2019'
evidence: [documented, platform]
sidebar:
  label: Portal Mini
  order: 2
---

:::note
**Untested.** No Portal Mini has been run with Panel Assistant yet. One owner reports it identifies as `omni`, the same Android platform as the [Portal 10" (2nd gen)](/hardware/panels/meta/portal-10-gen2/), so it gets the Meta Portal family profile.
:::

The Portal Mini is the smallest 2nd-generation Portal: an 8 in screen. A published teardown names the same Qualcomm **QCS605** processor that was measured in the 10" (2nd gen), with the same amount of memory, so apart from the screen it is expected to behave like that model.

|              | Portal Mini                                             | Portal 10" (2nd gen), measured |
| ------------ | ------------------------------------------------------- | ------------------------------ |
| Screen       | 8 in, 1280×800                                          | 10.1 in, 1280×800              |
| SoC          | Qualcomm QCS605 (TechInsights teardown)                 | Qualcomm QCS605                |
| RAM          | 3 GB LPDDR4X                                            | About 3 GB                     |
| Storage      | 8 GB                                                    | 6.7 GB for apps and data       |
| Android      | 10                                                      | 10                             |
| Connectivity | Wi-Fi 5, Bluetooth 5.0, USB-C behind the speaker grille | Wi-Fi, Bluetooth LE, USB-C     |
| Released     | 2019                                                    | 2019                           |

## Setup and use

Everything below was measured on the [Portal 10" (2nd gen)](/hardware/panels/meta/portal-10-gen2/) and is expected to apply here, because this model runs the same Meta software on the same Android 10 platform. It has not been checked on this model. Read each section on that page:

- [Before you buy](/hardware/panels/meta/portal-10-gen2/#before-you-buy): the Meta account that has to stay signed in, and ADB that does not survive a restart.
- [Enabling ADB](/hardware/panels/meta/portal-10-gen2/#enabling-adb) and [installing Panel Assistant](/hardware/panels/meta/portal-10-gen2/#installing-panel-assistant).
- [What works](/hardware/panels/meta/portal-10-gen2/#what-works) and [current limitations](/hardware/panels/meta/portal-10-gen2/#current-limitations).
- [Updates](/hardware/panels/meta/portal-10-gen2/#updates), [privacy](/hardware/panels/meta/portal-10-gen2/#privacy) and the [factory reset](/hardware/panels/meta/portal-10-gen2/#recovery-factory-reset).

On first start the panel app picks the profile from what the Portal reports about itself; see [how the panel app recognises a Portal](/hardware/panels/meta/#how-to-tell-which-model-you-have). The device codename this model reports is the most useful thing an owner can [send in](https://github.com/panel-assistant/android/issues).

## Firmware

See the [Portal Mini firmware catalogue](/hardware/firmware/builds/meta-portal-mini-8/) for indexed builds, original Meta download URLs and Internet Archive copies.

## Sources

- [TechInsights, Facebook Portal Mini DT90GB teardown](https://www.techinsights.com/products/ddt-2007-804): the QCS605 processor.
- [Wikipedia, Meta Portal](https://en.wikipedia.org/wiki/Meta_Portal): screen, memory, storage, Android version, connectivity and release.
