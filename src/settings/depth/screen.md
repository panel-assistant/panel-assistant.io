---
spec: 4df5b7926a82
related:
  - /manage/adaptive-brightness/
---

This row has no value to edit. Its switch decides whether the panel's screen is reported to Home Assistant as a light entity, which is on by default. The entity works in both directions:

| In Home Assistant      | On the panel                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------- |
| Turn the light **off** | The screen goes to sleep                                                               |
| Turn the light **on**  | The screen wakes; a bare `on` on a lit screen changes nothing                          |
| Set a **brightness**   | The backlight moves to that level, shown in Home Assistant as a percentage of 0 to 255 |

A brightness set from Home Assistant is recorded as a manual choice, so with [Adaptive brightness](#auto_brightness) on it is treated the same way as a change made on the panel. Changes made on the panel are reported back to Home Assistant once the level has settled, so a slider being dragged does not fill the history with intermediate values.

Turn the switch off if you do not want the screen in Home Assistant at all; the entity is then removed rather than left unavailable.
