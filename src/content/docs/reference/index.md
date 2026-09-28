---
title: Reference
description: The panel app's API and device profiles, plus account and network security guidance.
sidebar:
  label: Overview
  order: 0
---

These pages document how the panel app works underneath: the interfaces it exposes and the profile format that describes each model of panel. The security guide explains the account and network access your panel uses.

## Interfaces

- [Control API and Home Assistant reference](/reference/api/): the entities, browser pages and HTTP API on port 8888.
- [Panel security](/reference/security/): the panel's Home Assistant account, changing its sign-in and network separation.

## Device profiles

- [Runtime panel profiles](/reference/profiles/): what a profile is and how to write, test and activate one.
- [Profile format and compatibility](/reference/profiles/format/): the complete schema-2 field reference.
- [Testing and troubleshooting profiles](/reference/profiles/testing/): a staged hardware test sequence and recovery steps.
- [Sharing and contributing profiles](/reference/profiles/sharing/): provenance, safe exchange and bundling requirements.
- [Device-profile architecture](/reference/profiles/architecture/): how the app resolves, matches and activates profiles.
- [Community panel profiles](/reference/profiles/community/): profiles for panels the app does not bundle.
  - [Echo Show 5 Gen 2 (LineageOS)](/reference/profiles/community/echo-show-5-gen2/)
  - [Lenovo ThinkSmart View (LineageOS)](/reference/profiles/community/lenovo-thinksmart-view/)
  - [Sunworld YC-SM55P](/reference/profiles/community/sunworld-yc-sm55p/)

## The code

- [Development environment](/reference/development-environment/): the toolchain, the build scripts and what a fork needs to know about signing.
- [Code tour on DeepWiki](https://deepwiki.com/panel-assistant/android): a guided walk through the ha-paneld source.
