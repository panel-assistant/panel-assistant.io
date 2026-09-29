---
spec: 23d88aa41d47
related:
  - /home-assistant/move-from-mqtt/
---

Panel Assistant fills this in on first start, before it connects to anything, so a panel always has one. It uses the Android device name when that name is set and is not just the model, and otherwise the model followed by a short suffix that keeps two panels of the same model apart. Whatever you type is converted on save: letters become lowercase, any run of other characters becomes one underscore, and leading or trailing underscores are dropped, so `Front Door` is stored as `front_door`.

The ID names the panel in MQTT topics and entity IDs, in the panel list other panels show in their header switcher, and as the host name on every line the panel ships to a log collector. Set it once when you add the panel and then leave it alone. Changing it on a panel that already has entities in Home Assistant changes those names, so dashboards and automations that refer to the old ones stop matching, and the panel drops its cached link to its Home Assistant device and finds it again. The ID is never copied when settings are applied to another panel, because two panels must not share it. For the name people see, use [Friendly name](#friendly_name).
