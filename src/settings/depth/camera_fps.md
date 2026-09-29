---
spec: 739664abd74b
related:
  - /reference/api/
---

The value is frames per second, from 1 to 30, with 15 as the default. A lower rate saves processing on the panel and bandwidth on the network; a doorway or room view rarely needs more than the default.

All viewers share one session, and the first client to open the camera sets its rate. A stream that joins a session a snapshot has already opened gets the rate that session was opened with, not the one it asked for. The camera section of the panel's status reports both the rate asked for and the rate actually delivered, so you can see when they differ. A change here applies from the next time the camera opens.
