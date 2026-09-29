---
spec: 3750153a0cc6
---

The list offers the areas that exist in your Home Assistant. Home Assistant's own area for the panel's device wins: when the device already has an area there, Panel Assistant adopts it here, even if you never open this setting. When the device has no area in Home Assistant, the one you choose here is written to it, which needs a Home Assistant user with admin rights, and is also suggested when the device is first registered. Leaving it blank means "follow Home Assistant".

You can also choose an area that differs from the device's area in Home Assistant, and Panel Assistant keeps your choice rather than reverting it. This is useful when [Auto-sleep presence source](#auto_sleep_source) is set to Home Assistant, because the presence and motion entities it watches are found through this area: if the room the panel is in has no motion sensor, point it at a neighbouring area that does. The change applies without restarting anything.
