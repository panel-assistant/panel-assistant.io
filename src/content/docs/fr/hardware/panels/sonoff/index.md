---
title: Sonoff NSPanel Pro
description: Caractéristiques des Sonoff NSPanel Pro 86P et 120P d’origine, panneaux Rockchip PX30 avec radio Zigbee intégrée.
vendor: Sonoff
panelIndex: true
sidebar:
  label: Vue d’ensemble
  order: 0
sourceCommit: 3c2d618c24d3ddd2baf1868792ee3e46ad57f8de
---

La gamme NSPanel Pro d’origine comprend deux panneaux physiquement différents, les **[86P](/fr/hardware/panels/sonoff/nspanel-pro-86p/)** et **[120P](/fr/hardware/panels/sonoff/nspanel-pro-120p/)**, nommés d’après les boîtes murales européennes de 86 mm et 120 mm. Les deux intègrent un **coordinateur Zigbee 3.0**, sans NFC ni IR, et le processeur le moins puissant des panneaux entièrement pris en charge. Ils partagent presque tout ce qui est documenté ici (root, WebView, LED, capteurs, passerelle Zigbee) ; la page de chaque variante ne contient que ses propres caractéristiques et les quelques différences. La rétro-ingénierie de cette page a été menée principalement sur un **86P** réel (Android 8.1, rooté, `su` toolbox), avec vérification séparée sur un 120P réel aux endroits indiqués.

<a id="also-sold-as"></a>

## Autres noms commerciaux

Sonoff NSPanel Pro 86, NSPanel Pro 120, NSPanel Pro 86P, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, px30_evb, SN_3326S, SN-RKPX30-NSP-01, nspanel-pro, nspanel-pro-ver120. À ne pas confondre avec le NSPanel Pro Gen2 ou les cartes Tuya S6E et T6E, qui sont des matériels distincts.

:::tip
À retenir : le panneau est livré en **`userdebug` sans mot de passe adb** ; `adb root` fonctionne directement. La **LED n’est pas caractérisée** (aucun nœud RVB contrôlable n’a été trouvé). Lumière et proximité sont **directement accessibles à l’application**. La **radio Zigbee EFR32** intégrée se gère via un broker local, sans réécriture du micrologiciel. L’installation et les mises à jour de l’application du panneau lancées depuis Home Assistant peuvent installer le WebView vérifié ; voir [WebView : commencer par sa mise à jour](#webview-update-this-first).
:::

|          |                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | Rockchip **PX30 / rk3326**                                                                                                                              |
| CPU      | 4× **Cortex-A35** jusqu’à **1.512 GHz** (408 MHz au repos)                                                                                              |
| GPU      | **Mali-G31** (confirmé sur l’appareil)                                                                                                                  |
| Écran    | **480×480 carré** (1:1), environ 4 in, 160 dpi (mdpi, bien adapté aux quelque 170 ppi physiques), 60 Hz, surface de **480×480 dp**                      |
| RAM      | **2 GB** (environ 1960 MB utilisables)                                                                                                                  |
| Stockage | eMMC ; `/data` environ 3.5 GB                                                                                                                           |
| Android  | 8.1 (API 27)                                                                                                                                            |
| ABI      | arm64-v8a                                                                                                                                               |
| Radios   | **Zigbee 3.0** (coordinateur Silicon Labs EFR32 sur UART `ttyS5`, voir ci-dessous), Wi-Fi, Bluetooth. Ni NFC, ni IR, ni Ethernet, ni réseau cellulaire. |

:::note
Le Cortex-A35 est un cœur économe, nettement moins performant par cycle d’horloge que l’A55 (TPA10) ou l’A72 (WF1589T). Avec 2 GB de RAM, le NSPanel Pro offre les **performances d’entrée de gamme** parmi les panneaux entièrement pris en charge ; voir la [comparaison des performances](/fr/hardware/#performance-comparison).
:::

:::tip
Vous changez le micrologiciel d’un panneau sans boutons ? Lisez d’abord [Sauvegarder et restaurer le micrologiciel](/fr/hardware/guides/firmware-backup-and-restore/). Le NSPanel Pro utilise les [outils de seaky propres au modèle](/fr/hardware/guides/firmware-backup-and-restore/#per-panel-notes), plutôt que `rkdeveloptool`.
:::

<a id="variants-86p-and-120p"></a>

## Variantes : 86P et 120P

Le tableau ci-dessus et la majeure partie de cette page proviennent d’un **86P** ; le **120P** est une carte différente. Les pages [86P](/fr/hardware/panels/sonoff/nspanel-pro-86p/) et [120P](/fr/hardware/panels/sonoff/nspanel-pro-120p/) donnent les caractéristiques et la photo propres à chaque variante.

|                            | NSPanel Pro **86P**                                                                                                                                                                                       | NSPanel Pro **120P**                                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| SoC                        | Rockchip **PX30**                                                                                                                                                                                         | Rockchip **RK3326-S** (même famille PX30/RK3326 ; `ro.board.platform=rk3326`, arbre matériel `rockchip,px30`)                  |
| Écran                      | **480×480** carré, environ 160 dpi, portrait uniquement                                                                                                                                                   | **750×1334** portrait, **240 dpi** (surcharge 250) ; paysage disponible ; environ 1 cm plus étroit et plus long que le 86P     |
| Identifiants de build      | tous deux rapportent `ro.product.model/device/name = px30_evb`, nom de carte Rockchip partagé qui ne permet _pas_ de distinguer fiablement les variantes                                                  | comme le 86P                                                                                                                   |
| `ro.product.version`       | forme `NSPanel86P_x.y.z` ou `s6_android_x.y.z`                                                                                                                                                            | `NSPanel120P_x.y.z` (canal OTA `nspanel-pro-ver120`, ROM complète `SN_3326S_750X1334_…`)                                       |
| Forme OTA                  | ROM complète jusqu’à **4.0.12** ; les versions indexées suivantes sont des différentiels ou des mises à jour de l’application seule (voir la [page du micrologiciel](/fr/hardware/firmware/nspanel-pro/)) | comme le 86P                                                                                                                   |
| Micrologiciel de proximité | **4.0.12 a rétabli les mesures graduées**                                                                                                                                                                 | resté **binaire** en 4.x (les noyaux divergent selon le modèle ; voir [Capteurs](#sensors-light-and-proximity-are-app-direct)) |

Les deux partagent la radio Zigbee EFR32, Android 8.1 (AOSP), arm64-v8a, ainsi que les méthodes root et de récupération ci-dessous. Vérifié sur un 120P réel (micrologiciel `NSPanel120P_3.7.1`) : `wm size` 750×1334, densité 240, `ro.board.platform=rk3326`.

:::note
Cette page ne recommande pas une version de micrologiciel dans son texte ; l’[index généré des micrologiciels](/fr/hardware/firmware/) fait référence. La procédure de réécriture est vérifiée sur le matériel jusqu’à **4.4.0**. Les versions indexées au-delà n’ont été vérifiées que sur le CDN, jamais installées sur un appareil. Au 2026-08-14, le [journal public de Sonoff](https://sonoff.tech/en-us/blogs/news/sonoff-nspanel-pro-version-update-information-and-faq) documente les versions jusqu’à **4.6.0** ; 4.6.2 et 4.8.0 n’ont été trouvées qu’en sondant le CDN, et 4.7.0 n’est abordée que dans un [fil de retours utilisateurs eWeLink](https://forum.ewelink.cc/t/nspanel-pro-v4-7-0-feeback/208789), une discussion et non une annonce de sortie. La version **4.5.3** est un différentiel ROM sur le 120P mais une mise à jour de l’application seule sur le 86P ; **4.6.2** est une mise à jour de l’application seule sans différentiel ROM sur aucun canal. Une mise à niveau ne se fait donc pas toujours en une seule étape. L’absence de l’index signifie que le sondage n’a pas trouvé la version ; le CDN ne permet pas d’énumérer son contenu, donc cette absence ne prouve jamais qu’une version n’existe pas.

**Des utilisateurs signalent des boucles de redémarrage en 4.5.1 et 4.5.2**, à des intervalles d’environ 10 à 60 minutes sur les deux modèles. Pour 4.7.0, le fil de retours contient des signalements de problèmes de connexion des sous-appareils après mise à jour, parfois résolus par un redémarrage et parfois persistants. Ces problèmes n’ont pas été reproduits ni quantifiés : considérez-les comme des témoignages non vérifiés plutôt que comme une régression connue. Vérifiez toute nouvelle version sur un panneau avant de la déployer sur plusieurs ; **4.0.12** reste le point de référence prudent à ROM complète à conserver.
:::

<a id="firmware-quirks-by-version"></a>

### Particularités du micrologiciel par version

Comportements variant selon la version eWeLink, des plus anciens aux plus récents. `ro.product.version` est l’identifiant **interne** (`NSPanel86P_x.y.z` ou `s6_android_x.y.z` sur le 86P, `NSPanel120P_x.y.z` sur le 120P), _pas_ le numéro commercial ou OTA affiché par eWeLink (4.0.12, 4.5.x). La détection et toute logique fondée sur la version doivent lire `ro.product.version`, pas la chaîne commerciale.

| Micrologiciel                                  | Particularité ou comportement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Mesure à prendre                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ancien (avant 1.3.2)**                       | Pas d’interrupteur adb dans l’application ; options pour les développeurs inaccessibles depuis l’interface                                                                                                                                                                                                                                                                                                                                                                                                   | Activez adb par le **port OTG** interne (ouvrez le boîtier) ; voir [Obtenir l’accès adb et root](#gaining-adb-and-root-access).                                                                                                                                                                                                                                     |
| **1.3.2 et ultérieur**                         | Activation adb déplacée dans eWeLink                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Dans eWeLink, _Paramètres de l’appareil_, touchez **ID de l’appareil** huit fois, puis mode développeur, adb.                                                                                                                                                                                                                                                       |
| **1.4 et ultérieur**                           | Mode développeur **retiré** de l’interface                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Activez adb par les **cinq cycles d’alimentation** pendant l’animation Sonoff ; voir [Obtenir l’accès adb et root](#gaining-adb-and-root-access).                                                                                                                                                                                                                   |
| **3.5.1 (86P, vérifié)**                       | WebView système d’origine **Chromium 107.0.5304.105**, bien trop ancien pour un tableau de bord Home Assistant moderne ; les autres micrologiciels peuvent différer                                                                                                                                                                                                                                                                                                                                          | Utilisez la mise à jour gérée du WebView ou le repli manuel par adb ; voir [WebView : commencer par sa mise à jour](#webview-update-this-first). La bannière de santé de l’application signale aussi les WebView inférieurs à Chromium 110.                                                                                                                         |
| **3.7.1 (120P, appareil réel)**                | Version de référence initiale                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `wm size` 750×1334, densité 240, `ro.board.platform=rk3326`.                                                                                                                                                                                                                                                                                                        |
| **4.0.0** (déploiement à partir du 2025-09-19) | Micrologiciel d’origine avec boutique F-Droid ; interface nettement plus rapide                                                                                                                                                                                                                                                                                                                                                                                                                              | Vérifiez que les versions **APP** _et_ **OS** indiquent toutes deux 4.0.0 ou ultérieur.                                                                                                                                                                                                                                                                             |
| **4.0.12**                                     | Mesures de proximité graduées rétablies sur le **86P** ; le **120P reste binaire** (noyaux différents selon le modèle)                                                                                                                                                                                                                                                                                                                                                                                       | Point stable prudent à conserver. La forme des données brutes dépend du modèle et du micrologiciel ; la configuration guidée calibre et normalise les deux formes ; voir [Capteurs](#sensors-light-and-proximity-are-app-direct).                                                                                                                                   |
| **4.5.1 et 4.5.2**                             | **Nombreux signalements communautaires de redémarrages en boucle** (environ 10 à 60 minutes, deux modèles) ; 4.5.2 ne met à jour que l’application au-dessus de 4.5.1                                                                                                                                                                                                                                                                                                                                        | Remplacées par des versions ultérieures. Restez en **4.0.12** pour privilégier la stabilité, ou testez une version plus récente sur un seul panneau d’abord.                                                                                                                                                                                                        |
| **4.5.3**                                      | Découverte automatique Matter et optimisations de gestion d’écran ; différentiel ROM sur le 120P mais application seule sur le 86P                                                                                                                                                                                                                                                                                                                                                                           | Aucune preuve de boucle de redémarrage propre à 4.5.3 ; remplacée par des versions ultérieures.                                                                                                                                                                                                                                                                     |
| **4.6.0** (juin 2026)                          | **Portail web local** (`nspanelpro.local` : configuration LAN, export MQTT Discovery vers Home Assistant, Matter Bridge) ; inspection CDN : différentiels depuis 4.0.12, 4.4.0 et 4.5.1                                                                                                                                                                                                                                                                                                                      | Documentée dans le journal public Sonoff. **4.6.2** est indexée comme application seule sans différentiel ROM sur aucun canal ; aucune 4.6.1 trouvée.                                                                                                                                                                                                               |
| **4.7.0** (juillet 2026)                       | Abordée dans un fil de retours eWeLink mais **absente du journal public Sonoff** ; concerne Gen1 et Gen2 ; des utilisateurs signalent l’ajout des relais Basic gen-5 (BASIC-1GS) ; inspection CDN : différentiels entrants depuis 4.0.12, 4.4.0, 4.5.1 et 4.6.0 sur les deux modèles, plus 4.5.3 sur le 120P seul                                                                                                                                                                                            | Signalements communautaires de problèmes de connexion des sous-appareils, parfois résolus par redémarrage, parfois persistants ; non vérifiés. Vérifiez sur un panneau avant un déploiement plus large.                                                                                                                                                             |
| **4.8.0** (août 2026)                          | **Aucune annonce de sortie ni journal trouvés** ; version localisée en sondant le CDN. Un message d’un membre du personnel eWeLink du 2026-07-16 dans le [fil de feuille de route](https://forum.ewelink.cc/t/nspanel-pro-roadmap-and-co-created-future/206240) la prévoyait pour août et confirmait une fonction : la mise à jour automatique du panneau via eWeLink. Inspection CDN : différentiels entrants depuis 4.0.12, 4.4.0, 4.5.1, 4.6.0 et 4.7.0 sur les deux modèles, plus 4.5.3 sur le 120P seul | Autre contenu inconnu et aucun fil de retours trouvé : aucun témoignage sur la stabilité dans un sens ou l’autre. Considérez-la comme non évaluée, plutôt que sans défaut. **Si la mise à jour automatique est activée par défaut, le panneau pourrait installer un micrologiciel sans intervention** ; vérifiez ce réglage avant de compter sur une version figée. |

:::note
Ces particularités concernent les 86P et 120P d’origine. Le NSPanel Pro **Gen2** (RK3326-**S**, deux relais, EFR32**MG24**) est un matériel différent. Sonoff utilise la même série de versions pour Gen1 et Gen2 (4.7.0 couvre les deux) ; n’en déduisez pas une série distincte et ne supposez pas que chaque remarque sur le modèle d’origine s’applique. Le profil NSPanel Pro d’origine correspond à tout panneau annonçant un nom de carte PX30 ou RK3326 : un Gen2 qui le fait y correspond donc jusqu’à disposer de son propre profil. Ce profil n’a pas été testé sur Gen2 et n’expose pas ses relais.
:::

Les cartes apparentées Tuya **S6E** et **T6E** (variantes à relais ; le S6E est un T6E à deux relais), le [**Smatek S9E**](/fr/hardware/panels/smatek/s9e/) et le [**Tuya TPA10**](/fr/hardware/panels/tuya/tpa10/) (RK3566, Cortex-A55, Android 11) sont des matériels distincts et n’exécutent pas le micrologiciel NSPanel Pro.

:::danger
La détection ne peut pas reposer sur `ro.product.model`, car les deux variantes annoncent `px30_evb`. Utilisez `ro.product.version`, les mesures d’écran ou `ro.board.platform` pour distinguer 86P et 120P. La proximité varie aussi selon le modèle et le micrologiciel ; la configuration guidée calibre les mesures actuelles et enregistre le résultat au lieu de choisir un classificateur propre au micrologiciel.
:::

<a id="gaining-adb-and-root-access"></a>

## Obtenir l’accès adb et root

Contrairement au TPA10, le NSPanel Pro n’a **aucun mot de passe adb**. Il est livré en version `userdebug` avec des clés de test (`ro.debuggable=1`) ; `adb root` fonctionne et `/system` peut être remonté. La seule difficulté est d’_atteindre_ les options pour les développeurs, masquées différemment selon la version eWeLink. Synthèse des guides de blakadder ([installation d’APK](https://blakadder.com/nspanel-pro-sideload/), [secrets](https://blakadder.com/nspanel-pro-secrets/)).

**Premier accès (86P et 120P).** La possibilité d’activer ADB réseau sur le port TCP 5555 sans ordinateur dépend du micrologiciel ; aucun interrupteur universel sur le panneau n’est établi. La voie du mode développeur eWeLink ci-dessous est documentée pour les versions indiquées, sans établir TCP5555 sur toutes les suivantes. Si ADB réseau est indisponible, utilisez la voie USB documentée pour votre micrologiciel. Les commandes root ne permettent pas le premier accès.

**1. Activer adb.** La voie dépend du micrologiciel :

- **Ancien micrologiciel :** ouvrez le boîtier (retirez les vis arrière et débranchez le connecteur tactile) pour exposer le port USB OTG, puis branchez un ordinateur ; adb fonctionne directement en USB.
- **Micrologiciel 1.3.2 et ultérieur :** dans l’**application eWeLink**, ouvrez les _Paramètres de l’appareil_ et touchez huit fois l’**ID de l’appareil** pour activer le mode développeur, qui rétablit adb.
- **Micrologiciel 1.4 et ultérieur** (mode développeur retiré) : effectuez **cinq cycles d’alimentation** pendant l’animation de démarrage Sonoff pour forcer le démarrage de récupération ; pendant cette fenêtre, exécutez `adb install ultra-small-launcher.apk`. Après redémarrage, définissez ce lanceur par défaut, puis touchez sept fois _Paramètres, Système, À propos de la tablette, Numéro de build_ pour réactiver les options pour les développeurs et le débogage USB.

**2. Passer à adb réseau**, pour garder le boîtier fermé :

```bash
adb tcpip 5555
adb shell ip -o a            # find the panel IP
adb connect <panel-ip>:5555
adb shell su 0 setprop persist.adb.tcp.port 5555   # survive reboot (service prop resets)
```

**3. Root.** La version étant `userdebug`, `adb root` donne immédiatement un shell adbd root. L’application appelle `su` depuis son bac à sable ; installez donc un `su` persistant dans `/system`. **SuperSU `su` 2.76** à `/system/xbin/su` est la version testée :

```bash
adb root
adb disable-verity          # only if remount is refused; this reboots the panel
adb remount                 # or: adb shell mount -o remount,rw /system
adb push su /system/xbin/su
adb shell chmod 06755 /system/xbin/su
```

:::danger
Ne désactivez les applications eWeLink (`com.eWeLinkNSPro.dev`, `com.eWeLinkControlPanel`) qu’**après** avoir fiabilisé adb et `su` et disposer d’une autre voie pour Accueil et Retour ; les actions de navigation de l’application du panneau le permettent. La pile **passerelle Zigbee** eWeLink est indépendante de ces applications et continue à fonctionner ; gérez-la avec l’[interrupteur du routeur Zigbee](#zigbee-gateway) plutôt que de la supprimer.
:::

<a id="webview-update-this-first"></a>

## WebView : commencer par sa mise à jour

Un 86P fraîchement réécrit en micrologiciel `3.5.1` (build `164637`) a été vérifié avec `com.android.webview` **107.0.5304.105** (Chromium 107), trop ancien pour afficher un tableau de bord Home Assistant actuel. Les autres micrologiciels et modèles peuvent différer : vérifiez le fournisseur installé avant de décider d’une mise à jour. Les différentiels OTA archivés ne contiennent pas d’APK WebView ; cette version a donc été lue sur l’appareil réel avec `dumpsys webviewupdate`. Cet appareil exécute Chromium **138** après une mise à jour adb. L’installation et les mises à jour de l’application du panneau lancées depuis Home Assistant peuvent installer un WebView compatible vérifié. Si cette tentative reste inachevée, choisissez **Réessayer** dans la réparation de mise à jour du panneau pour la poursuivre. Le repli manuel est une mise à jour adb ; voir [Mettre à jour le WebView système](/fr/hardware/guides/update-the-webview/#solution-manuelle-de-repli).

## LED

Aucun nœud RVB `/sys/class/leds` ni `/dev/ledjni` n’a été trouvé sur cet appareil : **aucune LED RVB contrôlable par l’application ou sysfs n’est caractérisée** sur le NSPanel Pro (à comparer au nœud `avsux` du TPA10 et au `/dev/ledjni` du WF1589T). Luminosité et rétroéclairage utilisent les voies Android standard.

<a id="sensors-light-and-proximity-are-app-direct"></a>

## Capteurs : lumière et proximité directement accessibles à l’application

Contrairement au TPA10, dont température et humidité sont réservées à root, le NSPanel Pro expose son capteur combiné Sensortek via le `SensorManager` standard : `android.sensor.light`, `android.sensor.proximity` et `android.sensor.accelerometer`, tous lisibles sans root par une application normale. L’application du panneau y lit directement lumière et proximité. Aucun capteur de température ni d’humidité n’est installé.

:::note
**Les mesures de proximité dépendent du micrologiciel et du modèle.** Le capteur est un Sensortek STK3A5x dans une découpe du circuit supérieur, derrière la vitre. La valeur de repos varie beaucoup selon l’appareil (environ 1000 sur l’un, 4000 sur un autre) ; seule la variation _relative_ importe : une valeur de repos élevée est normale, pas un défaut. Jusqu’au micrologiciel **3.3** environ, il fournit une mesure graduée toutes les 50 ms environ ; vers **3.3 à 3.4**, le pilote du noyau est passé à une valeur binaire 0 ou 1. **4.0.12 n’a rétabli les mesures graduées que sur le 86P** ; le **120P est resté binaire**. La configuration guidée calibre l’un ou l’autre signal et enregistre le résultat ; le panneau normalise ensuite la plage utile entre vos panneaux. Les profils ne codent donc ni seuils propres au micrologiciel ni classificateurs gradués ou binaires. (Sources : tickets des outils de seaky [142](https://github.com/seaky/nspanel_pro_tools_apk/issues/142), [144](https://github.com/seaky/nspanel_pro_tools_apk/issues/144), [171](https://github.com/seaky/nspanel_pro_tools_apk/issues/171) et [262](https://github.com/seaky/nspanel_pro_tools_apk/issues/262).)
:::

<a id="bound-ic-devices"></a>

### Périphériques I²C associés

| Adresse I²C         | Pilote ou nom                | Fonction                                                           |
| ------------------- | ---------------------------- | ------------------------------------------------------------------ |
| `0-0020`            | `rk809`                      | PMIC                                                               |
| `1-001a` / `1-005a` | `CST226` / `CST226SE`        | Contrôleur tactile capacitif Hynitron                              |
| `2-003c`            | `tp`                         | panneau tactile                                                    |
| `2-0046`            | `ls_stk3a5x` et `ps_stk3a5x` | Sensortek **STK3A5x** combinant lumière ambiante et proximité      |
| `2-0047`            | `ls_stk3x3x` et `ps_stk3x3x` | Sensortek **STK3x3x**, lumière et proximité (composant alternatif) |

<a id="zigbee-gateway"></a>

## Passerelle Zigbee

Le NSPanel Pro intègre une **radio Zigbee 3.0 Silicon Labs EFR32** sur l’UART `/dev/ttyS5`, pilotée par la pile hôte du fabricant (`/vendor/bin/siliconlabs_host/zgateway`) via un broker MQTT local. Les applications eWeLink utilisent la même pile, d’où la fonction de hub Zigbee eWeLink fournie d’origine.

L’application du panneau la gère directement. `switch.<panel>_zigbee_router` transforme le panneau en **routeur** Zigbee qui étend votre maillage existant (démarrage de la passerelle et activation du rôle Repeater), puis le désactive (arrêt de la passerelle et libération de la radio). Cela passe par le broker local, sans identifiants ni manipulation directe de `ttyS5`. Le panneau apparaît alors comme routeur normal dans votre coordinateur ZHA ou Zigbee2MQTT.

:::note
Changer de rôle **ne réécrit pas le micrologiciel** : aucune étape `.gbl` ou chargeur de démarrage ; seul le type de nœud EZSP est réglé. Pour le travail sur les partitions du micrologiciel, voir [Sauvegarder et restaurer le micrologiciel](/fr/hardware/guides/firmware-backup-and-restore/).
:::

:::note
**Aucun routeur de bordure Thread n’est documenté ni caractérisé.** La pile du fabricant utilise l’EFR32 comme NCP Zigbee. Le silicium EFR32MG21 sait gérer plusieurs protocoles, mais cela n’établit ni micrologiciel Thread ni routeur de bordure sur le panneau ; Sonoff documente plutôt un Matter Bridge.

**Le micrologiciel 4.x a remanié la pile Zigbee.** L’inspection communautaire a trouvé un dérivé de Zigbee2MQTT, un mot de passe MQTT local modifié et une séquence de démarrage différente. [Sonoff documente la bascule coordinateur/routeur](https://sonoff.tech/blogs/news/nspanel-pro-v4-3-0-central-heating-redefining-whole-home-temperature-automation) dans les versions actuelles, mais la voie de contrôle par broker local de l’application a été développée sur 3.x et antérieur et **peut nécessiter une adaptation pour 4.x**. (Sources communautaires : tickets des outils de seaky [241](https://github.com/seaky/nspanel_pro_tools_apk/issues/241), [244](https://github.com/seaky/nspanel_pro_tools_apk/issues/244) et [255](https://github.com/seaky/nspanel_pro_tools_apk/issues/255), et [ticket roottool 3](https://github.com/seaky/nspanel_pro_roottool_apk/issues/3).)
:::

:::caution
**Un défaut du watchdog Zigbee historique du fabricant est confirmé par un signalant sur NSPanel Pro 120 en micrologiciel d’origine 3.8.0.** Les micrologiciels contenant l’affectation récursive `LD_LIBRARY_PATH` décrite dans [son ticket](https://github.com/panel-assistant/android/issues/34) peuvent finir par faire échouer chaque commande externe lancée par le watchdog avec `E2BIG`, consommer un cœur CPU et cesser de récupérer un `zgateway` arrêté. Un redémarrage ne résout le problème que temporairement. Voir [Optimiser les performances](/fr/manage/performance/) pour les preuves et conditions d’une réparation sûre. Le contournement proposé n’a pas été validé indépendamment. L’inspection communautaire de 4.0.12 et 4.6.0 n’a pas trouvé l’affectation vulnérable.
:::

<a id="requirements-firmware-220-or-later"></a>

### Prérequis : micrologiciel 2.2.0 ou ultérieur

La pile hôte est la passerelle eWeLink et Sonoff **du fabricant**, avec une version correspondant au micrologiciel (par exemple `sonoff-v3.5.4`). Le **mode routeur** Zigbee est arrivé avec **NSPanel Pro 2.2.0** (2023 ; application eWeLink, _Paramètres de l’appareil, Fonctions pilotes, Mode Zigbee_), et la prise en charge du répéteur dans la pile hôte locale avec le paquet passerelle 1.1.9. En pratique :

- **Passerelle présente** (micrologiciel 2.2.0 ou ultérieur, ou installation manuelle) : l’application la détecte et publie `switch.<panel>_zigbee_router`. Activez-le et le panneau rejoint votre coordinateur comme routeur.
- **Pas de passerelle** (très ancien micrologiciel, jamais provisionné) : l’interrupteur **n’apparaît pas**, car il dépend de la présence du script de lancement. Mettez le micrologiciel à jour vers 2.2.0 ou ultérieur.

L’application **pilote** la passerelle ; elle ne la fournit ni ne l’installe, car c’est le binaire eWeLink. Le micrologiciel 4.x ajoute un pont Matter et peut exporter les appareils Zigbee vers Home Assistant via MQTT Discovery, comme autres options au rôle routeur.

<a id="gateway-health-and-automatic-containment"></a>

### Santé de la passerelle et limitation automatique

Sur un panneau compatible Zigbee, `sensor.<panel>_zigbee_gateway_health` indique l’état de la pile du fabricant indépendamment de l’interrupteur routeur : une passerelle d’origine non configurée reste visible sans autoriser l’application à l’arrêter.

Lorsque l’interrupteur routeur a été activé explicitement, l’application accorde 15 minutes pour démarrer et s’appairer, puis recherche chaque minute deux signatures d’emballement : réseau explicitement invalide ou non rejoint avec plus de 50 % d’un cœur CPU pendant cinq échantillons consécutifs, ou au moins trois changements d’identifiant de processus passerelle en dix minutes. Un routeur connecté avec un CPU durablement élevé produit seulement un avertissement et continue à fonctionner. Les architectures 4.x inconnues, ou l’absence de preuve de connexion propre au micrologiciel, aboutissent prudemment à `unknown`.

L’activation de l’interrupteur routeur demande explicitement le mode Repeater même si la passerelle du fabricant fonctionne déjà. L’activer lorsque votre coordinateur ZHA ou Zigbee2MQTT autorise les connexions constitue donc une nouvelle tentative, sans démarrer un second superviseur de passerelle.

L’onglet Configurer affiche une action **Demander l’association** juste sous l’interrupteur routeur Zigbee ; l’interrupteur reste la seule commande marche/arrêt. Activez l’autorisation de connexion dans ZHA ou Zigbee2MQTT, demandez ensuite la connexion et confirmez que cette autorisation est ouverte. L’action réaffirme le mode Repeater, démarre un nouveau délai de grâce de 15 minutes et interroge l’état de santé ; elle ne redémarre pas le panneau. Le bouton est indisponible si le routeur est désactivé, déjà connecté ou en attente après une demande récente.

Après le délai de grâce, une passerelle activée toujours non connectée produit un avertissement persistant sur le tableau de bord et dans l’onglet Installer, avec un lien vers cette action de Configurer. Ne la laissez pas ainsi : les tentatives répétées peuvent consommer beaucoup de CPU. Connectez le panneau comme routeur ou désactivez l’interrupteur routeur Zigbee.

Si une passerelle historique configurée remplit une règle d’emballement, l’application désactive durablement l’interrupteur routeur et tente une seule limitation bornée. La limitation native du fabricant ne peut cibler que le superviseur Sonoff, `zgateway` et le broker local correspondant. Si un processus ne peut pas être arrêté, son mécanisme de relance est retiré lorsque possible et les tâches passerelle survivantes passent à nice 19 et au cpuset d’arrière-plan Android. Réactiver ensuite l’interrupteur démarre un nouveau délai de grâce et une nouvelle tentative.

Les attributs de santé comprennent versions du micrologiciel et du produit, architecture et version du paquet passerelle, état de connexion et de rôle, CPU arrondi de la passerelle et du superviseur, nombre de redémarrages récents et résultat de la limitation. Ils ne contiennent jamais la clé du réseau Zigbee, les identifiants bruts du broker local, l’adresse MAC de la radio ni le `netinfo` brut de la passerelle.

<a id="migrating-from-nspaneltools"></a>

### Migrer depuis NSPanelTools

Si NSPanelTools a installé la passerelle Sonoff sur un ancien panneau, la pile hôte dans `/vendor` survit à sa suppression. Supprimez NSPanelTools avant d’activer les commandes d’écran et de capteurs Panel Assistant pour éviter les actions en double. Panel Assistant peut piloter la passerelle existante ; si l’interrupteur routeur reste activé, il démarre la passerelle au démarrage même si l’ancien mécanisme de démarrage a été retiré.

<a id="ezsp-host-stack-internals"></a>

### Détails internes de la pile hôte EZSP

Sur la pile historique native du fabricant (3.x et antérieur), la radio exécute le **micrologiciel NCP EZSP** (EFR32MG21, EZSP v8). `zgateway` est un binaire _hôte_ EZSP dans `/vendor/bin/siliconlabs_host/`, maintenu par son superviseur `guard_process.sh` (boucle de 5 secondes, lancée au démarrage) et contrôlé via un **broker mosquitto local** à `127.0.0.1:1883`. Le broker est anonyme : la ligne `password_file` est commentée dans `mosquitto.conf`. La pile 4.x diffère comme décrit ci-dessus.

- État du rôle : `zigbee/system/network-role/information` renvoie `{"role":"Repeater"|"Coordinator"}`
- Changement de rôle : publier `{"role":"Repeater"}` sur `zigbee/system/network-role/switch`

« Repeater » est le mode routeur, qui étend un maillage existant ; le rôle persiste dans la mémoire non volatile du NCP. Le `zgateway` du fabricant survit à la suppression des _applications_ eWeLink, car il réside dans `/vendor`, pas dans un APK.

Pour un coordinateur Zigbee2MQTT ou ZHA autonome complet _sur le panneau_, voir plutôt [seaky/nspanel_pro_zigbee](https://github.com/seaky/nspanel_pro_zigbee), qui remplace la pile hôte. Cette solution est plus lourde et n’est pas ce que fait l’application du panneau.

<a id="access-model-summary"></a>

## Résumé des accès

- **Lumière, proximité, accéléromètre :** accès direct de l’application (`SensorManager`).
- **Luminosité, veille, navigation, synthèse vocale :** voies Android standard (`su` pour une vraie extinction du rétroéclairage).
- **LED :** aucune caractérisée.
- **Zigbee :** radio EFR32 gérée via le broker local de la passerelle sur l’appareil (`switch.<panel>_zigbee_router`).
- **Radios :** Zigbee 3.0, Wi-Fi et Bluetooth.

<a id="performance-expectations"></a>

## Performances attendues

Le NSPanel Pro est **limité en CPU et en RAM** pour les tableaux de bord riches :

- Au repos, il tourne à 408 MHz avec environ 500 MB de RAM utilisés ; un tableau de bord lourd sollicite fortement les deux.
- **Les 2 GB de RAM constituent la limite principale.** WebView du tableau de bord, Android et applications d’arrière-plan se les partagent. Les grands tableaux de bord avec de nombreuses cartes, grosses images, longs historiques ou cartes personnalisées coûteuses provoquent des rechargements WebView et des saccades.
- Les cœurs A35 rendent transitions et animations nettement plus lentes que sur les panneaux A55 ou A72.

Avec le moteur de rendu intégré, commencez par le filtre automatique des entités du tableau de bord décrit dans [Optimiser les performances](/fr/manage/performance/), pour que le panneau ne traite pas les états que son tableau de bord n’affiche jamais. Utilisez ensuite les cartes de performances de l’onglet Tableau de bord pour trouver les vues encore lourdes, la pression mémoire ou les limites thermiques avant de simplifier le tableau de bord.
