---
spec: f63984a2e1d9
related:
  - /reference/profiles/
---

The model on the Home Assistant device card is the first of these that has a value:

1. this setting, used exactly as you type it, with nothing added;
2. the model named in the panel's device profile;
3. the model, device or product name Android reports.

| Connection      | Automatic value (2 or 3) is shown as                                                                                        |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| MQTT            | the name followed by ` (ha-paneld)`, so the panel can be told apart from another integration that manages the same hardware |
| Panel Assistant | the name as it is, without that marker                                                                                      |

Like [Manufacturer](#manufacturer), this changes only the label: device profile matching and hardware features are unaffected.
