---
title: Connect a panel
description: Putting your dashboard on the panel, and how the panel's own hardware shows up in Home Assistant.
---

A panel that has been added to Home Assistant connects to it in two ways. One puts a dashboard on the screen. The other brings the panel's own hardware in as entities.

## The dashboard on the screen

Open the panel's status page in your browser, at its address on port 8888, and choose the dashboard you want on the wall. The panel loads that dashboard itself, works out which entities it shows, and asks Home Assistant for only those, which is what keeps it fast. Details of how the dashboard is loaded and what the panel does if it fails to load are in the [built-in renderer](/manage/built-in-renderer/) page.

## The panel's hardware in Home Assistant

The screen, LEDs, buttons, sensors and relays that your model has appear in Home Assistant as entities on the panel's device, so a physical button can trigger an automation and an LED can show the state of anything. Which entities you get depends on the hardware profile for the model; the [hardware pages](/hardware/) say what each panel exposes.

Under the hood these entities arrive through Home Assistant's MQTT integration, so Home Assistant needs a broker it is already using, such as the Mosquitto add-on, and the panel needs to be told about it. You can enter the broker details on the panel's status page. Once that is done the entities appear on their own, with nothing to configure on the Home Assistant side.

## The panel's status page

Each panel serves its own page on your local network on port 8888. It is where you choose the dashboard, enter the broker details, see what the panel is doing and read its diagnostic report. It is designed for a trusted home network, so treat access to it the same way you treat access to the panel itself. The [API reference](/reference/api/) and [security mode](/manage/security-mode/) cover what it offers and the trust model.
