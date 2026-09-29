---
spec: a15486b824ef
---

While [Lock Android to dashboard](#kiosk_lock) is on, it brings the dashboard back whenever another app is in front. An app listed here is allowed to stay in front, for example the settings screens of a companion app that the dashboard opens. Enter full Android package names such as `com.example.app`, separated by commas; a value that is not a valid package name is rejected when you save. Up to 512 characters fit.

The list only matters while the lock is on. A change is in force at the lock's next check, within about three seconds, with no restart.
