---
spec: 8e70df5ca2d1
related:
  - /manage/updates-and-recovery/
  - /manage/security-mode/
---

Stable follows the newest full release. Pre-release follows the newest published release of any kind, including release candidates, so it gets fixes and features earlier and with less testing behind them. Stay on Stable unless you want to try a release candidate.

When [auto-update](#self_update) is on, changing the channel acts straight away rather than waiting for the daily check: the panel resolves the newest build on the new channel, checks it can move to it safely, and installs it. Moving from Pre-release back to Stable installs the current stable release even when it is older than the pre-release you are running. If that build cannot be admitted, the channel change is refused and the old channel stays in place. In Hardened mode, a channel change that would start an install needs approval at the panel.
