---
spec: f11649737230
related:
  - /manage/adaptive-brightness/
---

The range is 4% to 99%, and the default is 4%. That lowest value is where the backlight's own minimum sits, so a lower number would change nothing on the screen. Raising the floor lifts the whole automatic range: the darkest room gets this level, and the brightest still gets full brightness.

<figure class="setting-figure">
<svg viewBox="0 0 480 200" role="img" aria-labelledby="fig-auto_brightness_minimum_percent">
<title id="fig-auto_brightness_minimum_percent">Automatic brightness spans from the floor to 100 percent; raising the floor from 4 to 30 percent lifts the dark end</title>
<line class="faint" x1="60" y1="170" x2="440" y2="170"/>
<line class="faint" x1="60" y1="20" x2="60" y2="170"/>
<text class="small" x="54" y="24" text-anchor="end">100%</text>
<text class="small" x="54" y="129" text-anchor="end">30%</text>
<text class="small" x="54" y="168" text-anchor="end">4%</text>
<line class="ink dash" x1="60" y1="164" x2="440" y2="20"/>
<line class="accent" x1="60" y1="125" x2="440" y2="20"/>
<text class="small" x="300" y="108">floor 4% (default)</text>
<text class="strong" x="170" y="70">floor 30%</text>
<text class="small" x="60" y="186">darkest</text>
<text class="small" x="440" y="186" text-anchor="end">brightest</text>
</svg>
<figcaption>Simplified: the proposed level between the room's darkest and brightest learned light.</figcaption>
</figure>

Raise it if the screen gets too dim to read at night or in a dark corner. It only bounds [Auto-brightness](#auto_brightness); manual brightness, from the panel or from Home Assistant, can still go below it. The change applies at once, and the chart on the Configure page previews it before you save.
