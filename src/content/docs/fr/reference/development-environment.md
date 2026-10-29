---
title: Environnement de développement
description: La chaîne d’outils qui compile l’application du panneau, les méthodes Docker et devcontainer, et ce qu’un fork doit savoir sur la signature.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Vous n’avez pas besoin de compiler ha-paneld pour l’utiliser : l’installation d’un panneau récupère une version signée. Cette page s’adresse aux contributeurs et aux personnes qui maintiennent un fork. Pour une visite guidée du code source, consultez la [visite du code sur DeepWiki](https://deepwiki.com/panel-assistant/android).

## Chaîne d’outils

L’application du panneau est une application Android écrite en Kotlin et compilée avec Gradle. Elle nécessite **JDK 17** et un SDK Android avec **platform 37.0, Build-Tools 36.0.0, NDK 27.0.12077973 et CMake 3.22.1** (CMake et le NDK compilent le pilote natif des LED). Le wrapper Gradle fixe la version de Gradle, et les versions des dépendances figurent dans [`gradle/libs.versions.toml`](https://github.com/panel-assistant/android/blob/main/gradle/libs.versions.toml).

Avec cette chaîne d’outils installée localement :

```sh
./gradlew :app:assembleDebug      # debug APK -> app/build/outputs/apk/debug/
./gradlew :app:assembleRelease    # release APK (unsigned unless signing configured)
```

## Docker

Si vous préférez n’installer que Docker, [`tools/build/`](https://github.com/panel-assistant/android/tree/main/tools/build) construit une image aux versions fixées avec la même chaîne d’outils et y exécute Gradle. L’APK est créé dans votre arbre de travail, l’image est mise en cache après la première compilation, et les caches Gradle persistent dans un volume Docker nommé.

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

Si vous exécutez le script depuis un conteneur qui communique avec un démon Docker externe, lisez la note sur `HOST_WORKDIR` dans `build.sh`.

## Devcontainer

[`.devcontainer/`](https://github.com/panel-assistant/android/tree/main/.devcontainer) fixe la même chaîne d’outils Android pour VS Code : le SDK et le NDK ne sont donc jamais installés sur votre machine. Ouvrez le dépôt dans VS Code, choisissez **Rouvrir dans le conteneur**, puis exécutez les commandes Gradle ci-dessus. Le JDK du devcontainer est plus récent que JDK 17 : considérez donc une compilation avec JDK 17 comme la référence pour le comportement lié à la version de Java.

## L’assistant root

Gradle compile et vérifie automatiquement les deux assistants root propres aux ABI avant de compiler l’application. L’application et les assistants intègrent la même identité, dérivée de chaque fichier source, en-tête et définition de commande de l’assistant : une compilation locale de l’application ne peut donc pas dépendre silencieusement d’un ancien code privilégié.

## Signature

Vous n’avez pas besoin de configurer la signature pour compiler et exécuter ha-paneld. Un dépôt sans configuration de signature utilise le `debug.keystore` versionné pour les compilations de débogage. Si `keystore.properties` fournit une configuration de signature, les compilations de débogage utilisent cette clé à la place. Les versions officielles sont signées avec la clé de publication privée du projet, qui ne figure jamais dans le dépôt.

Android refuse de mettre à jour une application installée avec un APK signé par une autre clé. Passer un panneau d’une version officielle à votre propre clé de publication ou à une compilation de débogage nécessite donc une désinstallation préalable. Avant cela, créez une sauvegarde chiffrée complète `.hpb` depuis **Installer → Sauvegarde** et vérifiez que le fichier a été enregistré ; sinon, la désinstallation supprime profils, état appris et historique. Panel Assistant fait de l’application du panneau un administrateur de l’appareil, et Android refuse de désinstaller un administrateur : libérez donc d’abord ce rôle. Retirez l’application avec l’option **Retirer Panel Assistant de ce panneau** (**Retirer de ce panneau** dans la version 1.0.0-rc2 non encore publiée), sous **Configurer** dans Home Assistant, ou libérez le rôle d’administrateur et désinstallez via ADB :

```sh
adb shell am broadcast --include-stopped-packages -n io.panelassistant.android/io.panelassistant.android.platform.ReleaseDeviceAdminReceiver
adb shell pm uninstall io.panelassistant.android
```

Si `pm uninstall` répond encore `DELETE_FAILED_DEVICE_POLICY_MANAGER`, attendez une seconde et relancez-le. Installez l’autre compilation, puis restaurez la sauvegarde depuis **Installer → Restaurer**. Voir [Mises à jour et récupération](/fr/manage/updates-and-recovery/).

Pour signer systématiquement vos propres compilations avec la même clé, copiez [`keystore.properties.example`](https://github.com/panel-assistant/android/blob/main/keystore.properties.example) vers `keystore.properties` et renseignez-le ; lorsque ce fichier est présent, `assembleRelease` utilise la signature de publication. Un fork qui publie des versions balisées via GitHub Actions fournit plutôt cette même clé sous forme de secrets du dépôt.

```sh
keytool -genkeypair -storetype PKCS12 -keystore release.jks -alias ha-paneld \
  -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ha-paneld"
```

:::danger
Ne versionnez jamais `keystore.properties` ni le fichier `.jks` (tous deux sont ignorés par Git). Sauvegardez le keystore et son mot de passe : si vous les perdez, vous ne pourrez plus jamais publier une mise à jour sur place de vos propres compilations.
:::
