---
title: Shelly Wall Display
description: Research notes on the Shelly Wall Display family, covering the model platforms, firmware tracks, WebView, sensors and why there is no user-facing adb or root.
vendor: Shelly
panelIndex: true
sidebar:
  label: Overview
  order: 0
---

:::note
**Research only: no physical unit has been tested.** Product specifications come from Shelly's current product and knowledge base pages; firmware behaviour comes from OTA analysis, including a device-tree parse of the modern partition image, and the official [Wall Display changelog](https://github.com/ShellyGroup/Wall-Display-Changelog). The two bundled profiles predate the current model-specific specifications and remain **speculative** until they can be split and verified on hardware.
:::

Shelly sells the Wall Display as five named models on two unrelated hardware platforms: the **original** and **X2** on an armeabi-v7a legacy track, and **X1i**, **X2i** and **XL** on an arm64-v8a modern track. Firmware, OTA mechanism, access model and security are shared within each track, and mostly shared across both, so this page covers them once; each model's own page carries only its clean specification, alias list and photo.

- [Wall Display (original)](/hardware/panels/shelly/wall-display/): 4 in, 480×480, Android 7
- [Wall Display X2](/hardware/panels/shelly/wall-display-x2/): 6.9 in, 1440×720, Android 8.1
- [Wall Display X1i](/hardware/panels/shelly/wall-display-x1i/): 4 in, 720×720, Android 11
- [Wall Display X2i](/hardware/panels/shelly/wall-display-x2i/): 6.9 in, 1440×720, Android 11
- [Wall Display XL](/hardware/panels/shelly/wall-display-xl/): 10.1 in, Android 11

:::caution
The **original Wall Display ships Android 7.0**, which is below the minimum Android version Panel Assistant supports. The X2 runs Android 8.1, and the X1i, X2i and XL run Android 11.
:::

## Also sold as

Shelly Wall Display, Shelly Wall Display X2, Shelly Wall Display X1i, Shelly Wall Display X2i, Shelly Wall Display XL, Wall Display U1, Wall Display D1, SAWD-0A1XX10EU1, SAWD-2A1XX10EU1, firmware codenames Stargate, Pegasus, Cally, Jenna, Blake, Maverick, Dayna and Atlantis, OTA tracks WallDisplay and WallDisplayV2, device IDs k400_mt6580_32_n and e500_7731e_32u_o, launcher package cloud.shelly.stargate.

## Product family

Firmware codenames are useful when inspecting an OTA, but are not a substitute for the retail model name.

| Firmware codename | Market name                                                      | Display          | Platform                         | Relay hardware                                                     |
| ----------------- | ---------------------------------------------------------------- | ---------------- | -------------------------------- | ------------------------------------------------------------------ |
| Stargate          | [Wall Display (original)](/hardware/panels/shelly/wall-display/) | 4 in, 480×480    | MT6580, Android 7                | 1 output                                                           |
| Pegasus           | [Wall Display X2](/hardware/panels/shelly/wall-display-x2/)      | 6.9 in, 1440×720 | SC7731E, Cortex-A7, Android 8.1  | 1 output                                                           |
| Cally             | [Wall Display X1i](/hardware/panels/shelly/wall-display-x1i/)    | 4 in, 720×720    | RK3326-S, Cortex-A35, Android 11 | interchangeable base: 1 output as standard, optional 2-output base |
| Jenna             | [Wall Display X2i](/hardware/panels/shelly/wall-display-x2i/)    | 6.9 in, 1440×720 | RK3326-S, Cortex-A35, Android 11 | interchangeable base: 1 output as standard, optional 2-output base |
| Blake             | [Wall Display XL](/hardware/panels/shelly/wall-display-xl/)      | 10.1 in          | RK3566, Cortex-A55, Android 11   | 1 output                                                           |
| Maverick          | Wall Display U1 (US)                                             | not established  | not established                  | not established                                                    |
| Dayna             | Wall Display D1                                                  | not established  | not established                  | not established                                                    |

:::note
A variant called **Atlantis** is reported by a community project but has not been matched to a current official product page. Treat it as undocumented until it can be identified from a live unit. Maverick and Dayna have no established specification and no page here yet.
:::

:::caution
An archived partition image filed under an XL-like SKU identifies itself as `Jenna` and describes a different display platform. It is useful evidence about that image, but not reliable evidence for current retail product specifications. The official model pages above take precedence; use runtime identifiers when matching an actual device.
:::

## Hardware platform

The Wall Display is an **Android device**, not an ESP-based embedded product like Shelly's Gen1 and Gen2 switches. It runs a custom Android launcher app called Stargate.

The original Wall Display, X2, X1i and X2i, and XL are not one interchangeable hardware class: they use MT6580, SC7731E, RK3326-S and RK3566 respectively. The shared OTA channels describe package compatibility, not a shared SoC. The legacy image targets a `userdebug` base build, so `adb root` may be possible there _if_ an adb connection can be established, but no user-facing route has been verified. The modern image carries no OTA metadata fingerprint and shows no build type, so the same cannot be claimed for it. See [Access model](#access-model).

Shelly documents temperature and humidity sensing on the original and X2, and ambient light sensing on the original, X2, X1i, X2i and XL. The X2, X1i and X2i have documented proximity sensing; the XL has a motion sensor. Their exact components and Android access paths have not been established. Relay count depends on the model and base, and no app-accessible standard Android relay interface has been established.

## Home Assistant dashboards on the vendor firmware

### Two modes (firmware 2.7.0 and later)

**Built-in WebView browser** (all models): Settings, _Home Assistant_ (Settings, Network, Home Assistant on older firmware) opens a WebView at a configured Home Assistant URL. From 2.7.0 it is fully supported again and includes a _Clear WebView cache_ option.

**An app from the built-in AppStore** (modern AppStore devices only: Blake, Jenna, Cally, Maverick, Dayna). Apps installed this way run in the system WebView, and have rendered correctly where the built-in browser had problems.

### Built-in browser by firmware

| Firmware          | Status                                                        |
| ----------------- | ------------------------------------------------------------- |
| before 2.3.0      | Feature does not exist                                        |
| 2.3.0 pre-release | Introduced under Settings, Network, Home Assistant            |
| 2.6.0             | **Deprecated** on AppStore devices in favour of AppStore apps |
| 2.7.0             | **Supported again**, alongside AppStore apps                  |

### Known compatibility issues

The built-in browser on the Wall Display XL had rendering and layout problems with Home Assistant frontend 2025.12 and a 2026.1 pre-release (tracked in [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755) and `#28746`; core compatibility in [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665)). An app using the system WebView on the same device rendered correctly, which shows the issue was specific to the built-in browser's WebView rather than the hardware.

### WebView

**Original Wall Display (`SAWD-0A1XX10EU1`, Android 7):** the stock system WebView is not included in the standard OTA package. Shelly publishes a separate update ZIP that installs `com.google.android.webview` **119.0.6045.194**. No equivalent package has been established for the other models.

**WallDisplayV2 track (arm64, Android 11):** the standard OTA does not include a WebView package, and its stock WebView version has not been established from the available firmware.

See [Updating the system WebView](/hardware/guides/update-the-webview/).

## Access model

:::caution
**There is no user-facing adb or root access on Shelly Wall Display devices.** Shelly does not expose Developer options, `adb` or `su` to users. This is the main constraint on running the panel app on them.
:::

**A caveat worth probing, but only on legacy hardware.** The legacy OTA declares its target build in `META-INF/com/android/metadata`, and at firmware 2.7.3 that is still `alps/full_k400_mt6580_32_n/k400_mt6580_32_n:7.0/NRD90M/vXD100008:userdebug/test-keys`. On a `userdebug` build `adb root` _succeeds_, so **if** an adb connection can be established, root and the helper daemon become available. That evidence has two limits: the fingerprint describes the device's **base OS image**, whose timestamp is 2022-11-14 and which the app-only OTA does not change, and no adb route has been verified on a unit.

**It does not extend to the modern track.** The WallDisplayV2 package declares no build type. It has no `META-INF/com/android/metadata` fingerprint, and none of the markers `userdebug`, `test-keys`, `release-keys` or `ro.build.fingerprint` appears in any entry outside the bundled APKs (checked at 2.7.3; the APK payloads themselves were not searched). Its updater script reads `ro.build.product` only to log the device, and reads `ro.build.version.incremental` into `HW_VERSION`, which gates one conditional step: `Camera2.apk` is installed only when that value starts with `vBlake` and no camera package is already present. Neither value is asserted, so one ZIP installs on every modern model, and the **retail modern OTA** shows no build type either way. Shelly's own [security posture note](https://github.com/ShellyGroup/Wall-Display-Changelog/blob/main/SECURITY_POSTURE.md), published in the same repository as the official changelog and scoped to current-generation hardware, states that _"production devices ship with the Android `user` build type, on which ADB and developer/debug facilities are disabled by default"_.

One qualification keeps the scope exact: an archived **partition** image, not part of either retail OTA track, identifies itself as Android 11 `userdebug`. Its SKU-to-codename filing is unreliable and its display platform contradicts the current retail specification, so it is evidence about that image, not about what modern retail units run. Treat modern hardware as closed unless a live unit shows otherwise.

**What the closed posture means for the panel app:**

- Without an adb foothold, the helper daemon (`hapaneld-helper`) cannot be installed, because there is no privileged path to `/system`.
- Actions that need `su` (true screen-off, brightness sysfs, CPU governor, screenshot, sensor reads) are then unavailable; the profiles declare `platform.app_can_su: false`.
- The modern built-in AppStore shows that Shelly can distribute approved applications, but the panel app is not one of them. No general user-facing adb or sideload route has been verified, and legacy devices have no confirmed installation path.
- The Stargate launcher is provisioned as **Device Owner** _and_ is the **home launcher**, so even after a sideload, setting another app as the default home triggers the launcher chooser, and Stargate cannot be uninstalled without root.

## Built-in sensors and relay

Sensor and relay details vary by model. From firmware and product pages:

| Component                | Notes                                                                                                                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Temperature and humidity | Documented on the original and X2. The X1i, X2i and XL have no built-in temperature or humidity sensor. Android API visibility is unverified.                                                   |
| Ambient light            | Documented on the original, X2, X1i, X2i and XL; Android `SensorManager` visibility is unverified on hardware.                                                                                  |
| Motion and proximity     | Proximity is documented on the X2, X1i and X2i; the XL has an official motion sensor. Exact technology and Android API visibility remain unverified.                                            |
| Relay                    | One output on the original, X2 and XL. The X1i and X2i ship with a one-output base and support a separately sold two-output base. No app-accessible standard control path has been established. |

Handle relay entities through Home Assistant's Shelly integration rather than assuming the panel app can control them directly. Whether ordinary Android apps can see the sensors remains unverified.

## Firmware OTA mechanism

### What the firmware is

Wall Display firmware is an **Android APK** (the Stargate launcher app) packaged as a signed Android OTA ZIP. It is nothing like Shelly Gen1 firmware (ESP8266 `.zip`) or Gen2 switch firmware (EFR32 `.gbl`): it is an Android application update applied by Shelly's in-app OTA downloader, not a partition-level flash.

### OTA API

Wall Display devices use the **Shelly Gen2 RPC API** for update management:

```
Shelly.CheckForUpdate  →  { "stable": {"version": "2.7.1", "build_id": "..."}, ... }
Shelly.Update { "stage": "stable" }    // pull from the update manifest
Shelly.Update { "url": "..." }         // install from a custom URL
```

An hourly check (from 2.6.0) and a startup check run automatically. From 2.7.0 an OTA sanity check verifies that the downloaded update is built for the correct hardware before applying it.

### Update manifest endpoints (verified)

There are **two firmware tracks**, divided by package ABI rather than by one uniform hardware generation.

#### Track 1: WallDisplay (armeabi-v7a, original and X2)

```
GET https://updates.shelly.cloud/update/WallDisplay
```

Covers SAWD-0A1XX10EU1 (Stargate) and SAWD-2A1XX10EU1 (Pegasus). The OTA updater script asserts that `ro.product.device` is `k400_mt6580_32_n` (Stargate) or `e500_7731e_32u_o` (Pegasus) before applying.

Example response, captured at 2.7.1: `stable.version` `2.7.1`, `build_id` `20260609-205046/2.7.1-857d7175`, and a CDN URL that is a blob named by its SHA-256 (see the note below). For what is current, read the index rather than this example.

#### Track 2: WallDisplayV2 (arm64-v8a, Android 11 models)

```
GET https://updates.shelly.cloud/update/WallDisplayV2
```

Covers Blake, Jenna, Cally, Maverick and Dayna. The OTA updater script reads `ro.build.product` for logging only, with no per-product assertion, so one ZIP installs on all modern models.

The response has the same version and build ID as Track 1 (`2.7.1` in the example above), compiled for arm64-v8a. Both tracks share version numbers and build IDs: they are compiled together from the same codebase for different ABIs.

:::note
**The CDN URL is content-addressed**: a SHA-256 filename with no version in the path. It rotates with every release and cannot be inferred for older versions, and once a newer release ships the previous URL returns 404. Archival to the Wayback Machine is therefore **attempted** for each release as it is discovered, and is **confirmed** only once a capture timestamp is written beside that release's CDN URL in [`tools/firmware-index/fw-shelly-walldisplay.dat`](https://github.com/maxlyth/ha-paneld/blob/main/tools/firmware-index/fw-shelly-walldisplay.dat). An empty timestamp means archival is pending or has not succeeded; it does not mean the files are safe. Read which releases are confirmed from the index itself. A release that is never captured while it is current is unrecoverable.
:::

#### Static legacy CDN (SAWD-0A1XX10EU1 only)

```
https://repo.shelly.cloud/firmware/SAWD-0A1XX10EU1/stable/SAWD-0A1XX10EU1.zip
https://repo.shelly.cloud/firmware/SAWD-0A1XX10EU1/stable/SAWD-0A1XX10EU1-WebViewUpdate.zip
```

Frozen at version 1.2.1 (2023-08-15). The WebView update ZIP (107.5 MB) contains the system WebView APK for the legacy Android 7 device. The directory listing returns 403.

### OTA file format

Verified from both tracks. Every OTA ZIP contains:

- `META-INF/com/google/android/updater-script`, a custom shell-script OTA applier (not Edify)
- `manifest.json`: `{"name":"WallDisplay[V2]","version":"X.Y.Z","build_id":"...","build_timestamp":"..."}`
- `system/priv-app/Stargate/Stargate.apk`, the Shelly launcher (31 MB for arm64, about 10 MB for armeabi-v7a)
- `META-INF/MANIFEST.MF`, `CERT.SF` and `CERT.RSA`, signed with SignApk

Legacy additions: `scatter.txt` (the MediaTek MT6580 partition layout) and `META-INF/com/android/metadata` (build fingerprint `alps/full_k400_mt6580_32_n/...`, Android 7.0); the updater script asserts the product device before proceeding.

Modern additions: `device_owner_2.xml`, `device_admins.xml` and `tzdata/` updates; no `scatter.txt`, because it is not a partition-level flash.

The Stargate APK's native library path confirms the ABI: `lib/armeabi-v7a/libstargate_input.so` (legacy) and `lib/arm64-v8a/libstargate_input.so` (modern).

### Known firmware files

| File                                       | Track                      | Version               | ABI         | Size     |
| ------------------------------------------ | -------------------------- | --------------------- | ----------- | -------- |
| `WallDisplay-2.7.1-stable.bin`             | `WallDisplay`              | 2.7.1                 | armeabi-v7a | 28.6 MB  |
| `WallDisplayV2-2.7.1-stable.bin`           | `WallDisplayV2`            | 2.7.1                 | arm64-v8a   | 38 MB    |
| `SAWD-0A1XX10EU1-stable-firmware.zip`      | repo.shelly.cloud (static) | 1.2.1 (2023-08-15)    | armeabi-v7a | 12.5 MB  |
| `SAWD-0A1XX10EU1-stable-WebViewUpdate.zip` | repo.shelly.cloud (static) | WebView for Android 7 | armeabi-v7a | 107.5 MB |

## Security

Firmware 2.6.0 disclosed that RPC over BLE was open to any BLE connection without authentication (reported by [Pen Test Partners](https://www.pentestpartners.com/)). It was fixed in stages:

- **2.6.0:** a BLE connection confirmation dialog, which the user must acknowledge before an RPC session opens.
- **2.7.0:** the GATT server is non-connectable when _Enable Bluetooth RPC_ is off, and BLE scan matching is stricter to reduce unintended connections.

## Firmware versions that affect third-party apps

Stable track, most recent first. The full product changelog is at [ShellyGroup/Wall-Display-Changelog](https://github.com/ShellyGroup/Wall-Display-Changelog), which covers 2.4.0 and later; earlier releases are on `community.shelly.cloud`, which needs a login.

| Version | Date          | Relevant change                                                                                                                                      |
| ------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.7.3   | 2026-07-29    | Latest analysed release; the legacy OTA still declares the `userdebug` base build                                                                    |
| 2.7.2   | 2026-07-16    | Third-party apps are uninstalled on factory reset                                                                                                    |
| 2.7.0   | 2026-06-03    | Built-in Home Assistant browser supported again, with a cache clear option; OTA hardware sanity check; GATT non-connectable when RPC over BLE is off |
| 2.6.0   | 2026-05-12    | AppStore (modern models only); hourly OTA check; BLE authentication dialog; built-in Home Assistant browser deprecated on AppStore models            |
| 2.5.6   | 2026-02-04    | WebView paused in the background on heavy Home Assistant dashboards to avoid crashes, which also reloads WebRTC streams                              |
| 2.5.3   | about 2025-10 | WebView version check on the old X1                                                                                                                  |
| 2.5.1   | 2025-10-27    | Android Accessibility settings exposed                                                                                                               |
| 2.3.4   | 2025-02-23    | Emergency fix for an OTA update channel failure that left devices stuck on old firmware                                                              |
| 1.2.1   | 2023-08-15    | Oldest confirmed downloadable version (static CDN)                                                                                                   |

## Device profiles: known and unknown

Two bundled profiles follow the two OTA tracks: [`shelly-wall-display.yaml`](https://github.com/maxlyth/ha-paneld/blob/main/app/src/main/assets/device-profiles/shelly-wall-display.yaml) and [`shelly-wall-display-v2.yaml`](https://github.com/maxlyth/ha-paneld/blob/main/app/src/main/assets/device-profiles/shelly-wall-display-v2.yaml). The current product specifications show that an OTA track is too broad to represent model-specific SoC, display and relay facts, so treat those profile fields as preliminary until the profiles are split or made deliberately generic.

### Known or derivable from firmware

| Field                             | `shelly-wall-display` (legacy)                           | `shelly-wall-display-v2` (modern)                                            | Source                                                                                                                        |
| --------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `soc_class`                       | currently MT6580, but the X2 is SC7731E                  | currently PX30/rk3326, but the X1i and X2i are RK3326-S and the XL is RK3566 | official model pages; OTA fingerprints                                                                                        |
| `platform.su_form` / `app_can_su` | `none` / `false`                                         | `none` / `false`                                                             | no user-exposed root (legacy targets a `userdebug` base build; modern shows no build type; see [Access model](#access-model)) |
| `hardware.led.mechanism`          | `none`                                                   | `none`                                                                       | current profile declaration; not verified on every model                                                                      |
| `hardware.screen_off`             | `brightness-zero`                                        | `brightness-zero`                                                            | no privileged screen-off path                                                                                                 |
| `hardware.relay_base`             | absent                                                   | absent                                                                       | relays are operated through the Home Assistant Shelly integration; no app-accessible standard path established                |
| `hardware.zigbee_gateway_dir`     | absent                                                   | absent                                                                       | no Zigbee or Thread radio                                                                                                     |
| `sensors.proximity_technology`    | unverified per model                                     | unverified per model                                                         | needs live hardware evidence                                                                                                  |
| `sensors.light_technology`        | `Ambient light`                                          | `Ambient light`                                                              | official model pages; Android API exposure unverified                                                                         |
| App package                       | `cloud.shelly.stargate` (Device Owner and home launcher) | same                                                                         | Stargate APK manifest and `device_owner_2.xml`                                                                                |

### Unknown until a live unit is examined

- The exact runtime identifiers needed to tell the X2, X1i, X2i and XL apart without false profile matches.
- Whether Android `SensorManager` exposes each documented ambient light, motion or proximity sensor.
- `platform.has_recents` per model, since the Stargate home image may suppress the overview screen.
- Default display density and an appropriate `provisioning.display.density` per model.
- Whether an adb foothold and `adb root` are reachable on the legacy `userdebug` base build, which would allow the helper daemon. For modern hardware the prior question is which build type it actually runs, which the OTA does not reveal.
- Whether the panel app's HTTP service on port 8888 is reachable from the LAN, which depends on the device's firewall.

## Sources

- [ShellyGroup/Wall-Display-Changelog](https://github.com/ShellyGroup/Wall-Display-Changelog): the official firmware changelog.
- [SECURITY_POSTURE.md](https://github.com/ShellyGroup/Wall-Display-Changelog/blob/main/SECURITY_POSTURE.md): Shelly's own statement on build type, adb, sideloading and update signing for current-generation hardware.
- [Shelly Wall Display knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display): the original 4 in model.
- [Shelly Wall Display X2 knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2)
- [Shelly Wall Display X1i knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x1i)
- [Shelly Wall Display X2i knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2i)
- [Shelly Wall Display XL knowledge base](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-xl)
- [Shelly Gen2 RPC API](https://shelly-api-docs.shelly.cloud/gen2/ComponentsAndServices/Shelly/): `Shelly.CheckForUpdate` and `Shelly.Update`.
- [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755): the built-in browser rendering issue on the XL.
- [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665): Home Assistant integration compatibility.
- [Pen Test Partners](https://www.pentestpartners.com/): the BLE RPC authentication issue, fixed in 2.6.0 and 2.7.0.
