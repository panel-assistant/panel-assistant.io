---
title: Custom integration
description: Installing the Panel Assistant custom integration through HACS, which is where setting up a panel starts.
---

Setting up a panel starts here. The Panel Assistant custom integration runs inside Home Assistant and handles getting ha-paneld onto a panel, so you do not have to sideload the app by hand. It lives in its own repository, [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration).

:::caution[Beta]
The integration is a beta, and its own readme describes it as a proof of concept rather than a finished installer. There is no stable release. Upgrading a panel through it is not supported yet, and browser USB installation is experimental. Expect it to change.
:::

## Install it

You need Home Assistant 2026.8.3 or newer, and [HACS](https://hacs.xyz/).

1. In HACS, add `https://github.com/panel-assistant/ha-integration` as a custom repository with the category **Integration**.
2. Download **Panel Assistant**, then restart Home Assistant.
3. Go to **Settings → Devices & services → Add integration**, choose **Panel Assistant**, and follow the prompts.

[Open in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=panel-assistant&repository=ha-integration&category=integration) opens step one directly on your own Home Assistant.

## What it does

From inside Home Assistant it can install ha-paneld on a clean panel over network ADB, or adopt a panel that is already running it. Either way the panel then appears as a Home Assistant device with a status sensor and downloadable diagnostics.

Setting up a panel runs as a config flow: give it the panel's address, let it check what is there, approve the ADB debugging prompt on the panel's own screen if it asks, choose the ha-paneld release to install, and watch it through. Release candidates are marked as such in the picker. Adopting an existing installation is the shorter path of the two.

For a network installation, [prepare the panel](/install/prepare-a-panel/) first so ADB is reachable. If an installation stops part way, the [recovery guide](https://github.com/maxlyth/ha-paneld/blob/main/docs/provisioning-safety.md) covers what to do.

## What it does not do

It does not replace MQTT discovery. MQTT remains the authority for the panel's entities and for controlling them, and the integration does not proxy panel traffic, reproduce those entities, or configure ha-paneld once it is running. It does not upgrade or overwrite an existing installation.

So the integration is how a panel gets set up, and [MQTT discovery](/home-assistant/connect-a-panel/) is how it is used afterwards.

## If you used the earlier 0.1.0 integration

Remove the old integration entry under **Settings → Devices & services**, then remove its download from HACS. Add this repository, enable beta releases, download Panel Assistant and restart Home Assistant, then add the integration again using your panel's hostname or address. That replaces the integration's status entity. It does not change ha-paneld's own MQTT entities, topics or panel settings.
