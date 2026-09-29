---
spec: 13c0190819cb
related:
  - /manage/built-in-renderer/#theming
  - /manage/adaptive-brightness/
---

Home Assistant decides light or dark per device, from a stored choice on that device or, when the user's theme is Auto, from the system's colour scheme. Dark and Light take over that decision on the panel alone: they change only the light or dark part, keep any named theme and its colours, and never touch the theme stored against your Home Assistant account, so another device signed in as the same user is unaffected. Switching back to Follow Home Assistant restores the light or dark value exactly as it was before, or leaves it on Auto if nothing was set.

Ambient uses the room brightness that auto-brightness already tracks. It switches to dark when the room sits near the dark end of the range the panel has learned for that room, and to light when it sits well towards the bright end, with a gap between the two so a room hovering near one threshold does not flicker. A change needs a minute without interruption, so turning a light on briefly changes nothing. If [auto-brightness](/manage/adaptive-brightness/) is off, or the panel has no light source, Ambient behaves as Follow Home Assistant.

If the Home Assistant user has explicitly chosen Light or Dark, that still wins. The panel reports this on the **Runtime diagnostics** card and as `theme_overridden` in `GET /api/v1/status`. Set that user's theme to Auto, or give the panel its own Home Assistant user. The panel's own web interface on port 8888 always follows the browser viewing it.
