---
title: Command-line install
description: The installer script for people who prefer a terminal, and the routes that do not go through Home Assistant.
---

Nothing on this page is needed to use Panel Assistant. Adding a panel from [Home Assistant](/install/installing-ha-paneld/) is the normal route. This page is for people who prefer a terminal, or who want to build the panel app themselves.

## The installer script

The script runs on a computer on the same network as the panel, with `adb` and `curl` available. Replace the example address with your panel's.

```sh
curl -fsSL https://raw.githubusercontent.com/maxlyth/ha-paneld/main/scripts/install.sh | bash -s -- --provision 192.168.1.50:5555
```

That downloads the latest signed stable release and installs it on the panel. It is also the update route today: run it again and it fetches the current release and installs it over the top, leaving the panel's setup in place. To follow release candidates as well as stable builds, put `--prerelease` before `--provision`.

The full set of options, including exporting and restoring a panel's configuration and updating several panels in one run, is in [provisioning](https://github.com/maxlyth/ha-paneld/blob/main/docs/provisioning.md).

:::caution
On Windows, run it from Git Bash or WSL. PowerShell is not supported.
:::

## From the panel itself

The project publishes its own F-Droid repository, which lets a panel that already runs the app install updates without a computer. Setting that up is covered in the [F-Droid documentation](https://github.com/maxlyth/ha-paneld/blob/main/docs/fdroid.md). Stable releases go to that channel; release candidates do not.

## Building it yourself

The app is free and open source, and the repository documents [building](https://github.com/maxlyth/ha-paneld/blob/main/docs/building.md) and [local builds](https://github.com/maxlyth/ha-paneld/blob/main/docs/local-builds.md). A locally built app is signed with your own key rather than the project's, which changes what the installer will do on a rooted panel, so read the provisioning notes before sending one to a panel you depend on.
