---
spec: 04fa61ded9ea
---

This row has no value to edit. Its switch adds a diagnostic timestamp sensor in Home Assistant with the time the panel last started. It is off by default. Home Assistant shows it as elapsed time, for example "3 days ago".

The value stays constant until the next restart, so it adds almost nothing to the history. A value that keeps changing means the panel is restarting, which is worth investigating.
