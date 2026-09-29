---
spec: 9ebce0d42320
related:
  - /home-assistant/move-from-mqtt/
---

MQTT is the older way a panel's screen, buttons and sensors reach Home Assistant. Panels can now move those entities to Panel Assistant, which needs no broker, and MQTT support is due to be removed before version 1.0.

Left blank, the panel looks for Home Assistant on the local network over mDNS and connects to `tcp://<address>:1883` on the Home Assistant instance that has that port open, which suits the Mosquitto add-on. Enter a URL when your broker runs elsewhere or on another port. `tcp://` and `mqtt://` connect without encryption, on port 1883 unless you give one; `ssl://`, `mqtts://` and `tls://` connect over TLS, on port 8883 unless you give one. A bare host name or address is treated as `tcp://`, and IPv6 addresses go in square brackets, for example `tcp://[fd00::10]:1883`. WebSocket brokers, paths and user names inside the URL are not accepted; put credentials in [Username](#mqtt_user) and [Password](#mqtt_password). How the host name is resolved is set by [address family](#mqtt_address_family).
