---
spec: ['2883728c9440', 'fb9d5eaaa74f', '0eeebc92d536']
help: "Relative humidity reported by Android's panel sensor."
---

This row has no value to edit. Its switch decides whether the reading from Android's relative humidity sensor is reported to Home Assistant as a whole percentage, which is on by default. It appears only on a panel that has such a sensor, and changes smaller than one percentage point are not published.

Panels with a dedicated room climate sensor report [Room humidity](#room_humidity) instead, and this entity is withdrawn there so Home Assistant does not show two humidity sensors for one panel.
