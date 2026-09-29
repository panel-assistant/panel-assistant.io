---
spec: d43d8611b5c1
related:
  - /manage/security-mode/
---

Panels have no Play Store, so a minimal Home Assistant Companion app installed on them never updates on its own. With this on, the daily update check (about 30 seconds after Panel Assistant starts, then every 24 hours) does the following, using the same signature-checked installer as Panel Assistant's own updates:

| Companion on the panel                            | What happens                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------- |
| Minimal Companion missing                         | Installed from the [Companion channel](#companion_update_channel) |
| Minimal Companion older than the channel's newest | Updated                                                           |
| Minimal Companion up to date                      | Nothing                                                           |
| Full Companion from the Play Store                | Left alone                                                        |

Some panel profiles set a highest safe Companion version; the automatic update never goes past it and never downgrades. The setting needs root, appears only where a Companion app is installed, and matters only if you use the Companion as the dashboard app. In Hardened mode, turning it on needs approval at the panel.
