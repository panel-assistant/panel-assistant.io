---
spec: 346293e85824
related:
  - /manage/built-in-renderer/
---

The lock is meant to stop someone passing by from wandering off the dashboard, not to stop a determined person. While it is on:

- the Android status and navigation bars are hidden;
- every three seconds the panel checks which app is in front and brings the dashboard back if it is not;
- Panel Assistant's own screens are left alone, so the release options stay reachable.

It does not use Android device-owner policies, so it cannot leave the panel unusable. Ways to release it:

- this setting, on the Configure page;
- the `Android dashboard lock` switch on the panel's device in Home Assistant;
- adb;
- seven taps in the top-left corner of the panel, each within one and a half seconds of the last (the corner is a small area that does not pass touches through while the lock is on);
- the unlocked window of about 60 seconds after the panel restarts.

:::caution
The lock needs root. On a panel without root, or on a panel model whose profile cannot make these changes, turning it on is refused and the setting stays off.
:::
