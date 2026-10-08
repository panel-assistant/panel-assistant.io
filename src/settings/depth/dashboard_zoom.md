---
spec: 82b62d85f66d
related:
  - /manage/display-sizing/
---

Zoom scales the whole dashboard page the built-in renderer draws, in steps of 10%. A change reloads the dashboard, since a fresh load is where the new scale reliably applies.

| Value           | Effect                                     |
| --------------- | ------------------------------------------ |
| `50` to `90`    | Smaller; more cards fit on the screen.     |
| `100` (default) | The page uses the default dashboard scale. |
| `110` to `300`  | Larger; everything is enlarged.            |

:::tip
Where the panel can change Android's display density and text size, the [Display sizing](/manage/display-sizing/) controls are the better tool, because they fix the whole system rather than one page. On a panel without that access, zoom is the only way to size the dashboard, and the Configure page says so in its help.
:::

Zoom applies only to the built-in renderer.
