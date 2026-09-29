---
spec: 8203466dd0d1
related:
  - /reference/api/
---

The value is the H.264 video bitrate in kilobits per second, from 250 to 8000 in steps of 250, with 2000 as the default. Higher values give a cleaner picture, especially with movement or at 1080p, at the cost of more network traffic; lower values suit a busy Wi-Fi network or a small view. Below 250 H.264 does not produce a usable picture at any size, which is why that is the floor.

As with the other stream settings, the first client to open the camera binds the session and later viewers share it. A change here applies from the next time the camera opens.
