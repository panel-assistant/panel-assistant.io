---
title: Shelly Wall Display (originale)
description: Dati hardware del primo Shelly Wall Display, un pannello MT6580 da 4 pollici con Android 7, nome in codice Stargate.
vendor: Shelly
model: Wall Display (originale)
soc: MT6580
android: '7.0'
screen: 4 in, 480 × 480
support: Ricerca
root: Non accertato; build di base userdebug, non confermato
webview: 'com.google.android.webview 119.0.6045.194 tramite ZIP ufficiale'
released: '2023-09 (stima)'
photos:
  - src: 'asset:hardware-shelly-wall-display-front.jpg'
    alt: Shelly Wall Display, modello originale, con il suo accessorio sensore H&T
  - src: 'asset:hardware-shelly-wall-display-rear-label.jpg'
    alt: Shelly Wall Display, retro con etichetta del modello e scatola a parete
photoCredit: 'Foto: Shelly'
evidence: [firmware, documented]
sidebar:
  label: Wall Display (originale)
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Solo ricerca: nessuna unità di questo modello è stata testata.** Vedi la [pagina della famiglia Wall Display](/it/hardware/panels/shelly/) per le fonti, il meccanismo OTA del firmware, il modello di accesso e le note di sicurezza condivise da tutta la gamma.
:::

:::caution
**Viene fornito con Android 7.0**, inferiore alla versione minima di Android supportata da Panel Assistant.
:::

Wall Display originale, nome in codice del firmware **Stargate**, è il modello di ingresso della [famiglia Shelly Wall Display](/it/hardware/panels/shelly/): un pannello da 4 in 480×480 con MediaTek MT6580, Android 7. Usa il canale OTA legacy **WallDisplay** (armeabi-v7a), insieme a [X2](/it/hardware/panels/shelly/wall-display-x2/).

## Accesso iniziale al debug

**ADB di rete sulla porta TCP 5555 senza computer: non accertato su questo modello.** Anche il debug USB iniziale e lo sblocco del menu del produttore non sono verificati su questo modello. La [procedura X2i](/it/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) è confermata solo su X2i; il firmware condiviso non dimostra che funzioni qui. Chiedi a Shelly la procedura per il tuo modello e firmware. Usa il [programma di installazione USB](/it/install/install-over-usb/) solo quando sono disponibili il debug USB e una connessione dati USB. Una build con capacità root da sola non abilita il debug.

## Venduto anche come

Shelly Wall Display, SAWD-0A1XX10EU1, nome in codice del firmware Stargate, ID dispositivo k400_mt6580_32_n.

|         |                                                                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC     | MediaTek **MT6580**                                                                                                                                                                                                                                                                                        |
| Schermo | **480×480 quadrato**, 4 in                                                                                                                                                                                                                                                                                 |
| Android | 7.0                                                                                                                                                                                                                                                                                                        |
| ABI     | armeabi-v7a                                                                                                                                                                                                                                                                                                |
| Sensori | Temperatura, umidità e luce ambientale documentati; esposizione tramite API Android non verificata                                                                                                                                                                                                         |
| Relè    | 1 uscita                                                                                                                                                                                                                                                                                                   |
| WebView | Non incluso nell'OTA standard; Shelly pubblica uno ZIP separato che installa `com.google.android.webview` **119.0.6045.194**                                                                                                                                                                               |
| Root    | Non accertato su questo modello. L'OTA dichiara una build di base `userdebug` (`alps/full_k400_mt6580_32_n/...:7.0/.../userdebug/test-keys`), quindi `adb root` potrebbe funzionare **se** si riesce a stabilire una connessione adb, ma non è stato confermato su un'unità.                               |
| Uscita  | Circa settembre 2023 (stima); Shelly ha mostrato per la prima volta Wall Display a IFA Berlin nel settembre 2023 ([resoconto della gamma Shelly a IFA Berlin 2023, Maison et Objet Domotique](https://www.maison-et-domotique.com/en/157856-shelly-11-new-products-in-wi-fi-bluetooth-and-zwave-ifa2023/)) |

Vedi la [pagina della famiglia Wall Display](/it/hardware/panels/shelly/) per il ragionamento completo sul modello di accesso, gli endpoint di aggiornamento OTA (canale `WallDisplay`) e la cronologia delle versioni del firmware.

## Fonte

[Knowledge base Shelly Wall Display](https://kb.shelly.cloud/knowledge-base/shelly-wall-display).
