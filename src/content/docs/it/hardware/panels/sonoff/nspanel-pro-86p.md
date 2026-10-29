---
title: Sonoff NSPanel Pro 86P
description: Dati hardware di Sonoff NSPanel Pro 86P, un pannello quadrato Rockchip PX30 da 480×480 con radio Zigbee integrata.
vendor: Sonoff
model: NSPanel Pro 86P
soc: Rockchip PX30
android: '8.1'
screen: 4 in, 480 × 480, solo verticale
support: Completo
root: userdebug, nessuna password adb; su per spegnere la retroilluminazione
webview: Chromium 107 su 3.5.1; installazione manuale di LineageOS 138
released: '2022-09 (stima)'
photos:
  - src: 'asset:hardware-sonoff-nspanel-pro-front.jpg'
    alt: Sonoff NSPanel Pro 86P, vista frontale, montato a parete
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-black-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, finitura nera, vista angolata che mostra la profondità di montaggio
  - src: 'asset:hardware-sonoff-nspanel-pro-86p-angle-white-trim.jpg'
    alt: Sonoff NSPanel Pro 86P, finitura bianca, vista angolata che mostra la profondità di montaggio
photoCredit: 'Foto: Sonoff'
evidence: [bench, open, firmware, documented, owners]
sidebar:
  label: NSPanel Pro 86P
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

L'**86P** è la variante quadrata della linea [Sonoff NSPanel Pro](/it/hardware/panels/sonoff/), il cui nome deriva dalla scatola a parete europea da 86 mm. Questa pagina contiene solo le sue specifiche e i fatti che differiscono da [120P](/it/hardware/panels/sonoff/nspanel-pro-120p/); tutto il resto (procedura root, aggiornamento WebView, LED, sensori, gateway Zigbee, particolarità del firmware) è documentato una sola volta nella [pagina della famiglia](/it/hardware/panels/sonoff/), a cui rimandano le sezioni di questa pagina.

## Venduto anche come

NSPanel Pro 86, NSPanel Pro 86P, NSPanel120P (gli annunci di 86P riutilizzano occasionalmente questa stringa), NSPanel Pro Gen1, px30_evb, SN-RKPX30-NSP-01, nspanel-pro. Da non confondere con NSPanel Pro Gen2 o con le schede Tuya S6E e T6E, che sono hardware diversi.

|               |                                                                                                                                                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC           | Rockchip **PX30**                                                                                                                                                                                                                                                                                 |
| CPU           | 4× **Cortex-A35** fino a **1.512 GHz** (408 MHz a riposo)                                                                                                                                                                                                                                         |
| GPU           | **Mali-G31** (confermato sul dispositivo)                                                                                                                                                                                                                                                         |
| Schermo       | **480×480 quadrato** (1:1), circa 4 in, 160 dpi (mdpi, ben abbinati a circa 170 ppi fisici), 60 Hz, una superficie di **480×480 dp**                                                                                                                                                              |
| RAM           | **2 GB** (circa 1960 MB utilizzabili)                                                                                                                                                                                                                                                             |
| Archiviazione | eMMC; `/data` circa 3.5 GB                                                                                                                                                                                                                                                                        |
| Android       | 8.1 (API 27)                                                                                                                                                                                                                                                                                      |
| ABI           | arm64-v8a                                                                                                                                                                                                                                                                                         |
| Radio         | **Zigbee 3.0** (coordinatore Silicon Labs EFR32, vedi la [pagina della famiglia](/it/hardware/panels/sonoff/#gateway-zigbee)), Wi-Fi, Bluetooth. Niente NFC, IR, Ethernet o rete cellulare.                                                                                                       |
| Uscita        | Circa settembre 2022 (stima); preordini aperti nell’agosto 2022 con spedizioni previste dal 20 settembre 2022 ([resoconto dei preordini, CNX Software, agosto 2022](https://www.cnx-software.com/2022/08/12/sonoff-nspanel-pro-android-control-panel-doubles-as-wifi-zigbee-smart-home-gateway/)) |

`ro.product.model` e `ro.product.device` riportano entrambi `px30_evb`, un nome condiviso di scheda Rockchip che _non_ è un modo affidabile per distinguere 86P da 120P; `ro.product.version` riporta la forma specifica per 86P `NSPanel86P_x.y.z`, oppure `s6_android_x.y.z` su alcuni firmware. L'OTA viene fornito come ROM completa fino alla versione **4.0.12**; le versioni successive indicizzate vengono fornite come differenze o aggiornamenti della sola app (vedi la [pagina del firmware](/it/hardware/firmware/nspanel-pro/)). Il firmware di prossimità di 86P **ha ripristinato le letture di distanza alla versione 4.0.12** (120P è rimasto binario nella serie 4.x); vedi [Sensori](/it/hardware/panels/sonoff/#sensori-luce-e-prossimità-accessibili-direttamente-allapp) nella pagina della famiglia.

:::note
Cortex-A35 è un core a basso consumo con una capacità di elaborazione per ciclo nettamente inferiore ad A55 (TPA10) o A72 (WF1589T). Con 2 GB di RAM, la linea NSPanel Pro offre le **prestazioni di fascia iniziale** tra i pannelli pienamente supportati; vedi il [confronto delle prestazioni](/it/hardware/#performance-comparison).
:::

## Accesso iniziale al debug

ADB di rete sulla porta TCP 5555 senza computer dipende dal firmware installato; non è accertato un interruttore universale. Segui i [passaggi iniziali ADB per NSPanel Pro](/it/hardware/panels/sonoff/#ottenere-accesso-adb-e-root), inclusa la procedura USB specifica del firmware quando l’accesso tramite rete non è disponibile. I successivi passaggi root richiedono una connessione di debug esistente.
