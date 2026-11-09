---
title: Development environment
description: The toolchain that builds the panel app, the Docker and devcontainer routes, and what a fork needs to know about signing.
---

You do not need to build ha-paneld to use it: installing a panel fetches a signed release. This page is for contributors and anyone maintaining a fork. For a guided tour of the source, see the [code tour on DeepWiki](https://deepwiki.com/panel-assistant/android).

## Toolchain

The panel app is an Android app written in Kotlin and built with Gradle. It needs **JDK 17** and an Android SDK with **platform 37.0, Build-Tools 36.0.0, NDK 27.0.12077973 and CMake 3.22.1** (CMake and the NDK build the native LED driver). The Gradle wrapper pins the Gradle version, and dependency versions live in [`gradle/libs.versions.toml`](https://github.com/panel-assistant/android/blob/main/gradle/libs.versions.toml).

With that toolchain installed locally:

```sh
./gradlew :app:assembleDebug      # debug APK -> app/build/outputs/apk/debug/
./gradlew :app:assembleRelease    # release APK (unsigned unless signing configured)
```

## Docker

If you would rather not install anything but Docker, [`tools/build/`](https://github.com/panel-assistant/android/tree/main/tools/build) builds a version-pinned image with the same toolchain and runs Gradle inside it. The APK lands in your working tree, the image is cached after the first build, and Gradle caches persist in a named Docker volume.

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

If you run the script from inside a container that talks to an outer Docker daemon, read the `HOST_WORKDIR` note in `build.sh`.

## Devcontainer

[`.devcontainer/`](https://github.com/panel-assistant/android/tree/main/.devcontainer) pins the same Android toolchain for VS Code, so the SDK and NDK never touch your own machine. Open the repository in VS Code, choose **Reopen in Container**, then run the Gradle commands above. The devcontainer's JDK is newer than JDK 17, so treat a JDK 17 build as the authority on Java-version behaviour.

## The root helper

Gradle builds and verifies both ABI-specific root helpers automatically before building the app. The app and helpers embed the same identity, derived from every helper source file, header and command definition, so a local app build cannot silently depend on stale privileged code.

## Measuring dashboard performance from a computer

The panel's own status page covers performance for everyday use; see [Performance](/manage/performance/). For a recorded comparison of a dashboard with and without the entity filter, measured from outside the panel, the repository has a collector script.

If the unfiltered dashboard overloads its own WebView, the in-page figures may stop changing. A collector script run from a computer polls the panel app's own performance interface instead, which belongs to the deprecated REST API (see the [control reference](/reference/api/#the-rest-api-is-deprecated)), so whole-panel CPU stays observable and, where root or the helper is available, so does a native probe of the Chromium renderer thread. It also records how old the last batch of browser measurements is; anything over 15 seconds is reported as stalled rather than treated as current.

The collector does not change your configuration. It never turns the entity filter on or off or rewrites it; its first request may create one private installation key in the panel app's internal state. Select the same dashboard view and workload for both runs, change the filter on the panel's web interface, wait for the dashboard to reload, then run one command from a checkout of the [ha-paneld repository](https://github.com/panel-assistant/android) for each state:

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Compare the two results:

```bash
python3 tools/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Each run defaults to three minutes, with a 30-second warm-up and polling every 10 seconds. `--pair-with` reuses an opaque comparison ID from the first result, so the comparison can reject a different physical panel, a different configured Home Assistant or dashboard, or a changed setting that affects the measurement, without recording those private values. It cannot detect a different view chosen by hand within the same dashboard, so keep the visible view and workload the same.

The collector rejects a run if the expected mode is not active, the filter revision or renderer generation changes, the build or configuration changes during collection, filtering falls back, or it keeps fewer than three samples, fewer than three whole-panel CPU samples or fewer than three native renderer CPU samples. It still writes the rejected result with the exact reasons, and it never overwrites an existing output file.

The JSON leaves out the panel's URL and ID, the Home Assistant URL and dashboard path, entity IDs, process names and the filter hash. The panel computes the opaque fingerprints with a private random 256-bit installation key that never leaves it, and the fingerprints are unique to one comparison pair, so separate measurements cannot be linked through them or used to guess a panel's name. A panel that cannot store the key refuses the measurement. The unfiltered entity count is the last synchronised count from the catalogue, not a live count recovered from the overloaded WebView, and is reported as unavailable when the catalogue is empty. Network and browser traffic counters are normalised to the intervals actually observed, so a missed poll cannot skew the comparison. Browser timing and traffic rates are left out of the summaries when stale, while CPU, memory, network and renderer figures from the panel app itself keep being collected.

## Signing

You do not need to configure signing to build and run ha-paneld. A checkout without signing configuration uses the committed `debug.keystore` for debug builds. If `keystore.properties` supplies signing configuration, debug builds use that key instead. Official releases are signed with the project's private release key, which is never in the repository.

Android refuses to update an installed app with an APK signed by a different key. Moving a panel between an official release, your own release key and a debug build therefore means uninstalling first. Before you do, make a full encrypted `.hpb` backup from **Install → Backup** and check the file was saved; uninstalling otherwise removes profiles, learned state and history. Panel Assistant makes the panel app a device admin, and Android refuses to uninstall a device admin, so release it first. Either remove the app with the panel's **Remove Panel Assistant from this panel** option (**Remove from this panel** in the unreleased 1.0.0-rc2 version), under **Configure** in Home Assistant, or release the device admin and uninstall over ADB:

```sh
adb shell am broadcast --include-stopped-packages -n io.panelassistant.android/io.panelassistant.android.platform.ReleaseDeviceAdminReceiver
adb shell pm uninstall io.panelassistant.android
```

If `pm uninstall` still answers `DELETE_FAILED_DEVICE_POLICY_MANAGER`, wait a second and run it again. Install the other build, then restore the backup from **Install → Restore**. See [Updates and recovery](/manage/updates-and-recovery/).

To sign your own builds consistently, copy [`keystore.properties.example`](https://github.com/panel-assistant/android/blob/main/keystore.properties.example) to `keystore.properties` and fill it in; with the file present, `assembleRelease` is release-signed. A fork that publishes tagged releases through GitHub Actions supplies the same key as repository secrets instead.

```sh
keytool -genkeypair -storetype PKCS12 -keystore release.jks -alias ha-paneld \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ha-paneld"
```

:::danger
Never commit `keystore.properties` or the `.jks` file (both are gitignored). Back up the keystore and its password: lose them and you can never publish an in-place update to your own builds again.
:::
