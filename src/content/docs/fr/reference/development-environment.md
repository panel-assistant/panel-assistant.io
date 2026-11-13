---
title: Environnement de développement
description: La chaîne d’outils qui compile l’application du panneau, les méthodes Docker et devcontainer, et ce qu’un fork doit savoir sur la signature.
sourceCommit: 396e908e6370b88a9fd555abcb67b0816c4cd6f4
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

Si vous préférez n’installer que Docker, [`tools/build/`](https://github.com/panel-assistant/android/tree/main/tools/build) construit une image Docker et y exécute Gradle. Son Dockerfile répertorie les paquets du SDK inclus dans l’image. L’APK est créé dans votre arbre de travail, l’image est mise en cache après la première compilation, et les caches Gradle persistent dans un volume Docker nommé.

```sh
./tools/build/build.sh                       # debug APK -> app/build/outputs/apk/debug/
./tools/build/build.sh :app:assembleRelease  # any Gradle task(s) instead
```

Si vous exécutez le script depuis un conteneur qui communique avec un démon Docker externe, lisez la note sur `HOST_WORKDIR` dans `build.sh`.

## Devcontainer

[`.devcontainer/`](https://github.com/panel-assistant/android/tree/main/.devcontainer) fixe la même chaîne d’outils Android pour VS Code : le SDK et le NDK ne sont donc jamais installés sur votre machine. Ouvrez le dépôt dans VS Code, choisissez **Rouvrir dans le conteneur**, puis exécutez les commandes Gradle ci-dessus. Le JDK du devcontainer est plus récent que JDK 17 : considérez donc une compilation avec JDK 17 comme la référence pour le comportement lié à la version de Java.

## L’assistant root

Gradle compile et vérifie automatiquement les deux assistants root propres aux ABI avant de compiler l’application. L’application et les assistants intègrent la même identité, dérivée de chaque fichier source, en-tête et définition de commande de l’assistant : une compilation locale de l’application ne peut donc pas dépendre silencieusement d’un ancien code privilégié.

## Mesurer les performances du tableau de bord depuis un ordinateur

La page d’état du panneau couvre les performances au quotidien ; voir [Performances](/fr/manage/performance/). Pour comparer de façon enregistrée un tableau de bord avec et sans filtre d’entités, depuis l’extérieur du panneau, le dépôt fournit un script de collecte.

Si le tableau de bord non filtré surcharge son propre WebView, les chiffres dans la page peuvent se figer. Un collecteur lancé sur ordinateur interroge plutôt l’interface de performances propre à l’application, appartenant à l’API REST obsolète (voir la [référence des commandes](/fr/reference/api/#the-rest-api-is-deprecated)). Le CPU du panneau reste ainsi observable, ainsi qu’une sonde native du fil du moteur Chromium si root ou l’auxiliaire est disponible. Il consigne aussi l’âge du dernier lot de mesures navigateur ; au-delà de 15 secondes, il le signale bloqué au lieu de le considérer comme actuel.

Le collecteur ne change pas la configuration. Il n’active ni ne désactive ou réécrit le filtre ; sa première requête peut créer une clé privée d’installation dans l’état interne de l’application. Sélectionnez la même vue et la même charge pour les deux essais, changez le filtre dans l’interface web, attendez le rechargement, puis exécutez une commande depuis une copie du [dépôt ha-paneld](https://github.com/panel-assistant/android) pour chaque état :

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Comparez les deux résultats :

```bash
python3 tools/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Chaque essai dure par défaut trois minutes, avec 30 secondes de préchauffage et une interrogation toutes les 10 secondes. `--pair-with` réutilise un identifiant opaque du premier résultat afin de refuser un panneau physique différent, une autre configuration Home Assistant ou de tableau de bord, ou un réglage influençant la mesure modifié, sans enregistrer ces valeurs privées. Il ne détecte pas une autre vue choisie manuellement dans le même tableau de bord : gardez donc la même vue et la même charge.

Le collecteur refuse un essai si le mode attendu est inactif, si la révision du filtre ou la génération du moteur change, si la version ou la configuration change pendant la collecte, si le filtrage revient au repli ou s’il conserve moins de trois échantillons, moins de trois mesures CPU du panneau ou moins de trois mesures CPU natives du moteur. Il écrit tout de même le résultat refusé avec les raisons exactes et n’écrase jamais un fichier existant.

Le JSON omet URL et identifiant du panneau, URL Home Assistant et chemin du tableau de bord, identifiants d’entités, noms de processus et empreinte du filtre. Le panneau calcule les empreintes opaques avec une clé aléatoire privée de 256 bits qui ne le quitte jamais ; elles sont propres à une paire de comparaison, donc on ne peut ni relier des mesures distinctes ni deviner le nom du panneau grâce à elles. Un panneau incapable de stocker la clé refuse la mesure. Le nombre d’entités non filtrées est le dernier nombre synchronisé du catalogue, pas un nombre récupéré en direct du WebView surchargé ; il est indisponible si le catalogue est vide. Les compteurs réseau et navigateur sont normalisés aux intervalles réellement observés, pour qu’une interrogation manquée ne fausse pas la comparaison. Délais et débits navigateur sont exclus des résumés lorsqu’ils sont périmés, tandis que CPU, mémoire, réseau et chiffres du moteur fournis par l’application continuent d’être collectés.

## Signature

Vous n’avez pas besoin de configurer la signature pour compiler et exécuter ha-paneld. Un dépôt sans configuration de signature utilise le `debug.keystore` versionné pour les compilations de débogage. Si `keystore.properties` fournit une configuration de signature, les compilations de débogage utilisent cette clé à la place. Les versions officielles sont signées avec la clé de publication privée du projet, qui ne figure jamais dans le dépôt.

Android refuse de mettre à jour une application installée avec un APK signé par une autre clé. Passer un panneau d’une version officielle à votre propre clé de publication ou à une compilation de débogage nécessite donc une désinstallation préalable. Avant cela, créez une sauvegarde chiffrée complète `.hpb` depuis **Installer → Sauvegarde** et vérifiez que le fichier a été enregistré ; sinon, la désinstallation supprime profils, état appris et historique. Panel Assistant fait de l’application du panneau un administrateur de l’appareil, et Android refuse de désinstaller un administrateur : libérez donc d’abord ce rôle. Retirez l’application avec l’option **Retirer de ce panneau**, sous **Configurer** dans Home Assistant, ou libérez le rôle d’administrateur et désinstallez via ADB :

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
