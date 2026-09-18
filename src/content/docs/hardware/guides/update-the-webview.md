---
title: Updating the system WebView
description: Why most wall panels need a newer Android System WebView before a Home Assistant dashboard will render, and how to install one on each panel.
sidebar:
  label: Update the WebView
  order: 2
---

Read this before anything else: an outdated WebView is the most common first-run failure on these panels.

The panel app's built-in renderer relies on Android's **system WebView**, and most of these panels ship with one far too old to run a current Home Assistant frontend. Out of the box that can produce a blank or broken dashboard, missing cards, or "browser not supported". Panels **without** Google Play (Sonoff NSPanel Pro, Tuya TPA10) cannot update it through the Play Store, so install a current WebView with the method for your panel below. The **Electron WF1589T and ZHICAI SMT1019 have Google Play**, so update _Android System WebView_ from the Play Store, or use the Play WebView development channel.

The clean way is a direct adb sideload of the standard Android System WebView (package **`com.android.webview`**) matched to the panel's Android version and ABI, with no third-party app store involved.

:::tip
The package name must be `com.android.webview` for the system to select it automatically. The **SystemWebView** builds from Cromite and LineageOS use `com.android.webview` and do register as the provider, but the regular Cromite **browser** app uses a different package and does not. Use the SystemWebView build, not the browser APK.
:::

## Stock versions and known-working replacements

"Stock" is what the vendor firmware ships from the factory, verified from firmware inspection or a live device. "Replacement" is what is confirmed working after installation. Redistributable builds are mirrored as ha-paneld release assets; sideload one with `adb install -r <file>`.

| Panel                                  | ABI           | Stock (vendor firmware)                                                                                                                                                       | Replacement                                                                                                                                                                                                                                                                 | Download                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NSPanel Pro 86P (PX30)                 | arm64-v8a     | Chromium **107.0.5304.105**, verified on firmware 3.5.1; check other firmware and models before updating                                                                      | **LineageOS** 138.0.7204.63, the last build for Android **8.1**                                                                                                                                                                                                             | [release asset](https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-138.0.7204.63.apk), [APKMirror](https://www.apkmirror.com/apk/lineageos/android-system-webview-2/android-system-webview-138-0-7204-63-2-release/android-system-webview-138-0-7204-63-8-android-apk-download/download) |
| TPA10 (rk3566)                         | armeabi-v7a   | **Chrome 83** (`com.android.webview`), too old for a current Home Assistant frontend                                                                                          | **LineageOS** SystemWebView 150.0.7871.63. Vanilla Chromium, so camera streams autoplay (Cromite 147 blocks autoplay and is kept as a fallback). **Signature-locked: needs the [root swap](/hardware/panels/tuya-tpa10/#webview-update-this-first), not a plain sideload.** | [arm asset](https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk)                                                                                                                                                                                                    |
| WF1589T (rk3576)                       | arm64-v8a     | Google Play WebView, updated automatically                                                                                                                                    | Update through the Play Store; no sideload needed                                                                                                                                                                                                                           | none                                                                                                                                                                                                                                                                                                                                |
| S9E (rk3566)                           | **arm64-v8a** | **Depends on firmware, so check before replacing.** Chromium **83.0.4103.120** on the 2024-07 build (too old for a current frontend), **131.0.6778.200** on the 2025-12 build | Needed only on the older firmware: **LineageOS** 150.0.7871.63 (**arm64**). Provisional and unverified on hardware; it may be signature-locked like the TPA10. On 2025-12 firmware the stock WebView is already current                                                     | [arm64 asset](https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm64.apk)                                                                                                                                                                                                |
| SMT1019 (rk3576)                       | arm64-v8a     | `com.google.android.webview` **124.0.6367.179**, Android 14 **with** Google Play                                                                                              | **Update _Android System WebView_ from the Play Store**; no sideload needed. Do not sideload a `com.android.webview` build: a product overlay supplies this panel's provider list, so a sideloaded provider may not be selected                                             | none                                                                                                                                                                                                                                                                                                                                |
| ZX-SMT156 (RK3566_T)                   | arm64-v8a     | Google WebView **149.0.7827.164** (reporter firmware)                                                                                                                         | Already current; no replacement needed                                                                                                                                                                                                                                      | none                                                                                                                                                                                                                                                                                                                                |
| Shelly Wall Display, original (MT6580) | armeabi-v7a   | **unknown** (Android 7 base ROM)                                                                                                                                              | `com.google.android.webview` **119.0.6045.194** from the [official Shelly ZIP](https://repo.shelly.cloud/firmware/SAWD-0A1XX10EU1/stable/SAWD-0A1XX10EU1-WebViewUpdate.zip); see [the Shelly Wall Display family page](/hardware/panels/shelly/#webview)                    | none                                                                                                                                                                                                                                                                                                                                |
| Shelly Wall Display X2 (SC7731E)       | armeabi-v7a   | **unknown** (Android 8.1 base ROM)                                                                                                                                            | Not established; check `adb shell dumpsys webviewupdate`                                                                                                                                                                                                                    | none                                                                                                                                                                                                                                                                                                                                |
| Shelly Wall Display X2i (RK3326-S)     | arm64-v8a     | Chromium **131.0.6778.200** on factory firmware 2.5.4                                                                                                                         | Already current; no replacement needed                                                                                                                                                                                                                                      | none                                                                                                                                                                                                                                                                                                                                |
| Shelly Wall Display X1i, XL (arm64)    | arm64-v8a     | **unknown** (Android 11 base ROM; not in the Shelly OTA)                                                                                                                      | Not established; check `adb shell dumpsys webviewupdate`                                                                                                                                                                                                                    | none                                                                                                                                                                                                                                                                                                                                |

All mirrored builds are in the [Panel WebView mirror release](https://github.com/panel-assistant/android/releases/tag/webview-mirror), a community list of known-working versions. If you have one working on another panel or version, contributions are welcome.

:::note

- **Pick the newest WebView your panel's Android version supports.** The NSPanel Pro's Android 8.1 caps at Chromium 138, the last for Android 8 and 9; newer builds will not install. Android 10 and later (the TPA10 runs 11) runs the current LineageOS WebView, 150.
- **APKMirror's direct download links are short-lived presigned URLs that expire within the hour.** Use the page, or the durable release assets above. The mirror exists because these panels lack Play and ship years-old firmware, and a working build can otherwise take days to find.

:::

## Sideload and verify

1. Download a current **Android System WebView** APK with the package name **`com.android.webview`**. **LineageOS** System WebView is the recommended build across Android versions: 138 is the last for Android 8.1, and 150 covers Android 10 and later; both are in the mirror. It is vanilla Chromium, so it does not carry Cromite's autoplay block that stops Home Assistant camera streams. Its `com.android.webview` package means it is picked as the provider automatically, with no allowlist editing and no extra app, and it is freely redistributable. Match your panel's ABI.

   :::caution
   The plain sideload below works on panels whose ROM waives the WebView signature check, such as the NSPanel Pro's `userdebug` build. **Signature-locked panels, including the TPA10 and probably other vendor `user` builds, reject it** with `signatures do not match`. Those need a one-time root swap that replaces the system WebView file and clears its `packages.xml` entry; see [the TPA10 procedure](/hardware/panels/tuya-tpa10/#webview-update-this-first).
   :::

2. Sideload it. This needs no root:

   ```sh
   adb install -r android-system-webview.apk
   ```

   It installs to `/data/app` and supersedes the stale stock WebView.

3. Verify the active provider and version:

   ```sh
   adb shell dumpsys webviewupdate | grep "Current WebView package"
   ```

If the panel lists more than one provider, select the new one explicitly:

```sh
adb shell cmd webviewupdate set-webview-implementation com.android.webview
```

or use Developer options, _WebView implementation_.
