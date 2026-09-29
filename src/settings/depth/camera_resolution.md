---
spec: 3f85927f3cee
related:
  - /reference/api/
---

480p is 640 × 480, 720p is 1280 × 720 and 1080p is 1920 × 1080. The default is 720p. It applies to the snapshot as well as the stream, unless the snapshot URL asks for its own with `?res=`.

Higher resolutions cost the panel more processing and the network more data, so 480p suits a panel that already struggles to keep its dashboard smooth. All viewers share one session, and whoever opens the camera first decides its capture size; a stream that joins later gets that session rather than a new one. A change here applies from the next time the camera opens.
