---
title: Wbudowany renderer
description: Jak aplikacja panelu samodzielnie wyświetla pulpit Home Assistant, odzyskuje działanie po awarii i filtruje odbierane encje.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Aplikacja panelu wyświetla pulpit Home Assistant we własnym WebView zamiast przekazywać go osobnej aplikacji pulpitu. Dzięki temu szybko wraca do pulpitu po ponownym uruchomieniu: może otworzyć ostatni pulpit zweryfikowany przez Home Assistant dla tego samego serwera, konta i ustawienia pulpitu głównego, jednocześnie odświeżając listę pulpitów w tle. Jeśli Home Assistant zgłosi usunięcie pulpitu lub zmianę domyślnego pulpitu konta, panel przechodzi do bieżącego wyboru.

Po uruchomieniu pulpitu aplikacja panelu potrafi wykrywać zablokowane połączenie, zwalniać nagromadzoną pamięć WebView i ograniczać skutki awarii renderera. Wbudowane połączenie umożliwia również filtrowanie encji pulpitu. Panel pozostaje urządzeniem obsługiwanym przez jedną aplikację, którą trzeba instalować i aktualizować.

Wbudowany renderer jest zdecydowanie zalecanym sposobem wyświetlania pulpitu i wybiera go konfiguracja z przewodnikiem. Osobna aplikacja pulpitu nadal jest obsługiwana, na przykład gdy panel potrzebuje więcej niż jednego serwera Home Assistant lub natywnych powiadomień (zobacz [Ograniczenia](#ograniczenia)). Sterowanie głosowe Assist nie zależy od aplikacji pulpitu: na panelu z mikrofonem zapewnia je własny [asystent głosowy](/pl/manage/voice-assistant/) panelu, niezależnie od uruchomionej aplikacji.

## Uruchamianie i odzyskiwanie

Renderer korzysta z udokumentowanego interfejsu Home Assistant `?external_auth=1`, dzięki czemu aplikacja panelu rozpoznaje połączenie pulpitu zamiast traktować stronę jak czarną skrzynkę. Renderer:

- Po ponownym uruchomieniu aplikacji otwiera ostatni zweryfikowany pulpit i odświeża listę pulpitów Home Assistant w tle. Najpierw nadal wykonuje krótki test zgodności. Zapamiętany pulpit jest powiązany z serwerem Home Assistant, kontem i skonfigurowanym pulpitem; jawnie wybrany pulpit lub jego karta zawsze mają pierwszeństwo.
- Zamraża stronę przy wyłączonym ekranie i wznawia ją po wybudzeniu, ograniczając nocne zużycie procesora przez renderer o około 70%.
- Ponownie ładuje pulpit, który się otworzył, ale nie nawiązał połączenia. Po kolejnych niepowodzeniach próbuje rzadziej, a panel pokazuje czytelny ekran **Ponowne łączenie z Home Assistant…** zamiast strony błędu przeglądarki.
- Ponawia sprawdzenia, których błąd można usunąć, z rosnącymi opóźnieniami. Trwale odrzucone logowanie zatrzymuje próby i wyświetla instrukcje logowania przez przeglądarkę. Nieobsługiwana wersja Home Assistant lub niezgodny WebView wskazują wymaganą aktualizację i czekają na nią.
- Zwalnia nagromadzoną pamięć przez niewidoczne przeładowania przy wyłączonym ekranie.
- Ogranicza skutki i częstotliwość awarii renderera. Strona, która ciągle ulega awarii, wraca do ekranu administracyjnego zamiast uruchamiać się ponownie przez całą noc.
- Gdy Home Assistant ogłasza zatrzymanie lub przestaje być dostępny, pokazuje na panelu natywny komunikat i usuwa go dopiero po potwierdzeniu powrotu Home Assistant.

Pociągnij w dół od samej górnej krawędzi ekranu, aby odświeżyć, lub zrób to dwa razy, aby całkowicie przeładować stronę. Renderer obsługuje też opcjonalny powrót do pulpitu głównego po bezczynności, automatyczne odtwarzanie strumieni z kamer oraz HTTPS z prywatnym urzędem certyfikacji zainstalowanym przez użytkownika. **Ukryj paski systemowe Android** pozwala wypełnić ekran pulpitem; przesuń palcem od krawędzi, aby ponownie pokazać paski. Na panelach korzystających z programowego paska nawigacji aplikacji przycisk **Pulpit nawigacyjny** przenosi renderer na pierwszy plan bez przeładowania, a **Odśwież** jest osobnym działaniem naprawczym.

**Powiększenie (%)** dostosowuje rozmiar wyświetlanego pulpitu; wartość domyślna to 100%. Renderer dodaje do paska bocznego Home Assistant pozycję **Ustawienia aplikacji**, która otwiera konfigurację panelu. Przy pierwszym uruchomieniu ukrywa przypięty pasek boczny i utrzymuje połączenie podczas bezczynności; później można otworzyć pasek lub zmienić te ustawienia. Osobna opcja **Ukryj nawigację Home Assistant (natywnie)** prosi frontend o usunięcie nawigacji, gdy aktywny jest natywny tryb kiosku. Jeśli pulpit ma po prostu niewłaściwy rozmiar, zobacz [rozmiar wyświetlania](/pl/manage/display-sizing/).

## Wymagania i zgodność

Wbudowany renderer wymaga obu elementów:

- **Home Assistant 2026.4.2 lub nowszego**;
- Android System WebView obsługującego bezpieczny odbiornik WebMessage używany przez natywny interfejs hosta Home Assistant.

Większość osób potrzebuje tylko aktualnego Android System WebView. Aplikacja panelu sprawdza tę funkcję WebView i zgodność Home Assistant przed załadowaniem pulpitu.

Jeśli panel pokazuje **Wymagana aktualizacja Home Assistant**, zaktualizuj Home Assistant i wybierz **Spróbuj ponownie**. Nic na panelu nie może zastąpić tej aktualizacji.

Jeśli pokazuje **Przeglądarka internetowa tego panelu jest zbyt stara**, wykonaj [aktualizację WebView](/pl/hardware/guides/update-the-webview/). W niewydanej wersji 1.0.0-rc2 aktualizacja aplikacji panelu rozpoczęta z Home Assistant może również zainstalować zweryfikowany, zgodny WebView, jeśli panel na to pozwala. Pozostałe panele wymagają metody opisanej w przewodniku. Po aktualizacji WebView wybierz **Spróbuj ponownie**.

Wbudowany renderer nigdy nie przechodzi na most o słabszej izolacji. Inny renderer może pomóc, gdy nie można zaktualizować samego Home Assistant, ale każda aplikacja pulpitu na panelu korzysta z tego samego systemowego WebView, więc żadna nie omija jego przestarzałej wersji.

## Konfiguracja

Na nowym lub zresetowanym panelu wybierz **Konfiguracja wstępna** na samym panelu albo otwórz jego stronę konfiguracji na laptopie lub telefonie (na przykład `http://<panel>:8888/setup` przy domyślnym porcie). Konfiguracja z przewodnikiem wybiera renderer, loguje do Home Assistant, wybiera domyślny pulpit konta, pulpit lub konkretną kartę i pyta o filtr encji przed pierwszym załadowaniem pulpitu. Autoryzacja odbywa się w przeglądarce administratora, więc na panelu nie wpisuje się danych logowania.

Na już skonfigurowanym panelu użyj **Odwiedź** na stronie urządzenia panelu w Home Assistant, a następnie otwórz **Konfiguracja**. W sekcji **Połączenie z Home Assistant** wpisz adres URL Home Assistant i wybierz **Logowanie przez przeglądarkę**, a jako aplikację pulpitu wybierz **Wbudowany renderer**.

## Wygląd pulpitu i blokada Androida

Ustawienia zaawansowane na stronie Konfiguracja obejmują trzy niezależne opcje, z których każda dotyczy innej warstwy:

| Opcja konfiguracji                                                       | Co zmienia                                                                                                                                                                                                                                                            | Czego **nie** zmienia                                                                                                                                                                       |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ukryj nawigację Home Assistant (natywnie)** (domyślnie wyłączona)      | Po połączeniu Home Assistant prosi jego frontend o ukrycie nawigacji. Tylko wbudowany renderer.                                                                                                                                                                       | Nie blokuje Androida, nie ukrywa jego pasków systemowych ani nie wstrzykuje lub zmienia CSS pulpitu. Jeśli Home Assistant odrzuca żądanie lub go nie obsługuje, pulpit pozostaje bez zmian. |
| **Ukryj paski systemowe Android** (domyślnie włączona)                   | Ukrywa paski stanu i nawigacji Androida, aby pulpit wypełniał ekran. Przesuń palcem od krawędzi, aby je pokazać. Tylko wbudowany renderer.                                                                                                                            | Nie uniemożliwia opuszczenia aplikacji ani nie ukrywa menu i nawigacji samego Home Assistant.                                                                                               |
| **Zablokuj Android na pulpicie (eksperymentalne)** (domyślnie wyłączona) | Z uprawnieniami root ukrywa paski systemowe Androida i wraca do wybranego pulpitu w ciągu około trzech sekund po otwarciu innej aplikacji lub ostatnich aplikacji. Zniechęca do przypadkowego użycia; nie stanowi granicy bezpieczeństwa wobec zdeterminowanej osoby. | Nie zmienia wyglądu pulpitu. Nie działa bez root. Po ponownym uruchomieniu pozostawia 60 sekund bez blokady na odzyskiwanie, po czym ponownie stosuje zapisaną blokadę.                     |

Aby uprościć wygląd pulpitu, włącz **Ukryj nawigację Home Assistant (natywnie)**, gdy nikt nie potrzebuje nawigacji Home Assistant na panelu; **Ukryj paski systemowe Android** jest już włączone. Włącz **Zablokuj Android na pulpicie** tylko wtedy, gdy chcesz zniechęcić do swobodnego opuszczania aplikacji, i dopiero po sprawdzeniu sposobów wyjścia: strony Konfiguracja, przełącznika Home Assistant, `adb`, siedmiu szybkich dotknięć lewego górnego rogu lub okresu bez blokady po ponownym uruchomieniu.

## Filtr encji

:::caution
Automatyczne uczenie nie może potwierdzić każdej zależności niestandardowej karty lub dynamicznego szablonu, a niepełny zbiór encji może powodować brak kart lub nieaktualne dane. Sprawdzaj wyuczony zbiór po zmianach pulpitu i zachowaj możliwość szybkiego wyłączenia filtra.
:::

Filtr dotyczy tylko wbudowanego renderera. Zmienia subskrypcję frontendu w Home Assistant, dzięki czemu Home Assistant filtruje stany przed ich serializacją i wysłaniem do panelu. Nie wpływa na inne aplikacje pulpitu. [Wydajność](/pl/manage/performance/) wyjaśnia, dlaczego zwykle daje to największą poprawę na wolnym panelu.

### Automatyczny przebieg

1. Użyj **Odwiedź** na stronie urządzenia panelu w Home Assistant, otwórz **Konfiguracja**, następnie **Pulpit**, wybierz **Wbudowany renderer** i włącz **Filtrowanie encji**.
2. Otwórz kartę **Encje** i wybierz **Przeskanuj pulpit teraz**.
3. Odwiedź każdą kartę pulpitu i użyj jej elementów sterujących, okien oraz treści warunkowych, aby panel mógł obserwować ich zależności podczas działania.
4. Przejrzyj listy bieżących, sugerowanych i wykluczonych encji. Przypnij encje używane pośrednio przez niestandardowe karty lub szablony i rozwiąż problemy filtra wskazane nad tabelami.
5. Gdy proponowany zbiór będzie gotowy, wybierz **Zastosuj zestaw reguł**. Panel pokazuje starą i nową liczbę encji przed prośbą o potwierdzenie, po czym przeładowuje pulpit z filtrowaną subskrypcją.

![Karta Encje interfejsu internetowego panelu z filtrem subskrypcji encji oraz encjami bieżącymi i sugerowanymi](/screenshots/ui-entities-dark.png)

Strona Encje wyjaśnia powód znalezienia każdej encji, zapisuje ręczne przypięcia i wykluczenia oraz pokazuje rozpoznane szerokie lub dynamiczne reguły, dopóki ich nie poprawisz albo jawnie nie wybierzesz dalszego postępowania. Nierozpoznane zachowania nadal mogą występować, dlatego po włączeniu filtra sprawdź każdą kartę pulpitu. Jeśli czegoś brakuje, wyłącz **Filtrowanie encji** na stronie Konfiguracja i przeładuj pulpit przed poprawieniem proponowanego zbioru.

### Gdy panel wstrzymuje pulpit

Przy włączonym automatycznym filtrowaniu wbudowany renderer nigdy nie otwiera Home Assistant bez filtra. Dopóki skanowanie nie utworzy zbioru, który panel może uznać za wiarygodny, pokazuje on natywny ekran wstrzymania zamiast pulpitu z jednego z trzech powodów. Podczas pierwszego skanowania lub po jego niepowodzeniu panel ponawia je z rosnącymi odstępami, ponieważ zwykle przyczyną jest jeszcze niedostępny Home Assistant. Jeśli Home Assistant odrzuca dane uwierzytelniające panelu, ekran wskazuje logowanie. Jeśli skanowanie zakończyło się, ale znalazło regułę, której zakresu nie można ograniczyć, na przykład pulpit generowany przez strategię lub selektor bez ograniczeń, ekran prosi o decyzję: zignorować wskazane reguły i kontynuować, wyłączyć filtr albo przejrzeć je na stronie Encje. Decyzję można podjąć na panelu lub z dowolnego urządzenia w sieci: użyj **Odwiedź** na stronie urządzenia panelu w Home Assistant, a następnie otwórz **Encje** (na przykład `http://<panel>:8888/entities` przy domyślnym porcie). Ekran wstrzymania również pokazuje adres.

Wstrzymanie oczekujące na decyzję jest stanem ustalonym, więc panel nie skanuje w tym czasie ponownie katalogu. Pyta Home Assistant o zmianę pulpitu pięć minut po ustaleniu tego stanu, a następnie najwyżej raz na godzinę. Ponawia skanowanie tylko po rzeczywistej zmianie konfiguracji pulpitu lub domyślnego pulpitu konta, po podjęciu decyzji albo po zmianie ustawień Home Assistant na panelu.

Aktualizacja aplikacji panelu może wywołać ponowne sprawdzenie już filtrowanego pulpitu. Jeśli takie sprawdzenie wskaże regułę na pulpicie, dla którego panel już stosował filtr, panel zapisuje ją jako zignorowaną, przywraca używany zbiór encji i otwiera pulpit zamiast go wstrzymywać; reguła pozostaje widoczna na stronie Encje i można ją tam ponownie włączyć. Dotyczy to wyłącznie sprawdzenia wywołanego aktualizacją, gdy istnieje wcześniej zaakceptowany filtr i przywrócony zbiór nie jest pusty. Reguły, których panel nigdy nie może zignorować, na przykład zbyt duży pulpit do analizy, nadal wstrzymują renderer.

### Szablony i ręczne przypięcia

Aplikacja panelu nie uruchamia szablonów pulpitu, więc nie może wiedzieć, jakie encje zwraca szablon, i nie zgaduje. Dwa rodzaje encji używanych przez szablon traktuje inaczej.

Encje, które szablon tylko **odczytuje**, na przykład stan sprawdzany w warunku, nie wymagają działań. Home Assistant sam renderuje szablon i wysyła wynik osobną subskrypcją, której filtr nie dotyka. Te encje celowo nie występują na listach strony Encje; ich dodanie tylko niepotrzebnie powiększyłoby subskrypcję.

Encje **zwracane** przez szablon są inne. Stają się kartami pulpitu, które odczytują stan przez filtrowaną subskrypcję, więc muszą do niej należeć. Panel nie może ich odkryć bez uruchomienia szablonu, a zgoda na kontynuowanie mimo ostrzeżenia przy wykrywaniu encji również ich nie dodaje; pozwala tylko kontynuować automatyczne aktualizacje bez nich.

Aby dodać encję, wpisz dowolny fragment jej nazwy lub identyfikatora w polu wyszukiwania u góry strony Encje. Wyszukiwanie obejmuje pełny katalog Home Assistant, a nie tylko już znalezione encje, i pokazuje liczbę dopasowań w każdej tabeli. Ustaw każdą potrzebną encję jako **Przypięte**. Ręczne przypięcie pozostaje do czasu usunięcia, również po zmianach pulpitu i ponownych skanowaniach.

### Resetowanie wyuczonych danych

Użyj **Zresetuj wyuczone dane** na stronie Encje, gdy stare dane o pulpicie lub wcześniejsze ręczne decyzje zniekształcają proponowany zbiór. Po potwierdzeniu usuwa to wyuczony skład pulpitu i dane o zależnościach, ręczne przypięcia i wykluczenia oraz zignorowane decyzje bezpieczeństwa. Zachowuje sprawdzony aktywny filtr i katalog Home Assistant używany do nazw proponowanych encji, a przy włączonym uczeniu rozpoczyna nowe skanowanie. Reset odbudowuje zatem proponowany zbiór zamiast od razu rozszerzać subskrypcję do wszystkich stanów Home Assistant.

## Motywy

**Motyw pulpitu** (Konfiguracja, następnie Wbudowany renderer) określa, kto wybiera tryb jasny lub ciemny:

- **Zgodnie z Home Assistant** (domyślnie) pozostawia wybór Home Assistant. Panel dostarcza tylko punkt wyjścia: na Androidzie 13 i nowszym śledzi ustawienie systemowe na bieżąco, na Androidzie 10–12 stosuje je podczas ładowania pulpitu, a na Androidzie 9 i starszym określa je przełącznik **Tryb ciemny** (Konfiguracja, następnie Wyświetlacz). Motyw wybrany w Home Assistant ma pierwszeństwo przed tym punktem wyjścia.
- **Według otoczenia** wybiera tryb jasny lub ciemny na podstawie modelu pomieszczenia używanego przez automatyczną jasność. Automatyczna jasność musi być włączona; przed uzyskaniem użytecznych odczytów panel stosuje wybór Home Assistant. Zmiana wymaga pełnej minuty utrzymującego się światła lub ciemności.
- **Ciemny** i **Jasny** oddają wybór panelowi. Służy to pulpitowi kiosku z ukrytym paskiem bocznym, gdy z panelu w ogóle nie można otworzyć profilu Home Assistant.

Wymuszenie motywu zmienia tylko wybór jasny/ciemny. Nazwany motyw i jego kolory pozostają bez zmian, a powrót do opcji Zgodnie z Home Assistant przywraca poprzedni wybór jasny/ciemny lub Auto, jeśli nic nie ustawiono. Panel nigdy nie zmienia motywu zapisanego na koncie Home Assistant, więc ustawienie Ciemny na panelu nie przyciemni telefonu.

Istnieje jeden przypadek, którego panel nie może zastąpić. Jeśli ten użytkownik Home Assistant jawnie wybrał Jasny lub Ciemny zamiast Auto, ten wybór nadal ma pierwszeństwo, ponieważ jego zastąpienie wymagałoby zmiany ustawienia wspólnego dla wszystkich urządzeń, na których loguje się użytkownik. Ustaw motyw użytkownika na Auto lub utwórz dla panelu osobnego użytkownika Home Assistant, aby wybór panelu działał. Panel informuje o tej sytuacji: karta **Diagnostyka działania** w interfejsie internetowym wskazuje, że motyw Home Assistant zastępuje Motyw pulpitu, a wiersz `[renderer]` raportu `/diag` zawiera `theme_overridden=true`.

Interfejs internetowy panelu jest od tego niezależny i zawsze stosuje ustawienie przeglądarki, w której go oglądasz.

## Korzystanie z osobnej aplikacji pulpitu

Jeśli panel potrzebuje funkcji wymienionej w [Ograniczeniach](#ograniczenia), otwórz stronę Konfiguracja i wybierz inną zainstalowaną aplikację w polu **Aplikacja pulpitu**. Zmiana działa od razu. Nie wybieraj w tym celu **Auto**, ponieważ Auto korzysta z wbudowanego renderera, gdy jest gotowy.

## Ograniczenia

- **Brak obsługi więcej niż jednego serwera Home Assistant i natywnych powiadomień.** Jeśli są potrzebne, zachowaj na panelu osobną aplikację pulpitu. Sterowanie głosowe Assist nie należy do tych ograniczeń: zapewnia je własny [asystent głosowy](/pl/manage/voice-assistant/) panelu z mikrofonem, niezależnie od aktywnej aplikacji pulpitu.
- **Brak dodatków multimedialnych na pełnym ekranie**, takich jak wybór pliku lub odtwarzanie podobne do przesyłania na inne urządzenie. Wykraczają one poza zakres projektu.
- Do wyświetlania frontendu Home Assistant nadal potrzebny jest **aktualny systemowy WebView**. Przestarzały WebView powoduje ostrzeżenie o stanie w interfejsie internetowym; zaktualizuj go [metodą dla swojego panelu](/pl/hardware/guides/update-the-webview/).
- Logowanie przez przeglądarkę i zaawansowana instalacja bez interakcji działają bez root.
