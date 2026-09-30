---
spec: c731944bbecd
related:
  - /home-assistant/move-from-mqtt/
---

The password for [Username](#mqtt_user). The form never shows the stored password, so the field is empty each time you open it.

| When you save with                                                                            | The stored password |
| --------------------------------------------------------------------------------------------- | ------------------- |
| the field empty                                                                               | is kept             |
| a new password                                                                                | is replaced         |
| the user name cleared                                                                         | is cleared as well  |
| a changed broker URL and the field empty, in Hardened [security mode](/manage/security-mode/) | is discarded        |

Like the user name, it is not copied to other panels by default.
