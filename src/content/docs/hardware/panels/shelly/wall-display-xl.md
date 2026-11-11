---
title: Shelly Wall Display XL
description: Hardware facts for the Shelly Wall Display XL, a 10.1 inch RK3566 panel on Android 11, codename Blake.
vendor: Shelly
model: Wall Display XL
soc: RK3566
android: '11'
screen: 10.1 in
support: Untested
root: Not established on this model
webview_ships_with: 'Google WebView 131.0.6778.105 on reporter firmware'
webview_can_reach: 'Not established — installed signer and update route remain unverified'
released: '2025-09 (est.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-xl-front.jpg'
    alt: Shelly Wall Display XL, front
  - src: 'asset:hardware-shelly-wall-display-xl-screen-trim.jpg'
    alt: Shelly Wall Display XL, straight-on view of the screen
  - src: 'asset:hardware-shelly-wall-display-xl-profile-trim.jpg'
    alt: Shelly Wall Display XL, side profile, showing the mounting depth
photoCredit: 'Photo: Shelly'
evidence: [owners, firmware, documented, platform]
sidebar:
  label: Wall Display XL
  order: 5
---

:::note
**Owners have supplied diagnostics and raw input traces in [the XL support report](https://github.com/panel-assistant/android/issues/165).** These establish the hardware identifiers and input codes below; Panel Assistant button handling, proximity wake and relay switching still need validation on an XL. See the [Wall Display family page](/hardware/panels/shelly/) for sourcing, the firmware OTA mechanism, access model and security notes shared across the whole line.
:::

The Wall Display XL, firmware codename **Blake**, is a 10.1 in panel on a Rockchip RK3566 (Cortex-A55), Android 11 — the largest and most capable model in the [Shelly Wall Display family](/hardware/panels/shelly/). It is on the modern **WallDisplayV2** (arm64-v8a) OTA track, alongside the [X1i](/hardware/panels/shelly/wall-display-x1i/), [X2i](/hardware/panels/shelly/wall-display-x2i/), Maverick and Dayna, and has access to the built-in AppStore.

## Initial debugging access

**Network ADB on TCP port 5555 without a computer: not established on this model.** Initial USB debugging and the vendor-menu unlock are also unverified here. The [X2i procedure](/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) is confirmed on the X2i only; shared firmware does not prove that it works here. Ask Shelly for the procedure for your model and firmware. Use the [USB installer](/install/install-over-usb/) only once USB debugging and a USB data connection are available. A root-capable build alone does not enable debugging.

## Also sold as

Shelly Wall Display XL, firmware codename Blake.

|          |                                                                                                                                                                                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC      | Rockchip **RK3566**, Cortex-A55                                                                                                                                                                                                                                                                                                            |
| Display  | 10.1 in                                                                                                                                                                                                                                                                                                                                    |
| Android  | 11                                                                                                                                                                                                                                                                                                                                         |
| ABI      | arm64-v8a                                                                                                                                                                                                                                                                                                                                  |
| Sensors  | Android light and wake-up proximity sensors listed in owner diagnostics; motion events through `gpio_keys` need physical near/far validation                                                                                                                                                                                               |
| Relay    | 1 output                                                                                                                                                                                                                                                                                                                                   |
| Root     | Not established on this model; the modern OTA declares no build type. On a [Wall Display X2i](/hardware/panels/shelly/wall-display-x2i/) tested on factory firmware 2.5.4, developer options and USB debugging unlock from the Settings app and adb then connects, still without root; whether the same applies to this model is untested. |
| Released | About September 2025 (est.); Shelly launched the XL in Europe around 10 September 2025 ([launch coverage, Notebookcheck, September 2025](https://www.notebookcheck.net/Shelly-launches-new-Wall-Display-XL-smart-home-hub.1110802.0.html))                                                                                                 |

:::caution
The built-in Home Assistant browser on the XL had rendering and layout problems with Home Assistant frontend 2025.12 and a 2026.1 pre-release (tracked in [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755) and `#28746`; core compatibility in [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665)). An app using the system WebView on the same device rendered correctly, which shows the issue was specific to the built-in browser's WebView rather than the hardware.
:::

## Owner-reported hardware

[Owner diagnostics and input captures](https://github.com/panel-assistant/android/issues/165) identify the XL as **Shelly Blake**, with a 1280×800 display, Android 11 and Google WebView 131.0.6778.105 on the reported firmware. The input devices are matched by their names; `event` numbers can change between boots or models.

| Input device   | Reported events    | What is established                                                                               |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------- |
| `adc-keys`     | `KEY_F1`–`KEY_F4`  | Four front buttons, ordered top to bottom                                                         |
| `rk805 pwrkey` | `KEY_F10`          | Screen power button                                                                               |
| `gpio_keys`    | `KEY_F5`, `KEY_F6` | Motion events; F5 near and F6 far are inferred from the traces and need a labelled physical check |

**XL-specific button and proximity support is available from panel app 1.0.1.** It matches the input-device names above and provides an ordinary-app route through Android's Accessibility service when that service is enabled. F5/F6 are handled separately as proximity events rather than dashboard button presses.

Raw Linux input events do not prove that Android delivers the same keys to Panel Assistant's Accessibility service. That rootless route needs an on-device capture before button actions or proximity wake can be confirmed. The [X2i](/hardware/panels/shelly/wall-display-x2i/) has no physical buttons, so it cannot validate the XL's controls.

The Android sensor service lists ordinary light and wake-up proximity sensors needing no permission. The owner capture shows active light readings, but does not establish calibrated proximity readings or wake behaviour. The X2i's `/sys/class/st_psensor/psensor_value` raw-sensor file was absent on this XL.

The diagnostic export also lists `/sys/class/strelay/relay1`. Its presence does not establish that an ordinary app can write it or that it switches the XL's relay. The working unprivileged relay route measured on the X2i is specific to that hardware and firmware.

The original high-CPU report was resolved by the owner: the dashboard was displaying four cameras. A blank dashboard restored about **360% idle out of 400%** across the four cores. That report does not establish a Panel Assistant CPU defect.

The modern Shelly defaults carry the [X2i's firmware findings](/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line), including full screen-off without root and Back and Home without Recents. These remain separate from physical validation of the XL's own controls. Reboot without root or a privileged helper has not been established for Panel Assistant on this model.

See the [Wall Display family page](/hardware/panels/shelly/) for the full access-model reasoning, the OTA update endpoints (`WallDisplayV2` track) and the firmware version history.

## Source

[Shelly Wall Display XL knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-xl).
