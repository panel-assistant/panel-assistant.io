---
spec: 84dd4befb599
related:
  - /home-assistant/support-report/
---

This row has no value to edit. Its switch adds a diagnostic sensor in Home Assistant counting how many times the panel lost its Wi-Fi connection and got it back in the last 24 hours. It is off by default. An outage is counted when Wi-Fi comes back, so one still in progress is not yet included, and a new loss within 10 seconds of a counted recovery is treated as the same outage.

The count only covers the panel's own Wi-Fi link. A restart of Home Assistant or of the broker does not count, and a switch to Ethernet is not counted as a Wi-Fi outage. Counts survive a restart of the app. The panel keeps up to 200 outage records; when it has to drop older ones still inside the window, the `is_lower_bound` attribute becomes true and the number is a minimum. Six or more outages in 24 hours, or any capped count, means the Wi-Fi link needs attention, and the panel's diagnostics report then includes the count. The [Wi-Fi signal strength](#diag_wifi_rssi) history is the first place to look for a cause.
