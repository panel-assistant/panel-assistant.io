---
spec: 60186f207694
related:
  - /manage/adaptive-brightness/
---

When this is on, Panel Assistant learns the normal ambient-light pattern around the panel over up to seven days and sets the screen level itself, with no Home Assistant automation. It needs a light source: the panel's own sensor, or a Home Assistant entity chosen in [Ambient light source](#auto_brightness_ha_entity). The change applies at once.

Manual control still works while it is on. A brightness change at the panel, or from the `light.<panel>_screen` entity in Home Assistant, sets a temporary preference for four hours: automatic control drops to 20% influence and fades back to full control over that time. **Resume full auto** on the Configure page ends that early.

With it off, brightness is set by Home Assistant or by a person at the panel. In Home Assistant the setting is also a configuration switch, `switch.<panel>_auto_brightness`. The floor and response are tuned with [Minimum level](#auto_brightness_minimum_percent) and [Sensitivity](#auto_brightness_response_percent).
