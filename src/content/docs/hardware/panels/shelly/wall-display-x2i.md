---
title: Shelly Wall Display X2i
description: Hardware facts for the Shelly Wall Display X2i, a 6.9 inch RK3326-S panel on Android 11, codename Jenna, measured on a physical unit.
vendor: Shelly
model: Wall Display X2i
soc: RK3326-S
android: '11'
screen: 6.9 in, 1440 × 720
support: Preliminary
root: 'No root; developer mode unlocks adb, and setup needs no more than that'
webview: Chromium 131.0.6778.200 on 2.5.4
released: '2025-12 (est.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x2i-front.jpg'
    alt: Shelly Wall Display X2i, front
  - src: 'asset:hardware-shelly-wall-display-x2i-on-wall.jpg'
    alt: Shelly Wall Display X2i, mounted, showing a different dashboard layout
photoCredit: 'Photo: Shelly'
sidebar:
  label: X2i
  order: 4
---

:::note
**This is the one Shelly Wall Display that has been examined on real hardware.** The sections on developer mode, installing Panel Assistant, sensors, relays, what the firmware lacks, and lower-level access all come from a single retail unit on factory firmware 2.5.4. The specification table mixes those measurements with Shelly's own product data. Nothing on this page transfers to the [X1i](/hardware/panels/shelly/wall-display-x1i/), the [XL](/hardware/panels/shelly/wall-display-xl/) or any other model. See the [Wall Display family page](/hardware/panels/shelly/) for sourcing, the firmware OTA mechanism and the notes shared across the line.
:::

The Wall Display X2i, firmware codename **Jenna**, is a 6.9 in 1440×720 panel on a Rockchip RK3326 (four Cortex-A35), Android 11, arm64-v8a. Shelly's specification names the RK3326-S variant; the chip itself reports only the RK3326 family, which is consistent with that. It is on the modern **WallDisplayV2** OTA track alongside the X1i, XL, Maverick and Dayna, and has access to the built-in AppStore.

Panel Assistant runs on it as an ordinary Android app. **Everything needed to set it up and use it day to day works without root**: installing, granting its own permissions, the sensors, brightness and taking over the home screen. Root would still buy the privileged extras any panel needs it for, listed under [What this firmware does not have](#what-this-firmware-does-not-have). That makes the X2i the least restrictive Shelly Wall Display documented here and the only one with a confirmed installation path.

## Also sold as

Shelly Wall Display X2i, firmware codename Jenna.

|          |                                                                                                                                                                                                                                                          |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | RK3326-S per Shelly's specification; the chip reports the RK3326 family, four Cortex-A35                                                                                                                                                                 |
| Display  | **1440×720**, 6.9 in, 240 dpi                                                                                                                                                                                                                            |
| Android  | 11 (API 30), arm64-v8a, `user` build                                                                                                                                                                                                                     |
| WebView  | Chromium **131.0.6778.200** as shipped, well above Panel Assistant's minimum, so no WebView work is needed                                                                                                                                               |
| Sensors  | Proximity and ambient light, both ordinary Android sensors needing no permission; **no temperature or humidity sensor**                                                                                                                                  |
| Relay    | Interchangeable base: 1 output as standard, optional 2-output base. Present in software and confirmed switching, but not exposed by Panel Assistant; see [Relays](#relays)                                                                               |
| Root     | None. Developer mode unlocks adb, which is all setup needs; the privileged features below stay unavailable                                                                                                                                               |
| Released | About December 2025 (est.); Shelly quietly released the X2i in Europe around 22 December 2025 ([launch coverage, Notebookcheck, December 2025](https://www.notebookcheck.net/Shelly-quietly-launches-new-Wall-Display-XL-smart-home-hub.1190942.0.html)) |

## Unlocking developer mode

Shelly does not advertise it, but the X2i has the usual hidden developer-mode unlock. Open **Settings → General → About Device**, find the cards for hardware information and software information, and tap this sequence across the firmware and hardware lines:

> firmware, hardware, firmware, firmware, hardware, firmware, hardware, hardware

**Tap the line's title, not the value beside it.** Tapping the value does nothing, which is the most likely reason the sequence is reported as unreliable elsewhere.

Developer options and USB debugging then appear in Settings as on any Android device. Connect a USB-A to USB-C cable and the panel enumerates for adb. There is **no authorisation prompt to accept on the screen**, because this firmware does not require adb authorisation.

:::caution
A USB-C to USB-C cable does **not** power or enumerate the panel. The USB port is wired for legacy host power, so a USB-C source never raises its supply. Use a USB-A to USB-C cable, as Shelly's own documentation specifies.

**Cable type is not the whole story, and this is the one that wastes an afternoon.** A cable that powers the panel perfectly well may still not carry data, and the panel gives no sign of the difference: the screen lights either way. If the panel does not appear to your computer, try a different USB-A cable before you suspect the panel, the drivers or the browser. It took five cables here.

Note also that **the relay terminals are inert while the panel runs on USB power**. Relay behaviour can only be checked with the panel on mains through its power base.
:::

## Installing Panel Assistant

The [browser installer](/install/install-over-usb/) completed against a factory unit over USB with no root: it sideloaded the app and granted every permission it needs, including accessibility, write-settings and overlay access. Two limits are worth knowing before you start. Both belong to the installer rather than to this panel:

- **It does not configure Wi-Fi.** A boxed panel has no network, and setup continues on the panel's own screen, which needs one. Join the panel to Wi-Fi in Settings before or after the install.
- **It does not take over the home screen.** Until you set it as the home app, pressing home returns you to Shelly's launcher. Setting Panel Assistant as the home app works without root, and it holds home reliably afterwards. Shelly's return-to-home watchdog does not take it back.

## Sensors

Proximity and ambient light are both exposed through the standard Android sensor API and need no permission. Panel Assistant reported reading proximity through its raw Sensortek route rather than the Android sensor, which its own diagnostics name as `driver_raw16`; either way it reads them as an ordinary app, with no privilege involved. The proximity sensor is registered as a wake-up sensor. Both parts are Sensortek STK3A5x devices on the same I²C address.

The X2i has **no temperature or humidity sensor**, so no room-climate readings are available from the panel itself.

## Relays

The X2i's power base carries relays, and they are genuinely reachable from software: the panel exposes them as a world-writable sysfs class, and writing to it audibly switches the contacts with no root at all. **Panel Assistant nevertheless does not offer relay controls on this panel.** Its relay support activates only for a panel whose profile names a relay class, and neither Shelly profile does, so the controller stays inert and never looks. Root on its own would not change that.

Two conditions would travel with any future support, and both are easy to trip over in testing:

- Relays are inert while the panel is powered over USB. They need mains through the power base.
- The unprivileged write succeeds only because this firmware ships with SELinux in permissive mode. A future firmware that enforces policy would block it regardless of file permissions.

Until then, drive the relays through Home Assistant's own Shelly integration.

## What this firmware does not have

- **No Recents at all.** The firmware ignores the Recents key, and Android's accessibility Recents action does nothing either, each tested with an ordinary app and with Settings in front. The reason is below both of them: the system logs that the recents task directory does not exist, so no route can produce a task switcher. Panel Assistant still offers a Recents control here, because the bundled profile declares this panel has one, and that control cannot work.
- **No camera.** The firmware declares camera features that no hardware backs, and Android enumerates no camera. Nothing declares a camera in the profile either, so Panel Assistant correctly offers none here.
- **No root.** There is no `su` and no way to become root from the shell. Setting the panel up and using it day to day does not need it, but a set of features does stay unavailable: screenshots, tap-and-capture remote control, verified app and Companion updates, display density and text size, and rebooting or switching back to the vendor launcher. The onboard relays are a separate matter, covered above.

## Firmware, and why the shipped version matters

The unit examined here was factory-fresh on **2.5.4**, had never reached Shelly's cloud and had never taken an update. That baseline is more permissive than later firmware in one way that matters:

- On 2.5.4 there is **no device owner and no device administrator at all**, and Shelly's launcher can be disabled and re-enabled with ordinary package commands.
- The **2.7.3** update payload installs device-owner policy files, and the [ShellyElevate](https://github.com/RapierXbox/ShellyElevate) project reports that the launcher becomes a protected package there which refuses to be disabled. Neither was observed here, and which release in between introduced them is unexamined.

Shelly Wall Display updates are one-way; there is no published downgrade path. A unit that has already updated will behave as the later firmware does.

See the [Wall Display family page](/hardware/panels/shelly/) for the OTA endpoints on the `WallDisplayV2` track and the firmware version history.

## Lower-level access

For completeness, and not because Panel Assistant needs any of it:

- `adb reboot loader` puts the panel into Rockchip loader mode, where the partition table reads out cleanly. **Reads past the first 32 MiB silently return filler while still reporting success**, so this route cannot produce trustworthy full-partition images. Check what you read rather than trusting an exit status.
- Maskrom mode refuses an unsigned loader: the boot ROM enforces a signature.
- The bootloader reports itself as secure and locked, yet Android Verified Boot is not enforced, which is why the community's root route is writing a patched boot image rather than unlocking anything. That route overwrites the running boot partition and no vendor image exists to restore it, so it is not reversible.

## Source

[Shelly Wall Display X2i knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2i).
