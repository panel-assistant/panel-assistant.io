---
spec: 3750153a0cc6
---

The list offers the areas that exist in your Home Assistant. Leaving it blank means "follow Home Assistant".

<figure class="setting-figure">
<svg viewBox="0 0 480 200" role="img" aria-labelledby="fig-ha_area">
<title id="fig-ha_area">How the panel's area and the device's area in Home Assistant are reconciled</title>
<rect class="panel" x="160" y="10" width="160" height="40" rx="6"/>
<text x="240" y="35" text-anchor="middle">Area in Home Assistant?</text>
<line class="ink" x1="200" y1="50" x2="90" y2="90"/>
<line class="ink" x1="280" y1="50" x2="390" y2="90"/>
<text class="small" x="132" y="64" text-anchor="end">set</text>
<text class="small" x="348" y="64" text-anchor="start">none</text>
<rect class="panel" x="10" y="90" width="160" height="40" rx="6"/>
<text x="90" y="115" text-anchor="middle">Chosen here by you?</text>
<rect class="panel" x="310" y="90" width="160" height="40" rx="6"/>
<text x="390" y="115" text-anchor="middle">Admin user?</text>
<line class="ink" x1="60" y1="130" x2="60" y2="150"/>
<line class="ink" x1="130" y1="130" x2="170" y2="150"/>
<text class="small strong" x="60" y="170" text-anchor="middle">no: adopt</text>
<text class="small" x="60" y="186" text-anchor="middle">Home Assistant's</text>
<text class="small strong" x="190" y="170" text-anchor="middle">yes: keep</text>
<text class="small" x="190" y="186" text-anchor="middle">your choice</text>
<line class="ink" x1="360" y1="130" x2="330" y2="150"/>
<line class="ink" x1="420" y1="130" x2="440" y2="150"/>
<text class="small strong" x="320" y="170" text-anchor="middle">yes: write</text>
<text class="small" x="320" y="186" text-anchor="middle">this area to HA</text>
<text class="small strong" x="435" y="170" text-anchor="middle">no: keep</text>
<text class="small" x="435" y="186" text-anchor="middle">as a request</text>
</svg>
<figcaption>Home Assistant's area wins unless you chose a different one here on purpose.</figcaption>
</figure>

- When the device already has an area in Home Assistant, Panel Assistant adopts it here, even if you never open this setting.
- When the device has no area, the one you choose here is written to it, which needs a Home Assistant user with admin rights. Without admin rights it stays a request, and it is also suggested when the device is first registered.
- When you choose an area that differs from the device's area in Home Assistant, Panel Assistant keeps your choice rather than reverting it. Choosing the same area as Home Assistant ends the override.

:::tip
With [Auto-sleep presence source](#auto_sleep_source) set to Home Assistant, the presence and motion entities it watches are found through this area. If the room the panel is in has no motion sensor, point it at a neighbouring area that does.
:::

The change applies without restarting anything.
