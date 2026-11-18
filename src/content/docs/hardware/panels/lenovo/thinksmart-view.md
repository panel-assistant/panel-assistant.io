---
title: Lenovo ThinkSmart View
description: Owner-reported dashboard compatibility and scoped test evidence for the Lenovo ThinkSmart View running LineageOS 8.1.
vendor: Lenovo
model: ThinkSmart View
android: '8.1'
support: Community-tested
sold_as:
  - brand: Lenovo
    name: 'ThinkSmart View for Zoom'
  - brand: Lenovo
    name: 'ThinkSmart View for Microsoft Teams'
evidence: []
ownerReports:
  - schemaVersion: 1
    id: android-130-generic
    source: https://github.com/panel-assistant/android/issues/130
    observed: '2026-08-29'
    model:
      manufacturer: Lenovo
      name: ThinkSmart View (starfire)
    firmware:
      build: lineage_starfire-userdebug 8.1.0 OPM7.181205.001 d41d2fdda0 test-keys
      android: '8.1'
    software:
      appVersion: 0.9.7-rc2
      appBuild: '613'
      integrationVersion: unknown
      integrationBuild: unknown
    profile:
      level: generic
      id: unknown
      revision: unknown
    results:
      - behavior: dashboard
        outcome: works
        notes: The owner reported everything working apart from turning the screen off. Touch interaction was not separately established.
      - behavior: brightness
        outcome: works
        notes: Dimming worked after granting Modify system settings.
      - behavior: sleep-wake
        outcome: fails
        notes: On Generic, brightness zero left the dashboard visibly lit; this firmware has no backlight control to switch the display off.
    limitations:
      - Runs a community LineageOS 8.1 image with root, not Lenovo's own firmware. Unlocking and reflashing are not covered by Panel Assistant.
  - schemaVersion: 1
    id: android-130-community-profile
    source: https://github.com/panel-assistant/android/issues/130#issuecomment-5606586655
    observed: '2026-09-09'
    model:
      manufacturer: Lenovo
      name: ThinkSmart View (starfire)
    firmware:
      build: lineage_starfire-userdebug 8.1.0 OPM7.181205.001 d41d2fdda0 test-keys
      android: '8.1'
    software:
      appVersion: unknown
      appBuild: unknown
      integrationVersion: unknown
      integrationBuild: unknown
    profile:
      level: community
      id: community.lenovo-thinksmart-view-lineageos
      revision: unknown
    results:
      - behavior: sleep-wake
        outcome: works
        notes: With the community profile, Home Assistant could dim the panel, turn the screen fully off and wake it again. Touch does not wake it; either volume button does.
      - behavior: light
        outcome: untested
        notes: Android reports an ambient-light sensor; a response to real light changes was not reported.
      - behavior: proximity
        outcome: untested
        notes: Android reports a proximity sensor; a response was not reported.
      - behavior: microphone
        outcome: untested
        notes: Not proved on this firmware; the profile leaves it disabled.
    limitations:
      - One owner's panel and firmware build. The profile is import-only and is not selected automatically.
      - Do not set a PIN, pattern or password on the panel; the screen-off route dims a secured panel instead of sleeping it.
---

The ThinkSmart View was sold in Microsoft Teams and Zoom editions; they are the same hardware with different meeting software, so this page covers both. Basic dashboard compatibility is reported by one owner on a ThinkSmart View reflashed with LineageOS 8.1. Screen off and wake need the import-only [community profile](/reference/profiles/community/lenovo-thinksmart-view/); its page has the activation steps and the full evidence. Individual controls and sensors have separate results in the owner reports; this is not a bench inspection or a claim about Lenovo's own firmware.
