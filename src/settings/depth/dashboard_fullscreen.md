---
spec: 5cf396d3d6b0
related:
  - /manage/built-in-renderer/#dashboard-appearance-and-the-android-lock
---

With this on, the dashboard fills the whole screen. Android's status bar and navigation bar stay hidden while the built-in renderer is in front, and the panel hides them again after you have revealed them with a swipe or after a dialog brings them back. A change applies straight away, without reloading the dashboard.

:::tip
A swipe in from a screen edge always shows the bars briefly, so this cannot shut anyone out of Android.
:::

Three separate controls affect different layers:

| Setting                                                            | Hides                                                              | Does not                                                             |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| **Hide Android system bars** (this one)                            | Android's status and navigation bars                               | Stop anyone leaving the app, or hide Home Assistant's own navigation |
| [Hide Home Assistant navigation (native)](#dashboard_native_kiosk) | Home Assistant's own navigation                                    | Touch Android's bars                                                 |
| Lock Android to dashboard                                          | Nothing visual; it returns to the dashboard when another app opens | Change how the dashboard looks                                       |

Turn this off if you want the clock and notifications visible, or use Android's on-screen buttons regularly. It has no effect on a Companion app.
