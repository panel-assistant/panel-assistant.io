---
spec: 60186f207694
related:
  - /manage/adaptive-brightness/
---

When this is on, Panel Assistant learns the normal ambient-light pattern around the panel over up to seven days and sets the screen level itself, with no Home Assistant automation. It needs a light source: the panel's own sensor, or a Home Assistant entity chosen in [Ambient light source](#auto_brightness_ha_entity). The change applies at once.

Manual control still works while it is on. A brightness change at the panel, or from `light.<panel>_screen` in Home Assistant, sets a temporary preference: automatic control drops to 20% influence and regains full control over four hours.

<figure class="setting-figure">
<svg viewBox="0 0 480 180" role="img" aria-labelledby="fig-auto_brightness">
<title id="fig-auto_brightness">Automatic influence drops to 20 percent after a manual change and returns to 100 percent over four hours</title>
<line class="faint" x1="60" y1="140" x2="440" y2="140"/>
<line class="faint" x1="60" y1="20" x2="60" y2="140"/>
<line class="faint dash" x1="60" y1="30" x2="440" y2="30"/>
<text class="small" x="54" y="34" text-anchor="end">100%</text>
<text class="small" x="54" y="122" text-anchor="end">20%</text>
<path class="accent" d="M60 30 L100 30 L100 118 C220 118 320 40 400 30 L440 30"/>
<circle class="accent-fill" cx="100" cy="118" r="4"/>
<text class="small" x="100" y="156" text-anchor="middle">manual change</text>
<text class="small" x="400" y="156" text-anchor="middle">+4 h</text>
<line class="faint dash" x1="400" y1="30" x2="400" y2="140"/>
<text class="small" x="250" y="174" text-anchor="middle">time</text>
</svg>
<figcaption>Automatic control's share after a manual change. The shape of the fade is illustrative.</figcaption>
</figure>

:::tip
**Resume full auto** on the Configure page ends the preference straight away.
:::

With it off, brightness is set by Home Assistant or by a person at the panel. In Home Assistant the setting is also a configuration switch, `switch.<panel>_auto_brightness`. The floor and response are tuned with [Minimum level](#auto_brightness_minimum_percent) and [Sensitivity](#auto_brightness_response_percent).
