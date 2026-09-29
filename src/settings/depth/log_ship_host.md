---
spec: 75d77d5f5956
---

The host name or address of your log collector, for example `192.168.x.x` or `logs.local`. You can include the transport and port here, as in `udp://192.168.x.x:514`; a transport typed here takes precedence over [Protocol](#log_ship_protocol), and a port over [Sink port](#log_ship_port), and the three fields are saved to agree with each other. IPv6 addresses go in square brackets. When a name resolves to both IPv4 and IPv6, the panel tries IPv4 first, because a UDP send to the wrong address fails without any sign. Leaving the host blank turns shipping off even when [Ship logs](#log_ship_enabled) is on.
