---
title: Meta Portal 10" (2. generacja)
description: Dane sprzętowe i porady zakupowe Meta Portal 10 cali (2. generacja), model WD50JM, inteligentnego wyświetlacza Qualcomm QCS605 z Androidem 10, zmierzone na fizycznym egzemplarzu z Panel Assistant bez root.
vendor: Meta
model: Portal 10" (2nd gen), WD50JM
soc: Qualcomm QCS605
android: '10'
screen: 10,1 cala, 1280 × 800
support: Wstępne
root: Bez root; przełącznik ADB Meta wystarcza do konfiguracji
webview: Własny WebView Meta Chromium 131
released: '2019'
evidence: [bench, firmware, documented]
sidebar:
  label: Portal 10" (2. generacja)
  order: 1
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

:::note
**Wszystko na tej stronie zmierzono na jednym sklepowym Portal 10" (2. generacja)** z firmware Meta `QKQ1.210213.001.3051355900018050` (Android 10, poprawka bezpieczeństwa 2020-08-05), z Panel Assistant bez root. Obsługa Portal wymaga aplikacji panelu w wersji 1.0 lub nowszej. Niczego tu nie sprawdzono na innym modelu Portal; [strona rodziny Meta Portal](/pl/hardware/panels/meta/) opisuje pozostałe modele.
:::

Portal 10" (2. generacja), model **WD50JM**, to inteligentny wyświetlacz poziomy 10,1 cala z Qualcomm QCS605, około 3 GB RAM, kamerą 13 MP z własną lampką, dwoma mikrofonami, głośnikiem i fizycznym suwakiem prywatności. [Przełącznik ADB](#włączanie-adb) Meta jest wszystkim, czego potrzebuje Panel Assistant: aplikacja instaluje się przez USB, rozpoznaje Portal i ładuje własny profil sprzętu, a pulpit, kamera, mikrofon, hasło wybudzania, odpowiedzi głosowe, czujnik światła i rzeczywiste wyłączenie ekranu działają bez root.

To dobry panel z nietypowymi warunkami, głównie narzuconymi przez Meta. Istotne przed wydaniem pieniędzy opisuje sekcja [Przed zakupem](#przed-zakupem).

:::tip
Najważniejsze fakty: **pozostaw konto Meta zalogowane**, ponieważ przełącznik ADB wymaga jego PIN-u. **Przełącznik ADB wygląda tak samo po włączeniu i wyłączeniu**, więc sprawdzaj stan na komputerze. **Spodziewaj się ponownego włączania ADB po restarcie**, a debugowanie sieciowe używane przez Panel Assistant do aktualizacji nigdy go nie przetrwa. Aby przywrócić ustawienia fabryczne, trzymaj **oba przyciski głośności podczas podłączania zasilania, bez komputera podłączonego przez USB**.
:::

## Sprzedawany również jako

Meta Portal, Facebook Portal, Portal (2. generacja), Portal 10", model WD50JM. Android zgłasza model `Portal`, urządzenie i płytę `omni`, produkt `omni_prod`, producenta i markę `Facebook`, platformę sprzętową `atlas`.

|            |                                                                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SoC        | Qualcomm **QCS605**, 8 rdzeni                                                                                                                              |
| RAM        | Około **3 GB** (Android zgłasza 2.85 GB)                                                                                                                   |
| Pamięć     | 6.7 GB na aplikacje i dane, około 3.9 GB wolne po konfiguracji; brak gniazda karty pamięci                                                                 |
| Ekran      | **1280×800** poziomo, 10,1 cala, **około 149 ppi**, przy bazowej gęstości Androida 160 dpi. Kontroler dotyku FocalTech z wybudzaniem podwójnym dotknięciem |
| Android    | 10 (API 29), produkcyjna kompilacja `user`, SELinux enforcing; arm64-v8a                                                                                   |
| WebView    | Własna kompilacja Meta, Chromium **131**, aktualizowana przez usługę Meta w tle. Nie wymaga zmian WebView                                                  |
| Czujniki   | **Akcelerometr** i pochylenie; **światło otoczenia z kolorem**. **Brak czujnika zbliżenia**                                                                |
| Kamera     | Matryca **13 MP** w lewym górnym rogu ramki, z **zieloną lampką kamery** obok. Aplikacje takie jak aplikacja panelu otrzymują 1280×720                     |
| Dźwięk     | **Dwa mikrofony**, jeden głośnik                                                                                                                           |
| Prywatność | **Trójpozycyjny suwak**: kamera i mikrofony włączone; kamera zasłonięta; kamera zasłonięta i mikrofony wyłączone                                           |
| Przyciski  | Zwiększanie i zmniejszanie głośności. Brak przycisku zasilania                                                                                             |
| Łączność   | Wi-Fi, Bluetooth z **Bluetooth Low Energy**                                                                                                                |
| Złącza     | **USB-C**, używane przez ADB                                                                                                                               |
| Root       | Brak. Bez `su`, brak znanego odblokowania bootloadera. ADB zapewnia własne ustawienie Debug Meta                                                           |
| Premiera   | 2019 (zapowiedź we wrześniu, sprzedaż w październiku)                                                                                                      |

## Przed zakupem

Żaden z tych punktów nie jest powodem, by nie kupować Portal, ale każdy łatwiej znać wcześniej.

- **Potrzebujesz konta Facebook.** Konfiguracja Meta nie pozwala otworzyć Ustawień bez logowania. Oferuje Facebook lub WhatsApp; kod QR WhatsApp nigdy się u nas nie pojawił, a Facebook działał. Może to być nowe konto utworzone dla panelu.
- **Konto musi pozostać zalogowane.** Włączenie ADB pyta o PIN konta Meta utworzony podczas konfiguracji. Bez zalogowanego konta nie znaleźliśmy sposobu ponownego włączenia ADB, a ekranowy reset fabryczny Meta też przestał działać; dopiero [reset sprzętowy](#odzyskiwanie-reset-fabryczny) przywrócił Portal. Nie usuwaj konta i nie wyłączaj aplikacji konfiguracji Meta.
- **ADB nie pozostaje włączone.** Według zgłoszeń ustawienie ADB Meta wyłącza się przy każdym restarcie, więc spodziewaj się ponownego włączania; sieciowe połączenie debugowania Panel Assistant znikało przy każdym sprawdzonym restarcie. Ma to konsekwencje dla [aktualizacji](#aktualizacje).
- **Jeśli możesz, odmów pobrania firmware podczas konfiguracji.** Meta proponuje aktualizację. Odmówiliśmy, więc całą stronę przetestowano na kompilacji wskazanej na początku. Nie wiadomo, czy późniejszy firmware zmienia dostęp ADB, a Meta nie udostępnia powrotu.
- **Meta wycofuje Portal.** Zakończyła sprzedaż w 2022 i od tego czasu usuwa funkcje. Spodziewaj się wyłączania kolejnych usług Meta i być może metod logowania. Aplikacja panelu od nich nie zależy.
- Do instalacji potrzebujesz **komputera z przeglądarką opartą na Chromium i kabla USB-C do danych**, jak na każdym panelu instalowanym [przez USB](/pl/install/install-over-usb/).

## Włączanie ADB

Meta dokumentuje procedurę dla każdego Portal ([Meta, konfiguracja Portal dla aplikacji Androida](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/)):

1. Na Portal otwórz **Settings › Debug**.
2. Dotknij **ADB Enabled** i na żądanie wpisz PIN konta Meta.
3. Podłącz Portal do komputera przez USB-C.
4. Za pierwszym razem dotknij **Allow** na Portal, aby zaufać komputerowi.

:::caution
**Pozycja ADB Enabled wygląda identycznie przy włączonym i wyłączonym ADB, a każde dotknięcie przełącza stan.** Ekran Portal nie wskazuje stanu. Dowód jest tylko na komputerze: Portal na liście urządzeń USB przeglądarki lub w `adb devices`. Jeśli go nie ma, dotknij pozycji jeszcze raz i sprawdź zamiast dotykać wielokrotnie.
:::

Nie ma zweryfikowanego sposobu włączenia sieciowego ADB na porcie TCP 5555 bez komputera. Najpierw użyj powyższej ścieżki USB; samo włączenie przełącznika Meta nie jest zweryfikowaną metodą instalacji sieciowej. Instalator USB przygotowuje debugowanie sieciowe do późniejszych aktualizacji. Root nie jest potrzebny.

## Instalacja Panel Assistant

Zainstaluj aplikację panelu z Home Assistant przez [instalator USB](/pl/install/install-over-usb/), z Portal podłączonym przez USB-C i ADB włączonym jak wyżej. Panel Assistant jest wymagany: instaluje, łączy i aktualizuje aplikację. Na testowanym Portal instalator zakończył się prawidłowo, aplikacja pokazała konfigurację pulpitu i przy pierwszym starcie samodzielnie wybrała profil Portal 10" (2. generacja).

Dla Portal Panel Assistant przygotowuje również panel podczas instalacji: ustawia aplikację jako ekran główny, przyznaje uprawnienie mikrofonu i wyłącza wygaszacz oraz pasek przesunięcia w górę Meta; żadnej z tych rzeczy nie można zmienić w Ustawieniach Meta. O zgodę na kamerę panel pyta na ekranie przy jej pierwszym włączeniu.

Jedno ustawienie wybierasz samodzielnie: **powiększenie pulpitu**. Przy natywnej gęstości Portal pulpit jest większy niż na innych panelach poziomych. Profil domyślnie ustawia **Powiększenie (%)** na **85**, zachowując ostrość ekranów Androida; jeśli wolisz inny rozmiar, zmień go w ustawieniach [wbudowanego renderera](/pl/manage/built-in-renderer/).

Następnie jak zwykle [dodaj panel](/pl/install/installing-ha-paneld/) w Panel Assistant.

## Co działa

- **Pulpit**, płynnie, we własnym aktualnym WebView Meta.
- **Kamera.** Domyślnie wyłączona jak na każdym panelu, włączana z karty **Kamera** w Konfiguracji. Udostępnia wtedy strumień 1280×720 i obrazy nieruchome Home Assistant, a zielona lampka Portal świeci podczas użycia.
- **Mikrofony, hasło wybudzania i odpowiedzi głosowe.** Hasło zostało rozpoznane, a potok głosowy Home Assistant odpowiedział przez głośnik Portal. Zobacz [asystenta głosowego](/pl/manage/voice-assistant/).
- **Światło otoczenia**, z kolorem, jako zwykły czujnik Androida do adaptacyjnej jasności i Home Assistant.
- **Rzeczywiste wyłączenie ekranu bez root.** Aplikacja wyłącza ekran przez własny limit uśpienia Androida, więc podświetlenie całkiem gaśnie zamiast osiągać minimum. Jasność zero nie wystarcza na Portal: obraz pozostaje widoczny. Jeśli limit nie zadziała, aplikacja używa najciemniejszego ustawienia.
- **Wybudzanie**: podwójne dotknięcie ekranu, a także własne wykrywanie ruchu Meta, gdy ktoś porusza się w pobliżu.
- **Przycisk programu uruchamiającego** w nawigacji aplikacji otwiera jej własny ekran uruchamiania. Profil każe pominąć ekran Meta, będący tarczą zegara zamiast listą aplikacji.

## Bieżące ograniczenia

- **Automatyczne usypianie jest domyślnie wyłączone i zalecamy tak je pozostawić.** Portal nie ma czujnika zbliżenia, więc aplikacja nie wie, czy ktoś przed nim jest. Usypianie po bezczynności dotyku wyłączało ekran osobie siedzącej przed panelem, po czym wykrywanie ruchu Meta znów go budziło, wielokrotnie. Wykrywa ono każdy ruch, w tym przechodzącą osobę, czasem wybudzało ekran w pustym pomieszczeniu i nie jest dostępne innym aplikacjom, więc aplikacja panelu nie może używać go jako sygnału obecności. Nadal można wyłączać i włączać ekran z Home Assistant.
- **Dwa wskaźniki kamery.** Aplikacja rysuje własny wskaźnik na środku górnej krawędzi ekranu, a obiektyw i zielona lampka Portal są u góry po lewej. Wskaźnik ekranowy jest tu nadmiarowy i nie można go wyłączyć.
- **Suwak głośności Meta nie zmienia głośności multimediów**, używanej przez odpowiedzi i komunikaty. Może ona początkowo wynosić zero, wyciszając pierwszą odpowiedź. Ustaw ją przez **Głośność panelu** lub encję głośności Home Assistant; suwak Meta jej nie zmieni.
- **Ustawienia Androida są w większości niedostępne.** Meta zastępuje aplikację Ustawienia własną, ograniczoną. Panel Assistant ustawia potrzeby aplikacji podczas instalacji; reszty ustawień Androida nie można zmienić na samym panelu.

:::danger
**Nie wyłączaj aplikacji konfiguracji Meta (`com.facebook.alohaapps.devicesetup`) ani nie usuwaj konta Meta.** Po usunięciu konta i wyłączeniu aplikacji testowany Portal stracił przełącznik ADB i ekranowy reset fabryczny; odzyskał go dopiero [reset sprzętowy](#odzyskiwanie-reset-fabryczny). Pozostaw konto, ustawienia i aplikacje konfiguracji Meta w spokoju.
:::

## Aktualizacje

Portal nie potrafi samodzielnie instalować aktualizacji aplikacji, ponieważ wymaga to root. Panel Assistant aktualizuje go więc przez debugowanie sieciowe, które Portal wyłącza przy każdym restarcie, także po utracie zasilania. Panel działa wtedy dalej na posiadanej wersji, a Home Assistant pokazuje Naprawę, zgodnie z opisem [aktualizacji i odzyskiwania](/pl/manage/updates-and-recovery/#panel-którego-nie-można-zaktualizować).

Aby ponownie umożliwić aktualizacje, włącz [ADB](#włączanie-adb), podłącz Portal przez USB i uruchom instalator USB z Home Assistant, jak opisuje [panel, którego nie można zaktualizować](/pl/manage/updates-and-recovery/#panel-którego-nie-można-zaktualizować). Instalator niczego nie instaluje na Portal, który już ma aplikację; ponownie włącza debugowanie sieciowe, aby Panel Assistant mógł aktualizować. Po aktualizacji sprawdź, czy Portal nadal otwiera pulpit jako [ekran główny](#instalacja-panel-assistant).

## Prywatność

Portal pozostaje urządzeniem Meta z jej oprogramowaniem; aplikacja panelu tego nie zmienia. Poniżej podajemy pomiary testowanego egzemplarza, nie pełny audyt.

**Oprogramowanie Meta.** Przez około 25 minut po resecie fabrycznym wszystkie aplikacje Meta wysłały łącznie około 3 MB, a usługi analizy kamery i obecności Meta po mniej niż 0.05 MB. Ciągłe wysyłanie wideo byłoby znacznie większe, więc nie zaobserwowano go w tym okresie; to krótki test, który nie wyklucza sporadycznych wysyłek. Kilka usług utrzymuje połączenia z serwerami Meta, a system zapisuje zdarzenia analityczne, w tym każde użycie suwaka prywatności i stan lampki kamery.

**Analiza kamery Meta nie zapala zielonej lampki.** Własne wykrywanie ruchu i obecności Meta obserwuje pomieszczenie przez osobny, ograniczony strumień kamery działający stale bez lampki. Zielona lampka wskazuje tylko strumień używany przez inne aplikacje. Aplikacja panelu nie może otworzyć strumienia analizy Meta, więc przy każdym jej użyciu kamery lampka świeci.

**Suwak prywatności działa dla aplikacji panelu.** W pozycji kamery Android zgłasza kamerę jako niedostępną, a kamera aplikacji przestaje dostarczać obrazy. W pozycji wyłączonego mikrofonu asystent niczego nie słyszał. W 1.0 aplikacja śledzi zdarzenie prywatności Meta obok wyciszenia Androida i może pokazywać wyciszenie mikrofonu. Fizycznych zmian suwaka i uruchomienia z włączonym mikrofonem nie zakwalifikowano jeszcze dla tej ścieżki raportowania.

**Aplikacja panelu.** Kamera jest wyłączona do włączenia. Po włączeniu jej strumień jest dostępny klientom sieci lokalnej, z dźwiękiem pomieszczenia, gdy dozwolony jest dostęp do mikrofonu. Assist i encje Home Assistant używają własnego połączenia z Home Assistant.

## Odzyskiwanie: reset fabryczny

Sprzętowy reset Portal działa bez aplikacji Meta, sprawnego ekranu i ADB:

1. Odłącz zasilanie i **każdy kabel USB prowadzący do komputera**.
2. Przytrzymaj **oba przyciski głośności** i ponownie podłącz zasilanie, trzymając je, aż Portal pokaże kasowanie.

Reset usuwa wszystko, w tym aplikację panelu i jej ustawienia. Potem ponownie przejdź konfigurację Meta, [włącz ADB](#włączanie-adb) i [zainstaluj Panel Assistant](#instalacja-panel-assistant).

:::caution
**Z podłączonym kablem USB do komputera ta sama kombinacja nie resetuje Portal.** Uruchamia awaryjny tryb pobierania Qualcomm, widoczny na komputerze jako urządzenie USB Qualcomm. Tryb niczego nie zmienia. Odłącz zasilanie, aby go opuścić, odłącz USB i spróbuj ponownie.
:::

## Firmware

[Katalog firmware Portal 10" (2. generacja)](/pl/hardware/firmware/builds/meta-portal-10-gen2/) zawiera indeksowane kompilacje, oryginalne URL Meta i kopie Internet Archive.

## Źródło

[Meta for Developers: konfiguracja Portal dla aplikacji Androida](https://developers.meta.com/horizon/documentation/android-apps/portal-setup/): procedura ADB i lista obsługiwanych modeli.
