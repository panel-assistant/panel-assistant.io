---
title: Connect a panel
description: Pointing ha-paneld at a dashboard and bringing the panel's hardware into Home Assistant.
---

A panel running ha-paneld connects to Home Assistant in two independent ways. One puts a dashboard on the screen. The other brings the panel's own hardware in as entities. You can have either without the other.

## The dashboard on the screen

ha-paneld has a built-in renderer that loads a Home Assistant dashboard and can learn which entities that dashboard uses, so it subscribes to those rather than to everything. You configure the dashboard address through the panel's own interface on port 8888.

The renderer is documented in [built-in renderer](https://github.com/maxlyth/ha-paneld/blob/main/docs/built-in-renderer.md), including its startup and recovery behaviour.

## The panel's hardware as entities

The screen, LEDs, buttons, sensors, relays and audio hardware reach Home Assistant over MQTT discovery. Give the panel your broker details, either at install time with `--mqtt` or afterwards through its interface, and the entities appear against a device for that panel without any YAML on the Home Assistant side.

Which entities you get depends on the hardware profile for that model. The entity contracts are documented in the [API reference](https://github.com/maxlyth/ha-paneld/blob/main/docs/api.md).

:::note
This is the path that works today. The [custom integration](/home-assistant/custom-integration/) is a separate and newer piece of work, and it is not a replacement for MQTT discovery.
:::

## The panel's local API

Each panel serves an HTTP API on port 8888 on your local network, with an OpenAPI description at `/api/v1/openapi.json` and a diagnostic report at `/diag`. It is designed for a trusted local network, so treat access to it the same way you treat access to the panel itself. The endpoints and the trust model are covered in the [API reference](https://github.com/maxlyth/ha-paneld/blob/main/docs/api.md) and in [security mode](https://github.com/maxlyth/ha-paneld/blob/main/docs/security-mode.md).

## Requirements

Home Assistant 2026.4.2 or newer, and an MQTT broker that Home Assistant already uses if you want the hardware entities.
