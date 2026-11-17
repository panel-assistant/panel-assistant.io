---
title: Sonoff NSPanel Pro Gen2 86
description: Hardware facts for the Sonoff NSPanel Pro Gen2 86, the dual-relay NSPanel Pro on the same Rockchip platform and firmware line as the 86P.
vendor: Sonoff
model: NSPanel Pro Gen2 86
soc: Rockchip RK3326-S
android: 'Not established'
screen: 3.95 in, 480 × 480
support: Untested
root: Not established on this model
webview_ships_with: 'Not established for this model'
webview_can_reach: 'Not established for this model'
evidence: [firmware, documented, platform]
sidebar:
  label: NSPanel Pro Gen2 86
  order: 3
---

:::note
**Sold as a new product, built on the same platform.** The Gen2 86 is the dual-relay member of the [NSPanel Pro line](/hardware/panels/sonoff/). It runs the same firmware line as the [86P](/hardware/panels/sonoff/nspanel-pro-86p/), and Panel Assistant's existing NSPanel Pro profile recognises its Rockchip RK3326 board, so it is set up like an 86P. Its two relays are **not yet available** in Home Assistant: that profile does not describe them yet. No owner has reported running Panel Assistant on a Gen2 yet; if you have one, a [bug report or support report](https://github.com/panel-assistant/android/issues/new/choose) helps.
:::

Sonoff markets the NSPanel Pro Gen2 86 as a new panel for the EU 86 mm wall box, in black (NSPanel86PB-Relay) and white (NSPanel86PW-Relay). What changes from the 86P is the hardware around the same platform: two relays, a newer Zigbee radio and the RK3326-S variant of the Rockchip chip. Everything documented once on the [family page](/hardware/panels/sonoff/), from root and WebView updates to the Zigbee gateway, is where to start; treat any difference you find on a Gen2 as worth reporting.

## Also sold as

NSPanel Pro Gen2, NSPanel86PB-Relay, NSPanel86PW-Relay, NSPanel Pro Gen2 dual-channel relay smart home control panel, 86 type.

|         |                                                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | Rockchip **RK3326-S**: 4× Cortex-A35 at up to 1.5 GHz, Mali-G31 (advertised)                                                    |
| Display | **480×480 square**, 3.95 in (advertised)                                                                                        |
| RAM     | 2 GB (advertised)                                                                                                               |
| Storage | 32 GB eMMC (advertised)                                                                                                         |
| Android | Not established on a unit                                                                                                       |
| Relays  | **Two**, 5 A per gang, 10 A total resistive load (advertised); not yet exposed by Panel Assistant                               |
| Radios  | **Zigbee 3.0** (Silicon Labs EFR32**MG24**, where the 86P has an MG21), dual-band Wi-Fi, Bluetooth LE                           |
| Sensors | Light and proximity, speaker and microphone (advertised)                                                                        |
| Source  | [Sonoff product page](https://sonoff.tech/products/sonoff-nspanel-pro-gen2-dual-channel-relay-smart-home-control-panel-86-type) |

## What carries over from the 86P

Sonoff ships the Gen2 and the original panels on one firmware version line: release 4.7.0 covers both. The panel app's NSPanel Pro profile matches on the RK3326 board name, so installation, the dashboard, screen control and the shared NSPanel Pro behaviour are expected to work as on the 86P. What has not been seen on a Gen2 yet is listed in the specification table above; the relays are the one feature known to need more work.
