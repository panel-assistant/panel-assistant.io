---
spec: 2d3ffaed3dc7
related:
  - /manage/built-in-renderer/#dashboard-appearance-and-the-android-lock
---

This uses Home Assistant's own kiosk mode rather than altering the page. Once the frontend has loaded and connected, the built-in renderer sends it a `kiosk_mode/set` request to hide its navigation. If the request fails, the panel retries a few times; a Home Assistant version without the feature leaves the dashboard as it is. Turning the setting on or off applies to the dashboard already on screen, without a reload.

| State            | Use it when                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| **On** (default) | The panel should show only the dashboard.                                                                          |
| **Off**          | People need Home Assistant's navigation on the panel, for example to reach other dashboards or their profile page. |

[Hide Android system bars](#dashboard_fullscreen) is the separate control for Android's own bars.
