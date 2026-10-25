---
title: Connect a panel
description: Putting your dashboard on the panel, and how the panel's own hardware shows up in Home Assistant.
---

A panel that has been added to Home Assistant connects to it in two ways. One puts a dashboard on the screen. The other brings the panel's own hardware in as entities.

## The dashboard on the screen

You choose the dashboard in the panel's setup wizard when the panel is added. To change it later, select **Visit** on the panel's device page in Home Assistant to open its status page, and pick another one. The panel loads that dashboard itself. With [entity filtering enabled](/manage/performance/), it learns which entities the dashboard uses and asks Home Assistant for only those. Details of how the dashboard is loaded and what the panel does if it fails to load are in the [built-in renderer](/manage/built-in-renderer/) page.

## The panel's hardware in Home Assistant

The screen, LEDs, buttons, sensors and relays that your model has appear in Home Assistant as entities on the panel's device, so a physical button can trigger an automation and an LED can show the state of anything. Which entities you get depends on the hardware profile for the model; the [hardware pages](/hardware/) say what each panel exposes.

## The panel's status page

Select **Visit** on the panel's device page in Home Assistant to open its status page. Each panel serves this page on your local network, using port **8888** by default (for example, `http://<panel>:8888/`). It is where you choose the dashboard, see what the panel is doing and read its diagnostic report. It is designed for a trusted home network, so treat access to it the same way you treat access to the panel itself. The [API reference](/reference/api/) and [security mode](/manage/security-mode/) cover what it offers and the trust model.
