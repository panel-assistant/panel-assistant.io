---
spec: d21bb6290949
related:
  - /reference/profiles/
---

Left blank, the manufacturer on the Home Assistant device card comes from the panel's device profile, and if no profile names one, from what Android reports. Fill it in only when that value is wrong or unhelpful, for example a rebadged panel that reports the chip or board maker rather than the brand on the box. The value is used exactly as you type it and changes only the label; it does not change which device profile or hardware features the panel uses. It is treated as specific to this panel, so it is not copied when settings are applied to other panels by default. See also [Model](#model).
