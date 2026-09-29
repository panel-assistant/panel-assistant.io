---
spec: 2a8a568ce2d1
related:
  - /manage/adaptive-brightness/
---

The value is a Home Assistant entity id beginning with `sensor.`, such as `sensor.living_room_illuminance`. The picker lists the illuminance sensors Home Assistant reports. When you save, the panel checks the entity with Home Assistant first: it must exist, have the illuminance device class or a lux unit, and be reporting a number at that moment. A sensor that is currently unavailable is refused rather than saved. The panel must already be connected to Home Assistant; save any change to the connection first, then pick the entity.

Choose an entity when the panel has no light sensor of its own, or when a sensor elsewhere in the room better represents the light people see. The learned pattern belongs to the source, so switching source starts a separate history. With an entity selected, the panel can start from up to seven days of that entity's recorded history instead of learning from nothing. Clear the field to go back to the panel's own sensor.
