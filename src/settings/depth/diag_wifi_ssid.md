---
spec: a3e38ffe5c64
---

This row has no value to edit. Its switch adds a diagnostic sensor in Home Assistant with the name of the Wi-Fi network the panel is using. It is off by default. The value is only reported while Wi-Fi is the panel's active connection; on Ethernet, or when Android hides the name, the entity is unavailable. On panels with root access Panel Assistant can read the name from the system when Android hides it from apps.

The row appears only when the panel can read the network name. It is useful where a panel can join more than one network. The name is kept in Home Assistant's history once exposed, so leave it off unless you need it. Panel Assistant reads only the current connection and never scans for other networks.
