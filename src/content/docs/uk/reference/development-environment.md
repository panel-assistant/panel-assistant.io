---
title: Середовище розробки
description: Інструменти збирання застосунку панелі, способи через Docker і devcontainer та відомості про підписування для форків.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Для використання ha-paneld не потрібно його збирати: встановлення панелі завантажує підписаний випуск. Ця сторінка призначена для учасників розробки та тих, хто підтримує форк. Огляд вихідного коду див. в [огляді коду на DeepWiki](https://deepwiki.com/panel-assistant/android).

## Інструменти

Застосунок панелі — це Android-застосунок, написаний на Kotlin і зібраний Gradle. Йому потрібні **JDK 17** та Android SDK із **platform 37.0, Build-Tools 36.0.0, NDK 27.0.12077973 і CMake 3.22.1** (CMake і NDK збирають нативний драйвер світлодіода). Gradle wrapper фіксує версію Gradle, а версії залежностей містяться в [`gradle/libs.versions.toml`](https://github.com/panel-assistant/android/blob/main/gradle/libs.versions.toml).

Коли ці інструменти встановлено локально:

```sh
./gradlew :app:assembleDebug      # debug APK -> app/build/outputs/apk/debug/
./gradlew :app:assembleRelease    # release APK (unsigned unless signing configured)
```

## Docker

Якщо ви не хочете встановлювати нічого, крім Docker, [`tools/build/`](https://github.com/panel-assistant/android/tree/main/tools/build) збирає образ із зафіксованими версіями тих самих інструментів і запускає в ньому Gradle. APK потрапляє у ваше робоче дерево, образ кешується після першого збирання, а кеші Gradle зберігаються в іменованому томі Docker.

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

Якщо ви запускаєте скрипт усередині контейнера, що звертається до зовнішнього демона Docker, прочитайте примітку `HOST_WORKDIR` у `build.sh`.

## Devcontainer

[`.devcontainer/`](https://github.com/panel-assistant/android/tree/main/.devcontainer) фіксує ті самі інструменти Android для VS Code, тому SDK і NDK не потрапляють на вашу машину. Відкрийте репозиторій у VS Code, виберіть **Reopen in Container**, а потім виконайте наведені вище команди Gradle. JDK у devcontainer новіший за JDK 17, тому щодо поведінки версії Java вважайте збірку на JDK 17 авторитетною.

## Root-помічник

Gradle автоматично збирає й перевіряє обидва root-помічники для відповідних ABI перед збиранням застосунку. Застосунок і помічники містять однаковий ідентифікатор, отриманий із кожного вихідного файла, заголовка й визначення команд помічника, тому локальна збірка застосунку не може непомітно залежати від застарілого привілейованого коду.

## Підписування

Для збирання й запуску ha-paneld не потрібно налаштовувати підписування. Копія репозиторію без налаштувань підписування використовує збережений у репозиторії `debug.keystore` для налагоджувальних збірок. Якщо `keystore.properties` задає налаштування підписування, налагоджувальні збірки використовують той ключ. Офіційні випуски підписуються приватним ключем випуску проєкту, якого ніколи немає в репозиторії.

Android відмовляється оновлювати встановлений застосунок APK-файлом, підписаним іншим ключем. Тому перехід панелі між офіційним випуском, вашим ключем випуску та налагоджувальною збіркою потребує попереднього видалення. Перед цим створіть повну зашифровану резервну копію `.hpb` через **Встановлення → Резервна копія** та перевірте, що файл збережено; інакше видалення забере профілі, вивчений стан та історію. Panel Assistant робить застосунок панелі адміністратором пристрою, а Android відмовляється видаляти адміністратора пристрою, тому спочатку звільніть його від цієї ролі. Або видаліть застосунок через пункт **Видалити з цієї панелі** у розділі **Налаштувати** в Home Assistant, або звільніть адміністратора пристрою й видаліть через ADB:

```sh
adb shell am broadcast --include-stopped-packages -n io.panelassistant.android/io.panelassistant.android.platform.ReleaseDeviceAdminReceiver
adb shell pm uninstall io.panelassistant.android
```

Якщо `pm uninstall` усе ще відповідає `DELETE_FAILED_DEVICE_POLICY_MANAGER`, зачекайте секунду й виконайте ще раз. Встановіть іншу збірку, а потім відновіть копію через **Встановлення → Відновлення**. Див. [Оновлення та відновлення](/uk/manage/updates-and-recovery/).

Щоб стабільно підписувати власні збірки, скопіюйте [`keystore.properties.example`](https://github.com/panel-assistant/android/blob/main/keystore.properties.example) до `keystore.properties` і заповніть його; за наявності цього файла `assembleRelease` підписується ключем випуску. Форк, що публікує теговані випуски через GitHub Actions, натомість надає той самий ключ як секрети репозиторію.

```sh
keytool -genkeypair -storetype PKCS12 -keystore release.jks -alias ha-paneld \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ha-paneld"
```

:::danger
Ніколи не комітьте `keystore.properties` або файл `.jks` (обидва ігноруються Git). Зробіть резервну копію сховища ключів і його пароля: якщо втратите їх, більше ніколи не зможете опублікувати оновлення власних збірок зі збереженням встановленого застосунку.
:::
