---
spec: eb7e519030ea
related:
  - /manage/troubleshooting/
---

With shipping on, every line of Panel Assistant's own log on the panel is sent to a log collector you run, such as a syslog server, so you can keep a history across several panels and after restarts. It is the same log the Logs tab streams live.

<figure class="setting-figure">
<svg viewBox="0 0 480 130" role="img" aria-labelledby="fig-log_ship_enabled">
<title id="fig-log_ship_enabled">Log lines pass through redaction and a queue on the panel before reaching your collector</title>
<rect class="panel" x="10" y="40" width="100" height="44" rx="6"/>
<text x="60" y="60" text-anchor="middle">App log</text>
<text class="small" x="60" y="76" text-anchor="middle">this app only</text>
<rect class="panel" x="130" y="40" width="100" height="44" rx="6"/>
<text x="180" y="60" text-anchor="middle">Redact</text>
<text class="small" x="180" y="76" text-anchor="middle">tokens, passwords</text>
<rect class="soft" x="250" y="40" width="100" height="44" rx="6"/>
<text x="300" y="60" text-anchor="middle">Queue</text>
<text class="small" x="300" y="76" text-anchor="middle">4000 lines</text>
<rect class="panel" x="370" y="40" width="100" height="44" rx="6"/>
<text x="420" y="60" text-anchor="middle">Collector</text>
<text class="small" x="420" y="76" text-anchor="middle">your sink</text>
<line class="accent" x1="110" y1="62" x2="130" y2="62"/>
<line class="accent" x1="230" y1="62" x2="250" y2="62"/>
<line class="accent" x1="350" y1="62" x2="370" y2="62"/>
<text class="small" x="300" y="110" text-anchor="middle">full: oldest line dropped</text>
<text class="small" x="240" y="25" text-anchor="middle">on the panel</text>
<line class="faint dash" x1="10" y1="30" x2="355" y2="30"/>
</svg>
<figcaption>Only Panel Assistant's own log leaves the panel, and never faster than the collector accepts it.</figcaption>
</figure>

- Tokens and passwords are removed before a line leaves the panel. The system log is never sent.
- Each record carries the panel ID as its host name, the app name `ha-paneld`, and the app build that wrote it.
- If the collector is unreachable for long enough that the queue fills, the oldest lines are dropped rather than slowing the panel.
- The panel's runtime diagnostics show whether shipping is connected and how many lines were sent or dropped.

Nothing is sent until [Sink host](#log_ship_host) is set as well. Leave shipping off unless you have a collector to receive the logs.
