---
spec: 63a0b1ab4a87
related:
  - /manage/adaptive-proximity/
---

This row has no value to edit. Its switch decides whether the learned proximity is reported to Home Assistant as a percentage sensor, which is on by default. The scale is the same on every panel: `0` means far and `100` means near, whatever the underlying hardware reports.

<figure class="setting-figure">
<svg viewBox="0 0 480 150" role="img" aria-labelledby="fig-proximity_level">
<title id="fig-proximity_level">A 0 to 100 scale from far to near, with a two-state sensor reporting only the two ends</title>
<line class="faint" x1="40" y1="60" x2="440" y2="60"/>
<line class="accent" x1="40" y1="60" x2="440" y2="60"/>
<line class="ink" x1="40" y1="52" x2="40" y2="68"/>
<line class="ink" x1="440" y1="52" x2="440" y2="68"/>
<text class="small" x="40" y="88" text-anchor="middle">0</text>
<text class="small" x="440" y="88" text-anchor="middle">100</text>
<text class="strong" x="40" y="40" text-anchor="middle">far</text>
<text class="strong" x="440" y="40" text-anchor="middle">near</text>
<text x="240" y="40" text-anchor="middle">learned level</text>
<line class="faint dash" x1="40" y1="120" x2="440" y2="120"/>
<circle class="accent-fill" cx="40" cy="120" r="6"/>
<circle class="accent-fill" cx="440" cy="120" r="6"/>
<text class="small" x="240" y="140" text-anchor="middle">two-state sensor: 0 or 100 only</text>
</svg>
<figcaption>Every panel reports on the same scale; a sensor that only knows near and far uses the two ends.</figcaption>
</figure>

Use it when a near/far answer is too coarse, for example to trigger something as a person approaches rather than only once they are close. Changes of up to 4 points are not published, so the history stays readable. Like [Proximity](#proximity), the entity is unavailable while the calibration cannot be trusted.
