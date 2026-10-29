---
title: Wydajność
description: Dlaczego panel ścienny może działać wolno z pulpitem sprawnym na telefonie, jak to zmierzyć i jakie poprawki mają największy wpływ.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Niedrogi panel ścienny z Androidem może reagować ospale, zacinać się podczas przewijania, wyświetlać pusty ekran lub przestać aktualizować dane, choć ten sam pulpit działa dobrze na telefonie lub komputerze. Zacznij od pracy wysyłanej panelowi przez Home Assistant, następnie zmierz pozostałe ograniczenia pulpitu i sprzętu, zanim uznasz, że panel trzeba wymienić.

:::tip
Częstą przyczyną jest liczba stanów i aktualizacji encji Home Assistant docierających do pulpitu. [Wyścig](/pl/manage/drag-race/) pokazuje ich koszt na dwóch identycznych panelach filmowanych obok siebie. Duża instalacja może zmuszać słaby panel do przetwarzania tysięcy encji, których nigdy nie wyświetla. Przy [wbudowanym rendererze](/pl/manage/built-in-renderer/) pierwszą poprawką do wypróbowania jest filtrowanie encji.
:::

## Zmierz przed wprowadzaniem zmian

Użyj **Odwiedź** na stronie urządzenia panelu w Home Assistant, aby otworzyć jego interfejs internetowy (na przykład `http://<panel-ip>:8888/` przy domyślnym porcie). Zapisuj ten sam widok pulpitu przez podobny czas przed każdą zmianą i po niej, aby porównanie było miarodajne.

- **Responsywność pulpitu**: rzeczywiste opóźnienie interakcji, najwolniejsza interakcja z podziałem na wejście, obsługę i prezentację, blokowanie głównego wątku, czas do interaktywności i nieoczekiwane przeładowania renderera.
- **Strumień stanów Home Assistant**: aktualizacje stanów na sekundę, tempo nieskompresowanego JSON, początkowy rozmiar danych, czas do oddania sterowania przez główny wątek i trzy encje o największym udziale w ostatniej godzinie, według tempa aktualizacji i objętości danych.
- **Wydajność** i **Najważniejsze procesy**: CPU, GPU, RAM, taktowanie, temperatura i najbardziej obciążające procesy.
- **Strumień z kamery**, na panelu z dostępną kamerą: subskrybenci utrzymujący sesję, używany koder, żądana i dostarczana liczba klatek oraz dostarczana przepływność obok limitu kodera. Tempo znacznie niższe od żądanego jest tak oznaczane bez przypisywania przyczyny: możliwe są odstępy przechwytywania w ciemnym pomieszczeniu, ścieżka kodowania i konkurencja o sprzęt wideo, a karta między nimi nie zgaduje. Żądanie nigdy nie jest po cichu zmniejszane; gdy sesja nie zapewnia strumieniowi żądanego tempa, karta pokazuje żądanie obok tempa przekazanego koderowi. Karta celowo nie podaje CPU, ponieważ kodowanie sprzętowe działa również w sprzęcie kodeka i kompozytorze, nie tylko w aplikacji, a żaden pojedynczy proces nie oddaje kosztu kamery. Całkowite obciążenie panelu odczytaj z Wydajności i Najważniejszych procesów.
- **Strona Encje**: bieżąca subskrypcja renderera, wyniki automatycznego uczenia i reguły pulpitu wymagające decyzji.
- **Raport diagnostyczny** (`/diag`): raport do skopiowania do zgłoszenia błędu, gdy przyczyna nadal jest niejasna.

Wbudowany renderer zbiera pomiary przeglądarki bezpośrednio i nie wymaga root ani debugowania WebView. Przy osobnej aplikacji pulpitu aplikacja panelu może pokazać CPU renderera i dane renderowania Androida, gdy dostępny jest root lub pomocnik, ale nie zmierzy rzeczywistego opóźnienia interakcji tamtej aplikacji.

Pomiar głównego wątku dla zdarzeń stanu zaczyna się przy przekazaniu odpowiedniej wiadomości Home Assistant, a kończy, gdy przeglądarka oddaje sterowanie po wszystkich procedurach obsługi i mikrozadaniach. Obejmuje niewielki koszt obserwatora aplikacji panelu i inną pracę w tym samym zadaniu wiadomości, dlatego celowo nie jest nazywany czasem przetwarzania wyłącznie Home Assistant. Tempo danych oznacza nieskompresowany JSON obsługiwany przez frontend, a nie skompresowany ruch sieciowy.

Szukaj korelacji na wyrównanym wykresie. Skoki interakcji pokrywające się z dużym ruchem stanów i zajętością zdarzeń stanów wskazują rozmiar strumienia. Długi czas obsługi przy spokojnym strumieniu wskazuje JavaScript pulpitu. Opóźnienie prezentacji i długie klatki wskazują układ, animację, kamerę lub multimedia. Powtarzane przeładowania wskazują pamięć lub niestabilność renderera. Czytaj pomiary razem; pojedynczy odczyt CPU sam nie ustali przyczyny.

Wiersz **Prawdopodobna przyczyna** stosuje te reguły zachowawczo i podaje pewność. Jeśli dowody nie wskazują jednej dominującej przyczyny, informuje o tym.

### Porównanie filtrowania i jego braku spoza panelu

Jeśli niefiltrowany pulpit przeciąża własny WebView, pomiary na stronie mogą przestać się zmieniać. Skrypt kolektora uruchomiony na komputerze odpytuje zamiast tego interfejs wydajności samej aplikacji panelu, należący do przestarzałego REST API (zobacz [dokumentację sterowania](/pl/reference/api/#the-rest-api-is-deprecated)). CPU całego panelu pozostaje więc widoczne, a przy root lub pomocniku także natywny pomiar wątku renderera Chromium. Skrypt zapisuje też wiek ostatniej partii pomiarów przeglądarki; ponad 15 sekund oznacza zatrzymany pomiar, a nie bieżący wynik.

Kolektor nie zmienia konfiguracji. Nigdy nie włącza, nie wyłącza ani nie przepisuje filtra encji; pierwsze żądanie może utworzyć jeden prywatny klucz instalacji w wewnętrznym stanie aplikacji. Wybierz ten sam widok i obciążenie dla obu pomiarów, zmień filtr w interfejsie panelu, poczekaj na przeładowanie pulpitu i wykonaj jedno polecenie z lokalnego [repozytorium ha-paneld](https://github.com/panel-assistant/android) dla każdego stanu:

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Porównaj wyniki:

```bash
python3 tools/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Każdy pomiar domyślnie trwa trzy minuty, z 30-sekundową rozgrzewką i odpytywaniem co 10 sekund. `--pair-with` używa niejawnego identyfikatora porównania z pierwszego wyniku, aby odrzucić inny fizyczny panel, inny skonfigurowany Home Assistant lub pulpit albo zmianę ustawienia wpływającą na pomiar bez zapisywania tych prywatnych wartości. Nie wykrywa ręcznej zmiany widoku w tym samym pulpicie, dlatego zachowaj ten sam widoczny widok i obciążenie.

Kolektor odrzuca pomiar, gdy oczekiwany tryb nie jest aktywny, zmienia się rewizja filtra lub generacja renderera, kompilacja lub konfiguracja podczas zbierania, następuje awaryjne wycofanie filtrowania albo pozostają mniej niż trzy próbki, mniej niż trzy próbki CPU całego panelu lub mniej niż trzy natywne próbki CPU renderera. Nadal zapisuje odrzucony wynik z dokładnymi powodami i nigdy nie nadpisuje istniejącego pliku.

JSON pomija URL i identyfikator panelu, URL Home Assistant i ścieżkę pulpitu, identyfikatory encji, nazwy procesów i skrót filtra. Panel oblicza niejawne odciski prywatnym losowym 256-bitowym kluczem instalacji, który go nie opuszcza; odciski są unikalne dla jednej pary porównania, więc nie można łączyć oddzielnych pomiarów ani zgadywać nazwy panelu. Panel, który nie może zapisać klucza, odmawia pomiaru. Liczba niefiltrowanych encji jest ostatnią zsynchronizowaną liczbą z katalogu, a nie odczytem na żywo z przeciążonego WebView; przy pustym katalogu jest niedostępna. Liczniki ruchu sieciowego i przeglądarki są normalizowane do rzeczywiście obserwowanych odstępów, więc pominięte odpytanie nie zniekształca porównania. Nieaktualne czasy i tempo ruchu przeglądarki są pomijane w podsumowaniach, podczas gdy CPU, pamięć, sieć i dane renderera z samej aplikacji nadal są zbierane.

### Opcjonalne zdalne debugowanie WebView

Wbudowane karty wydajności nie wymagają DevTools. Użyj karty **Zdalne debugowanie WebView** tylko do dogłębnego badania źródła strony.

Przy osobnej aplikacji pulpitu najpierw włącz jej własne zdalne debugowanie WebView i ponownie uruchom pulpit; inaczej przekaźnik nie znajdzie jej WebView. Sam przekaźnik sieciowy wymaga root.

### Wyklucz błąd nadzorcy Zigbee fabrycznego NSPanel Pro

Starszy fabryczny firmware Sonoff NSPanel Pro z rekurencyjnym przypisaniem `export LD_LIBRARY_PATH=/vendor/bin/siliconlabs_host/:${LD_LIBRARY_PATH}` może sprawić, że problemem wydajności stanie się sam `guard_process.sh` producenta. [Badanie społeczności](https://github.com/panel-assistant/android/issues/34) potwierdziło błąd na NSPanel Pro 120 z fabrycznym firmware 3.8.0 i zgłosiło go na wszystkich 16 panelach zgłaszającego. Skrypt dopisuje swój katalog na początku co pięć sekund. Po około dziesięciu godzinach zmienna środowiska przekracza limit pojedynczego ciągu Linux przy uruchamianiu programu, zewnętrzne polecenia zaczynają kończyć się `E2BIG`, `sleep` przestaje opóźniać pętlę, a nadzorca może zająć cały rdzeń CPU. Może też wtedy nie uruchomić ponownie zatrzymanego `zgateway`, pozostawiając Zigbee niedostępne. Firmware od 1.x do 3.x może być dotknięty wszędzie, gdzie istnieje ten sam wiersz, ale nie zostało to niezależnie zweryfikowane.

Szukaj tego wzorca, gdy poza tym bezczynny fabryczny NSPanel Pro zgłasza okresowe obciążenie systemu:

- `guard_process.sh` utrzymuje około 100% jednego rdzenia, a rozmiar procesu rośnie znacznie ponad prawidłowe około 9 MB;
- brakuje `zgateway` lub nie wraca on do działania;
- restart pomaga, ale obciążenie wraca po około dziesięciu godzinach.

Restart jedynie na pewien czas zeruje narastające środowisko. Powiązane zgłoszenie zawiera obejście z root i ADB dostarczone przez zgłaszającego, którego projekt niezależnie nie zweryfikował. Nie stosuj go, jeśli dokładne rekurencyjne przypisanie nie występuje raz w skrypcie producenta. Każda naprawa musi najpierw zweryfikować niepustą kopię i zachować właściciela, uprawnienia oraz metadane SELinux. Przy nieoczekiwanym dopasowaniu zatrzymaj się przed zmianami; po zmianie wycofaj ją, jeśli restart lub weryfikacja się nie uda, przywróć `/vendor` do odczytu i sprawdź zarówno `zgateway`, jak i jego dostępność w Home Assistant. Aktualizacja firmware przepisująca `/vendor` usuwa lokalną poprawkę, a błąd wraca tylko wtedy, gdy nowe firmware nadal zawiera przypisanie. Społeczność nie znalazła go w firmware 4.0.12 i 4.6.0.

To inny błąd niż stabilny `zgateway` kręcący się w pętli przy nieodpowiadającym radiu. Czujnik stanu Zigbee panelu rozdziela CPU nadzorcy i bramki, dowody dołączenia i historię restartów. Ostrzega o dokładnym rekurencyjnym przypisaniu, ale sam nie edytuje skryptów producenta. Skonfigurowana bramka, która jawnie nie dołączyła do sieci i przekracza 50% jednego rdzenia przez pięć jednominutowych próbek po 15-minutowym okresie ochronnym, jest automatycznie wyłączana i powstrzymywana; dołączony router z wysokim CPU wywołuje tylko ostrzeżenie.

## Poprawki według wpływu

### 1. Filtruj subskrypcję encji wbudowanego renderera

Frontend Home Assistant zwykle subskrybuje stan każdej encji widocznej zalogowanemu użytkownikowi. Panel musi odebrać i przetworzyć wszystkie te stany, nawet gdy pulpit używa tylko kilku. Wbudowany renderer może dodać wyuczony zbiór encji pulpitu do subskrypcji, aby Home Assistant filtrował strumień przed serializacją i wysłaniem. Panel zachowuje zwykłe uwierzytelnione połączenie z Home Assistant; bez proxy ani dodatkowego serwera.

Filtr dotyczy tylko wbudowanego renderera. Konfiguracja z przewodnikiem pyta o jego włączenie przed pierwszym ładowaniem; na już skonfigurowanym panelu:

1. Użyj **Odwiedź** na stronie urządzenia panelu w Home Assistant, otwórz **Konfiguracja**, następnie **Pulpit**, wybierz **Wbudowany renderer (ha-paneld)** i włącz **Filtrowanie encji**.
2. Otwórz kartę **Encje** i wybierz **Przeskanuj pulpit teraz**.
3. Odwiedź każdą kartę pulpitu i użyj jej elementów sterujących, okien i treści warunkowych, aby można było zaobserwować zależności podczas działania.
4. Przejrzyj bieżące, sugerowane i wykluczone encje. Przypnij wszystko, czego niestandardowa karta lub szablon potrzebuje pośrednio.
5. Rozwiąż problemy filtra encji. Zawęź szeroką lub dynamiczną regułę, gdy to możliwe, albo dokonaj jawnego wyboru i zaakceptuj ostrzeżenie panelu.
6. Zastosuj zbiór, pozwól przeładować pulpit i porównaj te same widoki przy użyciu kart wydajności na karcie Pulpit.

Automatyczne uczenie nie potwierdza każdej zależności niestandardowej karty lub dynamicznego szablonu. Brak encji może pozostawić kartę nieaktualną lub niedostępną, dlatego najpierw sprawdź wynik na panelu, od którego nie zależysz, i pozostaw filtrowanie wyłączone, dopóki proponowany zbiór nie będzie wiarygodny. Niefiltrowana subskrypcja pozostaje drogą powrotu: wyłącz **Filtrowanie encji** i przeładuj pulpit.

Jeśli stare wyuczone dane lub ręczne decyzje nie opisują już pulpitu, użyj **Zresetuj wyuczone dane** na stronie Encje. Po potwierdzeniu usuwa to wyuczony skład, przypięcia, wykluczenia i zignorowane decyzje bezpieczeństwa, zachowuje sprawdzony aktywny filtr i rozpoczyna nowy skan. Filtr pozostaje zabezpieczeniem podczas odbudowy proponowanego zbioru.

### 2. Odciąż sam pulpit

- Podziel gęsty pulpit na ukierunkowane widoki i unikaj ładowania niepotrzebnych kart.
- Preferuj karty wbudowane, gdy niestandardowa karta stale animuje, buduje duże drzewo dokumentu lub często wykonuje JavaScript.
- Obserwuj przetwarzanie interakcji, długie klatki animacji i przeładowania. Jeśli dominuje jeden widok, uprość go lub używaj `button.<panel>_reload` jako tymczasowego ratunku podczas szukania kosztownej karty.
- Testuj karty kamer i wykresów osobno. Dekodowanie, zapytania historii i renderowanie mogą dominować nawet przy poprawnym filtrowaniu encji.

### 3. Ogranicz zbędne aktualizacje u źródła

Filtrowanie chroni panel przed encjami, których nie pokazuje, ale nie obniża kosztu potrzebnej encji. Jeśli pulpit rzeczywiście pokazuje licznik mocy, czujnik odległości Bluetooth, szybko zmieniający się szablon lub intensywną encję diagnostyczną, ogranicz tempo aktualizacji źródła, jeśli integracja pozwala. Może to też ograniczyć pracę rejestratora i bazy całej instalacji Home Assistant.

Pomagają filtry throttle i delta ESPHome, interwały raportowania Zigbee, ustawienia integracji `scan_interval` i rzadsze aktualizacje szablonów. Przed zastosowaniem wszędzie sprawdź, czy zmiana nie zmniejsza użyteczności automatyzacji lub historii.

### 4. Dopasuj pozostały pulpit do sprzętu

Panele PX30 i RK3566 mogą dobrze obsługiwać skupiony pulpit, ale nadal mają ograniczoną wydajność jednowątkową i zwykle tylko 2 GB RAM. Filtr usuwa zbędną pracę nad stanami; nie sprawia, że zbyt duży strumień kamery, złożona animacja lub ogromny wykres historii stają się darmowe. Projektuj dla logicznego rozmiaru wyświetlacza i testuj najcięższy widok, zamiast oceniać tylko kartę główną. [Strony sprzętu](/pl/hardware/) porównują obsługiwane panele.

## Lista kontrolna

- [ ] Wbudowany renderer jest wybrany wszędzie, gdzie nie są potrzebne natywne powiadomienia
- [ ] Automatyczny filtr encji jest włączony, przeskanowany, przejrzany i jawnie zastosowany
- [ ] Podczas uczenia użyto każdej karty, okna i ścieżki warunkowej pulpitu
- [ ] Zależności niestandardowych kart i szablonów przypięto lub uwzględniono inaczej
- [ ] Problemy filtra rozwiązano świadomie, bez przypadkowego ignorowania
- [ ] Porównano te same widoki przed filtrowaniem i po nim przy użyciu kart wydajności na karcie Pulpit
- [ ] Jeśli strona zatrzymuje się bez filtra, oba pomiary zebrano i zweryfikowano skryptem
- [ ] Ciężkie karty, strumienie kamer i wykresy przetestowano osobno
- [ ] Potrzebne encje o wysokiej częstotliwości dostosowano u źródła, gdzie to właściwe
- [ ] W fabrycznym stosie Zigbee NSPanel Pro sprawdzono `guard_process.sh`
- [ ] Wypróbowano zarówno przeładowanie, jak i wyłączenie filtra jako drogi odzyskiwania

## Informacje uzupełniające

### Dlaczego duża instalacja Home Assistant może spowalniać panel

Frontend Home Assistant utrzymuje subskrypcję WebSocket bieżącego stanu i każdej późniejszej aktualizacji encji dostępnych użytkownikowi. Bez ograniczonego zbioru renderer otrzymuje znacznie więcej danych, niż używa skupiony pulpit ścienny. Główny wątek JavaScript musi parsować wiadomości, aktualizować model stanu frontendu i ustalać, czy zmieniło się coś widocznego.

Tanie panele są szczególnie wrażliwe, ponieważ JavaScript, układ i rysowanie silnie zależą od jednego wątku renderera. Dodatkowe rdzenie pomagają w innej pracy, ale nie usuwają tego opóźnienia, a ograniczony RAM sprawia, że odśmiecanie coraz bardziej przeszkadza wraz ze wzrostem pamięci WebView.

### Typowe objawy

| Objaw                                                                                                   | Prawdopodobna przyczyna                                                               |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Opóźniony dotyk, ospała nawigacja lub zacinające przewijanie                                            | Praca głównego wątku renderera wskutek dużego strumienia encji, ciężkich kart lub obu |
| Jeden widok jest znacznie gorszy od pozostałych                                                         | Kosztowne karty, dekodowanie kamery, historia lub duże drzewo dokumentu w tym widoku  |
| Cały widok znika, a otaczający interfejs pozostaje                                                      | Presja pamięci WebView lub awaria renderera                                           |
| Pulpit pogarsza się stopniowo przez kilka dni                                                           | Wzrost pamięci, fragmentacja lub karta gromadząca pracę                               |
| Encje przestają się aktualizować, a potem przychodzą naraz                                              | Przerwa WebSocket, ponowne połączenie lub nienadążający renderer                      |
| Podobne panele zachowują się inaczej                                                                    | Inna zawartość, subskrypcja encji, wersja WebView, czas działania lub temperatura     |
| Fabryczny NSPanel Pro zacina się około dziesięciu godzin po starcie, a `guard_process.sh` zajmuje rdzeń | Rekurencyjne przypisanie w nadzorcy Zigbee producenta prowadzące do `E2BIG`           |

Odśmiecanie okresowo zatrzymuje JavaScript, aby odzyskać nieużywaną pamięć. Blisko limitu pamięci przerwy są dłuższe i częstsze, co może zagłodzić renderowanie, nawet jeśli sam proces Androida nie uległ awarii.
