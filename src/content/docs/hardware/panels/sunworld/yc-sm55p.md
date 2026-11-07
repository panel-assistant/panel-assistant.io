---
title: Sunworld YC-SM55P
description: Owner-reported dashboard compatibility and scoped test evidence for the Sunworld YC-SM55P.
vendor: Sunworld
model: YC-SM55P
android: '14'
support: Community-tested
evidence: []
ownerReports:
  - schemaVersion: 1
    id: android-129-generic
    source: https://github.com/panel-assistant/android/issues/129
    observed: '2026-08-28'
    model:
      manufacturer: Sunworld
      name: YC-SM55P
    firmware:
      build: P76S01-A14-SM55P-JD9365-720x1280-20260612-V0.01
      android: '14'
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
        notes: The owner reported it working as a Generic device; the built-in renderer reported rendered. Touch interaction was not separately established.
      - behavior: proximity
        outcome: not-fitted
        notes: The owner confirmed proximity hardware was absent.
      - behavior: leds
        outcome: not-fitted
        notes: The owner reported no colored LEDs.
    limitations:
      - Reported on Generic. A later published community profile does not establish activation or hardware support.
      - Sold as Sunworld YC-SM55P on a Portworld P76S01 board; the raw Android model is rk3576s_u.
      - The owner confirmed no camera was fitted. Firmware declarations alone do not establish physical hardware.
---

Basic dashboard compatibility is reported by an owner on Generic. Individual controls and sensors have separate results below; this is not a bench inspection or a claim about every firmware version.
