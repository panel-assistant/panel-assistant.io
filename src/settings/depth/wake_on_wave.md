---
spec: 6d05d8d3506c
related:
  - /manage/adaptive-proximity/
---

A wave is one bounded movement read by the proximity sensor: clear, then near, then clear again. Someone standing near the panel does not keep waking it, and short sensor jitter does not count. The panel has to have learned its sensor first, which it does during normal use or faster with **Teach a wave** under **Presence & wake**. Until then, and on panels without a usable proximity sensor, touch to wake is the only way to wake the screen, and the setting is not offered on panels without proximity hardware.

New installations start with it off. A panel upgraded from an older configuration that relied on it being on keeps it on. The setting is also a switch on the panel's device in Home Assistant.
