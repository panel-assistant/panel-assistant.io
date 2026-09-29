---
spec: 61fdd9aabf48
---

This is the name on the panel's device card in Home Assistant, whether the panel is connected through Panel Assistant or through MQTT, and the name other panels show for it in their header switcher. Left blank, it uses the Android device name, which is also what the Home Assistant Companion app uses by default, and falls back to the model when the device has no name. Unlike [Panel ID](#panel_id) it is only a label, so you can rename it at any time without affecting entity IDs. It is never copied when settings are applied to another panel.
