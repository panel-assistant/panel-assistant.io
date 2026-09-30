---
spec: ['4bb8745b1513', '24c1c863f5dd', '203c160f2da8']
help: 'Built-in renderer: return to Home dashboard after this many idle minutes. 0 = off.'
related:
  - /manage/built-in-renderer/
---

Idle means nobody has touched the screen. The panel checks once a minute, so the return happens up to a minute after the time you set. It returns only when all of these hold:

- the screen is on;
- the dashboard is connected to Home Assistant;
- the dashboard is not already showing the home view.

The return swaps the view in place, without reloading the page.

<figure class="setting-figure">
<svg viewBox="0 0 480 150" role="img" aria-labelledby="fig-dashboard_idle_return_min">
<title id="fig-dashboard_idle_return_min">A seven-minute timeline for a 5 minute setting, with checks every minute and the return at the first check after five idle minutes</title>
<rect class="soft" x="40" y="60" width="285" height="30"/>
<line class="faint" x1="40" y1="90" x2="440" y2="90"/>
<line class="ink" x1="40" y1="50" x2="40" y2="100"/>
<text class="small" x="40" y="40" text-anchor="middle">last touch</text>
<line class="ink dash" x1="63" y1="80" x2="63" y2="100"/>
<line class="ink dash" x1="120" y1="80" x2="120" y2="100"/>
<line class="ink dash" x1="177" y1="80" x2="177" y2="100"/>
<line class="ink dash" x1="234" y1="80" x2="234" y2="100"/>
<line class="ink dash" x1="291" y1="80" x2="291" y2="100"/>
<line class="ink dash" x1="405" y1="80" x2="405" y2="100"/>
<line class="accent" x1="325" y1="50" x2="325" y2="100"/>
<text class="small" x="325" y="40" text-anchor="middle">5 min idle</text>
<circle class="accent-fill" cx="348" cy="90" r="6"/>
<text class="strong" x="348" y="125" text-anchor="middle">returns home</text>
<text class="small" x="40" y="125" text-anchor="middle">0</text>
<text class="small" x="440" y="125" text-anchor="middle">7 min</text>
<text class="small" x="182" y="145" text-anchor="middle">dashed marks: the once-a-minute check</text>
</svg>
<figcaption>With a 5 minute setting, the return happens at the first check after five minutes without a touch.</figcaption>
</figure>

The destination is [Home dashboard](#home_dashboard), including a specific tab if you set one. With Home dashboard on **Auto**, the panel waits until Home Assistant has told it which dashboard is the account's default.

| Value         | Effect                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `0` (default) | Off. The panel stays wherever it was left.                                                                                                   |
| `1` to `1440` | Returns home after that many idle minutes; `1440` is one day. A value such as `5` suits a shared panel where people wander into other views. |

:::note
This works only with the built-in renderer. Saving a value while a Companion app is selected in [Dashboard app](#dashboard_package) is refused.
:::
