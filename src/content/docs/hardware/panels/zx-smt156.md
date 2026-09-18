---
title: ZX-SMT156
description: Hardware facts for the ZX-SMT156, a 15.6 inch Rockchip rk3566 wall panel identified as rk3566_t, with an app-direct RGB LED and climate inputs.
vendor: OEM (ZX)
model: ZX-SMT156 / RK3566_T
soc: Rockchip RK3566
android: '13'
screen: 15.6 in, 1920 × 1080
support: Community-tested
root: No app su reported; other routes untested
webview: Google WebView 149, current
released: '2025 (est., first listed)'
photos:
  - src: 'asset:hardware-zx-smt156-front.jpg'
    alt: Generic 15.6 inch SMT156 wall panel, front, as sold by ELC OEM
  - src: 'asset:hardware-zx-smt156-angled.jpg'
    alt: Generic 15.6 inch SMT156 wall panel, angled, showing the app-direct RGB LED bezel lit green
  - src: 'asset:hardware-zx-smt156-profile.jpg'
    alt: Generic 15.6 inch SMT156 wall panel, side profile, showing the mounting depth
photoCredit: 'Photo: ELC'
sidebar:
  label: ZX-SMT156
---

:::note
This is a preliminary profile based on [a diagnostic report on GitHub](https://github.com/panel-assistant/android/issues/24). It covers a genuine OEM, generic-market SMT156 wall panel identified through the owner's ELC and OEM product evidence, but it has not been validated on hardware available for local testing. Climate support is optional, and USB or vendor root and persistent unlock routes remain untested.
:::

This 15.6 in Android wall panel identifies its firmware as `ZX-SMT156` and its exact model and device as `rk3566_t`. The `_t` device identifier is the reliable discriminator: generic `rk3566` matching would collide with the unrelated TPA10 and S9E.

## Also sold as

ZX-SMT156, SMT156, RK3566_T, rk3566_t, generic 15.6 inch SMT156 wall panel (ELC OEM). Firmware `ZX-SMT156-R128V1.2B-15.6-GG-J4.79U-20250926`.

|                     |                                                                                                                                                                                                                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Profile fingerprint | model and device `rk3566_t`; reported firmware `ZX-SMT156-R128V1.2B-15.6-GG-J4.79U-20250926`                                                                                                                                                                                                                                                          |
| SoC                 | Rockchip rk3566, four cores, `rk30board` hardware                                                                                                                                                                                                                                                                                                     |
| Android             | 13 (API 33)                                                                                                                                                                                                                                                                                                                                           |
| ABI                 | arm64-v8a, with 32-bit compatibility                                                                                                                                                                                                                                                                                                                  |
| Display             | 1920×1080 at 160 dpi, 15.6 in                                                                                                                                                                                                                                                                                                                         |
| RAM and storage     | 4 GB / 32 GB                                                                                                                                                                                                                                                                                                                                          |
| Root                | no app-accessible `su` on the reported installation; USB `adb root`, vendor engineering mode and persistent unlock routes were not tested                                                                                                                                                                                                             |
| RGB LED             | app-direct `/dev/ledjni`, confirmed working                                                                                                                                                                                                                                                                                                           |
| Sensors             | binary proximity and ambient light confirmed; GXHT30 climate inputs identified through reporter-supplied `adb shell` evidence                                                                                                                                                                                                                         |
| System WebView      | Google WebView 149.0.7827.164 reported; current enough for the Home Assistant frontend                                                                                                                                                                                                                                                                |
| Relays              | present in the vendor's own MQTT implementation according to the reporter, but no Android or sysfs control path has been identified                                                                                                                                                                                                                   |
| Released            | Not confidently dated; the earliest archived listing found for this OEM product is from January 2025, which confirms it existed by then but not when it first shipped ([earliest archived elclcd.com listing, Wayback Machine, January 2025](http://web.archive.org/web/20250124093315/https://www.elclcd.com/products/15-6-smart-home-panel-smt156)) |

## Panel app support

The bundled [`zx-smt156.yaml`](https://github.com/panel-assistant/android/blob/main/app/src/main/assets/device-profiles/zx-smt156.yaml) profile provides the correct identity and explicitly routes the working `/dev/ledjni` RGB controller. It uses a conservative LED transfer curve until a reporter supplies a measured response. Standard Android brightness, light and proximity sensing, navigation, the Home Assistant entities and the built-in dashboard work without root.

The profile exposes Room temperature and Room humidity as an optional extra, not part of the core support. Reporter evidence shows `sun-ths` temperature in hundredths of a degree Celsius on `ABS_THROTTLE`, and `sun-hum` relative humidity in hundredths of a percent on vendor axis `0x1d`. The panel app prefers its helper when present, and otherwise uses the locally approved Shizuku shell identity that the collector proved can read these nodes. A local temperature calibration offset is available, because the panel's self-heating has not been characterised.

The reported installation had no app-accessible `su`, but USB `adb root`, vendor engineering mode and a persistent unlock route are uncharacterised rather than ruled out. Runtime probes decide which routes exist, and each privileged route is checked when used. Until one is established, true backlight-off, reboot and root-only controls need an installed helper; locally approved Shizuku provides only its documented narrower subset and is not required for ZX-SMT156 support. The profile deliberately declares no relay path, because inventing one from the vendor's MQTT feature list would risk controlling the wrong sysfs device.

## Characterising missing hardware

Diagnostics include a bounded `[hardware]` block with input device names, bound I²C and IIO names, thermal zone types and likely relay-class entries. That report identified the `sun-ths` and `sun-hum` input devices; the relay path remains unknown. The next useful relay evidence is the package name of the vendor's MQTT service and its narrowly scoped traffic while an attended test toggles one relay.

For the `sun-ths` and `sun-hum` input devices, download and run the read-only collector below. Replace `<panel-ip>` with the panel's address, then paste the complete line into the same Git Bash, WSL, macOS Terminal or Linux terminal where `adb` works:

```bash
curl -fsSL https://raw.githubusercontent.com/panel-assistant/android/main/scripts/collect-panel-hardware.sh -o collect-panel-hardware.sh && bash collect-panel-hardware.sh --serial <panel-ip>:5555 --observe climate
```

This only reads the two climate input devices and does not change the panel. The live observation is limited to 10 seconds and 32 events per exact sensor name. Review the terminal output before sharing it; if the command reports an error, share that error instead. The 2026-07-17 `adb shell` report established the input names, axes, and values consistent with hundredths scaling. A reporter comparison of the panel app's readings against the vendor display or an external thermometer and hygrometer is still needed before calling them hardware-validated. Being readable from an adb shell does not give an ordinary app access; the panel app uses either the installed allowlisted helper or the same shell identity after local Shizuku approval.

No public firmware source has been found for this model. Preserve a firmware and recovery backup before modifying the vendor installation, and share only hardware metadata, not firmware files, in a public issue.
