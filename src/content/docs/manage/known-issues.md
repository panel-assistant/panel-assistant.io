---
title: Known issues in 1.0.0-rc1
description: Known limitations of Panel Assistant 1.0.0-rc1 and the matching panel app, and what to do about each.
---

Panel Assistant 1.0.0-rc1 and the matching panel app are release candidates. This page lists known limitations and what to do about each. Read [Upgrading to 1.0](/manage/upgrade-to-1-0/) first: it covers what must be true before you install and why a panel on 1.0 cannot go back to 0.9. Report anything else in the [issue tracker](https://github.com/panel-assistant/ha-integration/issues), with the panel model and what you saw.

## A panel still on the 0.9 app may need its ADB connection restored

The Repair saying a panel needs app 1.0.0-rc1 means its app cannot talk to Panel Assistant 1.0 yet. If Home Assistant also says the panel cannot receive app updates, follow that Repair to restore its update route. For a panel with network debugging switched off, plug it into your computer and start the USB installer from Home Assistant, as described in [a panel that cannot be updated](/manage/updates-and-recovery/#a-panel-that-cannot-be-updated). On a panel that already has the app, the USB installer can reconnect it without reinstalling: if asked, tick **Always allow from this computer** and tap **Allow** on the panel. The installer turns network debugging back on so Home Assistant can update the app.

## The sidebar cannot open a panel until it runs the 1.0 app

In 1.0 the Panel Assistant sidebar shows a panel's pages over the panel's own connection to Home Assistant. A panel still on a 0.9 app cannot open its pages there. Update the panel app first.

## Voice starts on where the device profile declares a microphone

Voice starts on by default when the panel's device profile declares a microphone, unless you had already turned it off. If you do not want the panel listening for a wake word, turn **Voice assistant** off under **Voice** on the panel's **Configure** page.

## A screen lock PIN may be needed after a full screen-off

On panels whose screen-off route uses Android's screen timeout or device administration, a configured screen lock PIN may be required when the screen wakes. Remove the PIN if the panel should wake directly to its dashboard.

## Two entities are gone

The separate camera snapshot image entity is removed; use the panel's camera entity. On a panel with a speaker the separate volume number is removed; use the media player's volume, with `media_player.volume_set`. A Repair names the automations and scripts that still use the volume number. There is no matching Repair for the removed snapshot image, so check its consumers yourself.

## Restoring a backup onto a panel without root can skip settings

A settings backup taken on a rooted panel can hold settings a panel without root cannot apply. The restore lists unavailable settings it skips and applies the supported settings. Check the restore result for skipped settings or failures.
