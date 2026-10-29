---
title: Shelly Wall Display X1i
description: Dane sprzętowe Shelly Wall Display X1i, panelu RK3326-S o przekątnej 4 cali z Androidem 11 i nazwą kodową Cally.
vendor: Shelly
model: Wall Display X1i
soc: RK3326-S
android: '11'
screen: 4 in, 720 × 720
support: Nieprzetestowany
root: Nie ustalono dla tego modelu
webview: 'Nie ustalono (ścieżka WallDisplayV2 nie zawiera pakietu OTA WebView)'
released: '2026-07 (szac.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-x1i-front.jpg'
    alt: Shelly Wall Display X1i, przód
  - src: 'asset:hardware-shelly-wall-display-x1i-silver.jpg'
    alt: Shelly Wall Display X1i, srebrne wykończenie, przód
  - src: 'asset:hardware-shelly-wall-display-x1i-rear-label.jpg'
    alt: Shelly Wall Display X1i, tył z etykietą modelu SAWD-6A1XX10EU0
photoCredit: 'Zdjęcie: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display X1i
  order: 3
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Nie przetestowano żadnego egzemplarza tego modelu.** [Strona rodziny Wall Display](/pl/hardware/panels/shelly/) opisuje pochodzenie informacji, mechanizm OTA firmware, model dostępu i uwagi o bezpieczeństwie wspólne dla całej linii.
:::

Wall Display X1i, o nazwie kodowej firmware **Cally**, to panel 4 in 720×720 na Rockchip RK3326-S (Cortex-A35), z Androidem 11. Korzysta z nowoczesnej ścieżki OTA **WallDisplayV2** (arm64-v8a), podobnie jak [X2i](/pl/hardware/panels/shelly/wall-display-x2i/), [XL](/pl/hardware/panels/shelly/wall-display-xl/), Maverick i Dayna, i ma dostęp do wbudowanego AppStore.

## Początkowy dostęp do debugowania

**Sieciowe ADB na porcie TCP 5555 bez komputera: nie ustalono dla tego modelu.** Początkowe debugowanie USB i odblokowanie z menu producenta także nie są tutaj zweryfikowane. [Procedura X2i](/pl/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) jest potwierdzona tylko na X2i; wspólne firmware nie dowodzi, że działa tutaj. Poproś Shelly o procedurę dla swojego modelu i firmware. Użyj [instalatora USB](/pl/install/install-over-usb/) dopiero po udostępnieniu debugowania USB i połączenia danych USB. Sama kompilacja obsługująca root nie włącza debugowania.

## Także sprzedawany jako

Shelly Wall Display X1i, nazwa kodowa firmware Cally.

|             |                                                                                                                                                                                                                                                                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC         | Rockchip **RK3326-S**, Cortex-A35                                                                                                                                                                                                                                                                                                                                   |
| Wyświetlacz | **720×720, kwadratowy**, 4 in                                                                                                                                                                                                                                                                                                                                       |
| Android     | 11                                                                                                                                                                                                                                                                                                                                                                  |
| ABI         | arm64-v8a                                                                                                                                                                                                                                                                                                                                                           |
| Czujniki    | Udokumentowane światło otoczenia i zbliżenie; brak czujnika temperatury i wilgotności; udostępnianie przez API Androida niezweryfikowane                                                                                                                                                                                                                            |
| Przekaźnik  | Wymienna podstawa: standardowo 1 wyjście, opcjonalna podstawa z 2 wyjściami                                                                                                                                                                                                                                                                                         |
| Root        | Nie ustalono dla tego modelu; nowoczesne OTA nie deklaruje typu kompilacji. Na [Wall Display X2i](/pl/hardware/panels/shelly/wall-display-x2i/) przetestowanym z fabrycznym firmware 2.5.4 opcje programisty i debugowanie USB odblokowuje się z aplikacji Ustawienia, po czym adb się łączy, nadal bez roota; nie przetestowano, czy dotyczy to także tego modelu. |
| Premiera    | Około lipca 2026 (szac.); Shelly zapowiedziało X1i 15 lipca 2026 ([relacja z premiery, TechBuzz Ireland, lipiec 2026](https://techbuzzireland.com/2026/07/15/shelly-expands-its-smart-home-portfolio-with-wall-display-x1i-and-blu-motion-zb/))                                                                                                                     |

Od Panel Assistant 1.0 X1i używa wspólnego profilu Shelly, który uwzględnia to, co [X2i](/pl/hardware/panels/shelly/wall-display-x2i/) pokazał o tym firmware: pełne wyłączanie ekranu bez roota oraz Wstecz i Ekran główny bez Ostatnich. Własne czujniki są sprawdzane na panelu przy uruchamianiu Panel Assistant. Nie potwierdzono jeszcze żadnego X1i, więc raport właściciela jest mile widziany; zobacz [Co X2i oznacza dla reszty linii](/pl/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

[Strona rodziny Wall Display](/pl/hardware/panels/shelly/) zawiera pełne uzasadnienie modelu dostępu, punkty końcowe aktualizacji OTA (ścieżka `WallDisplayV2`) i historię wersji firmware.

## Źródło

[Baza wiedzy Shelly Wall Display X1i](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-x1i).
