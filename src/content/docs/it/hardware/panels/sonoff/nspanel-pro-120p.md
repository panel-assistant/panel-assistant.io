---
title: Sonoff NSPanel Pro 120P
description: Dati hardware di Sonoff NSPanel Pro 120P, un pannello verticale Rockchip RK3326-S da 750×1334 con radio Zigbee integrata.
vendor: Sonoff
model: NSPanel Pro 120P
soc: Rockchip RK3326-S
android: '8.1'
screen: 4.7 in, 750 × 1334, verticale, orizzontale disponibile
support: Completo
root: userdebug, nessuna password adb; su per spegnere la retroilluminazione
webview: Chromium 107 su 3.5.1; installazione manuale di LineageOS 138
released: '2024-08 (stima)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-120p-front.jpg'
    alt: Sonoff NSPanel Pro 120P, finiture bianca e nera, vista frontale, montato a parete
photoCredit: 'Foto: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 120P
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Il **120P** è la variante alta della linea [Sonoff NSPanel Pro](/it/hardware/panels/sonoff/), il cui nome deriva dalla scatola a parete europea da 120 mm. Questa pagina contiene solo le sue specifiche e i fatti che differiscono da [86P](/it/hardware/panels/sonoff/nspanel-pro-86p/); tutto il resto (procedura root, aggiornamento WebView, LED, sensori, gateway Zigbee, particolarità del firmware) è documentato una sola volta nella [pagina della famiglia](/it/hardware/panels/sonoff/), a cui rimandano le sezioni di questa pagina.

## Venduto anche come

NSPanel Pro 120, NSPanel Pro 120P, NSPanel120P, NSPanel Pro Gen1, SN_3326S, nspanel-pro-ver120. Da non confondere con NSPanel Pro Gen2 o con le schede Tuya S6E e T6E, che sono hardware diversi.

|               |                                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC           | Rockchip **RK3326-S** (stessa famiglia PX30/RK3326 di 86P; `ro.board.platform=rk3326`, device tree `rockchip,px30`)                                                                                                       |
| CPU           | 4× **Cortex-A35** fino a **1.512 GHz** (408 MHz a riposo)                                                                                                                                                                 |
| GPU           | **Mali-G31** (confermato sul dispositivo)                                                                                                                                                                                 |
| Schermo       | **750×1334** verticale, **240 dpi** (override 250); orizzontale disponibile; circa 1 cm più stretto e più lungo di 86P                                                                                                    |
| RAM           | **2 GB** (circa 1960 MB utilizzabili)                                                                                                                                                                                     |
| Archiviazione | eMMC; `/data` circa 3.5 GB                                                                                                                                                                                                |
| Android       | 8.1 (API 27)                                                                                                                                                                                                              |
| ABI           | arm64-v8a                                                                                                                                                                                                                 |
| Radio         | **Zigbee 3.0** (coordinatore Silicon Labs EFR32, vedi la [pagina della famiglia](/it/hardware/panels/sonoff/#gateway-zigbee)), Wi-Fi, Bluetooth. Niente NFC, IR, Ethernet o rete cellulare.                               |
| Uscita        | Circa agosto 2024 (stima); messo in vendita sul sito Sonoff intorno al 14 agosto 2024 ([resoconto del lancio, haade.fr, agosto 2024](https://haade.fr/en/blog/special-discount-new-sonoff-nspanel-pro-120-on-itead-site)) |

`ro.product.model` e `ro.product.device` riportano entrambi `px30_evb`, un nome condiviso di scheda Rockchip che _non_ è un modo affidabile per distinguere 120P da 86P; `ro.product.version` riporta la forma specifica per 120P `NSPanel120P_x.y.z` (canale OTA `nspanel-pro-ver120`, ROM completa `SN_3326S_750X1334_…`). Per il resto, il formato OTA segue 86P (vedi la [pagina del firmware](/it/hardware/firmware/nspanel-pro/)). Il firmware di prossimità di 120P **è rimasto binario nella serie 4.x** (86P ha ripristinato le letture di distanza alla versione 4.0.12; i kernel divergono per modello); vedi [Sensori](/it/hardware/panels/sonoff/#sensori-luce-e-prossimità-accessibili-direttamente-allapp) nella pagina della famiglia. Verificato dal vivo su un 120P (firmware `NSPanel120P_3.7.1`): `wm size` 750×1334, densità 240, `ro.board.platform=rk3326`.

:::note
Cortex-A35 è un core a basso consumo con una capacità di elaborazione per ciclo nettamente inferiore ad A55 (TPA10) o A72 (WF1589T). Con 2 GB di RAM, la linea NSPanel Pro offre le **prestazioni di fascia iniziale** tra i pannelli pienamente supportati; vedi il [confronto delle prestazioni](/it/hardware/#performance-comparison).
:::

## Accesso iniziale al debug

ADB di rete sulla porta TCP 5555 senza computer dipende dal firmware installato; non è accertato un interruttore universale. Segui i [passaggi iniziali ADB per NSPanel Pro](/it/hardware/panels/sonoff/#ottenere-accesso-adb-e-root), inclusa la procedura USB specifica del firmware quando l’accesso tramite rete non è disponibile. I successivi passaggi root richiedono una connessione di debug esistente.
