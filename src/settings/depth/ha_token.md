---
spec: 73b967b08b88
related:
  - /home-assistant/connect-a-panel/
  - /manage/security-mode/
---

There are two ways to give the panel a Home Assistant credential:

| Method                                   | What the panel stores                                   | When to use it                                                                             |
| ---------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Browser sign-in** (preferred)          | A short-lived access token that the panel renews itself | Whenever you can sign in through the browser. No long-lived credential stays on the panel. |
| **Long-lived access token** (this field) | The token you paste                                     | Setups where signing in through the browser is not practical.                              |

Create a long-lived access token in your Home Assistant user profile and paste it here; use an account that can see the dashboard the panel should show.

- Saving a token here replaces any Browser sign-in the panel held.
- Clearing [Home Assistant URL](#ha_url) clears this token too.
- The Configure page never shows the stored token, and leaving the field empty when you save keeps the current one.
