---
spec: 89438f401dbd
related:
  - /manage/adaptive-proximity/
---

With auto sleep on, the panel turns its screen off when the presence source chosen in [Auto-sleep presence source](#auto_sleep_source) stops seeing anyone, and back on when activity returns. The delay before the screen goes off is learned on the panel from how long gaps in activity usually last and from corrections, such as someone touching the screen soon after it went off, rather than being a fixed timer. A touch always wakes the screen.

Turning the screen on or off from Home Assistant or the API is separate and keeps working whether auto sleep is on or off. If the presence source becomes unavailable, automatic sleep pauses rather than guessing. The setting is also a switch on the panel's device in Home Assistant, so an automation can turn it on for the night and off again in the morning.
