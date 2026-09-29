---
spec: f63984a2e1d9
related:
  - /reference/profiles/
---

Left blank, the model on the Home Assistant device card comes from the panel's device profile, and if no profile names one, from the model, device or product name Android reports. Over MQTT, that automatic value gets ` (ha-paneld)` added so the panel can be told apart from another integration that manages the same hardware; Panel Assistant sends it without that marker. A value you type is used exactly as written, with nothing added. Like [Manufacturer](#manufacturer), this changes only the label: device profile matching and hardware features are unaffected.
