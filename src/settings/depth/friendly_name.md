---
spec: ['61fdd9aabf48', '48de57abedb1', 'fe8957b41854']
help: 'HA device display name.'
---

This is the name shown:

- on the panel's device card in Home Assistant, whether the panel is connected through Panel Assistant or through MQTT;
- for this panel in other panels' header switcher.

Left blank, it uses the Android device name, which is also what the Home Assistant Companion app uses by default, and falls back to the model when the device has no name. Unlike [Panel ID](#panel_id) it is only a label, so you can rename it at any time without affecting entity IDs. It is never copied when settings are applied to another panel.
