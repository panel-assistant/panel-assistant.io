---
title: Smatek S9E
description: Hardware facts for the Smatek S9E, a 10.1 inch Rockchip RK3566 in-wall panel with two mains relays, four LED-backlit buttons, radar proximity, Zigbee, Ethernet and RS485.
vendor: Smatek
model: S9E
soc: Rockchip RK3566
android: '11'
screen: 10.1 in, 1920 × 1200
support: Community-tested
root: Relays, button LEDs, proximity (unconfirmed su)
webview: Chromium 83 on 2024-07; 131 on 2025-12
released: 'not before 2021 (est., RK3566 SoC)'
photos:
  - src: 'asset:hardware-smatek-s9e-front.jpg'
    alt: Smatek S9E, front and rear, showing the relay and terminal wiring
photoCredit: 'Photo: Smatek'
sidebar:
  label: S9E
---

:::note
Unlike the fully supported panels, the S9E has **not** been reverse-engineered on a unit in hand. Specifications come from Smatek's listing, and control paths come from [seaky/nspanel_pro_tools_apk issue 98](https://github.com/seaky/nspanel_pro_tools_apk/issues/98), the Home Assistant community thread and reporters. Relay and button support is implemented but untested on hardware, so treat control-path details as unconfirmed until validated.
:::

A 10.1 in **1920×1200** RK3566 in-wall panel, the same SoC family as the TPA10, with **two on-board mains relays**, four LED-backlit buttons, a radar proximity sensor, and **Zigbee, Ethernet and RS485**.

## Also sold as

Smatek S9E, Smatek S9, S9PE, S9PE-NZ (PoE variant), `Build.MODEL` S9, `Build.DEVICE` rk3566_r, `ro.product.version` S9_Android_1.0.2 and S9_Android_1.1.0.

:::tip
The most-needed facts: it shares the TPA10's **RK3566** platform, so app-side features probably work without S9E-specific code. The **relays switch mains loads** (root sysfs, implemented but untested). The buttons emit **`F1` to `F4`** KeyEvents (app-direct, no root). Check the WebView first: the 2024-07 firmware ships **Chromium 83**.
:::

|                 |                                                                                                                                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC             | Rockchip **RK3566** (quad Cortex-A55), the same SoC family as the TPA10                                                                                                                                                                                                              |
| RAM and storage | **2 GB** RAM, **16 GB** eMMC                                                                                                                                                                                                                                                         |
| Display         | **10.1 in**, **1920×1200** multi-touch                                                                                                                                                                                                                                               |
| Android         | 11                                                                                                                                                                                                                                                                                   |
| Connectivity    | Wi-Fi, Bluetooth, **Zigbee**, **RJ45 Ethernet**, **RS485** (a PoE variant, the **S9PE**, also exists)                                                                                                                                                                                |
| Sensors         | proximity **radar**, ambient **light**, **temperature and humidity**                                                                                                                                                                                                                 |
| Inputs          | **4 physical buttons** with individual LEDs                                                                                                                                                                                                                                          |
| Relays          | **2 on-board mains relays**                                                                                                                                                                                                                                                          |
| Root            | the vendor app uses `execRootCmd`, so root is available; some units ship with developer mode unlocked. Whether `su` is reachable from a normal app sandbox is **unconfirmed**, and it decides whether the panel app drives the sysfs nodes directly or needs the root helper daemon. |
| Released        | Not confidently dated; the RK3566 SoC family did not reach the market until around 2021, the best lower bound found for this panel                                                                                                                                                   |

:::danger
The control surfaces below are **root sysfs** writes, and the relays switch **mains loads**. The support is implemented from the reported paths but is **untested on hardware**, so validate it on a real S9E before relying on it.
:::

:::tip
Because the S9E shares the TPA10's **RK3566** platform, the panel app's existing app-side features probably work without S9E-specific code, and temperature, humidity and light may surface through `SensorManager`. On the older firmware the shipped **WebView is very old (Chromium 83)**, so update it first: Magisk OpenWebView, the 2025-03-24 firmware, or a sideloaded SystemWebView. The 2025-12 firmware already ships Chromium 131. See [Updating the system WebView](/hardware/guides/update-the-webview/).
:::

:::tip
The S9E has four front function buttons but no documented power-and-volume recovery combination. Its partition table, root route and recovery procedure have not been captured on live hardware, so do not apply the TPA10 and WF1589T [firmware backup guide](/hardware/guides/firmware-backup-and-restore/) to it unchanged.
:::

## Firmware versions

Two stock images have been analysed. They are block-based OTA `.zip` files in AOSP dynamic-partition format: decompress the `.new.dat.br` with `brotli -d`, unpack the super image with `lpunpack`, then search `build.prop` and the init `.rc` files with `strings`. Both report `Build.MODEL` **`S9`** and `Build.DEVICE` **`rk3566_r`**, Android 11; the vendor build code is in **`ro.product.version`**:

| Image                              | `ro.product.version` | Build                        | Relay class           |
| ---------------------------------- | -------------------- | ---------------------------- | --------------------- |
| `S9_1920x1200_20240712_Android_US` | `S9_Android_1.0.2`   | `eng.*.20240712`             | `/sys/class/st_relay` |
| `S9_1920x1200_20251202_Android_US` | `S9_Android_1.1.0`   | `eng.xiaolp.20251202.160404` | `/sys/class/strelay`  |

:::caution
**The relay sysfs class was renamed between firmware versions.** Only the **initial** image (1.0.2) uses `/sys/class/st_relay`; **all newer** images (1.1.0 and later) use `/sys/class/strelay`, confirmed by [a reporter](https://github.com/maxlyth/ha-paneld/issues/3) and matched by the firmware diff. The panel app probes both class names and uses whichever the panel exposes; see [Relays](#relays-strelay-or-st_relay-class-root).
:::

Both images were shared by the reporter from Smatek: `S9_1920x1200_20240712_Android_US` (**1.0.2**) and `S9_1920x1200_20251202_Android_US` (**1.1.0**). The original Smatek download links at `docs.smatek.store:10001` are no longer reachable; contact Smatek support or the reporter for a copy.

Diffing the two images shows that **only `ro.product.version` and the relay class differ.** Every other control path documented below (button keycodes, button LED GPIOs, proximity GPIO, sensor wiring) is identical across both, so detection keyed on `ro.product.version` starting with `S9` covers the whole line.

## Relays: `strelay` or `st_relay` class (root)

The panel app exposes the two mains relays as `switch.<panel>_relay1` and `switch.<panel>_relay2`, only on a panel that has the relay sysfs class.

:::note
**The class name depends on firmware** (see [Firmware versions](#firmware-versions)): `st_relay` on the initial 1.0.2 image, `strelay` on 1.1.0 and later. The panel app probes **both** names and uses whichever the panel exposes.
:::

```bash
# firmware 1.1.0+ (most panels in the field)
echo 1 > /sys/class/strelay/relay1    # on
echo 0 > /sys/class/strelay/relay1    # off
echo 1 > /sys/class/strelay/relay2

# firmware 1.0.2 (initial release)
echo 1 > /sys/class/st_relay/relay1
```

## Buttons: `F1` to `F4` KeyEvents (app-direct)

The four buttons emit standard Android key codes **131 to 134**, `KEYCODE_F1` to `KEYCODE_F4`. The panel app's accessibility capture reports them to `event.<panel>_button` (event types `KEYCODE_F1` to `KEYCODE_F4`); bind dashboard actions to them in Home Assistant. The events need no root.

## LED: per-button GPIO backlight

Each button has an LED at `/sys/class/gpio/gpio<16+keycode>/value`, which is GPIO **147 to 150** for buttons F1 to F4. Each is on or off, monochrome. The panel app exposes them as `light.<panel>_button_led1` to `light.<panel>_button_led4` (switched through `su`), counted from the profile's `hardware.button_led_gpio_base`. The LEDs are **not** under `/sys/class/leds`, which holds only the `mmc2::` SD card LED on the S9E; they are raw GPIOs.

:::note
**Firmware analysis:** the init scripts export **only `gpio113`**. The button LED pins **gpio147 to gpio150 are not exported at boot**, so their `/sys/class/gpio/gpioNNN/value` nodes do not exist until exported. The panel app exports each pin on demand, and sets it to output, before the first write, which is why the LEDs work despite not being exported at boot.
:::

```bash
echo 147 > /sys/class/gpio/export        # one-time, if the node is absent
echo 1 > /sys/class/gpio/gpio147/value   # button F1 LED on
```

:::tip
The firmware also carries an **RGB status LED** (`led_r`, `led_g`, `led_b`), a **vibration motor** and **Ethernet activity LEDs**. The panel app does not expose any of them.
:::

## Sensors: proximity comes from GPIO 18, not `SensorManager`

:::caution
A proximity sensor is _registered_ in `SensorManager`, advertising `Proximity=yes · Binary · 0/1 cm`, but on the S9E it **never delivers events**. A reporter's live readings, in [a follow-up report](https://github.com/maxlyth/ha-paneld/issues/5), established that the Android path stays silent. The light sensor on the same panel works (about 46 lx), so the problem is specific to proximity; the real signal is read from `gpio18`.
:::

The real signal is a **root GPIO read at GPIO 18**. The kernel registers a phantom Android sensor that never fires, so the value has to be read from sysfs:

```bash
cat /sys/class/gpio/gpio18/value   # 1 = near, 0 = far  (no export needed — reporter-confirmed)
```

The S9E profile therefore declares `sensors.proximity_gpio: 18` instead of using the dead `SensorManager` source. The root helper holds the value descriptor open and streams changes immediately where the kernel supports GPIO edges; otherwise it rechecks the same descriptor twice a second. Losing the descriptor is reported explicitly, so Home Assistant shows the sensor as unavailable until the recovered helper stream supplies its current value. The signal then feeds the same self-learning presence detection and hand-gesture detection as Android sensors, normalised across all your panels. A reporter confirmed that gpio18 reads **0 far, 1 near**, but the learning does not rely on that polarity. Ambient light, temperature and humidity surface through `SensorManager` as expected.

## Access model summary

- **Relays:** `switch.<panel>_relay1` and `switch.<panel>_relay2` through the relay sysfs class (root); both `strelay` and `st_relay` are probed.
- **Buttons:** `event.<panel>_button` (`KEYCODE_F1` to `KEYCODE_F4`), app-direct through accessibility.
- **Button LEDs:** `light.<panel>_button_led1` to `light.<panel>_button_led4` through `su` (GPIO 147 to 150, exported on demand).
- **Proximity:** a learned `binary_sensor.<panel>_proximity` and a normalised `sensor.<panel>_proximity_level` from the root helper's held `gpio18` event stream. The `SensorManager` proximity sensor registers but never fires, so it is bypassed.
- **Light:** `sensor.<panel>_illuminance` through `SensorManager`, which **works**.

## Sources

- [The Smatek S9E report on GitHub](https://github.com/maxlyth/ha-paneld/issues/3): the reporter's `/diag` (detection strings, `SensorManager` proximity), the relay class rename from `st_relay` to `strelay`, and the two firmware images.
- Smatek S9E stock firmware shared by that reporter: 1.0.2 (20240712) and 1.1.0 (20251202), the two images analysed. The original Smatek download links (`docs.smatek.store:10001`) are no longer reachable.
- [seaky/nspanel_pro_tools_apk issue 98, "Add Smatek S9E Support"](https://github.com/seaky/nspanel_pro_tools_apk/issues/98): the relay (`st_relay`), button (keycodes 131 to 134), button LED (GPIO 147 to 150) and proximity (GPIO 18) control paths.
- [Home Assistant community: "Smatek S9E Touch Panel"](https://community.home-assistant.io/t/smatek-s9e-touch-panel/828244): WebView update, GPIO 18 proximity scripts, integration notes.
- [Smatek S9E product page](https://smatek.com/product/10-1-inch-smart-control-panel-s9e/) and [S9PE-NZ PoE variant](https://smatek.com/product/10-1-inch-android-panel-s9e-nz/): SoC, RAM and storage, display, sensors, connectivity.
- [Smatek S9E specification sheet (PDF)](https://smatek.com/wp-content/uploads/2025/03/Smatek-S9E-10-Super-Smart-Control-Panelin-wall-SPEC.pdf): an image-only scan that cannot be text-extracted, but the source datasheet.
