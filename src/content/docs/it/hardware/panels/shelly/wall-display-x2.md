---
title: Shelly Wall Display X2
description: Dati hardware di Shelly Wall Display X2, un pannello SC7731E da 6.9 pollici con Android 8.1, nome in codice Pegasus.
vendor: Shelly
model: Wall Display X2
soc: SC7731E
android: '8.1'
screen: 6.9 in, 1440 × 720
support: Non testato
root: Non accertato su questo modello
webview: 'Non accertato (il canale WallDisplay non contiene un pacchetto WebView OTA per questo modello)'
released: '2025-01 (stima)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x2-front.jpg'
    alt: Shelly Wall Display X2, vista frontale
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display X2
  order: 2
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Nessuna unità di questo modello è stata testata.** Panel Assistant lo associa al profilo Shelly legacy incluso, che nessun X2 ha ancora eseguito. Vedi la [pagina della famiglia Wall Display](/it/hardware/panels/shelly/) per le fonti, il meccanismo OTA del firmware, il modello di accesso e le note di sicurezza condivise da tutta la gamma.
:::

Wall Display X2, nome in codice del firmware **Pegasus**, è un pannello da 6.9 in 1440×720 con Spreadtrum/UNISOC SC7731E (Cortex-A7), Android 8.1. Usa il canale OTA legacy **WallDisplay** (armeabi-v7a), insieme al modello [originale](/it/hardware/panels/shelly/wall-display/).

## Accesso iniziale al debug

**ADB di rete sulla porta TCP 5555 senza computer: non accertato su questo modello.** Anche il debug USB iniziale e lo sblocco del menu del produttore non sono verificati su questo modello. La [procedura X2i](/it/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) è confermata solo su X2i; il firmware condiviso non dimostra che funzioni qui. Chiedi a Shelly la procedura per il tuo modello e firmware. Usa il [programma di installazione USB](/it/install/install-over-usb/) solo quando sono disponibili il debug USB e una connessione dati USB. Una build con capacità root da sola non abilita il debug.

## Venduto anche come

Shelly Wall Display X2, SAWD-2A1XX10EU1, nome in codice del firmware Pegasus, ID dispositivo e500_7731e_32u_o.

|         |                                                                                                                                                                                                                                              |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | Spreadtrum/UNISOC **SC7731E**, Cortex-A7                                                                                                                                                                                                     |
| Schermo | **1440×720**, 6.9 in                                                                                                                                                                                                                         |
| Android | 8.1                                                                                                                                                                                                                                          |
| ABI     | armeabi-v7a                                                                                                                                                                                                                                  |
| Sensori | Temperatura, umidità, luce ambientale e prossimità documentati; esposizione tramite API Android non verificata                                                                                                                               |
| Relè    | 1 uscita                                                                                                                                                                                                                                     |
| Root    | Non accertato su questo modello; nessuna evidenza OTA sul tipo di build accertata specificamente per questo modello                                                                                                                          |
| Uscita  | Circa gennaio 2025 (stima); annunciato con la serie Gen4 di Shelly al CES 2025 ([pagina stampa CES 2025 di Shelly](https://us.shelly.com/blogs/media-kit/shelly-is-set-to-launch-shelly-dimmer-gen3-and-shelly-wall-display-x2-at-ces-2025)) |

Vedi la [pagina della famiglia Wall Display](/it/hardware/panels/shelly/) per il ragionamento completo sul modello di accesso, gli endpoint di aggiornamento OTA (canale `WallDisplay`) e la cronologia delle versioni del firmware.

## Fonte

[Knowledge base Shelly Wall Display X2](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x2).
