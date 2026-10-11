---
title: Meta Portal (1st gen) and Portal+ (1st gen)
description: Hardware facts for the 2018 Facebook Portal and Portal+, the first-generation Portals on Meta's Android 9 platform, how the two differ, and what is known about running Panel Assistant on them.
vendor: Meta
model: Portal (1st gen), Portal+ (1st gen)
soc: Not published
android: '9'
screen: 10.1 in, 1280 × 800; Portal+ 15.6 in, 1920 × 1080
support: Untested
root: No root; Meta's ADB switch is expected to be enough
webview: Not established
released: '2018'
sold_as_note: '10.1 in, 1280×800 landscape screen; two full-range speakers'
covers:
  - name: 'Portal+ (1st gen)'
    note: '15.6 in, 1920×1080 screen that rotates between landscape and portrait; two tweeters and a 4 in woofer'
evidence: [documented]
sidebar:
  label: Portal (1st gen)
  order: 5
---

:::note
**Untested.** No 1st-generation Portal has been run with Panel Assistant yet. Owners report that both models identify as `aloha`, Meta's Android 9 platform, so the panel app gives them the Meta Portal family profile. Nothing measured on the [Portal 10" (2nd gen)](/hardware/panels/meta/portal-10-gen2/) can be assumed here: it is a different, older platform.
:::

Facebook launched the Portal and the Portal+ together in October 2018 as its first video-calling smart displays, sold first in the United States at $199 and $349. They share a camera, microphones and privacy controls, and run the same Meta software built on Android; they differ in screen and sound. Sellers often list every generation simply as "Portal", so check the release year and screen before buying.

## How the two differ

|              | Portal (1st gen)                                                               | Portal+ (1st gen)                                                  |
| ------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Screen       | 10.1 in, 1280×800 (720p), landscape                                            | 15.6 in, 1920×1080 (1080p), rotates between landscape and portrait |
| Speakers     | Two full-range drivers, 10 W                                                   | Two tweeters and a 4 in woofer                                     |
| Camera       | 12 MP, 140° field of view, automatic framing and zoom                          | Same                                                               |
| Microphones  | Four                                                                           | Same                                                               |
| Privacy      | A button that disconnects the camera and microphones, and a clip-on lens cover | Same                                                               |
| Radios       | Wi-Fi and Bluetooth                                                            | Same                                                               |
| Android      | 9                                                                              | 9                                                                  |
| Processor    | Not published                                                                  | Not published                                                      |
| Launch price | $199                                                                           | $349                                                               |

## What this means for a panel

- **ADB.** Meta's developer documentation lists the 1st-generation models alongside the later ones for its **Settings › Debug › ADB Enabled** switch, which is what Panel Assistant needs to install the panel app. See [enabling ADB](/hardware/panels/meta/portal-10-gen2/#enabling-adb) for the steps as measured on a 2nd-generation unit.
- **Android 9** is above Panel Assistant's minimum of Android 8.0.
- **Sensors.** Owners report an ambient light sensor and no motion sensor, so waking on movement, as Meta's software does on the 2nd generation, is not expected.
- **The Portal+ stand.** The Portal+ screen pivots on a fixed base, which makes it a desk or shelf device rather than one for a wall.
- **The Meta account, ADB after a restart and the factory reset** are properties of Meta's shared software. They were measured on the 10" (2nd gen) and are expected, not proven, here; read [before you buy](/hardware/panels/meta/portal-10-gen2/#before-you-buy).

If you own one, the device codename and Android version it reports, from the panel app's diagnostics, are the most useful things to [send in](https://github.com/panel-assistant/android/issues).

## Sources

- [TechCrunch, October 2018](https://techcrunch.com/2018/10/08/facebook-portal/): launch, prices, camera, microphones, the Portal+ rotating screen and woofer, the privacy button and cover, and the Android base.
- [GearBrain review](https://www.gearbrain.com/facebook-portal-smart-display-review-2627815886.html): screen sizes and resolutions, camera, speakers and Bluetooth.
- [Meta for Developers: Portal setup for Android apps](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/): the ADB procedure and each model's Android level.
