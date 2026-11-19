---
title: Portworld YC-SM10P
description: Owner-reported dashboard compatibility and scoped test evidence for the Portworld YC-SM10P.
vendor: Portworld
model: YC-SM10P
soc: Rockchip RK3566; RK3576 on the 2026 Android 14 version
android: '11'
screen: 10.1 in, 1280 × 800
sold_as:
  - brand: Sunworld
    name: 'YC-SM10P'
    note: 'Listed under the Sunworld name by some sellers'
support: Community-tested
evidence: []
ownerReports:
  - schemaVersion: 1
    id: android-138-generic
    source: https://github.com/panel-assistant/android/issues/138
    observed: unknown
    model:
      manufacturer: Portworld
      name: YC-SM10P
    firmware:
      build: C06-V21.3-YC-10.1MIPI-TV101WXM-NM1-SW0.6-20231013-270
      android: '11'
    software:
      appVersion: 0.9.6
      appBuild: '527'
      integrationVersion: unknown
      integrationBuild: unknown
    profile:
      level: generic
      id: unknown
      revision: unknown
    results:
      - behavior: dashboard
        outcome: works
        notes: The owner reported it running well with the built-in renderer on Generic. Touch interaction was not separately established.
    limitations:
      - This dashboard testimony predates the later community-profile tests. See the follow-up record for corrected sensor claims.
  - schemaVersion: 1
    id: android-138-corrected-hardware
    source: https://github.com/panel-assistant/android/issues/138#issuecomment-5570358840
    observed: unknown
    model:
      manufacturer: Portworld
      name: YC-SM10P
    firmware:
      build: C06-V21.3-YC-10.1MIPI-TV101WXM-NM1-SW0.6-20231013-270
      android: '11'
    software:
      appVersion: 0.9.7-rc3
      appBuild: '707'
      integrationVersion: unknown
      integrationBuild: unknown
    profile:
      level: community
      id: community.yc-sm10p
      revision: unknown
    results:
      - behavior: brightness
        outcome: works
        notes: Brightness worked after granting WRITE_SETTINGS.
      - behavior: sleep-wake
        outcome: works
        notes: The owner observed backlight power 4 / 0 and brightness 0 / 120 during sleep and wake.
      - behavior: light
        outcome: fails
        notes: 'Correction: the originally claimed sensor did not respond. A sensors-started log did not establish a reading.'
      - behavior: proximity
        outcome: fails
        notes: 'Correction: the declared sensor did not respond; initial success was retracted.'
      - behavior: buttons
        outcome: not-fitted
        notes: No physical buttons reported.
      - behavior: leds
        outcome: not-fitted
        notes: No LEDs reported.
      - behavior: relays
        outcome: not-fitted
        notes: No relays reported.
    limitations:
      - The active community profile was version 0.1.1; its exact revision hash is unknown.
      - Direct su worked; helper persistence remained unresolved.
      - Dashboard compatibility was reported earlier on Generic and was not separately re-established with this profile in this record.
---

Basic dashboard compatibility is reported by an owner on Generic. Individual controls and sensors have separate results below; this is not a bench inspection or a claim about every firmware version.

## Published specifications

Portworld's own listings give a 10.1 inch IPS screen at 1280 × 800, with RJ45, RS485 and USB Type-C, and power over Ethernet. Two versions are on sale under the same model name: the original on a Rockchip RK3566 with Android 11, which is the version the owner reports above come from, and a 2026 version on an RK3576 with Android 14 and 4 GB of RAM. Some sellers list the panel as the Sunworld YC-SM10P. These are sellers' statements read in November 2026, not measurements: [RK3566 listing](https://www.aliexpress.com/item/1005011952795896.html), [RK3576 listing](https://www.aliexpress.com/item/1005012371267912.html).
