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

Either installer can also request a verified compatible browser-engine update on supported panels. An update that cannot finish does not prevent setup or pairing; see [Prepare the panel](/install/prepare-a-panel/) for recovery.

## What the installer protects

Both routes check the panel before changing anything. The network route adopts an existing app rather than reinstalling it. USB does not overwrite a different existing installation; if the exact selected build is already installed, it finishes that build's setup. An interrupted USB install can be retried with the same release, checking what completed before carrying on. For backups before an app update, see [Updates and recovery](/manage/updates-and-recovery/).

## What setup changes

### On the panel

Panel Assistant makes these changes only during an install or update you start, or when you confirm the Repairs issue that finishes one. Home Assistant's regular check of the panel, a reconnect or a restart never makes them again, except to finish an install you started, so a setting you change back on the panel stays as you left it until the next update. The exceptions are the accessibility service and network debugging on rooted panels, described below.

- **Home screen.** The app becomes the panel's home screen, and each install or update sets it again.
- **Permissions.** The camera and microphone where the panel has them, notifications on Android 13 or later, and the rights to modify system settings, display over other apps, install its own updates and change secure settings. A permission you turned off is left off.
- **Network debugging.** Panel Assistant updates the app over network debugging (ADB on port 5555). A USB install turns it on, and on rooted panels installing keeps it on across restarts. From panel app 1.0.5, a rooted panel leaves network debugging as its firmware has it. Turning on the panel's own **Keep ADB off** setting (off by default) closes the port once the panel connects to Home Assistant and keeps it closed, because Panel Assistant works over the app's own connection.
- **Device administrator.** Once the panel's own setup is finished, the app becomes a device administrator, which it uses only to lock the screen where Android's screen timeout does not turn it off.
- **Accessibility service.** Turned on, and turned back on each time the app starts. The app uses it to:
  - send hardware button presses to Home Assistant
  - show Back and Recents on panels without navigation keys
  - take screenshots (on Android 11 or later) and taps from the panel page on panels without root access
  - choose itself when Android asks which app is the home screen
  - press Install when Android asks to confirm the app's own update
  - on a Meta Portal, close Meta's overlay request at startup and set the device name
- **Browser engine.** On panels that need it, an install or update can update Android's WebView, the engine that draws your dashboard, as described above.
- **Display and text size.** Set once, on models that need it.
- **Meta Portal.** Meta's screensaver is turned off, Meta's control centre stops drawing its swipe-up bar over other apps, and Android's package verifier is turned off so the app can update itself. That last one is a security change: the Portal stops checking that new apps were signed by Meta before installing them.
- **Shelly Wall Display.** Shelly's launcher stops drawing its corner overlay over other apps.

Two things run on their own. After a rooted panel restarts, Home Assistant starts the app's root helper again if it has stopped; the helper looks after network debugging. Each time a Shelly Wall Display reconnects, Home Assistant checks the panel over network debugging and, if Shelly's firmware has stopped the app, presses Home once to bring it back.

On its first start, the app also mutes the ring and notification volumes, which silences the boot chime, and sets Android's screen timeout to its longest so the firmware does not dim the screen. Both can be turned off in the app's settings.

To undo setup, choose **Remove from this panel** in Panel Assistant's options for the panel. It puts back the home screen, display and text size, and vendor settings it changed; network debugging and the updated browser engine stay as they are.

### On your network and online

- **Devices that announce network debugging.** Any Android device that announces it is offered as a panel you can install onto.
- **Panels other apps know.** Panels that Fully Kiosk, Shelly, ESPHome or the Companion app already know are looked for only when you open Add panel, which briefly checks their network debugging and app ports.
  - In Panel Assistant 1.1, you can also turn on _Look for them after Home Assistant starts_ (sidebar, **All panels**, **Settings**, under _Panels other apps know_; off by default). Panel Assistant then makes the same check once in the background:
    - at least 15 minutes after Home Assistant has started, and only once it is not busy; if it stays busy for an hour after that, the check is skipped until Home Assistant next starts
    - four devices at a time, for at most seven seconds each
    - never contacting an address you have already added
    - showing each panel it finds under Discovered, and stopping when Home Assistant stops or you turn the setting off
- **Online.** The USB installer page loads from install.panel-assistant.io, and every six hours Home Assistant checks panel-assistant.io, or GitHub if that list is unavailable, for new releases of the panel app. WebView updates download from panel-assistant.io.

## After it is installed

The panel appears as a device with a status sensor and diagnostics, and on the Panel Assistant page in the sidebar. Next you finish in the panel's own setup wizard, where you name the panel and choose its dashboard. Until setup is finished, the panel's own screen shows a QR code and a **Set up** button, so you can also finish from a phone or on the panel itself. To change the dashboard later, open the panel's device page in Home Assistant and select **Visit**. If you open the panel's address directly, use its reported HTTP port; the default is 8888.

Continue with [Connect a panel](/home-assistant/connect-a-panel/).
