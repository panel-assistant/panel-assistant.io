---
title: Add a panel
description: Adding a panel from Home Assistant, over the network or over a USB cable.
---

Adding a panel is done from Home Assistant, with no command line. There are two routes, and both end with the panel appearing as a device.

Whichever you take, work through [Prepare the panel](/install/prepare-a-panel/) first.

## Over the network

For a panel that is already on your network. Go to **Settings**, **Devices and services**, add **Panel Assistant**, and give it the panel's address. The integration checks what is on the panel, asks you to approve a debugging prompt on the panel's own screen if required, asks you to confirm the install, installs the panel app, starts it, and only then creates the device. If the panel is already running the app, it adopts it instead, which is quicker.

## Over USB

For a panel that is still in the box, or whose vendor software makes network access awkward. Plug it into your laptop and install from your browser over the USB cable. Your browser stays connected to Home Assistant, which supplies the verified release; the panel does not need network ADB. Start it from **Settings**, **Devices and services**, **Add integration**, **Panel Assistant**, **Install using USB on this computer**; it needs a Chromium-based browser. See [Install over USB](/install/install-over-usb/).

## What the installer protects

Both routes check the panel before changing anything. The network route adopts an existing app rather than reinstalling it. USB does not overwrite a different existing installation; if the exact selected build is already installed, it finishes that build's setup. An interrupted USB install can be retried with the same release, checking what completed before carrying on. For backups before an app update, see [Updates and recovery](/manage/updates-and-recovery/).

## After it is installed

The panel appears as a device with a status sensor and diagnostics, and on the Panel Assistant page in the sidebar. Next you finish in the panel's own setup wizard, where you name the panel and choose its dashboard. Until setup is finished, the panel's own screen shows a QR code and a **Set up** button, so you can also finish from a phone or on the panel itself. To change the dashboard later, open the panel's status page in your browser, at its address on port 8888.

Continue with [Connect a panel](/home-assistant/connect-a-panel/).
