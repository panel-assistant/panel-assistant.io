---
spec: 9e588f29fd59
related:
  - /home-assistant/move-from-mqtt/
---

The user name the panel gives the broker, together with [Password](#mqtt_password). With the Mosquitto add-on this is usually a Home Assistant user you created for the panel.

- Clearing the user name also clears the stored password, so the panel connects without credentials.
- If the broker rejects the pair, the panel status shows that authentication was rejected.

The value is treated as specific to this panel and is not copied to other panels by default.
