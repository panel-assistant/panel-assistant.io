---
title: Prepare the panel
description: What a panel needs before Panel Assistant can install on it, and the WebView update that decides whether the first dashboard looks right.
---

One thing needs to be true before you add a panel, and a second decides whether the first dashboard looks right. Neither needs a command line.

## 1. Developer options and debugging are on

The installer talks to the panel through Android's debugging interface, which every Android device has but ships turned off. On most panels, open **Settings**, then **About**, and tap **Build number** seven times until the panel says you are a developer; **Developer options** then appears in Settings. Some vendors hide or rename this, and the [hardware pages](/hardware/) show the exact sequence for each model. In developer options, turn on **USB debugging** for the [USB route](/install/install-over-usb/), or **network ADB on TCP port 5555** for the network route. Not every panel has a network ADB switch; the hardware page for your model says whether it does, and if it has none, use the USB route. Android's paired Wireless debugging feature is a different connection method and is not supported by this installer.

If the panel asks you to authorise the connection, someone has to accept that prompt on the panel's own screen; it cannot be accepted remotely.

The panel does not need a fixed address: Panel Assistant follows a panel whose address changes.

## 2. The system WebView is current

The dashboard is drawn by the panel's system WebView, also called its browser engine. An old WebView can leave a dashboard blank or partly drawn.

In the unreleased 1.0.0-rc2 version, both the network and USB installers can request a verified compatible browser-engine update on supported panels. If that update cannot finish, setup and pairing remain available. An unfinished attempt can be continued from the panel's update Repair in Home Assistant: choose **Try again**. It checks existing work before requesting another attempt; failed updates are not retried on a schedule.

In that version, the setup wizard warns when the built-in browser engine is too old. You can finish setup and pairing, but the dashboard may still fail to display. If the panel cannot install the update, follow [Updating the system WebView](/hardware/guides/update-the-webview/).

## Before you change anything irreversible

Panel Assistant itself does not reflash or root anything. Some panels can be rooted or reflashed by hand, and some of that is recoverable and some of it is not. If you are going down that route, read [install safety](/manage/install-safety/) first, and see [Updates and recovery](/manage/updates-and-recovery/) for what can be backed up and what cannot.
