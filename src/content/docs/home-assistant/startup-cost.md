---
title: Startup cost
description: How much time Panel Assistant adds to a Home Assistant start, how it is kept down, and how it was measured.
---

Home Assistant waits for every integration to finish setting up before it reports that it has started. This page says how much of that wait is Panel Assistant's, measured for Panel Assistant 1.1 (in development), and what keeps it small.

## What it costs

| Panels | Every panel answers | Panels switched off | Panels that accept a connection and never answer |
| ------ | ------------------- | ------------------- | ------------------------------------------------ |
| 1      | 0.3 s               | 0.1 s               | 2.6 s (11.7 s in 1.0)                            |
| 10     | 0.3 s               | 0.1 s               | 2.6 s (11.7 s in 1.0)                            |
| 30     | 0.4 s               | 0.2 s               | 2.6 s (11.7 s in 1.0)                            |

Each figure is Panel Assistant's total setup time as Home Assistant reports it, the median of three starts of a new installation. About 0.14 s of it is shared work done once, whatever the number of panels; the rest is the slowest panel, because panels are set up side by side rather than one after another. With panels that answer, almost all of that is the panel's own reply time, so adding panels adds almost nothing: 30 panels took 0.06 s longer than one.

In the same measurements, none of Panel Assistant's own work held Home Assistant's event loop for more than 0.03 s at a time during setup, so other integrations starting at the same moment are not made to wait.

On a large production Home Assistant, with about 200 integrations and ten panels, Home Assistant reported 8.3 s for a development build of Panel Assistant 1.1 from before this work, at a start when one of the panels was itself restarting. Over 29 restarts in a week, Panel Assistant passed Home Assistant's 10 second warning once.

## How it is kept down

- **Panels are read side by side.** Each panel's first read of its health and its update state happens at the same time as every other panel's, and the two reads of one panel run together.
- **A panel that does not answer cannot hold the start.** Setup waits at most 2.5 s for a panel's first answer, about twice the slowest first answer measured from a Home Assistant host to a real panel. In 1.0, a panel that accepted the connection and never answered held Home Assistant's start for 11.7 s. The read carries on in the background, and the panel's entities update the moment it answers.
- **A connected panel is never shown as unavailable.** A panel that opens its connection to Home Assistant while its first read is still waiting shows as connected straight away.
- **Release checks wait for nobody.** Looking up new releases runs in the background, not during setup.
- **A test keeps it that way.** Panel Assistant's test suite sets up 30 panels and fails if setup takes more than 2.5 s with panels that answer, or more than the bounded wait plus that budget with panels that never answer.

Each time Home Assistant starts, Panel Assistant writes one line to the log at the info level with its own setup time, the number of panels, the slowest panel and how many had not answered within the wait. Home Assistant hides info lines by default; to see it, add this to `configuration.yaml`:

```yaml
logger:
  logs:
    custom_components.panel_assistant: info
```

## How it was measured

- **Production, read only.** Home Assistant's own setup timings, read over its WebSocket API (`integration/setup_info`), the core log of 29 restarts over a week, and the reply time of each panel's local API, read three times from the Home Assistant host.
- **Development.** A fresh Home Assistant, with the same Home Assistant release as the test suite, started with 1, 10 and 30 Panel Assistant entries, three times each, against stand-in panels on the same machine. Stand-ins either answered after the reply time measured from the production host, refused the connection (a panel switched off), or accepted it and never answered (a panel that has hung). A small companion integration recorded Panel Assistant's setup phases, the event loop's delays and every request the stand-ins received, and a debug run reported every event-loop callback that took longer than 0.02 s.
- **Imports.** Loading Panel Assistant's code takes about 0.45 s, most of it the audio streaming library its voice features use. Home Assistant loads it on a worker thread, not on the event loop. It is still loaded at setup: Home Assistant accepts panel connections before it has finished starting, and a panel that connects before the voice server exists gets no voice streaming for that connection.
