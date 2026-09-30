---
spec: ['df533c46d294', 'fc09b3d9a4c3', 'fd3046640bd7']
help: 'Keep the network and background services running while the screen is off.'
related:
  - /manage/security-mode/
---

With this on, Panel Assistant holds two Android locks:

- one that stops the processor from going into deep sleep;
- one that stops the Wi-Fi radio from going into power saving.

Without them, a panel with its screen off can stop answering on the network, drop its connection to Home Assistant or miss commands. The screen can still turn off as normal.

It is on by default because wall panels run on mains power. Turn it off only on a battery-powered device where standby time matters more than staying reachable.

:::note
In Hardened security mode, turning it off from the network needs approval at the panel.
:::
