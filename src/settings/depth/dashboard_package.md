---
spec: ['27465b2bff3d', 'c7e9120ef5a4', 'f7d5a24f015c']
help: "App used for the dashboard. Blank uses ha-paneld's built-in renderer."
related:
  - /manage/built-in-renderer/
---

This chooses which app draws the dashboard on the panel. The list always starts with **Auto** and **Built-in renderer**, followed by any supported Home Assistant Companion app installed on the panel. Using the Companion app as the dashboard is retired: it is listed only so a panel already set up that way keeps working, and Panel Assistant never removes it for you. Other launchable apps are not offered. If the panel is already set to an app the list does not recognise, that choice stays in the list rather than being dropped silently.

| Choice                | Stored value             | What happens                                           | When to pick it                                                                                                                                           |
| --------------------- | ------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auto**              | blank                    | Uses Panel Assistant's own renderer.                   | The usual choice.                                                                                                                                         |
| **Built-in renderer** | `builtin`                | Uses Panel Assistant's own renderer, named explicitly. | When you want the choice spelled out in a backup or script.                                                                                               |
| A Companion app       | its Android package name | Hands the dashboard to that app.                       | Retired as a panel dashboard. A panel already using it keeps working; switch to **Auto** once the panel is in [Panel Assistant](/start/getting-started/). |

A change takes effect immediately: the panel launches the newly selected app as soon as the setting is saved. Selecting the built-in renderer needs a working Home Assistant connection first, so connect with Browser sign-in before choosing it.

:::note
Most settings on this card apply only to the built-in renderer, including [Home dashboard](#home_dashboard) idle return, [Dashboard theme](#dashboard_theme), [Entity filtering](#dashboard_entity_learning) and [Zoom (%)](#dashboard_zoom). Saving an idle return time while a Companion app is selected is refused.
:::
