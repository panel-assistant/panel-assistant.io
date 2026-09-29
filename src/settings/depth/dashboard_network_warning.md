---
spec: e8e5ef800dd3
---

The warning is a small card in a corner of the dashboard. It appears only while the panel is connected to Home Assistant and judges the network path to it degraded: amber for a warning, red when the problem is severe. The dashboard keeps running underneath, and only the card's close button takes a touch; taps elsewhere pass through to the dashboard.

<figure class="setting-figure">
<svg viewBox="0 0 480 200" role="img" aria-labelledby="fig-dashboard_network_warning">
<title id="fig-dashboard_network_warning">A dashboard with a small warning card in one corner and a close button on the card</title>
<rect class="panel" x="40" y="16" width="400" height="168" rx="8"/>
<rect class="soft" x="60" y="36" width="170" height="60" rx="4"/>
<rect class="soft" x="250" y="36" width="170" height="60" rx="4"/>
<rect class="soft" x="60" y="108" width="170" height="60" rx="4"/>
<rect class="ink" x="244" y="130" width="190" height="40" rx="6"/>
<polygon class="accent-fill" points="256,160 266,140 276,160"/>
<text class="small" x="284" y="155">HA network unreliable</text>
<line class="accent" x1="418" y1="142" x2="426" y2="150"/>
<line class="accent" x1="426" y1="142" x2="418" y2="150"/>
<text class="small" x="240" y="196" text-anchor="middle">Dashboard stays usable around and under the card</text>
</svg>
<figcaption>The card covers as little as possible; only its close button takes a touch.</figcaption>
</figure>

| You do                | Result                                                                   |
| --------------------- | ------------------------------------------------------------------------ |
| Close the card        | Hidden until the path recovers; it can return if the path degrades again |
| Turn this setting off | The card never appears; applies straight away                            |

The panel keeps measuring the connection either way, so the status stays available elsewhere. Turn the setting off on a panel where you already know the network is slow and the card is only in the way. This is separate from the notice the panel shows when Home Assistant cannot be reached at all.
