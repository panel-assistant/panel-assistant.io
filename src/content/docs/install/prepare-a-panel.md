---
title: Prepare the panel
description: Network access, ADB and the system WebView update that a panel needs before ha-paneld goes on it.
---

Three things need to be true before you install anything. Getting the third one wrong is the most common cause of a first run that looks broken.

## 1. The panel is on your network

Give the panel a fixed address, or a DHCP reservation, so it does not move around. You will use that address for installation and afterwards for the panel's own HTTP interface on port 8888.

## 2. ADB over the network is reachable

Installation pushes the app to the panel over ADB on port 5555. That normally means enabling developer options on the panel and turning on network ADB. The exact sequence differs per model and is covered in the [hardware pages](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md).

The first ADB connection from a new computer usually raises an authorisation prompt on the panel's own screen. Someone has to accept it there; it cannot be accepted remotely.

## 3. The system WebView is current

ha-paneld renders the dashboard through the panel's system WebView. Panels routinely ship with a WebView years out of date, and an old one produces a blank screen, a partly drawn dashboard, or script errors that look like faults in ha-paneld.

Update it before you judge anything else. The procedure, including the panels that make it awkward, is in [Updating the system WebView](https://github.com/maxlyth/ha-paneld/blob/main/docs/hardware/README.md#updating-the-system-webview).

## What you need on your computer

`adb` and `curl`, on the same network as the panel. On Windows use Git Bash or WSL. PowerShell is not a supported shell for the installer.

## Before you change anything irreversible

Some panels can be rooted or reflashed, and some of that is recoverable and some of it is not. If you are going down that route, read [provisioning safety](https://github.com/maxlyth/ha-paneld/blob/main/docs/provisioning-safety.md) first, and see [Updates and recovery](/manage/updates-and-recovery/) for what can be backed up and what cannot.
