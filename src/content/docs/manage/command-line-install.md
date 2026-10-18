---
title: Install script (retired)
description: The command-line installer no longer installs or updates panels. What to use instead, and how to remove ha-paneld from a panel.
---

The command-line installer has been removed. Add and update panels through Panel Assistant in Home Assistant.

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

Choose the panel's **Remove Panel Assistant from this panel** option, under **Configure** in Home Assistant. It gives the panel its own home screen back, uninstalls the app and then asks whether Home Assistant should forget the panel. Read [Before you remove ha-paneld](/manage/removal-risks/) first.

## Access routes and security mode

Hardware profile recommendations are report-only. Choosing a profile is not consent to disable packages, persist ADB, install privileged software or change display settings. Packages you have already tamed on the [vendor packages](/manage/vendor-packages/) card are still tamed again at every boot.

[Hardened security mode](/manage/security-mode/) requires someone at the panel to approve selected high-impact remote actions. It can only be turned on at the panel. Network ADB cannot be used while it is on, so return the panel to Relaxed mode at the panel before installing or updating over ADB.

## Building it yourself

The app is free and open source, and the [development environment](/reference/development-environment/) page describes building it.
