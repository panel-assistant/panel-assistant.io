---
title: Troubleshooting
description: The things that usually go wrong with a wall panel, and where to look first.
---

Start with the panel's device in Home Assistant, which has a status sensor and a diagnostics download, and with the panel's own status page at its address on port 8888, whose `/diag` report answers most of the questions below without guesswork.

## The dashboard is blank, half-drawn, or full of script errors

Check the system WebView first. This is the most common first-run failure by a wide margin, and an old WebView produces exactly these symptoms while looking like a fault in the panel app. The procedure is in [Updating the system WebView](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md#updating-the-system-webview).

If the WebView is current, the [startup and recovery](https://github.com/maxlyth/ha-paneld/blob/main/docs/built-in-renderer.md#startup-and-recovery) section covers what the panel does when a dashboard fails to load and how to see why.

## The dashboard is slow

Some of this is the panel and some of it is the dashboard. [Performance](https://github.com/maxlyth/ha-paneld/blob/main/docs/performance.md) covers what the panel's status page can measure and what tends to help, and the [hardware reference](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md) ranks the supported panels so you can tell whether you are asking too much of the hardware.

## The installer cannot reach the panel

Over the network: confirm the panel's address and that wireless debugging is still turned on, because some panels turn it off again after a reboot. The first connection from a new computer raises an authorisation prompt on the panel's screen that has to be accepted there. Over USB: make sure you are using a Chromium-based browser, that the cable goes to the computer running the browser, and that USB debugging is on. How to reach developer options and turn debugging on differs per model and is covered in [Prepare the panel](/install/prepare-a-panel/) and the [hardware pages](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md). If the panel simply will not accept a network connection, [install over USB](/install/install-over-usb/) instead: it needs no network at all.

## The panel's hardware is missing from Home Assistant

The panel's entities arrive through Home Assistant's MQTT integration, so check that the panel has the right broker details on its status page and that Home Assistant is using the same broker. If some entities appear and others do not, that is usually the hardware profile for the model rather than a connection problem. The [hardware pages](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md) say what each panel exposes.

## Something else

If the answer is not on this site or in the reference documentation it links to, ask in the [integration issues](https://github.com/panel-assistant/ha-integration/issues) or, for anything about the panel app itself, the [ha-paneld issues](https://github.com/maxlyth/ha-paneld/issues). Include the panel model, the version from the panel's device page and the diagnostics download, because those three are what any answer will start from. The diagnostics are already redacted, but read them through before you post them in public and remove anything left that identifies your panel, your network or your Home Assistant setup.
