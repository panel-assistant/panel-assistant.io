---
title: Gaining adb and root access
description: How each documented wall panel reaches adb and root, what the panel app uses root for, and where each model's exact procedure lives.
sidebar:
  label: adb and root access
  order: 1
---

Every panel reaches adb, and root where it has it, by a different route. This page gives the general picture; the exact firmware-specific steps are on each panel's page.

## What root is for

The panel app installs and runs without root. Root matters only for hardware that Android does not expose to an ordinary app:

- **Sysfs and input nodes owned by `system`.** On some panels the LED, button backlight and climate sensors are `system:system` files, which a sandboxed app cannot write or read. The panel app then talks to a small root helper daemon, `hapaneld-helper`, over a Unix socket. See the [helper documentation](https://github.com/maxlyth/ha-paneld/blob/main/helper/README.md).
- **True backlight-off, reboot and CPU governor control.** Without a root route these fall back to what Android allows, for example brightness zero instead of powering the backlight down.
- **Relays and GPIO lines**, where a panel exposes them only through root sysfs.

The panel app checks each privileged route when it uses it, so a panel without root still gets the dashboard, standard sensors, brightness and navigation, and a capability that needs root is shown as unavailable rather than failing.

## Routes by panel

- **[Sonoff NSPanel Pro](/hardware/panels/sonoff-nspanel-pro/#gaining-adb-and-root-access).** A `userdebug` build with test keys and **no adb password**. The only hurdle is reaching developer mode, which varies with eWeLink firmware. Then `adb root`, remount, and install a persistent `su`.
- **[Tuya TPA10](/hardware/panels/tuya-tpa10/#gaining-adb-and-root-access).** adb is **password-protected**. The reliable route is the USB diagnostics-app backdoor, and `su` is already present. A short script then makes network adb persist across reboots.
- **[Electron WF1589T](/hardware/panels/electron-wf1589t/#gaining-adb-and-root-access).** A `userdebug` build with Google Play. `adb root` works directly. The LED is app-direct, so root is rarely needed.
- **[ZHICAI SMT1019](/hardware/panels/zhicai-smt1019/#root-access-by-firmware-build).** The retail production build has no root. The supplier `userdebug` build is rooted, but needs a remount before the helper can persist.
- **[ZX-SMT156](/hardware/panels/zx-smt156/).** No app-accessible `su` on the reported installation. USB `adb root`, vendor engineering mode and persistent unlock routes have not been tested.
- **[Smatek S9E](/hardware/panels/smatek-s9e/).** The vendor app runs root commands and some units ship with developer mode unlocked. Whether `su` is reachable from an app sandbox is unconfirmed.
- **[Shelly Wall Display](/hardware/panels/shelly/).** On a [Wall Display X2i](/hardware/panels/shelly/wall-display-x2i/) tested on factory firmware 2.5.4, developer options and USB debugging unlock from the Settings app, adb then connects without an authorisation prompt, and there is no root: no `su`, and `adb root` is unavailable. Installing the panel app and using it day to day does not need root there, but the privileged features on this page do. The other models have not been tested; the legacy firmware targets a `userdebug` base build, so `adb root` may work there if an adb connection can be established.

## Before you change anything

- Get adb working reliably, ideally on the network with your workstation's key pre-authorised, before disabling any vendor app. Disabling a vendor launcher, settings or hardware app first can lock you out of the panel.
- Keep a way to navigate. On a panel without buttons, the panel app's navigation actions replace the vendor's Back and Recents.
- Stop the vendor updater where there is one, or an over-the-air update can revert your changes. See [Stop unwanted updates](/hardware/guides/firmware-backup-and-restore/#stop-unwanted-updates).
- Take a partition backup before modifying firmware on a rooted Rockchip panel. See [Firmware backup and restore](/hardware/guides/firmware-backup-and-restore/).
- Some routes need `adb disable-verity`, which reboots the panel. A panel protected by a PIN cannot start its apps again after a reboot until someone enters the PIN, so be in front of it.
