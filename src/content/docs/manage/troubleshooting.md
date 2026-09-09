---
title: Troubleshooting
description: The things that usually go wrong with a wall panel running ha-paneld, and where to look first.
---

Start with the panel's own diagnostic report at `/diag` on port 8888. It answers most of the questions below without guesswork.

## The dashboard is blank, half-drawn, or full of script errors

Check the system WebView first. This is the most common first-run failure by a wide margin, and an old WebView produces exactly these symptoms while looking like a fault in ha-paneld. The procedure is in [Updating the system WebView](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md#updating-the-system-webview).

If the WebView is current, the renderer's own [startup and recovery](https://github.com/maxlyth/ha-paneld/blob/main/docs/built-in-renderer.md#startup-and-recovery) section covers what it does when a dashboard fails to load and how to see why.

## The dashboard is slow

Some of this is the panel and some of it is the dashboard. [Performance](https://github.com/maxlyth/ha-paneld/blob/main/docs/performance.md) covers what can be measured and what tends to help, and the [hardware reference](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md) ranks the supported panels so you can tell whether you are asking too much of the hardware.

## The installer cannot reach the panel

Confirm the panel's address, that network ADB is enabled, and that port 5555 is reachable from the machine you are running the installer on. The first connection from a new computer raises an authorisation prompt on the panel's screen that has to be accepted there. Some panels also drop network ADB after a reboot and need it turned back on.

## The panel is missing from Home Assistant

The panel's hardware arrives through MQTT discovery, so check that the panel has the right broker details and that Home Assistant is using the same broker. The entity contracts, and what should appear for a given model, are in the [API reference](https://github.com/maxlyth/ha-paneld/blob/main/docs/api.md).

If some entities appear and others do not, that is usually the hardware profile for the model rather than a connection problem. The [hardware pages](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md) say what each panel exposes.

## Something else

There is no single troubleshooting manual yet; the material is spread across the documents linked above. If the answer is not in them, the [repository issues](https://github.com/maxlyth/ha-paneld/issues) are the place to ask. Include the panel model, the ha-paneld version and the `/diag` output, because those three are what any answer will start from. The report already omits configured network and panel identifiers, but read it through before you post it in public and remove anything left in it that identifies your panel, your network, your Home Assistant setup or your dashboard content.
