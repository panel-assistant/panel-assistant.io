---
spec: 9b681eb8e25c
related:
  - /hardware/guides/update-the-webview/
  - /manage/security-mode/
---

Panel profiles can name a known-good System WebView build for the panel. This setting decides when Panel Assistant installs it:

| Situation                                              | Off                            | On                             |
| ------------------------------------------------------ | ------------------------------ | ------------------------------ |
| WebView too old to render the Home Assistant dashboard | Installs the recommended build | Installs the recommended build |
| WebView works, profile names a newer build             | Left alone                     | Installed on the daily check   |
| You run the manual WebView update                      | Installs                       | Installs                       |
| Engine version unknown                                 | Left alone                     | Left alone                     |

The decision uses the real Chromium engine version, and the daily check runs about 30 seconds after start-up and then every 24 hours. The download is about 90 MB, and a WebView swap only takes effect after a restart, which Panel Assistant carries out after a successful install. The setting needs root and appears only on panels whose profile names a recommended build. In Hardened mode, turning it on needs approval at the panel.

:::note
On panels whose firmware locks the WebView signature, an install can succeed without the engine changing. Panel Assistant then stops retrying that build every day; a newer recommended build clears the block.
:::
