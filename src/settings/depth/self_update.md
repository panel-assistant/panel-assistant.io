---
spec: 7626530997d1
related:
  - /manage/updates-and-recovery/
  - /manage/security-mode/
---

With this on, the panel checks for a newer release about 30 seconds after Panel Assistant starts and then once every 24 hours, and installs it when one is available on the [update channel](#update_channel). The install is signature-checked, and the app restarts itself onto the new version. The same daily check also runs the Companion and WebView auto-updates when those are on, and this one always goes last because it restarts the app.

With it off, the panel still reports available releases, and you install them yourself from Home Assistant's update entity or from a computer. The setting appears only on panels where Panel Assistant can install verified apps. In Hardened mode, turning it on needs approval at the panel; a policy already on when Hardened mode was chosen keeps installing authenticated updates without a new prompt.
