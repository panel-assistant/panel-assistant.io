---
title: Troubleshooting
description: The things that usually go wrong with a wall panel, and where to look first.
---

Start with the panel's device in Home Assistant, which has a status sensor and a diagnostics download, and with the panel's own status page at its address on port 8888, whose `/diag` report answers most of the questions below without guesswork.

When you need to see what the panel is doing as it happens, the **Logs** tab on that page streams the panel app's own log live, with tokens and passwords redacted.

![The Logs tab of the panel's web interface, streaming the panel app's live log with a filter box and Follow and Pause controls](/screenshots/ui-logs-dark.png)

## The dashboard is blank, half-drawn, or full of script errors

Check the system WebView first. This is the most common first-run failure by a wide margin, and an old WebView produces exactly these symptoms while looking like a fault in the panel app. The procedure is in [Updating the system WebView](/hardware/guides/update-the-webview/).

If the WebView is current, the [startup and recovery](/manage/built-in-renderer/#startup-and-recovery) section covers what the panel does when a dashboard fails to load and how to see why.

## The dashboard is slow

Some of this is the panel and some of it is the dashboard. [Performance](/manage/performance/) covers what the panel's status page can measure and what tends to help, and the [hardware reference](/hardware/) ranks the supported panels so you can tell whether you are asking too much of the hardware.

## The installer cannot reach the panel

Over the network: confirm the panel's address and that network ADB on TCP port 5555 is still turned on, because some panels turn it off again after a reboot. If the panel raises an authorisation prompt, accept it on the panel's screen. Over USB: make sure you are using a Chromium-based browser, that the cable goes to the computer running the browser, and that USB debugging is on. How to reach developer options and turn debugging on differs per model and is covered in [Prepare the panel](/install/prepare-a-panel/) and the [hardware pages](/hardware/). If the panel simply will not accept a network connection, [install over USB](/install/install-over-usb/) instead: the panel does not need network ADB, while your browser stays connected to Home Assistant for the verified release.

## A network install stopped partway

When Home Assistant stops a network install, its message says how far the install got. Find the sentence that matches yours below. In every case, do not uninstall Panel Assistant, clear its data or reset the panel: the panel's state is what tells you where the install stopped.

### No APK was installed

If the message says that no APK was installed or that no panel change was made, the panel is as it was before. Check that the panel is switched on and on your network at the same address, then add the Panel Assistant integration again and enter the same address. Home Assistant checks the panel again before it changes anything. If the install stops at the same place a second time, look at the panel and follow the next section if Panel Assistant is on it.

### Installed but not started or checked

If the message says the APK is installed but Panel Assistant did not start or did not pass its check, the app is on the panel and only the last step is missing. Open Panel Assistant from the panel's app list and wait for its setup screen. Then add the Panel Assistant integration again with the same address: when the app answers, Home Assistant offers to connect it ("Panel Assistant is installed but not connected") and installs nothing. If Home Assistant says the installed app is not the release you chose, choose the version that is installed, which the panel's Android Settings show under Apps › Panel Assistant.

### The install may have changed the panel

If the message says the install may have changed the panel, or that Home Assistant could not verify the result or cannot prove it is safe to continue, Home Assistant could not tell how far the panel got, so it stops rather than guess. Do not retry the automatic install yet. Look at the panel first: if Panel Assistant's setup screen or dashboard is showing, or the app opens from the panel's app list, follow the section above to connect it. If Panel Assistant is not on the panel, ask in the [integration issues](https://github.com/panel-assistant/ha-integration/issues) and include the panel model, the version you chose, the full message and the Home Assistant log lines from the install (search the log for `panel_assistant`).

## The panel's hardware is missing from Home Assistant

If some entities appear and others do not, that is usually the hardware profile for the model rather than a connection problem. The [hardware pages](/hardware/) say what each panel exposes.

## Something else

If the answer is not on this site or in the reference documentation it links to, ask in the [integration issues](https://github.com/panel-assistant/ha-integration/issues) or, for anything about the panel app itself, the [ha-paneld issues](https://github.com/panel-assistant/android/issues). Include the panel model, the version from the panel's device page and the diagnostics download, because those three are what any answer will start from. The diagnostics are already redacted, but read them through before you post them in public and remove anything left that identifies your panel, your network or your Home Assistant setup.
