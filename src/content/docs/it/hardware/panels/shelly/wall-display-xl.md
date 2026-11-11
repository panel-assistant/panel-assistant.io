---
title: Shelly Wall Display XL
description: Dati hardware di Shelly Wall Display XL, un pannello RK3566 da 10.1 pollici con Android 11, nome in codice Blake.
vendor: Shelly
model: Wall Display XL
soc: RK3566
android: '11'
screen: 10.1 in
support: Non testato
root: Non accertato su questo modello
webview: 'Non accertato (il canale WallDisplayV2 non contiene un pacchetto WebView OTA)'
released: '2025-09 (stima)'
photos:
  - src: 'asset:hardware-shelly-wall-display-xl-front.jpg'
    alt: Shelly Wall Display XL, vista frontale
  - src: 'asset:hardware-shelly-wall-display-xl-screen-trim.jpg'
    alt: Shelly Wall Display XL, vista frontale dello schermo
  - src: 'asset:hardware-shelly-wall-display-xl-profile-trim.jpg'
    alt: Shelly Wall Display XL, profilo laterale che mostra la profondità di montaggio
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display XL
  order: 5
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Nessuna unità di questo modello è stata testata.** Vedi la [pagina della famiglia Wall Display](/it/hardware/panels/shelly/) per le fonti, il meccanismo OTA del firmware, il modello di accesso e le note di sicurezza condivise da tutta la gamma.
:::

Wall Display XL, nome in codice del firmware **Blake**, è un pannello da 10.1 in con Rockchip RK3566 (Cortex-A55), Android 11: il modello più grande e più potente della [famiglia Shelly Wall Display](/it/hardware/panels/shelly/). Usa il canale OTA moderno **WallDisplayV2** (arm64-v8a), insieme a [X1i](/it/hardware/panels/shelly/wall-display-x1i/), [X2i](/it/hardware/panels/shelly/wall-display-x2i/), Maverick e Dayna, e ha accesso all'AppStore integrato.

## Accesso iniziale al debug

**ADB di rete sulla porta TCP 5555 senza computer: non accertato su questo modello.** Anche il debug USB iniziale e lo sblocco del menu del produttore non sono verificati su questo modello. La [procedura X2i](/it/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) è confermata solo su X2i; il firmware condiviso non dimostra che funzioni qui. Chiedi a Shelly la procedura per il tuo modello e firmware. Usa il [programma di installazione USB](/it/install/install-over-usb/) solo quando sono disponibili il debug USB e una connessione dati USB. Una build con capacità root da sola non abilita il debug.

## Venduto anche come

Shelly Wall Display XL, nome in codice del firmware Blake.

|         |                                                                                                                                                                                                                                                                                                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | Rockchip **RK3566**, Cortex-A55                                                                                                                                                                                                                                                                                                                                         |
| Schermo | 10.1 in                                                                                                                                                                                                                                                                                                                                                                 |
| Android | 11                                                                                                                                                                                                                                                                                                                                                                      |
| ABI     | arm64-v8a                                                                                                                                                                                                                                                                                                                                                               |
| Sensori | Luce ambientale documentata; un sensore di movimento (ufficiale, tecnologia esatta non verificata); esposizione tramite API Android non verificata                                                                                                                                                                                                                      |
| Relè    | 1 uscita                                                                                                                                                                                                                                                                                                                                                                |
| Root    | Non accertato su questo modello; l'OTA moderno non dichiara un tipo di build. Su un [Wall Display X2i](/it/hardware/panels/shelly/wall-display-x2i/) testato con firmware di fabbrica 2.5.4, le opzioni sviluppatore e il debug USB si sbloccano dall'app Impostazioni e adb si connette, sempre senza root; non è stato testato se lo stesso valga per questo modello. |
| Uscita  | Circa settembre 2025 (stima); Shelly ha lanciato XL in Europa intorno al 10 settembre 2025 ([resoconto del lancio, Notebookcheck, settembre 2025](https://www.notebookcheck.net/Shelly-launches-new-Wall-Display-XL-smart-home-hub.1110802.0.html))                                                                                                                     |

:::caution
Il browser Home Assistant integrato di XL ha presentato problemi di rendering e impaginazione con il frontend Home Assistant 2025.12 e una versione preliminare 2026.1 (segnalati in [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755) e `#28746`; compatibilità Core in [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665)). Un'app che usava il WebView di sistema sullo stesso dispositivo visualizzava correttamente, dimostrando che il problema era specifico del WebView del browser integrato e non dell'hardware.
:::

Dalla versione 1.0.1 dell'app del pannello, XL dispone di un primo supporto specifico per pulsanti e prossimità e condivide le capacità Shelly osservate su [X2i](/it/hardware/panels/shelly/wall-display-x2i/) con questo firmware: spegnimento completo dello schermo senza root, e Indietro e Home senza Recenti. I suoi sensori vengono controllati sul pannello all'avvio di Panel Assistant. Nessun XL è stato ancora confermato, quindi una segnalazione da un proprietario è benvenuta; vedi [Cosa significa X2i per il resto della gamma](/it/hardware/panels/shelly/#cosa-significa-x2i-per-il-resto-della-gamma).

Vedi la [pagina della famiglia Wall Display](/it/hardware/panels/shelly/) per il ragionamento completo sul modello di accesso, gli endpoint di aggiornamento OTA (canale `WallDisplayV2`) e la cronologia delle versioni del firmware.

## Fonte

[Knowledge base Shelly Wall Display XL](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-xl).
