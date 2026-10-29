---
title: Sonoff NSPanel Pro 120P
description: Caractéristiques du Sonoff NSPanel Pro 120P, un panneau Rockchip RK3326-S de 750×1334 en orientation portrait avec radio Zigbee intégrée.
vendor: Sonoff
model: NSPanel Pro 120P
soc: Rockchip RK3326-S
android: '8.1'
screen: 4.7 in, 750 × 1334, portrait, paysage disponible
support: Complète
root: userdebug, sans mot de passe adb ; su pour éteindre le rétroéclairage
webview: Chromium 107 sur 3.5.1 ; installation manuelle de LineageOS 138
released: '2024-08 (est.)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-120p-front.jpg'
    alt: Sonoff NSPanel Pro 120P, finitions blanche et noire, vue de face, fixé au mur
photoCredit: 'Photo: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 120P
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Le **120P** est la variante haute de la gamme [Sonoff NSPanel Pro](/fr/hardware/panels/sonoff/), nommée d’après le boîtier mural européen de 120 mm. Cette page ne présente que ses caractéristiques et les différences avec le [86P](/fr/hardware/panels/sonoff/nspanel-pro-86p/) ; le reste (procédure root, mise à jour du WebView, LED, capteurs, passerelle Zigbee et particularités du micrologiciel) est documenté une seule fois sur la [page de la gamme](/fr/hardware/panels/sonoff/), vers laquelle renvoient les sections de cette page.

## Également vendu sous les noms

NSPanel Pro 120, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, SN_3326S, nspanel-pro-ver120. À ne pas confondre avec le NSPanel Pro Gen2 ou les cartes Tuya S6E et T6E, qui sont des matériels distincts.

|          |                                                                                                                                                                                                                       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC      | Rockchip **RK3326-S** (même famille PX30/RK3326 que le 86P ; `ro.board.platform=rk3326`, arbre de périphériques `rockchip,px30`)                                                                                      |
| CPU      | 4× **Cortex-A35** jusqu’à **1.512 GHz** (408 MHz au repos)                                                                                                                                                            |
| GPU      | **Mali-G31** (confirmé sur l’appareil)                                                                                                                                                                                |
| Écran    | **750×1334** portrait, **240 dpi** (forçage à 250) ; paysage disponible ; environ 1 cm plus étroit et plus long que le 86P                                                                                            |
| RAM      | **2 GB** (environ 1960 MB utilisables)                                                                                                                                                                                |
| Stockage | eMMC ; `/data` environ 3.5 GB                                                                                                                                                                                         |
| Android  | 8.1 (API 27)                                                                                                                                                                                                          |
| ABI      | arm64-v8a                                                                                                                                                                                                             |
| Radios   | **Zigbee 3.0** (coordinateur Silicon Labs EFR32, voir la [page de la gamme](/fr/hardware/panels/sonoff/#zigbee-gateway)), Wi-Fi, Bluetooth. Pas de NFC, d’IR, d’Ethernet ni de réseau cellulaire.                     |
| Sortie   | Vers août 2024 (est.) ; mis en vente sur le site de Sonoff vers le 14 août 2024 ([article sur le lancement, haade.fr, août 2024](https://haade.fr/en/blog/special-discount-new-sonoff-nspanel-pro-120-on-itead-site)) |

`ro.product.model` et `ro.product.device` indiquent tous deux `px30_evb`, un nom de carte Rockchip partagé qui ne permet **pas** de distinguer de manière fiable le 86P du 120P ; `ro.product.version` indique la forme `NSPanel120P_x.y.z` propre au 120P (canal OTA `nspanel-pro-ver120`, ROM complète `SN_3326S_750X1334_…`). Le format OTA suit par ailleurs celui du 86P (voir la [page des micrologiciels](/fr/hardware/firmware/nspanel-pro/)). Le micrologiciel de proximité du 120P est **resté binaire en 4.x** (le 86P a rétabli les mesures de distance en 4.0.12 ; les noyaux divergent selon le modèle) ; voir [Capteurs](/fr/hardware/panels/sonoff/#sensors-light-and-proximity-are-app-direct) sur la page de la gamme. Vérifié sur un 120P en fonctionnement (micrologiciel `NSPanel120P_3.7.1`) : `wm size` 750×1334, densité 240, `ro.board.platform=rk3326`.

:::note
Le Cortex-A35 est un cœur basse consommation dont le débit par cycle est nettement inférieur à celui de l’A55 (TPA10) ou de l’A72 (WF1589T). Avec 2 GB de RAM, la gamme NSPanel Pro constitue l’**entrée de gamme en performances** parmi les panneaux entièrement pris en charge ; voir le [comparatif des performances](/fr/hardware/#performance-comparison).
:::

## Accès initial au débogage

L’accès ADB réseau sur le port TCP 5555 sans ordinateur dépend du micrologiciel installé ; aucun commutateur universel n’est établi. Suivez les [étapes d’accès ADB initial du NSPanel Pro](/fr/hardware/panels/sonoff/#gaining-adb-and-root-access), y compris la procédure USB propre au micrologiciel lorsque l’accès réseau est indisponible. Les étapes root suivantes nécessitent une connexion de débogage déjà établie.
