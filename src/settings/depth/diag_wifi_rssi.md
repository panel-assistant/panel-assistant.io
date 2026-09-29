---
spec: de1b10acb639
---

This row has no value to edit. Its switch adds a diagnostic sensor in Home Assistant with the received Wi-Fi signal strength in dBm. It is off by default, and it is only reported while Wi-Fi is the active connection; on Ethernet the entity is unavailable.

Values are negative, and closer to zero is stronger. Changes smaller than 3 dBm are not published. The history helps decide whether a panel that drops off the network is simply too far from its access point. For the dropouts themselves, see [Wi-Fi outages (24 h)](#diag_wifi_outages_24h).
