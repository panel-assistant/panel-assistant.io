---
spec: 82b62d85f66d
related:
  - /manage/display-sizing/
---

Zoom scales the whole dashboard page the built-in renderer draws, in steps of 10%. At 100% the page is sized the same way the Home Assistant Companion app sizes it, so a panel moved from the Companion app to the built-in renderer keeps its layout. Below 100% more cards fit on the screen; above it everything becomes larger. A change reloads the dashboard, since a fresh load is where the new scale reliably applies.

Where the panel can change Android's display density and text size, the **Display sizing** controls are the better tool, because they fix the whole system rather than one page. On a panel without that access, zoom is the only way to size the dashboard, and the Configure page says so in its help. Zoom has no effect on a separate dashboard app.
