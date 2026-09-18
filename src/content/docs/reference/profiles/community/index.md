---
title: Community panel profiles
description: Profiles supplied by the community for panels the panel app does not bundle, how to import one safely, and how to enable a camera a profile does not declare.
sidebar:
  label: Overview
  order: 0
---

This is a catalogue of community-supplied profiles that are not bundled with ha-paneld. Listing a profile here is not a claim that ha-paneld runs on the named retail hardware as sold. Each profile may describe a particular reflash, firmware modification or single reported installation rather than the manufacturer's stock software.

Community profiles are never selected automatically. Download the individual YAML file, inspect its source, tested firmware and limitations, and use the panel's **Profiles** page to import it. Importing and validating are preview-only; they neither save nor activate the profile.

Before saving, require the preview to report that every predicate in one complete match group agrees with the panel's immutable device facts. A matching name alone is insufficient. Activation hard-checks that identity and rejects unsafe touchscreen grabs, but it does not preflight every live privilege route. After the controlled restart, the running capability-specific drivers probe their interfaces and authority when initialised or used; unavailable capabilities stay unavailable, and startup health determines whether the candidate remains active or rolls back. Never treat a successful import or activation as proof that every declared capability works.

## Trying a community profile safely

1. Open `http://<panel-ip>:8888/profiles`, export the active revision and make a current full panel backup.
2. Download and inspect the YAML. Confirm that its exact firmware and modification assumptions describe the panel in front of you.
3. Paste or upload the YAML on **Profiles**, then validate it. Do not continue if the identity match is incomplete, a required compiled driver is missing or an unsafe input mapping is reported. Validation does not prove live hardware authority.
4. Save the validated content as an inactive local revision. Saving still does not alter the running profile.
5. Test and activate it only while somebody can see and touch the panel, following the [profile testing checklist](/reference/profiles/testing/). Activation is tied to the exact profile ID, revision and content hash.
6. After restart, inspect the live capability results and confirm the active revision, expected controls and Home Assistant entities. An unavailable route must remain unavailable rather than being treated as successful. Exercise **Roll back** before relying on the profile unattended; failed startup health should return to the last-known-good revision automatically.

Returning to **Use automatic** selects only a bundled profile or the conservative Generic fallback. It will not automatically reactivate a community revision.

## Enabling the camera on a panel whose profile does not declare one

The camera is offered on any panel that has one: a camera the profile declares with `hardware.camera`, or a camera Android enumerates on a panel whose profile says nothing. A board with working camera hardware therefore usually needs no profile entry at all, and the Camera group appears in **Configure** without anybody editing YAML.

Three things can still leave it absent, and the Camera card in **Configure** names which one applies rather than disappearing:

- **The profile suppresses it.** `hardware.camera: false` is a deliberate third state, not the same as omitting the key: it says the enumerated device is not a usable room camera, such as an HDMI capture input. Remove the line, or set it to `true`, to offer the camera.
- **Android enumerated no camera.** If the panel does have one, declare `hardware.camera: true` in its profile. A declaration outranks an empty enumeration, so this is also the fix when the camera service is present but the enumeration is unreliable.
- **The enumeration has not answered yet.** This is not a statement about the hardware. Wait a few seconds and reload Configure; nothing needs editing.

Declaring a camera the board does not expose is safe rather than harmful. A lightweight runtime probe reads Android's camera identifier list for capability reporting; a declared camera is still offered, and a board without one refuses an open with a classified `no_camera_id` fault whose action says the profile is wrong. It does not destabilise the panel.

One requirement travels with the flag. Camera use fails closed unless the panel can show the room that it is open, and while the screen is off that means an off-display route. Declare `hardware.camera` alongside a working `led` block, and set `hardware.camera_lens_offset_px` so the on-screen indicator sits under the lens rather than beside it. Both camera-bearing bundled profiles do this, and it is the reason a camera flag on its own is not enough.

Everything else about the camera is unchanged by the flag: it stays off until somebody turns it on at the panel, the switch is never a suggested default, and turning it on asks for approval on the panel's own screen in every security mode.

## Catalogue

- [`community-cronos-lineageos18.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-cronos-lineageos18.yaml): a draft for one contributor's Amazon Echo Show 5 Gen 2 reflashed with LineageOS 18.1. Stock Fire OS cannot run ha-paneld; unlocking, reflashing and recovery are not supported, and the profile has not been validated on hardware by the project. See the [profile-specific evidence notes](/reference/profiles/community/echo-show-5-gen2/).
- [`community-lenovo-thinksmart-view-lineageos.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-lenovo-thinksmart-view-lineageos.yaml): a draft for one contributor's Lenovo ThinkSmart View reflashed with LineageOS 8.1. It selects Android sleep because brightness zero remains visibly lit, records that touch does not wake the panel, and notes the contributor's confirmation that Home Assistant can dim it, turn it fully off and wake it again. See the [profile-specific evidence notes](/reference/profiles/community/lenovo-thinksmart-view/).
- [`community-sunworld-yc-sm55p-p76s01.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-sunworld-yc-sm55p-p76s01.yaml): a draft for one contributor's 5.5-inch Sunworld YC-SM55P on the Portworld P76S01 board. The profile records the firmware-backed RK3576S identity and conservative Android control routes, but leaves optional sensors and camera hardware disabled until physical testing. Its generic Rockchip build identity is not safe for automatic selection. See the [profile-specific evidence notes](/reference/profiles/community/sunworld-yc-sm55p/).

For the profile format, trust boundary and contribution requirements, see the [runtime profile guide](/reference/profiles/), [format reference](/reference/profiles/format/), [testing checklist](/reference/profiles/testing/) and [sharing guide](/reference/profiles/sharing/).
