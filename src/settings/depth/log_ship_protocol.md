---
spec: 39faaebd0b2a
---

Syslog over TCP sends standard RFC 5424 syslog lines over a connection, one per line, so long lines arrive whole. Syslog over UDP sends the same lines one per datagram, which is what many syslog servers accept out of the box, but each line is cut at 1024 bytes. HTTP protocol posts batches of JSON objects, one per line, to the root of `http://host:port/`, with the fields `timestamp`, `host`, `app`, `versionCode`, `package` and `message`.

Start with TCP. If the collector accepts only UDP, TCP fails with a visible connection error and you can switch; the reverse mistake loses every line without a warning. A transport typed into [Sink host](#log_ship_host) takes precedence over this choice. Older saved values `syslog` and `tcp` mean Syslog over TCP, and `udp` means Syslog over UDP.
