---
title: Shelly Wall Display X2
description: Caractéristiques matérielles du Shelly Wall Display X2, un panneau SC7731E de 6.9 pouces sous Android 8.1, nom de code Pegasus.
vendor: Shelly
model: Wall Display X2
soc: SC7731E
android: '8.1'
screen: 6.9 in, 1440 × 720
support: Non testé
root: Non établi sur ce modèle
webview: 'Non établi (la branche WallDisplay ne contient aucun paquet WebView OTA pour ce modèle)'
released: '2025-01 (est.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x2-front.jpg'
    alt: Shelly Wall Display X2, vue de face
photoCredit: 'Photo: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display X2
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Aucun exemplaire de ce modèle n’a été testé.** Panel Assistant lui associe le profil Shelly ancien intégré, qu’aucun X2 n’a encore exécuté. Consultez la [page de la famille Wall Display](/fr/hardware/panels/shelly/) pour les sources, le mécanisme OTA du micrologiciel, le modèle d’accès et les notes de sécurité communs à toute la gamme.
:::

Le Wall Display X2, nom de code du micrologiciel **Pegasus**, est un panneau de 6.9 pouces en 1440×720 doté d’un Spreadtrum/UNISOC SC7731E (Cortex-A7), sous Android 8.1. Il utilise l’ancienne branche OTA **WallDisplay** (armeabi-v7a), comme le [modèle d’origine](/fr/hardware/panels/shelly/wall-display/).

## Accès initial au débogage

**ADB réseau sur le port TCP 5555 sans ordinateur : non établi sur ce modèle.** Le débogage USB initial et le déverrouillage par le menu du fabricant ne sont pas non plus vérifiés ici. La [procédure du X2i](/fr/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) n’est confirmée que sur le X2i ; un micrologiciel commun ne prouve pas qu’elle fonctionne ici. Demandez à Shelly la procédure pour votre modèle et votre micrologiciel. N’utilisez l’[installateur USB](/fr/install/install-over-usb/) qu’une fois le débogage USB et une connexion USB de données disponibles. Une compilation capable de root ne suffit pas à activer le débogage.

## Également vendu sous les noms

Shelly Wall Display X2, SAWD-2A1XX10EU1, nom de code du micrologiciel Pegasus, identifiant d’appareil e500_7731e_32u_o.

|                   |                                                                                                                                                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC               | Spreadtrum/UNISOC **SC7731E**, Cortex-A7                                                                                                                                                                                                              |
| Écran             | **1440×720**, 6.9 in                                                                                                                                                                                                                                  |
| Android           | 8.1                                                                                                                                                                                                                                                   |
| ABI               | armeabi-v7a                                                                                                                                                                                                                                           |
| Capteurs          | Température, humidité, lumière ambiante et proximité documentées ; exposition par l’API Android non vérifiée                                                                                                                                          |
| Relais            | 1 sortie                                                                                                                                                                                                                                              |
| Root              | Non établi sur ce modèle; aucune preuve du type de compilation OTA établie pour ce modèle précis                                                                                                                                                      |
| Commercialisation | Vers janvier 2025 (est.) ; annoncé avec la série Gen4 de Shelly au CES 2025 ([page de presse officielle Shelly au CES 2025](https://us.shelly.com/blogs/media-kit/shelly-is-set-to-launch-shelly-dimmer-gen3-and-shelly-wall-display-x2-at-ces-2025)) |

Consultez la [page de la famille Wall Display](/fr/hardware/panels/shelly/) pour le raisonnement complet sur le modèle d’accès, les points de mise à jour OTA (branche `WallDisplay`) et l’historique des versions du micrologiciel.

## Source

[Shelly Wall Display X2 — base de connaissances](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2).
