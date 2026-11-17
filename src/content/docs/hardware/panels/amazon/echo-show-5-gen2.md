---
title: Amazon Echo Show 5 (2nd generation)
description: Owner-reported dashboard compatibility and scoped test evidence for the 2021 Echo Show 5 reflashed with LineageOS 18.1.
vendor: Amazon
model: Echo Show 5 (2nd generation)
android: '11'
support: Community-tested
evidence: []
ownerReports:
  - schemaVersion: 1
    id: android-28-generic
    source: https://github.com/panel-assistant/android/issues/28
    observed: '2026-07-10'
    model:
      manufacturer: Amazon
      name: Echo Show 5 (2nd generation, cronos)
    firmware:
      build: lineage_cronos-userdebug 11 RQ3A.211001.001 eng.r0rt1z.20260624.021154 test-keys
      android: '11'
    software:
      appVersion: 0.9.0
      appBuild: '158'
      integrationVersion: unknown
      integrationBuild: unknown
    profile:
      level: generic
      id: unknown
      revision: unknown
    results:
      - behavior: dashboard
        outcome: works
        notes: The owner reported the app working well on Generic. Touch interaction was not separately established.
    limitations:
      - Runs a community LineageOS 18.1 image, not Amazon's Fire OS. Stock Fire OS cannot run the panel app, and unlocking and reflashing are not covered by Panel Assistant.
  - schemaVersion: 1
    id: android-28-profile
    source: https://github.com/panel-assistant/android/issues/28#issuecomment-4983311989
    observed: '2026-07-15'
    model:
      manufacturer: Amazon
      name: Echo Show 5 (2nd generation, cronos)
    firmware:
      build: lineage_cronos-userdebug 11 RQ3A.211001.001 eng.r0rt1z.20260624.021154 test-keys
      android: '11'
    software:
      appVersion: 0.9.2-rc1
      appBuild: '200'
      integrationVersion: unknown
      integrationBuild: unknown
    profile:
      level: community
      id: community.cronos-lineageos18
      revision: unknown
    results:
      - behavior: brightness
        outcome: untested
        notes: The owner reported Android's backlight range as 10 to 255; dimming from Home Assistant was not separately reported.
      - behavior: light
        outcome: untested
        notes: Android reports an ambient-light input; a response to real light changes was not established.
      - behavior: proximity
        outcome: not-fitted
        notes: No proximity sensor was reported.
      - behavior: leds
        outcome: not-fitted
        notes: No LEDs were reported.
      - behavior: relays
        outcome: not-fitted
        notes: No relays were reported.
    limitations:
      - The profile was matched on this panel when it was built in, before it moved to the import-only community catalogue. It is not selected automatically.
      - Covers only the 2021 second generation (codename cronos). It says nothing about the first or third generation Echo Show 5 or any Echo Show 8.
---

Basic dashboard compatibility is reported by one owner on a 2021 Echo Show 5 reflashed with LineageOS 18.1. It does not apply to other Echo Show models or to Amazon's own Fire OS. The import-only [community profile](/reference/profiles/community/echo-show-5-gen2/) page has the full evidence. Individual controls and sensors have separate results in the owner reports; this is not a bench inspection.
