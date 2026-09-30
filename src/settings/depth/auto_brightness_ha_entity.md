---
spec: 2a8a568ce2d1
related:
  - /manage/adaptive-brightness/
---

The value is a Home Assistant entity id beginning with `sensor.`, such as `sensor.living_room_illuminance`. The picker lists the illuminance sensors Home Assistant reports. When you save, the panel checks the entity with Home Assistant, and refuses it unless:

- the panel is already connected to Home Assistant (save any connection change first, then pick the entity);
- the entity exists;
- it has the `illuminance` device class or a `lx` unit;
- it is reporting a number at that moment, so a sensor that is currently unavailable is refused.

Choose an entity when the panel has no light sensor of its own, or when a sensor elsewhere in the room better represents the light people see. With an entity selected, the panel can start from up to seven days of that entity's recorded history instead of learning from nothing. Clear the field to go back to the panel's own sensor.

:::note
The learned pattern belongs to the source, so switching source starts a separate history.
:::
