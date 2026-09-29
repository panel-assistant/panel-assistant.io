---
spec: 23d88aa41d47
related:
  - /home-assistant/move-from-mqtt/
---

Panel Assistant fills this in on first start, before it connects to anything, so a panel always has one:

- when the Android device name is set and is not just the model, the ID is made from that name;
- otherwise it is the model followed by a short suffix that keeps two panels of the same model apart.

Whatever you type is converted on save: letters become lowercase, any run of other characters becomes one underscore, and leading or trailing underscores are dropped.

| You type          | Stored as       |
| ----------------- | --------------- |
| `Front Door`      | `front_door`    |
| `Hall - Upstairs` | `hall_upstairs` |
| `garage.wall 2`   | `garage_wall_2` |

The ID names the panel in MQTT topics and entity IDs, in the panel list other panels show in their header switcher, and as the host name on every line the panel ships to a log collector. For the name people see, use [Friendly name](#friendly_name).

:::caution
Set the ID once when you add the panel and then leave it alone. Changing it on a panel that already has entities in Home Assistant changes those names, so dashboards and automations that refer to the old ones stop matching, and the panel drops its cached link to its Home Assistant device and finds it again.
:::

The ID is never copied when settings are applied to another panel, because two panels must not share it.
