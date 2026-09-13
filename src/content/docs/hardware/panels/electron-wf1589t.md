---
title: Electron WF1589T
description: Hardware facts for the Electron WF1589T, a 10.1 inch Rockchip rk3576 panel with 4 GB of RAM, an app-direct RGB LED, a motion sensor suite, a camera and Google Play.
vendor: Electron
model: WF1589T
soc: Rockchip RK3576
android: '14'
screen: '10.1 in, 1920 × 1200'
support: Full
root: 'userdebug, adb root; rarely needed'
webview: 'Google Play, updates itself'
sidebar:
  label: WF1589T
---

The most capable of the fully supported panels: a **10.1 in 1920×1200 (about 226 ppi)** rk3576 unit with **4 GB of RAM**, an **app-direct RGB LED** that needs no root, a 6-axis motion sensor suite and **Google Play services**, so WebView and apps update themselves. Its firmware also provides Android's own navigation bar. NFC silicon is present but inert. Reverse-engineered on a live unit (Android 14 `userdebug`, `adb root`).

## Also sold as

Electron WF1589T, WF1589T, rk3576_u (the model string the profile matches), `ro.product.device=WF1589T`, vendor packages com.elclcd.otaupdater (ELC) and com.gulukai.pwmlightdemo. The ZHICAI SMT1019 is built on the sibling Electron WF2489T board and has [its own page](/hardware/panels/zhicai-smt1019/).

:::tip
The most-needed facts: it is `userdebug`, so **`adb root` just works**. The LED is the one that needs **no root path** (`/dev/ledjni`, world-writable). **Google Play is present**, so **no WebView sideload** is needed. The bundled profile offers **Native navbar** mode. The stock UI is **physically tiny** until you [raise the display density](#display-density-raise-it).
:::

|                 |                                                                                                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC             | Rockchip **rk3576** (`ro.board.platform=rk3576`, `ro.product.device=WF1589T`)                                                                                                                                                |
| Display         | **1920×1200** (16:10), about 10.1 in, **about 226 physical ppi**, 60 Hz. The Android factory base logical density of **160 dpi** is independent of physical PPI; raise the logical density for a larger touch UI (see below) |
| Android         | 14, **userdebug** (`adb root` available; `su` present)                                                                                                                                                                       |
| Google services | **Google Play services and the Play Store are present** (unlike the NSPanel Pro and TPA10), so WebView and apps update through Play; no WebView sideload needed                                                              |
| ABI             | arm64-v8a                                                                                                                                                                                                                    |
| Navigation      | Android's own Back, Home and Recents bar; the bundled profile enables the panel app's `Native` navbar mode                                                                                                                   |
| Radios          | Wi-Fi (with Wi-Fi Direct and Passpoint), Bluetooth and BLE. **No Zigbee, IR or cellular.**                                                                                                                                   |

:::tip
Changing firmware on a button-less panel? Read [Firmware backup and restore](/hardware/guides/firmware-backup-and-restore/) first. The WF1589T (rk3576, Android 14, 58.24 GB eMMC `mmcblk1`, updater `com.elclcd.otaupdater`) uses `adb reboot loader` and `rkdeveloptool`; its Maskrom test-point has not been located.
:::

## Gaining adb and root access

The WF1589T ships as a `userdebug` build with Google Play, so `adb root` works directly and `su` is present, with no password and no backdoor. The LED is app-direct (below), so root is rarely needed at all.

```bash
adb root                     # userdebug → root adbd shell
adb shell su 0 id            # uid=0 → root confirmed
```

:::danger
The WF1589T has an OTA updater (`com.elclcd.otaupdater`) that can revert your changes. Once adb is enabled, disable it (reversibly) with `adb shell pm disable-user --user 0 com.elclcd.otaupdater`. See [Stop unwanted updates](/hardware/guides/firmware-backup-and-restore/#stop-unwanted-updates).
:::

## WebView: already handled by Play

The WF1589T has **Google Play**, so unlike the NSPanel Pro and TPA10 you do not sideload a WebView. Update _Android System WebView_ from the Play Store, or use the Play WebView development channel, and it is current. See [Updating the system WebView](/hardware/guides/update-the-webview/) for the picture across panels.

## Native Android navbar

The WF1589T firmware draws its own Back, Home and Recents bar. Its bundled profile therefore offers `Native` navbar mode, which leaves those controls to Android and draws no overlay or reveal strip. The capability is enabled per profile rather than tied to this model in code, and other profiles can declare it once their firmware's navigation bar has been verified. Fullscreen renderer settings and Android dashboard lock can still hide the system bar.

## Display density: raise it

At the factory base logical density (160 dpi), Android renders at roughly 1 dp to 1 px, so buttons, text and dashboard cards come out **physically tiny and hard to touch**. The base value is Android's layout reference, not the panel's 226 physical PPI. The panel app's recommended density for this panel is 212 dpi, a verified starting point; adjust it to suit your room and dashboard:

```sh
adb shell wm density 212        # ha-paneld starting point; `wm density reset` restores the 160-dpi base
```

At 212 dpi the effective canvas is approximately 1449×906 dp. A higher value makes the touch UI larger and shows less dashboard content; a lower one does the reverse.

## LED: `/dev/ledjni` (app-direct, no root)

`/sys/class/leds` has no RGB node (only `mmc1::`). The front RGB LED is driven through a character device that is world-readable and writable and labelled `device`, which SELinux lets apps access, so a normal app drives it **without root or a helper daemon**. This is the one panel class where the LED needs no root path.

The panel app drives it through `Rk3576LedController`, and publishes the LED entity only where `/dev/ledjni` opens.

The factory `com.gulukai.pwmlightdemo` package also opens this device. Its boot-started foreground service continuously cycles the LED through seven colours, overwriting the panel app's commands and making Home Assistant's last commanded state differ from the physical LED. The device protocol has no state read-back, so two applications cannot share truthful control. The WF1589T profile therefore marks this demo as recommended to disable in the [Vendor packages](/manage/vendor-packages/) UI, where disabling it remains a deliberate, reversible action.

### `/dev/ledjni` node and ioctl protocol

```text
/dev/ledjni   crwxrwxrwx  system system  u:object_r:device:s0
```

The ioctl protocol was reverse-engineered clean-room from the vendor sample, and no vendor binary is bundled; see [`led_jni.c`](https://github.com/maxlyth/ha-paneld/blob/main/app/src/main/cpp/led_jni.c):

```c
int fd = open("/dev/ledjni", O_RDONLY | O_NOCTTY);
ioctl(fd, 0xa1, R);   // red,   0..15
ioctl(fd, 0xa2, G);   // green, 0..15
ioctl(fd, 0xa3, B);   // blue,  0..15
ioctl(fd, 0x99, 0);   // off
close(fd);
```

## Sensors: 6-axis motion sensors through `SensorManager`

Unusually for a wall panel, the WF1589T exposes a full motion suite through the standard `SensorManager`, with no root: `accelerometer`, `gyroscope`, `gravity`, `linear_acceleration` and `game_rotation_vector`. The backing chips are a Kionix **KXTJ9** and a Bosch **BMA2xx** accelerometer. No `TYPE_LIGHT` or `TYPE_PROXIMITY` is exposed, because none is fitted.

No ambient light, proximity, temperature or humidity sensor is bound on this board (compare the [TPA10](/hardware/panels/tuya-tpa10/), which has all four). Presence sensing here is motion-only, through the motion sensors.

### Bound I²C devices

:::note
Rockchip's board support package compiles in _hundreds_ of optional drivers, for every camera, codec and motion sensor it supports, so listing `/sys/bus/i2c/drivers/` over-reports wildly. Everything below comes from **bound** devices (`/sys/bus/i2c/devices/*/name`), meaning silicon actually on this board.
:::

| I²C address | Driver or name   | What it is                                                    |
| ----------- | ---------------- | ------------------------------------------------------------- |
| `0-0014`    | `gt9xx`          | Goodix capacitive touch controller                            |
| `0-0038`    | `fts_ts`         | FocalTech touch (secondary or alternative controller present) |
| `2-0022`    | `fusb302`        | USB-C Power Delivery controller                               |
| `2-0051`    | `hym8563`        | RTC                                                           |
| `1-0023`    | `rk806`          | Primary PMIC                                                  |
| `3-0010`    | `es8388`         | Audio codec (speaker, line)                                   |
| `3-0032`    | `ES7202_PDM_ADC` | PDM microphone ADC                                            |
| `4-0037`    | `gc05a2`         | GalaxyCore GC05A2 camera (about 5 MP)                         |
| `7-000e`    | `gs_kxtj9`       | Kionix KXTJ9 accelerometer                                    |
| `7-0018`    | `bma2xx_acc`     | Bosch BMA2xx accelerometer                                    |
| `7-0028`    | `nxpnfc`         | **NXP NFC controller** (see below)                            |

## Camera

GalaxyCore **GC05A2** (I²C `4-0037` in the table above), a 2592×1944 sensor. Android reports one camera at `LIMITED` hardware level, `BACKWARD_COMPATIBLE` only, `Facing: Front`, with no flash and no autofocus, through the `internal/0-1` provider. A second `external/0-0` provider is present with no devices attached, and the panel declares `android.hardware.camera.external`.

1280×720 is offered in all three formats, `IMPLEMENTATION_DEFINED`, `YUV_420_888` and `BLOB`. The HAL advertises a one-frame stall for a 720p `BLOB` capture at 30 fps, but the panel app captures `YUV_420_888` and compresses JPEG in software, so that figure does not measure the app's snapshot cost. `android.control.aeAvailableTargetFpsRanges` offers only `[15 30]` and `[30 30]`: there is no locked 15 fps sensor mode, so a 15 fps stream comes from pacing the encoder, not from the sensor.

The hardware H.264 encoder is `c2.rk.avc.encoder`, served by the Codec2 HAL (`android.hardware.media.c2@1.1-service`; there is no OMX `media.codec` process on this panel). It carries `OMX.rk.video_encoder.avc` as an alias, so selection by name finds _something_ on both this panel and the TPA10, but they are different components on opposite sides of the OMX-to-Codec2 transition and should not be assumed to behave alike. It declares `176x144` to `4096x2160` at `2x2` alignment, a bitrate range reported as 1 bps to 20 Mbps, and 32 concurrent instances. Unlike the TPA10, this panel also has a hardware HEVC encoder, `c2.rk.hevc.encoder`, which the panel app does not use.

A panel showing camera cards is not idle. On a measured dashboard the panel app held two live `c2.rk.avc.decoder` instances, so an encode session competes with existing decode work on the same Rockchip VPU.

The panel app can serve this camera as an **experimental feature that is off by default**. The **Camera** switch on the Camera card in Configure turns it on, with **Resolution**, **Frame rate** and **Bitrate** defaults (720p, 15 fps, 2000 kbps) and an **Exposure** bias. It then serves a video-only H.264 stream at `rtsp://<panel>:8554/live` and a still at `GET /api/v1/camera/snapshot.jpg`. Whenever the camera is open, the panel shows a red indicator that page content cannot cover. See the [API reference](/reference/api/) for the stream and status details.

:::caution
Do not put a Home Assistant camera card for **this** panel on **this** panel's own dashboard. The panel would decode its own encode in a loop, on the same video engine, for no benefit.
:::

## NFC: present but not wired into Android

An **NXP NFC controller** is bound at `i2c-7 0x28` (`nxpnfc` driver) with a `/dev/nxpnfc` node (`crw------- root root`), yet `pm list features` does **not** report `android.hardware.nfc`: the Android NFC service and HAL are not enabled in this firmware. The silicon exists but is inert to apps as shipped. Using it would need an NFC HAL and NfcService, or talking to `/dev/nxpnfc` directly as root. The panel app does not use it.

## Access model summary

- **LED:** app-direct (`/dev/ledjni`), no root and no daemon.
- **Motion sensors:** app-direct (`SensorManager`).
- **NFC:** present (NXP) but Android NFC disabled; root only as shipped.
- **Navigation:** Android's own navigation bar through the profile's `Native` mode.
- **Screen brightness, sleep, navigation, text-to-speech:** standard Android paths, as on any panel.
