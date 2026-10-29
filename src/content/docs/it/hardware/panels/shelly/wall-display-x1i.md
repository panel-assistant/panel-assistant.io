---
title: Shelly Wall Display X1i
description: Dati hardware di Shelly Wall Display X1i, un pannello RK3326-S da 4 pollici con Android 11, nome in codice Cally.
vendor: Shelly
model: Wall Display X1i
soc: RK3326-S
android: '11'
screen: 4 in, 720 × 720
support: Non testato
root: Non accertato su questo modello
webview: 'Non accertato (il canale WallDisplayV2 non contiene un pacchetto WebView OTA)'
released: '2026-07 (stima)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x1i-front.jpg'
    alt: Shelly Wall Display X1i, vista frontale
  - src: 'asset:hardware-shelly-wall-display-x1i-silver.jpg'
    alt: Shelly Wall Display X1i, finitura argento, vista frontale
  - src: 'asset:hardware-shelly-wall-display-x1i-rear-label.jpg'
    alt: Shelly Wall Display X1i, retro con etichetta del modello SAWD-6A1XX10EU0
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display X1i
  order: 3
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Nessuna unità di questo modello è stata testata.** Vedi la [pagina della famiglia Wall Display](/it/hardware/panels/shelly/) per le fonti, il meccanismo OTA del firmware, il modello di accesso e le note di sicurezza condivise da tutta la gamma.
:::

Wall Display X1i, nome in codice del firmware **Cally**, è un pannello da 4 in 720×720 con Rockchip RK3326-S (Cortex-A35), Android 11. Usa il canale OTA moderno **WallDisplayV2** (arm64-v8a), insieme a [X2i](/it/hardware/panels/shelly/wall-display-x2i/), [XL](/it/hardware/panels/shelly/wall-display-xl/), Maverick e Dayna, e ha accesso all'AppStore integrato.

## Accesso iniziale al debug

**ADB di rete sulla porta TCP 5555 senza computer: non accertato su questo modello.** Anche il debug USB iniziale e lo sblocco del menu del produttore non sono verificati su questo modello. La [procedura X2i](/it/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) è confermata solo su X2i; il firmware condiviso non dimostra che funzioni qui. Chiedi a Shelly la procedura per il tuo modello e firmware. Usa il [programma di installazione USB](/it/install/install-over-usb/) solo quando sono disponibili il debug USB e una connessione dati USB. Una build con capacità root da sola non abilita il debug.

## Venduto anche come

Shelly Wall Display X1i, nome in codice del firmware Cally.

|         |                                                                                                                                                                                                                                                                                                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | Rockchip **RK3326-S**, Cortex-A35                                                                                                                                                                                                                                                                                                                                       |
| Schermo | **720×720 quadrato**, 4 in                                                                                                                                                                                                                                                                                                                                              |
| Android | 11                                                                                                                                                                                                                                                                                                                                                                      |
| ABI     | arm64-v8a                                                                                                                                                                                                                                                                                                                                                               |
| Sensori | Luce ambientale e prossimità documentati; nessun sensore di temperatura o umidità; esposizione tramite API Android non verificata                                                                                                                                                                                                                                       |
| Relè    | Base intercambiabile: 1 uscita di serie, base opzionale con 2 uscite                                                                                                                                                                                                                                                                                                    |
| Root    | Non accertato su questo modello; l'OTA moderno non dichiara un tipo di build. Su un [Wall Display X2i](/it/hardware/panels/shelly/wall-display-x2i/) testato con firmware di fabbrica 2.5.4, le opzioni sviluppatore e il debug USB si sbloccano dall'app Impostazioni e adb si connette, sempre senza root; non è stato testato se lo stesso valga per questo modello. |
| Uscita  | Circa luglio 2026 (stima); Shelly ha annunciato X1i il 15 luglio 2026 ([resoconto del lancio, TechBuzz Ireland, luglio 2026](https://techbuzzireland.com/2026/07/15/shelly-expands-its-smart-home-portfolio-with-wall-display-x1i-and-blu-motion-zb/))                                                                                                                  |

Da Panel Assistant 1.0, X1i usa il profilo Shelly condiviso, che include ciò che [X2i](/it/hardware/panels/shelly/wall-display-x2i/) ha mostrato di questo firmware: spegnimento completo dello schermo senza root, e Indietro e Home senza Recenti. I suoi sensori vengono controllati sul pannello all'avvio di Panel Assistant. Nessun X1i è stato ancora confermato, quindi una segnalazione da un proprietario è benvenuta; vedi [Cosa significa X2i per il resto della gamma](/it/hardware/panels/shelly/#cosa-significa-x2i-per-il-resto-della-gamma).

Vedi la [pagina della famiglia Wall Display](/it/hardware/panels/shelly/) per il ragionamento completo sul modello di accesso, gli endpoint di aggiornamento OTA (canale `WallDisplayV2`) e la cronologia delle versioni del firmware.

## Fonte

[Knowledge base Shelly Wall Display X1i](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x1i).
