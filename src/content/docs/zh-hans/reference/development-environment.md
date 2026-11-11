---
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
title: 开发环境
description: 构建面板应用所需的工具链、Docker 和开发容器方式，以及 fork 项目需要了解的签名事项。
---

使用 ha-paneld 无需自行构建：安装面板时会获取已签名的发布版本。本页面向贡献者和维护 fork 项目的人员。源码导览请参阅 [DeepWiki 代码导览](https://deepwiki.com/panel-assistant/android)。

## 工具链

面板应用是使用 Kotlin 编写、通过 Gradle 构建的 Android 应用。需要 **JDK 17**，以及包含 **platform 37.0、Build-Tools 36.0.0、NDK 27.0.12077973 和 CMake 3.22.1** 的 Android SDK（CMake 和 NDK 用于构建原生 LED 驱动）。Gradle wrapper 固定了 Gradle 版本，依赖版本位于 [`gradle/libs.versions.toml`](https://github.com/panel-assistant/android/blob/main/gradle/libs.versions.toml)。

在本地安装该工具链后：

```sh
./gradlew :app:assembleDebug      # debug APK -> app/build/outputs/apk/debug/
./gradlew :app:assembleRelease    # release APK (unsigned unless signing configured)
```

## Docker

如果您只想安装 Docker，[`tools/build/`](https://github.com/panel-assistant/android/tree/main/tools/build) 会使用同一工具链构建版本固定的镜像，并在其中运行 Gradle。APK 会生成在工作树中，镜像在首次构建后会被缓存，Gradle 缓存保存在具名 Docker 卷中。

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

如果您在连接外部 Docker 守护进程的容器内运行脚本，请阅读 `build.sh` 中关于 `HOST_WORKDIR` 的说明。

## 开发容器

[`.devcontainer/`](https://github.com/panel-assistant/android/tree/main/.devcontainer) 为 VS Code 固定了同一套 Android 工具链，因此 SDK 和 NDK 无需安装到您自己的机器上。在 VS Code 中打开仓库，选择 **在容器中重新打开**，然后运行上面的 Gradle 命令。开发容器中的 JDK 高于 JDK 17，因此 Java 版本行为应以 JDK 17 构建为准。

## root 辅助程序

Gradle 会在构建应用之前自动构建并验证两种 ABI 对应的 root 辅助程序。应用与辅助程序嵌入相同的身份标识，该标识根据所有辅助程序源文件、头文件和命令定义生成，因此本地构建的应用不会悄然依赖过时的特权代码。

## 签名

构建和运行 ha-paneld 无需配置签名。未配置签名的检出副本使用仓库中提交的 `debug.keystore` 签署调试构建。如果 `keystore.properties` 提供签名配置，调试构建则改用该密钥。官方发布版本使用项目私有的发布密钥签名，该密钥从不存放在仓库中。

Android 拒绝使用签名密钥不同的 APK 更新已安装应用。因此，在官方发布版本、您自己的发布密钥和调试构建之间切换时，需要先卸载。在操作之前，请从 **安装 → 备份** 创建完整的加密 `.hpb` 备份，并确认文件已保存；否则卸载会删除配置文件、已学习的状态和历史记录。Panel Assistant 会将面板应用设为设备管理员，而 Android 拒绝卸载设备管理员，因此请先解除该权限。可以在 Home Assistant 的 **配置** 中，使用面板的 **从此面板移除** 选项移除应用，也可以通过 ADB 解除设备管理员权限并卸载：

```sh
adb shell am broadcast --include-stopped-packages -n io.panelassistant.android/io.panelassistant.android.platform.ReleaseDeviceAdminReceiver
adb shell pm uninstall io.panelassistant.android
```

如果 `pm uninstall` 仍返回 `DELETE_FAILED_DEVICE_POLICY_MANAGER`，请等待一秒后再运行一次。安装另一个构建版本，然后从 **安装 → 恢复** 恢复备份。参阅[更新与恢复](/zh-hans/manage/updates-and-recovery/)。

要一致地签署自己的构建，请将 [`keystore.properties.example`](https://github.com/panel-assistant/android/blob/main/keystore.properties.example) 复制为 `keystore.properties` 并填写内容；存在此文件时，`assembleRelease` 会使用发布密钥签名。通过 GitHub Actions 发布带标签版本的 fork 项目则应以仓库机密提供同一密钥。

```sh
keytool -genkeypair -storetype PKCS12 -keystore release.jks -alias ha-paneld \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ha-paneld"
```

:::danger
切勿提交 `keystore.properties` 或 `.jks` 文件（两者均已列入 gitignore）。请备份密钥库及其密码：一旦丢失，您将再也无法为自己的构建发布就地更新。
:::
