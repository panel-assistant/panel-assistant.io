---
spec: 346293e85824
related:
  - /manage/built-in-renderer/
---

The lock is meant to stop someone passing by from wandering off the dashboard, not to stop a determined person. It hides the Android status and navigation bars, then checks every three seconds which app is in front and brings the dashboard back if it is not. Panel Assistant's own screens are left alone so you can always reach the release options. It does not use Android device-owner policies, so it cannot leave the panel unusable.

It needs root. On a panel without root, or on a panel model whose profile cannot make these changes, turning it on is refused and the setting stays off. Seven taps in the top-left corner, each within one and a half seconds of the last, release it on the panel itself; the corner is a small area that does not pass touches through while the lock is on. To let a particular app stay in front, list it in [Apps the lock allows](#kiosk_companion_packages).

The setting is also a switch named Android dashboard lock on the panel's device in Home Assistant.
