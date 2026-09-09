---
title: Custom integration
description: The Home Assistant custom integration for ha-paneld, which is still unreleased.
---

:::caution[Not released]
The custom integration has no release yet. It is still in development, and everything on this page describes work in progress that may change before it ships. To connect a panel today, use [MQTT discovery](/home-assistant/connect-a-panel/).
:::

A Home Assistant custom integration is being built alongside the app, in a separate repository: [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration).

## What it is intended to do

The integration is aimed at the setup problem rather than at day-to-day control. From inside Home Assistant it is intended to install ha-paneld on a clean panel over network ADB, or adopt a panel that is already running it, and then present that panel as a Home Assistant device with a diagnostic status sensor and downloadable diagnostics.

Setting up a panel would run as a config flow: give it the panel's address, let it check what is there, approve the ADB debugging prompt on the panel's own screen if it asks, confirm the release it is about to install, and watch it through. Adopting an existing installation is the shorter path of the two.

## What it is not intended to do

It does not replace MQTT discovery. MQTT stays the authority for the panel's entities and for controlling them, and the integration is not planned to proxy panel traffic, reproduce those entities, or configure ha-paneld after it launches. It is also not planned to upgrade or overwrite an existing installation.

## Requirements as they currently stand

Home Assistant 2026.8.3 or newer, network ADB reachable on the panel, physical access to the panel to approve the debugging prompt, and internet access from Home Assistant to fetch the release.

Both figures and behaviours above are provisional until there is a release. The repository is the place to watch.
