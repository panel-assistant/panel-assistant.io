---
title: Shelly Wall Display XL
description: Dane sprzętowe Shelly Wall Display XL, panelu 10,1 cala z RK3566 i Androidem 11, o nazwie kodowej Blake.
vendor: Shelly
model: Wall Display XL
soc: RK3566
android: '11'
screen: 10,1 cala
support: Nieprzetestowany
root: Nieustalone dla tego modelu
webview: 'Nieustalone (kanał WallDisplayV2 nie zawiera pakietu OTA WebView)'
released: '2025-09 (szac.)'
photos:
  - src: 'asset:hardware-shelly-wall-display-xl-front.jpg'
    alt: Shelly Wall Display XL, przód
  - src: 'asset:hardware-shelly-wall-display-xl-screen-trim.jpg'
    alt: Shelly Wall Display XL, ekran widziany na wprost
  - src: 'asset:hardware-shelly-wall-display-xl-profile-trim.jpg'
    alt: Shelly Wall Display XL, profil boczny pokazujący głębokość montażu
photoCredit: 'Zdjęcie: Shelly'
evidence: [firmware, documented, platform]
sidebar:
  label: Wall Display XL
  order: 5
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Nie przetestowano żadnego egzemplarza tego modelu.** [Strona rodziny Wall Display](/pl/hardware/panels/shelly/) opisuje źródła informacji, mechanizm OTA firmware, model dostępu i uwagi dotyczące bezpieczeństwa wspólne dla całej rodziny.
:::

Wall Display XL, o nazwie kodowej firmware **Blake**, to panel 10,1 cala z Rockchip RK3566 (Cortex-A55) i Androidem 11 — największy i najwydajniejszy model [rodziny Shelly Wall Display](/pl/hardware/panels/shelly/). Korzysta z nowoczesnego kanału OTA **WallDisplayV2** (arm64-v8a), obok [X1i](/pl/hardware/panels/shelly/wall-display-x1i/), [X2i](/pl/hardware/panels/shelly/wall-display-x2i/), Maverick i Dayna, i ma dostęp do wbudowanego AppStore.

## Początkowy dostęp do debugowania

**Sieciowe ADB na porcie TCP 5555 bez komputera: nieustalone dla tego modelu.** Początkowe debugowanie USB i odblokowanie menu producenta również nie są tu zweryfikowane. [Procedura X2i](/pl/hardware/panels/shelly/wall-display-x2i/#unlocking-developer-mode) jest potwierdzona wyłącznie na X2i; wspólny firmware nie dowodzi, że działa tutaj. Poproś Shelly o procedurę dla swojego modelu i firmware. Użyj [instalatora USB](/pl/install/install-over-usb/) dopiero po udostępnieniu debugowania USB i połączenia USB do danych. Sama kompilacja obsługująca root nie włącza debugowania.

## Sprzedawany również jako

Shelly Wall Display XL, nazwa kodowa firmware Blake.

|            |                                                                                                                                                                                                                                                                                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC        | Rockchip **RK3566**, Cortex-A55                                                                                                                                                                                                                                                                                                                                  |
| Ekran      | 10,1 cala                                                                                                                                                                                                                                                                                                                                                        |
| Android    | 11                                                                                                                                                                                                                                                                                                                                                               |
| ABI        | arm64-v8a                                                                                                                                                                                                                                                                                                                                                        |
| Czujniki   | Udokumentowany czujnik światła otoczenia; czujnik ruchu (oficjalnie, dokładna technologia niezweryfikowana); dostęp przez API Androida niezweryfikowany                                                                                                                                                                                                          |
| Przekaźnik | 1 wyjście                                                                                                                                                                                                                                                                                                                                                        |
| Root       | Nieustalone dla tego modelu; nowoczesne OTA nie deklaruje typu kompilacji. Na [Wall Display X2i](/pl/hardware/panels/shelly/wall-display-x2i/) przetestowanym z fabrycznym firmware 2.5.4 opcje programisty i debugowanie USB odblokowuje się z aplikacji Ustawienia, po czym adb łączy się, nadal bez root; nie przetestowano, czy to samo dotyczy tego modelu. |
| Premiera   | Około września 2025 (szac.); Shelly wprowadziło XL w Europie około 10 września 2025 ([opis premiery, Notebookcheck, wrzesień 2025](https://www.notebookcheck.net/Shelly-launches-new-Wall-Display-XL-smart-home-hub.1110802.0.html))                                                                                                                             |

:::caution
Wbudowana przeglądarka Home Assistant na XL miała problemy z renderowaniem i układem z frontendem Home Assistant 2025.12 i wersją przedpremierową 2026.1 (opisane w [home-assistant/frontend#28755](https://github.com/home-assistant/frontend/issues/28755) i `#28746`; zgodność core w [home-assistant/core#162665](https://github.com/home-assistant/core/issues/162665)). Aplikacja korzystająca z systemowego WebView na tym samym urządzeniu renderowała poprawnie, co wskazuje na problem specyficzny dla WebView wbudowanej przeglądarki, a nie sprzętu.
:::

Od Panel Assistant 1.0 XL używa wspólnego profilu Shelly, który uwzględnia ustalenia z [X2i](/pl/hardware/panels/shelly/wall-display-x2i/) dotyczące tego firmware: pełne wyłączenie ekranu bez root oraz Wstecz i Ekran główny bez Ostatnich aplikacji. Jego własne czujniki są sprawdzane na panelu przy uruchomieniu Panel Assistant. Nie potwierdzono jeszcze żadnego XL, dlatego mile widziane jest zgłoszenie właściciela; zobacz [Co X2i oznacza dla reszty rodziny](/pl/hardware/panels/shelly/#what-the-x2i-means-for-the-rest-of-the-line).

[Strona rodziny Wall Display](/pl/hardware/panels/shelly/) zawiera pełne uzasadnienie modelu dostępu, punkty aktualizacji OTA (kanał `WallDisplayV2`) i historię wersji firmware.

## Źródło

[Baza wiedzy Shelly Wall Display XL](https://kb.shelly.cloud/knowledge-base/shelly-wall-display-xl).
