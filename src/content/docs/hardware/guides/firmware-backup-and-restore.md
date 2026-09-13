---
title: Firmware backup and restore
description: Back up every partition of a rooted Rockchip wall panel over the network, and restore a partition in Loader mode with rkdeveloptool.
sidebar:
  label: Firmware backup and restore
  order: 3
---

The Tuya TPA10 and Electron WF1589T do not provide the usual Android volume-and-power recovery combination. Standard guides that start with "hold Volume-Down and Power" therefore do not apply: these panels use Rockchip's Loader protocol instead.

A partition backup is read-only but can be large. It runs over the network with no mode change, needs root, and stages each image temporarily on the panel's shared storage ([Back up now](#back-up-now)). Confirm that the panel has enough free space for its largest partition before starting. Restoring is more involved, needs a USB cable and a laptop, and remains experimental until an end-to-end recovery has been proved on a spare unit.

The normal Loader-mode path uses the open-source, cross-platform `rkdeveloptool`. The old vendor tools (`RKDevTool` and `AndroidTool`) are Windows-only GUIs; `rkdeveloptool` runs on Linux, macOS, or Windows through WSL2. The Sonoff NSPanel Pro uses separate model-specific tooling, described under [Per-panel notes](#per-panel-notes).

:::note
The commands below are scoped to the rooted TPA10 and WF1589T layouts recorded in [Per-panel notes](#per-panel-notes). Do not use them on an unrooted ZHICAI SMT1019 or ZX-SMT156, on a Shelly Wall Display, or on an uncharacterised Generic profile. The restore steps have not been brick-tested, and Maskrom recovery is not documented because no verified model-specific loader file has been established.
:::

## Back up now

Read every partition straight off the running panel, over the network. These commands do not write partitions or change boot mode; you only need the panel's address and [adb](https://developer.android.com/tools/adb). adb is already included in the Home Assistant SSH add-on, and the panels expose it on TCP port 5555, so backup happens entirely over the network with no USB.

```bash
IP=<panel-ip>           # your panel's IP address
mkdir -p backup && cd backup
adb -s $IP:5555 shell 'su 0 sh -c "for f in /dev/block/by-name/*; do echo \$(basename \$f) \$(readlink -f \$f); done"' \
  | while read name dev; do
      [ -z "$dev" ] && continue
      echo "backing up $name ($dev)"
      adb -s $IP:5555 shell "su 0 dd if=$dev of=/sdcard/$name.img bs=1M 2>/dev/null"
      adb -s $IP:5555 pull /sdcard/$name.img "./$name.img"
      adb -s $IP:5555 shell "rm /sdcard/$name.img"
    done
```

Keep the folder somewhere safe. Then capture the first 8 MiB of the eMMC as additional boot-layout evidence. This raw flash head is **not** a Rockchip MiniLoader file and must not be passed to `rkdeveloptool db`:

```bash
adb -s $IP:5555 shell "su 0 dd if=/dev/block/mmcblk2 of=/sdcard/idb_head.img bs=1M count=8"   # mmcblk2 on TPA10; mmcblk1 on WF1589T
adb -s $IP:5555 pull /sdcard/idb_head.img ./idb_head.img && adb -s $IP:5555 shell "rm /sdcard/idb_head.img"
```

:::note
**What you just saved.** Every named partition that completed successfully: the bootloader (`uboot`, `trust`, `security`), the system (`boot`, `recovery`, `super` and the rest) and your data (`userdata`, which can be very large). Compare every pulled file with `blockdev --getsize64` for its source partition before treating the backup as complete. These commands need the verified `su 0` route on the TPA10 or WF1589T; the SoC family alone does not imply root. The NSPanel Pro uses [model-specific tooling](#per-panel-notes).
:::

## Stop unwanted updates

Once adb is enabled you probably want to stop the vendor pushing an update that reverts your changes. Disable the updater app; `pm enable` puts it back:

```bash
adb -s $IP:5555 shell 'pm disable-user --user 0 com.elclcd.otaupdater'   # WF1589T
```

:::note
The updater app differs per panel. The **WF1589T** uses `com.elclcd.otaupdater`; the **TPA10** has no dedicated updater, so watch for Tuya pushes. See [Per-panel notes](#per-panel-notes).
:::

## If you ever need to restore

Restoring writes to the panel, so unlike backup it needs a **USB cable to a computer** and the `rkdeveloptool` program. Bring a laptop to the panel; you may have to take the panel off the wall to reach the USB port. One-time setup is in [Setting up rkdeveloptool](#setting-up-rkdeveloptool). What you can do depends on the panel and on whether Android still boots:

1. **Which panel?** For an NSPanel Pro 86P or 120P, use the [model-specific tooling](#per-panel-notes); `rkdeveloptool` is not the route there. For a TPA10 or WF1589T, continue.
2. **Do you have a verified backup**, with every file's size compared against `blockdev --getsize64`? If not, stop and take one first. Backup is read-only and needs only the network.
3. **Does Android still boot?** If it does, use the supported Loader-mode path below: `adb reboot loader`, confirm `Loader` with `rkdeveloptool ld`, restore by partition name with `wlx`, then reboot with `rd`.
4. **If Android does not boot**, Maskrom will still enumerate the device, but writing from Maskrom needs a verified, model- and memory-specific MiniLoader. No panel documented here has one. Treat Maskrom as observation only: run `ld` to confirm the mode and do not run `db`, `wl`, `wlx`, `gpt`, `ul` or `ef`. A write path from Maskrom is outside what this guide documents, even with a loader proved on a spare.

**The panel still boots.** Switch it to flashing mode over the network and write the partition back:

```bash
adb -s $IP:5555 reboot loader       # software entry — no buttons
rkdeveloptool ld                     # expect: <id>  Loader
rkdeveloptool wlx boot boot.img      # restore a partition by name
rkdeveloptool rd                     # reboot
```

**The panel will not boot.** Stop here. Rockchip Maskrom can still enumerate a device, but writing from Maskrom first requires a valid model- and memory-specific MiniLoader, and that file has not yet been sourced and restore-tested for these panels:

```bash
# after entering the model-specific hardware mode, observation only:
rkdeveloptool ld                     # expect: <id>  Maskrom
# Do not run `db`, `wl`, `wlx`, `gpt`, `ul` or `ef` without a verified MiniLoader and recovery plan.
```

:::danger
The raw `idb_head.img` captured during backup is not a substitute for a Rockchip MiniLoader. Do not rename it to `loader.bin` or pass it to `rkdeveloptool db`. Until a loader is extracted or obtained, authenticated and proved on a spare unit, only the software-entered Loader-mode restore path above is documented.
:::

## Reference

Everything below is background and look-up; you do not need it to take a backup.

### Setting up rkdeveloptool

Only needed for [restore](#if-you-ever-need-to-restore). `rkdeveloptool` is the open-source replacement for the old Windows-only Rockchip tools. It talks to the panel over USB through [libusb](https://libusb.info), so it runs on the laptop you already have:

| Your computer   | Works?                                                             | How                                                                                                                                                                         |
| --------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS           | Yes                                                                | `brew install automake autoconf libusb`, then build as below                                                                                                                |
| Windows         | Yes, through [WSL2](https://learn.microsoft.com/windows/wsl/about) | Install [`usbipd-win`](https://github.com/dorssel/usbipd-win), then `usbipd bind` and `usbipd attach --wsl` to hand the USB device to Linux, and build as below inside WSL2 |
| Linux           | Yes, natively                                                      | Build as below; the `99-rk-rockusb.rules` udev rule grants USB access                                                                                                       |
| Windows, native | Legacy only                                                        | The old `RKDevTool.exe` GUI and a special driver. Avoid it and use WSL2 instead                                                                                             |

Build it with the same commands on every platform:

```bash
git clone https://github.com/rockchip-linux/rkdeveloptool && cd rkdeveloptool
autoreconf -i && ./configure && make
sudo cp rkdeveloptool /usr/local/bin/
sudo cp 99-rk-rockusb.rules /etc/udev/rules.d/ && sudo udevadm control --reload   # Linux/WSL2 only
```

#### Docker on a Linux host

On a Linux host you can run it from a container instead of building it:

```dockerfile
# Dockerfile
FROM debian:stable-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential autoconf automake pkg-config libusb-1.0-0-dev git ca-certificates \
 && git clone https://github.com/rockchip-linux/rkdeveloptool /src \
 && cd /src && autoreconf -i && ./configure && make && cp rkdeveloptool /usr/local/bin/ \
 && apt-get purge -y build-essential git && apt-get autoremove -y && rm -rf /var/lib/apt/lists/* /src
ENTRYPOINT ["rkdeveloptool"]
```

```bash
docker build -t rkdeveloptool .
docker run --rm -it --privileged -v /dev/bus/usb:/dev/bus/usb rkdeveloptool ld
```

Docker Desktop on macOS and Windows cannot reach USB because it runs in a virtual machine, so the container route is Linux-only.

:::note
Backup and switching to Loader mode use adb over the network (port 5555), with no USB. USB is needed only for the `rkdeveloptool` steps, which is why they are the only part that needs a laptop at the panel.
:::

### rkdeveloptool commands

From the tool's own help; run `rkdeveloptool -h` to confirm your build:

| Command                            | Purpose                                                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `ld`                               | list connected devices, and whether each is in `Loader` or `Maskrom` mode                                       |
| `rfi` / `rid` / `rcb`              | read flash info, flash ID, capacity                                                                             |
| `ppt`                              | print the partition table (names, start [LBA](https://en.wikipedia.org/wiki/Logical_block_addressing) and size) |
| `rl <BeginSec> <SectorLen> <File>` | **read** an LBA range to a file (host-side backup)                                                              |
| `wl <BeginSec> <File>`             | write a file at a raw LBA (advanced)                                                                            |
| `wlx <PartitionName> <File>`       | **write** a file to a named partition (restore, the safer choice)                                               |
| `db <Loader>`                      | load a loader onto a **Maskrom** device                                                                         |
| `ul <Loader>`                      | upgrade the on-flash loader                                                                                     |
| `gpt <table>`                      | write a [GPT](https://en.wikipedia.org/wiki/GUID_Partition_Table) partition table                               |
| `ef`                               | erase flash                                                                                                     |
| `rd [subcode]`                     | reset (reboot) the device                                                                                       |

### Why these panels need special steps

The TPA10 and WF1589T are [Rockchip](https://en.wikipedia.org/wiki/Rockchip) SoCs (rk3566 and rk3576) booting from [eMMC](https://en.wikipedia.org/wiki/MultiMediaCard#eMMC). That does not describe every supported panel. On these two models the usual Android advice fails because:

- **There are no buttons.** Guides that say "hold Volume-Down and Power for [fastboot](https://en.wikipedia.org/wiki/Fastboot) or recovery" cannot apply.
- **It is not fastboot.** Rockchip uses its own USB protocol, _rockusb_, with two [flashing modes](https://wiki.radxa.com/Rock5/install/rockchip-flash-tools):
  - **Loader**, entered in software with `adb reboot loader`, with no buttons. Normal restores use this mode.
  - **Maskrom**, a rescue mode in the chip's ROM that runs even with a wiped bootloader. It starts with no RAM set up, so a valid model-specific MiniLoader is required before partition access. The raw eMMC head is not that loader, and this guide does not provide a write procedure from Maskrom.

How the modes relate:

- **Android running.** Backup works here, over the network, read-only, with no mode change. `adb reboot loader` moves the panel to Loader mode over the network.
- **Loader mode.** `rkdeveloptool ld` reports `Loader`. `wlx` restores one named partition, and `rkdeveloptool rd` returns to Android.
- **Maskrom mode.** Entered through hardware only: the TPA10 pin-hole is only a candidate and the WF1589T test-point has not been located. `ld` reports the mode and writes nothing. Every write (`db`, `wl`, `wlx`, `gpt`, `ul`, `ef`) needs a verified model-specific MiniLoader, which has not been sourced, so it is not documented here.

The practical consequence is that **Loader is the only mode this guide can restore from**, and it is reachable only while Android still boots, which is precisely when you least feel you need it. That asymmetry is the argument for taking a backup now: the software path out of a working panel exists, while the rescue path out of a dead one is still missing its loader file.

### Per-panel notes

Partition tables were read from live units.

**Tuya TPA10** (rk3566, Android 11, 7.28 GB eMMC `mmcblk2`). Root with `su 0`. Maskrom entry: the pin-hole by the USB-C port is the candidate, but confirm whether it is reset or Maskrom before relying on it. USB-C port. Partitions: `security uboot trust misc dtbo vbmeta boot recovery backup cache metadata logo frp upgrade super userdata`.

**Electron WF1589T** (rk3576, Android 14, 58.24 GB eMMC `mmcblk1`). Root with `su 0`. Updater `com.elclcd.otaupdater`. Maskrom test-point not yet located. Partitions: `security uboot trust misc dtbo vbmeta boot recovery backup cache metadata frp baseparameter updatekey super userdata`.

**Sonoff NSPanel Pro 86P** (PX30) and **120P** (rk3326-S). Use seaky's established tooling rather than `rkdeveloptool`: [nspanel_pro_roottool_apk](https://github.com/seaky/nspanel_pro_roottool_apk) and [nspanel_pro_tools_apk](https://github.com/seaky/nspanel_pro_tools_apk), which includes firmware restore. Key facts distilled from seaky's issue threads (second-hand, not hardware-verified):

- **Never touch Rockchip vendor storage** (`/dev/vendor_storage`). Slot **7** holds the licence string (items 4 and 5 are the two MAC addresses) and slot **8** the product ID (`SN-RKPX30-NSP-01`). Wiping it boots the panel to a Chinese factory QR screen. ([roottool issue 1](https://github.com/seaky/nspanel_pro_roottool_apk/issues/1))
- **Recovering from the QR screen without a reflash:** sideload a launcher over adb, join Wi-Fi, reopen the eWeLink panel app and tap **Activate** a few times. The licence re-provisions online and the panel recovers. ([roottool issue 9](https://github.com/seaky/nspanel_pro_roottool_apk/issues/9))
- **Five power cycles** (power off at the Sonoff boot logo, five times) factory-reset the panel to the firmware in its _recovery partition_, which is often the version it shipped with. For example, a 2.3 unit reverts to 1.7, because over-the-air upgrades are not written to recovery. ([roottool issues 1](https://github.com/seaky/nspanel_pro_roottool_apk/issues/1) and [8](https://github.com/seaky/nspanel_pro_roottool_apk/issues/8))
- **No downgrade** (an Android OTA restriction). **Developer mode and root are permanent** and survive a factory reset; rooted devices registered with eWeLink also permanently lose some cloud features. ([roottool issue 1](https://github.com/seaky/nspanel_pro_roottool_apk/issues/1))
- **Signs of a dead eMMC:** a boot loop where the backlight comes on then off and recovery does not respond, or a verification failure when flashing a known-good file. Either points to an eMMC fault (or a deleted system certificate) and is usually unrecoverable. ([roottool issues 8](https://github.com/seaky/nspanel_pro_roottool_apk/issues/8) and [12](https://github.com/seaky/nspanel_pro_roottool_apk/issues/12))
- A raw reflash uses **RKDumper and Rockchip AndroidTool** over USB in Maskrom mode; the PX30 needs a USB driver tweak. In recovery mode, adb identifies the panel as `product/model/device = px30_evb`, shown as `rockchipplatform … recovery`. ([roottool issue 2](https://github.com/seaky/nspanel_pro_roottool_apk/issues/2), [tools issue 87](https://github.com/seaky/nspanel_pro_tools_apk/issues/87))
- **Cross-flashing a Sonoff OTA onto a Tuya T6E or S6E board bricks it**: there is no `stop` binary and it sticks in recovery. ([tools issue 87](https://github.com/seaky/nspanel_pro_tools_apk/issues/87))

### Safety notes

- Restore by partition **name** (`wlx`), not by raw sector, to avoid manual offset mistakes. Confirm the exact partition name, image and panel model before writing.
- Avoid raw full-disk writes (`wl` at sector 0). They hit a rockusb `0x2000`-sector offset quirk; stick to per-partition `wlx` and `rl`.
- Do not write `uboot`, `trust`, a loader or a partition table without a verified backup, an authenticated model-specific MiniLoader and a restore plan already proved on a spare.
- If you can, rehearse a restore on a spare unit before doing it on a panel in a wall.

### Open gaps

Help is wanted with:

- Confirming the **Maskrom entry** for each panel: whether the TPA10 pin-hole is reset or Maskrom, and where the WF1589T test-point is.
- Documenting how to source or extract the **loader file** for each panel, the one prerequisite for Maskrom rescue.
- One end-to-end **brick-and-restore test** on a spare unit to validate the restore steps.
