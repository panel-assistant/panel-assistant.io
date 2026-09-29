---
spec: 7feec62399e9
related:
  - /manage/security-mode/
  - /manage/panel-security/
---

Some panel firmware drops the setting that keeps ADB over the network across a restart. With this on, Panel Assistant records that you want network ADB and turns it back on at every boot and reconnect. Changing the switch restarts the ADB service, which briefly drops any existing ADB connection. The switch needs root and appears only where it can work.

Turning it off stops network ADB only if Panel Assistant was the one keeping it on, which is why ADB enabled some other way, for example from Android's developer options, must also be turned off there. The same switch controls the WebView developer tools of the built-in renderer, and turning it off closes them at once. Hardened mode refuses to turn it on, and requires it to be off before Hardened mode can be chosen.
