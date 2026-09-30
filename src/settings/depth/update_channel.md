---
spec: ['8e70df5ca2d1', 'ab56f0339f1e', '5466ac907c74']
help: 'Release channel the self-updater follows.'
related:
  - /manage/updates-and-recovery/
  - /manage/security-mode/
---

| Channel                        | Follows                                                                | When to pick it                                                    |
| ------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Stable** (`stable`)          | The newest full release                                                | The default; stay here unless you want to test                     |
| **Pre-release** (`prerelease`) | The newest published release of any kind, including release candidates | You want fixes and features earlier, with less testing behind them |

When [auto-update](#self_update) is on, changing the channel acts straight away rather than waiting for the daily check:

1. The panel resolves the newest build on the new channel.
2. It checks it can move to that build safely.
3. It installs it. If the build cannot be admitted, the change is refused and the old channel stays in place.

:::caution
Moving from **Pre-release** back to **Stable** installs the current stable release even when it is older than the pre-release you are running.
:::

In Hardened mode, a channel change that would start an install needs approval at the panel.
