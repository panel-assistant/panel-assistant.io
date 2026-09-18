---
title: How it works
description: What Panel Assistant puts on a panel, what stays in Home Assistant, and why it can be fully open source.
---

Panel Assistant has two parts. One lives in Home Assistant and is what you see and use. The other lives on each panel and is what makes the panel fast.

## In Home Assistant: the integration

The integration is what you install through HACS. It is where a panel gets added, where every panel appears as a device with its own status and diagnostics, and where a Panel Assistant page in the sidebar shows all of your panels together with whether each one is reachable, what version it is running and whether anything needs attention.

It is also the installer. Give it a new panel's address, or plug a new panel into your laptop, and it checks what is there, installs the panel app, starts it, and only then creates the device. If a panel is already running the app, it adopts it instead.

## On the panel: the app

A wall panel is a small Android computer, and the reason most of them feel slow is the software that came with them. Panel Assistant replaces the part of that software that matters with its own app, which does three things.

- **Renders your dashboard.** The app loads your existing Home Assistant dashboard itself, works out which entities that dashboard actually shows, and asks Home Assistant for only those. On a cheap panel that is most of the difference between lag and no lag.
- **Runs the panel's hardware.** The screen, its brightness and sleep, the LEDs, buttons, relays, proximity and light sensors and whatever else the model has are driven directly and appear in Home Assistant as entities on the panel's device. Each model is described by a hardware profile: plain text you can read, edit and validate in your browser on the panel, with no development tools. A panel the project has never met starts on the conservative Generic profile, which gives it the dashboard, sensors, brightness, audio and navigation that any Android device can provide, and gains the rest as its profile is filled in. The running panel checks every declared capability before using it, so a missing feature is shown locked and explained rather than left broken, and a profile that fails at startup rolls back to the last one that worked.
- **Behaves like an appliance.** The app takes the place of the vendor launcher, gives a button-less panel an on-screen way to get around, serves its own status page on your network, and recovers on its own when something goes wrong, so a panel can be fitted once and left alone.

That app is called ha-paneld. The name comes from its history as a background helper that other dashboard software relied on, and it has since grown into the whole panel side of the product. You will meet the name in the reference documentation and in the panel's own status page, and it is worth knowing so that nothing surprises you, but you never have to type it or think about it to use Panel Assistant.

## Why it can be open source

Most panel makers ship their hardware support as closed libraries that only their own app is allowed to use. ha-paneld does not use them. It drives each panel's hardware directly, through its own per-model profiles, which took a lot of work and is why the project has hardware support at all. It is also why the whole thing can be given away: there is no vendor code inside it, so there is nothing to stop it being free and open source under permissive licences, for every make of panel.

For the same reason, hardware support is where the project most needs help. Every panel that reports in, working or not, makes the next profile better. See [Choose a panel](/install/supported-panels/) for where support stands today.

## Where the pieces live

| Piece                   | What it is                                                                         | Where                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Panel Assistant         | The Home Assistant integration: installer, devices, and the all-panels page.       | [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration) |
| ha-paneld               | The app on the panel: dashboard, hardware, launcher, status page.                  | [panel-assistant/android](https://github.com/panel-assistant/android)               |
| Hardware profiles       | The per-model descriptions that tell the app what a panel has and how to drive it. | [Hardware reference](/hardware/)                                                    |
| Reference documentation | The API, hardware profiles and security model in detail.                           | [Reference](/reference/api/)                                                        |

## What it is not

It is for dedicated wall panels. Tablets and phones can run it, but anything with a battery has a cable, and the design assumes a mains-powered panel that is set up once and left alone. It is not a dashboard builder; it runs the dashboards you already have. And it is not finished: the direction is universal hardware support and hands-off management of every panel.
