---
spec: ['9ebce0d42320', '55345c0f8928', 'c85551df0e3a']
help: 'Blank auto-discovers HA over mDNS.'
related:
  - /home-assistant/move-from-mqtt/
---

:::note
MQTT is the older way a panel's screen, buttons and sensors reach Home Assistant. Panels can now move those entities to Panel Assistant, which needs no broker, and MQTT support is due to be removed before version 1.0.
:::

Left blank, the panel looks for Home Assistant on the local network over mDNS and connects to `tcp://<address>:1883` on the Home Assistant instance that has that port open, which suits the Mosquitto add-on. Enter a URL when your broker runs elsewhere or on another port.

| Scheme                            | Connection  | Port when none is given |
| --------------------------------- | ----------- | ----------------------- |
| `tcp://`, `mqtt://`, or no scheme | unencrypted | `1883`                  |
| `ssl://`, `mqtts://`, `tls://`    | TLS         | `8883`                  |

Examples: `homeassistant.local`, `mqtts://192.168.x.x`, `tcp://[fd00::10]:1883` (IPv6 addresses go in square brackets).

WebSocket brokers, paths and user names inside the URL are not accepted; put credentials in [Username](#mqtt_user) and [Password](#mqtt_password). How the host name is resolved is set by [address family](#mqtt_address_family).
