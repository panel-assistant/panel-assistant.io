---
spec: 53f6ed6f55cf
related:
  - /manage/performance/
---

This row has no value to edit. Its switch adds a diagnostic sensor in Home Assistant with the panel's overall CPU busy percentage. It is off by default.

The value is measured across all cores between two readings, so the first reading after a start is empty. Changes smaller than 5 percentage points are not published, which keeps the history useful without a row for every small wobble. Reading CPU load needs access that some panels only give through the helper or root; where no route works the sensor stays unknown. It is most useful to find out whether a heavy dashboard keeps the panel busy.
