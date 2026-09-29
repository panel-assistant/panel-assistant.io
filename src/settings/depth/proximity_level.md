---
spec: 63a0b1ab4a87
related:
  - /manage/adaptive-proximity/
---

This row has no value to edit. Its switch decides whether the learned proximity is reported to Home Assistant as a percentage sensor, which is on by default. The scale is the same on every panel: 0 means far and 100 means near, whatever the underlying hardware reports.

Use it when a near/far answer is too coarse, for example to trigger something as a person approaches rather than only once they are close. A sensor that only knows two states reports 0 or 100. Small movements of a few percent are not published, so the history stays readable. Like [Proximity](#proximity), the entity is unavailable while the calibration cannot be trusted.
