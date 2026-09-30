---
spec: 39faaebd0b2a
---

| Choice                        | What is sent                                                         | Notes                                                                                                                    |
| ----------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Syslog over TCP** (default) | Standard RFC 5424 syslog lines over a connection, one per line       | Long lines arrive whole. A collector that refuses the connection shows as an error.                                      |
| **Syslog over UDP**           | The same lines, one per datagram                                     | What many syslog servers accept out of the box. Each line is cut at 1024 bytes, and a wrong host or port fails silently. |
| **HTTP protocol**             | Batches of JSON objects, one per line, posted to `http://host:port/` | Fields: `timestamp`, `host`, `app`, `versionCode`, `package`, `message`.                                                 |

:::tip
Start with TCP. If the collector accepts only UDP, TCP fails with a visible connection error and you can switch; the reverse mistake loses every line without a warning.
:::

A transport typed into [Sink host](#log_ship_host) takes precedence over this choice. Older saved values `syslog` and `tcp` mean Syslog over TCP, and `udp` means Syslog over UDP.
