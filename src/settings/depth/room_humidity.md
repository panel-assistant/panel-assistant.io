---
spec: 86383c4568cf
related:
  - /hardware/panels/tuya-tpa10/
---

This row has no value to edit. Its switch decides whether the relative humidity from the panel's built-in climate sensor is reported to Home Assistant as a whole percentage, which is on by default. It appears only on panel models whose profile lists that sensor, such as the Tuya TPA10, and it is read through the same route as [Room temperature](#room_temp).

The reading is refreshed about once a minute, and changes smaller than one percentage point are not published. No offset is applied to humidity.
