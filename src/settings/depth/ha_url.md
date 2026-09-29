---
spec: 91035fb69e1b
related:
  - /home-assistant/connect-a-panel/
  - /manage/built-in-renderer/
---

This is the address the panel uses to reach Home Assistant for the built-in renderer, the same address you would type into a browser on the same network, such as `http://homeassistant.local:8123` or `https://192.168.x.x:8123`. Only the scheme, host and port matter: it must start with `http://` or `https://`, cannot contain a user name or password, and a trailing slash is removed. HTTPS with a private certificate authority works once that authority is installed on the panel.

Clearing the address switches the built-in renderer off and also removes the stored Home Assistant sign-in and [Long-lived access token](#ha_token). Other dashboard apps are unaffected. With security mode on, pointing the panel at a different Home Assistant also discards the old sign-in unless you supply new credentials in the same change, so the panel never sends one server's credentials to another.
