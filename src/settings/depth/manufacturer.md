---
spec: d21bb6290949
related:
  - /reference/profiles/
---

The manufacturer on the Home Assistant device card is the first of these that has a value:

1. this setting, used exactly as you type it;
2. the manufacturer named in the panel's device profile;
3. the manufacturer Android reports.

Fill it in only when the automatic value is wrong or unhelpful, for example a rebadged panel that reports the chip or board maker rather than the brand on the box. It changes only the label; it does not change which device profile or hardware features the panel uses. It is treated as specific to this panel, so it is not copied when settings are applied to other panels by default. See also [Model](#model).
