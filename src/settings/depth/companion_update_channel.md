---
spec: 181223543998
related:
  - /manage/security-mode/
---

| Channel                        | Follows                       |
| ------------------------------ | ----------------------------- |
| **Stable** (`stable`)          | The Companion's full releases |
| **Pre-release** (`prerelease`) | Full releases and test builds |

The channel only has an effect while [Companion auto-update](#companion_auto_update) is on, and when it is, changing the channel starts an update check straight away instead of waiting for the daily one.

:::note
A safety ceiling set by the panel's profile applies on either channel, so **Pre-release** cannot take a panel past the highest Companion version known to work on it.
:::

In Hardened mode, a channel change that would start an install needs approval at the panel.
