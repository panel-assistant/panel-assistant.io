---
spec: 2d3ffaed3dc7
related:
  - /manage/built-in-renderer/#dashboard-appearance-and-the-android-lock
---

This uses Home Assistant's own kiosk mode rather than altering the page. Once the frontend has loaded and connected, the built-in renderer sends it a request to hide its header and sidebar. If the request fails, the panel retries a few times; a Home Assistant version without the feature simply leaves the dashboard as it is. Turning the setting on or off applies to the dashboard already on screen, without a reload.

Leave it on for a wall panel that should show only the dashboard. Turn it off when people need Home Assistant's sidebar on the panel, for example to reach other dashboards or their profile page. [Hide Android system bars](#dashboard_fullscreen) is the separate control for Android's own bars.
