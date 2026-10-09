---
title: Meta Portal 10" (2nd gen)
description: Hardware facts and buying advice for the Meta Portal 10 inch (2nd gen), model WD50JM, a Qualcomm QCS605 smart display on Android 10, measured on a physical unit running Panel Assistant without root.
vendor: Meta
model: Portal 10" (2nd gen), WD50JM
soc: Qualcomm QCS605
android: '10'
screen: 10.1 in, 1280 × 800
support: Preliminary
root: No root; Meta's ADB switch is enough for setup
webview: Meta's own Chromium 131 WebView
released: '2020'
sidebar:
  label: 10" (2nd gen)
  order: 1
---

:::note
**Everything on this page was measured on one retail Portal 10" (2nd gen)** on Meta's firmware `QKQ1.210213.001.3051355900018050` (Android 10, security patch 2020-08-05), running Panel Assistant with no root. Portal support needs version 1.0 or later of the panel app. Nothing here has been checked on another Portal model; see the [Meta Portal family page](/hardware/panels/meta-portal/) for how the others are handled.
:::

The Portal 10" (2nd gen), model **WD50JM**, is a 10.1 in landscape smart display on a Qualcomm QCS605 with about 3 GB of RAM, a 13 MP camera with its own camera light, two microphones, a speaker and a physical privacy slider. Meta's [ADB switch](#enabling-adb) is all Panel Assistant needs: the panel app installs over USB, recognises the Portal and loads its own hardware profile, and the dashboard, camera, microphone, wake word, spoken replies, light sensor and a real screen-off all work without root.

It is a good panel with an unusual set of conditions attached, most of them Meta's. The ones that matter before you spend money are in [Before you buy](#before-you-buy).

:::tip
The most-needed facts: **keep the Meta account signed in**, because the ADB switch is behind its PIN. **The ADB switch looks the same on and off**, so check your computer to see which state it is in. **Expect to switch ADB on again after a restart**, and the network debugging that Panel Assistant uses for updates never survives one. To factory reset, hold **both volume buttons while plugging in power, with no computer connected by USB**.
:::

## Also sold as

Meta Portal, Facebook Portal, Portal (2nd gen), Portal 10", model WD50JM. Android reports model `Portal`, device and board `omni`, product `omni_prod`, manufacturer and brand `Facebook`, hardware platform `atlas`.

|            |                                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| SoC        | Qualcomm **QCS605**, 8 cores                                                                                                              |
| RAM        | About **3 GB** (Android reports 2.85 GB)                                                                                                  |
| Storage    | 6.7 GB for apps and data, about 3.9 GB free after setup; no memory card slot                                                              |
| Display    | **1280×800** landscape, 10.1 in, **about 149 ppi**, at Android's 160 dpi base density. FocalTech touch controller with double-tap to wake |
| Android    | 10 (API 29), production `user` build, SELinux enforcing; arm64-v8a                                                                        |
| WebView    | Meta's own WebView build, Chromium **131**, kept current by Meta's background updater. No WebView work needed                             |
| Sensors    | **Accelerometer** and tilt; **ambient light with colour**. **No proximity sensor**                                                        |
| Camera     | **13 MP** sensor at the top left of the bezel, with a **green camera light** beside it. Apps such as the panel app are offered 1280×720   |
| Audio      | **Two microphones**, one speaker                                                                                                          |
| Privacy    | **Three-position slider**: camera on and microphones on; camera covered; camera covered and microphones off                               |
| Buttons    | Volume up and volume down. No power button                                                                                                |
| Radios     | Wi-Fi, Bluetooth with **Bluetooth Low Energy**                                                                                            |
| Connectors | **USB-C**, used for ADB                                                                                                                   |
| Root       | None. No `su`, no known bootloader unlock. ADB comes from Meta's own Debug setting                                                        |
| Released   | 2020                                                                                                                                      |

## Before you buy

None of these is a reason not to buy a Portal, but each one is easier to know in advance.

- **You need a Facebook account.** Meta's setup will not reach Settings without a sign-in. It offers Facebook or WhatsApp; the WhatsApp QR code never appeared for us, and Facebook sign-in worked. A new account made for the panel is fine.
- **The account has to stay signed in.** Turning ADB on asks for the PIN of the Meta account created during setup. With no account signed in, we found no way to turn ADB back on, and Meta's on-screen factory reset stopped working too; only the [hardware reset](#recovery-factory-reset) brought the Portal back. Do not remove the account, and do not disable Meta's setup app.
- **ADB does not stay on.** Meta's ADB setting is reported to switch itself off at every restart, so expect to turn it on again, and the network debugging connection that Panel Assistant uses for updates was lost at every restart we tried. That has consequences for [updates](#updates).
- **Decline the firmware download during setup if you can.** Meta's setup offers to download an update. We declined it, so everything on this page was tested on the firmware build named at the top. Whether a later Meta firmware changes ADB access is not known, and Meta publishes no way to go back.
- **Meta is winding Portal down.** Meta stopped selling Portals in 2022 and has withdrawn features since. Expect more of Meta's own services, and possibly sign-in methods, to stop working. The panel app does not rely on any of them.
- **A computer with a Chromium-based browser and a USB-C data cable** are needed to install, as on any panel installed [over USB](/install/install-over-usb/).

## Enabling ADB

Meta documents the procedure for every Portal ([Meta, Portal setup for Android apps](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/)):

1. On the Portal, open **Settings › Debug**.
2. Tap **ADB Enabled**, and enter the Meta account PIN when asked.
3. Connect the Portal to the computer over USB-C.
4. The first time, tap **Allow** on the Portal to trust the computer.

:::caution
**The ADB Enabled item looks exactly the same whether ADB is on or off, and every tap switches it.** Nothing on the Portal's screen tells you its state. The only proof is on the computer: the Portal appearing in the browser's USB device list, or in `adb devices`. If it is not there, tap the item once more and check again rather than tapping several times.
:::

## Installing Panel Assistant

Install the panel app from Home Assistant with the [USB installer](/install/install-over-usb/), with the Portal connected to your computer by USB-C and ADB switched on as above. Panel Assistant is required: it is how the app is installed, connected and updated. On the tested Portal the installer completed normally, the app came up on the dashboard setup screen, and on first start it selected the Portal 10" (2nd gen) profile on its own.

For a Portal, Panel Assistant also prepares the panel during installation: it makes the panel app the home screen, grants the microphone permission, and turns off Meta's screensaver and Meta's swipe-up bar, none of which can be changed from Meta's own Settings app. The camera permission is asked for on the Portal's screen the first time you turn the camera on.

One setting is yours to choose: **dashboard zoom**. At the Portal's native density the dashboard draws larger than on other landscape panels. Setting the panel's **Zoom (%)** to **87** in the [built-in renderer](/manage/built-in-renderer/) settings gives it the same scale as a 1920×1200 panel while keeping Android's own screens sharp.

Then [add the panel](/install/installing-ha-paneld/) in Panel Assistant as usual.

## What works

- **The dashboard**, smoothly, in Meta's own current WebView.
- **Camera.** Off by default, like on every panel, and turned on from the **Camera** card in Configure. It then serves a 1280×720 stream and still images to Home Assistant, and the Portal's green camera light comes on while it is in use.
- **Microphones, wake word and spoken replies.** The wake word was recognised and Home Assistant's voice pipeline answered through the Portal's speaker. See [voice assistant](/manage/voice-assistant/).
- **Ambient light**, including colour, as a normal Android sensor, for adaptive brightness and Home Assistant.
- **A real screen-off without root.** The panel app switches the screen off through Android's own sleep timeout, so the backlight goes fully dark rather than to its lowest level. Lowering the brightness to zero is not enough on a Portal: the picture stays visible. If the timeout does not take, the app falls back to its dimmest setting.
- **Waking**: a double tap on the screen wakes it, and so does Meta's own motion detection when someone moves nearby.
- **The Launcher button** in the panel app's navigation goes to the app's own launcher. The profile tells it to skip Meta's launcher, which is a clock face rather than an app list.

## Current limitations

- **Auto sleep is off by default, and we recommend leaving it off.** The Portal has no proximity sensor, so the panel app cannot tell whether someone is in front of it. Sleeping after a period without touch turned the screen off under a person sitting at the panel, and Meta's motion detection then woke it again, over and over. That motion detection wakes on any movement, including someone walking past, occasionally woke the screen with nobody in the room, and is not readable by other apps, so the panel app cannot use it as a presence signal. You can still switch the screen off and on from Home Assistant.
- **Two camera indicators.** The panel app draws its own camera-on indicator at the top centre of the screen, while the Portal's lens and green camera light are at the top left. The on-screen indicator is redundant here and cannot be turned off.
- **Meta's volume slider does not change media volume**, which is the volume spoken replies and announcements use. Media volume can start at zero, which makes the first reply silent. Set it with the panel's **Panel volume** setting or its volume entity in Home Assistant; Meta's slider will not move it.
- **Android's settings are mostly out of reach.** Meta replaces Android's Settings app with its own reduced one. Panel Assistant sets what the panel app needs during installation; anything else in Android's settings cannot be changed on the panel itself.

:::danger
**Do not disable Meta's setup app (`com.facebook.alohaapps.devicesetup`) or remove the Meta account.** With the account removed and that app disabled, the tested Portal lost both the ADB switch and Meta's on-screen factory reset, and only the [hardware reset](#recovery-factory-reset) recovered it. Leave Meta's account, settings and setup apps alone.
:::

## Updates

A Portal cannot install app updates by itself, because that needs root. Panel Assistant therefore updates it over network debugging, which the Portal switches off at every restart, including after a power cut. When that happens the panel keeps working on the version it has, and Home Assistant shows a Repair, as described in [Updates and recovery](/manage/updates-and-recovery/#a-panel-that-cannot-be-updated).

To let Panel Assistant update it again, connect the Portal to a computer by USB, switch [ADB](#enabling-adb) on, and turn network debugging back on as described in [Getting ADB onto the network](/manage/command-line-install/#getting-adb-onto-the-network). After the update, check that the Portal still opens the dashboard as its [home screen](#installing-panel-assistant).

## Privacy

A Portal remains a Meta device with Meta's software on it, and the panel app does not change that. What follows is what we measured on the tested unit, not a full audit.

**Meta's software.** In about 25 minutes after a factory reset, all of Meta's apps together uploaded about 3 MB, and Meta's camera analysis and presence services each sent less than 0.05 MB. Continuous video upload would be far larger, so no video upload was seen in that window; that is a short test, and it does not rule out occasional uploads. Several Meta services keep connections open to Meta's servers, and Meta's system software logs analytics events, including each use of the privacy slider and the state of the camera light.

**Meta's camera analysis does not light the green light.** Meta's own motion and presence detection watches the room through a separate, reduced camera stream that runs continuously without switching the camera light on. The green light reports only the camera stream that other apps use. The panel app cannot open Meta's analysis stream, so whenever the panel app uses the camera, the green light is on.

**The privacy slider works for the panel app.** With the slider at the camera position, Android reports the camera as unavailable and the panel app's camera stops delivering images. At the microphone-off position the panel app's voice assistant heard nothing. Android does not tell apps that the microphones are off, so the panel app cannot show that state itself.

**The panel app.** The panel app sends camera, microphone and sensor data only to your own Home Assistant. The camera is off until you turn it on, and video leaves the panel only if you do.

## Recovery: factory reset

The Portal's hardware reset works without Meta's apps, a working screen or ADB:

1. Unplug power, and **disconnect any USB cable to a computer**.
2. Hold **both volume buttons** and plug power back in, keeping them held until the Portal shows that it is erasing.

The reset erases everything, including the panel app and its settings. Afterwards, go through Meta's setup again, [enable ADB](#enabling-adb) and [install Panel Assistant](#installing-panel-assistant).

:::caution
**With a USB cable to a computer attached, the same button combination does not reset the Portal.** It starts Qualcomm's emergency download mode instead, which appears on the computer as a Qualcomm USB device. Nothing is changed in that mode. Unplug power to leave it, disconnect the USB cable, and try again.
:::

## Source

[Meta for Developers: Portal setup for Android apps](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/): the ADB procedure and the supported model list.
