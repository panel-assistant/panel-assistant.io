---
spec: 38c469c1824d
related:
  - /manage/vendor-packages/
---

The picker lists apps that register as an Android Home app. When the field is blank, Panel Assistant resolves the launcher in this order, and the Configure page shows which app it landed on:

1. the panel's default Home app, if it is a real launcher;
2. otherwise another installed launcher;
3. otherwise its own panel admin launcher, an app drawer for panel maintenance.

Apps that register as a Home app without being a launcher, such as Android Settings and some vendor control panels, are never picked automatically, because opening them would hide the dashboard rather than open an app drawer.

Choosing **Panel admin** makes Panel Assistant the Android Home app and keeps it so, restoring it if something else takes over. If you later hand the panel back to its own launcher, Panel Assistant clears this setting first.

:::caution
If you [disable vendor packages](/manage/vendor-packages/), do not disable the launcher you choose here.
:::
