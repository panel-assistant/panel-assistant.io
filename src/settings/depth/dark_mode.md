---
spec: e7936375af05
---

This setting appears only on panels running Android 9 or older. On Android 10 and later the panel has its own system dark-mode control, and Panel Assistant follows that for everything, so the toggle is hidden.

On the dashboard it is a default, not an override:

| Situation                                                         | What the dashboard shows                                                  |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------- |
| No theme picked in Home Assistant on this panel                   | The scheme this setting chooses                                           |
| A theme picked in the Home Assistant profile                      | That theme; this setting is ignored                                       |
| [Dashboard theme](#dashboard_theme) forcing **Dark** or **Light** | The forced scheme; this setting only themes Panel Assistant's own screens |

:::tip
To force the dashboard dark or light whatever Home Assistant has stored, use [Dashboard theme](#dashboard_theme) rather than this setting.
:::
