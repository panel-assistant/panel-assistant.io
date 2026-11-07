---
title: Portworld YC-SM10P
description: Owner-reported dashboard compatibility and scoped test evidence for the Portworld YC-SM10P.
vendor: Portworld
model: YC-SM10P
android: '11'
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
