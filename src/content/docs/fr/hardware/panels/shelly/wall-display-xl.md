---
title: Shelly Wall Display XL
description: Caractéristiques matérielles du Shelly Wall Display XL, un panneau RK3566 de 10.1 pouces sous Android 11, nom de code Blake.
vendor: Shelly
model: Wall Display XL
soc: RK3566
android: '11'
screen: 10.1 in
support: Non testé
root: Non établi sur ce modèle
webview: 'Non établi (la branche WallDisplayV2 ne contient aucun paquet WebView OTA)'
released: '2025-09 (est.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-xl-front.jpg'
    alt: Shelly Wall Display XL, vue de face
  - src: 'asset:hardware-shelly-wall-display-xl-screen-trim.jpg'
    alt: Shelly Wall Display XL, écran vu de face
  - src: 'asset:hardware-shelly-wall-display-xl-profile-trim.jpg'
    alt: Shelly Wall Display XL, profil montrant la profondeur de montage
photoCredit: 'Photo: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display XL
  order: 5
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Aucun exemplaire de ce modèle n’a été testé.** Consultez la [page de la famille Wall Display](/fr/hardware/panels/shelly/) pour les sources, le mécanisme OTA du micrologiciel, le modèle d’accès et les notes de sécurité communs à toute la gamme.
:::

Le Wall Display XL, nom de code du micrologiciel **Blake**, est un panneau de 10.1 pouces doté d’un Rockchip RK3566 (Cortex-A55), sous Android 11 : le modèle le plus grand et le plus performant de la [famille Shelly Wall Display](/fr/hardware/panels/shelly/). Il utilise la branche OTA moderne **WallDisplayV2** (arm64-v8a), comme les [X1i](/fr/hardware/panels/shelly/wall-display-x1i/), [X2i](/fr/hardware/panels/shelly/wall-display-x2i/), Maverick et Dayna, et dispose de l’AppStore intégré.

## Accès initial au débogage

**ADB réseau sur le port TCP 5555 sans ordinateur : non établi sur ce modèle.** Le débogage USB initial et le déverrouillage par le menu du fabricant ne sont pas non plus vérifiés ici. La [procédure du X2i](/fr/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) n’est confirmée que sur le X2i ; un micrologiciel commun ne prouve pas qu’elle fonctionne ici. Demandez à Shelly la procédure pour votre modèle et votre micrologiciel. N’utilisez l’[installateur USB](/fr/install/install-over-usb/) qu’une fois le débogage USB et une connexion USB de données disponibles. Une compilation capable de root ne suffit pas à activer le débogage.

## Également vendu sous les noms

Shelly Wall Display XL, nom de code du micrologiciel Blake.

|                   |                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC               | Rockchip **RK3566**, Cortex-A55                                                                                                                                                                                                                                                                                                                                                                              |
| Écran             | 10.1 in                                                                                                                                                                                                                                                                                                                                                                                                      |
| Android           | 11                                                                                                                                                                                                                                                                                                                                                                                                           |
| ABI               | arm64-v8a                                                                                                                                                                                                                                                                                                                                                                                                    |
| Capteurs          | Lumière ambiante documentée ; capteur de mouvement (officiel, technologie exacte non vérifiée) ; exposition par l’API Android non vérifiée                                                                                                                                                                                                                                                                   |
| Relais            | 1 sortie                                                                                                                                                                                                                                                                                                                                                                                                     |
| Root              | Non établi sur ce modèle ; l’OTA moderne ne déclare aucun type de compilation. Sur un [Wall Display X2i](/fr/hardware/panels/shelly/wall-display-x2i/) testé avec le micrologiciel d’usine 2.5.4, les options pour les développeurs et le débogage USB se déverrouillent depuis l’application Paramètres et adb se connecte ensuite, toujours sans root ; ce fonctionnement n’a pas été testé sur ce modèle. |
| Commercialisation | Vers septembre 2025 (est.) ; Shelly a lancé le XL en Europe vers le 10 septembre 2025 ([article de lancement, Notebookcheck, septembre 2025](https://www.notebookcheck.net/Shelly-launches-new-Wall-Display-XL-smart-home-hub.1110802.0.html))                                                                                                                                                               |

:::caution
Le navigateur Home Assistant intégré au XL avait des problèmes de rendu et de mise en page avec le frontend Home Assistant 2025.12 et une préversion 2026.1 (suivis dans [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755) et `#28746` ; compatibilité Core dans [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665)). Une application utilisant le WebView système sur le même appareil affichait correctement les pages, ce qui montre que le problème était propre au WebView du navigateur intégré plutôt qu’au matériel.
:::

Depuis la version 1.0.1 de l’application du panneau, le XL bénéficie d’une première prise en charge propre de ses boutons et de sa proximité et partage les capacités Shelly observées sur le [X2i](/fr/hardware/panels/shelly/wall-display-x2i/) avec ce micrologiciel : extinction complète de l’écran sans root, et Retour et Accueil sans Applications récentes. Ses propres capteurs sont vérifiés sur le panneau au démarrage de Panel Assistant. Aucun XL n’a encore été confirmé : un retour de propriétaire est donc bienvenu ; voir [Ce que le X2i implique pour le reste de la gamme](/fr/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

Consultez la [page de la famille Wall Display](/fr/hardware/panels/shelly/) pour le raisonnement complet sur le modèle d’accès, les points de mise à jour OTA (branche `WallDisplayV2`) et l’historique des versions du micrologiciel.

## Source

[Shelly Wall Display XL — base de connaissances](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-xl).
