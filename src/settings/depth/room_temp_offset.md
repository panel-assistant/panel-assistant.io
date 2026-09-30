---
spec: 28309fc114bf
related:
  - /hardware/panels/tuya-tpa10/
---

The offset is added to every [Room temperature](#room_temp) reading before it is reported, in steps of `0.1` °C between `-20` and `20` °C. The default of `0` reports the sensor as read. The panel profile can carry its own baseline correction, and this setting is added on top of it; the built-in profiles all use a baseline of `0`.

To set it:

1. Place a reliable thermometer next to the panel and let both settle.
2. Subtract the panel's reading from the thermometer's.
3. Enter the difference here. The new value appears in Home Assistant with the next reading.

| Panel reads | Thermometer reads | Offset to enter | Reported afterwards |
| ----------- | ----------------- | --------------- | ------------------- |
| 23.5 °C     | 21.0 °C           | `-2.5`          | 21.0 °C             |

:::note
The warmth depends on how and where the panel is mounted, so the offset belongs to this panel only and is not copied when settings are pushed to other panels.
:::

It has no Home Assistant entity; change it on the Configure page or through the local API.
