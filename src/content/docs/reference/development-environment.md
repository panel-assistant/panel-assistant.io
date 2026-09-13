---
title: Development environment
description: The toolchain that builds the panel app, the Docker and devcontainer routes, and what a fork needs to know about signing.
---

You do not need to build ha-paneld to use it: installing a panel fetches a signed release. This page is for contributors and anyone maintaining a fork. For a guided tour of the source, see the [code tour on DeepWiki](https://deepwiki.com/maxlyth/ha-paneld).

## Toolchain

The panel app is an Android app written in Kotlin and built with Gradle. It needs **JDK 17** and an Android SDK with **platform 37.0, Build-Tools 36.0.0, NDK 27.0.12077973 and CMake 3.22.1** (CMake and the NDK build the native LED driver). The Gradle wrapper pins the Gradle version, and dependency versions live in [`gradle/libs.versions.toml`](https://github.com/maxlyth/ha-paneld/blob/main/gradle/libs.versions.toml).

With that toolchain installed locally:

```sh
./gradlew :app:assembleDebug      # debug APK -> app/build/outputs/apk/debug/
./gradlew :app:assembleRelease    # release APK (unsigned unless signing configured)
```

## Docker

If you would rather not install anything but Docker, [`tools/build/`](https://github.com/maxlyth/ha-paneld/tree/main/tools/build) builds a version-pinned image with the same toolchain and runs Gradle inside it. The APK lands in your working tree, the image is cached after the first build, and Gradle caches persist in a named Docker volume.

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

If you run the script from inside a container that talks to an outer Docker daemon, read the `HOST_WORKDIR` note in `build.sh`.

## Devcontainer

[`.devcontainer/`](https://github.com/maxlyth/ha-paneld/tree/main/.devcontainer) pins the same Android toolchain for VS Code, so the SDK and NDK never touch your own machine. Open the repository in VS Code, choose **Reopen in Container**, then run the Gradle commands above. The devcontainer's JDK is newer than JDK 17, so treat a JDK 17 build as the authority on Java-version behaviour.

## The root helper

When you install a local build on a rooted panel, run [`helper/build.sh`](https://github.com/maxlyth/ha-paneld/blob/main/helper/build.sh) first. The app and both ABI-specific helpers embed the same identity, derived from every helper source file, header and command definition. The installer verifies that identity before replacing the APK, so a local app build cannot silently depend on stale privileged code.

## Signing

You do not need to configure signing to build and run ha-paneld. Debug builds use the committed `debug.keystore` and install directly. Official releases are signed with the project's private release key, which is never in the repository.

Android refuses to update an installed app with an APK signed by a different key. Moving a panel between an official release, your own release key and a debug build therefore means uninstalling first. Before you do, make a full encrypted `.hpb` backup from **Install → Backup** and check the file was saved; uninstalling otherwise removes profiles, learned state and history. Install the other build, then restore the backup from **Install → Restore**. See [Updates and recovery](/manage/updates-and-recovery/).

To sign your own builds consistently, copy [`keystore.properties.example`](https://github.com/maxlyth/ha-paneld/blob/main/keystore.properties.example) to `keystore.properties` and fill it in; with the file present, `assembleRelease` is release-signed. A fork that publishes tagged releases through GitHub Actions supplies the same key as repository secrets instead.

```sh
keytool -genkeypair -storetype PKCS12 -keystore release.jks -alias ha-paneld \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ha-paneld"
```

:::danger
Never commit `keystore.properties` or the `.jks` file (both are gitignored). Back up the keystore and its password: lose them and you can never publish an in-place update to your own builds again.
:::
