---
spec: ['d781004cfef2', 'cca2796bb854', '94ebaa4e5d37']
help: 'Learned near/far occupancy from a supported proximity source.'
related:
  - /manage/adaptive-proximity/
---

This row has no value to edit. Its switch decides whether the panel reports near or far as an occupancy binary sensor in Home Assistant, which is on by default. The value comes from a calibration the panel learns from its own proximity signal, so the raw sensor value never reaches Home Assistant.

The row appears only on panels with a proximity source Panel Assistant can learn from. While the panel does not yet have enough evidence, or the sensor stops responding, the entity is unavailable rather than showing a guess. [Proximity level](#proximity_level) gives the same reading as a percentage, and [Wake on wave](#wake_on_wave) uses the same source to wake the screen.
