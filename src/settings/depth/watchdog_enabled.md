---
spec: d7df8cc804fa
---

When the watchdog is on, Panel Assistant checks the dashboard app every 30 seconds. If the app's process has died on two checks in a row, it starts the app again. If the app is still running but has not been in front for five minutes, for example because someone opened Settings and walked away, it brings the dashboard back. It never acts while the dashboard is in front.

If the dashboard keeps crashing as soon as it starts, the watchdog backs off instead of relaunching it over and over, and a health warning appears; this clears when the dashboard comes back to the front. The watchdog needs root or the Panel Assistant helper to see the dashboard's state, and does nothing on panels with neither.

Leave it off if you often use other apps on the panel for longer than five minutes. For a faster return that also hides the Android bars, use [Lock Android to dashboard](#kiosk_lock) instead.
