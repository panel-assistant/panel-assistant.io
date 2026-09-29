---
spec: 36085f8baca7
related:
  - /manage/adaptive-proximity/
---

**Panel** uses the panel's own proximity sensor, after it has learned that sensor on the panel. **Home Assistant** instead watches the presence devices in the Home Assistant Area this panel is assigned to, and the Configure page lists those devices so you can include or leave out each one. It checks that assignment and shows the Area it found; until the panel has an Area, [Auto sleep](#auto_sleep) cannot be switched on with this source.

Choose Home Assistant when the room already has a better presence sensor than the panel, or when the panel has no usable proximity sensor. New installations start on Panel. An installation that already had auto sleep configured before this choice existed keeps the Home Assistant behaviour it had. A change takes effect straight away and restarts the auto sleep decision with the new source.
