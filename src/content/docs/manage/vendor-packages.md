---
title: Vendor packages
description: Stopping an intrusive vendor app from relaunching on boot and drawing over your dashboard, reversibly and only for the packages you choose.
---

A firmware update can leave a vendor app on the panel that relaunches itself on boot and draws a floating widget over your dashboard. On the Sonoff NSPanel Pro 120, for example, a firmware update left `com.eWeLinkControlPanel` starting on boot and laying a control widget over whatever the panel was showing. The panel app can neutralise packages like this, but only the ones you name.

## What it does

For each package you tame, the panel app applies three reversible, privileged actions, and repeats them on every boot:

| Step                  | Mechanism                                   | Effect                                                                       |
| --------------------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| Force-stop            | `am force-stop <pkg>`                       | Stops the app now, so its widget disappears immediately.                     |
| Disable boot relaunch | `pm disable-user --user 0 <pkg>`            | Stops it starting again on the next boot. Reversible with `pm enable <pkg>`. |
| Block overlays        | `appops set <pkg> SYSTEM_ALERT_WINDOW deny` | Removes its permission to draw a floating window over the dashboard.         |

All three are privileged, so the feature needs **root or the [root helper](https://github.com/maxlyth/ha-paneld/blob/main/helper/README.md)**. That means it also works on panels that sandbox root, such as the [Tuya TPA10](/hardware/panels/tuya-tpa10/), where the actions go through the helper's `STOP`, `DISABLE` and `OVERLAY` commands.

## Using it

This is managed **on the panel's own web interface**, in the **Install** tab, not from Home Assistant. It is something you do once when setting a panel up or after a firmware update, not something you switch day to day, so it does not belong on a dashboard.

Open the panel's web interface at `http://<panel-ip>:8888/install` and find the **Vendor packages** card.

Press **Find a package…** to open a list of the apps on the panel you might want to control, grouped to make the choice easier:

- **Recommended for this panel**: the intrusive firmware apps known for your hardware, which are the safe first choices. On a panel with a known hardware profile, such as the NSPanel Pro, `com.eWeLinkControlPanel` is listed here. Each entry carries **tags** (for example `vendor` for the panel maker's apps, `chipset` for the chip maker's factory and test apps, `overlay`, `boot`) and a short **note** from the profile's author saying what it is and why it is flagged, so you can tell a Sonoff overlay app from a harmless Rockchip test app left in the image.
- **Other apps**: apps on the panel that are not part of core Android. On a panel without a known profile, this is where to look for anything with a launcher entry, overlay permission or non-platform signature that looks like a vendor add-on.
- **Using the most CPU**: whatever is using the most CPU right now. Only tame one you recognise.

Each entry has a **Tame** button, and you can also type a package name straight into the box if you know it. **Tame** acts immediately, with no separate save, and is reapplied on every boot. A tamed or already disabled package shows **Re-enable** instead, which reverses it. The card itself lists only what you have tamed, each with its state: `active`, `disabled` or `not installed`.

Nothing is tamed until you press a Tame button. The card only appears on panels with root or the helper, because taming needs a privileged route.

## Safety

- **Reversible.** Disabling is undone with `pm enable <pkg>`, or by an update of that app or the firmware. Nothing here is destructive: no uninstall and no data wipe.
- **Critical packages are refused.** The panel app will never stop or disable the system UI, Settings, telephony, the Android framework or itself, even if you name one. Both the app and the privileged helper enforce this, so a typo cannot brick the panel.
- **Only installed packages you name are touched.** Removing a package from the list does not re-enable it; use **Re-enable** first, or `pm enable <pkg>` afterwards.

:::caution
You are choosing packages to disable, so stick to vendor software you recognise. Disabling something the panel depends on, such as a vendor launcher you actually use or an input method, can leave the panel hard to navigate until you re-enable it over `adb`. When in doubt, leave it alone.
:::
