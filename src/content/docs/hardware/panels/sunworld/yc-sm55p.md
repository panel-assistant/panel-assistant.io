---
title: Sunworld YC-SM55P
description: Owner-reported dashboard compatibility and scoped test evidence for the Sunworld YC-SM55P.
vendor: Sunworld
model: YC-SM55P
android: '14'
screen: 5.5 in, 1280 × 720
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

## Published specifications

An AliExpress listing with the brand given as Sunworld describes a 5.5 inch IPS screen at 1280 × 720, two microphones, a 1 W speaker and no camera, with RJ45, powered from 12 V DC or over Ethernet; its title also names RS485. Sellers list the panel with Android 11 or 13; the owner report above is from a unit on Android 14. These are a seller's statements read in November 2026, not measurements: [listing](https://www.aliexpress.com/item/1005012430488902.html).
