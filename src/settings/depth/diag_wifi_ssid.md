---
spec: a3e38ffe5c64
---

This row has no value to edit. Its switch adds a diagnostic sensor in Home Assistant with the name of the Wi-Fi network the panel is using. It is off by default, and the row appears only when the panel can read the network name.

The entity is unavailable when:

- the panel is on Ethernet, or Wi-Fi is not its active connection;
- Android hides the network name from apps and no system route can read it. Where the panel has root access, Panel Assistant can read the name from the system instead.

:::caution
The name is kept in Home Assistant's history once exposed and can identify a location, so leave it off unless you need it.
:::

Panel Assistant reads only the current connection and never scans for other networks.
