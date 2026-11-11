---
title: Aktualizacje i odzyskiwanie
description: Utrzymywanie aktualnej aplikacji na panelu i możliwości odzyskiwania po problemach.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

## Aktualizowanie panelu

**Z Home Assistant.** Każdy panel ma encję aktualizacji. Gdy opublikowana zostaje nowsza wersja, encja ją oferuje, a instalację uruchamia się przyciskiem; Panel Assistant instaluje aktualizację i potwierdza, że panel wrócił do prawidłowego działania. Używaj tej drogi. [Informacje o wydaniu](/pl/release-notes/) opisują zmiany w każdej wersji.

Aktualizacja rozpoczyna się, gdy Panel Assistant lub ty jawnie jej zażądacie. Aplikacja panelu nie instaluje zaplanowanych aktualizacji. Instaluj aktualizacje aplikacji panelu przez Home Assistant. Karta **Instalacja** panelu nie oferuje już osobnego wyboru wersji aplikacji.

Aktualizacja aplikacji panelu uruchomiona z Home Assistant może też zainstalować zweryfikowany, zgodny System WebView na obsługiwanych panelach. Jeśli etap silnika przeglądarki pozostaje niedokończony, użyj działania **Spróbuj ponownie** w naprawie aktualizacji. Przed zażądaniem kolejnej próby sprawdza ono dotychczasową pracę; nie ma zaplanowanego ponawiania. Pozostałe panele nadal wymagają Sklepu Play, firmware producenta lub ręcznej metody opisanej w [aktualizowaniu systemowego WebView](/pl/hardware/guides/update-the-webview/).

Obsługiwany panel z rootem może utrzymywać sieciowe ADB wyłączone, podczas gdy Panel Assistant zarządza nim przez uwierzytelnione połączenie aplikacji. Aktualizacje aplikacji i obsługiwane czynności konserwacyjne używają tego połączenia i uprzywilejowanego instalatora panelu. Lokalna usługa odzyskiwania może ponownie otworzyć sieciowe ADB, jeśli połączenie aplikacji przestanie być odnawiane lub wymaga tego odzyskiwanie.

### Panele wymagające ADB

Gdy instalujesz aktualizację z Home Assistant, Panel Assistant automatycznie używa ADB dla paneli, które nie mogą same jej zainstalować. Jeśli panel przyjmuje połączenie bez dotknięcia ekranu, pierwotna zgoda na instalację Panel Assistant obejmuje też utworzenie i zapisanie klucza ADB do przyszłych aktualizacji. Jeśli panel wymaga zatwierdzenia na ekranie, Home Assistant zgłasza naprawę wskazującą panel i rozpoczynającą autoryzację. Wykonaj naprawę, aby zatwierdzić monit na tym panelu.

### Panel, którego nie można zaktualizować

Niektóre panele można aktualizować tylko przez ADB, ponieważ nie mają sposobu samodzielnej instalacji aplikacji. Na nich ADB nie jest udogodnieniem: stanowi całą drogę aktualizacji. Gdy przestanie działać, panel nadal działa normalnie, ale bez ostrzeżenia pozostaje przy posiadanej wersji. Home Assistant pokazuje wtedy naprawę wskazującą panel.

Zwykle przyczyną jest zmiana na panelu, a nie w Home Assistant. Aktualizacja firmware producenta, przywrócenie ustawień fabrycznych lub opcja producenta przywracająca fabryczne oprogramowanie mogą wyłączyć opcje programistyczne Androida, a wraz z nimi ADB. Nic wtedy nie ostrzega, ponieważ z punktu widzenia panelu wszystko jest w porządku.

Ponowne włączenie opcji programistycznych i debugowania USB przywraca drogę aktualizacji na większości paneli. Kroki są takie same jak przy pierwszym przygotowaniu panelu: zobacz [przygotowanie panelu](/pl/install/prepare-a-panel/#1-opcje-programisty-i-debugowanie-są-włączone). Dostęp do tych ustawień różni się między panelami, a niektórzy producenci ukrywają je za sekwencją dotknięć na ekranie Informacje.

Jeśli naprawa pozostaje lub panel sam wyłącza debugowanie sieciowe, jak Meta Portal po ponownym uruchomieniu albo Shelly Wall Display po resecie, podłącz panel do komputera przez USB i uruchom instalator USB z Home Assistant, zgodnie z [instalacją przez USB](/pl/install/install-over-usb/#zaczyna-się-w-home-assistant). Nie trzeba najpierw niczego usuwać: na panelu, który ma już aplikację, instalator niczego nie instaluje. Jeśli panel zapyta, zaznacz **Zawsze zezwalaj z tego komputera** i dotknij **Zezwól**; instalator ponownie włączy debugowanie sieciowe i poinformuje, że Panel Assistant znów może dotrzeć do panelu. Od tej chwili Home Assistant oferuje aktualizację panelu, która zachowuje jego ustawienia i historię.

Jeśli Home Assistant pokazuje też **Zezwól na aktualizacje na …** dla panelu, jest on osiągalny, ale nie zaakceptował jeszcze tego Home Assistant. Otwórz tę naprawę albo przejdź do **Ustawienia**, **Urządzenia i usługi**, **Panel Assistant**, wybierz **Konfiguruj** dla panelu i **Zezwól na aktualizacje**, a następnie dotknij **Zezwól** na panelu, gdy zapyta.

## Co chroni aktualizacja

Panel Assistant sprawdza panel przed wprowadzeniem zmian i tworzy kopię zapasową jego ustawień przed każdą aktualizacją, zachowując ostatnich pięć kopii dla każdego panelu.

Przed zmianą, której nie jesteś pewien, samodzielnie utwórz kopię zapasową: w interfejsie internetowym panelu otwórz **Instalacja**, następnie **Kopia zapasowa** i zachowaj pobrany plik `.hpb`.

## Odzyskiwanie

Pulpit, który nie ładuje się po aktualizacji, zwykle wskazuje na systemowy WebView lub sam pulpit. Panel ma własne zachowanie [uruchamiania i odzyskiwania](/pl/manage/built-in-renderer/#uruchamianie-i-odzyskiwanie) dla takiej sytuacji. [Rozwiązywanie problemów](/pl/manage/troubleshooting/) opisuje typowe przyczyny. Panel z aplikacją 1.0 nie może wrócić do wcześniejszego wydania; [aktualizacja do 1.0](/pl/manage/upgrade-to-1-0/#powrót-do-poprzedniej-wersji) wyjaśnia, co można cofnąć.

Odzyskiwanie poniżej poziomu aplikacji to inna sprawa. Panel Assistant nigdy nie zmienia firmware panelu, ale na niektórych panelach z rootem można ręcznie tworzyć i przywracać kopie partycji firmware. Opisuje to [kopia zapasowa i przywracanie firmware](/pl/hardware/guides/firmware-backup-and-restore/).

:::danger
Przywracanie firmware jest eksperymentalne i nie zostało przetestowane na urządzeniu, które przestało działać. Traktuj pracę na partycjach panelu jako czynność mogącą pozostawić go niezdatnym do użytku i przed rozpoczęciem przeczytaj cały dokument.
:::
