---
spec: 7feec62399e9
related:
  - /manage/security-mode/
  - /manage/panel-security/
---

Some panel firmware drops the setting that keeps ADB over the network across a restart. With this on, Panel Assistant records that you want network ADB and turns it back on at every boot and reconnect. The switch needs root and appears only where it can work.

| Action        | Effect                                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Turn on       | Network ADB on port `5555`, reasserted after every boot and reconnect                                                             |
| Turn off      | Network ADB stopped, but only if Panel Assistant was keeping it on; the built-in renderer's WebView developer tools close at once |
| Either change | The ADB service restarts, briefly dropping any existing ADB connection                                                            |

:::caution
ADB enabled some other way, for example from Android's developer options, stays on when you turn this off, and must be turned off where it was enabled.
:::

Hardened mode refuses to turn this on, and requires it to be off before Hardened mode can be chosen.
