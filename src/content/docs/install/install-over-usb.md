---
title: Install over USB
description: Getting a brand-new panel running from your browser with a USB cable, before it goes on the wall.
---

The USB route is for a panel that is still in the box, or one whose vendor software makes network access awkward. Plug the panel into the computer you are sitting at and your browser installs the panel app straight down the cable. The panel does not need network ADB. Your browser must stay connected to Home Assistant, which supplies the verified release. Most people use it exactly once, before the panel is mounted.

## It starts inside Home Assistant

The USB installer is started from Home Assistant by an administrator: go to **Settings**, **Devices and services**, **Add integration**, choose **Panel Assistant**, then **Install using USB on this computer**. The **Add panel** link on the Panel Assistant page in the sidebar opens the same choice. Home Assistant checks the release and hands it to the installer, which opens in its own secure window. This is why there is no install button on this site: the page that does the work only accepts a release from your own Home Assistant, so nothing gets onto your panel that Home Assistant has not verified.

## What you need

- The [integration](/home-assistant/custom-integration/) installed, and an administrator account.
- A Chromium-based browser such as Chrome or Edge. Firefox and Safari cannot talk to USB devices.
- A USB cable from the panel to the computer or phone running that browser. Not to the Home Assistant server.
- USB debugging turned on in the panel's developer options. If the panel shows an authorisation prompt when you connect, someone at the panel needs to accept it; some panels never ask. The [hardware pages](/hardware/) show how to reach developer options on each model.

## What happens

1. Select **Open the USB installer**. On the page that opens, keep the recommended version and press **Continue**. Home Assistant offers the newest compatible versions it can verify. Test versions are marked and are offered when the running integration permits them.
2. The installer opens in a new window and verifies the release. Press **Find my panel** and pick the panel from your browser's list.
3. If the panel asks you to allow USB debugging, tick **Always allow from this computer** and approve it on the panel's screen. Some panels do not ask, and the installer carries straight on.
4. Confirm. Nothing on the panel changes until you do. The installer refuses to overwrite a different existing installation; if the exact selected build is already installed, it finishes that build's setup.
5. Keep the cable and the window connected until it reports done. The same window then moves on to the panel's setup wizard, where you finish. The panel serves the wizard, so the computer needs to be on the same network as the panel.

If the cable comes out part way, plug it back in, wait for the panel to start, press the button on the installer's error screen and then **Find my panel**. If the installer window was closed, start again from Home Assistant and choose the same version. Either way the installer keeps its progress in your browser, checks any step it was interrupted on before doing anything else, and carries on from there rather than starting over.

## Afterwards

The panel is now running the app. A panel straight out of the box is not on your network yet, so join it to your Wi-Fi in the panel's own Settings app, before or after the install: its setup wizard and its connection to Home Assistant both need it. If the panel does not appear in Home Assistant once its setup is finished, go to **Settings**, **Devices and services**, **Add integration**, choose **Panel Assistant**, then **Add a panel on your network**, and enter the panel's address. The USB installer does not update a panel that already has the app; for that see [Updates and recovery](/manage/updates-and-recovery/).
