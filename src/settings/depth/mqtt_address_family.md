---
spec: 58003c056748
---

This only matters when a host name, such as your broker or `homeassistant.local`, resolves to both IPv6 and IPv4 addresses.

<figure class="setting-figure">
<svg viewBox="0 0 480 150" role="img" aria-labelledby="fig-mqtt_address_family">
<title id="fig-mqtt_address_family">Order in which each choice tries IPv6 and IPv4 addresses</title>
<text class="strong" x="10" y="35">Automatic</text>
<rect class="panel" x="140" y="18" width="120" height="26" rx="4"/>
<text x="200" y="36" text-anchor="middle">last that worked</text>
<rect class="soft" x="290" y="18" width="120" height="26" rx="4"/>
<text x="350" y="36" text-anchor="middle">the other</text>
<line class="faint" x1="260" y1="31" x2="290" y2="31"/>
<text class="strong" x="10" y="80">Prefer IPv4</text>
<rect class="panel" x="140" y="63" width="120" height="26" rx="4"/>
<text x="200" y="81" text-anchor="middle">IPv4</text>
<rect class="soft" x="290" y="63" width="120" height="26" rx="4"/>
<text x="350" y="81" text-anchor="middle">IPv6</text>
<line class="faint" x1="260" y1="76" x2="290" y2="76"/>
<text class="strong" x="10" y="125">Force IPv4</text>
<rect class="panel" x="140" y="108" width="120" height="26" rx="4"/>
<text x="200" y="126" text-anchor="middle">IPv4</text>
<text class="small" x="290" y="126">IPv6 never used</text>
</svg>
<figcaption>First choice on the left, fallback on the right.</figcaption>
</figure>

| Choice                  | What happens                                                                                                   | When to pick it                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Automatic** (default) | Tries IPv6 first, switches family when a connection fails, and remembers the family that worked for next time. | Almost always.                                                                                                                 |
| **Prefer IPv4**         | Tries IPv4 first, still falls back to IPv6.                                                                    | IPv6 is advertised on your network but does not reliably reach the broker or Home Assistant, and the panel keeps reconnecting. |
| **Force IPv4**          | Never uses IPv6.                                                                                               | As above, when IPv6 must be avoided entirely.                                                                                  |

:::caution
With **Force IPv4**, a host that has only an IPv6 address becomes unreachable.
:::

The setting is read at each new connection attempt, so it takes effect the next time the panel connects. Log shipping does not use it; it always tries IPv4 first on its own.
