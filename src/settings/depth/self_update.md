---
spec: 7626530997d1
related:
  - /manage/updates-and-recovery/
  - /manage/security-mode/
---

With this on, the panel checks for a newer release about 30 seconds after Panel Assistant starts and then once every 24 hours, and installs it when one is available on the [update channel](#update_channel). The install is signature-checked, and the app restarts itself onto the new version. The same daily check runs the other automatic updates first, because this one restarts the app:

<figure class="setting-figure">
<svg viewBox="0 0 480 120" role="img" aria-labelledby="fig-self_update">
<title id="fig-self_update">The daily update check runs four steps in order: check releases, Companion update, WebView update, then the Panel Assistant update, which restarts the app</title>
<rect class="panel" x="10" y="30" width="100" height="44" rx="6"/>
<text x="60" y="57" text-anchor="middle">Check releases</text>
<line class="ink" x1="110" y1="52" x2="128" y2="52"/>
<rect class="panel" x="128" y="30" width="100" height="44" rx="6"/>
<text x="178" y="57" text-anchor="middle">Companion</text>
<line class="ink" x1="228" y1="52" x2="246" y2="52"/>
<rect class="panel" x="246" y="30" width="100" height="44" rx="6"/>
<text x="296" y="57" text-anchor="middle">WebView</text>
<line class="ink" x1="346" y1="52" x2="364" y2="52"/>
<rect class="panel" x="364" y="30" width="106" height="44" rx="6"/>
<text class="strong" x="417" y="57" text-anchor="middle">Panel Assistant</text>
<text class="small" x="178" y="92" text-anchor="middle">if switched on</text>
<text class="small" x="296" y="92" text-anchor="middle">if switched on</text>
<text class="small" x="417" y="92" text-anchor="middle">last: restarts the app</text>
</svg>
<figcaption>One pass of the daily update check.</figcaption>
</figure>

With it off, the panel still reports available releases, and you install them yourself from Home Assistant's update entity or from a computer. The setting appears only on panels where Panel Assistant can install verified apps.

:::note
In Hardened mode, turning this on needs approval at the panel. A policy already on when Hardened mode was chosen keeps installing authenticated updates without a new prompt.
:::
