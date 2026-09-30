---
spec: ['67b8a0934e32', 'c6a4cee87eac', '5fbc37929969']
help: "This panel's LAN IPv4 address as a sensor."
---

This row has no value to edit. Its switch adds a diagnostic sensor in Home Assistant that shows the panel's current IPv4 address on the local network. It is off by default, like every sensor on this card, so the panel adds nothing to Home Assistant until you turn one on.

It is useful for opening the panel's Configure page from a Home Assistant dashboard, or for spotting that the panel moved to a new address after a router change. The sensor updates when the address changes.
