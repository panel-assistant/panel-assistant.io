---
spec: 27465b2bff3d
related:
  - /manage/built-in-renderer/
---

This chooses which app draws the dashboard on the panel. The list always starts with **Auto** and **Built-in renderer**, followed by any supported Home Assistant Companion app installed on the panel. Other launchable apps are not offered. If the panel is already set to an app the list does not recognise, that choice stays in the list rather than being dropped silently.

| Choice                | Stored value             | What happens                                           | When to pick it                                                                                                                         |
| --------------------- | ------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Auto**              | blank                    | Uses Panel Assistant's own renderer.                   | The usual choice.                                                                                                                       |
| **Built-in renderer** | `builtin`                | Uses Panel Assistant's own renderer, named explicitly. | When you want the choice spelled out in a backup or script.                                                                             |
| A Companion app       | its Android package name | Hands the dashboard to that app.                       | Only when you need something the built-in renderer does not offer, such as more than one Home Assistant server or native notifications. |

A change takes effect immediately: the panel launches the newly selected app as soon as the setting is saved. Selecting the built-in renderer needs a working Home Assistant connection first, so connect with Browser sign-in before choosing it.

:::note
Most settings on this card apply only to the built-in renderer, including [Home dashboard](#home_dashboard) idle return, [Dashboard theme](#dashboard_theme), [Entity filtering](#dashboard_entity_learning) and [Zoom (%)](#dashboard_zoom). Saving an idle return time while a Companion app is selected is refused.
:::
