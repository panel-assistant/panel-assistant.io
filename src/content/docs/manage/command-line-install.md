---
title: Command-line install
description: The installer script for people who prefer a terminal, and the routes that do not go through Home Assistant.
---

Nothing on this page is needed to use Panel Assistant. Adding a panel from [Home Assistant](/install/installing-ha-paneld/) is the normal route. This page is for people who prefer a terminal, or who want to build the panel app themselves.

## The installer script

The script runs on a computer on the same network as the panel, with `adb` and `curl` available. Replace the example address with your panel's.

```sh
curl -fsSL https://raw.githubusercontent.com/panel-assistant/android/main/scripts/install.sh | bash -s -- --provision 192.168.1.50:5555
```

That downloads the latest signed stable release and installs it on the panel. It is also an update route: run it again and it fetches the current release and installs it over the top, leaving the panel's setup in place. To follow release candidates as well as stable builds, put `--prerelease` before `--provision`; a newer stable release still wins.

In more detail, the installer downloads and authenticates the matching signed release and provisioner, connects to the panel, installs the root helper built for the panel's ABI where the firmware allows it, installs the app, grants the Android permissions it needs, starts the panel app and finishes with a self-check. The running app then reports any guidance that follows from the panel's hardware profile and its live state.

Running it is safe to repeat. If a step is interrupted or fails, fix the problem and run the same command again. Optional or manual recommendations stay visible without turning a successful installation into a failure. What the installer protects, and when it stops, is described in [install safety](/manage/install-safety/).

:::caution
On Windows, run it from Git Bash (part of [Git for Windows](https://gitforwindows.org/)) or WSL, with `adb` on your `PATH` (`winget install Google.PlatformTools`). PowerShell is not supported. macOS and Linux run the commands as written.
:::

### Set the panel identity and connections

Add options after the address. This example sets a panel ID and the broker the panel uses to reach Home Assistant:

```sh
curl -fsSL https://raw.githubusercontent.com/panel-assistant/android/main/scripts/install.sh | bash -s -- --provision 192.168.1.50:5555 --id living_room --mqtt tcp://192.168.1.10:1883
```

Common options include `--force`, `--builtin`, `--ha-url`, `--ha-token-file`, `--ha-user`, `--ha-pass-file`, `--home-dashboard` and `--entity-filter`. Run the installer with `--help` for usage and the advanced entry points. A checkout of the repository also has the complete `scripts/provision.sh --help` reference.

### Keep credentials out of the command line

Pass credentials in owner-only files, so they do not appear in shell history or in the command lines of child processes. Each file must hold one credential on one line. A trailing line ending is accepted, but line breaks inside the value are rejected.

Create a Home Assistant password file without echoing the password:

```sh
umask 077
read -rsp "Home Assistant password: " HA_PASSWORD; echo
printf '%s' "$HA_PASSWORD" > ha-password.txt
unset HA_PASSWORD
```

Use `--ha-pass-file ha-password.txt`, `--ha-token-file ha-token.txt` or `--mqtt-pass-file mqtt-password.txt`, then delete the file once the install finishes. The `--ha-pass`, `--ha-token` and `--mqtt-pass` options take the value directly, but it is then visible in the shell command and the process list, so do not use them on a shared computer.

These files protect the credential on the computer running the installer. They do not encrypt the panel's management API: the panel uses `http://<panel>:8888` on a trusted network, so broker credentials and Home Assistant tokens cross that connection as unencrypted HTTP. Install only from a trusted, segmented network. The Home Assistant password goes from your computer to Home Assistant and never to the panel; use an `https://` Home Assistant URL so the login is encrypted in transit.

### Check or export an existing installation

These operations only read from the panel and do not download or install anything:

```sh
# Export secret-inclusive settings.
curl -fsSL https://raw.githubusercontent.com/panel-assistant/android/main/scripts/install.sh | bash -s -- --provision 192.168.1.50:5555 --export panel-config.json

# Check the existing installation without changing it.
curl -fsSL https://raw.githubusercontent.com/panel-assistant/android/main/scripts/install.sh | bash -s -- --provision 192.168.1.50:5555 --verify
```

Protect an exported configuration like a credential. It contains settings and secrets, but it is not a complete backup of the panel. The difference between configuration exports, full `.hpb` backups and the automatic database copies is described in [install safety](/manage/install-safety/#backups-and-recovery).

### Set up the built-in renderer

The easiest way is the **Configure** page on the panel's web interface at port 8888. Under **Home Assistant connection**, enter the Home Assistant URL and choose **Browser sign-in**, open the short-lived link in an administrator's browser and sign in, then select **Built-in renderer** in the Dashboard card. A long-lived access token is also accepted for automated setups, but the normal interactive route does not need one.

The [built-in renderer](/manage/built-in-renderer/) needs Home Assistant 2026.4.2 or newer and a compatible, current Android System WebView; see its [requirements](/manage/built-in-renderer/#requirements-and-compatibility).

For an unattended install, `--builtin` selects the renderer and signs in to Home Assistant from your computer, so nothing is typed on the panel:

```sh
# Username/password: the login happens here and mints a revocable refresh token.
curl -fsSL https://raw.githubusercontent.com/panel-assistant/android/main/scripts/install.sh | \
  bash -s -- --provision 192.168.1.50:5555 --builtin \
  --ha-url https://homeassistant.example.com --ha-user your-user --ha-pass-file ha-password.txt

# Or use a long-lived access token instead of a login.
curl -fsSL https://raw.githubusercontent.com/panel-assistant/android/main/scripts/install.sh | \
  bash -s -- --provision 192.168.1.50:5555 --builtin \
  --ha-url https://homeassistant.example.com --ha-token-file ha-token.txt
```

For an interactive installation, leave out `--builtin` and the Home Assistant credentials. The installer prints the address of the step the panel is waiting for, usually `http://<panel>:8888/setup`. Continue there from a computer or phone, or tap **Set up** on the panel; both follow the same guided setup.

To use a separate dashboard app instead, select it as the Dashboard app on the Configure tab. The built-in renderer does not provide Assist voice control or notifications, so keep a separate app where those matter.

### Choose the dashboard and entity filter

An unattended install cannot ask the guided setup's questions. By default the panel opens the Home Assistant account's default dashboard, which on a large account is often the slowest one available and can take an older panel a long time to draw. `--home-dashboard` and `--entity-filter` answer both questions before the first render:

```sh
curl -fsSL https://raw.githubusercontent.com/panel-assistant/android/main/scripts/install.sh | \
  bash -s -- --provision 192.168.1.50:5555 --builtin \
  --ha-url https://homeassistant.example.com --ha-user your-user --ha-pass-file ha-password.txt \
  --home-dashboard /panel-dashboard/living-room --entity-filter on
```

`--home-dashboard` accepts a dashboard, a specific dashboard tab such as `/panel-dashboard/living-room`, or `auto` to follow the account default. `--entity-filter` accepts `on` or `off`. Turning it on limits Home Assistant's state stream to the entities the dashboard uses, which can make the biggest difference on an older panel; see [performance](/manage/performance/). Both options apply to the built-in renderer, so they need `--builtin` in the same command or a panel already using it.

Either option also answers the matching question in guided setup. A later change on the panel wins, and an option given on the command line wins over a `--restore` bundle in the same command. If Home Assistant does not currently list the named dashboard, the installer saves it anyway and tells you, so a panel can be installed before its dashboard exists. A path Home Assistant could never resolve is rejected, and guided setup still asks.

### Start a panel over

`--reset-config` erases the panel app's data and starts guided setup as a genuine first run:

```sh
curl -fsSL https://raw.githubusercontent.com/panel-assistant/android/main/scripts/install.sh | bash -s -- --provision 192.168.1.50:5555 --reset-config
```

:::danger
**Reset is irreversible and makes no backup.** If you might need the fullest recovery, stop and make a backup first from **Install**, then **Backup**, on the panel's web interface, and check that the downloaded `.hpb` is not empty. Run `--export FILE` as a separate command first only if a settings-only export is enough.
:::

Reset removes settings, learned entity data, the proximity and ambient histories and the revision history kept on the panel. It does not remove the app, the root helper or any other app on the panel. The command asks you to type `RESET`, and `--force` does not skip that. Set `HAPANELD_RESET_CONFIRM=RESET` only when an unattended reset is deliberate. Reset panels one at a time; updates across several panels refuse `--reset-config`.

The `--restore FILE` and `--restore-fleet FILE` options import a configuration JSON export and need Python 3 on the computer running the installer. They do not accept an `.hpb` backup; restore one of those through **Install**, then **Restore**, on the panel's web interface.

### Share settings between panels

When several panels should share the same portable settings, first export a panel that is already configured:

```sh
curl -fsSL https://raw.githubusercontent.com/panel-assistant/android/main/scripts/install.sh | bash -s -- --provision 192.168.1.50:5555 --export shared-config.json
```

The export contains secrets, so store it like a credential. On each target panel, restore the portable settings and give that panel's identity and credentials explicitly:

```sh
curl -fsSL https://raw.githubusercontent.com/panel-assistant/android/main/scripts/install.sh | \
  bash -s -- --provision 192.168.1.51:5555 \
  --id living_room --restore-fleet shared-config.json \
  --mqtt tcp://192.168.1.10:1883 --mqtt-user ha-paneld --mqtt-pass-file mqtt-password.txt \
  --builtin --ha-url https://homeassistant.example.com --ha-token-file ha-token.txt
```

Repeat the command for each panel, changing its address and `--id`. Add `--prerelease` before `--provision` when the panels should follow the newest published release, including a current release candidate.

`--restore-fleet` applies only **portable settings that are not secret**. It leaves the panel ID, other settings specific to the device and every credential unchanged. If the panel's entities do not reach Home Assistant after a restore like this and the panel reports `auth-failed`, check that `--mqtt-user` and `--mqtt-pass-file` were given; that result does not by itself mean the broker is down.

### Update several panels at once

Updating several panels in one run needs a checkout of the [ha-paneld repository](https://github.com/panel-assistant/android). From the repository root, run [`scripts/update-fleet.sh`](https://github.com/panel-assistant/android/blob/main/scripts/update-fleet.sh) with the panels' addresses. The script downloads the release once, authenticates the app before any panel is touched, then installs, launches and verifies each panel:

```sh
scripts/update-fleet.sh --latest -- 192.168.1.10 192.168.1.11:5555

# At most four panels run at once by default. Set a smaller bounded pool when required.
scripts/update-fleet.sh --jobs 2 --latest -- 192.168.1.10 192.168.1.11:5555

# Follow the newest published release, whether stable or a release candidate.
scripts/update-fleet.sh --prerelease -- 192.168.1.10 192.168.1.11:5555

# A host list can also come from standard input.
printf '%s\n' 192.168.1.10 192.168.1.11 | scripts/update-fleet.sh --latest
```

Four panels are updated at once by default. `--jobs` sets any number from 1 to 32, and the `HAPANELD_FLEET_JOBS` environment variable sets the default when `--jobs` is not given; the option wins over the variable.

Each panel's guidance is printed, but hardware profile recommendations are never accepted automatically. Options that describe a single panel are refused before any panel is touched: run `--reset-config`, `--export FILE`, `--id` and the device-specific `--restore FILE` through `scripts/provision.sh` one panel at a time. `--restore-fleet FILE` is the supported way to apply portable settings to several panels.

This needs Android SDK Build-Tools with `apksigner` and either `aapt` or `aapt2`. The script checks the app before starting, and each panel's installer checks it again before changing that panel. The signer rules and the other safeguards are in [install safety](/manage/install-safety/#updating-several-panels).

### Getting ADB onto the network

On some Tuya TPA10 and Smatek panels, ADB at first works only over USB. Connect the USB cable and turn on network ADB before running the normal install command:

```sh
adb devices                   # accept the on-screen RSA prompt if shown
adb root                      # if this firmware supports it
adb tcpip 5555                # expose adb on the network; this resets on reboot
adb connect 192.168.1.50:5555 # replace this address with the panel's address
```

If a panel has no ADB but does have a browser or file manager, download the [release app](https://github.com/panel-assistant/android/releases/latest), allow installation from that browser or file manager, and tap the file. Grant the required permissions by hand in Android's Settings, then follow the panel app's setup screen. This does not work on a locked-down panel with no browser or file manager. The [hardware pages](/hardware/) cover each supported model.

### Android permissions

| Permission                | Used for                            | Grant during install                                   |
| ------------------------- | ----------------------------------- | ------------------------------------------------------ |
| `POST_NOTIFICATIONS`      | The foreground service notification | Runtime permission or `pm grant`                       |
| `WRITE_SETTINGS`          | Screen brightness                   | `appops set <pkg> WRITE_SETTINGS allow`                |
| `SYSTEM_ALERT_WINDOW`     | The software navigation bar         | `appops set <pkg> SYSTEM_ALERT_WINDOW allow`           |
| Accessibility key capture | Hardware button events              | `settings put secure enabled_accessibility_services …` |

Turning the screen off does not use Android's device administrator. Depending on the active hardware profile, the panel powers off the physical backlight, sends Android's sleep and wake key events, or falls back to brightness zero. That route decides whether root, the authenticated helper or standard Android access is needed.

### Access routes and security mode

Hardware profile recommendations are report-only. Choosing a profile is not consent to disable packages, persist ADB, install privileged software or change display settings. Packages you have already tamed on the [vendor packages](/manage/vendor-packages/) card are still tamed again at every boot.

On a genuinely unrooted panel whose profile names a specific supported use for it, the panel app can fall back to [Shizuku](https://shizuku.rikka.app/), a separate open-source app whose service runs with Android's shell identity. Shell is not root, so anything that needs root still fails closed. `provision.sh --shizuku` installs a checksum-verified copy and starts the service, but the permission can only be approved at the panel, in **Configure**, the toolbar's overflow menu, **Enhanced access**, then **Enable**, and it is never exported or restored. A service started over ADB normally has to be started again after a reboot. Do not set it up on a panel that already has working `su` or the root helper.

[Hardened security mode](/manage/security-mode/) requires someone at the panel to approve selected high-impact remote actions. It can only be turned on at the panel, and the installer never copies it. Network ADB cannot be used while it is on, so return the panel to Relaxed mode at the panel before installing or updating over ADB.

## Without a computer

The project used to publish an F-Droid repository so a panel could update itself. It is retired: it installed the app but could not set a panel up, and Home Assistant now does both. Add the panel to Home Assistant and use its update entity, described in [updates and recovery](/manage/updates-and-recovery/).

## Building it yourself

The app is free and open source, and the [development environment](/reference/development-environment/) page describes building it. A locally built app is signed with your own key rather than the project's, which changes what the installer will do on a rooted panel, so read the notes below before sending one to a panel you depend on.

Installing a local build needs a checkout of the repository. Build the app from the repository root, then give it to the provisioner:

```sh
./gradlew :app:assembleDebug
scripts/provision.sh <panel-ip:5555> \
  --apk app/build/outputs/apk/debug/app-debug.apk \
  --allow-unsigned-helper
```

`--allow-unsigned-helper` acknowledges that the helper embedded in a local build is controlled by whoever built it, rather than authenticated as a published release. It is required whenever a local build goes to a panel with a usable root or helper route, including the first helper installation. A genuinely unrooted panel skips the helper. Official `--latest` and `--prerelease` installs authenticate the release helper automatically and do not use this flag.

Android SDK Build-Tools with `apksigner` are needed to update a panel that already has the panel app, whatever the source of the new build, because the installer compares the installed and new signers before changing anything. A first installation on a panel without the app does not need them. Installing a local build with `--apk` also needs `aapt` or `aapt2`. Before any backup or change, the installer checks the package and that it has exactly one valid signer. A self-built app may use the builder's own consistent signing key. Add `--require-release-signer` only when the local file should carry the official release certificate.

The installer's plan reports when the drivers chosen for a panel need the helper. Many RK3576 and PX30 panels can run `su` from inside the app, while rooted panels that sandbox root use the helper for privileged operations. A genuinely unrooted panel carries on with standard Android capabilities, unless its profile declares a separately documented alternative for one specific feature.
