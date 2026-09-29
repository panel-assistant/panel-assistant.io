---
spec: 693da61cd2f6
related:
  - /manage/performance/
---

The three profiles are plain names for the Linux CPU scaling governor. Performance holds every core at its highest clock, which keeps dashboards responsive but draws more power and runs warmer all day. Efficiency selects the `powersave` governor: the coolest and quietest option, at the cost of noticeably slower dashboards. Auto selects a load-following governor (for example `schedutil` or `interactive`, depending on the chip), which speeds up while someone uses the panel and idles low otherwise. Auto is the sensible choice for a panel that is on all day.

The change applies to every core straight away, but it is never saved: after a restart the panel runs whatever governor its firmware chooses. The value shown reads back the live governor, so any load-following governor set by the firmware appears as Auto. Writing the governor needs root or the Panel Assistant helper, so the setting appears only on panels where the governors can be read, and a change fails if neither route is available. Use Performance for a temporary comparison when you are chasing sluggishness, then return to Auto.
