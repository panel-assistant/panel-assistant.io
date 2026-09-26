---
title: Jak to działa
description: Co Panel Assistant umieszcza na panelu, co zostaje w Home Assistant i dlaczego całość może być w pełni open source.
sourceCommit: cb91a53b7fe4ae129274b56dae846d3dcc4a9eff
---

Panel Assistant składa się z dwóch części. Jedna działa w Home Assistant i to ją widzisz i z niej korzystasz. Druga działa na każdym panelu i to ona sprawia, że panel jest szybki.

## W Home Assistant: integracja

Integrację instalujesz przez HACS. To w niej dodaje się panele, w niej każdy panel pojawia się jako urządzenie z własnym stanem i diagnostyką, a strona Panel Assistant na pasku bocznym pokazuje wszystkie twoje panele razem z informacją, czy każdy z nich jest osiągalny, jaką wersję uruchamia i czy coś wymaga uwagi.

Jest to też instalator. Podaj jej adres nowego panelu albo podłącz nowy panel do laptopa, a integracja sprawdzi, co na nim jest, zainstaluje aplikację panelu, uruchomi ją i dopiero wtedy utworzy urządzenie. Jeśli na panelu aplikacja już działa, integracja zamiast tego go przejmie.

## Na panelu: aplikacja

Panel ścienny to mały komputer z Androidem, a większość z nich wydaje się wolna z powodu oprogramowania, z którym przyszły. Panel Assistant zastępuje tę część oprogramowania, która ma znaczenie, własną aplikacją, która robi trzy rzeczy.

- **Wyświetla twój pulpit nawigacyjny.** Aplikacja sama ładuje twój istniejący pulpit nawigacyjny Home Assistant, ustala, które encje ten pulpit faktycznie pokazuje, i prosi Home Assistant tylko o nie. Na tanim panelu to właśnie w dużej mierze różnica między opóźnieniem a jego brakiem.
- **Obsługuje sprzęt panelu.** Ekran, jego jasność i uśpienie, diody LED, przyciski, przekaźniki, czujniki zbliżeniowe i czujniki światła oraz wszystko inne, co ma dany model, są sterowane bezpośrednio i pojawiają się w Home Assistant jako encje urządzenia panelu. Każdy model jest opisany profilem sprzętowym: zwykłym tekstem, który możesz czytać, edytować i sprawdzać w przeglądarce na panelu, bez narzędzi programistycznych. Panel, którego projekt jeszcze nie spotkał, zaczyna od ostrożnego profilu ogólnego, który daje mu pulpit nawigacyjny, czujniki, jasność, dźwięk i nawigację, jakie może zapewnić każde urządzenie z Androidem, a resztę zyskuje w miarę uzupełniania jego profilu. Działający panel sprawdza każdą zadeklarowaną możliwość, zanim jej użyje, więc brakująca funkcja jest pokazana jako zablokowana i objaśniona, a nie zostawiona zepsuta, a profil, który zawiedzie przy starcie, zostaje wycofany do ostatniego, który działał.
- **Zachowuje się jak zwykłe urządzenie domowe.** Aplikacja zastępuje launcher producenta, daje panelowi bez przycisków sposób poruszania się po ekranie, udostępnia w twojej sieci własną stronę stanu i sama się naprawia, gdy coś pójdzie nie tak, więc panel można zamontować raz i zostawić w spokoju.

Ta aplikacja nazywa się ha-paneld. Nazwa pochodzi z jej historii jako pomocnika działającego w tle, na którym polegało inne oprogramowanie do pulpitów nawigacyjnych, a od tego czasu rozrosła się w całą panelową część produktu. Spotkasz tę nazwę w dokumentacji referencyjnej i na stronie stanu samego panelu i warto ją znać, żeby nic cię nie zaskoczyło, ale nigdy nie musisz jej wpisywać ani o niej myśleć, żeby korzystać z Panel Assistant.

## Dlaczego może być open source

Większość producentów paneli dostarcza obsługę sprzętu jako zamknięte biblioteki, z których wolno korzystać tylko ich własnej aplikacji. ha-paneld ich nie używa. Steruje sprzętem każdego panelu bezpośrednio, przez własne profile dla poszczególnych modeli, co kosztowało dużo pracy i jest powodem, dla którego projekt w ogóle ma obsługę sprzętu. To także powód, dla którego całość można rozdawać: nie ma w niej kodu producenta, więc nic nie stoi na przeszkodzie, żeby była darmowa i open source na liberalnych licencjach, dla każdej marki panelu.

Z tego samego powodu obsługa sprzętu to miejsce, w którym projekt najbardziej potrzebuje pomocy. Każdy panel, który zostanie zgłoszony, działający czy nie, ulepsza kolejny profil. Zobacz [Wybór panelu](/pl/install/supported-panels/), żeby sprawdzić, jak dziś wygląda obsługa.

## Gdzie są poszczególne części

| Część                     | Co to jest                                                                          | Gdzie                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Panel Assistant           | Integracja Home Assistant: instalator, urządzenia i strona wszystkich paneli.       | [panel-assistant/ha-integration](https://github.com/panel-assistant/ha-integration) |
| ha-paneld                 | Aplikacja na panelu: pulpit nawigacyjny, sprzęt, launcher, strona stanu.            | [panel-assistant/android](https://github.com/panel-assistant/android)               |
| Profile sprzętowe         | Opisy poszczególnych modeli, które mówią aplikacji, co ma panel i jak nim sterować. | [Dokumentacja sprzętu](/pl/hardware/)                                               |
| Dokumentacja referencyjna | Szczegóły API, profili sprzętowych i modelu bezpieczeństwa.                         | [Dokumentacja referencyjna](/pl/reference/api/)                                     |

## Czym to nie jest

Jest przeznaczony do dedykowanych paneli ściennych. Tablety i telefony mogą go uruchomić, ale wszystko, co ma baterię, ma też kabel, a projekt zakłada panel zasilany z sieci, który konfiguruje się raz i zostawia w spokoju. Nie służy do budowania pulpitów nawigacyjnych; uruchamia te, które już masz. I nie jest skończony: kierunek to uniwersalna obsługa sprzętu i bezobsługowe zarządzanie każdym panelem.
