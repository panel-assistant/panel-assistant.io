---
spec: 75d77d5f5956
---

The host name or address of your log collector, for example `192.168.x.x` or `logs.local`. You can also type the transport and port here; the three fields are saved to agree with each other.

| You type               | Protocol                            | Port                             |
| ---------------------- | ----------------------------------- | -------------------------------- |
| `192.168.x.x`          | from [Protocol](#log_ship_protocol) | from [Sink port](#log_ship_port) |
| `192.168.x.x:1514`     | from Protocol                       | `1514`                           |
| `udp://192.168.x.x`    | Syslog over UDP                     | from Sink port                   |
| `tcp://[fd00::20]:514` | Syslog over TCP                     | `514`                            |

IPv6 addresses go in square brackets. When a name resolves to both IPv4 and IPv6, the panel tries IPv4 first, because a UDP send to the wrong address fails without any sign.

:::note
Leaving the host blank turns shipping off even when [Ship logs](#log_ship_enabled) is on.
:::
