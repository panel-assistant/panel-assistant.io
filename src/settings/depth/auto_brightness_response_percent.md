---
spec: 39b38d0121e8
related:
  - /manage/adaptive-brightness/
---

| Value          | What the screen does                                                                          |
| -------------- | --------------------------------------------------------------------------------------------- |
| `0`            | Follows the learned daily pattern alone and ignores short changes, such as a lamp switched on |
| `50` (default) | Applies half the difference between the measured light and the pattern                        |
| `100`          | Applies the whole difference                                                                  |

It is not a follow-the-light control. A brief brightening is acted on only once it has lasted, or risen sharply enough to count, whatever this is set to, and while the pattern is still being learned the screen follows the measured light directly. Lower it if the screen reacts to changes you would rather it ignored; raise it if it feels slow to catch up when the room lights change. The change applies at once, and the chart on the Configure page previews it before you save.

:::note
Earlier releases called this setting `auto_brightness_sensitivity` on a different scale. A stored value, or a script that still sends the old key, is converted to the new scale automatically.
:::
