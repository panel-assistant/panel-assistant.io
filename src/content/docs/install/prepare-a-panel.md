---
title: Prepare the panel
description: The two things a panel needs before Panel Assistant can install on it, and the WebView update that decides whether the first dashboard looks right.
---

Two things need to be true before you add a panel, and a third decides whether the first dashboard looks right. None of them need a command line.

## 1. Developer options and debugging are on

The installer talks to the panel through Android's debugging interface, which every Android device has but ships turned off. Turning it on means opening developer options on the panel and enabling debugging: **USB debugging** for the [USB route](/install/install-over-usb/), or **wireless debugging**, sometimes called network ADB, for the network route. The exact sequence differs per model and is covered in the [hardware pages](/hardware/).

The first time the installer connects, the panel shows an authorisation prompt on its own screen. Someone has to accept it there; it cannot be accepted remotely.

## 2. The panel has a fixed address

For the network route, give the panel a fixed address or a DHCP reservation so that it does not move. You use that address to add it, and afterwards for the panel's own status page on port 8888. A panel installed over USB can be given its address afterwards.

## 3. The system WebView is current

The dashboard is drawn by the panel's system WebView, and panels routinely ship with one that is years out of date. An old WebView gives a blank screen, a partly drawn dashboard or script errors that look like a fault in the panel app. It is the single most common first-run problem by a wide margin.

Update it before you judge anything else. The procedure, including the panels that make it awkward, is in [Updating the system WebView](/hardware/guides/update-the-webview/).

## Before you change anything irreversible

Panel Assistant itself does not reflash or root anything. Some panels can be rooted or reflashed by hand, and some of that is recoverable and some of it is not. If you are going down that route, read [install safety](/manage/install-safety/) first, and see [Updates and recovery](/manage/updates-and-recovery/) for what can be backed up and what cannot.
