---
title: Control and Home Assistant reference
description: The Home Assistant entities, the panel's own pages and the local WebSocket that script a panel, and the deprecation of the REST API.
---

Home Assistant is the way to automate and monitor a panel. Panel Assistant publishes each panel as a device with entities and services, and everything an automation or a dashboard needs is there. For a script that runs on your local network, the panel also answers on a WebSocket on port `8888`. This page lists the entities, the panel's own pages and endpoints, the socket's messages and the status of the REST API.

## Home Assistant entities

Supported entities appear in Home Assistant without YAML. Entity IDs default to the forms below, where `<panel>` is the configured panel ID. Hardware-specific entities are omitted when the active device profile declares the capability absent, and optional setting and diagnostic entities can be exposed or hidden individually on the Configure page.

| Entity                                                   | Contract                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `light.<panel>_screen`                                   | Screen on/off and brightness using Home Assistant's JSON light schema and a `0` to `255` brightness value. Off follows the active profile: physical backlight-off where the panel exposes it, Android sleep where a `keyevent` route is validated, or safe brightness dimming as the fallback. The Android-sleep route refuses a panel protected by a PIN, pattern or password. |
| `light.<panel>_led`                                      | RGB or brightness-only panel LED, depending on the available backend; supported backends also expose effects.                                                                                                                                                                                                                                                                   |
| `light.<panel>_buttons`                                  | Brightness-capable button backlight when declared by the active profile.                                                                                                                                                                                                                                                                                                        |
| `light.<panel>_button_led1` to `button_led4`             | Individually controlled button LEDs when declared by the active profile.                                                                                                                                                                                                                                                                                                        |
| `switch.<panel>_relay1` to `relay4`                      | Hardware relays when declared by the active profile.                                                                                                                                                                                                                                                                                                                            |
| `text.<panel>_navigate`                                  | Sends a dashboard path to the active renderer. The built-in renderer navigates in process; a foreign renderer receives a deep link.                                                                                                                                                                                                                                             |
| `text.<panel>_home_dashboard`                            | Configures the path used by dashboard-return actions.                                                                                                                                                                                                                                                                                                                           |
| `number.<panel>_volume`                                  | Announcement volume from `0` to `100` percent on Android's music stream.                                                                                                                                                                                                                                                                                                        |
| `event.<panel>_button`                                   | Hardware button events, published when Android Accessibility capture is enabled or the active profile declares a verified button route.                                                                                                                                                                                                                                         |
| `sensor.<panel>_illuminance`                             | Ambient illuminance in lux when the panel has a standard Android light sensor.                                                                                                                                                                                                                                                                                                  |
| `sensor.<panel>_temperature` / `sensor.<panel>_humidity` | On-panel climate readings when declared by the active profile.                                                                                                                                                                                                                                                                                                                  |
| `binary_sensor.<panel>_proximity`                        | Calibrated near/far occupancy state. It remains unavailable until the local model is trustworthy.                                                                                                                                                                                                                                                                               |
| `sensor.<panel>_proximity_level`                         | Normalised proximity from `0` for the calibrated far baseline to `100` for the calibrated near reference.                                                                                                                                                                                                                                                                       |
| `sensor.<panel>_zigbee_gateway_health`                   | Bounded gateway health and redacted diagnostic attributes on Zigbee-capable panels.                                                                                                                                                                                                                                                                                             |
| `sensor.<panel>_storage_health`                          | Diagnostic storage and SQLite health with free-space, database-growth and bounded integrity attributes. Critical pressure or a database failure also fails installer verification; ha-paneld does not reclaim data automatically.                                                                                                                                               |
| `camera.<panel>_camera`                                  | Live view and still images from the panel camera through its RTSP stream. Off by default. Turning it on through the Home Assistant entity requires approval on the panel in every security mode; turning it off does not. Android camera permission and a working camera-in-use indicator are also required.                                                                    |
| `button.<panel>_reload`                                  | Reloads the built-in renderer in process or restarts the selected foreign renderer.                                                                                                                                                                                                                                                                                             |
| `button.<panel>_reboot`                                  | Reboots through an available privileged route.                                                                                                                                                                                                                                                                                                                                  |
| `media_player.<panel>_media_player`                      | The panel's speaker: play a URL or a media source, announce over what is playing, pause, resume, stop, and set or mute the volume. Pair it with `number.<panel>_volume`.                                                                                                                                                                                                        |
| `sensor.<panel>_status`                                  | Whether the panel is `online`, `connected` (it holds its session but its stored address does not answer), restarting for an `update`, `settings`, `recovery` or `reboot`, or signed in to another Home Assistant. Its attributes carry `reachable`, `connected`, `build`, `config_hash` and `home_assistant_state`.                                                             |

On a panel with a microphone, Home Assistant also gets an `assist_satellite.<panel>` entity: the panel's [voice assistant](/manage/voice-assistant/). It is unavailable while the voice assistant is turned off.

Registry-backed configuration, performance and diagnostic entities are published only when exposed on the Configure page. The optional diagnostic sensors are Last boot time, CPU usage, Memory usage, SoC temperature, IP address, Wi-Fi network, Wi-Fi signal strength and Wi-Fi outages (24 h).

## Automating a panel from Home Assistant

Use the panel's entities and the standard Home Assistant services; no call to the panel itself is needed.

- **Play audio or announce.** Call `media_player.play_media` on the panel's Media player entity with a URL or a media source. Set `announce: true` to speak over whatever is playing. `media_player.media_pause`, `media_player.media_play`, `media_player.media_stop`, `media_player.volume_set` and `media_player.volume_mute` work as on any media player.
- **Set the volume.** Use `number.set_value` on the Volume number, or `media_player.volume_set`.
- **Control the screen and the dashboard.** Use the Screen light, the Navigate text entity, the Home dashboard text entity and the Reload dashboard button.
- **Monitor a panel.** Watch the Status sensor and its attributes, and the diagnostic sensors above. They replace polling the health line from a script, and Home Assistant keeps their history.

```yaml
action: media_player.play_media
target:
  entity_id: media_player.wall_panel_media_player
data:
  media_content_type: music
  media_content_id: https://example.com/doorbell.mp3
  announce: true
```

Audio fetched over HTTPS uses Android's platform trust store and hostname verification. A self-signed certificate is rejected unless its CA is installed on the panel; plain HTTP remains available for trusted LAN sources.

## The panel's own pages and endpoints

Each panel serves a small, fixed set of paths on port `8888`. Nothing else is documented, and nothing else is promised.

| Path                           | Purpose                                                                                                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `/`                            | Panel status, capabilities, diagnostics and current dashboard preview. This is the Home Assistant device's `configuration_url`. |
| `/setup`                       | Guided first-run and reset journey for identity, connection, renderer, Home dashboard and entity-filter choices.                |
| `/configure`                   | Renderer and panel behaviour settings.                                                                                          |
| `/profiles`                    | Device-profile selection, inspection and YAML authoring.                                                                        |
| `/entities`                    | Built-in renderer entity learning, policy and overrides.                                                                        |
| `/install`                     | Software, backup, restore and maintenance actions.                                                                              |
| `/logs`                        | Redacted live application logs.                                                                                                 |
| `/health` and `/api/v1/health` | The one-line health report described below.                                                                                     |
| `/diag` and `/api/v1/diag`     | The plain-text diagnostics report. Review it before sharing it.                                                                 |
| `/ui`                          | The WebSocket described below.                                                                                                  |
| `/blob/<token>`                | One-use transfer of a large body for the socket.                                                                                |

The pages also load their scripts, styles and icons from the panel.

### The health line

The health line can carry `ha=<state>`, where the state is `normal`, `shutting_down`, `starting`, `back_online` or `connection_lost`. Panel Assistant sends native lifecycle notices; `connection_lost` means the connection dropped without a shutdown notice and is distinct from a deliberate shutdown.

`ha_src=native` identifies a lifecycle state observed through Panel Assistant. Locally inferred states can omit that token. No MQTT lifecycle source is used.

While the panel holds an authenticated Home Assistant socket for any reason (a Home Assistant ambient light or presence entity source, or a registry watch), the health line also reports the measured connection to Home Assistant. `ha_net=<healthy|warning|severe>` is the rolling five-minute verdict on the **network path**: a warning when more than 5% of the window's probes went unanswered, severe when two consecutive probes did. Round-trip latency never raises it, because the round trip also contains Home Assistant's own response time and the panel's thread scheduling; on a wired panel it can read hundreds of milliseconds against an actual path of under two. That figure is classified separately as `ha_resp=<healthy|warning|severe>`, which passes 100 ms for a warning and 1,000 ms for severe and is a performance observation only. `ha_net_p95=<ms>` is the nearest-rank 95th-percentile round trip of the app's own WebSocket ping probes (`-1` while no probe has answered), `ha_net_n=<count>` the probes in the window, `ha_net_miss=<count>` the probes that went unanswered and `ha_net_age=<ms>` how long ago the last probe was answered (`-1` when none has been), which is what separates a socket that has only just connected from a stream that stopped probing. For the first three minutes after the app starts, `ha_net=settling` is reported alone and no verdict is formed, because startup load makes the round trip describe the panel rather than the connection. One isolated miss or spike never alarms. Failures Home Assistant itself causes, such as closing or refusing the connection while it restarts or rejecting the sign-in, are counted apart and never as loss. A probe that goes unanswered while any other frame keeps arriving, including a late reply to an earlier probe, is a busy server rather than a lost path: it is counted as a server failure, and the shared socket stays up. Measurement belongs to an authenticated socket, not to the wish for one, so the tokens are absent until the panel has actually connected and signed in, and absent again once it stops (no credentials, nothing that needs the socket, or a connection that has given up). While a socket that has been live is being re-established the tokens remain, because a broken path has to be reported during the very outage it explains. A healthy verdict is therefore always stated explicitly rather than by omission. The `/diag` report carries both verdicts as one `[ha-network]` line; it never includes the Home Assistant address, the network name or an individual sample. A second, independent measurement of the same path is reported beside it: the panel sends a small burst of ICMP echo requests to the address its Home Assistant socket is actually connected on, and `/diag` carries the result as one `[ha-path-probe]` line. This probe is intermittent rather than continuous, and its interval widens as the path keeps proving itself and snaps back to its floor the moment anything looks wrong. It reports `state=unsupported` where the platform will not grant the app an ICMP socket, and `state=unproven` until an echo has actually been answered; silence before that is not counted as loss, because a Home Assistant behind a reverse proxy or on a host that filters ICMP would otherwise read as a totally failed network on a perfectly good link. The echo probe is reported only; it does not raise the panel warning. Both diag lines also name the **address family the socket is actually connected on** (`family=ipv4` or `family=ipv6`), in every state including `unsupported`, because knowing which family the panel is using matters most when no other layer-3 evidence is available. It is not an address, a hostname or a network name.

The Configure page can start Home Assistant's normal browser sign-in. The link it returns may be opened or copied into a private browser window, which avoids typing credentials on the panel. Home Assistant redirects to the panel-local callback; ha-paneld exchanges the one-use code itself and never returns access or refresh tokens to the browser. The callback is available only through the same trusted-LAN and Host checks as the rest of port `8888`, is bound to the panel address that started it, expires after ten minutes and sends `no-store`/`no-referrer` responses.

The service intentionally uses a trusted-LAN model rather than general authentication. It rejects non-LAN peers, invalid Host headers and browser requests with a mismatched Origin or Referer before routing. Keep port `8888` on a trusted network and do not expose it directly to the internet. Optional [Hardened mode](/manage/security-mode/) requires physical access for protected direct LAN requests; the [security reference](/reference/security/) describes the full posture.

## Scripting a panel on the local network

Open a WebSocket to `ws://<panel>:8888/ui` and send one JSON object per text frame. The panel answers with one text frame per request. The socket is the way to read or change anything a person can on the panel's pages from a script on the same network. A browser page that opens it must be on the panel's own origin, and the panel refuses a connection whose `Origin` does not match its `Host`. In Hardened mode the socket accepts only software on the panel itself.

### Requests

Every request carries a `command_id` that you choose. A manage request whose `command_id` the same address already used returns the recorded answer without running again.

A **manage request** reads or changes panel state by operation name, with its arguments in `args`:

```json
{ "kind": "manage", "command_id": "r42", "op": "perf", "args": {} }
```

A **channel command** sets one of the panel's channels, the same keys Home Assistant uses for the panel's entities. `deadline_ms` is how long the panel may take to start it, ten seconds when omitted:

```json
{ "kind": "command", "command_id": "c7", "channel": "volume", "value": 40, "deadline_ms": 10000 }
```

The panel takes the caller's address as the origin of every request on the socket and ignores any origin a frame names, so one script cannot use another's approval.

### Answers

```json
{ "command_id": "r42", "outcome": "applied", "result": { "…": "the operation's JSON body" } }
```

`outcome` is `applied`, `refused`, `failed`, `superseded` or `pending_approval`. A refusal or failure carries a `code`, such as `unknown_command`, `unknown_channel`, `invalid_value`, `not_commandable`, `refused_hardened`, `hardware_unavailable`, `expired`, `approval_denied`, `approval_timeout` or `failed`. When the operation did not succeed, `status` is the HTTP-style status it ended with, and `headers` carries the few response headers a caller needs, such as a download's file name. A frame that is not valid JSON, or has no `command_id`, is refused with `invalid_format`.

An operation that needs approval at the panel answers first with `outcome: pending_approval`, `interim: true` and the `approval_id` in `result`. Approve it on the panel and the same `command_id` receives its final answer; do not send it again. A denied or timed-out approval ends in a `refused` answer.

### Operation names

An unknown `op` answers `refused` with `unknown_command`, so a script can try a name and fall back. Names are lower-case letters, digits, underscores and dots, up to 64 characters. They are formed from the panel's former REST routes by one rule: take the route's path after the `/api/v1/` prefix, write each `/` as `.` and each `-` as `_`, and leave out path parameters, which move into `args`. A write that shares its path with a read adds `.set`. A route `some-feature/some-read` therefore becomes the operation `some_feature.some_read`. Query parameters and request bodies move into `args` too. The reads that the subscription families below poll are examples of names the panel serves: `perf`, `sensors`, `camera.status`, `radio`, `setup`, `install.status` and `proximity`. A body that is large or binary does not fit in a frame, so it moves as a blob (see Large bodies).

### Subscriptions

Instead of polling, subscribe to a family and the panel sends its current value, then each change:

```json
{ "kind": "manage", "command_id": "s1", "op": "subscribe", "args": { "family": "perf" } }
```

The answer is `applied` with `result: {"subscription": "s1"}`. Updates then arrive as frames of the form:

```json
{
  "subscription": "s1",
  "observations": [{ "channel": "perf", "state": "known", "value": { "…": "the family's value" } }]
}
```

`state` is `unavailable`, with a null `value`, while the family cannot be read. End one with `op: "unsubscribe"` and `args: {"subscription": "s1"}`; closing the socket ends them all. A connection may hold up to eight subscriptions. The families are `perf`, `sensors`, `camera`, `health`, `entities`, `proximity`, `microphone`, `radio`, `install`, `setup` and `logs`. Each family sends no more often than its own interval, between one and five seconds, and a newer value replaces one not yet sent. `logs` is the one family that appends: its value is an array of new lines, starting with the recent backlog.

### Large bodies

A frame into the panel is at most 2 MiB. To send a larger body, such as a backup to restore, ask for an upload with `op: "blob.upload"` and `args: {"type": "…", "size": 123}`. The answer's `result.url` is a `/blob/<token>` path on the panel: `PUT` the bytes there, and the panel answers with a reference (`url`, `size`, `sha256`, `type`). Name that reference in the `args.blob` of the request that uses it. The panel checks the size and SHA-256 before it uses the bytes. A large or binary result comes back the same way, as a `blob` reference to `GET`. Each token works once and expires after ten minutes.

## The REST API is deprecated

The REST API under `/api/v1` is deprecated, and its OpenAPI reference is no longer published. A panel that no longer serves a path answers it with `410` and `{"error": "gone"}`. The REST API stops answering on a panel once Panel Assistant no longer needs it. Use Home Assistant for automations and monitoring, and the socket above for scripts on the local network.

## Pairing and discovery

ha-paneld advertises `_ha-paneld._tcp.local.` with version, capability, route and friendly-name metadata. An opaque per-responder probe token lets the panel check that its own current advertisement remains visible on the LAN; after repeated misses it rebuilds the responder with bounded retries, and diagnostics warn if recovery is exhausted.
