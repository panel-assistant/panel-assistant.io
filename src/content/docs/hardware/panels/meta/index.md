---
title: Meta Portal family
description: Which Meta Portal models run Panel Assistant and how well, how the panel app recognises each one, and what to know before buying a used or unopened Portal as a Home Assistant wall panel.
vendor: Meta
panelIndex: true
sidebar:
  label: Overview
  order: 0
---

No vendor firmware release notes were found that match the indexed Portal build numbers. The firmware catalogue records package metadata and preserved downloads; Meta product announcements do not establish changes in a particular build.

:::note
**One model has been examined on hardware: the [Portal 10" (2nd gen)](/hardware/panels/meta/portal-10-gen2/).** Its page carries what was measured, including what works, what does not, and the setup steps that matter. Portal support, including both Portal profiles, arrives with version 1.0 of the panel app; earlier versions run a Portal on the Generic profile. Everything about the other models on this page comes from Meta's developer documentation and public owner reports, and has not been checked on a unit.
:::

Meta (formerly Facebook) sold the Portal as a video-calling smart display from 2018 until it stopped selling consumer models in 2022 ([MobileSyrup, June 2022](https://mobilesyrup.com/2022/06/10/meta-is-discontinuing-all-consumer-versions-of-its-portal-smart-display/)). Every Portal runs Android underneath Meta's own interface, and Meta's developer documentation describes an **ADB Enabled** switch under **Settings › Debug** on every model ([Meta, Portal setup for Android apps](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/)). That switch is what lets Panel Assistant install its panel app, and it makes the Portal one of the very few cheap, widely available smart displays that can become a Home Assistant panel without root.

That makes it an attractive second-hand buy: a well-made 10 in screen with a camera, microphones, a speaker and a privacy slider, often for very little money. It also comes with conditions that a purpose-built wall panel does not have, chiefly a Meta account that has to stay signed in and a debugging connection that does not survive a restart. Read the [10" (2nd gen) page](/hardware/panels/meta/portal-10-gen2/#before-you-buy) before you buy.

## Also sold as

Facebook Portal, Meta Portal, Portal (2nd gen), Portal 10", Portal Mini, Portal+, Portal Plus, Portal Go, model WD50JM (the 10" 2nd gen), device codenames `omni` and `aloha`, Meta's software package prefix `com.facebook.aloha`.

## Models and support

| Model                                                        | Released | Screen                        | Android | Device codename           | Status with Panel Assistant                                                                                         |
| ------------------------------------------------------------ | -------- | ----------------------------- | ------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Portal (2nd gen)**                                         | 2019     | 10.1 in, 1280×800, landscape  | 10      | `omni` (measured)         | **[Preliminary](/hardware/panels/meta/portal-10-gen2/)**: one unit tested, with its own hardware profile            |
| [Portal Mini](/hardware/panels/meta/portal-mini/)            | 2019     | 8 in, 1280×800                | 10      | `omni` (one owner report) | Family profile; untested                                                                                            |
| [Portal+ (2nd gen)](/hardware/panels/meta/portal-plus-gen2/) | 2021     | 14 in, 2160×1440              | 10      | not yet reported          | Untested; the family profile applies only if it reports `omni` or `aloha`                                           |
| [Portal Go](/hardware/panels/meta/portal-go/)                | 2021     | 10.1 in, 1280×800, battery    | 10      | not yet reported          | Untested; the family profile applies only if it reports `omni` or `aloha`                                           |
| [Portal (1st gen)](/hardware/panels/meta/portal-gen1/)       | 2018     | 10.1 in, 1280×800             | 9       | `aloha` (owner reports)   | Family profile; untested. An older platform with fewer sensors: reported to have ambient light but no motion sensor |
| [Portal+ (1st gen)](/hardware/panels/meta/portal-gen1/)      | 2018     | 15.6 in, 1920×1080, rotating  | 9       | `aloha` (owner reports)   | Family profile; untested                                                                                            |
| Portal TV                                                    | 2019     | none; plugs into a television | 9       | `ripley` (owner reports)  | **Not supported**: it has no screen or touch input of its own                                                       |

Android versions follow Meta's developer documentation, which lists the 2nd-gen family, Mini and Go on Android 10 and the 1st-gen models on Android 9. Both are above Panel Assistant's minimum of Android 8.0.

## How to tell which model you have

The **10" (2nd gen)** carries model number **WD50JM** on its label. That is the number to look for in a second-hand listing, because sellers often list every generation simply as "Portal", and the 1st gen is a different, older platform.

Once the panel app is installed, it identifies the Portal from what Android reports about the device, not from the name Meta prints on the box:

- A Portal reporting model **Portal** and device codename **`omni`** is treated as the 10" (2nd gen) and gets its [own profile](/hardware/panels/meta/portal-10-gen2/), with the camera, microphones and light sensor switched on as measured.
- Any other Portal reporting **`omni`** (the Android 10 platform, which the Mini is reported to share) or **`aloha`** (the Android 9 platform of the 1st-gen Portal and Portal+) gets the **Meta Portal family profile**. That profile keeps the panel's real screen-off and Meta's launcher handling, but leaves the camera and microphone to the panel's own checks rather than assuming them, and claims no light sensor or screen density, because none of that has been measured on those models.
- A Portal reporting anything else, including the Portal TV's `ripley`, runs on the [Generic profile](/install/supported-panels/#every-other-android-panel).

The panel app's diagnostics show which profile was chosen and why. If you own a Portal Mini, Portal+ or Portal Go, the device codename it reports is the single most useful thing you can [send in](https://github.com/panel-assistant/android/issues): it decides whether the family profile matches, and one report would move that model up the [panel list](/install/supported-panels/).

## What applies to the whole family

These points come from Meta's documentation or are properties of Meta's shared software. They were confirmed on the 10" (2nd gen) and are expected, not proven, on the other models.

- **ADB is a Meta setting, not Android's developer options.** It is under **Settings › Debug › ADB Enabled**, and Meta's documentation says to enter your PIN if prompted. On the tested unit the PIN was the one set for the Meta account during setup.
- **Setup needs a Meta sign-in** before Settings can be reached. Meta offers Facebook and WhatsApp sign-in; only Facebook worked for us. Keep that account signed in for as long as you use the Portal as a panel; the [10" (2nd gen) page](/hardware/panels/meta/portal-10-gen2/#before-you-buy) explains why.
- **Stock firmware has no root.** Retail Portals ship locked production builds with no `su`, and no bootloader unlock is known. Community research now reports temporary privileged provisioning on specific builds; see [CVE-2026-43499](#cve-2026-43499-and-community-provisioning). Panel Assistant does not need root on a Portal, but root-dependent self-update and screenshot-based remote control are unavailable. The tested Portal runs Android 10, below the Android 11 requirement for Accessibility screenshots without root.
- **Meta's own WebView.** The tested Portal 10-inch (2nd gen) runs Meta's Chromium **131**. Verified stock firmware accepts only Meta’s provider, with no newer qualified engine available. Chromium 131 no longer receives Chromium security fixes, although no dashboard failure has been attributed to it. The community provisioning research below has not established a qualified WebView upgrade route; versions and reachable limits on other Portal models remain unverified.
- **Meta is winding Portal down.** Meta stopped selling Portals in 2022 and has withdrawn features since. Expect more of Meta's own services, and possibly sign-in methods, to stop working over time. The panel app does not depend on any of them, but the Meta account and the ADB switch it gates are outside anyone's control but Meta's.

## CVE-2026-43499 and community provisioning

**As of 29 October 2026:** [CVE-2026-43499](https://www.cve.org/CVERecord?id=CVE-2026-43499), published on 21 May 2026, is a Linux kernel flaw in rtmutex/futex locking that can let code already running locally gain higher privileges. The [official CVE record](https://github.com/CVEProject/cvelistV5/blob/main/cves/2026/43xxx/CVE-2026-43499.json) rates it High, CVSS 3.1 **7.8**. It is a security vulnerability affecting untrusted local code as well as an opening for owners to change otherwise restricted settings.

[Community Portal provisioning research](https://github.com/jxlarrea/portal-root-kiosk-satellite/tree/f941b575caa118d48afdf8b17d791d024932a088) adapts the GhostLock exploit to Portal firmware. Its author [reports these exact targets as tested](https://github.com/jxlarrea/portal-root-kiosk-satellite/blob/f941b575caa118d48afdf8b17d791d024932a088/README.md#supported-models):

| Model                | Codename | Android | Firmware build     | Kernel          |
| -------------------- | -------- | ------- | ------------------ | --------------- |
| Portal (1st gen)     | `aloha`  | 9       | `1041515800015050` | `4.4.153+`      |
| Portal+ (1st gen)    | `aloha`  | 9       | `1041515800015050` | `4.4.153+`      |
| Portal 10" (2nd gen) | `omni`   | 10      | `3051355900018050` | `4.9.227-perf+` |
| Portal Mini          | `omni`   | 10      | `3051355900018050` | `4.9.227-perf+` |
| Portal+ (2nd gen)    | `cipher` | 10      | `4051355900018050` | `4.9.227-perf+` |
| Portal Go            | `terry`  | 10      | `5051355900018050` | `4.9.227-perf+` |

These are author-reported exploit targets, not independent Panel Assistant qualification or a claim that every firmware build is supported. The linked source records full firmware fingerprints. Portal TV is also listed by the research project, but remains unsupported by Panel Assistant.

The practical benefit is optional provisioning: temporary privileged execution can keep wireless ADB available after a restart, avoiding stock firmware's repeated USB setup, and change restricted audio settings or install limited helpers. The project does not install permanent `su` or a root daemon. Its recommended `kiosk` preset also installs its own app, replaces the home screen, sets Device Owner, removes Meta accounts and disables services; that preset is not a Panel Assistant installation step.

Panel Assistant still uses the existing [stock USB installation](/hardware/panels/meta/portal-10-gen2/#installing-panel-assistant) and has no integration with this exploit. Exploit attempts can hang or reboot the device, and persistent provisioning changes do not patch the vulnerability. The stock measurements and model support statuses on these pages remain unchanged.

## Firmware

These catalogues list indexed builds, original Meta download URLs and Internet Archive copies. The original URLs are signed CDN links and can expire.

- [Portal (1st gen)](/hardware/firmware/builds/meta-portal-10-gen1/).
- [Portal+ (1st gen)](/hardware/firmware/builds/meta-portal-plus-gen1/).
- [Portal 10" (2nd gen)](/hardware/firmware/builds/meta-portal-10-gen2/).
- [Portal Mini](/hardware/firmware/builds/meta-portal-mini-8/).
- [Portal+ (2nd gen)](/hardware/firmware/builds/meta-portal-plus-gen2/).
- [Portal Go](/hardware/firmware/builds/meta-portal-go/).
- [Portal TV](/hardware/firmware/builds/meta-portal-tv/), which is not supported as a Panel Assistant panel.

## Sources

- [Meta for Developers: Portal setup for Android apps](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/): the **Settings › Debug › ADB Enabled** procedure, the supported model list and each model's Android level.
- [MobileSyrup, June 2022](https://mobilesyrup.com/2022/06/10/meta-is-discontinuing-all-consumer-versions-of-its-portal-smart-display/): Meta discontinuing consumer Portal models.
