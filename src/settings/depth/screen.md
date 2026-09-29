---
spec: 4df5b7926a82
related:
  - /manage/adaptive-brightness/
---

This row has no value to edit. Its switch decides whether the panel's screen is reported to Home Assistant as a light entity, which is on by default. The entity works in both directions: turning it off in Home Assistant puts the screen to sleep, turning it on wakes it, and setting a brightness sets the backlight level.

A brightness set from Home Assistant is recorded as a manual choice, so with [Adaptive brightness](#auto_brightness) on it is treated the same way as a change made on the panel. Changes made on the panel are reported back to Home Assistant once the level has settled, so a slider being dragged does not fill the history with intermediate values.

Turn the switch off if you do not want the screen in Home Assistant at all; the entity is then removed rather than left unavailable.
