---
title: Smatek S9E
description: Caractéristiques du Smatek S9E, un panneau encastrable Rockchip RK3566 de 10.1 pouces avec deux relais secteur, quatre boutons rétroéclairés, proximité radar, Zigbee, Ethernet et RS485.
vendor: Smatek
model: S9E
soc: Rockchip RK3566
android: '11'
screen: 10.1 in, 1920 × 1200
support: Testé par la communauté
root: Relais, LED des boutons, proximité (su applicatif signalé fonctionnel)
webview: Chromium 83 en 2024-07 ; 131 en 2025-12
released: 'pas avant 2021 (est., SoC RK3566)'
photos:
  - src: 'asset:hardware-smatek-s9e-front.jpg'
    alt: Smatek S9E, avant et arrière, montrant le câblage des relais et des borniers
photoCredit: 'Photo: Smatek'
sold_as_note: 'Version Zigbee (Tuya) avec deux relais secteur, AC 100-240 V'
sold_as:
  - brand: Smatek
    name: 'S9E-NZ'
    note: 'Version Android sans passerelle Zigbee : RS485, quatre boutons, AC 100-240 V'
  - brand: Smatek
    name: 'S9PE-NZ'
    note: 'Comme le S9E-NZ, alimenté par Ethernet (PoE) ou DC 9-24 V au lieu du secteur'
evidence: [firmware, documented, platform, owners]
sidebar:
  label: S9E
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Aucune note de version du fabricant n’a été trouvée pour les versions documentées ici. Le comparatif ci-dessous provient de l’examen des images fournies, et non d’un journal des modifications du fabricant.

:::note
Contrairement aux panneaux entièrement pris en charge, le S9E n’a **pas** été rétroconçu sur un exemplaire disponible. Les caractéristiques proviennent de l’annonce Smatek, et les chemins de commande de [seaky/nspanel_pro_tools_apk, ticket 98](https://github.com/seaky/nspanel_pro_tools_apk/issues/98), du fil communautaire Home Assistant et de rapports d’utilisateurs. Un propriétaire a actionné les relais et les LED des boutons depuis Home Assistant sous le micrologiciel 1.1.0 ([ticket 93](https://github.com/panel-assistant/android/issues/93)) ; considérez les autres détails des chemins de commande comme non confirmés avant validation.
:::

Un panneau encastrable RK3566 de 10.1 pouces **1920×1200**, de la même famille de SoC que le TPA10, avec **deux relais secteur intégrés**, quatre boutons rétroéclairés par LED, un capteur de proximité radar, et **Zigbee, Ethernet et RS485**.

## Accès initial au débogage

**ADB réseau sur le port TCP 5555 sans ordinateur : non établi.** Le fait qu’un propriétaire utilise Panel Assistant ou qu’un micrologiciel propose root n’établit pas comment activer le débogage sur un panneau neuf.

**La procédure initiale de débogage USB n’est pas établie non plus.** Demandez au fournisseur les instructions de débogage correspondant à votre micrologiciel exact et la confirmation d’un port USB de données. S’il propose le débogage USB, utilisez l’[installateur USB](/fr/install/install-over-usb/) ; ne supposez pas qu’un port de charge fournit ADB. Aucune séquence de menu d’usine vérifiée n’est disponible ici.

Les vérifications root nécessitent une connexion ADB déjà fonctionnelle. L’accès root et l’accès initial au débogage sont deux questions distinctes.

## Également vendu sous les noms

Smatek S9E, Smatek S9, S9E-NZ (sans passerelle Zigbee), S9PE, S9PE-NZ (variante PoE), `Build.MODEL` S9, `Build.DEVICE` rk3566_r, `ro.product.version` S9_Android_1.0.2 et S9_Android_1.1.0.

:::tip
Les faits essentiels : il partage la plateforme **RK3566** du TPA10, donc les fonctions applicatives fonctionnent probablement sans code propre au S9E. Les **relais commutent des charges secteur** (sysfs root, fonctionnement signalé par un propriétaire en 1.1.0). Les boutons émettent les KeyEvents **`F1` à `F4`** (directement accessibles à l’application, sans root). Vérifiez d’abord le WebView : le micrologiciel 2024-07 fournit **Chromium 83**.
:::

|                 |                                                                                                                                                                                                                                                                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC             | Rockchip **RK3566** (quatre Cortex-A55), même famille de SoC que le TPA10                                                                                                                                                                                                                                                                                               |
| RAM et stockage | **2 GB** de RAM, **16 GB** eMMC                                                                                                                                                                                                                                                                                                                                         |
| Écran           | **10.1 pouces**, **1920×1200** multipoint                                                                                                                                                                                                                                                                                                                               |
| Android         | 11                                                                                                                                                                                                                                                                                                                                                                      |
| Connectivité    | Wi-Fi, Bluetooth, **Zigbee**, **Ethernet RJ45**, **RS485** (une variante PoE, le **S9PE**, existe aussi)                                                                                                                                                                                                                                                                |
| Capteurs        | **radar** de proximité, **lumière** ambiante, **température et humidité**                                                                                                                                                                                                                                                                                               |
| Entrées         | **4 boutons physiques** avec LED individuelles                                                                                                                                                                                                                                                                                                                          |
| Relais          | **2 relais secteur intégrés**                                                                                                                                                                                                                                                                                                                                           |
| Root            | l’application du fabricant utilise `execRootCmd`, donc root est disponible ; certains exemplaires sont livrés avec le mode développeur déverrouillé. Le rapport d’un propriétaire montre `su` accessible depuis une application normalement isolée en 1.1.0 ; cela détermine si l’application pilote directement les nœuds sysfs ou nécessite le démon auxiliaire root. |
| Sortie          | Date incertaine ; la famille de SoC RK3566 n’est arrivée sur le marché que vers 2021, meilleure borne inférieure trouvée pour ce panneau ([article sur la fiche RK3566, CNX Software, décembre 2020](https://www.cnx-software.com/2020/12/16/rockchip-rk3566-and-rk3568-datasheets-and-features-comparison/))                                                           |

:::danger
Les commandes ci-dessous sont des écritures **sysfs root**, et les relais commutent des **charges secteur**. La prise en charge est implémentée à partir des chemins signalés ; un propriétaire signale les relais et les LED des boutons fonctionnels en 1.1.0. Le chemin `st_relay` en 1.0.2 est **non confirmé** : validez-le sur votre S9E avant de vous y fier.
:::

:::tip
Comme le S9E partage la plateforme **RK3566** du TPA10, les fonctions applicatives existantes fonctionnent probablement sans code propre au S9E ; température, humidité et lumière peuvent apparaître via `SensorManager`. Sur l’ancien micrologiciel, le **WebView fourni est très ancien (Chromium 83)** : mettez-le donc à jour d’abord avec Magisk OpenWebView, le micrologiciel 2025-03-24 ou un SystemWebView installé manuellement. Celui de 2025-12 fournit déjà Chromium 131. Voir [Mettre à jour le WebView système](/fr/hardware/guides/update-the-webview/).
:::

:::tip
Le S9E a quatre boutons de fonction en façade, mais aucune combinaison alimentation-volume de récupération documentée. Sa table de partitions, sa voie root et sa procédure de récupération n’ont pas été relevées sur du matériel en fonctionnement : n’appliquez donc pas tel quel le [guide de sauvegarde du micrologiciel](/fr/hardware/guides/firmware-backup-and-restore/) des TPA10 et WF1589T.
:::

## Versions du micrologiciel

Deux images d’origine ont été analysées. Ce sont des fichiers OTA `.zip` par blocs au format de partitions dynamiques AOSP : décompressez les `.new.dat.br` avec `brotli -d`, extrayez l’image super avec `lpunpack`, puis recherchez dans `build.prop` et les fichiers init `.rc` avec `strings`. Les deux indiquent `Build.MODEL` **`S9`**, `Build.DEVICE` **`rk3566_r`**, Android 11 ; le code de version du fabricant est dans **`ro.product.version`** :

| Image                              | `ro.product.version` | Version                      | Classe relais         |
| ---------------------------------- | -------------------- | ---------------------------- | --------------------- |
| `S9_1920x1200_20240712_Android_US` | `S9_Android_1.0.2`   | `eng.*.20240712`             | `/sys/class/st_relay` |
| `S9_1920x1200_20251202_Android_US` | `S9_Android_1.1.0`   | `eng.xiaolp.20251202.160404` | `/sys/class/strelay`  |

:::caution
**La classe sysfs des relais a changé de nom entre les versions.** Seule l’image **initiale** (1.0.2) utilise `/sys/class/st_relay` ; **toutes les images plus récentes** (1.1.0 et suivantes) utilisent `/sys/class/strelay`, confirmé par [un utilisateur](https://github.com/panel-assistant/android/issues/3) et par la comparaison des micrologiciels. L’application sonde les deux noms et utilise celui exposé par le panneau ; voir [Relais](#relais--classe-strelay-ou-st_relay-root).
:::

Les deux images ont été partagées par l’utilisateur depuis Smatek : `S9_1920x1200_20240712_Android_US` (**1.0.2**) et `S9_1920x1200_20251202_Android_US` (**1.1.0**). Les liens de téléchargement Smatek d’origine sur `docs.smatek.store:10001` ne sont plus accessibles ; contactez l’assistance Smatek ou l’auteur du rapport pour en obtenir une copie.

La comparaison des deux images montre que **seuls `ro.product.version` et la classe relais diffèrent.** Tous les autres chemins de commande documentés ci-dessous (codes des boutons, GPIO des LED, GPIO de proximité, câblage des capteurs) sont identiques. Une détection fondée sur `ro.product.version` commençant par `S9` couvre donc toute la gamme.

## Relais : classe `strelay` ou `st_relay` (root)

L’application expose les deux relais secteur comme `switch.<panel>_relay1` et `switch.<panel>_relay2`, uniquement sur un panneau possédant la classe sysfs relais.

:::note
**Le nom de classe dépend du micrologiciel** (voir [Versions du micrologiciel](#versions-du-micrologiciel)) : `st_relay` sur l’image initiale 1.0.2, `strelay` en 1.1.0 et suivantes. L’application sonde **les deux** et utilise celui exposé par le panneau.
:::

```bash
# firmware 1.1.0+ (most panels in the field)
echo 1 > /sys/class/strelay/relay1    # on
echo 0 > /sys/class/strelay/relay1    # off
echo 1 > /sys/class/strelay/relay2

# firmware 1.0.2 (initial release)
echo 1 > /sys/class/st_relay/relay1
```

## Boutons : KeyEvents `F1` à `F4` (accès applicatif direct)

Les quatre boutons émettent les codes de touche Android standard **131 à 134**, `KEYCODE_F1` à `KEYCODE_F4`. La capture d’accessibilité de l’application les rapporte dans `event.<panel>_button` (types d’événement `KEYCODE_F1` à `KEYCODE_F4`) ; associez-leur des actions de tableau de bord dans Home Assistant. Ces événements ne nécessitent pas root.

## LED : rétroéclairage GPIO par bouton

Chaque bouton possède une LED dans `/sys/class/gpio/gpio<16+keycode>/value`, soit les GPIO **147 à 150** pour F1 à F4. Chacune est monochrome et allumée ou éteinte. L’application les expose de `light.<panel>_button_led1` à `light.<panel>_button_led4` (commutées via `su`), à partir du `hardware.button_led_gpio_base` du profil. Ces LED ne sont **pas** dans `/sys/class/leds`, qui ne contient sur le S9E que la LED de carte SD `mmc2::` ; ce sont des GPIO bruts.

:::note
**Analyse du micrologiciel :** les scripts init n’exportent **que `gpio113`**. Les broches LED **gpio147 à gpio150 ne sont pas exportées au démarrage** : leurs nœuds `/sys/class/gpio/gpioNNN/value` n’existent donc pas avant exportation. L’application exporte chaque broche à la demande et la configure en sortie avant la première écriture ; cela explique le fonctionnement des LED malgré l’absence d’exportation au démarrage.
:::

```bash
echo 147 > /sys/class/gpio/export        # one-time, if the node is absent
echo 1 > /sys/class/gpio/gpio147/value   # button F1 LED on
```

:::tip
Le micrologiciel comprend aussi une **LED d’état RGB** (`led_r`, `led_g`, `led_b`), un **moteur de vibration** et des **LED d’activité Ethernet**. L’application n’en expose aucun.
:::

## Capteurs : proximité par GPIO 18, sans `SensorManager`

:::caution
Un capteur de proximité est _enregistré_ dans `SensorManager`, annonçant `Proximity=yes · Binary · 0/1 cm`, mais sur le S9E il **ne délivre jamais d’événements**. Les relevés en direct d’un utilisateur, dans [un rapport complémentaire](https://github.com/panel-assistant/android/issues/5), ont établi le silence de cette voie Android. Le capteur de lumière du même panneau fonctionne (environ 46 lx) ; le problème est donc propre à la proximité. Le véritable signal se lit sur `gpio18`.
:::

Le véritable signal est une **lecture GPIO root sur GPIO 18**. Le noyau enregistre un capteur Android fantôme qui ne se déclenche jamais ; il faut donc lire la valeur dans sysfs :

```bash
cat /sys/class/gpio/gpio18/value   # 1 = near, 0 = far  (no export needed — reporter-confirmed)
```

Le profil S9E déclare donc `sensors.proximity_gpio: 18` au lieu d’utiliser la source `SensorManager` inactive. L’auxiliaire root garde le descripteur de valeur ouvert et transmet immédiatement les changements si le noyau prend en charge les fronts GPIO ; sinon, il relit le même descripteur deux fois par seconde. La perte du descripteur est signalée explicitement : Home Assistant affiche alors le capteur indisponible jusqu’à ce que le flux rétabli fournisse sa valeur actuelle. Le signal utilise la même configuration guidée et le même étalonnage enregistré que les capteurs Android ; la présence étalonnée et les gestes deviennent disponibles après une configuration réussie. Un utilisateur a confirmé que gpio18 vaut **0 loin, 1 proche** ; la configuration guidée mesure les extrémités plutôt que de supposer une polarité. Lumière ambiante, température et humidité apparaissent via `SensorManager` comme prévu.

## Résumé du modèle d’accès

- **Relais :** `switch.<panel>_relay1` et `switch.<panel>_relay2` via la classe sysfs relais (root) ; `strelay` et `st_relay` sont tous deux sondés.
- **Boutons :** `event.<panel>_button` (`KEYCODE_F1` à `KEYCODE_F4`), accès applicatif direct via l’accessibilité.
- **LED des boutons :** `light.<panel>_button_led1` à `light.<panel>_button_led4` via `su` (GPIO 147 à 150, exportés à la demande).
- **Proximité :** `binary_sensor.<panel>_proximity` étalonné et `sensor.<panel>_proximity_level` normalisé à partir du flux d’événements `gpio18` maintenu par l’auxiliaire root. Le capteur de proximité `SensorManager` s’enregistre mais ne se déclenche jamais ; il est donc contourné.
- **Lumière :** `sensor.<panel>_illuminance` via `SensorManager`, qui **fonctionne**.

## Sources

- [Rapport Smatek S9E sur GitHub](https://github.com/panel-assistant/android/issues/3) : `/diag` de l’utilisateur (chaînes de détection, proximité `SensorManager`), changement de classe relais de `st_relay` à `strelay`, et les deux images de micrologiciel.
- Micrologiciels Smatek S9E d’origine partagés par cet utilisateur : 1.0.2 (20240712) et 1.1.0 (20251202), les deux images analysées. Les liens Smatek d’origine (`docs.smatek.store:10001`) ne sont plus accessibles.
- [seaky/nspanel_pro_tools_apk, ticket 98, « Add Smatek S9E Support »](https://github.com/seaky/nspanel_pro_tools_apk/issues/98) : chemins de commande des relais (`st_relay`), boutons (codes 131 à 134), LED des boutons (GPIO 147 à 150) et proximité (GPIO 18).
- [Communauté Home Assistant : « Smatek S9E Touch Panel »](https://community.home-assistant.io/t/smatek-s9e-touch-panel/828244) : mise à jour WebView, scripts de proximité GPIO 18, notes d’intégration.
- [Page produit Smatek S9E](https://smatek.com/product/10-1-inch-smart-control-panel-s9e/) et [variante PoE S9PE-NZ](https://smatek.com/product/10-1-inch-android-panel-s9e-nz/) : SoC, RAM et stockage, écran, capteurs, connectivité.
- [Fiche technique Smatek S9E (PDF)](https://smatek.com/wp-content/uploads/2025/03/Smatek-S9E-10-Super-Smart-Control-Panelin-wall-SPEC.pdf) : numérisation composée uniquement d’images, sans extraction de texte possible, mais fiche technique source.
