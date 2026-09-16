---
title: Tuya TPA10
description: Hardware facts for the Tuya TPA10, a 10.1 inch Rockchip rk3566 panel with an RGB LED, five buttons, a camera and temperature, humidity and proximity sensors.
vendor: Tuya
model: TPA10
soc: Rockchip RK3566
android: '11'
screen: 10.1 in, 1920 × 1200
support: Full
root: su present; helper for LED, climate, 5th button
webview: Chrome 83; root swap to LineageOS 150
released: '2023-08 (est.)'
photos:
  - src: 'asset:hardware-tuya-tpa10-front.jpg'
    alt: Tuya TPA10, front, with its side button strip
  - src: 'asset:hardware-tuya-tpa10-front-flat.jpg'
    alt: Tuya TPA10, flat front view, showing the side button strip and bezel edge
photoCredit: 'Photo: Tuya'
sidebar:
  label: TPA10
---

A roomy **10.1 in 1920×1200** rk3566 panel with a single front RGB LED, a monochrome button backlight, a rich sensor set (time-of-flight proximity, temperature and humidity, ambient light), a camera and five physical buttons. It has no Zigbee, NFC or IR. Reverse-engineered on a live unit (Android 11, rooted, `su` present).

## Also sold as

Tuya TPA10, TPA10, TPA10-M2 (M2A, M2E, M2U, M2X), TPA10 Control Panel MAX, Control Panel MAX, Panel MAX, rk3566 Tuya panel, SmartOS Xinch (vendor packages `com.smartos.xinch.setting`, `com.smartos.xinch.hardware`, `com.smartos.xinch.platform.ethernet`), `com.tuya.devicetest`.

:::tip
The most-needed facts: adb is **password-protected**, so use the USB diagnostics-app backdoor. The LED and the root-only sensors need the **`hapaneld-helper` root helper daemon**. The front LED's `custom_animation` write can **reboot the panel** (see the warning below). Update the **WebView first**; see [WebView: update this first](#webview-update-this-first).
:::

|          |                                                                                                                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | Rockchip **rk3566**                                                                                                                                                                                |
| Display  | **1920×1200** (16:10 landscape), about 10.1 in, **about 226 physical ppi**, 56 Hz. Android factory base logical density **240 dpi** (commonly overridden for dashboard sizing; 212 is recommended) |
| Android  | 11 (API 30)                                                                                                                                                                                        |
| ABI      | armeabi-v7a (32-bit userspace)                                                                                                                                                                     |
| Radios   | Wi-Fi, Bluetooth and BLE, plus a vendor `com.smartos.xinch.platform.ethernet` feature (wired, PoE). **No Zigbee, NFC, IR or cellular.**                                                            |
| Root     | `su` available; the LED and sysfs sensors are `system:system`, so a **root helper daemon is required** (see below).                                                                                |
| Released | About August 2023 (est.); FCC ID 2A789-TPA10, listed as "Control Panel MAX," was granted around 22 August 2023                                                                                     |

:::tip
Changing firmware on a button-less panel? Read [Firmware backup and restore](/hardware/guides/firmware-backup-and-restore/) first. The TPA10 (rk3566, Android 11, 7.28 GB eMMC `mmcblk2`) has a verified software-entered Loader route through `adb reboot loader` and `rkdeveloptool`. The recessed [pin-hole button](#buttons) is not a Linux input, and its factory-reset or Maskrom behaviour has not been safely confirmed, so do not rely on it as a recovery route.
:::

## Gaining adb and root access

The TPA10 ships with adb **password-protected** and network adb off. The reliable route to first access is the USB diagnostics-app backdoor, with no password arithmetic. `su` is already present, so once adb is in you have root. Distilled from [seaky/nspanel_pro_tools_apk issue 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123).

**1. Enable Developer options.** Settings, _About_, tap the build or version number seven times.

**2. First access through the USB diagnostics-app backdoor (recommended).** Developer options exposes a Tuya engineering **diagnostics app** with a Chinese-only UI. While that app is open, adb over the **USB** port is allowed _without_ the password, and the session is already rooted. Connect USB and run:

```bash
adb devices          # the panel appears
adb shell su 0 id    # uid=0 → root confirmed
```

The TPA10's adb root is more dependable over the USB port than over the network.

**3. Make adb persist (root, password-free, the reliable route).** With the diagnostics app in the foreground you have a rooted adb session (`su` is present, and `adb root` also works because it is a `userdebug` build). Use it to persist adb so you never need the test app or a password again. This survives the diagnostics app closing **and** a full reboot, verified on a live unit. Push and run as root:

```bash
# persist-adb.sh — run via the diagnostics-app backdoor:
#   adb push persist-adb.sh /data/local/tmp/ && adb shell su 0 sh /data/local/tmp/persist-adb.sh
settings put global adb_enabled 1                   # USB debugging, persisted in /data
settings put global development_settings_enabled 1  # keep Developer options visible
setprop persist.adb.tcp.port 5555                   # network adb on :5555 — persist.* survives reboot

# Pre-authorise each controlling machine so NO on-screen "Allow USB debugging" is needed after reboot.
# Append the contents of every workstation's ~/.android/adbkey.pub (one key per line):
mkdir -p /data/misc/adb
cat >> /data/misc/adb/adb_keys <<'KEYS'
PASTE-EACH-adbkey.pub-LINE-HERE
KEYS
chmod 640 /data/misc/adb/adb_keys
chown system:shell /data/misc/adb/adb_keys 2>/dev/null
restorecon /data/misc/adb/adb_keys 2>/dev/null

setprop ctl.restart adbd                            # apply now (and it auto-starts every boot)
echo "adb persisted: adb_enabled=$(settings get global adb_enabled) tcp=$(getprop persist.adb.tcp.port)"
```

The panel must be on Wi-Fi for the network route. From then on, `adb connect <panel-ip>:5555` works from any pre-authorised machine, across reboots, with the vendor apps closed. Wiping `/data` or a factory reset clears `adb_keys` and `adb_enabled`, so run the script again afterwards.

:::caution
**The Developer options "Enable ADB" password is not a usable path, so do not try to compute it.** The community recipe in [issue 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123) does not reproduce. Decompiling `checkDevPassword` in `com.smartos.xinch.setting` confirms its _shape_: `base64(takeLast(ro.tuya.uuid,3) + takeLast(deviceId,3))` then `takeLast(6)`, case-insensitive (or `takeLast(ro.tuya.uuid,6)` when `deviceId` is empty). But the `deviceId` it uses could not be matched to any readable identifier: `ro.serialno`, `android_id` and `ro.tuya.key` were all rejected on a live unit. The app's logger is **not** logcat, so the expected value cannot be read on the device either. The worked example in that issue also has a typo (`11a` plus `xia` written as `11xia`; it must be `11axia`). Use the root method above, which makes the password irrelevant.
:::

:::danger
Disable the vendor `com.smartos.xinch.*` packages only as the **very last step**, after confirming adb is solid _and_ you have a replacement for the hardware buttons. Disabling the hardware or settings apps before adb is reliable can lock you out. The panel app's remote navigation actions (Back, Recents) and its button backlight and LED entities replace the vendor app's functions.
:::

:::note
The vendor's on-device apps were _not_ a useful reverse-engineering source. `com.tuya.devicetest` is odexed (no dex in the APK), and `com.smartos.xinch.hardware` bundles the Tuya **AVS (Alexa) SDK** (`libLibSampleApp.so`, 17 MB) plus a key reader (`libjnimain.so`). The authoritative source is the device's own self-documenting sysfs nodes.
:::

## WebView: update this first

The stock WebView is **Chrome 83**, far too old for a current Home Assistant frontend, so the dashboard stays blank or broken until you replace it. The recommended build is **LineageOS System WebView 150** (`armeabi-v7a`), a current, maintained, vanilla Chromium engine. Prefer it over Cromite: Cromite patches Chromium's autoplay content setting to _block_, which stops Home Assistant camera card (WebRTC) streams from starting without a tap, while LineageOS leaves autoplay allowed so camera streams start on their own.

The TPA10 has limited video decoder headroom inside WebView. Several visible 720p WebRTC cards can drop frames or leave one stream waiting for its first frame even though a single stream is healthy. If that happens, use lower-resolution substreams, fewer simultaneous autoplay cards, or snapshots that switch to live video on tap.

Download it from the mirror (stable URL):

```
https://github.com/maxlyth/ha-paneld/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk
```

### Why a plain install does not work

The WebView is packaged as `com.android.webview`, so it must **replace** the system provider, and both obvious routes fail on this Android 11 panel:

- `adb install -r` is rejected with `INSTALL_FAILED_UPDATE_INCOMPATIBLE: signatures do not match`. Android only lets you update `com.android.webview` with an APK signed by the **same key** as the installed one, and each WebView vendor uses a different key. For the same reason, **the panel app's built-in WebView update cannot do this first swap**: it installs through `pm install`, which the panel blocks. The swap below is a **one-time** manual step. Once LineageOS is in place, the panel app can apply later LineageOS updates itself, because they share a signer.
- The ROM's allowlist accepts only `com.android.webview`, not the `com.google.android.webview` variant, so a Google build installs but is never selected.

### Working method with root: replace the file and clear the signature lock

The panel is signature-locked but rootable: the app cannot `su`, but a shell can (`adb shell su root <cmd>`). The method drops the new APK into the _system_ WebView slot and deletes its entry from the package database, so PackageManager registers it **fresh** on reboot, reading the new APK's own signature with no conflict.

```bash
IP=<panel-ip>:5555
adb connect $IP
adb -s $IP shell su root id                           # confirm it prints uid=0(root)

# 1. push the new WebView, and back up the current WebView + package database first:
adb -s $IP push lineageos-webview-150.0.7871.63-arm.apk /data/local/tmp/wv-new.apk
adb -s $IP shell su root sh -c 'cp /product/app/webview/webview.apk /data/local/tmp/webview.bak;
                                cp /data/system/packages.xml /data/local/tmp/packages.xml.bak'

# 2. replace the system WebView APK (remount /product read-write first — verity must already be off;
#    a never-modified panel needs a one-time `adb root && adb disable-verity && adb reboot` beforehand):
adb -s $IP shell su root sh -c 'mount -o rw,remount /product;
    cp /data/local/tmp/wv-new.apk /product/app/webview/webview.apk;
    chmod 644 /product/app/webview/webview.apk; chown root:root /product/app/webview/webview.apk;
    restorecon /product/app/webview/webview.apk'

# 3. remove the single <package name="com.android.webview" …>…</package> element from packages.xml.
#    Do NOT hand-edit it — pull it, let a parser remove exactly that element, then push it back:
adb -s $IP shell su root sh -c 'cp /data/system/packages.xml /data/local/tmp/pkgs.xml; chmod 644 /data/local/tmp/pkgs.xml'
adb -s $IP pull /data/local/tmp/pkgs.xml packages.xml
python3 - <<'PY'
import xml.etree.ElementTree as ET
d = open('packages.xml', encoding='utf-8').read()
m = '<package name="com.android.webview"'
assert d.count(m) == 1, 'expected exactly one com.android.webview package'
s  = d.find(m); ls = d.rfind('\n', 0, s) + 1                      # start of that line
e  = d.find('</package>', s) + len('</package>'); le = d.find('\n', e) + 1  # end of its closing line
new = d[:ls] + d[le:]
ET.fromstring(new)                                                # abort if the result isn't valid XML
open('packages.xml', 'w', encoding='utf-8').write(new)
print('removed com.android.webview; XML still valid')
PY
adb -s $IP push packages.xml /data/local/tmp/pkgs.new
adb -s $IP shell su root sh -c 'cp /data/local/tmp/pkgs.new /data/system/packages.xml;
    chown system:system /data/system/packages.xml; chmod 660 /data/system/packages.xml;
    restorecon /data/system/packages.xml'

# 4. reboot — PackageManager registers the new WebView fresh:
adb -s $IP reboot
```

**If anything goes wrong**, revert with the backups from step 1: copy `/data/local/tmp/webview.bak` back over `/product/app/webview/webview.apk` and `/data/local/tmp/packages.xml.bak` back over `/data/system/packages.xml` (with the same `chown`, `chmod` and `restorecon`), then reboot.

:::danger
**The reported WebView version is wrong after this method, so do not trust it.** `Settings, WebView` and `adb shell dumpsys webviewupdate` still show **`83.0.4103.120`**, because a sideloaded SystemWebView **stamps the OEM stock `versionName` and `versionCode`** to clear the panel's minimum-version gate and get selected. The _actual_ engine is 150. Verify it by:

- **User-Agent:** open any "what's my user agent" page on the panel; the UA contains `Chrome/150.0.7871.63`.
- **The panel app:** the `:8888` status page and `/api/v1/diag` show `engine Chromium 150.0.7871.63`, because they read the UA, not the stamped package version.

A plain adb sideload does **not** work on this signature-locked panel. Cromite 147 remains in the mirror as a fallback, using the same procedure with a different APK.
:::

## LED

### RGB LED: `avsux` driver (root helper daemon)

The front RGB LED is a **single** LED (`avsux_info` reports `led type:[single] nums:[1]`) on the `leds_pwm_avs` platform driver (device `avsux`), exposed at `/sys/class/leds/avs-pwm-led/`.

:::danger
Writing `custom_animation` to `avsux_select` has been observed to **reboot the panel**. Use `avsux_animation` for colour, and treat `avsux_select` and `custom_animation` as read-only unless testing.
:::

There is **no app-accessible `/dev` node** for the LED (compare the [WF1589T](/hardware/panels/electron-wf1589t/)'s `/dev/ledjni`), and the sysfs attributes are `system:system`, so an `untrusted_app` cannot write them. The panel app therefore uses a small **root helper daemon** (`/system/bin/hapaneld-helper`, running as root on a Unix socket); `SocketLedController` is the client. See the [helper documentation](https://github.com/maxlyth/ha-paneld/blob/main/helper/README.md).

#### `avs-pwm-led` sysfs attributes

| Attribute         | Permissions        | Use                                                       |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `brightness`      | `system:system` rw | overall level 0 to 255                                    |
| `avsux_animation` | `system:system` rw | safe colour or animation write                            |
| `avsux_select`    | `system:system` rw | `custom_animation[][0][0]:<dur_ms>:<RRGGBB>[,…≤12 slots]` |
| `avsux_firmware`  | r                  | lists named animations (`bootanime`, `idle`)              |
| `avsux_info`      | r                  | metadata (LED count and type)                             |

### Button backlight

`/sys/class/leds/button-backlight/brightness` is a **monochrome** PWM output, 0 to 255 (standard `leds_pwm` driver, device `pwmleds`). It is `system:system` 0664, so it is driven through the same `hapaneld-helper` daemon.

## Sensors

Proximity is app-direct through `SensorManager`. Temperature, humidity and ambient light are root-only (input subsystem and I²C) and need the helper daemon.

:::tip
The CHT8305 makes this panel a usable **room temperature and humidity sensor** for Home Assistant. The helper daemon reads it with its `CHT8305` verb, an `EVIOCGABS` point read of the driver's `ABS_THROTTLE` input axis that matches the `temperature` and `humidity` input devices by name. The panel app then offers two optional **Room temperature** and **Room humidity** sensors in Home Assistant (Configure, Diagnostics; off by default). An advanced **Room temperature offset** setting, or the profile's `sensors.room_temp_offset_c`, corrects for the panel's own warmth.
:::

The TPA10's time-of-flight sensor means proximity is genuinely distance-based, but the Android HAL quantises it. The panel app learns the live sensor's endpoints and direction, then reports the same normalised proximity scale used on every supported panel rather than relying on a fixed device-specific cutoff.

### Sensor chips and access paths

| Sensor                     | Chip                                                                          | Access                                                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Proximity (time of flight) | Vishay **VI5300** (i2c-3 `0x6c`, `proximity_vi5300`, 30 ms poll)              | Android `SensorManager` `TYPE_PROXIMITY`, no root. The raw distance in mm on the driver's I²C node (`…/i2c-3/3-006c`) needs root. |
| Temperature and humidity   | **CHT8305** (`temperature_cht8305` at 3-0040, `humidity_cht8305` at 3-0040-1) | **Not** in `SensorManager`; reports through the **input subsystem** on I²C, root only.                                            |
| Ambient light              | **CG5256** (`light_cg5256`)                                                   | Not in `SensorManager` (root).                                                                                                    |

## Buttons

The TPA10 has **three classes** of physical button, confirmed on the device with `getevent`:

- **The four side buttons:** `adc-keys`, standard KeyEvents mapped to `F1` to `F4`, captured by the panel app's accessibility key filter with no special path.
- **The fifth (orange) button:** an `EV_SW` _switch_, not a key, read through the root helper daemon's evdev reader and sent to Home Assistant as an event.
- **The pin-hole button** (recessed, beside the USB-C port): not an Android input, so not available to Home Assistant.

### Per-button detail

**1. The four side buttons are `adc-keys` and send standard KeyEvents.** They sit on the rk3566 **SARADC** (`fe720000.saradc`), device `adc-keys1` (`/dev/input/event7`), scancodes `59` to `62`. The stock `Generic.kl` maps them to **`F1` to `F4`**, which become Android `KEYCODE_F1` to `KEYCODE_F4`; the panel app captures them through its accessibility key filter. On a unit with `su` they can be remapped by editing `/system/usr/keylayout/Generic.kl` (for example to `BRIGHTNESS_*` or `VOLUME_*`).

**2. The fifth (orange) button is a switch, not a key.** On `gpio-keys` (`/dev/input/event8`) it reports **`EV_SW` `SW_MUTE_DEVICE`** (switch code `14`), a _latching_ event, **not** an `EV_KEY`. That is why no keylayout entry exists for it and Android accessibility never sees it, so the stock firmware leaves it dead. The panel app reads it through the root helper daemon's evdev reader (`WATCH /dev/input/event8`, `sw=true`) and sends a Home Assistant event (`KEYCODE_MUTE`) on each toggle, validated end to end. This is **stock** behaviour, undocumented elsewhere at the time of writing.

**3. The pin-hole button (recessed, beside the USB-C port) is not an Android input.** It is absent from `getevent`, `gpio-keys` and `dmesg`, so Home Assistant cannot use it. Its electrical role has not been safely confirmed. Its placement and the rk3566 platform suggest a reset or boot-mode function, but there is no verified hold duration, factory-reset behaviour or Maskrom entry procedure. Do not press or hold it on the assumption that it provides a recoverable reflash path. Use the verified software-entered Loader route while Android still boots, and follow the limits in [Firmware backup and restore](/hardware/guides/firmware-backup-and-restore/).

## Camera

GalaxyCore **GC05A2 / GC5035**, a 2592×1944 sensor. Android reports one camera at `LIMITED` hardware level, `BACKWARD_COMPATIBLE` only, `Facing: Back`, with no flash and no autofocus, through the `legacy/0` provider (`device@3.3`).

:::note
The firmware's own feature flags are wrong about it: the panel declares `android.hardware.camera.front` while the HAL reports `Facing: Back`. Decide on the device profile and on what `CameraManager` actually enumerates, never on `hasSystemFeature`.
:::

1280×720 is offered in all three formats, `IMPLEMENTATION_DEFINED`, `YUV_420_888` and `BLOB`, so both preview and still-capture formats are available. The HAL advertises a one-frame stall for a 720p `BLOB` capture at 30 fps, but the panel app captures `YUV_420_888` and compresses JPEG in software, so that figure does not measure the app's snapshot cost. `android.control.aeAvailableTargetFpsRanges` offers only `[15 30]` and `[30 30]`: there is no locked 15 fps sensor mode, so a 15 fps stream comes from pacing the encoder, not from the sensor.

The only hardware H.264 encoder is `OMX.rk.video_encoder.avc`, served by the OMX IL HAL (this panel has a `media.codec` process and no Codec2 vendor service). It declares `176x144` to `1920x1088` at `16x8` alignment, a bitrate range reported as 1 bps to 10 Mbps, and four concurrent instances. There is **no hardware HEVC encoder**; the only HEVC entry is the software `c2.android.hevc.encoder`, shipped `enabled="false"`.

:::caution
Treat the vendor's `media_codecs_performance.xml` figures as boilerplate, not measurement: the hardware and software AVC encoders report identical `measured-frame-rate` values at both 720×480 and 1280×720, which cannot be a real measurement. Assume 720p until you have measured otherwise on your own panel.
:::

A panel showing camera cards is not idle. On a measured dashboard the panel app held two live `OMX.rk.video_decoder.avc` instances, so an encode session competes with existing decode work on the same Rockchip VPU.

The panel app can serve this camera as an **experimental feature that is off by default**. The **Camera** switch on the Camera card in Configure turns it on, with **Resolution**, **Frame rate** and **Bitrate** defaults (720p, 15 fps, 2000 kbps) and an **Exposure** bias. It then serves a video-only H.264 stream at `rtsp://<panel>:8554/live` and a still at `GET /api/v1/camera/snapshot.jpg`. Whenever the camera is open, the panel shows a red indicator that page content cannot cover. See the [API reference](/reference/api/) for the stream and status details.

:::caution
Do not put a Home Assistant camera card for **this** panel on **this** panel's own dashboard. The panel would decode its own encode in a loop, on the same video engine, for no benefit.
:::

## Other silicon

Camera GalaxyCore **GC05A2 / GC5035**; audio codec **ES7202** (a capture ADC; a usable microphone has not been verified); Goodix touch; `rk808` and `rk860` PMIC.

## Access model summary

- **LED and button backlight:** root only (`system:system` sysfs), through `hapaneld-helper`.
- **Proximity:** app-direct (`SensorManager`).
- **Temperature, humidity, light:** root only (input subsystem and I²C), through the helper daemon.
- **Buttons:** the four side buttons are app-direct (KeyEvents through accessibility); the fifth orange button is an `EV_SW` switch read through the `hapaneld-helper` evdev watch; the pin-hole button is not an input.
