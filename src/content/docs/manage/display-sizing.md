---
title: Display sizing
description: Matching the size of a Home Assistant dashboard on a panel to how it looks in a desktop browser, with density and text size.
---

A Home Assistant dashboard designed in a desktop browser often renders at the wrong size on an Android wall panel: cards too large with clipped edges, or too small. A phone usually stays broadly in step with the desktop, but panels frequently do not, because their makers ship a system density and font scale that are poorly matched to the physical display. The panel app gives you two controls, **density (DPI)** and **text size (font scale)**, in **Install**, then **Display sizing**, to bring the layout and the text back in line. You usually need both.

:::caution[Experimental]
The controls work, but the right values for each panel are not settled. Treat density and text size as something to experiment with rather than a finished feature. Feedback on values that work well for a given panel is welcome.
:::

## Using it

The **Display sizing** card on the panel's **Install** tab sets a custom logical density and text size, applies them live, or resets to Android's factory base density. Both survive a reboot, because they are Android system settings.

:::note
This needs an approved privileged route: normally the vendor's `su` or the [root helper](https://github.com/panel-assistant/android/blob/main/helper/README.md). A compatible unrooted panel whose optional enhanced access has already been approved on the panel can also make these exact display changes. Where no supported route is ready, the card stays visible but locked.
:::

To tune it, open the same dashboard in a desktop browser for reference. Lower the density until the layout matches (more cards fit), then nudge the text size until the text matches. Good values depend on the installation (the panel's resolution, how far away people stand, how the dashboard is designed) rather than on the model, which is why no standard values ship.

## The two controls

| Control                    | What it changes                                                                                                                                                             | Mechanism                            |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Density (DPI)**          | The whole layout. The effective viewport in dp is `physical px ÷ (density / 160)`. A lower density fits more, closer to a desktop's wider viewport; a higher one is larger. | `wm density <n>`                     |
| **Text size (font scale)** | Text in the dashboard. Android's system font scale becomes the WebView's `textZoom` (`textZoom = scale × 100`).                                                             | `settings put system font_scale <f>` |

Android's `wm density` output calls the factory base value `Physical density`. That label is misleading: it is the density Android uses for layout once an override is reset, not a measurement of the display's pixels per inch. The panel app reports it as the **factory base**, and shows a physical PPI only for hardware profiles whose screen dimensions have been checked independently.

Changing density alone scales the layout but can leave text the wrong size compared with the desktop; the font scale corrects the text. Tuning the two together is what brings a panel in line with the browser the dashboard was designed in.
