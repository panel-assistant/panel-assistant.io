---
spec: 58003c056748
---

This only matters when a host name, such as your broker or `homeassistant.local`, resolves to both IPv6 and IPv4 addresses. Automatic tries IPv6 first, switches to the other family when a connection fails, and remembers the family that worked for next time. On most networks that is the right choice and you should leave it.

Change it when the panel keeps dropping or reconnecting because IPv6 is advertised on your network but does not reliably reach the broker or Home Assistant. Prefer IPv4 tries IPv4 first but can still use IPv6. Force IPv4 never uses IPv6, so a host that has only an IPv6 address becomes unreachable. The setting is read at each new connection attempt, so it takes effect the next time the panel connects. Log shipping does not use it; it always tries IPv4 first on its own.
