---
spec: b14be342a5d3
related:
  - /manage/built-in-renderer/
---

This is the dashboard the built-in renderer opens when it starts or reloads, and the one [Idle return to home](#dashboard_idle_return_min) goes back to. The picker lists the dashboards Home Assistant reports for the panel's account. **Auto** follows that account's default dashboard, and the label tells you whether the account has a default set or whether the list could not be fetched. **Custom** accepts a path to a specific dashboard or a single tab, for example `/lovelace/kitchen`.

A change applies without restarting the app. Every spelling of the root path, such as `/`, is stored as Auto. A path is checked for form when you save, but not for whether the dashboard exists, because the list can be unreachable or the dashboard may be created later; a path that Home Assistant does not know is shown as a warning instead. If Home Assistant later reports that the dashboard was removed or the account default changed, the panel moves to the current choice.

Choosing a specific dashboard also tells [Entity filtering](#dashboard_entity_learning) which dashboard to learn from.
