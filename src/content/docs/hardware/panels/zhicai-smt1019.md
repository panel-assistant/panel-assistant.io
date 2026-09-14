---
title: ZHICAI SMT1019
description: Hardware facts for the ZHICAI SMT1019, a 10.1 inch Rockchip rk3576 wall tablet whose stock and supplier firmware builds differ on root.
vendor: ZHICAI
model: SMT1019
soc: Rockchip RK3576
android: '14'
screen: 10.1 in, 1280 × 800
support: Community-tested
root: None on stock; supplier userdebug build rooted
webview: Google Play, update from the Play Store
sidebar:
  label: SMT1019
---

:::note
The stock firmware facts come from a reporter's `/diag` dump and the retail listing ([the SMT1019 report on GitHub](https://github.com/maxlyth/ha-paneld/issues/8)). The supplier firmware facts come from a second reporter running that build, with vendor documentation they published in [a follow-up report](https://github.com/maxlyth/ha-paneld/issues/106). Reporter evidence confirms the supplier build's root route, boot-persistent helper and raw climate axes. The bundled profile has not been validated end to end, and climate accuracy and the VI530x proximity route still need hardware tests. No unit is available for local testing.
:::

A 10.1 in rk3576 wall tablet from manufacturer **ZHICAI TECHNOLOGY**, built on an Electron `WF2489T` board, a sibling of the rk3576 [WF1589T](/hardware/panels/electron-wf1589t/).

## Also sold as

Generic SMT1019, RK3576_64GB, ZHICAI TECHNOLOGY SMT1019, ZX-SMT1019, Apolosign WF2489T, Electron WF2489T, Amazon ASIN B0GSWXPB9K. Firmware builds `ZX-SMT1019-R157-V1.0A` and `ZX-SMT1019-R157-V2.0`.

## Root access by firmware build

**There are two firmware builds in the wild, and they differ in the one way that matters most.** The retail unit ships a locked-down production build with no root. The supplier will also provide a `userdebug` build, and a reporter reflashed to it. Everything that needs root depends on which build a panel runs, so check before assuming.

|                 | Stock (production)                                                                                                  | Supplier `userdebug`                                                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build           | `ZX-SMT1019-R157-V1.0A`                                                                                             | `ZX-SMT1019-R157-V2.0-…` (`Apolosign/WF2489T/WF2489T:14/…:userdebug/release-keys`)                                                                                                                                        |
| Root            | **None**; `su` absent                                                                                               | **Yes**. `adb shell id` is already `uid=0`, and the app's `su 0 sh -c "<cmd>"` form is hardware-confirmed with quoting intact. `su -c` answers `su: invalid uid/gid '-c'`, which is a dialect mismatch, _not_ absent root |
| SELinux         | **Enforcing**, which confines the LED ioctl to privileged domains                                                   | Permissive                                                                                                                                                                                                                |
| Verified boot   | locked                                                                                                              | `verified=orange flash=unlocked`; `/system` was observed read-only, with writable overlay and dm-verity state not yet distinguished                                                                                       |
| RGB LED         | `/dev/ledjni` opens `O_RDONLY` but the **ioctl is denied** to sandboxed apps (`EACCES`, `rc=-13`); no app-side path | Driven by the root helper; reported working                                                                                                                                                                               |
| Full screen-off | Brightness zero without a helper                                                                                    | The profile routes `bl_power` through the authenticated helper; no SMT1019 end-to-end result has been reported                                                                                                            |

Shared by both: Rockchip **rk3576** (`ro.product.device=WF2489T`), a **1280×800** 10.1 in display, about 4 GB RAM and 64 GB storage, Android **14**, `arm64-v8a`, **with** Google Play services.

### Installing on the `userdebug` build

`/system` reads as read-only even though the panel is rooted, either because a writable overlay is not mounted or because dm-verity is on, so the helper has nowhere boot-persistent to live and provisioning stops. Try the remount without a reboot first. Only the fallback reboots the panel, and a reboot needs you in front of it, because a PIN-protected panel cannot start its apps again until the PIN is entered:

```bash
# Try this first — no reboot, and on a panel that already carries a scratch overlay it is the whole fix:
adb -s <panel-ip>:5555 root && adb -s <panel-ip>:5555 remount

# Only if that is refused. This REBOOTS the panel, so be in front of it and unlock any PIN afterwards:
adb -s <panel-ip>:5555 disable-verity && adb -s <panel-ip>:5555 reboot
adb -s <panel-ip>:5555 root && adb -s <panel-ip>:5555 remount
```

Provisioning then completes and the helper survives reboots (confirmed by the reporter).

## Sensors and I/O the board exposes

Temperature, humidity and proximity are enabled below; ambient light and the two GPIO lines are not yet wired. The vendor's own documentation states that **temperature and humidity are read from `getevent`**, as plain evdev input devices rather than an I²C driver, and that the event _index_ differs between variants with and without a light sensor, so match on the device **name**, not the number. Hardware evidence confirms the raw climate encoding is in hundredths; physical accuracy still needs comparison with the vendor display or a reference sensor.

| Function                   | Where it appears                                                                                                                                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Temperature and humidity   | evdev `sun-ths` and `sun-hum` (I²C `0-0044:gxht30`). **Enabled:** the raw hundredths encoding is confirmed, but physical accuracy is not                                                                                                  |
| Proximity (time of flight) | `/dev/vi530x` (I²C `4-006c`). **Experimental:** the driver axes are confirmed, but the panel app's complete startup and read path has not run on hardware. Distance is `ABS_HAT1X` in **millimetres** and reading validity is `ABS_WHEEL` |
| Ambient light              | evdev `lightsensor-level` (I²C `4-0048:ls_stk3x1x`)                                                                                                                                                                                       |
| RGB LED                    | `/dev/ledjni`                                                                                                                                                                                                                             |
| Two GPIO lines             | `/dev/gpio_control`                                                                                                                                                                                                                       |

## Panel app support

The bundled [`smt1019.yaml`](https://github.com/maxlyth/ha-paneld/blob/main/app/src/main/assets/device-profiles/smt1019.yaml) profile gives its tightly scoped `wf2489` device-substring match priority over the WF1589T profile's broader `rk3576_u` model match, so a `WF2489T` unit does not collide with the other rk3576 panel. It declares:

- **`hardware.led.mechanism: rk3576-ioctl-daemon`.** The compiled ioctl driver is routed only through the authenticated root helper. Its live check keeps the LED unavailable and unpublished when that helper cannot drive the node, as on the reported installation without `su`.
- **`platform.su_form: none`.** There is no app-accessible `su` on the stock firmware, so root-gated features (evdev buttons, CPU governors, the `bl_power` screen-off path) are unavailable there.
- **`hardware.screen_off: daemon-blpower`.** The profile uses the authenticated helper to power the backlight down through `bl_power`. This is a full screen-off and lets the renderer stop drawing behind it. `ScreenController` falls through daemon, then direct root, then brightness zero at runtime. Stock firmware with neither the helper nor direct root uses brightness zero; a rooted build without the helper can use direct root. Declaring the capable route costs the stock configuration one refused socket connection per screen-off. No SMT1019 end-to-end result for this route has been reported.

Standard Android capabilities such as brightness, navigation, text-to-speech and the Home Assistant entities work on either build. The stock installation without `su` cannot drive the LED or root-only hardware. The supplier build can use the authenticated helper, and its LED control has been reported working. No hardware buttons have been identified.

**Proximity is experimental.** The VI530x driver reports nothing until userspace starts it, so the helper follows the vendor's power-on, initialise, period and start sequence before reading a measurement. Reporter evidence confirms that `ABS_HAT1X` is distance in millimetres and `ABS_WHEEL` reports whether the reading is valid, so a raw value of 1896 means about 1.9 m. The panel app feeds the unscaled distance into the same adaptive learning it uses for other proximity sources, so it does not depend on a guessed threshold or polarity. The helper's complete ioctl startup and read path has not yet run on hardware; please report the result on [the follow-up report](https://github.com/maxlyth/ha-paneld/issues/106).

**Room temperature and humidity are enabled.** A verified root helper or an approved Shizuku shell reads the GXHT30's `sun-ths` and `sun-hum` input devices. The Room entities are enabled by default and publish no value when neither route is available. Reporter evidence (2026-08-14) confirms the raw encoding: `sun-ths` uses `ABS_THROTTLE` with bounds of -4000 to 12500, while `sun-hum` uses axis `0x1d` with bounds of 0 to 10000. A live panel reported 2479 and 5704. These values are consistent with hundredths of a degree Celsius and hundredths of a percent, but they do **not** establish physical accuracy. Compare them with the vendor display or a reference sensor before relying on them. `sensors.room_temp_offset_c` can correct a constant temperature bias from the panel's own warmth; it cannot correct scaling errors or humidity calibration.

:::caution
**The profile's root hints describe the stock build, but they do not veto the bundled helper.** `su_form: none` and `app_can_su: false` are correct for the retail firmware. When the bundled helper is needed, the panel app checks for live root instead of treating those hints as proof. The supplier build's `su 0 sh -c "<cmd>"` form reached `uid=0` twice with quoting intact, so the app can install its matching helper there without writing `/system`. A stock panel simply fails that live check and stays unchanged. The standalone boot-persistent helper route is separate and still needs the remount procedure above.
:::

## WebView

Both builds carry **Google Play services**, and both provide `com.google.android.webview` **124.0.6367.179**, established by unpacking each ROM rather than inferred. The stock production build (`ZX-SMT1019-R157-V1.0A`, 2026-02-05) is a genuine `user` build; the supplier build (`…-V2.0`, 2026-07-30) is `userdebug`. A panel on the supplier build was separately observed running the same version.

Because Play is present, **the supported fix is to update _Android System WebView_ from the Play Store**. This panel is in the WF1589T's class, not the sideload class of the NSPanel Pro and TPA10. Do not sideload a `com.android.webview` build here: `framework-res.apk` lists only `com.android.webview` as `availableByDefault` while the installed provider is the Google package, so a product overlay supplies the effective provider list and a sideloaded provider may simply not be selected.

Chrome 124 dates from April 2024 and runs a current Home Assistant frontend, so this is a routine update rather than the blank-dashboard emergency other panels face.
