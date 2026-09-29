---
spec: d43d8611b5c1
related:
  - /manage/security-mode/
---

Panels have no Play Store, so a minimal Home Assistant Companion app installed on them never updates on its own. With this on, the daily update check (about 30 seconds after Panel Assistant starts, then every 24 hours) installs the minimal Companion if it is missing and updates it when a newer release exists on the [Companion channel](#companion_update_channel). It uses the same signature-checked installer as Panel Assistant's own updates and needs root.

A full Companion installed from the Play Store is left alone. Some panel profiles set a highest safe Companion version; the automatic update never goes past it and never downgrades. The setting appears only where a Companion app is installed, and matters only if you use the Companion as the dashboard app. In Hardened mode, turning it on needs approval at the panel.
