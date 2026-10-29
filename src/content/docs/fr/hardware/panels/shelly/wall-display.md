---
title: Shelly Wall Display (original)
description: Caractéristiques matérielles du Shelly Wall Display d’origine, un panneau MT6580 de 4 pouces sous Android 7, nom de code Stargate.
vendor: Shelly
model: Wall Display (original)
soc: MT6580
android: '7.0'
screen: 4 in, 480 × 480
support: Recherche
root: Non établi ; compilation de base userdebug, non confirmé
webview: 'com.google.android.webview 119.0.6045.194 via le ZIP officiel'
released: '2023-09 (est.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-front.jpg'
    alt: Shelly Wall Display, modèle d’origine, avec son capteur accessoire H&T
  - src: 'asset:hardware-shelly-wall-display-rear-label.jpg'
    alt: Shelly Wall Display, arrière avec l’étiquette du modèle et le boîtier mural
photoCredit: 'Photo: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display (original)
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Recherche uniquement : aucun exemplaire de ce modèle n’a été testé.** Consultez la [page de la famille Wall Display](/fr/hardware/panels/shelly/) pour les sources, le mécanisme OTA du micrologiciel, le modèle d’accès et les notes de sécurité communs à toute la gamme.
:::

:::caution
**Livré sous Android 7.0**, une version inférieure au minimum pris en charge par Panel Assistant.
:::

Le Wall Display d’origine, nom de code du micrologiciel **Stargate**, est le modèle d’entrée de gamme de la [famille Shelly Wall Display](/fr/hardware/panels/shelly/) : un panneau de 4 pouces en 480×480 doté d’un MediaTek MT6580, sous Android 7. Il utilise l’ancienne branche OTA **WallDisplay** (armeabi-v7a), comme le [X2](/fr/hardware/panels/shelly/wall-display-x2/).

## Accès initial au débogage

**ADB réseau sur le port TCP 5555 sans ordinateur : non établi sur ce modèle.** Le débogage USB initial et le déverrouillage par le menu du fabricant ne sont pas non plus vérifiés ici. La [procédure du X2i](/fr/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) n’est confirmée que sur le X2i ; un micrologiciel commun ne prouve pas qu’elle fonctionne ici. Demandez à Shelly la procédure pour votre modèle et votre micrologiciel. N’utilisez l’[installateur USB](/fr/install/install-over-usb/) qu’une fois le débogage USB et une connexion USB de données disponibles. Une compilation capable de root ne suffit pas à activer le débogage.

## Également vendu sous les noms

Shelly Wall Display, SAWD-0A1XX10EU1, nom de code du micrologiciel Stargate, identifiant d’appareil k400_mt6580_32_n.

|                   |                                                                                                                                                                                                                                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC               | MediaTek **MT6580**                                                                                                                                                                                                                                                                                                  |
| Écran             | **480×480 carré**, 4 pouces                                                                                                                                                                                                                                                                                          |
| Android           | 7.0                                                                                                                                                                                                                                                                                                                  |
| ABI               | armeabi-v7a                                                                                                                                                                                                                                                                                                          |
| Capteurs          | Température, humidité et lumière ambiante documentées ; exposition par l’API Android non vérifiée                                                                                                                                                                                                                    |
| Relais            | 1 sortie                                                                                                                                                                                                                                                                                                             |
| WebView           | Absent de l’OTA standard ; Shelly publie un ZIP distinct installant `com.google.android.webview` **119.0.6045.194**                                                                                                                                                                                                  |
| Root              | Non établi sur ce modèle. L’OTA déclare une compilation de base `userdebug` (`alps/full_k400_mt6580_32_n/...:7.0/.../userdebug/test-keys`), donc `adb root` pourrait fonctionner **si** une connexion adb peut être établie, mais cela n’a pas été confirmé sur un exemplaire.                                       |
| Commercialisation | Vers septembre 2023 (est.) ; Shelly a présenté le Wall Display pour la première fois à l’IFA Berlin en septembre 2023 ([présentation de la gamme Shelly à l’IFA Berlin 2023, Maison et Objet Domotique](https://www.maison-et-domotique.com/en/157856-shelly-11-new-products-in-wi-fi-bluetooth-and-zwave-ifa2023/)) |

Consultez la [page de la famille Wall Display](/fr/hardware/panels/shelly/) pour le raisonnement complet sur le modèle d’accès, les points de mise à jour OTA (branche `WallDisplay`) et l’historique des versions du micrologiciel.

## Source

[Shelly Wall Display — base de connaissances](https://kb.shelly.cloud/knowledge-base/shelly-wall-display).
