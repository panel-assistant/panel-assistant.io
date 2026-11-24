---
title: Known issues
description: Known limitations of Panel Assistant and the matching panel app, and what to do about each.
---

This page lists known limitations and what to do about each. Report anything else in the [issue tracker](https://github.com/panel-assistant/ha-integration/issues), with the panel model and what you saw.

## Voice starts on where the device profile declares a microphone

Voice starts on by default when the panel's device profile declares a microphone, unless you had already turned it off. If you do not want the panel listening for a wake word, turn **Voice assistant** off under **Voice** on the panel's **Configure** page.

## A screen lock PIN may be needed after a full screen-off

On panels whose screen-off route uses Android's screen timeout or device administration, a configured screen lock PIN may be required when the screen wakes. Remove the PIN if the panel should wake directly to its dashboard.

## Two entities are gone

The separate camera snapshot image entity is removed; use the panel's camera entity. On a panel with a speaker the separate volume number is removed; use the media player's volume, with `media_player.volume_set`. A Repair names the automations and scripts that still use the volume number. There is no matching Repair for the removed snapshot image, so check its consumers yourself.

## Restoring a backup onto a panel without root can skip settings

A settings backup taken on a rooted panel can hold settings a panel without root cannot apply. The restore lists unavailable settings it skips and applies the supported settings. Check the restore result for skipped settings or failures.
