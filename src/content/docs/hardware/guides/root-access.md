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

- **Sysfs and input nodes owned by `system`.** On some panels the LED, button backlight and climate sensors are `system:system` files, which a sandboxed app cannot write or read. The panel app then talks to a small root helper daemon, `hapaneld-helper`, over a Unix socket. See the [helper documentation](https://github.com/panel-assistant/android/blob/main/helper/README.md).
- **True backlight-off, reboot and CPU governor control.** Without a root route these fall back to what Android allows, for example brightness zero instead of powering the backlight down.
- **Relays and GPIO lines**, where a panel exposes them only through root sysfs.

The panel app checks each privileged route when it uses it, so a panel without root still gets the dashboard, standard sensors, brightness and navigation, and a capability that needs root is shown as unavailable rather than failing.

## Routes by panel

- **[Sonoff NSPanel Pro](/hardware/panels/sonoff/#gaining-adb-and-root-access).** A `userdebug` build with test keys and **no adb password**. The only hurdle is reaching developer mode, which varies with eWeLink firmware. Then `adb root`, remount, and install a persistent `su`.
- **[Tuya TPA10](/hardware/panels/tuya/tpa10/#gaining-adb-and-root-access).** adb is **password-protected**. The reliable route is the USB diagnostics-app backdoor, and `su` is already present. A short script then makes network adb persist across reboots.
- **[Electron WF1589T](/hardware/panels/electron/wf1589t/#gaining-adb-and-root-access).** A `userdebug` build with Google Play. `adb root` works directly. The LED is app-direct, so root is rarely needed.
- **[Electron WF2489T (ZHICAI SMT1019)](/hardware/panels/electron/wf2489t/#root-access-by-firmware-build).** The retail production build has no root. The supplier `userdebug` build is rooted, but needs a remount before the helper can persist.
- **[SMT156](/hardware/panels/electron/smt156/).** No app-accessible `su` on the reported installation. USB `adb root`, vendor engineering mode and persistent unlock routes have not been tested.
- **[Smatek S9E](/hardware/panels/smatek/s9e/).** The vendor app runs root commands and some units ship with developer mode unlocked. App-level `su` has been reported on firmware 1.1.0; access still depends on the unit and firmware.
- **[Shelly Wall Display](/hardware/panels/shelly/).** On a [Wall Display X2i](/hardware/panels/shelly/wall-display-x2i/) tested on factory firmware 2.5.4, developer options and USB debugging unlock from the Settings app, adb then connects without an authorisation prompt, and there is no root: no `su`, and `adb root` is unavailable. Installing the panel app and using it day to day does not need root there, but the privileged features on this page do. The other models have not been tested; the legacy firmware targets a `userdebug` base build, so `adb root` may work there if an adb connection can be established.

## Before you change anything

- Get adb working reliably, ideally on the network with your workstation's key pre-authorised, before disabling any vendor app. Disabling a vendor launcher, settings or hardware app first can lock you out of the panel.
- Keep a way to navigate. On a panel without buttons, the panel app's navigation actions replace the vendor's Back and Recents.
- Check what a vendor update changes before deciding whether to defer it: updates can revert access changes, but also fix security flaws. See [Firmware updates and capabilities](/hardware/firmware/#firmware-updates-and-capabilities) and [Stop unwanted updates](/hardware/guides/firmware-backup-and-restore/#stop-unwanted-updates).
- Take a partition backup before modifying firmware on a rooted Rockchip panel. See [Firmware backup and restore](/hardware/guides/firmware-backup-and-restore/).
- Some routes need `adb disable-verity`, which reboots the panel. A panel protected by a PIN cannot start its apps again after a reboot until someone enters the PIN, so be in front of it.

## Potential routes on other firmware

[CVE-2026-43499](https://github.com/CVEProject/cvelistV5/blob/main/cves/2026/43xxx/CVE-2026-43499.json) is a Linux kernel privilege-escalation flaw reached by code already running locally. It is a research candidate for other current and future panel families, not just Meta Portal. A kernel version alone does not establish a usable route on a vendor build: patches, kernel configuration and device restrictions need checking.

Keep three questions separate: can an owner first install or execute code; can that code gain kernel privileges; and can the panel app use the resulting access, including after a restart? Temporary privilege could help with installation, make ADB less awkward, change administrative settings or enable access to restricted hardware. It does not by itself provide persistent root or an app-accessible helper.

The [Meta Portal research](/hardware/panels/meta/#cve-2026-43499-and-community-provisioning) is an example with exact reported targets and explicit limits. It is not a generic Panel Assistant installer or a newly delivered capability. Shelly applicability and patched vendor builds have not been established. Normal installation and everyday use remain rootless where the panel supports them.
