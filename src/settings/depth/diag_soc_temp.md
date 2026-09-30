---
spec: 8b948d8859d0
related:
  - /manage/performance/
---

This row has no value to edit. Its switch adds a diagnostic sensor in Home Assistant with the temperature of the panel's processor in °C, taken as the hottest of the system's thermal readings. It is off by default. Changes smaller than 0.5 °C are not published.

Where the thermal readings are not accessible directly, the helper provides them; where neither works, the sensor stays unknown. The value is a chip temperature and runs well above room temperature, so do not use it as a room sensor.
