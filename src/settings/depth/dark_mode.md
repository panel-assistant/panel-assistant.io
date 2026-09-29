---
spec: e7936375af05
---

This setting appears only on panels running Android 9 or older. On Android 10 and later the panel has its own system dark-mode control, and Panel Assistant follows that for everything, so the toggle is hidden.

On the dashboard it is a default, not an override. Panel Assistant writes it into the Home Assistant frontend's per-device theme choice only when nobody has picked a theme in Home Assistant on that panel, so a theme chosen in the Home Assistant profile keeps winning. If you want the dashboard forced dark or light whatever Home Assistant has stored, use [Dashboard theme](#dashboard_theme) instead; while that forces a scheme, this setting stays out of the dashboard and only themes Panel Assistant's own screens.
