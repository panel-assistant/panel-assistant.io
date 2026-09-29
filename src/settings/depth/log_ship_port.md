---
spec: 9fb395dd2b57
---

The port your collector listens on.

| Protocol        | Usual port                                   |
| --------------- | -------------------------------------------- |
| Syslog over TCP | `514`                                        |
| Syslog over UDP | `514`                                        |
| HTTP protocol   | whatever your collector's HTTP endpoint uses |

A port typed into [Sink host](#log_ship_host) replaces this value.
