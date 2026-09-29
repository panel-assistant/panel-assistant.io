---
spec: 36085f8baca7
related:
  - /manage/adaptive-proximity/
---

| Choice                                    | What watches for people                                                                                                                           | When to pick it                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Panel** (default for new installations) | The panel's own proximity sensor, once the panel has learned it                                                                                   | The panel has a usable proximity sensor and faces the people who use it                    |
| **Home Assistant**                        | The presence devices in the Home Assistant Area this panel is assigned to; the Configure page lists them so you can include or leave out each one | The room already has a better presence sensor, or the panel has no usable proximity sensor |

With **Home Assistant**, the panel checks its Area assignment and shows the Area it found. Until the panel has an Area, [Auto sleep](#auto_sleep) cannot be switched on with this source.

An installation that already had auto sleep configured before this choice existed keeps the Home Assistant behaviour it had. A change takes effect straight away and restarts the auto sleep decision with the new source.
