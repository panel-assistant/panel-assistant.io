---
spec: 1cf61f9795c5
related:
  - /manage/adaptive-brightness/
---

This row has no value to edit. Its switch decides whether the ambient light level is reported to Home Assistant as an illuminance sensor in lux, which is on by default. The row appears only on a panel whose light sensor actually delivers readings; a sensor that is declared by the hardware but never reports is treated as absent.

Readings are not retained between connections, because a fresh one follows shortly. The same sensor can drive [Adaptive brightness](#auto_brightness), and that works whether or not this entity is exposed.
