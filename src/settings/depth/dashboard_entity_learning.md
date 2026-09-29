---
spec: 423653c0004f
related:
  - /manage/built-in-renderer/#entity-filter
  - /manage/performance/
---

Home Assistant's frontend normally subscribes to the state of every entity the signed-in user can see, and the panel has to receive and process all of those updates even when its dashboard shows only a few. With this on, the built-in renderer limits that subscription to the entities the dashboard uses, so Home Assistant filters the stream before sending it. On a large installation this is usually the biggest single improvement on a slow panel.

The entity set comes from two kinds of evidence: a scan of the dashboard's configuration, and entities the dashboard is seen to use while it runs. The **Entities** tab on the panel's web interface shows what was found and why, and is where you pin entities a custom card or template needs indirectly, exclude others, and apply the set. While filtering is on and no trustworthy set exists yet, the panel shows a hold screen instead of opening the dashboard unfiltered.

Automatic learning cannot prove every dependency of a custom card or a dynamic template, and a missing entity leaves a card stale or unavailable. After turning it on, visit every dashboard tab and use its pop-ups and conditional content. If something is missing, turn this off and reload the dashboard to return to the full subscription. It has no effect when another app is selected in [Dashboard app](#dashboard_package).
