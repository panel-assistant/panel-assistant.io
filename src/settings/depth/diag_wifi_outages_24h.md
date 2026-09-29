---
spec: 84dd4befb599
related:
  - /home-assistant/support-report/
---

This row has no value to edit. Its switch adds a diagnostic sensor in Home Assistant counting how many times the panel lost its Wi-Fi connection and got it back in the last 24 hours. It is off by default.

<figure class="setting-figure">
<svg viewBox="0 0 480 170" role="img" aria-labelledby="fig-diag_wifi_outages_24h">
<title id="fig-diag_wifi_outages_24h">Timeline of three Wi-Fi losses: the second starts within 10 seconds of the first recovery and merges into it, the third starts later and counts separately</title>
<line class="faint" x1="20" y1="90" x2="460" y2="90"/>
<rect class="soft" x="40" y="70" width="40" height="40"/>
<rect class="soft" x="120" y="70" width="30" height="40"/>
<rect class="soft" x="360" y="70" width="40" height="40"/>
<line class="accent" x1="80" y1="60" x2="80" y2="120"/>
<line class="accent" x1="400" y1="60" x2="400" y2="120"/>
<line class="ink dash" x1="80" y1="130" x2="130" y2="130"/>
<text class="small" x="105" y="148" text-anchor="middle">&lt; 10 s</text>
<text class="strong" x="95" y="50" text-anchor="middle">1 outage</text>
<text class="strong" x="380" y="50" text-anchor="middle">1 outage</text>
<text class="small" x="60" y="104" text-anchor="middle">lost</text>
<text class="small" x="135" y="104" text-anchor="middle">lost</text>
<text class="small" x="380" y="104" text-anchor="middle">lost</text>
<text class="small" x="440" y="148" text-anchor="end">time</text>
</svg>
<figcaption>An outage counts when Wi-Fi comes back. A new loss within 10 seconds of a counted recovery is the same outage continuing. Not to scale.</figcaption>
</figure>

What counts, and what does not:

- Counted: the panel's Wi-Fi link was lost and came back on Wi-Fi.
- Not counted: an outage still in progress, a restart of Home Assistant or of the broker, or a move to Ethernet.

Counts survive a restart of the app. The panel keeps up to 200 outage records.

| Result                 | Meaning                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `0` to `5`             | Occasional dropouts                                                                                                                    |
| `6` or more            | The Wi-Fi link needs attention; the panel's diagnostics report includes the count                                                      |
| `is_lower_bound: true` | Older records still inside the window were dropped, so the number is a minimum; the diagnostics report includes it whatever the number |

The [Wi-Fi signal strength](#diag_wifi_rssi) history is the first place to look for a cause.
