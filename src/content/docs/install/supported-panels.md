---
title: Choose a panel
description: Which Android wall panels ha-paneld supports, and how far that support goes.
---

Support is per model and it is uneven. Three panels are fully supported. Several more work to varying degrees, and at least one is blocked by its stock software rather than by anything ha-paneld does. Check your model before you buy hardware or start flashing it.

:::caution
The list below is a summary. The [hardware reference](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md) carries the current per-model status, the fact sheets, and the footnotes marking anything that has not been verified on a physical unit. Read it before committing to a device.
:::

## Fully supported

These three have the fullest hardware coverage.

- **Sonoff NSPanel Pro** (including the 120 and 86 variants)
- **Tuya TPA10**
- **Electron WF1589T**

## Also documented

These have fact sheets and varying degrees of support, from community-tested through preliminary and experimental to research only. The hardware reference states where each one currently sits.

- ZHICAI SMT1019
- ZX-SMT156 / RK3566_T
- Smatek S9E
- Shelly Wall Display, and the X1i, X2, X2i and XL models

:::note
The original Shelly Wall Display ships Android 7.0, which is older than the minimum ha-paneld supports.
:::

## What decides whether a panel works

- **Android version.** ha-paneld needs Android 8.0 or newer.
- **System WebView.** The built-in renderer needs a current `com.android.webview`. Many panels ship with a very old one, and updating it is part of [preparing the panel](/install/prepare-a-panel/).
- **ADB access.** Installation happens over the network with ADB, so the panel has to allow it.
- **A hardware profile.** The screen, LEDs, buttons, sensors and relays reach Home Assistant through a YAML profile for that model. Without one you still get a dashboard, but not the panel's own hardware as entities.
- **Root, sometimes.** A few capabilities on some models need root. The hardware pages say which, and what the route is.

## Adding a model

Hardware support is data, not code, so a new panel is a profile rather than a new build of the app. The [hardware reference](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md) and the [profile documentation](https://github.com/maxlyth/ha-paneld/tree/main/docs/profiles) describe what a profile has to contain. Reports from panels that are not yet listed are welcome in the [repository issues](https://github.com/maxlyth/ha-paneld/issues).
