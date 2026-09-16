---
title: Sonoff NSPanel Pro
description: Hardware facts for the original Sonoff NSPanel Pro 86P and 120P, a Rockchip PX30 panel with a built-in Zigbee radio.
vendor: Sonoff
panelIndex: true
sidebar:
  label: Overview
  order: 0
---

The original NSPanel Pro line ships as two physically different panels, the **[86P](/hardware/panels/sonoff-nspanel-pro/86p/)** and the **[120P](/hardware/panels/sonoff-nspanel-pro/120p/)**, named for the EU 86 mm and 120 mm wall boxes. Both are built-in **Zigbee 3.0 coordinator** panels with no NFC or IR, and the lowest-power CPU of the fully supported panels. They share almost everything documented on this page (root process, WebView, LED, sensors, Zigbee gateway); each variant's own page carries only its own clean specification and the handful of facts that differ. This page was reverse-engineered primarily on a live **86P** (Android 8.1, rooted, toolbox `su`), with the 120P separately verified live where noted.

## Also sold as

Sonoff NSPanel Pro 86, NSPanel Pro 120, NSPanel Pro 86P, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, px30_evb, SN_3326S, SN-RKPX30-NSP-01, nspanel-pro, nspanel-pro-ver120. Not to be confused with the NSPanel Pro Gen2 or the Tuya S6E and T6E boards, which are separate hardware.

:::tip
The most-needed facts: the panel ships **`userdebug` with no adb password**, so `adb root` just works. The **LED is not characterised** (no controllable RGB node has been found). Light and proximity are **app-direct**. The on-board **EFR32 Zigbee radio** is managed over a local broker, not by reflashing. Update the **WebView first**; see [WebView: update this first](#webview-update-this-first).
:::

|         |                                                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | Rockchip **PX30 / rk3326**                                                                                                      |
| CPU     | 4× **Cortex-A35** at up to **1.512 GHz** (idles at 408 MHz)                                                                     |
| GPU     | **Mali-G31** (device-confirmed)                                                                                                 |
| Display | **480×480 square** (1:1), about 4 in, 160 dpi (mdpi, well matched to about 170 physical ppi), 60 Hz, a **480×480 dp** canvas    |
| RAM     | **2 GB** (about 1960 MB usable)                                                                                                 |
| Storage | eMMC; `/data` about 3.5 GB                                                                                                      |
| Android | 8.1 (API 27)                                                                                                                    |
| ABI     | arm64-v8a                                                                                                                       |
| Radios  | **Zigbee 3.0** (Silicon Labs EFR32 coordinator on UART `ttyS5`, see below), Wi-Fi, Bluetooth. No NFC, IR, Ethernet or cellular. |

:::note
The Cortex-A35 is an efficiency core with markedly lower per-clock throughput than the A55 (TPA10) or A72 (WF1589T). With 2 GB RAM, the NSPanel Pro is the **entry-level performer** of the three fully supported panels; see the [performance comparison](/hardware/#performance-comparison).
:::

:::tip
Changing firmware on a button-less panel? Read [Firmware backup and restore](/hardware/guides/firmware-backup-and-restore/) first. The NSPanel Pro uses [seaky's model-specific tooling](/hardware/guides/firmware-backup-and-restore/#per-panel-notes) rather than `rkdeveloptool`.
:::

## Variants: 86P and 120P

The specification table above and most of this page were captured on an **86P**; the **120P** is a different board. See the [86P](/hardware/panels/sonoff-nspanel-pro/86p/) and [120P](/hardware/panels/sonoff-nspanel-pro/120p/) pages for each variant's own clean specification table and photo.

|                      | NSPanel Pro **86P**                                                                                                                              | NSPanel Pro **120P**                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| SoC                  | Rockchip **PX30**                                                                                                                                | Rockchip **RK3326-S** (same PX30/RK3326 family; `ro.board.platform=rk3326`, device tree `rockchip,px30`)             |
| Display              | **480×480** square, about 160 dpi, portrait only                                                                                                 | **750×1334** portrait, **240 dpi** (override 250); landscape available; about 1 cm narrower and longer than the 86P  |
| Build IDs            | both report `ro.product.model/device/name = px30_evb`, a shared Rockchip board name and _not_ a reliable way to tell the variants apart          | as 86P                                                                                                               |
| `ro.product.version` | `s6_android_x.y.z` form                                                                                                                          | `NSPanelXXXP_x.y.z` (OTA channel `nspanel-pro-ver120`, full ROM `SN_3326S_750X1334_…`)                               |
| OTA form             | full ROM through **4.0.12**; later indexed releases ship as diffs or app-only updates (see the [firmware page](/hardware/firmware/nspanel-pro/)) | as 86P                                                                                                               |
| Proximity firmware   | **4.0.12 restored ranged** readings                                                                                                              | stayed **binary** on 4.x (the kernels diverge per model; see [Sensors](#sensors-light-and-proximity-are-app-direct)) |

Both share the EFR32 Zigbee radio, Android 8.1 (AOSP), arm64-v8a, and the root and recovery story below. Verified live on a 120P (firmware `NSPanel120P_3.7.1`): `wm size` 750×1334, density 240, `ro.board.platform=rk3326`.

:::note
This page does not recommend a firmware version in prose; the generated [firmware index](/hardware/firmware/) is the authority. The flashing procedure is hardware-verified through **4.4.0**. Releases indexed past that are verified against the CDN only, never flashed live. As of 2026-08-14, [Sonoff's public changelog](https://sonoff.tech/en-us/blogs/news/sonoff-nspanel-pro-version-update-information-and-faq) documents releases up to **4.6.0**; 4.6.2 and 4.8.0 were located only by probing the CDN, and 4.7.0 is discussed only in an [eWeLink user feedback thread](https://forum.ewelink.cc/t/nspanel-pro-v4-7-0-feeback/208789), which is a discussion, not a release announcement. The **4.5.3** release is a ROM diff on the 120P but an app-only update on the 86P, and **4.6.2** is an app-only update with no ROM diff on either channel, so an upgrade is not always a single hop. Absence from the index means the build was not found by probing; the CDN cannot be listed, so absence never proves a build does not exist.

**Community reports describe restart loops on 4.5.1 and 4.5.2**, at intervals of about 10 to 60 minutes on both models. For 4.7.0, the feedback thread contains reports of sub-device connectivity trouble after updating, some resolved by a reboot and others described as continuing. These have not been reproduced or quantified, so treat them as unverified user reports rather than a known regression. Verify any newer release on one panel before rolling it out to several; **4.0.12** remains the conservative full-ROM checkpoint to pin.
:::

### Firmware quirks by version

Behaviour that changes across eWeLink firmware versions, oldest first. `ro.product.version` is the **internal** ID (`s6_android_x.y.z` on the 86P, `NSPanelXXXP_x.y.z` on the 120P), _not_ the marketing or OTA number the eWeLink app shows (4.0.12, 4.5.x). Detection and any version-keyed logic must read `ro.product.version`, not the marketing string.

| Firmware                               | Quirk or behaviour                                                                                                                                                                                                                                                                                                                                                                                                                                                | What to do                                                                                                                                                                                                                                                                                                 |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Older (before 1.3.2)**               | No in-app adb toggle; developer options unreachable from the UI                                                                                                                                                                                                                                                                                                                                                                                                   | Enable adb through the internal **OTG port** (open the case); see [Gaining adb and root access](#gaining-adb-and-root-access).                                                                                                                                                                             |
| **1.3.2 and later**                    | adb enable moved into the eWeLink app                                                                                                                                                                                                                                                                                                                                                                                                                             | eWeLink, _Device Settings_, tap **Device ID** eight times, developer mode, adb.                                                                                                                                                                                                                            |
| **1.4 and later**                      | Developer mode **removed** from the UI                                                                                                                                                                                                                                                                                                                                                                                                                            | Enable adb through the **five power cycles** at the Sonoff boot animation; see [Gaining adb and root access](#gaining-adb-and-root-access).                                                                                                                                                                |
| **3.5.1 (86P, verified)**              | Stock system WebView is **Chromium 107.0.5304.105**, far too old for a modern Home Assistant dashboard; other firmware may differ                                                                                                                                                                                                                                                                                                                                 | Check and update the WebView **first**; see [WebView: update this first](#webview-update-this-first). The panel app's health banner also flags WebView versions below Chromium 110.                                                                                                                        |
| **3.7.1 (120P, live)**                 | Baseline reference build                                                                                                                                                                                                                                                                                                                                                                                                                                          | `wm size` 750×1334, density 240, `ro.board.platform=rk3326`.                                                                                                                                                                                                                                               |
| **4.0.0** (rolled out from 2025-09-19) | Stock firmware bundles the F-Droid app store; markedly faster UI                                                                                                                                                                                                                                                                                                                                                                                                  | Confirm that **APP** _and_ **OS** version both read 4.0.0 or later.                                                                                                                                                                                                                                        |
| **4.0.12**                             | Ranged proximity readings restored on the **86P**; the **120P stays binary** (the kernels diverge per model)                                                                                                                                                                                                                                                                                                                                                      | The conservative stable pin. The raw input shape depends on model and firmware, and the panel app learns and normalises either form; see [Sensors](#sensors-light-and-proximity-are-app-direct).                                                                                                           |
| **4.5.1 and 4.5.2**                    | **Widespread community restart-loop reports** (about 10 to 60 minutes, both models); 4.5.2 is an app-only layer on 4.5.1                                                                                                                                                                                                                                                                                                                                          | Superseded by later releases. Pin at **4.0.12** for maximum stability, or test a newer release on one panel first.                                                                                                                                                                                         |
| **4.5.3**                              | Matter auto-discovery and screen-management optimisations; ROM diff on the 120P but app-only on the 86P                                                                                                                                                                                                                                                                                                                                                           | No restart-loop evidence specific to 4.5.3; superseded by later releases.                                                                                                                                                                                                                                  |
| **4.6.0** (June 2026)                  | **Local Web Portal** (`nspanelpro.local`: LAN setup, MQTT Discovery export to Home Assistant, Matter Bridge); CDN inspection found diffs from 4.0.12, 4.4.0 and 4.5.1                                                                                                                                                                                                                                                                                             | Documented in Sonoff's public changelog. **4.6.2** is indexed as an app-only update with no ROM diff on either channel; no 4.6.1 has been found.                                                                                                                                                           |
| **4.7.0** (July 2026)                  | Discussed in an eWeLink user feedback thread but **absent from Sonoff's public changelog**; covers Gen1 and Gen2 panels; users report added Basic gen-5 relay (BASIC-1GS) support; CDN inspection found inbound diffs from 4.0.12, 4.4.0, 4.5.1 and 4.6.0 on both models, plus 4.5.3 on the 120P only                                                                                                                                                             | Community reports of sub-device connectivity trouble, some resolved by a reboot and some described as continuing; unverified. Verify on one panel before rolling it out further.                                                                                                                           |
| **4.8.0** (August 2026)                | **No release announcement and no changelog found**; located by probing the CDN. An eWeLink staff post on 2026-07-16 in the [roadmap thread](https://forum.ewelink.cc/t/nspanel-pro-roadmap-and-co-created-future/206240) scheduled it for August and confirmed one feature: an option to auto-update the panel through the eWeLink app. CDN inspection found inbound diffs from 4.0.12, 4.4.0, 4.5.1, 4.6.0 and 4.7.0 on both models, plus 4.5.3 on the 120P only | Contents otherwise unknown, and no feedback thread has been found, so there is no report either way on stability. Treat it as unassessed rather than clean. **If the auto-update option ships enabled, a panel could take firmware unattended**, so check that setting before relying on a pinned version. |

:::note
These are quirks of the original 86P and 120P. The NSPanel Pro **Gen2** (RK3326-**S**, dual relays, EFR32**MG24**) is a different hardware target. Sonoff ships Gen1 and Gen2 on the same firmware version line (4.7.0 covers both), so do not infer a separate firmware line or assume every note about the original model carries over.
:::

Sibling Tuya-family boards, the **S6E** and **T6E** (relay variants; the S6E is a T6E with two relays), the [**Smatek S9E**](/hardware/panels/smatek-s9e/) and the [**Tuya TPA10**](/hardware/panels/tuya-tpa10/) (RK3566, Cortex-A55, Android 11), are separate targets and do not run NSPanel Pro firmware.

:::danger
Detection cannot rely on `ro.product.model`, because both variants report `px30_evb`. Use `ro.product.version`, display metrics or `ro.board.platform` to tell the 86P from the 120P. Proximity behaviour also differs between models and firmware, so the panel app learns from live readings instead of selecting a firmware-specific classifier.
:::

## Gaining adb and root access

Unlike the TPA10, the NSPanel Pro has **no adb password**. It ships as a `userdebug` build with test keys (`ro.debuggable=1`), so `adb root` works and `/system` can be remounted. The only hard part is _reaching_ developer options, which the eWeLink firmware hides differently per version. Distilled from blakadder's guides ([sideload](https://blakadder.com/nspanel-pro-sideload/), [secrets](https://blakadder.com/nspanel-pro-secrets/)).

**1. Enable adb.** The route depends on firmware:

- **Older firmware:** open the case (remove the back screws and disconnect the touch connector) to expose the OTG USB port, and connect a host; adb works directly over USB.
- **Firmware 1.3.2 and later:** in the **eWeLink app**, open the panel's _Device Settings_ and tap the **Device ID** eight times to enable developer mode, which restores adb.
- **Firmware 1.4 and later** (developer mode removed): power-cycle the panel **five times** during the Sonoff boot animation to force a recovery boot, and in that window run `adb install ultra-small-launcher.apk`. After the reboot, set that launcher as default, then tap _Settings, System, About tablet, Build number_ seven times to re-enable developer options and turn on USB debugging.

**2. Switch to network adb**, so the case can stay closed:

```bash
adb tcpip 5555
adb shell ip -o a            # find the panel IP
adb connect <panel-ip>:5555
adb shell su 0 setprop persist.adb.tcp.port 5555   # survive reboot (service prop resets)
```

**3. Root.** Because the build is `userdebug`, `adb root` gives a root adbd shell immediately. The panel app calls `su` from its sandbox, so install a persistent `su` into `/system`. **SuperSU `su` 2.76** at `/system/xbin/su` is the tested build:

```bash
adb root
adb disable-verity          # only if remount is refused; this reboots the panel
adb remount                 # or: adb shell mount -o remount,rw /system
adb push su /system/xbin/su
adb shell chmod 06755 /system/xbin/su
```

:::danger
Disable the eWeLink apps (`com.eWeLinkNSPro.dev`, `com.eWeLinkControlPanel`) only **after** adb and `su` are solid and you have another way to go home and back; the panel app's navigation actions cover that. The eWeLink **Zigbee gateway** stack is independent of these apps and keeps running; manage it with the [Zigbee router switch](#zigbee-gateway) rather than removing it.
:::

## WebView: update this first

An 86P freshly flashed to firmware `3.5.1` (build `164637`) was verified with `com.android.webview` **107.0.5304.105** (Chromium 107), which is too old to render a current Home Assistant dashboard. Other firmware and models may differ, so check the installed provider before deciding whether to update. The archived OTA diff packages do not include a WebView APK, so this version was read from the live unit with `dumpsys webviewupdate`. That unit runs Chromium **138** after a clean adb update. See [Updating the system WebView](/hardware/guides/update-the-webview/).

## LED

No `/sys/class/leds` RGB node and no `/dev/ledjni` were found on this unit, so there is **no app- or sysfs-controllable RGB LED characterised** on the NSPanel Pro (compare the TPA10's `avsux` node and the WF1589T's `/dev/ledjni`). Screen brightness and backlight use the standard Android paths.

## Sensors: light and proximity are app-direct

Unlike the TPA10, where light and temperature are root-only, the NSPanel Pro exposes its Sensortek combination sensor through the standard `SensorManager`: `android.sensor.light`, `android.sensor.proximity` and `android.sensor.accelerometer`, all readable by a normal app without root. The panel app reads light and proximity here directly. No temperature or humidity sensor is fitted.

:::note
**Proximity readings depend on both firmware and model.** The sensor is a Sensortek STK3A5x in a cutout on the top PCB behind the cover glass. The resting baseline varies widely between units (one about 1000, another about 4000); only the _relative_ change matters, so a high idle baseline is normal, not a fault. Up to about firmware **3.3** it reports a ranged reading at about 50 ms cadence; from about **3.3 to 3.4** the kernel driver switched it to binary 0 or 1. **4.0.12 restored ranged readings on the 86P only**; the **120P stayed binary**. The panel app handles both from live behaviour and normalises the useful range across all your panels, so profiles do not encode per-firmware thresholds or ranged and binary classifiers. (Sources: seaky's tools issues [142](https://github.com/seaky/nspanel_pro_tools_apk/issues/142), [144](https://github.com/seaky/nspanel_pro_tools_apk/issues/144), [171](https://github.com/seaky/nspanel_pro_tools_apk/issues/171) and [262](https://github.com/seaky/nspanel_pro_tools_apk/issues/262).)
:::

### Bound I²C devices

| I²C address         | Driver or name                | What it is                                                    |
| ------------------- | ----------------------------- | ------------------------------------------------------------- |
| `0-0020`            | `rk809`                       | PMIC                                                          |
| `1-001a` / `1-005a` | `CST226` / `CST226SE`         | Hynitron capacitive touch controller                          |
| `2-003c`            | `tp`                          | touch panel                                                   |
| `2-0046`            | `ls_stk3a5x` and `ps_stk3a5x` | Sensortek **STK3A5x** ambient light and proximity combination |
| `2-0047`            | `ls_stk3x3x` and `ps_stk3x3x` | Sensortek **STK3x3x** light and proximity (alternative part)  |

## Zigbee gateway

The NSPanel Pro has a built-in **Silicon Labs EFR32 Zigbee 3.0 radio** on UART `/dev/ttyS5`, driven by the manufacturer's host stack (`/vendor/bin/siliconlabs_host/zgateway`) over a local MQTT broker. The eWeLink apps use the same stack, which is why the panel ships as an eWeLink Zigbee hub.

The panel app manages it directly. `switch.<panel>_zigbee_router` turns the panel into a Zigbee **router** that extends your existing mesh (it starts the gateway and ensures the Repeater role), and turns it off again (stopping the gateway and freeing the radio). It works over the local broker, with no credentials and no direct `ttyS5` handling. The panel then appears as a normal router in your ZHA or Zigbee2MQTT coordinator.

:::note
Switching role is **not a reflash**: there is no `.gbl` or bootloader step, it only sets the EZSP node type. For partition-level firmware work, see [Firmware backup and restore](/hardware/guides/firmware-backup-and-restore/).
:::

:::note
**No Thread Border Router is documented or characterised.** The installed vendor stack uses the EFR32 as a Zigbee NCP. The EFR32MG21 silicon is multiprotocol-capable, but that does not establish Thread firmware or a border router on the panel; Sonoff documents a Matter Bridge instead.

**Firmware 4.x reworked the Zigbee stack.** Community inspection found a forked Zigbee2MQTT, a changed on-device MQTT password and a different boot sequence. [Sonoff documents coordinator and router switching](https://sonoff.tech/blogs/news/nspanel-pro-v4-3-0-central-heating-redefining-whole-home-temperature-automation) in current firmware, but the panel app's local-broker control path was built against 3.x and earlier and **may need adapting on 4.x**. (Community sources: seaky's tools issues [241](https://github.com/seaky/nspanel_pro_tools_apk/issues/241), [244](https://github.com/seaky/nspanel_pro_tools_apk/issues/244) and [255](https://github.com/seaky/nspanel_pro_tools_apk/issues/255), and [roottool issue 3](https://github.com/seaky/nspanel_pro_roottool_apk/issues/3).)
:::

:::caution
**A defect in the legacy vendor Zigbee watchdog is confirmed by a reporter on NSPanel Pro 120 stock firmware 3.8.0.** Firmware containing the recursive `LD_LIBRARY_PATH` assignment described in [the reporter's issue](https://github.com/maxlyth/ha-paneld/issues/34) can eventually make every external command the watchdog launches fail with `E2BIG`, consume one CPU core, and stop recovering a dead `zgateway`. A reboot clears the problem only temporarily. See [Performance tuning](/manage/performance/) for the evidence and the requirements for a safe repair. The reporter's workaround has not been independently validated. Community inspection of 4.0.12 and 4.6.0 did not find the vulnerable assignment.
:::

### Requirements: firmware 2.2.0 or later

The host stack is the **manufacturer's own** eWeLink and Sonoff gateway, versioned to match the panel firmware (for example `sonoff-v3.5.4`). Zigbee **router mode** arrived in **NSPanel Pro firmware 2.2.0** (2023; eWeLink app, _Device Settings, Pilot Features, Zigbee Mode_), and local host-stack repeater support in gateway package 1.1.9. In practice:

- **Gateway present** (firmware 2.2.0 or later, or side-loaded): the panel app detects it and publishes `switch.<panel>_zigbee_router`. Turn it on and the panel joins your coordinator as a router.
- **No gateway** (very old firmware, never provisioned): the switch **does not appear**, because it depends on the gateway's launch script existing. Update the firmware to 2.2.0 or later, or side-load the gateway package as described under [Existing gateway installations](#migrating-from-nspaneltools).

The panel app **drives** the gateway; it does not ship or install it, because it is eWeLink's binary. Firmware 4.x adds a Matter bridge and can export Zigbee devices to Home Assistant through MQTT Discovery, as alternatives to the router role.

### Gateway health and automatic containment

On a Zigbee-capable panel, `sensor.<panel>_zigbee_gateway_health` reports the vendor stack independently of the router switch, so an unconfigured stock gateway is still visible without granting the panel app permission to stop it.

When the router switch has explicitly been turned on, the panel app allows a 15-minute startup and pairing grace period, then checks once a minute for two runaway signatures: an explicitly invalid or unjoined network combined with more than 50% of one CPU core for five consecutive samples, or at least three gateway process ID changes within ten minutes. A joined router with sustained high CPU produces a warning only and keeps running. Unknown 4.x layouts, or missing firmware-specific join evidence, fail safe to `unknown`.

Turning the Zigbee router switch on explicitly requests Repeater mode even when the vendor gateway is already running, so turning it on while your ZHA or Zigbee2MQTT coordinator permits joining acts as a fresh join attempt without starting a second gateway supervisor.

The Configure tab shows a **Request join** action directly beneath the Zigbee router switch; the switch remains the only on and off control. Enable permit-join in ZHA or Zigbee2MQTT, then request joining and confirm that permit-join is open. The action reasserts Repeater mode, starts a fresh 15-minute grace period and polls the health status; it does not reboot or restart the panel. The button is unavailable while the router is disabled, already joined, or cooling down after a recent request.

After the grace period, an enabled gateway that is still unjoined produces a persistent warning on the dashboard, the Install tab and the status API, linked to that Configure action. Do not leave it in that state, because repeated join attempts can consume substantial CPU. Either join the panel as a router or turn the Zigbee router switch off.

If a configured legacy gateway meets a runaway rule, the panel app turns the router switch off persistently and attempts one bounded containment. Vendor-native containment can target only the Sonoff guard, `zgateway` and the matching local broker. If a process cannot be stopped, the respawner is removed where possible and surviving gateway work is demoted to nice 19 and Android's background cpuset. Turning the router switch on later starts one fresh grace period and attempt.

The health attributes include firmware and product version, gateway layout and package version, joined and role status, rounded gateway and guard CPU, recent restart count and containment result. They never include the Zigbee network key, raw local-broker credentials, the radio MAC address or raw gateway `netinfo`.

### Migrating from NSPanelTools

[NSPanelTools](https://github.com/seaky/nspanel_pro_tools_apk) side-loads the official Sonoff gateway package onto firmware that did not ship it, and many panels run a gateway installed that way. Panel Assistant now covers almost everything NSPanelTools does, so most panels no longer need it. The panel app coexists with it and can take the gateway over:

- **Side by side is fine.** The router control is idempotent: it **defers** to whatever already runs the gateway and will not start a second copy or fight it. Adaptive brightness is off until you turn it on. Nothing conflicts by default.
- **Handing the gateway to the panel app.** The host stack lives in `/vendor` and **survives uninstalling NSPanelTools** (verified; a persistent hook even keeps starting it at boot). Remove NSPanelTools and the panel app keeps driving the gateway. If the boot hook is removed too, the panel app starts the gateway at boot when the switch was left on.

:::note
NSPanelTools also uses the screen and sensors. Running both is harmless by default, but enabling overlapping features in both, such as waking the screen on a hand gesture, can cause duplicate actions. Remove NSPanelTools once the panel app covers what you need.
:::

### EZSP host stack internals

On the legacy vendor-native stack (3.x and earlier), the radio runs **EZSP NCP firmware** (EFR32MG21, EZSP v8). `zgateway` is an EZSP _host_ binary in `/vendor/bin/siliconlabs_host/`, kept alive by its own `guard_process.sh` supervisor (a 5-second loop, started at boot) and controlled over a **local mosquitto broker** on `127.0.0.1:1883`. The broker is anonymous: the `password_file` line is commented out in `mosquitto.conf`. The 4.x stack differs as described above.

- Role status: `zigbee/system/network-role/information` returns `{"role":"Repeater"|"Coordinator"}`
- Role switch: publish `{"role":"Repeater"}` to `zigbee/system/network-role/switch`

"Repeater" is router mode, which extends an existing mesh; the role persists in the NCP's non-volatile memory. The vendor `zgateway` survives removal of the eWeLink _apps_, because it lives in `/vendor`, not in an APK.

For a full standalone Zigbee2MQTT or ZHA coordinator _on the panel_ instead, see [seaky/nspanel_pro_zigbee](https://github.com/seaky/nspanel_pro_zigbee), which replaces the host stack. It is heavier, and it is not what the panel app does.

## Access model summary

- **Light, proximity, accelerometer:** app-direct (`SensorManager`).
- **Screen brightness, sleep, navigation, text-to-speech:** standard Android paths (`su` for true backlight-off).
- **LED:** none characterised.
- **Zigbee:** EFR32 radio managed through the on-device gateway's local broker (`switch.<panel>_zigbee_router`).
- **Radios:** Zigbee 3.0, Wi-Fi and Bluetooth.

## Performance expectations

The NSPanel Pro is **constrained on CPU and RAM** for rich dashboards:

- At idle it sits at 408 MHz with about 500 MB of RAM in use; a heavy dashboard pushes both hard.
- **2 GB of RAM is the binding constraint.** The dashboard WebView, Android and background apps compete for it, and large dashboards with many cards, big images, long history graphs or expensive custom cards cause WebView reloads and jank.
- The A35 cores make page transitions and animations visibly slower than on A55 or A72 panels.

With the built-in renderer, start with the automatic dashboard entity filter described in [Performance tuning](/manage/performance/), so the panel does not process states its dashboard never shows. Then use the performance cards on the Dashboard tab to find remaining heavy views, memory pressure or thermal limits before simplifying the dashboard.
