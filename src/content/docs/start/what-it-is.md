---
title: What Panel Assistant is
description: How Panel Assistant, ha-paneld and Home Assistant fit together.
---

Panel Assistant is the project around **ha-paneld**, an Android application that turns a wall panel into a Home Assistant control surface. ha-paneld is the runtime component: it is the thing that actually runs on the panel.

## The problem it addresses

Android wall panels are cheap because they are slow. A Home Assistant dashboard is a full web application, and a browser on a panel with a weak processor and an old WebView tends to make a poor job of it. Loading every entity state on a device that only shows a dozen of them is a large part of that cost.

ha-paneld renders the dashboard on the panel and can learn which entities the dashboard uses, then ask Home Assistant to send only those states.

## The hardware side

Wall panels vary a lot. They have different screens, LEDs, capacitive buttons, proximity and light sensors, relays and audio hardware, and each vendor exposes them differently. ha-paneld describes each model with a YAML profile and publishes the resulting controls to Home Assistant over MQTT discovery, so a panel arrives as a device with entities rather than as a set of per-device YAML you write yourself. Adding a new model is a profile, not a new build of the app.

## The pieces

| Piece              | What it is                                                                                            | Where it lives                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| ha-paneld          | The Android app on the panel. Renders the dashboard, exposes panel hardware, serves a local HTTP API. | [maxlyth/ha-paneld](https://github.com/maxlyth/ha-paneld)                            |
| MQTT discovery     | How the panel's hardware reaches Home Assistant today.                                                | [API and MQTT reference](https://github.com/maxlyth/ha-paneld/blob/main/docs/api.md) |
| Custom integration | A newer, separate piece that installs and adopts panels from inside Home Assistant. Not released.     | [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration)  |

## What it is not

ha-paneld is for dedicated wall panels, not for phones or personal tablets. It is not distributed through Google Play, and it is pre-1.0, so behaviour and configuration can still change between releases.

:::note
The [roadmap](https://github.com/maxlyth/ha-paneld/blob/main/docs/roadmap.md) records the direction of the project. Nothing on it is a dated commitment during the 0.x line.
:::
