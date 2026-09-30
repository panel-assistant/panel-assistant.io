---
spec: 13c0190819cb
related:
  - /manage/built-in-renderer/#theming
  - /manage/adaptive-brightness/
---

Home Assistant decides light or dark per device, from a stored choice on that device or, when the user's theme is Auto, from the system's colour scheme. This setting decides who makes that decision on the panel.

| Choice                              | What decides light or dark                      | When to pick it                                                                                 |
| ----------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Follow Home Assistant** (default) | Home Assistant, as on any other device.         | You can reach the Home Assistant profile page from the panel, or you are happy with its choice. |
| **Dark**                            | The panel: always dark.                         | A kiosk dashboard with no sidebar, in a room that is usually dim.                               |
| **Light**                           | The panel: always light.                        | A kiosk dashboard with no sidebar, in a room that is usually bright.                            |
| **Ambient**                         | The panel: dark or light from the room's light. | A room whose light changes through the day, on a panel with auto-brightness on.                 |

**Dark**, **Light** and **Ambient** change only the light or dark part of the theme. Any named theme and its colours stay as they are, and the theme stored against your Home Assistant account is never touched, so another device signed in as the same user is unaffected. Switching back to **Follow Home Assistant** restores the light or dark value exactly as it was before.

**Ambient** uses the room brightness that auto-brightness tracks, measured against the range the panel has learned for that room. Between the two thresholds the current choice holds, so a room hovering near one threshold does not flicker, and a change is adopted only after the level has stayed past the other threshold for one minute without interruption.

<figure class="setting-figure">
<svg viewBox="0 0 480 170" role="img" aria-labelledby="fig-dashboard_theme">
<title id="fig-dashboard_theme">The room light scale with a dark band up to 0.40, a hold band between 0.40 and 0.55, and a light band from 0.55</title>
<rect class="soft" x="40" y="50" width="160" height="50"/>
<rect class="panel" x="260" y="50" width="180" height="50"/>
<line class="faint" x1="40" y1="100" x2="440" y2="100"/>
<line class="accent" x1="200" y1="40" x2="200" y2="110"/>
<line class="accent" x1="260" y1="40" x2="260" y2="110"/>
<text class="strong" x="120" y="80" text-anchor="middle">Dark</text>
<text x="230" y="80" text-anchor="middle" class="small">holds</text>
<text class="strong" x="350" y="80" text-anchor="middle">Light</text>
<text class="small" x="40" y="125" text-anchor="middle">0</text>
<text class="small" x="200" y="125" text-anchor="middle">0.40</text>
<text class="small" x="260" y="125" text-anchor="middle">0.55</text>
<text class="small" x="440" y="125" text-anchor="middle">1</text>
<text class="small" x="240" y="155" text-anchor="middle">Room light, from this room's darkest (0) to its brightest (1)</text>
<text class="small" x="240" y="30" text-anchor="middle">A change must last one minute before it is adopted</text>
</svg>
<figcaption>How Ambient chooses: dark at or below 0.40, light at or above 0.55, and no change in between.</figcaption>
</figure>

:::note
If [auto-brightness](/manage/adaptive-brightness/) is off, or the panel has no light source, **Ambient** behaves as **Follow Home Assistant**. Until the first one-minute reading is in, it also follows Home Assistant.
:::

:::caution
If the Home Assistant user has explicitly chosen Light or Dark, that still wins over **Dark**, **Light** and **Ambient**. The panel reports this on the **Runtime diagnostics** card and as `theme_overridden: true` in `GET /api/v1/status`. Set that user's theme to Auto, or give the panel its own Home Assistant user.
:::

The panel's own web interface on port 8888 always follows the browser viewing it.
