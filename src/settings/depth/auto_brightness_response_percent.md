---
spec: 39b38d0121e8
related:
  - /manage/adaptive-brightness/
---

At 0 the screen follows the learned daily pattern alone and ignores short changes, such as a lamp switched on. At 100 it applies the whole difference between the measured light and that pattern. The default of 50 sits in the middle, leaving room to tune either way.

It is not a follow-the-light control. A brief brightening is acted on only once it has lasted, or risen sharply enough to count, whatever this is set to. Lower it if the screen reacts to changes you would rather it ignored; raise it if it feels slow to catch up when the room lights change. The change applies at once, and the chart on the Configure page previews it before you save.

Earlier releases called this setting `auto_brightness_sensitivity` on a different scale. A stored value, or a script that still sends the old key, is converted to the new scale automatically.
