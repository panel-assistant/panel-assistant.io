---
spec: 17c7dc8bab9e
related:
  - /reference/api/
  - /reference/profiles/community/#enabling-the-camera-on-a-panel-whose-profile-does-not-declare-one
---

The Camera card appears on any panel with a camera: one its hardware profile declares, or one Android reports on a panel whose profile says nothing. If a panel has a camera the card does not offer, the card says why, and the linked profile guide covers the cases that have a fix.

Turning it on from Home Assistant asks for approval at the panel first, in every security mode, and Android also needs camera permission granted at the panel. Turning it off never asks and ends any live session at once. Switching it on only makes the camera available; the camera opens when a client asks for a frame and closes again when nobody is watching. If the panel cannot show its red indicator light, the camera does not open.

<figure class="setting-figure">
<svg viewBox="0 0 480 170" role="img" aria-labelledby="fig-camera_enabled">
<title id="fig-camera_enabled">The first client opens one camera session and later stream viewers and snapshots share it</title>
<rect class="panel" x="170" y="50" width="140" height="60" rx="6"/>
<text class="strong" x="240" y="76" text-anchor="middle">one session</text>
<text class="small" x="240" y="94" text-anchor="middle">indicator on</text>
<rect class="soft" x="20" y="20" width="110" height="34" rx="4"/>
<text class="small" x="75" y="41" text-anchor="middle">first client</text>
<rect class="soft" x="20" y="106" width="110" height="34" rx="4"/>
<text class="small" x="75" y="127" text-anchor="middle">later viewers</text>
<line class="accent" x1="130" y1="37" x2="170" y2="70"/>
<line class="ink dash" x1="130" y1="123" x2="170" y2="92"/>
<rect class="soft" x="350" y="20" width="110" height="34" rx="4"/>
<text class="small" x="405" y="41" text-anchor="middle">RTSP :8554</text>
<rect class="soft" x="350" y="106" width="110" height="34" rx="4"/>
<text class="small" x="405" y="127" text-anchor="middle">JPEG snapshot</text>
<line class="ink" x1="310" y1="70" x2="350" y2="37"/>
<line class="ink" x1="310" y1="92" x2="350" y2="123"/>
<text class="small" x="240" y="160" text-anchor="middle">Closes when nobody is watching</text>
</svg>
<figcaption>The first client opens the camera and sets its parameters; later viewers join the same session.</figcaption>
</figure>

| Where                 | Address or entity                                                      |
| --------------------- | ---------------------------------------------------------------------- |
| Video stream          | `rtsp://<panel>:8554/live`, for example `rtsp://192.168.x.x:8554/live` |
| Still image           | `http://<panel>:8888/api/v1/camera/snapshot.jpg`                       |
| Home Assistant switch | `switch.<panel>_camera_enabled`                                        |
| Home Assistant still  | `image.<panel>_camera_snapshot`, fetched only when the card is viewed  |

:::caution
Do not put a panel's own camera on that same panel's dashboard. The panel cannot afford to capture, encode and display the same picture at once, and the stream yields to the dashboard.
:::
