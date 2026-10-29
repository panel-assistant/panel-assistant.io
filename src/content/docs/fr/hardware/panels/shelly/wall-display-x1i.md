---
title: Shelly Wall Display X1i
description: Caractéristiques matérielles du Shelly Wall Display X1i, un panneau RK3326-S de 4 pouces sous Android 11, nom de code Cally.
vendor: Shelly
model: Wall Display X1i
soc: RK3326-S
android: '11'
screen: 4 in, 720 × 720
support: Non testé
root: Non établi sur ce modèle
webview: 'Non établi (la branche WallDisplayV2 ne contient aucun paquet WebView OTA)'
released: '2026-07 (est.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x1i-front.jpg'
    alt: Shelly Wall Display X1i, vue de face
  - src: 'asset:hardware-shelly-wall-display-x1i-silver.jpg'
    alt: Shelly Wall Display X1i, finition argentée, vue de face
  - src: 'asset:hardware-shelly-wall-display-x1i-rear-label.jpg'
    alt: Shelly Wall Display X1i, arrière avec l’étiquette du modèle SAWD-6A1XX10EU0
photoCredit: 'Photo: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display X1i
  order: 3
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Aucun exemplaire de ce modèle n’a été testé.** Consultez la [page de la famille Wall Display](/fr/hardware/panels/shelly/) pour les sources, le mécanisme OTA du micrologiciel, le modèle d’accès et les notes de sécurité communs à toute la gamme.
:::

Le Wall Display X1i, nom de code du micrologiciel **Cally**, est un panneau de 4 pouces en 720×720 doté d’un Rockchip RK3326-S (Cortex-A35), sous Android 11. Il utilise la branche OTA moderne **WallDisplayV2** (arm64-v8a), comme les [X2i](/fr/hardware/panels/shelly/wall-display-x2i/), [XL](/fr/hardware/panels/shelly/wall-display-xl/), Maverick et Dayna, et dispose de l’AppStore intégré.

## Accès initial au débogage

**ADB réseau sur le port TCP 5555 sans ordinateur : non établi sur ce modèle.** Le débogage USB initial et le déverrouillage par le menu du fabricant ne sont pas non plus vérifiés ici. La [procédure du X2i](/fr/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) n’est confirmée que sur le X2i ; un micrologiciel commun ne prouve pas qu’elle fonctionne ici. Demandez à Shelly la procédure pour votre modèle et votre micrologiciel. N’utilisez l’[installateur USB](/fr/install/install-over-usb/) qu’une fois le débogage USB et une connexion USB de données disponibles. Une compilation capable de root ne suffit pas à activer le débogage.

## Également vendu sous les noms

Shelly Wall Display X1i, nom de code du micrologiciel Cally.

|                   |                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SoC               | Rockchip **RK3326-S**, Cortex-A35                                                                                                                                                                                                                                                                                                                                                                            |
| Écran             | **720×720 carré**, 4 pouces                                                                                                                                                                                                                                                                                                                                                                                  |
| Android           | 11                                                                                                                                                                                                                                                                                                                                                                                                           |
| ABI               | arm64-v8a                                                                                                                                                                                                                                                                                                                                                                                                    |
| Capteurs          | Lumière ambiante et proximité documentées ; aucun capteur de température ni d’humidité ; exposition par l’API Android non vérifiée                                                                                                                                                                                                                                                                           |
| Relais            | Base interchangeable : 1 sortie de série, base à 2 sorties en option                                                                                                                                                                                                                                                                                                                                         |
| Root              | Non établi sur ce modèle ; l’OTA moderne ne déclare aucun type de compilation. Sur un [Wall Display X2i](/fr/hardware/panels/shelly/wall-display-x2i/) testé avec le micrologiciel d’usine 2.5.4, les options pour les développeurs et le débogage USB se déverrouillent depuis l’application Paramètres et adb se connecte ensuite, toujours sans root ; ce fonctionnement n’a pas été testé sur ce modèle. |
| Commercialisation | Vers juillet 2026 (est.) ; Shelly a annoncé le X1i le 15 juillet 2026 ([article de lancement, TechBuzz Ireland, juillet 2026](https://techbuzzireland.com/2026/07/15/shelly-expands-its-smart-home-portfolio-with-wall-display-x1i-and-blu-motion-zb/))                                                                                                                                                      |

Depuis Panel Assistant 1.0, le X1i utilise le profil Shelly commun, qui reprend ce que le [X2i](/fr/hardware/panels/shelly/wall-display-x2i/) a montré sur ce micrologiciel : extinction complète de l’écran sans root, et Retour et Accueil sans Applications récentes. Ses propres capteurs sont vérifiés sur le panneau au démarrage de Panel Assistant. Aucun X1i n’a encore été confirmé : un retour de propriétaire est donc bienvenu ; voir [Ce que le X2i implique pour le reste de la gamme](/fr/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

Consultez la [page de la famille Wall Display](/fr/hardware/panels/shelly/) pour le raisonnement complet sur le modèle d’accès, les points de mise à jour OTA (branche `WallDisplayV2`) et l’historique des versions du micrologiciel.

## Source

[Shelly Wall Display X1i — base de connaissances](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x1i).
