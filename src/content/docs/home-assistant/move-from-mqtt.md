---
title: Move a panel from MQTT
description: Handing a panel's entities from Home Assistant's MQTT integration to Panel Assistant, keeping their entity IDs, history and customisations.
---

Until now a panel's screen, LEDs, buttons and sensors have reached Home Assistant through the MQTT integration. Panel Assistant can now own those entities itself, talking to the panel over Home Assistant's own connection instead of a broker. MQTT support will be removed from ha-paneld before version 1.0, after which a panel needs no broker at all, and this page is how you move ahead of that.

You move one panel at a time, and each move can be reversed. The panel's entities keep their entity IDs, their history, and any name, icon or area you gave them, so dashboards and automations that use them carry on working.

:::caution[Early access]
The move is new. Try it on one panel first, and tell us how it went on [Discord](https://panel-assistant.io/go/discord) or in the [issues](https://github.com/panel-assistant/ha-integration/issues).
:::

## Before you start

- **Panel Assistant 0.3.0 or newer** in Home Assistant, installed through HACS as described in [Install the integration](/home-assistant/custom-integration/).
- **ha-paneld 0.9.8-rc1 or newer** on the panel. This is a pre-release: on the panel's status page, set **ha-paneld auto-update channel** to `prerelease`, then install the update from the panel's update entity in Home Assistant.
- **The panel is signed in to Home Assistant**, which it is if it shows your dashboard.
- **Leave your MQTT setup as it is.** The panel still uses the broker while you move, and nothing needs to change on it.

## 1. Turn on Panel Assistant entities

Add this to `configuration.yaml`, then restart Home Assistant:

```yaml
panel_assistant:
  native_entities: true
```

Nothing moves yet. Each panel that Panel Assistant knows about gains a second set of entities on its Panel Assistant device, alongside the MQTT ones, so the two can be compared. When you move a panel, its MQTT entities take the place of this second set.

## 2. Add the panel to Panel Assistant

Skip this if the panel already appears under Panel Assistant in **Settings**, **Devices and services**.

Choose **Add integration**, then **Panel Assistant**, then **Add a panel**, and enter the panel's hostname or address. Panel Assistant finds ha-paneld already running and offers **Connect to Home Assistant**. Nothing on the panel is reinstalled.

## 3. Confirm the panel's user

When the panel first connects, Home Assistant shows a repair: **Confirm the Home Assistant user for** your panel. Open it from **Settings**, **Repairs**, check that the user named is the account the panel signs in with, and confirm.

The panel retries on its own, so the repair can take up to 15 minutes to appear, and the panel can take the same again to connect after you confirm.

## 4. Move the panel

Open the panel's Panel Assistant entry under **Devices and services**, choose **Configure**, set **Control** to **Panel Assistant**, and save.

The entry reloads and the panel reconnects. Its MQTT entities move to Panel Assistant, and once the panel has confirmed the move, the panel's MQTT device is removed. Expect the entities to show as unavailable for a few seconds, and once more about 30 seconds later, while this settles. The device's activity log fills with state changes as every entity reports in; that is expected.

From now on, changing a setting or pressing a button on the panel's entities goes through Panel Assistant. Before a panel is moved, the same controls answer that the panel is controlled through MQTT.

### What does not move

Two MQTT buttons have no Panel Assistant equivalent, **Update ha-paneld** and **Update Companion app**, so they are removed, along with any leftover MQTT update entity for ha-paneld. The panel's Panel Assistant update entity does their job.

If you gave one of those a name, icon or area of your own, or hid or disabled it, Panel Assistant will not remove it for you. A repair lists it instead, and the panel keeps its MQTT entities until you delete that entity or clear those settings.

## Moving a panel back

Open **Configure** again and set **Control** to **MQTT, with native reports for comparison**, or to **MQTT**. The entities move back to the MQTT integration with the same entity IDs and history, and the panel announces its MQTT device again.

Always move a panel back this way. Do not delete a panel's Panel Assistant entry while Panel Assistant controls it: Home Assistant clears that entry's entities as part of the deletion, and although Panel Assistant hands them back first, a customised entity can lose its name, icon or area on the way.

## Known limitations

- **Some sensors stay unavailable.** A panel can offer entities for sensors its hardware does not report, such as proximity, temperature or humidity. They are new Panel Assistant entities, not moved ones, so disabling them loses nothing.
- **Older ha-paneld on a moved panel.** If a moved panel is later downgraded below 0.9.8-rc1, it announces its MQTT entities again. Panel Assistant disables the duplicates and raises a repair, **Update ha-paneld**, which clears once the panel is updated.
- **Restart notices.** While Home Assistant restarts, a panel whose account is not an administrator still learns about it through MQTT, which is one more reason to leave the broker running for now.
