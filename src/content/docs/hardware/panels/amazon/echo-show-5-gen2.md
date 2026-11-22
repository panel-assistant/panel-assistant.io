---
title: Amazon Echo Show 5 (2nd generation, LineageOS report only)
description: One owner report on LineageOS 18.1 for the 2021 Echo Show 5. Panel Assistant has not verified this on a device, and stock Fire OS is unsupported.
vendor: Amazon
model: Echo Show 5 (2nd generation)
android: '11'
support: Owner report only
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
        outcome: untested
        notes: The owner said the app worked well on Generic. The report does not describe a dashboard, touch or Home Assistant connection test.
    limitations:
      - The report covers one community LineageOS 18.1 image. Panel Assistant has no supported installation route for stock Fire OS.
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
      level: built-in
      id: echo-show-5-gen2
      revision: unknown
    results:
      - behavior: brightness
        outcome: untested
        notes: The owner reported Android's backlight range as 10 to 255; dimming from Home Assistant was not separately reported.
      - behavior: light
        outcome: untested
        notes: Android reports an ambient-light input; a response to real light changes was not established.
      - behavior: proximity
        outcome: untested
        notes: No proximity sensor was reported.
      - behavior: leds
        outcome: untested
        notes: No LEDs were reported.
      - behavior: relays
        outcome: untested
        notes: No relays were reported.
    limitations:
      - The owner's July 12 diagnostic showed that the preliminary profile matched while it was bundled. Since v0.9.5 the draft has been available for manual import. This report predates that draft.
      - Both reports came from the same owner, 2021 second-generation unit and LineageOS image.
---

One owner reported running ha-paneld on an Echo Show 5 (2nd generation, 2021, `cronos`) with LineageOS 18.1. The project has yet to confirm this on a device. Stock Fire OS is unsupported, and the report establishes no coverage for the Kids edition or any other Echo Show model.

We recommend choosing a different panel for a Home Assistant dashboard. If you already own this Echo, see the [community profile and buying guide](/reference/profiles/community/echo-show-5-gen2/) for what the owner reported, the limits of the draft profile and better-supported options.
