---
spec: 014e0eb8664b
related:
  - /hardware/panels/tuya-tpa10/
---

This row has no value to edit. Its switch decides whether the room temperature from the panel's built-in climate sensor is reported to Home Assistant in °C, which is on by default. It appears only on panel models whose profile lists that sensor, such as the Tuya TPA10. It is a normal temperature sensor in Home Assistant, not a diagnostic one, so you can use it in climate automations.

The sensor is read through the helper or Shizuku, so the value is unavailable if neither is running. The reading is refreshed about once a minute, rounded to one decimal place, and changes smaller than 0.2 °C are not published. The panel's own electronics warm the sensor, so it usually reads high; correct that with [Room temperature offset](#room_temp_offset).
