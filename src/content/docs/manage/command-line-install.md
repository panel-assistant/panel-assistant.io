---
title: Install script (retired)
description: The command-line installer no longer installs or updates panels. What to use instead, and how to remove ha-paneld from a panel.
---

The command-line installer (`scripts/install.sh` and `scripts/provision.sh`) is retired. Since ha-paneld v0.9.9 it can no longer install or update a panel. Run without options, it stops and points you to Panel Assistant. It will be removed from the project in a later release.

Add and update panels from [Home Assistant](/install/installing-ha-paneld/) with Panel Assistant instead. A panel that was installed with the script keeps working. Add it to Panel Assistant and it is connected rather than reinstalled, and Panel Assistant then offers its updates.

## Getting ADB onto the network

On some Tuya TPA10 and Smatek panels, ADB at first works only over USB. Connect the USB cable and turn on network ADB before adding the panel in Home Assistant:

```sh
adb devices                   # accept the on-screen RSA prompt if shown
adb root                      # if this firmware supports it
adb tcpip 5555                # expose adb on the network; this resets on reboot
adb connect 192.168.1.50:5555 # replace this address with the panel's address
```

## Removing ha-paneld from a panel

1. Open the panel's web interface at `http://<panel>:8888`, go to **Install** and choose **Restore the home screen**. This turns the vendor apps that ha-paneld switched off back on and gives the panel its own home screen again. Do this first: without it the panel has no home screen once ha-paneld is gone. If [Hardened security mode](/manage/security-mode/) is on, approve the request on the panel.
2. In Home Assistant, delete the panel's Panel Assistant entry under **Settings**, **Devices and services**.
3. Uninstall **ha-paneld** from the panel's Android **Settings**, **Apps**.

## Access routes and security mode

Hardware profile recommendations are report-only. Choosing a profile is not consent to disable packages, persist ADB, install privileged software or change display settings. Packages you have already tamed on the [vendor packages](/manage/vendor-packages/) card are still tamed again at every boot.

On a genuinely unrooted panel whose profile names a specific supported use for it, the panel app can fall back to [Shizuku](https://shizuku.rikka.app/), a separate open-source app whose service runs with Android's shell identity. Shell is not root, so anything that needs root still fails closed. The permission can only be approved at the panel, in **Configure**, the toolbar's overflow menu, **Enhanced access**, then **Enable**, and it is never exported or restored. A service started over ADB normally has to be started again after a reboot. Do not set it up on a panel that already has working `su` or the root helper.

[Hardened security mode](/manage/security-mode/) requires someone at the panel to approve selected high-impact remote actions. It can only be turned on at the panel. Network ADB cannot be used while it is on, so return the panel to Relaxed mode at the panel before installing or updating over ADB.

## Building it yourself

The app is free and open source, and the [development environment](/reference/development-environment/) page describes building it.
