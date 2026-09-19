---
title: Choose a panel
description: The Android wall panels Panel Assistant supports today, what makes a panel a good fit, and how to get a model that is not listed supported.
---

Most wall panels are bought from overseas marketplaces on little more than a listing and a hope. This page is the check to do before you buy. Every model listed here runs Panel Assistant, and owners have confirmed all of them on real hardware except the Shelly Wall Display family, where one X2i unit has been tested and the rest of the family is documented and waiting for a first confirmed unit.

:::tip
Each model has its own [hardware page](/hardware/) with its fact sheet, what reaches Home Assistant, and how to get it running.
:::

## Generic support: every other Android panel

**A panel that is not named on this page is not an unsupported panel.** Panel Assistant does not need to recognise your hardware to run on it. Any panel that meets the requirements further down starts on the Generic profile, and for most people that is already the panel they wanted: the Home Assistant dashboard on the screen, screen brightness and sleep, audio, navigation, and the standard Android sensors such as light and proximity, all arriving in Home Assistant as entities on the panel's own device.

What a model's own profile adds is the hardware peculiar to that model: RGB LEDs, physical buttons, relays, vendor radios and climate chips. Plenty of panels have none of those, and plenty of owners never need the ones they have. In those cases Generic is not a lesser setting to be endured until something better arrives, it is the whole feature set.

So buy on the requirements below rather than on this list, and treat a named profile as a bonus where it exists.

## Full support

Tested on units in hand, with the fullest hardware coverage: screen, LEDs, buttons, sensors and relays where the model has them.

- **[Sonoff NSPanel Pro](/hardware/panels/sonoff-nspanel-pro/)** (including the 120 and 86 variants)
- **[Tuya TPA10](/hardware/panels/tuya-tpa10/)**
- **[Electron WF1589T](/hardware/panels/electron-wf1589t/)**

## Community-tested

Owners run Panel Assistant on these models. Their profiles were built from owners' reports, and each hardware page shows exactly which of the panel's hardware reaches Home Assistant.

- **[ZHICAI SMT1019](/hardware/panels/zhicai-smt1019/)**
- **[ZX-SMT156 / RK3566_T](/hardware/panels/zx-smt156/)**
- **[Smatek S9E](/hardware/panels/smatek-s9e/)**

## Preliminary

Examined on one physical unit, with hardware coverage still being confirmed.

- **[Shelly Wall Display X2i](/hardware/panels/shelly/wall-display-x2i/)**

## Documented

Profiles written from firmware research, ready for the first owner to confirm on a unit. If you have one, a report is the quickest way to move it up this page.

- [Shelly Wall Display](/hardware/panels/shelly/) X2, X1i and XL

## What makes a panel a good fit

- **Android 8.0 or newer.**
- **Developer options.** The installer uses Android's debugging interface, which almost every panel lets you turn on.
- **Any system WebView.** Vendors often ship a browser engine years out of date. Panel Assistant checks it, and where the panel allows, installs a known-good version for you. [Preparing the panel](/install/prepare-a-panel/) covers the rest.
- **A hardware profile, only if you want the extras.** Everything above is enough for the Generic profile. A model's own profile is what reaches the LEDs, buttons, relays and model-specific sensors, as [Generic support](#generic-support-every-other-android-panel) describes.
- **Root, for a few extras.** A few capabilities on some models need root. Each hardware page says which ones, and the path to get it.

## Not on the list?

Hardware support is data, not code, so a new panel is a profile rather than a new build of the app, and the fastest way to get your model supported is to report it. Say what the model is and what happened in the [issues](https://github.com/maxlyth/ha-paneld/issues), and if you are inclined, the [profile documentation](/reference/profiles/) describes what a profile contains. Every report, working or not, moves the project closer to supporting every panel.
