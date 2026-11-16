---
title: Notifications
description: Showing Home Assistant notifications on a panel as cards with pictures, buttons and a countdown, using the same options as the Companion app.
---

**Panel Assistant 1.1, in development.** This page describes a feature that is not in a released version yet.

Send a notification from a Home Assistant automation to a panel and it appears over the dashboard as a card drawn in the panel's own design, light on a dark dashboard and dark on a light one. The options are the ones the Home Assistant Companion app uses on a phone, so an automation you already wrote for your phone works on a panel by changing only the notify action.

<img class="light:sl-hidden" src="/screenshots/notification-garage-dark.png" width="480" height="480" alt="A time-sensitive notification card, Garage door open, with Close it, Leave open and Dismiss buttons, over a dark dashboard">
<img class="dark:sl-hidden" src="/screenshots/notification-garage-light.png" width="480" height="480" alt="A time-sensitive notification card, Garage door open, with Close it, Leave open and Dismiss buttons, over a light dashboard">

## Turn it on

On the panel's **Configure** page, open the advanced settings and turn on **Panel notifications** in the System section. The dashboard reloads once.

Each panel has its own notify action in Home Assistant: its name starts with `notify.panel_assistant_`, then the panel's name and a code. To find it, open **Developer tools → Actions** and type `panel_assistant`. The examples below use `notify.panel_assistant_living_room_panel`; use your panel's action in its place.

## How a message appears

Every message joins Home Assistant's own **Notifications** list, where you can read it or dismiss it later. That list is shared: dismissing a message removes it from every dashboard.

How much a message interrupts is set by its interruption level, as on a phone:

| Level              | On the panel                                                |
| ------------------ | ----------------------------------------------------------- |
| `passive`, or none | Stays quiet in the Notifications list                       |
| `active`           | A small notice for 5 seconds, or a card if it has a picture |
| `time-sensitive`   | A card for 10 seconds                                       |
| `critical`         | A card for 20 seconds, edged in red                         |

A message with buttons is always a card, and it stays on the panel until someone deals with it. Nothing on this page wakes the screen, plays a sound or lights an LED.

**Close** puts the card away and leaves the message in the Notifications list. **Dismiss** removes the message from Home Assistant. **View notifications** opens the list.

## Buttons

Add up to three buttons the same way as for the Companion app. The card then stays until someone taps a button or Dismiss, its `timeout` passes, or the message is removed from Home Assistant.

- A tap fires the `mobile_app_notification_action` event, so automations that answer a phone's buttons answer the panel's too. The message is then removed, unless you set `sticky: true`.
- Dismiss fires `mobile_app_notification_cleared`.
- A button with `action: URI` opens a page of your Home Assistant, such as `/lovelace/cameras`.
- A new message with the same `tag` replaces the card that is showing.

When the buttons do not fit side by side on a small panel, they go two to a row. If the message then still does not fit, it is shortened to whole lines ending in an ellipsis, and the full text stays in the Notifications list.

## Examples

### Garage door left open

A time-sensitive card with two buttons. The first is the main action, and a second automation answers it by closing the door.

```yaml
automation:
  - alias: 'Garage left open'
    triggers:
      - trigger: state
        entity_id: cover.garage_door
        to: 'open'
        for: '00:15:00'
    actions:
      - action: notify.panel_assistant_living_room_panel
        data:
          title: 'Garage door open'
          message: 'The garage door has been open for 15 minutes.'
          data:
            tag: garage
            push:
              interruption-level: time-sensitive
            actions:
              - action: CLOSE_GARAGE
                title: 'Close it'
              - action: LEAVE_GARAGE
                title: 'Leave open'

  - alias: 'Close the garage from the panel'
    triggers:
      - trigger: event
        event_type: mobile_app_notification_action
        event_data:
          action: CLOSE_GARAGE
    actions:
      - action: cover.close_cover
        target:
          entity_id: cover.garage_door
```

### Water leak

A critical card is edged in red. `sticky` keeps it after a button press, so Silence does not hide a leak that has not been dealt with; Dismiss removes it.

<img class="light:sl-hidden" src="/screenshots/notification-water-leak-dark.png" width="480" height="480" alt="A critical notification card with a red edge, Water leak, with Shut off water, Silence and Dismiss buttons, over a dark dashboard">
<img class="dark:sl-hidden" src="/screenshots/notification-water-leak-light.png" width="480" height="480" alt="A critical notification card with a red edge, Water leak, with Shut off water, Silence and Dismiss buttons, over a light dashboard">

```yaml
actions:
  - action: notify.panel_assistant_living_room_panel
    data:
      title: 'Water leak'
      message: 'The sensor under the kitchen sink is wet.'
      data:
        tag: leak
        sticky: true
        push:
          interruption-level: critical
        actions:
          - action: WATER_OFF
            title: 'Shut off water'
          - action: LEAK_SILENCE
            title: 'Silence'
```

### A card that leaves on its own

With `timeout`, in seconds, the Dismiss button counts down the time the card has left. At zero the card leaves the panel, and the message stays in the Notifications list.

<img class="light:sl-hidden" src="/screenshots/notification-front-door-dark.png" width="480" height="480" alt="A time-sensitive notification card, Front door unlocked, with a Lock it button and a Dismiss button counting down from 4:59, over a dark dashboard">
<img class="dark:sl-hidden" src="/screenshots/notification-front-door-light.png" width="480" height="480" alt="A time-sensitive notification card, Front door unlocked, with a Lock it button and a Dismiss button counting down from 4:59, over a light dashboard">

```yaml
actions:
  - action: notify.panel_assistant_living_room_panel
    data:
      title: 'Front door unlocked'
      message: 'The front door has been unlocked for 10 minutes.'
      data:
        tag: front_door
        timeout: 300
        push:
          interruption-level: time-sensitive
        actions:
          - action: LOCK_DOOR
            title: 'Lock it'
```

### A camera picture

The picture sits as a tile beside the title. Here it is a camera's detection snapshot.

<img class="light:sl-hidden" src="/screenshots/notification-fox-dark.png" width="480" height="480" alt="A notification card, Fox outside, with a camera picture of a fox beside the title, over a dark dashboard">
<img class="dark:sl-hidden" src="/screenshots/notification-fox-light.png" width="480" height="480" alt="A notification card, Fox outside, with a camera picture of a fox beside the title, over a light dashboard">

```yaml
actions:
  - action: notify.panel_assistant_living_room_panel
    data:
      title: 'Fox outside'
      message: 'The north camera saw a fox.'
      data:
        image: /api/image_proxy/image.north_camera_fox
        push:
          interruption-level: active
```

The picture must come from your own Home Assistant and be at most 1024 pixels on each side and 2 MiB. A larger one, such as a full frame from a high-resolution camera, is skipped and the text appears on its own. Detection snapshots like the one above fit.

### A reminder with a button

No interruption level is set, as in most phone automations, yet the card shows because it has a button. It stays until Done or Dismiss.

<img class="light:sl-hidden" src="/screenshots/notification-bins-dark.png" width="480" height="480" alt="A notification card, Bin day tomorrow, with Done and Dismiss buttons, over a dark dashboard">
<img class="dark:sl-hidden" src="/screenshots/notification-bins-light.png" width="480" height="480" alt="A notification card, Bin day tomorrow, with Done and Dismiss buttons, over a light dashboard">

```yaml
actions:
  - action: notify.panel_assistant_living_room_panel
    data:
      title: 'Bin day tomorrow'
      message: 'Put the green bin out tonight.'
      data:
        tag: bins
        actions:
          - action: BINS_DONE
            title: 'Done'
```

### Plain text

An active message without a picture or buttons is a small notice at the bottom of the screen for 5 seconds. Tap it to open the Notifications list.

<img class="light:sl-hidden" src="/screenshots/notification-laundry-dark.png" width="480" height="480" alt="A small notice at the bottom of the screen, Laundry ready, with a close button, over a dark dashboard">
<img class="dark:sl-hidden" src="/screenshots/notification-laundry-light.png" width="480" height="480" alt="A small notice at the bottom of the screen, Laundry ready, with a close button, over a light dashboard">

```yaml
actions:
  - action: notify.panel_assistant_living_room_panel
    data:
      title: 'Laundry ready'
      message: 'The washing machine has finished.'
      data:
        push:
          interruption-level: active
```

## On a larger panel

On a 10-inch panel the card keeps the same design and stops growing at 600 pixels wide.

<img class="light:sl-hidden" src="/screenshots/notification-water-leak-10in-dark.png" width="640" height="400" alt="The Water leak card on a 10-inch panel, over a dark dashboard">
<img class="dark:sl-hidden" src="/screenshots/notification-water-leak-10in-light.png" width="640" height="400" alt="The Water leak card on a 10-inch panel, over a light dashboard">

<img class="light:sl-hidden" src="/screenshots/notification-front-door-10in-dark.png" width="640" height="400" alt="The Front door unlocked card on a 10-inch panel, over a dark dashboard">
<img class="dark:sl-hidden" src="/screenshots/notification-front-door-10in-light.png" width="640" height="400" alt="The Front door unlocked card on a 10-inch panel, over a light dashboard">

<img class="light:sl-hidden" src="/screenshots/notification-fox-10in-dark.png" width="640" height="400" alt="The Fox outside card on a 10-inch panel, over a dark dashboard">
<img class="dark:sl-hidden" src="/screenshots/notification-fox-10in-light.png" width="640" height="400" alt="The Fox outside card on a 10-inch panel, over a light dashboard">

## What a panel does not do

A message can join the Notifications list while the panel is offline; that does not mean it appeared on the panel. Text on the card is shown as written, without Markdown. To have a panel speak a message, use [text-to-speech](/manage/text-to-speech/).
