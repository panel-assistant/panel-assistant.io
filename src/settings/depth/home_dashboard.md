---
spec: b14be342a5d3
related:
  - /manage/built-in-renderer/
---

This is the dashboard the built-in renderer opens when it starts or reloads, and the one [Idle return to home](#dashboard_idle_return_min) goes back to. A change applies without restarting the app.

| Choice             | What happens                                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auto**           | Follows the default dashboard of the panel's Home Assistant account. The label tells you whether the account has a default set, or whether the list could not be fetched. |
| A listed dashboard | Opens that dashboard. The list is what Home Assistant reports for the panel's account.                                                                                    |
| **Custom**         | Opens the path you type, which can name a single tab, for example `/lovelace/garden`.                                                                                    |

Every spelling of the root path, such as `/`, is stored as **Auto**. A path is checked for form when you save, but not for whether the dashboard exists, because the list can be unreachable or the dashboard may be created later; a path Home Assistant does not know is shown as a warning instead.

Choosing a specific dashboard also tells [Entity filtering](#dashboard_entity_learning) which dashboard to learn from.
