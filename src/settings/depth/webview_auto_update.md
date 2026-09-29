---
spec: 9b681eb8e25c
related:
  - /hardware/guides/update-the-webview/
  - /manage/security-mode/
---

Panel profiles can name a known-good System WebView build for the panel. Without this setting, Panel Assistant installs that build only when the panel's WebView engine is too old to render the Home Assistant dashboard, or when you run the manual WebView update. With it on, the daily update check (about 30 seconds after start-up, then every 24 hours) also moves a working WebView forward whenever the profile names a newer build. The decision uses the real Chromium engine version, and an unknown engine is never touched.

The download is large, about 90 MB, and a WebView swap only takes effect after a restart, which Panel Assistant carries out after a successful install. If a build was installed but the engine did not change, which happens on panels whose firmware locks the WebView signature, the same build is not retried every day; a newer recommended build clears that block. The setting needs root and appears only on panels whose profile names a recommended build. In Hardened mode, turning it on needs approval at the panel.
