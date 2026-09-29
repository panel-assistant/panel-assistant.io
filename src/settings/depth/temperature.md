---
spec: 88f0d78f17e8
---

This row has no value to edit. Its switch decides whether the reading from Android's ambient temperature sensor is reported to Home Assistant in °C, which is on by default. It appears only on a panel that has such a sensor. Values are rounded to one decimal place, and changes smaller than 0.1 °C are not published.

The sensor sits inside the panel, so it is affected by the panel's own warmth. Panels with a dedicated room climate sensor report [Room temperature](#room_temp) instead, and this entity is withdrawn there so Home Assistant does not show two temperature sensors for one panel.
