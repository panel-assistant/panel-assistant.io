---
title: Tuya TPA10
description: Caractéristiques du Tuya TPA10, un panneau Rockchip rk3566 de 10,1 pouces avec LED RVB, cinq boutons, caméra et capteurs de température, d’humidité et de proximité.
vendor: Tuya
model: TPA10
soc: Rockchip RK3566
android: '11'
screen: 10.1 in, 1920 × 1200
support: Complète
root: su présent ; auxiliaire pour LED, climat et 5e bouton
webview: Chrome 83 ; remplacement par LineageOS 150 avec root
released: '2023-08 (estimation)'
photos:
  - src: 'asset:hardware-tuya-tpa10-front.jpg'
    alt: Tuya TPA10 de face, avec sa rangée de boutons latérale
  - src: 'asset:hardware-tuya-tpa10-front-flat.jpg'
    alt: Tuya TPA10 vu de face à plat, avec les boutons latéraux et le bord du cadre
photoCredit: 'Photo : Tuya'
sold_as:
  - brand: Tuya
    name: 'TPA10-M2'
    note: 'Nom dans le catalogue Tuya'
  - brand: Tuya
    name: 'Control Panel MAX'
    note: 'Nom commercial et dans la fiche FCC'
evidence: [bench, mostly-open, firmware, documented, owners]
sidebar:
  label: TPA10
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Aucune note de version du micrologiciel du fabricant n’a été trouvée pour ce panneau. Les informations sur le micrologiciel présentées ici sont des observations de l’appareil examiné.

Un grand panneau rk3566 **10.1 in 1920×1200** avec une LED RVB frontale unique, un rétroéclairage monochrome des boutons, de nombreux capteurs (proximité à temps de vol, température et humidité, lumière ambiante), une caméra et cinq boutons physiques. Il n’a ni Zigbee, ni NFC, ni IR. Rétro-ingénierie réalisée sur un appareil en fonctionnement (Android 11, rooté, `su` présent).

<a id="also-sold-as"></a>

## Autres noms commerciaux

Tuya TPA10, TPA10, TPA10-M2 (M2A, M2E, M2U, M2X), TPA10 Control Panel MAX, Control Panel MAX, Panel MAX, panneau Tuya rk3566, SmartOS Xinch (paquets du fabricant `com.smartos.xinch.setting`, `com.smartos.xinch.hardware`, `com.smartos.xinch.platform.ethernet`), `com.tuya.devicetest`.

:::tip
À retenir : adb est **protégé par mot de passe** ; utilisez donc l’accès détourné USB par l’application de diagnostic. La LED et les capteurs réservés à root nécessitent le **démon auxiliaire root `hapaneld-helper`**. Une écriture `custom_animation` sur la LED frontale peut **redémarrer le panneau** (voir l’avertissement ci-dessous). Mettez le **WebView à jour en premier** ; voir [WebView : commencer par sa mise à jour](#webview-update-this-first).
:::

|         |                                                                                                                                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | Rockchip **rk3566**                                                                                                                                                                                                 |
| Écran   | **1920×1200** (paysage 16:10), environ 10.1 in, **environ 226 ppi physiques**, 56 Hz. Densité logique Android de base en usine **240 dpi** (souvent modifiée pour dimensionner le tableau de bord ; 212 recommandé) |
| Android | 11 (API 30)                                                                                                                                                                                                         |
| ABI     | armeabi-v7a (espace utilisateur 32 bits)                                                                                                                                                                            |
| Radios  | Wi-Fi, Bluetooth et BLE, plus une fonction du fabricant `com.smartos.xinch.platform.ethernet` (filaire, PoE). **Ni Zigbee, ni NFC, ni IR, ni réseau cellulaire.**                                                   |
| Root    | `su` disponible ; LED et capteurs sysfs appartiennent à `system:system`, un **démon auxiliaire root est donc nécessaire** (voir ci-dessous).                                                                        |
| Sortie  | Vers août 2023 (est.) ; l’autorisation FCC ID 2A789-TPA10, sous le nom « Control Panel MAX », date d’environ le 22 août 2023 ([fiche d’autorisation FCC ID 2A789-TPA10](https://fccid.io/2A789-TPA10))              |

:::tip
Vous changez le micrologiciel d’un panneau sans boutons ? Lisez d’abord [Sauvegarder et restaurer le micrologiciel](/fr/hardware/guides/firmware-backup-and-restore/). Le TPA10 (rk3566, Android 11, eMMC de 7.28 GB `mmcblk2`) dispose d’un accès Loader vérifié, déclenché par logiciel avec `adb reboot loader` et `rkdeveloptool`. Le [bouton encastré](#buttons) n’est pas une entrée Linux ; son comportement de réinitialisation d’usine ou Maskrom n’a pas été confirmé sans risque. Ne comptez donc pas sur lui pour la récupération.
:::

<a id="gaining-adb-and-root-access"></a>

## Obtenir l’accès adb et root

Le TPA10 est livré avec adb **protégé par mot de passe** et adb réseau désactivé. La voie fiable pour le premier accès est le passage USB par l’application de diagnostic, sans calcul de mot de passe. `su` est déjà présent : dès qu’adb fonctionne, vous avez root. Synthèse de [seaky/nspanel_pro_tools_apk, ticket 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123).

**Premier accès.** Aucune méthode sans ordinateur n’est vérifiée pour activer ADB réseau sur le port TCP 5555. Commencez par USB avec la procédure de diagnostic ci-dessous ; les commandes root suivantes ne rendent ADB réseau persistant qu’après cette première connexion.

**1. Activer les options pour les développeurs.** Dans les paramètres, _À propos_, touchez sept fois le numéro de build ou de version.

**2. Premier accès par l’application de diagnostic USB (recommandé).** Les options pour les développeurs donnent accès à une **application de diagnostic** technique Tuya, uniquement en chinois. Tant qu’elle est ouverte, adb sur le port **USB** est autorisé _sans_ mot de passe et la session est déjà root. Branchez l’USB et exécutez :

```bash
adb devices          # the panel appears
adb shell su 0 id    # uid=0 → root confirmed
```

L’accès adb root du TPA10 est plus fiable par le port USB que par le réseau.

**3. Rendre adb persistant (root, sans mot de passe, voie fiable).** Avec l’application de diagnostic au premier plan, vous avez une session adb root (`su` est présent et `adb root` fonctionne aussi, car c’est une version `userdebug`). Utilisez-la pour rendre adb persistant et ne plus avoir besoin de l’application de test ni d’un mot de passe. Cela résiste à la fermeture de l’application de diagnostic **et** à un redémarrage complet, vérifié sur un appareil réel. Transférez et exécutez en root :

```bash
# persist-adb.sh — run via the diagnostics-app backdoor:
#   adb push persist-adb.sh /data/local/tmp/ && adb shell su 0 sh /data/local/tmp/persist-adb.sh
settings put global adb_enabled 1                   # USB debugging, persisted in /data
settings put global development_settings_enabled 1  # keep Developer options visible
setprop persist.adb.tcp.port 5555                   # network adb on :5555 — persist.* survives reboot

# Pre-authorise each controlling machine so NO on-screen "Allow USB debugging" is needed after reboot.
# Append the contents of every workstation's ~/.android/adbkey.pub (one key per line):
mkdir -p /data/misc/adb
cat >> /data/misc/adb/adb_keys <<'KEYS'
PASTE-EACH-adbkey.pub-LINE-HERE
KEYS
chmod 640 /data/misc/adb/adb_keys
chown system:shell /data/misc/adb/adb_keys 2>/dev/null
restorecon /data/misc/adb/adb_keys 2>/dev/null

setprop ctl.restart adbd                            # apply now (and it auto-starts every boot)
echo "adb persisted: adb_enabled=$(settings get global adb_enabled) tcp=$(getprop persist.adb.tcp.port)"
```

Le panneau doit être connecté au Wi-Fi pour la voie réseau. Ensuite, `adb connect <panel-ip>:5555` fonctionne depuis toute machine préautorisée, même après redémarrage, avec les applications du fabricant fermées. L’effacement de `/data` ou une réinitialisation d’usine supprime `adb_keys` et `adb_enabled` ; relancez alors le script.

:::caution
**Le mot de passe « Enable ADB » des options pour les développeurs n’est pas une voie utilisable ; ne tentez pas de le calculer.** La recette communautaire du [ticket 123](https://github.com/seaky/nspanel_pro_tools_apk/issues/123) n’est pas reproductible. La décompilation de `checkDevPassword` dans `com.smartos.xinch.setting` confirme sa _forme_ : `base64(takeLast(ro.tuya.uuid,3) + takeLast(deviceId,3))`, puis `takeLast(6)`, sans distinction de casse (ou `takeLast(ro.tuya.uuid,6)` si `deviceId` est vide). Mais le `deviceId` utilisé n’a pu être associé à aucun identifiant lisible : `ro.serialno`, `android_id` et `ro.tuya.key` ont tous été rejetés sur un appareil réel. Le journaliseur de l’application n’est **pas** logcat ; la valeur attendue ne peut donc pas non plus être lue sur l’appareil. L’exemple du ticket comporte aussi une faute (`11a` plus `xia` écrit `11xia` ; il faut `11axia`). Utilisez la méthode root ci-dessus, qui rend le mot de passe inutile.
:::

:::danger
Ne désactivez les paquets du fabricant `com.smartos.xinch.*` qu’en **toute dernière étape**, après avoir confirmé qu’adb est fiable _et_ que vous disposez d’un remplacement pour les boutons physiques. Désactiver les applications matérielles ou de paramètres avant de disposer d’un adb fiable peut vous bloquer l’accès. Les actions de navigation à distance (Retour, Accueil), le rétroéclairage des boutons et les entités LED de l’application du panneau remplacent les fonctions de l’application du fabricant.
:::

:::note
Les applications du fabricant sur l’appareil n’ont _pas_ constitué une source utile pour la rétro-ingénierie. `com.tuya.devicetest` est odexée (aucun dex dans l’APK), et `com.smartos.xinch.hardware` intègre le **SDK AVS (Alexa)** Tuya (`libLibSampleApp.so`, 17 MB) ainsi qu’un lecteur de touches (`libjnimain.so`). La source de référence est constituée des nœuds sysfs autodocumentés de l’appareil lui-même.
:::

<a id="webview-update-this-first"></a>

## WebView : commencer par sa mise à jour

Le WebView d’origine est **Chrome 83**, bien trop ancien pour l’interface actuelle de Home Assistant : le tableau de bord reste donc vide ou défectueux tant que vous ne le remplacez pas. La version recommandée est **LineageOS System WebView 150** (`armeabi-v7a`), un moteur Chromium standard, actuel et maintenu. Préférez-le à Cromite : Cromite modifie le paramètre de contenu de lecture automatique de Chromium pour la _bloquer_, ce qui empêche les flux des cartes caméra Home Assistant (WebRTC) de démarrer sans toucher l’écran. LineageOS autorise la lecture automatique : les flux caméra démarrent seuls.

La marge du décodeur vidéo du TPA10 dans WebView est limitée. Plusieurs cartes WebRTC 720p visibles peuvent perdre des images ou laisser un flux attendre sa première image, alors qu’un flux seul fonctionne correctement. Si cela arrive, utilisez des sous-flux de résolution inférieure, moins de cartes à lecture automatique simultanées, ou des instantanés qui passent à la vidéo en direct au toucher.

Téléchargez-le depuis le miroir (URL stable) :

```
https://github.com/panel-assistant/android/releases/download/webview-mirror/lineageos-webview-150.0.7871.63-arm.apk
```

<a id="why-a-plain-install-does-not-work"></a>

### Pourquoi une installation simple ne fonctionne pas

Le WebView porte le nom de paquet `com.android.webview` ; il doit donc **remplacer** le fournisseur système, et les deux voies évidentes échouent sur ce panneau Android 11 :

- `adb install -r` est rejeté avec `INSTALL_FAILED_UPDATE_INCOMPATIBLE: signatures do not match`. Android n’autorise la mise à jour de `com.android.webview` qu’avec un APK signé par la **même clé** que celui installé, et chaque fournisseur WebView utilise une clé différente. Pour la même raison, **une simple installation manuelle d’APK ne peut pas effectuer ce premier remplacement** : elle passe par `pm install`, que le panneau bloque. Le remplacement ci-dessous est une étape manuelle **unique**. Une fois LineageOS installé, les versions LineageOS suivantes peuvent être installées avec `adb install -r`, car elles partagent le même signataire.
- La liste d’autorisation de la ROM n’accepte que `com.android.webview`, pas la variante `com.google.android.webview` : une version Google s’installe mais n’est jamais sélectionnée.

<a id="working-method-with-root-replace-the-file-and-clear-the-signature-lock"></a>

### Méthode fonctionnelle avec root : remplacer le fichier et lever le verrou de signature

Le panneau est verrouillé par signature mais peut être rooté : l’application ne peut pas utiliser `su`, mais un shell le peut (`adb shell su root <cmd>`). Cette méthode place le nouvel APK dans l’emplacement du WebView _système_ et supprime son entrée de la base des paquets ; PackageManager l’enregistre donc **à neuf** au redémarrage et lit sa propre signature sans conflit.

```bash
IP=<panel-ip>:5555
adb connect $IP
adb -s $IP shell su root id                           # confirm it prints uid=0(root)

# 1. push the new WebView, and back up the current WebView + package database first:
adb -s $IP push lineageos-webview-150.0.7871.63-arm.apk /data/local/tmp/wv-new.apk
adb -s $IP shell su root sh -c 'cp /product/app/webview/webview.apk /data/local/tmp/webview.bak;
                                cp /data/system/packages.xml /data/local/tmp/packages.xml.bak'

# 2. replace the system WebView APK (remount /product read-write first — verity must already be off;
#    a never-modified panel needs a one-time `adb root && adb disable-verity && adb reboot` beforehand):
adb -s $IP shell su root sh -c 'mount -o rw,remount /product;
    cp /data/local/tmp/wv-new.apk /product/app/webview/webview.apk;
    chmod 644 /product/app/webview/webview.apk; chown root:root /product/app/webview/webview.apk;
    restorecon /product/app/webview/webview.apk'

# 3. remove the single <package name="com.android.webview" …>…</package> element from packages.xml.
#    Do NOT hand-edit it — pull it, let a parser remove exactly that element, then push it back:
adb -s $IP shell su root sh -c 'cp /data/system/packages.xml /data/local/tmp/pkgs.xml; chmod 644 /data/local/tmp/pkgs.xml'
adb -s $IP pull /data/local/tmp/pkgs.xml packages.xml
python3 - <<'PY'
import xml.etree.ElementTree as ET
d = open('packages.xml', encoding='utf-8').read()
m = '<package name="com.android.webview"'
assert d.count(m) == 1, 'expected exactly one com.android.webview package'
s  = d.find(m); ls = d.rfind('\n', 0, s) + 1                      # start of that line
e  = d.find('</package>', s) + len('</package>'); le = d.find('\n', e) + 1  # end of its closing line
new = d[:ls] + d[le:]
ET.fromstring(new)                                                # abort if the result isn't valid XML
open('packages.xml', 'w', encoding='utf-8').write(new)
print('removed com.android.webview; XML still valid')
PY
adb -s $IP push packages.xml /data/local/tmp/pkgs.new
adb -s $IP shell su root sh -c 'cp /data/local/tmp/pkgs.new /data/system/packages.xml;
    chown system:system /data/system/packages.xml; chmod 660 /data/system/packages.xml;
    restorecon /data/system/packages.xml'

# 4. reboot — PackageManager registers the new WebView fresh:
adb -s $IP reboot
```

**En cas de problème**, revenez aux sauvegardes de l’étape 1 : recopiez `/data/local/tmp/webview.bak` sur `/product/app/webview/webview.apk` et `/data/local/tmp/packages.xml.bak` sur `/data/system/packages.xml` (avec les mêmes `chown`, `chmod` et `restorecon`), puis redémarrez.

:::danger
**La version WebView annoncée est erronée après cette méthode ; ne vous y fiez pas.** « Paramètres, WebView » et `adb shell dumpsys webviewupdate` affichent toujours **`83.0.4103.120`**, car un SystemWebView installé manuellement **reprend les `versionName` et `versionCode` du fabricant** pour passer le contrôle de version minimale du panneau et être sélectionné. Le moteur _réel_ est 150. Vérifiez-le avec :

- **User-Agent :** ouvrez une page de type « quel est mon user agent » sur le panneau ; l’UA contient `Chrome/150.0.7871.63`.
- **L’application du panneau :** la page d’état du panneau et `/diag`, sur le port HTTP annoncé (8888 par défaut), affichent `engine Chromium 150.0.7871.63`, car ils lisent l’UA plutôt que la version de paquet réécrite.

Une simple installation adb ne fonctionne **pas** sur ce panneau verrouillé par signature. Cromite 147 reste dans le miroir comme solution de repli, avec la même procédure et un autre APK.
:::

## LED

<a id="rgb-led-avsux-driver-root-helper-daemon"></a>

### LED RVB : pilote `avsux` (démon auxiliaire root)

La LED RVB frontale est **unique** (`avsux_info` annonce `led type:[single] nums:[1]`), sur le pilote de plateforme `leds_pwm_avs` (périphérique `avsux`), exposée à `/sys/class/leds/avs-pwm-led/`.

:::danger
Une écriture de `custom_animation` dans `avsux_select` a provoqué un **redémarrage du panneau**. Utilisez `avsux_animation` pour la couleur et considérez `avsux_select` et `custom_animation` comme en lecture seule, sauf lors de tests.
:::

Il n’existe **aucun nœud `/dev` accessible à l’application** pour la LED (à comparer au `/dev/ledjni` du [WF1589T](/fr/hardware/panels/electron/wf1589t/)). Les attributs sysfs appartiennent à `system:system`, donc une `untrusted_app` ne peut pas y écrire. L’application du panneau utilise ainsi un petit **démon auxiliaire root** (`/system/bin/hapaneld-helper`, exécuté en root sur un socket Unix) ; `SocketLedController` est le client. Voir la [documentation de l’auxiliaire](https://github.com/panel-assistant/android/blob/main/helper/README.md).

<a id="avs-pwm-led-sysfs-attributes"></a>

#### Attributs sysfs de `avs-pwm-led`

| Attribut          | Permissions        | Usage                                                     |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `brightness`      | `system:system` rw | niveau global de 0 à 255                                  |
| `avsux_animation` | `system:system` rw | écriture sûre de couleur ou d’animation                   |
| `avsux_select`    | `system:system` rw | `custom_animation[][0][0]:<dur_ms>:<RRGGBB>[,…≤12 slots]` |
| `avsux_firmware`  | r                  | liste les animations nommées (`bootanime`, `idle`)        |
| `avsux_info`      | r                  | métadonnées (nombre et type de LED)                       |

<a id="button-backlight"></a>

### Rétroéclairage des boutons

`/sys/class/leds/button-backlight/brightness` est une sortie PWM **monochrome**, de 0 à 255 (pilote standard `leds_pwm`, périphérique `pwmleds`). Elle appartient à `system:system` avec les droits 0664 ; elle est donc commandée par le même démon `hapaneld-helper`.

<a id="sensors"></a>

## Capteurs

La proximité et la lumière ambiante sont directement accessibles à l’application via `SensorManager`. La température et l’humidité sont réservées à root (sous-système d’entrée et I²C) et nécessitent le démon auxiliaire.

:::tip
Le CHT8305 fait de ce panneau un **capteur de température et d’humidité ambiantes** utilisable dans Home Assistant. Le démon auxiliaire le lit avec sa commande `CHT8305`, qui effectue une lecture ponctuelle `EVIOCGABS` de l’axe d’entrée `ABS_THROTTLE` du pilote en identifiant les périphériques d’entrée `temperature` et `humidity` par leur nom. L’application du panneau propose les capteurs **Température de la pièce** et **Humidité de la pièce** dans Home Assistant. La transmission des mesures est activée par défaut ; les commandes se trouvent dans Configurer, Capteurs, dans la vue Avancé. Le paramètre avancé **Décalage de température ambiante**, ou `sensors.room_temp_offset_c` dans le profil, compense la chaleur produite par le panneau lui-même.
:::

Le capteur à temps de vol du TPA10 mesure réellement la proximité en fonction de la distance, mais la HAL Android la quantifie. La configuration guidée de proximité sur le panneau capture et enregistre les extrémités libre et proche ainsi que le sens du capteur réel. Le panneau rapporte ensuite la même échelle normalisée que tous les panneaux pris en charge, au lieu de dépendre d’un seuil fixe propre à l’appareil.

<a id="sensor-chips-and-access-paths"></a>

### Puces des capteurs et voies d’accès

| Capteur                  | Puce                                                                                 | Accès                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Proximité (temps de vol) | Vishay **VI5300** (i2c-3 `0x6c`, `proximity_vi5300`, interrogation toutes les 30 ms) | Android `SensorManager` `TYPE_PROXIMITY`, sans root. La distance brute en mm sur le nœud I²C du pilote (`…/i2c-3/3-006c`) nécessite root. |
| Température et humidité  | **CHT8305** (`temperature_cht8305` à 3-0040, `humidity_cht8305` à 3-0040-1)          | **Absent** de `SensorManager` ; données via le **sous-système d’entrée** sur I²C, root uniquement.                                        |
| Lumière ambiante         | **CG5256** (`light_cg5256`)                                                          | Capteur de lumière Android `SensorManager`, sans root.                                                                                    |

<a id="buttons"></a>

## Boutons

Le TPA10 possède **trois catégories** de boutons physiques, confirmées sur l’appareil avec `getevent` :

- **Les quatre boutons latéraux :** `adc-keys`, KeyEvents standard associés à `F1` à `F4`, capturés par le filtre de touches d’accessibilité de l’application, sans voie particulière.
- **Le cinquième bouton (orange) :** un _commutateur_ `EV_SW`, pas une touche, lu par le lecteur evdev du démon auxiliaire root et envoyé à Home Assistant sous forme d’événement.
- **Le bouton encastré** (près du port USB-C) : ce n’est pas une entrée Android, il n’est donc pas disponible pour Home Assistant.

<a id="per-button-detail"></a>

### Détail par bouton

**1. Les quatre boutons latéraux sont des `adc-keys` et envoient des KeyEvents standard.** Ils utilisent le **SARADC** rk3566 (`fe720000.saradc`), périphérique `adc-keys1` (`/dev/input/event7`), scancodes `59` à `62`. Le `Generic.kl` d’origine les associe à **`F1` à `F4`**, devenant les Android `KEYCODE_F1` à `KEYCODE_F4` ; l’application les capture via son filtre de touches d’accessibilité. Sur un appareil avec `su`, on peut les réaffecter en modifiant `/system/usr/keylayout/Generic.kl` (par exemple vers `BRIGHTNESS_*` ou `VOLUME_*`).

**2. Le cinquième bouton (orange) est un commutateur, pas une touche.** Sur `gpio-keys` (`/dev/input/event8`), il rapporte **`EV_SW` `SW_MUTE_DEVICE`** (code de commutateur `14`), un événement _à état maintenu_, **pas** un `EV_KEY`. C’est pourquoi il n’a pas d’entrée keylayout et n’est jamais visible par l’accessibilité Android. Il coupe physiquement les microphones, indépendamment de la transmission des touches d’accessibilité. L’application le lit via le lecteur evdev du démon auxiliaire root (`WATCH /dev/input/event8`, `sw=true`) et envoie un événement Home Assistant (`KEYCODE_MUTE`) à chaque bascule, validé de bout en bout. Il s’agit du comportement **d’origine**, non documenté ailleurs au moment de la rédaction.

**3. Le bouton encastré (près du port USB-C) n’est pas une entrée Android.** Il est absent de `getevent`, `gpio-keys` et `dmesg` ; Home Assistant ne peut donc pas l’utiliser. Son rôle électrique n’a pas été confirmé sans risque. Son emplacement et la plateforme rk3566 suggèrent une fonction de réinitialisation ou de mode de démarrage, mais aucune durée d’appui, réinitialisation d’usine ni procédure d’entrée Maskrom n’est vérifiée. Ne l’enfoncez pas et ne le maintenez pas en supposant qu’il fournit une voie de réécriture récupérable. Utilisez la voie Loader vérifiée, déclenchée par logiciel tant qu’Android démarre encore, et respectez les limites de [Sauvegarder et restaurer le micrologiciel](/fr/hardware/guides/firmware-backup-and-restore/).

<a id="camera"></a>

## Caméra

GalaxyCore **GC05A2 / GC5035**, capteur 2592×1944. Android rapporte une caméra de niveau matériel `LIMITED`, uniquement `BACKWARD_COMPATIBLE`, `Facing: Back`, sans flash ni autofocus, via le fournisseur `legacy/0` (`device@3.3`).

:::note
Les indicateurs de fonctions du micrologiciel sont erronés : le panneau déclare `android.hardware.camera.front`, alors que la HAL indique `Facing: Back`. Appuyez-vous sur le profil de l’appareil et ce que `CameraManager` énumère réellement, jamais sur `hasSystemFeature`.
:::

1280×720 est proposé dans les trois formats `IMPLEMENTATION_DEFINED`, `YUV_420_888` et `BLOB` : prévisualisation et capture fixe sont donc disponibles. La HAL annonce un blocage d’une image pour une capture `BLOB` 720p à 30 fps. Cette valeur de capture fixe du fabricant ne mesure pas le coût du flux H.264 de l’application du panneau. `android.control.aeAvailableTargetFpsRanges` ne propose que `[15 30]` et `[30 30]` : aucun mode capteur verrouillé à 15 fps ; un flux 15 fps résulte donc du cadencement de l’encodeur, pas du capteur.

Le seul encodeur H.264 matériel est `OMX.rk.video_encoder.avc`, servi par la HAL OMX IL (ce panneau possède un processus `media.codec` et aucun service Codec2 du fabricant). Il déclare de `176x144` à `1920x1088` avec un alignement `16x8`, une plage de débit annoncée de 1 bps à 10 Mbps et quatre instances simultanées. Il n’y a **aucun encodeur HEVC matériel** ; la seule entrée HEVC est le logiciel `c2.android.hevc.encoder`, livré avec `enabled="false"`.

:::caution
Considérez les valeurs du fichier fabricant `media_codecs_performance.xml` comme du texte standard plutôt que des mesures : les encodeurs AVC matériel et logiciel annoncent les mêmes `measured-frame-rate` pour 720×480 et 1280×720, ce qui ne peut pas être une vraie mesure. Partez du 720p tant que vous n’avez pas mesuré autre chose sur votre propre panneau.
:::

Un panneau affichant des cartes caméra n’est pas inactif. Sur un tableau de bord mesuré, l’application maintenait deux instances `OMX.rk.video_decoder.avc` actives ; une session d’encodage entre donc en concurrence avec le décodage existant sur le même VPU Rockchip.

L’application peut diffuser cette caméra comme fonction **désactivée par défaut**. L’interrupteur **Caméra** de la carte Caméra dans Configurer l’active, avec les valeurs par défaut de **Résolution**, **Fréquence d’images** et **Débit** (720p, 15 fps, 2000 kbps), ainsi qu’une correction d’**Exposition**. Elle diffuse un flux H.264 à `rtsp://<panel>:8554/live`, avec le son de la pièce lorsque l’accès au microphone est disponible et autorisé. Home Assistant obtient les images fixes depuis ce flux via l’entité caméra du panneau. Dès que la caméra est ouverte, le panneau affiche un indicateur rouge que le contenu de la page ne peut pas recouvrir. Voir la [référence des commandes](/fr/reference/api/) pour l’entité caméra.

:::caution
Ne placez pas de carte caméra Home Assistant pour **ce** panneau sur son **propre** tableau de bord. Le panneau décoderait son propre encodage en boucle sur le même moteur vidéo, sans bénéfice.
:::

<a id="other-silicon"></a>

## Autres composants

Caméra GalaxyCore **GC05A2 / GC5035** ; codec audio **ES7202** (CAN de capture ; la parole près du panneau et Assist ont été vérifiés via la capture Android après réactivation des microphones avec le bouton orange ; la captation à distance et les performances avec musique de fond restent non qualifiées) ; tactile Goodix ; PMIC `rk808` et `rk860`.

<a id="access-model-summary"></a>

## Résumé des accès

- **LED et rétroéclairage des boutons :** root uniquement (sysfs `system:system`), via `hapaneld-helper`.
- **Proximité et lumière ambiante :** accès direct de l’application (`SensorManager`).
- **Température, humidité :** root uniquement (sous-système d’entrée et I²C), via le démon auxiliaire.
- **Boutons :** les quatre boutons latéraux sont directs (KeyEvents via l’accessibilité) ; le cinquième bouton orange est un commutateur `EV_SW` lu par la surveillance evdev de `hapaneld-helper` ; le bouton encastré n’est pas une entrée.
