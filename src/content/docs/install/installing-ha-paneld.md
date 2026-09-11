---
title: Add a panel
description: Adding a panel from Home Assistant, over the network or over a USB cable.
---

Adding a panel is done from Home Assistant, with no command line. There are two routes, and both end with the panel appearing as a device.

Whichever you take, work through [Prepare the panel](/install/prepare-a-panel/) first.

## Over the network

For a panel that is already on your network. Go to **Settings**, **Devices and services**, add **Panel Assistant**, and give it the panel's address. The integration checks what is on the panel, asks you to approve a debugging prompt on the panel's own screen the first time, installs the panel app, starts it, and only then creates the device. If the panel is already running the app, it adopts it instead, which is quicker.

## Over USB

For a panel that is still in the box, or whose vendor software makes network access awkward. Plug it into your laptop and install from your browser, with nothing crossing your network. It is started from the Panel Assistant page in the sidebar and needs a Chromium-based browser. See [Install over USB](/install/install-over-usb/).

## What the installer protects

Both routes check the panel before changing anything and refuse to install over an existing installation rather than risk what is on it. The network route takes a snapshot of the panel's data before it makes a change. If an install is interrupted it can be run again and will check any half-finished step before carrying on. The [safety notes](https://github.com/maxlyth/ha-paneld/blob/main/docs/provisioning-safety.md) describe exactly what is protected and when the installer stops.

## After it is installed

The panel appears as a device with a status sensor and diagnostics, and on the Panel Assistant page in the sidebar. The panel also serves its own status page on your network on port 8888, which is where you point it at a dashboard. Continue with [Connect a panel](/home-assistant/connect-a-panel/).

## Other ways in

There is also a [command-line installer](/manage/command-line-install/) for people who prefer one, and it is what the project used before the integration existed. You do not need it.
