---
spec: ['22db4869919f', 'd424bb5a08ae', 'dd868637ca92']
help: 'Run the on-board Zigbee gateway as a router/repeater (NSPanel Pro).'
related:
  - /manage/performance/
  - /hardware/panels/sonoff-nspanel-pro/
---

This setting appears only on a panel with a built-in Zigbee gateway, such as the Sonoff NSPanel Pro. Turning it on starts the vendor gateway if it is not already running and switches it to the Repeater role, so the panel can extend an existing Zigbee network run by your own coordinator. To join it to that network:

1. Turn this switch on and save.
2. Open permit-join on your coordinator.
3. Use **Request join** in the Join Zigbee network row that appears under the switch. The button stays disabled once the router has joined.

Turning it off stops the gateway and frees the radio. Stock firmware often starts the gateway at boot by itself, and Panel Assistant only stops it when you have set this switch explicitly, so a gateway you already rely on is left alone by default.

:::caution
On some stock firmware the vendor gateway cannot be stopped from the app and keeps running until the next restart.
:::

While the router is on, Panel Assistant samples the gateway once a minute. After a 15-minute start-up grace period it treats the gateway as a runaway if either of these happens:

- it restarts three or more times within ten minutes;
- it stays unjoined while using more than half a CPU core for five consecutive samples.

A runaway gateway is stopped and this setting is turned off, to protect the panel's responsiveness.

<figure class="setting-figure">
<svg viewBox="0 0 480 150" role="img" aria-labelledby="fig-zigbee_router">
<title id="fig-zigbee_router">Timeline showing a 15 minute grace period, then five high-CPU samples one minute apart leading to the gateway being stopped at minute 20</title>
<rect class="soft" x="40" y="40" width="240" height="50"/>
<text x="160" y="70" text-anchor="middle">start-up grace</text>
<line class="faint" x1="40" y1="90" x2="440" y2="90"/>
<line class="faint" x1="40" y1="86" x2="40" y2="94"/>
<line class="faint" x1="200" y1="86" x2="200" y2="94"/>
<line class="faint" x1="280" y1="86" x2="280" y2="94"/>
<line class="faint" x1="440" y1="86" x2="440" y2="94"/>
<text class="small" x="40" y="110" text-anchor="middle">0</text>
<text class="small" x="200" y="110" text-anchor="middle">10</text>
<text class="small" x="280" y="110" text-anchor="middle">15</text>
<text class="small" x="440" y="110" text-anchor="middle">25 min</text>
<circle class="accent-fill" cx="296" cy="75" r="5"/>
<circle class="accent-fill" cx="312" cy="75" r="5"/>
<circle class="accent-fill" cx="328" cy="75" r="5"/>
<circle class="accent-fill" cx="344" cy="75" r="5"/>
<circle class="accent-fill" cx="360" cy="75" r="5"/>
<line class="accent" x1="360" y1="30" x2="360" y2="90"/>
<text class="strong" x="470" y="26" text-anchor="end">stopped, switch off</text>
<text class="small" x="328" y="130" text-anchor="middle">5 high-CPU samples while unjoined</text>
</svg>
<figcaption>Samples during the grace period never count; only after minute 15 can five high readings in a row contain the gateway.</figcaption>
</figure>
