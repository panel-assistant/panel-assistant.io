---
spec: 23741aae7e91
---

This row has no value to edit. Its switch decides whether the panel's media volume is reported to Home Assistant as a number entity with a 0 to 100 % slider, which is on by default.

- Moving the slider in Home Assistant sets the panel volume.
- Changes made on the panel itself are reported back once they have settled.

Turn the switch off if you never control the panel volume from Home Assistant; the entity is then removed.
