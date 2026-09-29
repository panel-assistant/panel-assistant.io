---
spec: 9d3755cadd25
related:
  - /manage/built-in-renderer/
---

Some panel firmware hides the standard Android navigation bar, which leaves no Back, Home or Recents buttons. Panel Assistant can draw its own bar over the screen instead.

<figure class="setting-figure">
<svg viewBox="0 0 480 180" role="img" aria-labelledby="fig-navbar_mode">
<title id="fig-navbar_mode">Three panel screens: a bar pinned to the bottom, a hidden bar revealed by an upward swipe, and no bar</title>
<rect class="panel" x="20" y="20" width="130" height="120" rx="6"/>
<rect class="accent-fill" x="20" y="116" width="130" height="24"/>
<text x="85" y="162" text-anchor="middle" class="strong">Always on</text>
<rect class="panel" x="175" y="20" width="130" height="120" rx="6"/>
<rect class="soft" x="175" y="130" width="130" height="10"/>
<line class="accent" x1="240" y1="128" x2="240" y2="96"/>
<polyline class="accent" points="232,104 240,96 248,104"/>
<text x="240" y="84" text-anchor="middle" class="small">swipe up</text>
<text x="240" y="162" text-anchor="middle" class="strong">Swipe reveal</text>
<rect class="panel" x="330" y="20" width="130" height="120" rx="6"/>
<text x="395" y="84" text-anchor="middle" class="small">nothing drawn</text>
<text x="395" y="162" text-anchor="middle" class="strong">Off and Native</text>
</svg>
<figcaption>Where the panel-drawn bar sits in each mode. Native draws nothing because the firmware's own bar is there.</figcaption>
</figure>

| Choice           | What you see                                                                                       | When to pick it                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Always on**    | A bar pinned to the bottom edge                                                                    | Panels with no other way to go back or leave an app                                                            |
| **Swipe reveal** | Nothing until you swipe up from the bottom edge; the bar then hides again after about five seconds | You want navigation available but the full screen for the dashboard                                            |
| **Off**          | No bar                                                                                             | You do not need navigation on the panel                                                                        |
| **Native**       | No bar from Panel Assistant; the firmware's own bar is used                                        | Offered only on panels whose firmware has its own bar, because anywhere else it would leave no way to navigate |

The bar has Back, Launcher, Dashboard, Recents and Reload buttons, plus brightness and volume steps that act on the panel directly without Home Assistant.

:::note
Back and Recents need the Panel Assistant accessibility service to be enabled. Drawing the bar needs permission to draw over other apps; without it and without root the bar does not appear.
:::

When the setting has never been saved, the default depends on the panel model: **Native** where the firmware has its own bar, **Swipe reveal** on panels whose firmware hides it, and **Always on** on a model that has neither Recents nor physical buttons. The setting is also a select on the panel's device in Home Assistant.
