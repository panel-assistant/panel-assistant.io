---
spec: 27465b2bff3d
related:
  - /manage/built-in-renderer/
---

This chooses which app draws the dashboard on the panel. The list always starts with **Auto** and **Built-in renderer**, followed by any supported Home Assistant Companion app installed on the panel. Other launchable apps are not offered. If the panel is already set to an app the list does not recognise, that choice stays in the list rather than being dropped silently.

Auto and Built-in renderer both use Panel Assistant's own renderer. Selecting the built-in renderer needs a working Home Assistant connection first, so connect with Browser sign-in before choosing it. Choosing a Companion app hands the dashboard to that app, and a change takes effect immediately: the panel launches the newly selected app as soon as the setting is saved. From the API the stored value is blank for Auto, `builtin` for the built-in renderer, or the Android package name of the other app.

Most settings on this card apply only to the built-in renderer, including [Home dashboard](#home_dashboard) idle return, [Dashboard theme](#dashboard_theme), [Entity filtering](#dashboard_entity_learning) and [Zoom (%)](#dashboard_zoom). Idle return is refused while another app is selected. Pick a separate app only when you need something the built-in renderer does not offer, such as more than one Home Assistant server or native notifications.
