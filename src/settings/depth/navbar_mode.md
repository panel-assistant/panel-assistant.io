---
spec: 9d3755cadd25
related:
  - /manage/built-in-renderer/
---

Some panel firmware hides the standard Android navigation bar, which leaves no Back, Home or Recents buttons. Panel Assistant can draw its own bar over the screen instead. **Always on** keeps it pinned to the bottom edge. **Swipe reveal** keeps it hidden until you swipe up from the bottom edge, then hides it again after about five seconds. **Off** draws nothing. **Native** also draws nothing, and is offered only on panels whose firmware has its own navigation bar, because choosing it anywhere else would leave no way to navigate.

The bar has Back, Launcher, Dashboard, Recents and Reload buttons, and brightness and volume steps that act on the panel directly without Home Assistant. Back and Recents need the Panel Assistant accessibility service to be enabled. Drawing the bar needs permission to draw over other apps; without it and without root the bar does not appear.

When the setting has never been saved, the default depends on the panel model: Native where the firmware has its own bar, Swipe reveal on panels whose firmware hides it, and Always on on a model that has neither Recents nor physical buttons. The setting is also a select on the panel's device in Home Assistant.
