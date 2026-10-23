---
title: Repairs
description: What each Panel Assistant Repair means, why it appears and how to resolve it.
---

Open **Settings → System → Repairs** in Home Assistant and choose the Panel Assistant message. Its first link opens the relevant setting or recovery steps. Use **Learn more** for the explanation below.

Keep the saved support report while checking a failed installation or update. The **Clear error** action removes that report; it does not change the panel.

Use the existing Repair’s guarded **Try again** only after checking its report and the panel. Do not start a fresh automatic installation, uninstall or reset while the installed state is unknown. See [installation recovery](/manage/troubleshooting/#a-network-install-stopped-partway) and [support reports](/home-assistant/support-report/).

## Find your Repair

- [Panel app too old](#panel-app-too-old)
- [Old app needs 0.9.0](#old-app-needs-090)
- [Mqtt panel needs 0.9.0](#mqtt-panel-needs-090)
- [Panel permissions](#panel-permissions)
- [Panel proximity setup](#panel-proximity-setup)
- [Voice microphone silent](#voice-microphone-silent)
- [Voice microphone no audio](#voice-microphone-no-audio)
- [Voice microphone no audio detail](#voice-microphone-no-audio-detail)
- [Wake word kept](#wake-word-kept)
- [Wake word refused](#wake-word-refused)
- [Volume number removed](#volume-number-removed)
- [Restart required](#restart-required)
- [Panel user mismatch](#panel-user-mismatch)
- [No update route](#no-update-route)
- [Merged panel identity](#merged-panel-identity)
- [Installer failure](#installer-failure)
- [Installer failure: authorization failed](#installer-failure-authorization-failed)
- [Installer failure: preflight rejected](#installer-failure-preflight-rejected)
- [Installer failure: artifact rejected](#installer-failure-artifact-rejected)
- [Installer failure: transport failed](#installer-failure-transport-failed)
- [Installer failure: install failed](#installer-failure-install-failed)
- [Installer failure: launch failed](#installer-failure-launch-failed)
- [Installer failure: health check failed](#installer-failure-health-check-failed)
- [Installer failure: ambiguous mutation](#installer-failure-ambiguous-mutation)
- [Installer failure: verification required](#installer-failure-verification-required)
- [Installer failure: update](#installer-failure-update)
- [Installer failure: retry hold](#installer-failure-retry-hold)
- [Panel address unreachable](#panel-address-unreachable)
- [Panel address unverified](#panel-address-unverified)
- [Panel identity mismatch](#panel-identity-mismatch)
- [Panel link shared](#panel-link-shared)
- [Panel identity confirmation](#panel-identity-confirmation)
- [Installer failure: ADB authorization](#installer-failure-adb-authorization)
- [Adb update authorization](#adb-update-authorization)
- [Another Home Assistant](#another-home-assistant)

## Panel app too old

**What it means:** Home Assistant cannot see or control the panel through the current connection protocol.

**Why it happens:** The panel app reports no supported connection protocol, or its protocol range does not overlap the one this Panel Assistant can serve.

**How to fix it:** Open Home Assistant Updates and install a compatible app update for this panel if one is offered. Wait for it to reconnect. If none is offered, use the update recovery guide; do not downgrade blindly.

## Old app needs 0.9.0

**What it means:** Panel Assistant 1.0 cannot install or update this old-app panel.

**Why it happens:** The move from the old ha-paneld app was removed in 1.0.

**How to fix it:** Do not redownload Panel Assistant 0.9.0 over a running 1.0 installation: a setting removed by 1.0 can make 0.9.0 return migrated panels to MQTT. Only if no panel has the 1.0 app yet, restore a Home Assistant backup from before the upgrade, finish every move in 0.9.0, then return to 1.0. If any panel already has the 1.0 app, or there is no suitable backup, ask for support before changing versions. See the [1.0 upgrade recovery guide](/manage/upgrade-to-1-0/).

## Mqtt panel needs 0.9.0

**What it means:** Panel Assistant cannot connect this unmoved MQTT panel without splitting its entities and history.

**Why it happens:** Panel Assistant 1.0 no longer performs the MQTT move.

**How to fix it:** Do not redownload Panel Assistant 0.9.0 over a running 1.0 installation: a setting removed by 1.0 can make 0.9.0 return migrated panels to MQTT. Only if no panel has the 1.0 app yet, restore a Home Assistant backup from before the upgrade, finish every move in 0.9.0, then return to 1.0. If any panel already has the 1.0 app, or there is no suitable backup, ask for support before changing versions. See the [1.0 upgrade recovery guide](/manage/upgrade-to-1-0/).

## Panel permissions

**What it means:** Some panel features cannot work because Android has not granted their permissions. The dashboard remains available.

**Why it happens:** An older installation or changed Android permission can leave a required grant missing. Camera permission matters while the camera is enabled; microphone permission matters while camera or voice is enabled. Unknown feature state keeps the warning until it can be checked.

**How to fix it:** At the physical panel open Android Settings → Apps → Panel Assistant. Allow camera, microphone and notifications where listed. Under Special app access allow Modify system settings and Display over other apps, then enable Panel Assistant under Accessibility. If navigation is Swipe reveal or Always on and overlay permission is missing, swipe up from the dashboard bottom to open Display over other apps, allow it, return and swipe again. Return to the Repair and Submit. Home Assistant must freshly verify every relevant grant; a failed read or app update alone cannot close the Repair.

## Panel proximity setup

**What it means:** Wave-to-wake is unavailable because the panel has not saved its proximity calibration.

**Why it happens:** The panel reports calibration_required. Calibration measures this installation and needs a person in front of the panel; starting setup alone does not establish completion.

**How to fix it:** Open this panel’s Configure page at Presence & wake and choose Set up proximity on panel. Follow the physical instructions on the panel, taking about a minute. After it says calibration is saved, return to the Repair and Submit. Home Assistant reads fresh status before completing; if setup is still running or the panel cannot be read, finish setup or restore the connection and submit again. The dashboard’s Open proximity setup action is also an on-panel starting point.

## Voice microphone silent

**What it means:** The panel is not listening for a wake word because its microphone capture check recorded only silence.

**Why it happens:** The check found only silence or a stationary audio floor.

**How to fix it:** Open this panel in the Panel Assistant sidebar, then Configure → Voice assistant. Turn it off and on to run another check. If it still fails, change Audio source in the same Voice card; its direct link reveals the advanced setting. A working check clears the Repair. Turning voice off also withdraws it because listening is no longer requested.

## Voice microphone no audio

**What it means:** The panel is not listening for a wake word because its microphone capture check received no audio.

**Why it happens:** Android capture delivered no audio, without a more specific error.

**How to fix it:** Open this panel in the Panel Assistant sidebar, then Configure → Voice assistant. Turn it off and on to run another check. If it still fails, change Audio source in the same Voice card; its direct link reveals the advanced setting. A working check clears the Repair. Turning voice off also withdraws it because listening is no longer requested.

## Voice microphone no audio detail

**What it means:** The panel is not listening for a wake word because its microphone capture check received no audio.

**Why it happens:** Android capture returned no audio; the panel-reported detail explains the capture error.

**How to fix it:** Open this panel in the Panel Assistant sidebar, then Configure → Voice assistant. Turn it off and on to run another check. If it still fails, change Audio source in the same Voice card; its direct link reveals the advanced setting. A working check clears the Repair. Turning voice off also withdraws it because listening is no longer requested.

## Wake word kept

**What it means:** This panel kept its own model under the shared wake word id, so it is not using the shared model.

**Why it happens:** The installed model has a different SHA-256 from the shared model and is not a previous shared copy. Panel Assistant preserves an independently imported model instead of overwriting it.

**How to fix it:** Open this panel in Panel Assistant, Configure, Wake words. If you want the shared model there, import its matching .json manifest and .tflite model on this panel. Leave the current model alone if that was intentional; automatic sharing never replaces it. Importing through the sidebar also makes the imported model the shared copy; sharing does not activate wake words.

Importing through the sidebar replaces the shared copy and can update other panels. See [custom wake words](/manage/custom-wake-words/).

## Wake word refused

**What it means:** The shared wake word was not installed on this panel; its other installed wake words remain available.

**Why it happens:** The panel refused the imported model and reported a reason. A model may have an invalid manifest, exceed its limits, fail the wake word engine check, or fail to save. A model accepted by one panel can be refused by another.

**How to fix it:** Open this panel in Panel Assistant, Configure, Wake words. Use the reported reason to correct or retrain the microWakeWord model, then import its matching .json manifest and .tflite file there. The import displays the panel response and preserves its last good model on refusal. Sharing does not activate the wake word; select it if you want the panel to listen for it. Unsupported older app commands and connection timeouts produce warnings rather than this Repair.

Importing through the sidebar replaces the shared copy and can update other panels. See [custom wake words](/manage/custom-wake-words/).

## Volume number removed

**What it means:** Automations or scripts still refer to a separate volume number that was removed from a panel which now has a media player. Those actions need updating.

**Why it happens:** The panel media player now owns volume. Panel Assistant removes only that panel’s former volume number after Home Assistant starts, and names the automations and scripts that still refer to it.

**How to fix it:** Open Automations or Scripts and find the automations or scripts listed in the Repair. Replace number.set_value actions targeting the removed number with media_player.volume_set targeting the panel’s media player; set volume_level between 0 and 1, for example 0.5 for 50%. Update other references according to their purpose. Save, check the automation or script works, then ignore the Repair. Panel Assistant does not rewrite them automatically.

## Restart required

**What it means:** Home Assistant is still running the previous Panel Assistant version.

**Why it happens:** The installed integration version/build differs from the code already loaded in Home Assistant.

**How to fix it:** Open the Repair, check the installed and running versions, then Submit when ready to restart Home Assistant and load the installed version.

## Panel user mismatch

**What it means:** A request to use a different panel account waits for administrator consent.

**Why it happens:** The authenticated requester differs from the panel’s recorded account; signing into Home Assistant is not authority to take over an existing panel.

**How to fix it:** Check expected panel account; approve only deliberate change, otherwise close and ignore. Never blindly follow reconnect instructions to accept an unsolicited request.

## No update route

**What it means:** Panel Assistant cannot install app updates; the panel stays on its current app version while its other features keep working.

**Why it happens:** The panel no longer offers a usable update route, which can follow firmware changes or a reset.

**How to fix it:** Follow [the guide for a panel that cannot be updated](/manage/updates-and-recovery/#a-panel-that-cannot-be-updated). Recovery depends on the model and firmware: restore debugging access or reconnect over USB only when the guide calls for it. The Repair clears once Home Assistant has a working update route.

## Merged panel identity

**What it means:** Several entries claim one identity, preventing safe native ownership.

**Why it happens:** Cloned or historical shared identifiers make a session ambiguous; the integration refuses to choose a panel.

**How to fix it:** Update the app on every affected physical panel so each reports its own identity. Then delete the merged device in Home Assistant and let the panels register again. Review any entities disabled by an earlier release; they are not restored automatically.

## Installer failure

**What it means:** The installation or update did not finish.

**Why it happens:** The failure did not match a more specific Repair reason.

**How to fix it:** Open its Support report to see what happened, then use Try again after resolving the reported cause.

## Installer failure: authorization failed

**What it means:** The install could not connect to Android on the panel.

**Why it happens:** The panel did not accept Home Assistant’s ADB connection.

**How to fix it:** Check the panel’s debugging and approval prompt using Prepare a panel, then use Try again in the Repair.

## Installer failure: preflight rejected

**What it means:** The requested app was not installed.

**Why it happens:** The installer’s checks rejected the panel before installation.

**How to fix it:** Open the Support report, correct the reported check, then use Try again if the panel and selected release still match.

## Installer failure: artifact rejected

**What it means:** The requested app was not installed.

**Why it happens:** The release could not be authenticated or its local staging checks failed, including an unsafe or occupied staging path.

**How to fix it:** Open the Support report to identify the rejected release or staging check, then retry through the Repair after that cause is resolved.

## Installer failure: transport failed

**What it means:** Home Assistant could not finish transferring or installing the app.

**Why it happens:** A transport operation failed; this may be a connection problem or a rejected transfer or install operation.

**How to fix it:** Restore the panel’s connection, then use Try again in the Repair so Panel Assistant checks its current state before continuing.

## Installer failure: install failed

**What it means:** Android rejected the requested installation.

**Why it happens:** The panel’s package installation failed; the Support report contains the result.

**How to fix it:** Read the Support report and address the reported Android error, then use Try again in the Repair.

## Installer failure: launch failed

**What it means:** The app is installed but did not start.

**Why it happens:** The installer could not launch Panel Assistant after installation.

**How to fix it:** Open Panel Assistant from the panel’s app list, then use Try again in the Repair to check and finish the attempt. If it will not open, use its Support report for help.

## Installer failure: health check failed

**What it means:** The app started but has not been confirmed healthy.

**Why it happens:** The installer did not receive the required healthy response.

**How to fix it:** Check the app on the panel, then use Try again in the Repair to check its state. If it remains unhealthy, use the Support report for help.

## Installer failure: ambiguous mutation

**What it means:** Panel Assistant cannot tell whether the failed attempt changed the panel.

**Why it happens:** The install result did not prove the panel’s final package state.

**How to fix it:** Check what is on the physical panel and open the Repair’s Support report. Use its guarded Try again action only after checking the reported state; do not uninstall, clear app data or reset the panel to clear the message.

## Installer failure: verification required

**What it means:** Another installation is held until the panel can be checked.

**Why it happens:** The prior attempt requires verification before any further install.

**How to fix it:** Check the panel and its Support report, then use Try again in the Repair to recheck its current state. Do not uninstall, clear app data or reset the panel to clear the message.

## Installer failure: update

**What it means:** Home Assistant could not confirm that the update completed. It may already have completed on the panel.

**Why it happens:** The update attempt failed; the Repair retains its report.

**How to fix it:** Read the Support report, restore the reported connection or installation requirement, then choose Try again. If Allow updates is offered, use it to approve Home Assistant on the panel first.

## Installer failure: retry hold

**What it means:** The retry is paused and has not been authorised to continue.

**Why it happens:** A safety check or unexpected retry error stopped this attempt. The saved report records what was observed; a hold does not grant permission to reinstall.

**How to fix it:** Read the reported retry error and Support report, check that the intended panel and release still match, then use Try again after resolving the cause. Clearing the error only deletes its Repair and saved report.

## Panel address unreachable

**What it means:** Controls remain available through the live connection, but HTTP operations lack a verified reachable address.

**Why it happens:** The stored address stopped answering; automatic recovery had no usable candidate or could not verify one.

**How to fix it:** Restore panel network/HTTP reachability, or add the same panel at its current address; do not bypass the identity check.

## Panel address unverified

**What it means:** Controls remain available through the live connection, but HTTP operations lack a verified reachable address.

**Why it happens:** The stored address stopped answering; automatic recovery had no usable candidate or could not verify one.

**How to fix it:** Restore panel network/HTTP reachability, or add the same panel at its current address; do not bypass the identity check.

## Panel identity mismatch

**What it means:** Panel status and controls are refused at an endpoint with a different identity.

**Why it happens:** An address now answers as another installation, or saved identity evidence cannot safely be reconciled.

**How to fix it:** Check physical panel and address; re-add current known panel if moved. Never approve a different identity solely because it uses the old address.

## Panel link shared

**What it means:** A reinstalled panel cannot be assigned to one existing setup safely.

**Why it happens:** Multiple entries recorded the same legacy device link; address reachability itself is not the fault.

**How to fix it:** Keep live sibling panels; remove only unused entries or add the reinstalled panel separately.

## Panel identity confirmation

**What it means:** Existing panel setups wait for your confirmation after the panels report new device identities.

**Why it happens:** Panel Assistant could not prove automatically that each new identity belongs to its previous setup.

**How to fix it:** Review every panel name and address in the list. Select Submit only if every listed panel belongs to its existing setup. Opening the dialog changes nothing.

## Installer failure: ADB authorization

**What it means:** The failed update cannot continue until this panel allows Home Assistant.

**Why it happens:** ADB trust approval is still required; the failed update report remains available.

**How to fix it:** Choose Allow updates in the Repair and Submit, then tick Always allow from this computer and tap Allow on the named panel. Return to the Repair and use Try again for the failed update.

## Adb update authorization

**What it means:** Home Assistant cannot use ADB to update this panel until the panel permits it.

**Why it happens:** The update route requires explicit trust approval on the panel.

**How to fix it:** Open the Repair and Submit, then on the named panel tick Always allow from this computer and tap Allow. Android may call Home Assistant a computer; the flow continues after approval.

## Another Home Assistant

**What it means:** Adding the panel here does not change its saved server or account.

**Why it happens:** The panel’s saved Home Assistant address identifies a different server from this one.

**How to fix it:** If you intend this panel to connect here, follow its Repair link to Configure, enter this Home Assistant address, save, then reconnect and sign in as the account you want the panel to use. If it belongs on the other server, leave its settings alone and ignore this Repair. If the sidebar cannot reach it, open Configure directly on the panel’s network.
