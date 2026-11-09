---
title: Install safety
description: What Panel Assistant checks before it changes a panel, why an interrupted install is safe to run again, and what it backs up before an update.
---

Panel Assistant installs and updates panels from Home Assistant, and it is built so that an install gives the same result whether it runs once or is run again after an interruption. This page sets out what it checks and what it keeps.

## Checked before anything changes

Both installers look at the panel before they change it. The network installer checks what is already on the panel and asks you to confirm the install, and a panel that already runs the panel app is adopted rather than reinstalled. The USB installer does not overwrite a different existing installation: if the exact selected build is already installed, it finishes that build's setup, and if another build is installed, it reconnects that build to Panel Assistant without installing an update.

The release comes from your own Home Assistant. Home Assistant checks it before handing it to the installer, so nothing reaches the panel that Home Assistant has not verified. [Install over USB](/install/install-over-usb/) and [Add a panel](/install/installing-ha-paneld/) describe each route.

## Safe to run again

An install that stops part way can be run again. Over USB, the installer keeps its progress in your browser, checks any step it was interrupted on before doing anything else, and carries on from there rather than starting over. Over the network, adding the panel again with the same address makes Home Assistant check the panel again before it changes anything; if the panel app is already installed, Home Assistant connects it and installs nothing.

When Home Assistant cannot tell how far an install got, it stops rather than guess, and its message says so. [Troubleshooting](/manage/troubleshooting/#a-network-install-stopped-partway) explains each message and what to do next.

## Backed up before every update

Panel Assistant backs up the panel's settings before each update and keeps the last five backups for each panel. After the update it confirms that the panel came back healthy.

Before a change you are unsure about, and always before removing the app or clearing its data, make a full backup yourself: on the panel's web interface, open **Install**, then **Backup**, and check that the downloaded `.hpb` file is not empty. It carries settings, durable panel state, the profile catalogue and an eligible login held by a separate dashboard app. The learned entity catalogue and the proximity and ambient histories are learned again rather than restored. Restore it from **Install**, then **Restore**, on the same page.

## What Panel Assistant leaves alone

Panel Assistant does not reflash or root a panel, and it never touches the panel's firmware. Firmware-level backup and restore on some rooted panels is a separate, manual job, described in [firmware backup and restore](/hardware/guides/firmware-backup-and-restore/). [Updates and recovery](/manage/updates-and-recovery/) covers what can be recovered when something goes wrong.
