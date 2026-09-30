---
spec: ['d7df8cc804fa', '6beaf5759391', 'f1a2064b2f2b']
help: 'Self-heal the dashboard app: relaunch if it dies, return if backgrounded too long.'
---

When the watchdog is on, Panel Assistant checks the dashboard app every 30 seconds and acts on two situations. It never acts while the dashboard is in front.

| Situation                                                                                                                  | What the watchdog does                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| The app's process is dead on two checks in a row                                                                           | Starts the app again                                                                                                               |
| The app is running but has not been in front for five minutes, for example because someone opened Settings and walked away | Brings the dashboard back to the front                                                                                             |
| The app keeps crashing as soon as it starts                                                                                | Backs off instead of relaunching over and over, and shows a health warning; this clears when the dashboard comes back to the front |

<figure class="setting-figure">
<svg viewBox="0 0 480 180" role="img" aria-labelledby="fig-watchdog_enabled">
<title id="fig-watchdog_enabled">Timeline of watchdog checks every 30 seconds, with the dashboard returned after five minutes in the background</title>
<line class="faint" x1="30" y1="110" x2="450" y2="110"/>
<rect class="soft" x="30" y="70" width="300" height="40"/>
<text x="180" y="94" text-anchor="middle" class="small">another app in front</text>
<circle class="accent-fill" cx="60" cy="110" r="3"/>
<circle class="accent-fill" cx="90" cy="110" r="3"/>
<circle class="accent-fill" cx="120" cy="110" r="3"/>
<circle class="accent-fill" cx="150" cy="110" r="3"/>
<circle class="accent-fill" cx="180" cy="110" r="3"/>
<circle class="accent-fill" cx="210" cy="110" r="3"/>
<circle class="accent-fill" cx="240" cy="110" r="3"/>
<circle class="accent-fill" cx="270" cy="110" r="3"/>
<circle class="accent-fill" cx="300" cy="110" r="3"/>
<circle class="accent-fill" cx="330" cy="110" r="3"/>
<line class="accent" x1="330" y1="50" x2="330" y2="120"/>
<text x="330" y="42" text-anchor="middle" class="strong">dashboard brought back</text>
<text x="30" y="136" text-anchor="middle" class="small">0</text>
<text x="180" y="136" text-anchor="middle" class="small">2.5 min</text>
<text x="330" y="136" text-anchor="middle" class="small">5 min</text>
<text x="240" y="164" text-anchor="middle" class="small">dots: checks every 30 s</text>
</svg>
<figcaption>Someone leaves the dashboard at 0. The watchdog leaves them alone until the app has been in the background for five minutes.</figcaption>
</figure>

The watchdog needs root or the Panel Assistant helper to see the dashboard's state, and does nothing on panels with neither.

:::tip
Leave it off if you often use other apps on the panel for longer than five minutes. For a faster return that also hides the Android bars, use [Lock Android to dashboard](#kiosk_lock) instead.
:::
