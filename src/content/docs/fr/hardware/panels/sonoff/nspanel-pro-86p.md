---
title: Sonoff NSPanel Pro 86P
description: Caractéristiques du Sonoff NSPanel Pro 86P, un panneau carré Rockchip PX30 de 480×480 avec radio Zigbee intégrée.
vendor: Sonoff
model: NSPanel Pro 86P
soc: Rockchip PX30
android: '8.1'
screen: 4 in, 480 × 480, portrait uniquement
support: Complète
root: userdebug, sans mot de passe adb ; su pour éteindre le rétroéclairage
webview: Chromium 107 sur 3.5.1 ; installation manuelle de LineageOS 138
released: '2022-09 (est.)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-front.jpg'
    alt: Sonoff NSPanel Pro 86P, vue de face, fixé au mur
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-black-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, finition noire, vue en biais montrant la profondeur de montage
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-white-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, finition blanche, vue en biais montrant la profondeur de montage
photoCredit: 'Photo: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 86P
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Le **86P** est la variante carrée de la gamme [Sonoff NSPanel Pro](/fr/hardware/panels/sonoff/), nommée d’après le boîtier mural européen de 86 mm. Cette page ne présente que ses caractéristiques et les différences avec le [120P](/fr/hardware/panels/sonoff/nspanel-pro-120p/) ; le reste (procédure root, mise à jour du WebView, LED, capteurs, passerelle Zigbee et particularités du micrologiciel) est documenté une seule fois sur la [page de la gamme](/fr/hardware/panels/sonoff/), vers laquelle renvoient les sections de cette page.

## Également vendu sous les noms

NSPanel Pro 86, NSPanel Pro 86P, NSPanel120P (certaines annonces du 86P réutilisent cette chaîne), NSPanel Pro Gen1, px30_evb, SN-RKPX30-NSP-01, nspanel-pro. À ne pas confondre avec le NSPanel Pro Gen2 ou les cartes Tuya S6E et T6E, qui sont des matériels distincts.

|          |                                                                                                                                                                                                                                                                                                            |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | Rockchip **PX30**                                                                                                                                                                                                                                                                                          |
| CPU      | 4× **Cortex-A35** jusqu’à **1.512 GHz** (408 MHz au repos)                                                                                                                                                                                                                                                 |
| GPU      | **Mali-G31** (confirmé sur l’appareil)                                                                                                                                                                                                                                                                     |
| Écran    | **480×480 carré** (1:1), environ 4 pouces, 160 dpi (mdpi, bien adapté aux quelque 170 ppi physiques), 60 Hz, surface de **480×480 dp**                                                                                                                                                                     |
| RAM      | **2 GB** (environ 1960 MB utilisables)                                                                                                                                                                                                                                                                     |
| Stockage | eMMC ; `/data` environ 3.5 GB                                                                                                                                                                                                                                                                              |
| Android  | 8.1 (API 27)                                                                                                                                                                                                                                                                                               |
| ABI      | arm64-v8a                                                                                                                                                                                                                                                                                                  |
| Radios   | **Zigbee 3.0** (coordinateur Silicon Labs EFR32, voir la [page de la gamme](/fr/hardware/panels/sonoff/#zigbee-gateway)), Wi-Fi, Bluetooth. Pas de NFC, d’IR, d’Ethernet ni de réseau cellulaire.                                                                                                          |
| Sortie   | Vers septembre 2022 (est.) ; précommandes ouvertes en août 2022 et livraisons prévues à partir du 20 septembre 2022 ([article sur les précommandes, CNX Software, août 2022](https://www.cnx-software.com/2022/08/12/sonoff-nspanel-pro-android-control-panel-doubles-as-wifi-zigbee-smart-home-gateway/)) |

`ro.product.model` et `ro.product.device` indiquent tous deux `px30_evb`, un nom de carte Rockchip partagé qui ne permet **pas** de distinguer de manière fiable le 86P du 120P ; `ro.product.version` indique la forme `NSPanel86P_x.y.z` propre au 86P, ou `s6_android_x.y.z` sur certains micrologiciels. Les mises à jour OTA sont des ROM complètes jusqu’à **4.0.12** ; les versions indexées ultérieures sont des mises à jour différentielles ou limitées aux applications (voir la [page des micrologiciels](/fr/hardware/firmware/nspanel-pro/)). Le micrologiciel de proximité du 86P a **rétabli les mesures de distance en 4.0.12** (celui du 120P reste binaire en 4.x) ; voir [Capteurs](/fr/hardware/panels/sonoff/#sensors-light-and-proximity-are-app-direct) sur la page de la gamme.

:::note
Le Cortex-A35 est un cœur basse consommation dont le débit par cycle est nettement inférieur à celui de l’A55 (TPA10) ou de l’A72 (WF1589T). Avec 2 GB de RAM, la gamme NSPanel Pro constitue l’**entrée de gamme en performances** parmi les panneaux entièrement pris en charge ; voir le [comparatif des performances](/fr/hardware/#performance-comparison).
:::

## Accès initial au débogage

L’accès ADB réseau sur le port TCP 5555 sans ordinateur dépend du micrologiciel installé ; aucun commutateur universel n’est établi. Suivez les [étapes d’accès ADB initial du NSPanel Pro](/fr/hardware/panels/sonoff/#gaining-adb-and-root-access), y compris la procédure USB propre au micrologiciel lorsque l’accès réseau est indisponible. Les étapes root suivantes nécessitent une connexion de débogage déjà établie.
