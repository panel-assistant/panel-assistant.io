---
spec: 4bb8745b1513
related:
  - /manage/built-in-renderer/
---

Idle means nobody has touched the screen. The panel checks once a minute, so the return happens up to a minute after the time you set. It checks only while the screen is on and the dashboard is connected to Home Assistant, and does nothing if the dashboard is already showing the home view. The return swaps the view in place, without reloading the page.

The destination is [Home dashboard](#home_dashboard), including a specific tab if you set one. With Home dashboard on Auto, the panel waits until Home Assistant has told it which dashboard is the account's default. A value such as 5 suits a shared panel where people wander into other views; leave it at 0 if the panel should stay wherever it was left. The setting works only with the built-in renderer, and saving a value while another app is selected in [Dashboard app](#dashboard_package) is refused.
