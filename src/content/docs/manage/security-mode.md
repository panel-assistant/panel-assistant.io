---
title: Security mode
description: The panel's default trusted-network behaviour, and Hardened mode, which requires someone at the panel to approve high-impact remote actions.
---

The panel's web interface, its API and its Home Assistant controls are designed for a trusted home network. **Relaxed mode** is the default: automations, installer tools and browser actions work without an extra prompt. One action is deliberately outside that rule. Turning the camera on from Home Assistant asks for approval at the panel in every mode, including Relaxed, so no remote message on its own can put a camera into service. Turning it off never asks.

For a panel on a network shared with less trusted devices, the optional **Hardened mode** adds approval in person to selected high-impact network operations. It is an extra safety boundary, not a replacement for a separate network or a firewall, and not general authentication for the API. Read-only endpoints and routine panel controls stay available under the normal trusted-network model.

**In Hardened mode, protected high-impact remote actions need physical access to the panel. They cannot go ahead until someone approves them on the panel's screen, and they cannot be approved remotely.**

The web interface marks affected actions with a small shield in both modes, so you can see which workflows cross the approval boundary before you turn Hardened mode on. Update-policy settings carry the same mark, because enabling installation or changing an active update channel can need approval; ordinary changes saved with the same button do not.

## Turn on Hardened mode

This setting can only be changed on the panel itself:

1. Open the panel app's **Configure** screen on the panel.
2. Open the toolbar's overflow menu and choose **Security mode**.
3. Choose **Enable Hardened mode**.

Network ADB and Android's wireless debugging must both be off first, because either one lets a remote ADB client inject input into the approval screen. Before committing the change, the panel app checks every supported Android property for network ADB, persistent network ADB, explicit ADB listen addresses and the state of wireless debugging. It also stops any active WebView developer tools relay on the network and verifies that its process and listener are gone. If it cannot establish that these remote-control routes are inactive, it refuses to turn Hardened mode on. Turn ADB and wireless debugging off in Android's developer options and try again. If verifying the relay fails, restart the panel before trying again.

The setting belongs to the panel alone. It is not included in configuration exports or full backups, and it cannot be changed through the API, from Home Assistant, by a restore, by importing a configuration, or by an update run across several panels. An existing panel therefore stays in Relaxed mode unless someone turns Hardened mode on at the panel.

Use the same menu to return to Relaxed mode. Doing so clears any pending approval requests.

## Approve a network request

When Hardened mode intercepts a protected request to the API, the first attempt returns HTTP `202 Accepted` with an `approval-required` response, for example:

```json
{
  "ok": false,
  "error": "approval-required",
  "approval_id": "…",
  "message": "Approve this request physically on the panel, then retry it; it cannot be approved remotely."
}
```

To complete the operation:

1. On the panel, open **Configure**, the toolbar's overflow menu, **Security mode**, then **Review approvals**.
2. Check the operation, its summary and the device that asked, then approve or deny it.
3. Within ten minutes of the original request, send the identical request again from the same device.

An approval is bound to the operation, the requesting device and the protected content of the request, and it can be used once. Changing the request, sending it from another address, waiting more than ten minutes or restarting the panel app needs a new approval. Only the matching retry consumes an approval; it is not a temporary general bypass.

Commands that come from Home Assistant carry no trustworthy identity for the sender, so their approvals are bound to the exact command rather than to whoever sent it. Keep the ability to send commands to the panel restricted to Home Assistant, as described in the [security reference](/reference/security/); Hardened mode is not a substitute for that.

Requests over loopback from software already running on the panel do not need network approval. Hardened mode treats local Android apps as trusted and does not isolate one app on the panel from another, so keep untrusted apps off the panel.

## Protected operations

In Hardened mode, a network client needs approval at the panel before it can:

- install an uploaded app, or a managed copy of the panel app, a separate dashboard app or the Android System WebView; turn on an automatic update policy; or change an update channel when that would start an update straight away;
- uninstall an app, or change whether a vendor package is enabled, running or allowed to draw over the screen;
- export a full backup, or a configuration bundle that contains secrets;
- import a configuration, restore a stored configuration revision or restore a panel backup;
- activate or roll back a hardware profile;
- play media fetched from a remote URL;
- reload the dashboard renderer or reboot the panel;
- download an app from a link, which is approved separately from installing it: the download is bound to that exact URL's SHA-256 and no connection is opened until it is approved, so installing from a link in Hardened mode asks twice;
- advance database recovery maintenance;
- repair a separate dashboard app's configuration, or clear the built-in renderer's browsing data;
- change the system display density or font scale;
- turn off the configured keep-awake or prevent-idle-dim guards that keep the panel reachable, from the Configure page or Home Assistant;
- repair the panel's power safety settings; or
- hide one exact, unchanged caution about a power safety setting that can only be fixed by hand. This changes only what is shown; the underlying assessment, the diagnostics and the installer result stay the same.

Turning on the panel's camera is approved the same way, and is the one item on this list that also applies in Relaxed mode.

A remote Configure save in Hardened mode must save a power safety reduction separately from vendor package or software installation policy changes, because those need different kinds of approval. Combined saves in Relaxed mode, or over loopback, go through directly.

Hardened mode rejects tap injection from anywhere other than loopback, so a request cannot approve itself. It also refuses to turn on network ADB, Android's wireless debugging or the WebView developer tools relay. Switch the panel back to Relaxed mode at the panel before using any of those.

The approval boundary does not make the rest of the API on port 8888 authenticated. Diagnostic and status reads and routine controls keep their normal trusted-network behaviour. Keep the panel's API away from untrusted networks even with Hardened mode on; the [security reference](/reference/security/) describes the full posture.

An automatic update setting that was already on when Hardened mode was chosen stays in force as the panel's policy, so its scheduled checks can install an authenticated update without a new prompt. A network client needs approval at the panel to turn that policy on, or to widen it with a channel change that starts an update straight away. Turning automatic updates off always goes through directly.

## Changing the Home Assistant or broker address

Hardened mode stops a saved credential from quietly following a changed address:

- changing the **broker** address without entering a password in the same save clears the previous broker password;
- changing the **Home Assistant URL** without entering new credentials in the same save clears the previous access token, refresh token and the session identity that goes with them.

Enter the credentials for the new destination in the same **Save changes**. This applies only when the address changes in Hardened mode; ordinary edits, and all edits in Relaxed mode, keep the usual rule that a blank field keeps the stored value.

## Installing official and local builds

The [command-line installer](/manage/command-line-install/) authenticates the helper binaries in official releases automatically, with no extra acknowledgement.

A locally built app is controlled by whoever built it rather than authenticated as a published release. If installing that app also needs to install the root helper embedded in it, acknowledge the locally built privileged binaries explicitly:

```sh
./helper/build.sh
scripts/provision.sh <panel-ip:5555> \
  --apk app/build/outputs/apk/debug/app-debug.apk \
  --allow-unsigned-helper
```

The flag applies only to the helper embedded in a local build. A local build needs it whenever the panel has a usable root or helper route, including the first helper installation. A panel that is genuinely unrooted skips the helper. The flag does not weaken verification of official release downloads.

Installing a local build, or updating several panels at once, also authenticates the app separately from its embedded helper. Android SDK Build-Tools must provide `apksigner` and either `aapt` or `aapt2`, and the installer requires the ha-paneld package with exactly one valid signer before an upgrade begins. A self-built app may use the builder's own consistent signing key. `--require-release-signer` additionally pins the official ha-paneld release certificate, and should be used only when that is the signer you expect; it does not turn a self-built app into an official release.
