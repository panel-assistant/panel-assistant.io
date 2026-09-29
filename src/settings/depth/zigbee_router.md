---
spec: 22db4869919f
related:
  - /manage/performance/
  - /hardware/panels/sonoff-nspanel-pro/
---

This setting appears only on a panel with a built-in Zigbee gateway, such as the Sonoff NSPanel Pro. Turning it on starts the vendor gateway if it is not already running and switches it to the Repeater role, so the panel can extend an existing Zigbee network run by your own coordinator. Once the switch is on and saved, a Join Zigbee network row appears under it: open permit-join on your coordinator, then use Request join. The button stays disabled after the router has joined.

Turning it off stops the gateway and frees the radio. Stock firmware often starts the gateway at boot by itself, and Panel Assistant only stops it when you have set this switch explicitly, so a gateway you already rely on is left alone by default. On some stock firmware the vendor gateway cannot be stopped from the app and keeps running until the next restart.

While the router is on, Panel Assistant watches the gateway. After a 15-minute start-up grace period, if the gateway restarts three or more times within ten minutes, or stays unjoined while using more than half a CPU core for five consecutive one-minute samples, it is treated as a runaway: Panel Assistant turns this setting off and stops the gateway to protect the panel's responsiveness.
