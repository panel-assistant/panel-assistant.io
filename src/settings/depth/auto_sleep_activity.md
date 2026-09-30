---
spec: 75f4bb38e09e
---

This row has no value to edit. Its switch decides whether Home Assistant gets a binary sensor that follows [Auto-sleep](#auto_sleep). It is off by default. Its main use is the history timeline in Home Assistant, which shows when and for how long the panel was kept awake.

| State       | Meaning                                         |
| ----------- | ----------------------------------------------- |
| `on`        | Auto-sleep is holding the screen awake          |
| `off`       | Auto-sleep is letting the panel sleep           |
| unavailable | Auto-sleep is off, or its policy is not working |

The entity also carries attributes that explain the current state: `reason`, `phase`, `learned_delay`, `source_count` and `manual_suppression`.

:::note
An unavailable period in the history means the policy was not running, not that nobody was there.
:::

Turn it on while you tune auto-sleep, and off again when you no longer need the history.
