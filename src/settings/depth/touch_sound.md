---
spec: ['e42c8c262025', '4927476887b1', '762c9bf1e36c']
help: 'Audible tap feedback (system touch sounds).'
---

The dashboard runs in a web view, which does not play Android's touch sounds, so Panel Assistant plays its own short click when the screen is tapped, and also turns Android's system touch sounds on or off for the panel's native screens. The click plays at the panel's media volume, so it follows that volume rather than the ringer or notification volume.

The setting changes immediately and is also a switch on the panel's device in Home Assistant, which makes it easy to silence taps at night from an automation. It does not affect the on-screen keyboard's own key sounds.
