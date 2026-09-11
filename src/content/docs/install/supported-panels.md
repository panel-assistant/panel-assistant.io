---
title: Choose a panel
description: Which Android wall panels Panel Assistant supports today, how far that support goes, and how to check before you buy.
---

Most wall panels are bought from overseas marketplaces on little more than a listing and a hope. This page is the check to do before the money leaves your account. Support is per model, three panel families are fully supported, several more are documented, and at least one is blocked by its own software rather than by anything Panel Assistant does.

:::caution
The list below is a summary. The [hardware reference](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md) carries the current per-model status, the fact sheets, and the footnotes marking anything that has not been verified on a physical unit. Read it before committing to a device.
:::

## Fully supported

These three have the fullest hardware coverage: screen, LEDs, buttons, sensors and relays where the model has them.

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
The original Shelly Wall Display ships Android 7.0, which is older than the minimum supported.
:::

## What decides whether a panel works

- **Android version.** Android 8.0 or newer.
- **System WebView.** The dashboard needs a current one. Many panels ship with a very old WebView, and updating it is part of [preparing the panel](/install/prepare-a-panel/).
- **Debugging access.** The installer uses Android's debugging interface, so the panel has to let you turn it on in developer options. Almost all do.
- **A hardware profile.** The panel's own hardware reaches Home Assistant through a profile for that model. Without one you still get a fast dashboard, but not the LEDs, buttons, relays and sensors as entities.
- **Root, sometimes.** A few capabilities on some models need root. The hardware pages say which, and what the route is.

## Not on the list?

Hardware support is data, not code, so a new panel is a profile rather than a new build of the app, and the fastest way to get your model supported is to report it. Say what the model is and what happened in the [issues](https://github.com/maxlyth/ha-paneld/issues), and if you are inclined, the [profile documentation](https://github.com/maxlyth/ha-paneld/tree/main/docs/profiles) describes what a profile contains. Every report, working or not, moves the project closer to supporting every panel.
