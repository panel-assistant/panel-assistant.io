---
spec: 28309fc114bf
related:
  - /hardware/panels/tuya-tpa10/
---

The offset is added to every [Room temperature](#room_temp) reading before it is reported, in steps of 0.1 °C between -20 and 20 °C. The default of 0 reports the sensor as read. The panel profile can carry its own baseline correction, and this setting is added on top of it; the built-in profiles all use a baseline of 0.

To set it, place a reliable thermometer next to the panel, let both settle, and enter the difference: if the panel reads 23.5 °C and the thermometer 21.0 °C, enter -2.5. The new value appears in Home Assistant with the next reading. The warmth depends on how and where the panel is mounted, so the offset belongs to this panel only and is not copied when settings are pushed to other panels. It has no Home Assistant entity; change it on the Configure page or through the local API.
