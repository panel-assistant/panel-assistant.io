---
spec: e8e5ef800dd3
---

The warning is a small card in a corner of the dashboard that appears only while the panel is connected to Home Assistant and judges the network path to it degraded. It is amber for a warning and red when the problem is severe. The dashboard keeps running underneath, and only the card's close button takes a touch; taps elsewhere pass through to the dashboard.

Closing the card hides it until the path recovers, and it can return if the path degrades again later. Turning this setting off stops the card appearing at all, and the change applies to the dashboard straight away. Turn it off on a panel where you already know the network is slow and the card is only in the way. The panel keeps measuring the connection either way, so the status stays available elsewhere. This is separate from the notice the panel shows when Home Assistant cannot be reached at all.
