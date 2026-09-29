---
spec: 693da61cd2f6
related:
  - /manage/performance/
---

The three profiles are plain names for the Linux CPU scaling governor:

| Profile         | Kernel governor                                                                       | What you get                                                                      | When to pick it                                                   |
| --------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Performance** | `performance`                                                                         | Every core held at its highest clock: responsive, but more power and heat all day | A temporary comparison while chasing sluggishness                 |
| **Efficiency**  | `powersave`                                                                           | Coolest and quietest, with noticeably slower dashboards                           | A panel that is rarely touched                                    |
| **Auto**        | a load-following governor such as `schedutil` or `interactive`, depending on the chip | Speeds up while someone uses the panel and idles low otherwise                    | Almost always; the sensible choice for a panel that is on all day |

The change applies to every core straight away, and the value shown reads back the live governor, so any load-following governor the firmware set appears as **Auto**. Writing the governor needs root or the Panel Assistant helper, so the setting appears only on panels where the governors can be read, and a change fails if neither route is available.

:::note
The profile is never saved. After a restart the panel runs whatever governor its firmware chooses.
:::
