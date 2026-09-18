---
title: Performance
description: Why a wall panel can feel slow with a dashboard that is fine on a phone, how to measure it, and the fixes in order of impact.
---

An inexpensive Android wall panel can feel sluggish, stutter while scrolling, go blank or stop updating even though the same dashboard works well on a phone or a desktop. Start with the work Home Assistant sends to the panel, then measure what is left of the dashboard and hardware limits, before assuming the panel has to be replaced.

:::tip
A common cause is the number of Home Assistant entity states and updates reaching the dashboard. A large installation can make a low-powered panel process thousands of entities it never displays. With the [built-in renderer](/manage/built-in-renderer/), the first fix to try is entity filtering.
:::

## Measure before changing anything

Open the panel's web interface at `http://<panel-ip>:8888/`, or use the **Visit** link on the panel's device page in Home Assistant. Record the same dashboard view for a similar period before and after each change, so the comparison means something.

- **Dashboard responsiveness**: real interaction latency, the slowest interaction broken down into input, handler and presentation time, main-thread blocking, time to interactive, and unexpected renderer reloads.
- **Home Assistant state stream**: state updates per second, the uncompressed JSON payload rate, the initial hydration size, the time until the main thread yields, and the three entities contributing most over the last hour, ranked by both update rate and payload volume.
- **Performance** and **Top processes**: CPU, GPU, RAM, clock speed, temperature and the busiest processes.
- **Camera stream**, only on a panel whose profile declares a camera: the subscribers holding the session open, the encoder in use, the requested frame rate beside the delivered one, and the delivered bitrate beside the encoder's cap. A rate well below the one requested is reported as such, with no cause attached: capture pacing in a dim room, the encode path and contention for the video hardware are all candidates, and the card does not guess between them. The request is never quietly reduced; when the session cannot give a stream the rate it asked for, the card shows the request beside the rate the encoder was given. The capture rate is set by whoever opens the camera, so a stream that joins a session opened by a snapshot is encoded at the configured default. The card deliberately quotes no CPU figure, because a hardware encode runs in the codec hardware and the compositor as well as in the app, and no single process is the camera's cost. Read the panel's whole load from Performance and Top processes.
- **Entities page**: what the built-in renderer is currently subscribed to, what automatic learning found, and which dashboard rules still need a decision.
- **Diagnostics report** (`/diag`): a report to copy into a bug report when the cause is still unclear.

The built-in renderer collects these browser measurements directly and needs neither root nor WebView debugging. With a separate dashboard app, the panel app can show renderer CPU and Android rendering figures when root or the helper is available, but it cannot measure that app's real interaction latency.

The state-event main-thread figure starts when a relevant Home Assistant message is dispatched and ends when the browser yields after all its handlers and microtasks. It includes the panel app's small observer cost and any other work in the same message task, so it is deliberately not labelled as time spent processing Home Assistant alone. The payload rate is the uncompressed JSON handled by the frontend, not compressed network traffic.

Use the aligned chart to look for correlation. Interaction spikes that coincide with heavy state traffic and state-event occupancy point at the size of the state stream. Slow handler time with a quiet stream points at dashboard JavaScript. Presentation delay and long rendering frames point at layout, animation, camera or media work. Repeated renderer reloads point at memory or renderer instability. Read the measurements together; a single CPU snapshot cannot identify the cause on its own.

The **Likely cause** row applies these rules conservatively and reports its confidence. When the evidence does not support one dominant cause, it says so.

### Comparing filtered and unfiltered from outside the panel

If the unfiltered dashboard overloads its own WebView, the in-page figures may stop changing. A collector script run from a computer polls the panel app's own performance API instead, so whole-panel CPU stays observable and, where root or the helper is available, so does a native probe of the Chromium renderer thread. It also records how old the last batch of browser measurements is; anything over 15 seconds is reported as stalled rather than treated as current.

The collector does not change your configuration. It never turns the entity filter on or off or rewrites it; its first request may create one private installation key in the panel app's internal state. Select the same dashboard view and workload for both runs, change the filter on the panel's web interface, wait for the dashboard to reload, then run one command from a checkout of the [ha-paneld repository](https://github.com/panel-assistant/android) for each state:

```bash
python3 scripts/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 scripts/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Compare the two results:

```bash
python3 scripts/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Each run defaults to three minutes, with a 30-second warm-up and polling every 10 seconds. `--pair-with` reuses an opaque comparison ID from the first result, so the comparison can reject a different physical panel, a different configured Home Assistant or dashboard, or a changed setting that affects the measurement, without recording those private values. It cannot detect a different view chosen by hand within the same dashboard, so keep the visible view and workload the same.

The collector rejects a run if the expected mode is not active, the filter revision or renderer generation changes, the build or configuration changes during collection, filtering falls back, or it keeps fewer than three samples, fewer than three whole-panel CPU samples or fewer than three native renderer CPU samples. It still writes the rejected result with the exact reasons, and it never overwrites an existing output file.

The JSON leaves out the panel's URL and ID, the Home Assistant URL and dashboard path, entity IDs, process names and the filter hash. The panel computes the opaque fingerprints with a private random 256-bit installation key that never leaves it, and the fingerprints are unique to one comparison pair, so separate measurements cannot be linked through them or used to guess a panel's name. A panel that cannot store the key refuses the measurement. The unfiltered entity count is the last synchronised count from the catalogue, not a live count recovered from the overloaded WebView, and is reported as unavailable when the catalogue is empty. Network and browser traffic counters are normalised to the intervals actually observed, so a missed poll cannot skew the comparison. Browser timing and traffic rates are left out of the summaries when stale, while CPU, memory, network and renderer figures from the panel app itself keep being collected.

### Optional remote WebView debugging

The built-in performance cards do not need DevTools. Use the **Remote WebView debugging** card only when you need to inspect the page source in depth.

For a separate dashboard app, turn on that app's own WebView remote debugging setting first and relaunch the dashboard; without it the relay cannot find the app's WebView. The network relay itself needs root.

### Rule out the stock NSPanel Pro Zigbee watchdog defect

Older stock Sonoff NSPanel Pro firmware containing a recursive `export LD_LIBRARY_PATH=/vendor/bin/siliconlabs_host/:${LD_LIBRARY_PATH}` assignment can make the vendor's `guard_process.sh` the performance problem itself. A [community investigation](https://github.com/panel-assistant/android/issues/34) confirmed the defect on an NSPanel Pro 120 running stock firmware 3.8.0, and reported it on all 16 of that reporter's panels. The script prepends its directory every five seconds. After roughly ten hours the environment string passes Linux's per-string limit for starting a program, external commands begin failing with `E2BIG`, `sleep` stops delaying the loop, and the watchdog can pin one CPU core. At that point it can also fail to restart a dead `zgateway`, leaving Zigbee unavailable. Firmware from 1.x to 3.x may well be affected wherever the same line exists, but that has not been independently verified.

Look for this pattern when the panel reports periodic system load on an otherwise idle stock NSPanel Pro:

- `guard_process.sh` stays near 100% of one CPU core, and its process size grows far above the healthy figure of about 9 MB;
- `zgateway` is missing or no longer recovers; and
- rebooting helps, but the load returns around ten hours later.

A reboot only resets the accumulating environment for a while. The linked issue contains a workaround using root and ADB supplied by the reporter, which the project has not independently validated. Do not apply it unless the exact recursive assignment appears once in the vendor's script. Any repair must first verify a non-empty backup and preserve ownership, mode and SELinux metadata. Stop before changing anything on an unexpected match; after the change, roll back if the restart or verification fails, return `/vendor` to read-only, and check both `zgateway` and its availability in Home Assistant. A firmware update that rewrites `/vendor` removes the local patch, and the defect returns only if the new firmware still contains the assignment. Community inspection of firmware 4.0.12 and 4.6.0 did not find it.

This defect is distinct from a stable `zgateway` busy-looping against a radio that does not respond. The panel's Zigbee health sensor separates guard and gateway CPU, join evidence and restart history. It warns about the exact recursive assignment but does not edit vendor scripts itself. A configured gateway that has explicitly not joined a network and stays above 50% of one core for five one-minute samples after its 15-minute grace period is switched off automatically and contained; a joined router with high CPU only raises a warning.

## Fixes, in order of impact

### 1. Filter the built-in renderer's entity subscription

Home Assistant's frontend normally subscribes to the state of every entity the signed-in user can see. The panel has to receive and process all of those states even when its dashboard uses only a few. The built-in renderer can add the dashboard's learned entity set to that subscription, so Home Assistant filters the stream before it serialises and sends it. The panel keeps its ordinary authenticated connection to Home Assistant; no proxy or extra server is involved.

The entity filter applies only to the built-in renderer. Guided setup asks whether to turn it on before the first dashboard load; on a panel that is already set up:

1. On port 8888, open **Configure**, then **Dashboard**, select **Built-in renderer (ha-paneld)**, and turn on **Entity filtering**.
2. Open the **Entities** tab and select **Scan dashboard now**.
3. Visit every dashboard tab and use its controls, pop-ups and conditional content, so dependencies at run time have a chance to be observed.
4. Review the current, suggested and excluded entities. Pin anything a custom card or template needs indirectly.
5. Resolve any entity-filter checks. Narrow a broad or dynamic dashboard rule where you can, or make an explicit choice and accept the warning the panel shows.
6. Apply the set, let the dashboard reload, and compare the same views using the performance cards on the Dashboard tab.

Automatic learning cannot prove every dependency of a custom card or dynamic template. A missing entity can leave a card stale or unavailable, so review the result on a panel you do not depend on first, and keep filtering off until the candidate is credible. The unfiltered subscription stays available as the way back: turn off **Entity filtering** and reload the dashboard.

If old learned evidence or manual choices no longer describe the dashboard, use **Reset learned data** on the Entities page. After you confirm, it clears learned membership, pins, exclusions and ignored safety decisions, keeps the known-good active filter and starts a new scan. The filter stays in place as the fallback while the candidate is rebuilt.

Advanced users can supply and inspect an exact list through the API. The workflow, the list format, the runtime status and the commands to undo it are in [the built-in renderer](/manage/built-in-renderer/#entity-filter).

### 2. Lighten the dashboard itself

- Split a dense dashboard into focused views, and avoid loading cards the panel never needs.
- Prefer built-in cards when a custom card animates constantly, builds a large document tree or does frequent JavaScript work.
- Watch interaction processing, long animation frames and renderer reloads. If one view dominates them, simplify it, or use `button.<panel>_reload` as a temporary recovery while you find the expensive card.
- Test camera and graph cards on their own. Their decoding, history queries and rendering can dominate even when entity filtering is working properly.

### 3. Reduce unnecessary updates at the source

Entity filtering protects the panel from entities it does not show, but it does not make a required entity cheaper. If the dashboard really does show a power meter, a Bluetooth distance sensor, a fast-changing template or a noisy diagnostic entity, reduce that source's update rate where its integration allows. This can also reduce recorder and database work for the whole Home Assistant installation.

Useful controls include ESPHome throttle and delta filters, Zigbee reporting intervals, integration `scan_interval` settings and less frequent template updates. Check that the change does not make an automation or history view less useful before applying it everywhere.

### 4. Match the remaining dashboard to the hardware

PX30 and RK3566 panels can run a focused dashboard well, but they still have limited single-thread performance and usually only 2 GB of RAM. Entity filtering removes unnecessary state work; it cannot make an oversized camera stream, a complex animation or a very large history graph free. Design for the panel's logical display size, and test the heaviest view rather than judging only the home tab. The [hardware pages](/hardware/) compare the supported panels.

## Checklist

- [ ] The built-in renderer is selected wherever Assist voice control and native notifications are not needed
- [ ] Automatic entity filtering is on, scanned, reviewed and explicitly applied
- [ ] Every dashboard tab, pop-up and conditional path was used during learning
- [ ] Custom-card and template dependencies are pinned or otherwise accounted for
- [ ] Entity-filter checks were resolved deliberately, not ignored by accident
- [ ] The same views were compared before and after filtering using the performance cards on the Dashboard tab
- [ ] If the page itself stalls unfiltered, both runs were collected and validated with the measurement script
- [ ] Heavy cards, camera streams and graphs were tested on their own
- [ ] Required high-frequency entities were tuned at the source where appropriate
- [ ] On a stock NSPanel Pro Zigbee stack, `guard_process.sh` has been checked
- [ ] Reloading and turning the filter off have both been tried as recovery routes

## Reference

### Why a large Home Assistant installation can slow a panel

The Home Assistant frontend keeps a WebSocket subscription with the current state of, and every later update to, the entities available to the user. Without a restricted entity set, the renderer receives far more data than a focused wall dashboard uses. Its JavaScript main thread has to parse the messages, update the frontend's state model and work out whether anything visible changed.

Low-cost panels are especially sensitive, because JavaScript, layout and painting depend heavily on one renderer thread. Extra CPU cores help with other work but do not remove that delay, and limited RAM makes garbage collection increasingly disruptive as the WebView's memory grows.

### Common symptoms

| Symptom                                                                                         | Likely cause                                                                         |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Delayed taps, sluggish navigation or stuttering scroll                                          | Renderer main-thread work from a large entity stream, heavy cards, or both           |
| One dashboard view is much worse than the others                                                | Expensive cards, camera decoding, history data or a large document tree on that view |
| The whole view goes blank while the surrounding interface remains                               | WebView memory pressure or renderer failure                                          |
| The dashboard gradually degrades over days                                                      | Memory growth, fragmentation, or a card that accumulates work                        |
| Entities stop updating and then arrive in a burst                                               | A WebSocket interruption, a reconnect, or a renderer that cannot keep up             |
| Similar panels behave differently                                                               | Different dashboard content, entity subscription, WebView version, uptime or heat    |
| A stock NSPanel Pro turns janky about ten hours after boot and `guard_process.sh` uses one core | The recursive assignment in the vendor Zigbee watchdog, leading to `E2BIG`           |

Garbage collection pauses JavaScript from time to time to reclaim unused memory. Close to the memory ceiling those pauses become longer and more frequent, which can starve rendering even when the Android process itself has not crashed.
