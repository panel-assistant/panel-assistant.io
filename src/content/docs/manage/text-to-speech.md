---
title: Text to speech
description: Speaking any Home Assistant text-to-speech voice on a panel with two REST commands and a short script.
---

Any Home Assistant text-to-speech voice, such as Piper or Home Assistant Cloud, can speak on a panel. Home Assistant renders the phrase to an audio URL, and the panel downloads and plays it through its `POST /play` endpoint. Copy the three blocks under [Setup](#setup), then call `script.ha_paneld_say`.

Voices rendered by Home Assistant are far better than the text-to-speech built into older panels.

:::note
`/play` accepts the bare URL as the request body (or `{"url":"…"}`), **not** a form field. The [API reference](/reference/api/) describes the endpoint.
:::

## Setup

You need a text-to-speech engine (for example `tts.piper`) and a **long-lived access token** (your Home Assistant profile, then **Security**) in `secrets.yaml`. You also write your Home Assistant's local base URL into the script below.

`secrets.yaml`:

```yaml
ha_token: 'Bearer eyJ…' # Long-Lived Access Token, prefixed with "Bearer "
```

`configuration.yaml`:

```yaml
rest_command:
  # Render a phrase with an HA TTS engine; returns {"url", "path"}.
  ha_paneld_tts_get_url:
    url: 'http://127.0.0.1:8123/api/tts_get_url'
    method: POST
    headers:
      authorization: !secret ha_token
      content-type: application/json
    payload: '{"engine_id": "{{ engine }}", "message": "{{ message }}"}'

  # Send a ready audio URL to a panel's /play (raw URL in the body).
  ha_paneld_play:
    url: '{{ base }}play'
    method: POST
    payload: '{{ media_url }}'
```

`scripts.yaml`:

```yaml
ha_paneld_say:
  alias: 'Panel: speak (TTS)'
  fields:
    message:
      description: 'Phrase to speak'
      example: 'Dinner is ready'
    target:
      description: 'Any ha-paneld entity on the target panel'
      example: 'light.living_room_screen'
    engine:
      description: 'TTS engine entity_id'
      example: 'tts.piper'
  sequence:
    - service: rest_command.ha_paneld_tts_get_url
      data:
        engine: "{{ engine | default('tts.piper') }}"
        message: '{{ message }}'
      response_variable: tts
    - service: rest_command.ha_paneld_play
      data:
        # Panel address from its HA device — no IP to hardcode.
        base: "{{ device_attr(device_id(target), 'configuration_url') }}"
        # Rebuild on your LAN base so the panel can fetch it (tts_get_url returns the external URL).
        # Inline your internal_url here (templates can't read secrets.yaml):
        media_url: "http://homeassistant.local:8123{{ tts['content']['path'] }}"
```

:::tip
Templates cannot read `secrets.yaml`, which is why the local base URL is written into the script rather than kept as a secret. Either write your internal base URL into the script as above, or expose it through a `template` sensor. If your **external** URL can be reached from the panel, you can skip the rebuild and use `tts['content']['url']` from the response directly.
:::

## Use it

From an automation or the Home Assistant interface:

```yaml
- service: script.ha_paneld_say
  data:
    message: 'The washing machine has finished'
    target: light.living_room_screen # any entity belonging to the target panel
    engine: tts.piper
```

The panel's volume is `number.<panel>_volume`; set it beforehand if needed. To speak in several rooms, call the script once for each panel.

## How it works

1. Home Assistant renders the phrase and returns an audio URL from `POST /api/tts_get_url`.
2. `tts_get_url` returns your **external** URL, so the script rebuilds it from your **`internal_url` plus the returned `path`**, which the panel can fetch on your local network.
3. The script posts that URL, raw, in the body of a request to the panel's `/play`. The panel's address comes from the `configuration_url` of its Home Assistant device (`http://<ip>:8888/`), so all you pass is an entity belonging to the panel.
