---
title: Install ha-paneld
description: Sideloading ha-paneld onto a prepared Android wall panel.
---

ha-paneld is not on Google Play, so it has to be installed onto the panel rather than downloaded on it.

The route most people want is the [custom integration](/home-assistant/custom-integration/): add the panel in Home Assistant and it installs ha-paneld over the network for you. The rest of this page is the manual alternative, which is also what to use when the integration cannot reach a panel.

Work through [Prepare the panel](/install/prepare-a-panel/) first. Both routes need network ADB reachable on the panel.

## By hand, from a computer

The documented route is a single command run against the panel's address. Replace the example address with your own.

```sh
curl -fsSL https://raw.githubusercontent.com/maxlyth/ha-paneld/main/scripts/install.sh | bash -s -- --provision 192.168.1.50:5555
```

That downloads the latest signed stable release and provisions the panel with it. Adding `--id` and `--mqtt` sets the panel's identity and broker at install time rather than afterwards, which is what you want when setting up more than one.

To follow release candidates as well as stable builds, put `--prerelease` before `--provision`. A newer stable release still takes precedence.

The full set of options, including exporting and restoring a panel's configuration, unattended provisioning and updating several panels in one run, is documented in [provisioning](https://github.com/maxlyth/ha-paneld/blob/main/docs/provisioning.md).

:::caution
Run the installer from Git Bash or WSL on Windows. PowerShell is not supported.
:::

## From the panel itself

The project publishes its own F-Droid repository, which lets a panel install and update ha-paneld without a computer. Setting that up is covered in the [F-Droid documentation](https://github.com/maxlyth/ha-paneld/blob/main/docs/fdroid.md). Stable releases go to that channel; release candidates do not.

## Building it yourself

The app is free and open source, and the repository documents [building](https://github.com/maxlyth/ha-paneld/blob/main/docs/building.md) and [local builds](https://github.com/maxlyth/ha-paneld/blob/main/docs/local-builds.md). A locally built APK is signed with your own key rather than the project's, which changes what the installer will do with the root helper, so read the provisioning notes before sending one to a panel that is rooted.

## After it is installed

The panel serves its own interface on port 8888. That is where you point it at a dashboard and check its health. Continue with [Connect a panel](/home-assistant/connect-a-panel/).
