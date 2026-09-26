---
title: Instalacja przez USB
description: Uruchomienie zupełnie nowego panelu z przeglądarki za pomocą kabla USB, zanim trafi na ścianę.
sourceCommit: e3bcf608109626496dd34c3ae14d144c5f355917
---

Ścieżka USB jest dla panelu, który wciąż leży w pudełku, albo takiego, którego oprogramowanie producenta utrudnia dostęp przez sieć. Podłącz panel do komputera, przy którym siedzisz, a przeglądarka zainstaluje aplikację panelu prosto przez kabel. Nic nie przechodzi przez twoją sieć, a serwer Home Assistant w ogóle nie musi widzieć panelu. Większość osób korzysta z tego dokładnie raz, zanim panel zostanie zamontowany.

## Zaczyna się w Home Assistant

Instalator USB otwiera administrator ze strony Panel Assistant na pasku bocznym Home Assistant. Home Assistant sprawdza wydanie i przekazuje je instalatorowi, który otwiera się we własnym, bezpiecznym oknie. Dlatego na tej stronie nie ma przycisku instalacji: strona, która wykonuje pracę, przyjmuje wydanie tylko od twojego własnego Home Assistant, więc na panel nie trafi nic, czego Home Assistant nie zweryfikował.

## Czego potrzebujesz

- Zainstalowanej [integracji](/pl/home-assistant/custom-integration/) i konta administratora.
- Przeglądarki opartej na Chromium, takiej jak Chrome lub Edge. Firefox i Safari nie potrafią komunikować się z urządzeniami USB.
- Kabla USB od panelu do komputera lub telefonu z tą przeglądarką. Nie do serwera Home Assistant.
- Włączonego debugowania USB w opcjach programisty panelu i kogoś przy panelu, kto zatwierdzi prośbę o autoryzację, gdy się pojawi. [Strony sprzętu](/pl/hardware/) pokazują, jak dostać się do opcji programisty w każdym modelu.

## Co się dzieje

1. Wybierz wersję na stronie Panel Assistant. Na liście są tylko te wydania ha-paneld, które Home Assistant może zweryfikować do instalacji: najnowsze stabilne wydanie oraz ewentualne niedawne wersje kandydujące, oznaczone jako wersje testowe.
2. Okno instalatora weryfikuje wydanie i prosi o wybranie panelu w oknie wyboru USB przeglądarki.
3. Zatwierdź prośbę o debugowanie USB na ekranie panelu.
4. Potwierdź. Nic na panelu się nie zmieni, dopóki tego nie zrobisz, a instalator najpierw sprawdza, czy panel jest naprawdę czysty: odmawia instalacji na istniejącej instalacji, zamiast ryzykować dane panelu.
5. Nie odłączaj kabla i nie zamykaj karty, dopóki instalator nie zgłosi zakończenia, a potem dokończ konfigurację z przewodnikiem na samym panelu.

Jeśli kabel wypadnie albo okno zamknie się w trakcie, podłącz go ponownie, jeszcze raz przekaż to samo wydanie z Home Assistant i ponownie połącz ten sam panel. Instalator przechowuje postęp w twojej przeglądarce, przed czymkolwiek innym sprawdza krok, na którym został przerwany, i kontynuuje od tego miejsca, zamiast zaczynać od nowa.

## Potem

Na panelu działa aplikacja i jest on gotowy do dodania do Home Assistant jako urządzenie. Instalator USB nie aktualizuje panelu, który ma już aplikację; w tej sprawie zajrzyj do [Aktualizacji i odzyskiwania](/pl/manage/updates-and-recovery/).
