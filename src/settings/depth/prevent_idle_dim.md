---
spec: 115926667786
related:
  - /manage/security-mode/
---

Some panel firmware turns the backlight right down when Android's screen-off timeout passes, even while the screen is meant to stay on, so the panel goes very dim some time after the last touch. With this on, Panel Assistant saves the current timeout once and sets it to never, and the built-in renderer also keeps the screen on while it is showing. Turning it off puts back the saved timeout, or 60 seconds if none was saved.

It is on by default and should normally stay on for a mains-powered panel. Screen sleep that you want is better handled by [Auto sleep](#auto_sleep). In Hardened security mode, turning it off from the network needs approval at the panel.
