---
title: Instalacja przez USB
description: Uruchomienie zupełnie nowego panelu z przeglądarki za pomocą kabla USB, zanim trafi na ścianę.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Ścieżka USB jest dla panelu, który wciąż leży w pudełku, albo takiego, którego oprogramowanie producenta utrudnia dostęp przez sieć. Podłącz panel do komputera, przy którym siedzisz, a przeglądarka zainstaluje aplikację panelu prosto przez kabel. Panel nie potrzebuje sieciowego ADB. Przeglądarka musi utrzymywać połączenie z Home Assistant, który dostarcza zweryfikowane wydanie. Większość osób korzysta z tego dokładnie raz, zanim panel zostanie zamontowany.

## Zaczyna się w Home Assistant

Instalator USB uruchamia administrator z Home Assistant: przejdź do **Ustawienia**, **Urządzenia oraz usługi**, **Dodaj integrację**, wybierz **Panel Assistant**, a następnie **Zainstaluj przez USB na tym komputerze**. Link **Dodaj panel** na stronie Panel Assistant na pasku bocznym otwiera ten sam wybór. Home Assistant sprawdza wydanie i przekazuje je instalatorowi, który otwiera się we własnym, bezpiecznym oknie. Dlatego na tej stronie nie ma przycisku instalacji: strona, która wykonuje pracę, przyjmuje wydanie tylko od twojego własnego Home Assistant, więc na panel nie trafi nic, czego Home Assistant nie zweryfikował.

## Czego potrzebujesz

- Zainstalowanej [integracji](/pl/home-assistant/custom-integration/) i konta administratora.
- Przeglądarki opartej na Chromium, takiej jak Chrome lub Edge. Firefox i Safari nie potrafią komunikować się z urządzeniami USB.
- Kabla USB od panelu do komputera lub telefonu z tą przeglądarką. Nie do serwera Home Assistant.
- Włączonego debugowania USB w opcjach programisty panelu. Jeśli po podłączeniu panel wyświetli prośbę o autoryzację, ktoś przy panelu musi ją zaakceptować; niektóre panele nigdy o to nie proszą. [Strony sprzętu](/pl/hardware/) pokazują, jak dostać się do opcji programisty w każdym modelu.

## Co się dzieje

1. Wybierz **Otwórz instalator USB**. Na otwartej stronie pozostaw zalecaną wersję i naciśnij **Dalej**. Home Assistant oferuje najnowsze zgodne wersje, które może zweryfikować. Wersje testowe są oznaczone i oferowane, gdy działająca integracja na nie pozwala.
2. Instalator otwiera się w nowym oknie i weryfikuje wydanie. Naciśnij **Znajdź mój panel** i wybierz panel z listy w przeglądarce.
3. Jeśli panel poprosi o zezwolenie na debugowanie USB, zaznacz **Zawsze zezwalaj z tego komputera** i zatwierdź na ekranie panelu. Niektóre panele nie pytają i instalator przechodzi od razu dalej.
4. Potwierdź. Nic na panelu się nie zmieni, dopóki tego nie zrobisz. Instalator odmawia nadpisania innej istniejącej instalacji; jeśli zainstalowana jest dokładnie wybrana kompilacja, kończy jej konfigurację.
5. Nie odłączaj kabla i nie zamykaj okna, dopóki instalator nie zgłosi zakończenia. To samo okno przechodzi następnie do kreatora konfiguracji panelu, w którym dokończysz pracę. Kreator jest udostępniany przez panel, więc komputer musi być w tej samej sieci co panel.

Jeśli kabel wypadnie w trakcie, podłącz go ponownie, poczekaj na uruchomienie panelu, naciśnij przycisk na ekranie błędu instalatora, a potem **Znajdź mój panel**. Jeśli okno instalatora zostało zamknięte, zacznij ponownie z Home Assistant i wybierz tę samą wersję. W obu przypadkach instalator przechowuje postęp w twojej przeglądarce, przed czymkolwiek innym sprawdza krok, na którym został przerwany, i kontynuuje od tego miejsca, zamiast zaczynać od nowa.

## Potem

Na panelu działa już aplikacja. Panel prosto z pudełka nie jest jeszcze w twojej sieci, więc połącz go ze swoim Wi-Fi w jego własnej aplikacji Ustawienia, przed instalacją lub po niej: zarówno kreator konfiguracji, jak i połączenie z Home Assistant tego wymagają. Jeśli po ukończeniu konfiguracji panel nie pojawia się w Home Assistant, przejdź do **Ustawienia**, **Urządzenia oraz usługi**, **Dodaj integrację**, wybierz **Panel Assistant**, a potem **Dodaj panel w swojej sieci** i podaj adres panelu. Instalator USB nie aktualizuje panelu, który ma już aplikację; w tej sprawie zajrzyj do [Aktualizacji i odzyskiwania](/pl/manage/updates-and-recovery/).
