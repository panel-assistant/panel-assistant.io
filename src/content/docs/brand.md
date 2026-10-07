---
title: Brand assets
description: The Panel Assistant wordmark and icon, served at stable paths in every usual format and size, with the rule for setting them together.
---

The Panel Assistant wordmark and icon are served from `https://panel-assistant.io/brand/` as a fixed set of files at predictable paths, so that any service, page or app can use them without drawing its own. The app and the Home Assistant integration copy their own icons and wordmarks from this set.

![The Panel Assistant wordmark on a white surface](/brand/wordmark-on-light-96.jpg)

![The Panel Assistant wordmark on a dark surface](/brand/wordmark-on-dark-96.jpg)

## Files

Every file is `/brand/` followed by one of these names. `N` is one of 16, 24, 32, 48, 64, 96, 128, 180, 192, 256, 384, 512 and 1024: the width of an icon, or the height of the mark in a wordmark. PNG and WEBP files are transparent; a JPEG cannot be, so it is drawn on white or on dark (`#0F1113`).

| Asset                                                                                      | Transparent                                                                    | On a surface                                              |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Icon, tight: the device frame, 4:3                                                         | `icon-tight.svg`, `icon-tight-N.png`, `icon-tight-N.webp`                      | `icon-tight-N-on-white.jpg`, `icon-tight-N-on-dark.jpg`   |
| Icon, square: the frame in a square with a small margin                                    | `icon-square.svg`, `icon-square-N.png`, `icon-square-N.webp`                   | `icon-square-N-on-white.jpg`, `icon-square-N-on-dark.jpg` |
| Icon, avatar: the frame inside the inscribed circle with a clear ring, for a circular crop | `icon-avatar.svg`, `icon-avatar-N.png`, `icon-avatar-N.webp`                   | `icon-avatar-N-on-white.jpg`, `icon-avatar-N-on-dark.jpg` |
| Wordmark for a dark surface: light name                                                    | `wordmark-on-dark.svg`, `wordmark-on-dark-N.png`, `wordmark-on-dark-N.webp`    | `wordmark-on-dark-N.jpg` (on dark)                        |
| Wordmark for a light surface: dark name                                                    | `wordmark-on-light.svg`, `wordmark-on-light-N.png`, `wordmark-on-light-N.webp` | `wordmark-on-light-N.jpg` (on white)                      |

The tight icon at width `N` is `N` by `0.75 N`. The wordmark at mark height `N` is about `6.67 N` wide.

## The lock-up

The name is set in [Sora](https://fonts.google.com/specimen/Sora) at weight 500 with tight tracking (-1.5 px at 40 px), and sits to the right of the mark with its baseline on the bottom edge of the house. Beside a mark `H` high:

- the name is `0.71 H` high (40 beside 56);
- the gap between the mark and the name is `0.18 H` (10 at 56);
- the mark hangs `0.233 H` below the baseline, which is the part of the frame under the house, so in CSS the mark takes `vertical-align: -0.233 × H` beside the name.

The wordmark files already have the name set this way. To set the name yourself, keep these ratios and the typeface; do not rebalance the two by eye.

## The icon

The mark is a device frame in `#607D8B` with a `#CFD8DC` hairline round a `#10284A` screen, and the house on it. Use it as it is: do not recolour it, outline it, or put it on a filled shape of its own. For a circular avatar use the avatar files, which leave room for the crop.

## Taking a copy

Every file is built from the masters in the website repository, `src/brand/icon.svg` and `src/brand/name.svg`, at every build of the site. To pin a copy, record the site build that served it: [/build.json](https://panel-assistant.io/build.json) names the commit, and the same files can be built from that commit of [the repository](https://github.com/panel-assistant/panel-assistant.io).

The icon includes the Home Assistant mark, which remains the property of the Home Assistant project and is not covered by this project's licence. Sora is published under the SIL Open Font Licence 1.1; the name is served as outlines, so nothing here redistributes the font.
