---
title: Reference
description: Technical reference for the panel app, covering its API, device profiles, security posture and how to build it.
sidebar:
  label: Overview
  order: 0
---

These pages document how the panel app works underneath: the interfaces it exposes, the profile format that describes each model of panel, and the security decisions behind both. You do not need any of them to install or use Panel Assistant.

## Interfaces

- [Control API and Home Assistant reference](/reference/api/): the entities, browser pages and HTTP API on port 8888.
- [Security posture](/reference/security/): the trust model, attack surface and the decisions taken.

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
