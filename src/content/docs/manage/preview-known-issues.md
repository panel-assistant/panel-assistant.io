---
title: Known issues in the 1.0 preview
description: What owners of the Panel Assistant 1.0.0-preview1 pair have met so far, and what to do about each.
---

Panel Assistant 1.0.0-preview1 and the matching panel app are an early preview for people who want to try 1.0 before the release candidates. This page lists what you may meet, with the way round each. Read [Upgrading to 1.0](/manage/upgrade-to-1-0/) first: it covers what must be true before you install and why a panel on 1.0 cannot go back to 0.9. Report anything else in the [issue tracker](https://github.com/panel-assistant/ha-integration/issues), with the panel model and what you saw, so it can be fixed in the next preview.

## The 1.0.0-preview1 released on 18 October was withdrawn

A Panel Assistant 1.0.0-preview1 was published on 18 October 2026 before the matching panel app was published, so it offered panels nothing and its Repair pointed at an update that did not exist. It was withdrawn on 23 October and replaced by this release, which keeps the same version name. If you installed the earlier one and still have it, HACS shows Panel Assistant as up to date and does not offer the replacement: in HACS open **Panel Assistant**, choose **Redownload**, pick **1.0.0-preview1** and restart Home Assistant. If you went back to 0.9.0, the usual update path applies.

## "Needs app 1.0.0-preview1" with no update to install

Panel Assistant 1.0 installs the panel app over the panel's approved ADB connection. When the panel has none, for example a Meta Portal after a restart or a Shelly Wall Display after a reset, the Repair tells you to install an update that never appears. Plug the panel into your computer and start the USB installer from Home Assistant, as described in [a panel that cannot be updated](/manage/updates-and-recovery/#a-panel-that-cannot-be-updated). On a panel that already has the app the installer installs nothing: accept **Allow USB debugging** on the panel, tick **Always allow from this computer**, and the installer turns network debugging back on. Home Assistant offers the update from there. A Meta Portal turns network debugging off again at its next restart; on it, the app's own one-tap update is the normal route after that.

## Some panels update only after a tap on the panel

A panel the integration cannot reach over ADB installs its own update, and Android asks for confirmation on the panel's screen. Someone has to tap **Install** there. Reconnecting the panel by USB, as above, brings back updates that need no tap.

## Do not redownload 0.9.0 over 1.0

Two Repairs in 1.0, for a panel still on MQTT and for a panel still running the old app, say to choose **Redownload** in HACS and pick 0.9.0. Do not: 0.9.0 installed over 1.0 no longer finds a setting 1.0 removed, and hands panels that already moved back to MQTT, where the 1.0 panel app does not answer. Follow [if a move was not finished](/manage/upgrade-to-1-0/#if-a-move-was-not-finished) instead, which restores the Home Assistant backup you made before updating while no panel runs the 1.0 app yet, and says to ask first if one already does.

## The sidebar cannot open a panel until it runs the 1.0 app

In 1.0 the Panel Assistant sidebar shows a panel's pages over the panel's own connection to Home Assistant, so a panel still on a 0.9 app shows a notice that its pages could not be opened. The notice clears when the panel updates. Until then the panel's own page at its address on port 8888 works as before.

## Voice is on by default where the panel has a microphone

On a Sonoff NSPanel Pro, a Tuya TPA10, an Electron WF1589T, a Shelly Wall Display X2i, a Meta Portal 10 (2nd generation) and an Electron WF2489T, the voice assistant starts on unless you had already turned it off. If you do not want a panel listening for a wake word, turn it off under **Voice** on the panel's **Configure** page, or disable the panel's Assist satellite entity in Home Assistant.

## A screen lock PIN is asked for after a full screen-off

On a panel without root, 1.0 switches the screen fully off through Android's device administration instead of dimming it. If that panel has a screen lock PIN, Android asks for the PIN when the screen wakes. Remove the PIN on a panel that is meant to wake to its dashboard.

## Two entities are gone

The separate camera snapshot image entity is removed; use the panel's camera entity. On a panel with a speaker the separate volume number is removed; use the media player's volume, with `media_player.volume_set`. A Repair names the automations and scripts that still use the volume number. Nothing names those that used the snapshot image, so check them yourself.

## Restoring a backup onto a panel without root skips some settings

A settings backup taken on a rooted panel can hold settings a panel without root cannot apply. The restore lists what it skipped instead of failing; the rest is applied.
