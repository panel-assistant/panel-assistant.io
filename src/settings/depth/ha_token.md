---
spec: 73b967b08b88
related:
  - /home-assistant/connect-a-panel/
  - /manage/security-mode/
---

Browser sign-in, the preferred route, stores a short-lived access token that the panel renews itself, so no long-lived credential stays on the panel. A long-lived access token is the alternative for setups where signing in through the browser is not practical. Create it in your Home Assistant user profile and paste it here; use an account that can see the dashboard the panel should show.

Saving a token here replaces any Browser sign-in the panel held. Clearing [Home Assistant URL](#ha_url) clears this token too. The Configure page never shows the stored token, and leaving the field empty when you save keeps the current one.
