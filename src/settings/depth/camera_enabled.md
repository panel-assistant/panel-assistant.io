---
spec: 17c7dc8bab9e
related:
  - /reference/api/
  - /reference/profiles/community/#enabling-the-camera-on-a-panel-whose-profile-does-not-declare-one
---

The Camera card appears on any panel with a camera: one its hardware profile declares, or one Android reports on a panel whose profile says nothing. If a panel has a camera the card does not offer, the card says why, and the linked profile guide covers the cases that have a fix.

Turning it on from Home Assistant asks for approval at the panel first, in every security mode, and Android also asks at the panel for camera permission the first time. Turning it off never asks and ends any live session at once. Switching it on only makes the camera available; the camera opens when a client asks for a frame and closes again when nobody is watching. If the panel cannot show its red indicator light, the camera does not open.

When on, the stream is at `rtsp://<panel>:8554/live` (for example `rtsp://192.168.x.x:8554/live`) and a single still is at `http://<panel>:8888/api/v1/camera/snapshot.jpg`. Home Assistant gets the switch as `switch.<panel>_camera_enabled` and a still as `image.<panel>_camera_snapshot`, which fetches a frame only when the card is viewed. Several viewers share one encode session, but do not put a panel's own camera on that same panel's dashboard: the panel cannot afford to capture, encode and display the same picture at once.
