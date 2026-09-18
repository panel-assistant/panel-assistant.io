---
title: Sonoff NSPanel Pro firmware and flashing
description: How Sonoff distributes NSPanel Pro OTA firmware, how to verify a download URL, and the update procedure hardware-verified through 4.4.0.
sidebar:
  label: NSPanel Pro
  order: 1
---

How Sonoff NSPanel Pro OTA firmware is distributed, how to verify a download URL, and the update procedure, hardware-verified through 4.4.0 and extended past it by CDN verification only.

:::note
The **community-maintained version index** is a GitHub Discussion, because it changes faster than the app's release cycle and takes community contributions: **[NSPanel Pro firmware: OTA URL index](https://github.com/panel-assistant/android/discussions/7)**. It carries the recent upgrade targets rather than the whole history, because GitHub limits the size of a Discussion. Every verified OTA URL for the 86P and 120P, with sizes, CDN indices and archival status, is in the complete index linked from [Firmware](/hardware/firmware/). This page covers the stable URL scheme and the procedure. The Discussion is regenerated from [`tools/firmware-index/`](https://github.com/panel-assistant/android/tree/main/tools/firmware-index) by a scheduled job, so it can lag the data files until that job next runs; when the two disagree, the `.dat` files are the authority.
:::

Two physically distinct models each have their **own** CDN channel. Do not cross them:

| Model                | SoC and display    | CDN channel          | Diff filename form              |
| -------------------- | ------------------ | -------------------- | ------------------------------- |
| NSPanel Pro **86P**  | PX30, 480×480      | `nspanel-pro`        | bare `CK_<from>_<to>-diff.zip`  |
| NSPanel Pro **120P** | rk3326-S, 750×1334 | `nspanel-pro-ver120` | `CK_<from>_<to>V<apk>-diff.zip` |

See the [Sonoff NSPanel Pro](/hardware/panels/sonoff-nspanel-pro/) page for how to tell the variants apart and for per-version firmware quirks.

## CDN URL scheme

The host is `global-otadl2bsy.coolkit.cc`, the CoolKit OTA CDN.

```text
Full ROM:  https://global-otadl2bsy.coolkit.cc/<channel>/rom/<INDEX>/<full-rom>
Diff:      https://global-otadl2bsy.coolkit.cc/<channel>/rom-diff/<INDEX>/<diff>
```

- `<INDEX>` is a **per-build serial, not sequential** by version, so it must be discovered and recorded for each image. For `rom-diff` the index belongs to the _target_ version: all diffs onto the same target share one index.
- A real object returns **206** to a range request, with the total size and the ZIP magic `50 4b 03 04` ("PK.."). Anything else returns **403**, which only means that _nothing is at the exact path you tried_. There is no directory listing and `<INDEX>` cannot be derived from the version, so a failed probe rules out one filename at one index, never the existence of a build.

Verify a candidate cheaply, without downloading the whole image:

```bash
curl -sS -I -L "<url>"                       # 206 + Content-Range total = exists
curl -sS -r 0-3 -L "<url>" | od -An -tx1     # 50 4b 03 04 = real ZIP
```

## Update path, hardware-verified through 4.4.0

From about 3.0.0 on the 86P and about 3.5.0 on the 120P, the on-device updater accepts only incremental updates for most builds. The exception is **4.0.12**: it is distributed **as a full ROM only** (no inbound diff was found on either channel) and is accepted on the device as a checkpoint. From a 3.x or early 4.0.x build, CDN inspection indicates this two-step path:

```text
<your 3.x / 4.0.x build> → 4.0.12 (FULL ROM) → <target> (diff)
```

The 4.0.12 step is **not** universal. Which targets are reachable in one hop depends on the model and on the starting version: several releases carry inbound diffs from 4.4.0, 4.5.1, 4.5.3 or 4.6.0 as well as from 4.0.12, so a panel already past the checkpoint often needs no round trip through it. Some releases are app-only and carry no ROM diff at all, and a release can be a ROM diff on one model and app-only on the other: **4.5.3** is a ROM diff on the 120P but an app-only update on the 86P, and **4.6.2** is indexed as an app-only update with no ROM diff on either channel. The per-model diff tables in the Discussion list the recent upgrade targets and are the authority on the route; every object ever indexed, including older releases the Discussion does not show, is in the complete index. The intermediate 4.0.10 diff is **not** needed.

Verified on a 120P: **3.7.1, then the 4.0.12 full ROM (applied directly), then the 4.4.0 diff**. 4.4.0 was the target at the time, and nothing past it has been flashed live; later diffs are verified against the CDN only. For the most recently indexed releases, no vendor documentation was found when this was last checked (2026-08-14). [Sonoff's public changelog](https://sonoff.tech/en-us/blogs/news/sonoff-nspanel-pro-version-update-information-and-faq) documents releases up to **4.6.0**; 4.6.2 and 4.8.0 were located only by probing the CDN; and 4.7.0 is discussed only in an [eWeLink user feedback thread](https://forum.ewelink.cc/t/nspanel-pro-v4-7-0-feeback/208789), which is a discussion, not a release announcement or official release notes. For **4.8.0** the only vendor statement found is an eWeLink staff post of 2026-07-16 scheduling it for August; no changelog has been published. Absence from the index means the build was not found by probing: the CDN cannot be listed, so absence never proves a build does not exist.

:::caution
**Community reports describe restart loops on 4.5.1 and 4.5.2**, at intervals of about 10 to 60 minutes on both the 86P and 120P. For **4.7.0**, the user feedback thread contains reports of sub-device connectivity trouble after updating, some resolved by a reboot and others described as continuing. These have not been reproduced or quantified, so treat them as unverified user reports rather than a known regression. For **4.8.0** no feedback thread has been found at all, which is an absence of evidence rather than a clean bill of health. Verify any of these on one panel before rolling it out to others; **4.0.12** remains the conservative full-ROM checkpoint to pin. The Discussion carries the current community evidence.
:::

## Flashing a panel (hardware-verified through 4.4.0)

This fully remote method, using root and network `adb` with no USB, took a 120P from 3.7.1 through 4.0.12 to 4.4.0. The same package shape and CDN inspection establish the diff paths indexed past 4.4.0, but no step past 4.4.0 has been flashed live. The method works because the panel's `/data` is unencrypted (`getprop ro.crypto.state` returns `unsupported`), so recovery can apply the on-device ZIP through a block map. Recovery has **no network adb**, which is why this command-file method is used rather than `adb sideload`.

In every block, `DEV=<panel-ip>:5555` and the panel is rooted (`su` works).

:::danger
Back up first. When imaging partitions, do **not** stream them through `adb exec-out` or `adb shell ... dd`: the shell PTY translates `\n` to `\r\n` and silently corrupts the binary. Use `dd` to a file and then `adb pull`, and verify each image against `blockdev --getsize64`.
:::

1. **Identify and back up.** Confirm `getprop ro.product.version` and root, then image the partitions (`dd if=/dev/block/by-name/<p> of=/sdcard/_bk.img`, `adb pull`, verify the size). The identity-critical small partitions are `STSN`, `keypart` and `smatek`.

2. **Push the firmware ZIP** to the panel and confirm it arrived intact:

   ```bash
   adb -s $DEV shell su -c 'rm -f /data/local/tmp/update.zip /cache/recovery/block.map /cache/recovery/command'
   adb -s $DEV push <firmware.zip> /data/local/tmp/update.zip
   adb -s $DEV shell su -c 'sha256sum /data/local/tmp/update.zip'   # must match the host file
   ```

3. **Apply through recovery.** `uncrypt` builds a block map, so recovery reads the ZIP by raw blocks without mounting `/data`, and a command file tells recovery what to apply:

   ```bash
   adb -s $DEV shell su -c 'uncrypt /data/local/tmp/update.zip /cache/recovery/block.map'
   adb -s $DEV shell su -c 'head -2 /cache/recovery/block.map'   # line1=/dev/block/by-name/userdata, line2=<size> 4096
   printf -- '--update_package=@/cache/recovery/block.map\n--locale=en_US\n' > rcmd
   adb -s $DEV push rcmd /sdcard/rcmd
   adb -s $DEV shell su -c 'cp /sdcard/rcmd /cache/recovery/command && chmod 644 /cache/recovery/command && rm -f /sdcard/rcmd'
   adb -s $DEV shell su -c 'sync; reboot recovery'
   ```

   The panel drops off adb and shows a recovery progress screen while it applies the package (about 5 minutes for the full ROM, about 13 minutes for a diff), then reboots to Android on its own.

4. **Verify before considering a newer diff.** Reconnect and check `getprop ro.product.version`. Repeating steps 2 and 3 with the 4.0.12 to 4.4.0 diff follows the hardware-verified procedure. The diffs indexed past 4.4.0 have only been verified as valid CDN packages, so applying one is an experimental step to try first on one recoverable panel. See the Discussion for the CDN URLs and evidence status.

**What survives:** these OTAs do not touch `/data`, so apps, settings, adb and USB debugging, an installed modern WebView, and the panel app (including its start at boot) all persist. A factory reset would wipe them; this method does not.

## Provenance

The CDN scheme and indices were verified by range requests against `global-otadl2bsy.coolkit.cc`. The chain through 4.4.0 was flash-verified on a 120P; the diffs indexed past it are verified against the CDN only.
