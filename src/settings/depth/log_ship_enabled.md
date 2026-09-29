---
spec: eb7e519030ea
related:
  - /manage/troubleshooting/
---

With shipping on, every line of Panel Assistant's own log on the panel is sent to a log collector you run, such as a syslog server, so you can keep a history across several panels and after restarts. It is the same log the Logs tab streams live, with tokens and passwords removed before a line leaves the panel. The system log is never sent. Nothing is sent until [Sink host](#log_ship_host) is set as well.

Each record carries the panel ID as its host name, the app name `ha-paneld`, and the app build that wrote it. Lines wait in a queue on the panel, and if the collector is unreachable for long enough that the queue fills, the oldest ones are dropped rather than slowing the panel. The panel's runtime diagnostics show whether shipping is connected and how many lines were sent or dropped. Leave it off unless you have a collector to receive the logs.
