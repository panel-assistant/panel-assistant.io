---
spec: 3f85927f3cee
related:
  - /reference/api/
---

| Choice             | Size        | When to pick it                                                                |
| ------------------ | ----------- | ------------------------------------------------------------------------------ |
| **480p**           | 640 × 480   | A panel that already struggles to keep its dashboard smooth, or a busy network |
| **720p** (default) | 1280 × 720  | Most rooms                                                                     |
| **1080p**          | 1920 × 1080 | When detail matters and the panel and network have headroom                    |

It applies to the snapshot as well as the stream, unless the snapshot URL asks for its own with `?res=`. Higher resolutions cost the panel more processing and the network more data.

:::note
All viewers share one session, and whoever opens the camera first decides its capture size; a stream that joins later gets that session rather than a new one. A change here applies from the next time the camera opens.
:::
