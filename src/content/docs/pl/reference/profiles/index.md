---
title: Profile paneli środowiska wykonawczego
description: Jak profile opisują model panelu ściennego z Androidem oraz jak pisać, testować i aktywować profil w interfejsie internetowym panelu.
sidebar:
  label: Przegląd
  order: 0
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Profile paneli opisują szczególne cechy modelu panelu ściennego z Androidem: sposób rozpoznawania przez ha-paneld, dozwolone skompilowane sterowniki sprzętu, znane cechy wyświetlacza i czujników oraz warianty zależne od firmware. Profile są czytelnymi plikami YAML. Można je przeglądać, eksportować, edytować, importować i aktywować z działającej instalacji ha-paneld bez ponownego budowania aplikacji Androida.

Ta strona jest praktycznym przewodnikiem tworzenia profili. [Dokumentacja formatu i zgodności](/pl/reference/profiles/format/) opisuje model dokumentu; przed aktywacją sterowania sprzętem przeczytaj [testowanie i rozwiązywanie problemów](/pl/reference/profiles/testing/), a przed publikacją [przewodnik udostępniania i współtworzenia](/pl/reference/profiles/sharing/). Istnieje też wyraźnie oddzielony katalog [profili społecznościowych](/pl/reference/profiles/community/); te pliki są importowane ręcznie, nie stanowią dołączonej obsługi.

Profile dołączone do aplikacji znajdują się w repozytorium ha-paneld w [`app/src/main/assets/device-profiles`](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles).

![Strona Profil panelu z YAML dołączonej rewizji w edytorze, oznaczeniami zaleceń wyłączania pakietów, ścieżek root i metadanych artefaktów WebView oraz zaobserwowanymi danymi urządzenia poniżej](/screenshots/ui-profile-dark.png)

## Co może profil

Profil może wybierać sterowniki i przekształcenia już dostarczane przez ha-paneld oraz podawać ich parametry o określonych typach. Opisuje dane sprzętowe, reguły dopasowania, warianty firmware, zalecenia wyświetlania, proponowane funkcje i poziom uprawnień Androida przydatny na panelu.

Profil nie może dodawać kodu wykonywalnego, poleceń powłoki, operacji demona pomocnika, ioctl jądra, bibliotek natywnych ani nowego protokołu sprzętowego. Jeśli panel potrzebuje mechanizmu niewymienionego w edytorze profilu lub dokumentacji formatu, trzeba go najpierw wdrożyć i przejrzeć w samym ha-paneld. Ta granica zachowuje możliwość sprawdzenia wymienianego YAML i zapobiega przekształceniu profilu w dowolny skrypt root.

Profile nie nadają też uprawnień. Uprzywilejowany sterownik pozostaje niedostępny, jeśli wymagana rzeczywista ścieżka nie działa. Zobacz [Uprawnienia: standardowy Android i ścieżki uprzywilejowane](#uprawnienia-standardowy-android-i-ścieżki-uprzywilejowane).

## Szybki start bez środowiska deweloperskiego

Potrzebujesz tylko instalacji ha-paneld obsługującej profile i przeglądarki. Strona Profile zawiera edytor YAML z wynikami walidacji; eksport do osobnego edytora jest opcjonalny. Nie potrzebujesz Android Studio, Gradle, Android SDK ani lokalnego repozytorium.

1. Otwórz stronę urządzenia panelu w Home Assistant, wybierz **Odwiedź**, następnie **Profile**. Przy połączeniu bezpośrednim użyj portu HTTP zgłoszonego przez panel (`http://<panel-ip>:8888/profiles` przy domyślnym porcie).
2. Jeśli ha-paneld rozpoznaje panel, wyeksportuj dokładną aktywną rewizję jako odniesienie. Dołączone profile są niezmienne, więc pierwsza edycja tworzy samodzielną lokalną kopię zamiast zmieniać wersję dostarczoną z aplikacją.
3. Jeśli panel używa **Generic**, pobierz pasywny szkic urządzenia. Zawiera identyfikację panelu i jawne wartości nieznane/TODO; nie zgaduje uprzywilejowanego sprzętu ani nie wykonuje aktywnej kontroli.
4. Nadaj profilowi stabilny identyfikator małymi literami i wersję, uzupełnij pochodzenie i zgodność, a następnie zacznij od dokładnych reguł dopasowania. Użyj [poniższego przykładu](#przykłady) i [dokumentacji formatu](/pl/reference/profiles/format/).
5. Zaimportuj YAML na stronie Profile. Import i walidacja są tylko podglądem: niczego nie zapisują ani nie aktywują.
6. Przeczytaj wszystkie komunikaty walidacji i porównaj proponowany profil z aktywnym. Szczególnie sprawdź dopasowanie identyfikacji, sterowniki, ścieżki sprzętu, dodane lub usunięte encje Home Assistant i wymagane uprawnienia.
7. Zapisz zweryfikowany profil. Powstaje niezmienna, nieaktywna rewizja lokalna. Nadal nie zmienia działającego panelu.
8. Testuj etapami zgodnie z [listą kontrolną](/pl/reference/profiles/testing/). Jeśli profil zmienia ekran, wejścia, LED, przekaźnik, pakiety lub inne zachowania uprzywilejowane, aktywuj go tylko przy osobie widzącej panel i mogącej go dotknąć.
9. Aktywacja wymaga jawnego potwierdzenia związanego z dokładnym identyfikatorem, rewizją i skrótem treści. ha-paneld restartuje usługę, aby każdy kontroler otrzymał ten sam rozstrzygnięty profil.
10. Po restarcie potwierdź, że strona Profile wskazuje oczekiwaną rewizję jako **Aktywne**, sprawdź funkcje i encje Home Assistant oraz wycofanie. Jeśli walidacja startowa się nie uda, ha-paneld wraca do **ostatniej sprawnej** rewizji i zgłasza nieudany profil jako **automatycznie wycofany**.

Zachowaj wyeksportowany YAML jako wymienialne źródło. Zrzut zielonej strony Profile jest użytecznym dowodem, ale nie zastępuje pliku, jego pochodzenia ani etapowych wyników testów sprzętu.

## Przykłady

Przykład [`minimal-community.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml) używa publicznego schematu akceptowanego przez stronę Profile. To materiał dydaktyczny, a nie twierdzenie, że fikcyjny sprzęt istnieje. Stanowi zachowawczy punkt wyjścia ze standardowym Androidem, który nie włącza protokołu producenta, ścieżki root/pomocnika, przekaźnika, wejścia evdev, artefaktu aktualizacji, żądanego stanu pakietów ani receptury przygotowania.

Zaimportuj przykład przez **Profile**, przejrzyj podgląd walidacji i zapisz tylko jako nieaktywną rewizję lokalną. Zmień identyfikator, pochodzenie, dokładną identyfikację, przetestowany firmware i ograniczenia przed użyciem go dla rzeczywistego panelu. Dopasowanie importu jest tylko dowodem podglądu; lokalne i społecznościowe profile nigdy nie są wybierane automatycznie.

Pełne przykłady produkcyjne uzyskasz, eksportując niezmienny dołączony profil z działającego panelu lub czytając [dołączone pliki YAML](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles). Używają tego samego schematu, ale mogą wybierać uprzywilejowane skompilowane sterowniki i artefakty rdzenia, których nie należy kopiować bez dowodów sprzętowych.

## Cykl życia profilu

ha-paneld traktuje treść profilu jako niezmienne rewizje zamiast edytowalnego obiektu ustawień na żywo. Zapewnia to powtarzalne porównania i zapobiega aktywacji zmienionego pliku na podstawie wcześniejszego podglądu.

- **W pakiecie**: dostarczony z ha-paneld i niezmienny. Można go wyeksportować lub utworzyć własną kopię.
- **Lokalna nieaktywna rewizja**: zaimportowana lub utworzona na panelu, zweryfikowana i zapisana, ale nieużywana przez działające kontrolery.
- **Oczekująca**: dokładna rewizja została zaakceptowana do aktywacji i usługa się restartuje.
- **Aktywne**: rewizja użyta do utworzenia bieżących czujników, kontrolerów sprzętu, modelu funkcji interfejsu i wykrywania Home Assistant.
- **Ostatnia sprawna**: poprzedni potwierdzony wybór zachowany jako cel odzyskiwania i ręcznego wycofania po uruchomieniu nowej rewizji.
- **Automatycznie wycofana**: proponowana rewizja, której aktywacja się nie udała i została zastąpiona ostatnią sprawną.

Zapisanie wiąże niezmienną wersję z dokładnie tym kodem YAML, który znajduje się w jej podglądzie walidacji. Aktywacja i usuwanie sprawdzają również generację katalogu; jeśli inna przeglądarka lub administrator zmienił katalog, te operacje oparte na nieaktualnym stanie są odrzucane. Odśwież stronę i ponownie porównaj, zanim podejmiesz działanie na podstawie nowego stanu.

Usunięcie nieaktywnej rewizji lokalnej nie zmienia działającego panelu. Aktywnej lub ostatniej sprawnej rewizji nie wolno usuwać, dopóki nie istnieje inna poprawna ścieżka odzyskiwania.

**Tryb automatyczny** przywraca przypięty panel do dopasowywania identyfikacji dołączonych profili przy następnym kontrolowanym restarcie. Importowane i społecznościowe rewizje nigdy nie uczestniczą w tym wyborze; są dostępne tylko do jawnej, przypiętej aktywacji.

## Początek od Generic

`Generic` to zachowawczy profil zastępczy dla nierozpoznanego panelu. Używa zwykłych kontroli funkcji Androida i bezpiecznych kontroli podczas działania, ale celowo nie wymyśla sprzętu producenta, przycisków evdev, przekaźników, radia, układów klimatu, artefaktów aktualizacji ani działań pakietów.

Dlatego Generic jest właściwym początkiem tworzenia profilu społecznościowego:

1. Pobierz **wersję roboczą urządzenia** ze strony Profiles. Zawiera ona dokładne dane o modelu kompilacji, urządzeniu kompilacji i wersji produktu dostępne dla ha-paneld oraz wybrane obserwacje pasywne. Przed udostępnieniem zebranych danych przejrzyj na stronie Profiles oddzielny raport pasywny o ograniczonym zakresie, z którego usunięto dane wrażliwe.
2. Przejrzyj i zredaguj przed udostępnieniem. Raport jest przeznaczony do wsparcia, ale autor odpowiada za usunięcie nazw paneli, adresów, danych Home Assistant, danych uwierzytelniających i zawartości pulpitu.
3. Najpierw dodaj tożsamość i pochodzenie. Użyj stabilnego identyfikatora małymi literami z prefiksem autora/organizacji, np. `org.example.wallpanel-x1`, oraz początkowej wersji profilu, informacji o autorze/źródle/licencji, poziomu dojrzałości, zakresu przetestowanego firmware i znanych ograniczeń.
4. Dodaj wąskie, dokładne reguły identyfikacji. Model producenta lub prefiks wersji produktu są zwykle bezpieczniejsze niż szeroki alias SoC, taki jak `px30`, `rk3326`, `rk3566` lub `rk3576`, wspólny dla niezwiązanych paneli.
5. Pomiń nieznane sekcje funkcji lub jawnie oznacz je jako nieznane. Nazwa pliku, oferta sklepowa czy sterownik jądra w firmware nie dowodzą obecności działającego sprzętu ani dostępu aplikacji Androida.
6. Dodawaj po jednej funkcji popartej dowodami, weryfikuj, porównuj i testuj przed kontynuacją.

Szkic celowo jest pasywny i tylko do odczytu. Nie zamieniaj badawczych poleceń powłoki lub jednorazowych eksperymentów root w pola profilu. Gdy nowa aktywna kontrola lub sterownik są potrzebne, zaproponuj ograniczoną implementację ha-paneld z własną walidacją i testami.

## Bezpieczne dopasowanie panelu

Dopasowanie jest decyzją bezpieczeństwa, nie tylko wygodą. Błędne może wybrać niewłaściwy sterownik lub zadeklarować funkcje innego produktu używającego tej samej płyty referencyjnej.

Preferuj dokładną tożsamość produktu w tej kolejności:

1. model producenta lub nazwa kodowa urządzenia unikalna dla produktu;
2. dokładny format wersji produktu lub ściśle zakotwiczony prefiks;
3. kombinacja niezależnych pól kompilacji;
4. szeroki alias SoC/platformy referencyjnej tylko jako celowy wariant zgodności.

Każdej dokładnej grupie nadaj priorytet gałęzi wyższy niż szerokiemu wariantowi zastępczemu. ha-paneld najpierw porównuje priorytet dopasowanej grupy, potem profilu; dokładny remis dołączonych profili bezpiecznie przechodzi do Generic. Priorytety odtwarzają celową kolejność gałęzi, ale nie zastępują wąskiej identyfikacji.

Społecznościowe i importowane rewizje nigdy nie uczestniczą w automatycznym wyborze, nawet przy dokładnym dopasowaniu. Dopasowanie jest dowodem podglądu pomagającym administratorowi ocenić, czy plik opisuje panel. Lokalna rewizja zastępuje wykrywanie dołączonych profili tylko przez jawną aktywację, po której panel przypina dokładny identyfikator, rewizję i skrót. Późniejszy import nie może więc niejawnie zmienić działającego wyniku.

Dla obsługiwanej różnicy w jednej rodzinie sprzętu, takiej jak etykieta produktu lub reguła gęstości, użyj nazwanego pola strategii zarządzanego przez rdzeń. Format nie zawiera ogólnego języka wyrażeń ani dowolnego nakładania wariantów. Skala zbliżenia, polaryzacja i zachowanie binarne/odległościowe celowo nie są strategiami profilu: środowisko wykonawcze uczy się ich z rzeczywistych danych. Użyj osobnych profili, gdy dostępne nazwane strategie nie opisują rzeczywistej różnicy pozyskiwania danych, sterownika, granicy uprawnień lub odzyskiwania.

## Uprawnienia: standardowy Android i ścieżki uprzywilejowane

Profile opisują możliwe mechanizmy; kontrole na żywo określają, czy działający panel może ich użyć.

### Standardowy Android

Zacznij tutaj. Renderowanie pulpitu, parowanie Panel Assistant oraz zwykłe czujniki Androida, jasność, dźwięk, nawigacja i lokalny interfejs WWW nie wymagają root. Nowy profil powinien potwierdzić tożsamość i zachowanie standardowego Androida przed dodaniem uprzywilejowanego sterownika.

### Root producenta lub pomocnik ha-paneld

Skompilowany sterownik może wymagać działającego `su` producenta lub osobno zainstalowanego pomocnika root ha-paneld. Deklaracja nie tworzy tej ścieżki, nie instaluje pomocnika ani nie rozszerza listy dozwolonych operacji. Pomocnik przyjmuje tylko skompilowane, ograniczone polecenia i uwierzytelnia partnera; profil podaje zweryfikowane parametry, nigdy tekst polecenia.

Nie zalecaj rootowania urządzenia dostarczonego bez root tylko dla spełnienia profilu. Uczciwie udokumentuj ograniczony zestaw funkcji. Sprzęt opisuje [Dostęp root](/pl/hardware/guides/root-access/).

## Aktualizacja zainstalowanego profilu

Wersja treści profilu i wersja schematu rozwiązują różne problemy. Zwiększ wersję profilu przy zmianie wiedzy o sprzęcie lub zachowania. Wersja schematu zmienia się tylko wtedy, gdy ha-paneld zmienia język dokumentu.

Przed zapisem aktualizacji porównaj ją z aktywną rewizją i przeczytaj raport zgodności. Aktualizacja ha-paneld również ponownie weryfikuje zainstalowane profile przed użyciem. Plik wymagający nowszego rdzenia, niedostępnego sterownika lub nieobsługiwanego przyszłego schematu pozostaje zainstalowany, ale nie może być aktywny; bieżący ostatni sprawny profil działa dalej.

Zmianę dopasowania, uprzywilejowanego sterownika, ścieżki, wariantu firmware, żądanego stanu pakietów, receptury lub artefaktu aktualizacji rdzenia traktuj jako istotną dla zachowania nawet przy małej różnicy YAML. Powtórz odpowiednie etapy testowania i zwiększ wersję profilu.

## Dalsze kroki

- [Format i zgodność profilu](/pl/reference/profiles/format/)
- [Testowanie i rozwiązywanie problemów](/pl/reference/profiles/testing/)
- [Udostępnianie i współtworzenie profili](/pl/reference/profiles/sharing/)
- [Architektura profili urządzeń](/pl/reference/profiles/architecture/)
- [Model bezpieczeństwa](/pl/reference/security/)
- [Sprzęt paneli](/pl/hardware/)
