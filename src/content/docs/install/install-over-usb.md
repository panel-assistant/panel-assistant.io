---
title: Install over USB
description: Getting a brand-new panel running from your browser with a USB cable, before it goes on the wall.
---

The USB route is for a panel that is still in the box, or one whose vendor software makes network access awkward. Plug the panel into the computer you are sitting at and your browser installs the panel app straight down the cable. The panel does not need network ADB. Your browser must stay connected to Home Assistant, which supplies the verified release. Most people use it exactly once, before the panel is mounted.

## It starts inside Home Assistant

The USB installer is opened from the Panel Assistant page in the Home Assistant sidebar, by an administrator. Home Assistant checks the release and hands it to the installer, which opens in its own secure window. This is why there is no install button on this site: the page that does the work only accepts a release from your own Home Assistant, so nothing gets onto your panel that Home Assistant has not verified.

## What you need

- The [integration](/home-assistant/custom-integration/) installed, and an administrator account.
- A Chromium-based browser such as Chrome or Edge. Firefox and Safari cannot talk to USB devices.
- A USB cable from the panel to the computer or phone running that browser. Not to the Home Assistant server.
- USB debugging turned on in the panel's developer options, and someone at the panel to approve the authorisation prompt when it appears. The [hardware pages](/hardware/) show how to reach developer options on each model.

## What happens

1. Choose a version on the Panel Assistant page. Home Assistant offers the newest compatible versions it can verify. Test versions are marked and are offered when the running integration permits them.
2. The installer window verifies the release and asks you to pick the panel from the browser's USB prompt.
3. Approve the USB debugging prompt on the panel's screen.
4. Confirm. Nothing on the panel changes until you do. The installer refuses to overwrite a different existing installation; if the exact selected build is already installed, it finishes that build's setup.
5. Keep the cable and the tab connected until it reports done, then finish the guided setup on the panel itself.

If the cable comes out or the window closes part way, plug it back in, transfer the same release from Home Assistant again and reconnect the same panel. The installer keeps its progress in your browser, checks any step it was interrupted on before doing anything else, and carries on from there rather than starting over.

## Afterwards

The panel is running the app, and the installer tries to add it to Home Assistant automatically. If Home Assistant could not reach it, add it once the panel is on Home Assistant's network. The USB installer does not update a panel that already has the app; for that see [Updates and recovery](/manage/updates-and-recovery/).
