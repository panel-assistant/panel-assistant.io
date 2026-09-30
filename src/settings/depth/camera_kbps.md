---
spec: 8203466dd0d1
related:
  - /reference/api/
---

The value is the H.264 video bitrate in kilobits per second, from `250` to `8000` in steps of 250, with `2000` as the default.

| Value                | Picture and cost                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Lower                | Less network traffic; suits a busy Wi-Fi network or a small view                             |
| `2000` (default)     | The starting point                                                                           |
| Higher, up to `8000` | A cleaner picture, especially with movement or at 1080p, at the cost of more network traffic |

Below 250 H.264 does not produce a usable picture at any size, which is why that is the floor. As with the other stream settings, the first client to open the camera binds the session and later viewers share it. A change here applies from the next time the camera opens.
