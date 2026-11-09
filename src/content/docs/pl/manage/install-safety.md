---
title: Bezpieczeństwo instalacji
description: Kontrole dawnego instalatora wiersza poleceń, jego kopie zapasowe przed zmianą panelu i warunki zatrzymania.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Ta strona opisuje kontrole wycofanego [instalatora wiersza poleceń](/pl/install/installing-ha-paneld/), który instalował panele przed ha-paneld v0.9.9. Obecnie instalacją i aktualizacjami zajmuje się Panel Assistant: sprawdza panel przed zmianami i tworzy kopię ustawień przed każdą aktualizacją, zgodnie z opisem [aktualizacji i odzyskiwania](/pl/manage/updates-and-recovery/).

## Granice zaufania i danych uwierzytelniających

Pliki danych uwierzytelniających chronią sekrety przed zapisaniem w historii powłoki i w wierszach poleceń procesów potomnych komputera uruchamiającego instalator. Nie dodają szyfrowania do API zarządzania panelem. API panelu (na przykład `http://<panel>:8888` przy domyślnym porcie) stosuje projektowy model zaufanej sieci, więc dane brokera i tokeny Home Assistant przechodzą przez to połączenie jako nieszyfrowany HTTP. Uruchamiaj instalator wyłącznie w zaufanej, wydzielonej sieci. Model opisuje [dokumentacja bezpieczeństwa](/pl/reference/security/).

Logowanie nazwą użytkownika i hasłem Home Assistant działa inaczej. Hasło trafia z komputera instalującego do punktu logowania Home Assistant i nigdy nie dociera do panelu. Użyj adresu Home Assistant `https://`, aby szyfrować logowanie podczas przesyłania; adres `http://` wysyła hasło bez szyfrowania. Panel otrzymuje tylko wynikowy token odświeżania, który można unieważnić.

Eksporty konfiguracji zawierają sekrety i są zapisywane z uprawnieniami wyłącznie dla właściciela; traktuj je jak dane uwierzytelniające. Automatyczne kopie ustawień i bazy danych przed aktualizacją również trafiają do katalogu dostępnego tylko właścicielowi, jako pliki z uprawnieniami 600.

## Uwierzytelnianie wydania i pakietu

Instalator niewymagający lokalnego repozytorium pobiera pasującą aplikację i narzędzie instalacyjne wydania. Przed zmianą panelu uwierzytelnia opublikowane pliki aplikacji i pomocnika względem rekordów SHA-256 podpisanych kluczem wydania. Sprawdza też pakiet aplikacji i podpisującego za pomocą Android Build-Tools. Narzędzia te są opcjonalne przy pierwszej instalacji na panelu bez aplikacji, gdy Android sam sprawdza podpis podczas instalowania, a wymagane przy aktualizacji panelu z aplikacją: instalator porównuje dotychczasowego i nowego podpisującego przed zmianami i odmawia zamiast zgadywać. W przeciwnym razie niezgodny podpis najpierw wyłączyłby działającego pomocnika, a dopiero potem uniemożliwił instalację. Instalator wybiera pomocnika pasującego do ABI zgłoszonego przez panel.

Lokalnie zbudowana aplikacja korzysta z osobnej ścieżki deweloperskiej. Nadal musi zawierać pakiet ha-paneld z dokładnie jednym poprawnym podpisującym, ale może używać własnego, spójnego klucza autora kompilacji. `--require-release-signer` zaostrza kontrolę, gdy plik lokalny ma być oficjalną kompilacją. `--allow-unsigned-helper` jest osobnym potwierdzeniem dla plików pomocnika kontrolowanych przez lokalnego autora kompilacji zamiast uwierzytelnionych jako pliki wydania.

## Kopie zapasowe i odzyskiwanie

Trzy różne pliki służą trzem różnym zadaniom odzyskiwania:

- **Eksport konfiguracji JSON** zawiera ustawienia i sekrety. `--export FILE` tworzy go jawnie, a instalator próbuje również automatycznie utworzyć eksport dostępny tylko właścicielowi przed zwykłą aktualizacją. Nie zawiera katalogu profili środowiska wykonawczego, wyboru profilu, wyuczonego stanu encji, historii ani logowania Home Assistant przechowywanego przez osobną aplikację pulpitu.
- **Kopia `.hpb`** ze strony **Instalacja**, następnie **Kopia zapasowa**, w interfejsie internetowym panelu jest najpełniejszą obsługiwaną kopią. Zawiera ustawienia, trwały stan panelu, katalog profili i kwalifikujące się logowanie osobnej aplikacji pulpitu. Katalog wyuczonych encji oraz historie zbliżenia i otoczenia są uczone ponownie, a nie przywracane. Przywróć `.hpb` przez **Instalacja**, następnie **Przywróć**, na tej samej stronie. Opcja instalatora `--restore FILE` przyjmuje konfigurację JSON, a nie kopie `.hpb`.
- Automatyczny plik **`…break-glass.db`** to awaryjna kopia wewnętrznej bazy danych panelu. Nic nie przywraca jej automatycznie i jest poprawna tylko dla tego samego panelu i wersji aplikacji, z których pochodzi.

Gdy `--export FILE` jest połączone z opcjami instalacji lub konfiguracji, zweryfikowany eksport powstaje przed jakąkolwiek zmianą panelu. Jeśli nie można go utworzyć i zweryfikować, działanie zostaje zatrzymane. Uruchom najpierw samo `--export FILE`, aby wyeksportować dane bez instalacji.

Automatyczny eksport ustawień przed zwykłą aktualizacją jest wykonywany w miarę możliwości. Jeśli się nie uda, instalator usuwa częściowy plik, zapisuje informację o braku eksportu i kontynuuje wymianę aplikacji.

Przed odinstalowaniem, wyczyszczeniem danych aplikacji lub innym niszczącym odzyskiwaniem utwórz osobną kopię przez **Instalacja**, następnie **Kopia zapasowa**, i sprawdź, czy pobrany `.hpb` nie jest pusty. Te operacje niszczą dane aplikacji. Zwykłe `adb install -r` je zachowuje.

`--reset-config` celowo działa inaczej. **Reset jest nieodwracalny i nie tworzy kopii zapasowej.** Wymaga osobnego potwierdzenia, po czym usuwa wszystkie dane aplikacji panelu. Aplikacja, pomocnik i inne aplikacje Androida pozostają zainstalowane.

## Automatyczna migawka bazy danych

Przed każdą zwykłą aktualizacją instalator próbuje zapisać bazę panelu, zawierającą konfigurację, katalog encji, historie zbliżenia i otoczenia oraz historię rewizji przechowywaną na panelu. Migawka pomaga przy późniejszym odinstalowaniu lub innej niszczącej naprawie; zwykła wymiana aplikacji w miejscu przez Androida pozostawia oryginalną bazę na miejscu.

Instalator wysyła działającej aplikacji jedno żądanie przygotowania aktualizacji, wyłącznie przez ADB. Aplikacja przestaje przyjmować nowe zadania, kończy oczekujące zapisy, wstrzymuje zapisujących do bazy, utrwala stan, wykonuje checkpoint dziennika SQLite write-ahead log i zamyka bazę. Potwierdza dokładnie to żądanie dopiero po zapisaniu starego procesu, wersji aplikacji, liczby bajtów, SHA-256 możliwego do sprawdzenia na komputerze, wersji schematu i liczby wierszy stanu.

Instalator kopiuje zamkniętą bazę bezpośrednio z prywatnej pamięci aplikacji, bez tworzenia drugiej kopii na panelu. Kopia na komputerze jest akceptowana tylko wtedy, gdy rozmiar i zawsze sprawdzany SHA-256 zgadzają się z potwierdzeniem oraz przejdą lokalne kontrole integralności SQLite, schematu i wierszy.

Jeśli aplikacja nie zwróci dokładnego potwierdzenia, na przykład wskutek przekroczenia czasu lub nieprawidłowej odpowiedzi, instalator jednokrotnie używa awaryjnie działającego na żywo polecenia SQLite `.backup`. Tworzy ono taką samą pojedynczą, samodzielną bazę, bez sąsiednich plików dziennika lub write-ahead log. Panel bez dostępu root nie może udostępnić prywatnej bazy, więc dostępny może być tylko eksport ustawień.

Przy zwykłej aktualizacji w miejscu kopia bazy jest wykonywana w miarę możliwości. Nieudana lub niespójna kopia jest usuwana, instalator pokazuje wyraźne ostrzeżenie, a wymiana aplikacji może być kontynuowana z nietkniętymi oryginalnymi danymi. Nieprawidłowa kopia nigdy nie jest zachowywana ani oznaczana jako udana.

Nie ma stałego progu wolnego miejsca dla tej kopii. Zwykła ścieżka niczego nie zapisuje tymczasowo na panelu, a jedna próba awaryjna pozwala rzeczywistemu kopiowaniu wykazać, czy jest miejsce. Brak miejsca, nieudana kontrola stanu bazy, niedostępny punkt statusu, nieprawidłowa odpowiedź lub nierozpoznany stan są zgłaszane przed instalacją i po niej. Żaden z nich nie blokuje zwykłej wymiany aplikacji, ponieważ nowa kompilacja może być jedyną użyteczną próbą naprawy starej, niesprawnej lub niedostępnej wersji. Samodzielne `--verify` zgłasza te warunki jako błąd, gdy potrzebujesz ścisłego wyniku pozytywnego lub negatywnego.

## Kontrole strefy czasowej i pierwszej instalacji

Przed zmianą panelu instalator porównuje jego strefę czasową ze strefą komputera. Różnica jest ostrzeżeniem, a nie powodem zatrzymania, ponieważ panel może prawidłowo używać innej strefy. Porównanie używa nazw stref zamiast bieżącego przesunięcia UTC i rozpoznaje znane aliasy za pomocą bazy stref czasowych komputera. Wykrywa panele pozostawione w fabrycznej strefie, które inaczej zapisywałyby dzienniki i wykonywały harmonogramy o niewłaściwej lokalnej godzinie.

Kontrola milczy, jeśli nie można ustalić którejś wartości. Brak odpowiedzi, nieprawidłowa nazwa strefy lub alias nieznany bazie komputera nie powodują błędu ani zmiany instalacji.

Czysty panel nie ma punktu statusu aplikacji panelu; nie mają go też niektóre uszkodzone instalacje. Instalator pyta menedżera pakietów Androida, czy ha-paneld jest zainstalowany, zanim rozstrzygnie przypadek. Jednoznaczna odpowiedź „niezainstalowany” rozpoczyna zwykłą pierwszą instalację. Brak odpowiedzi menedżera pakietów lub zapytania ADB zatrzymuje działanie przed zmianą panelu.

## Aktualizacje pomocnika root

Opublikowane wydania zawierają zabezpieczone pliki pomocnika `armeabi-v7a` i `arm64-v8a`. Na panelu z dostarczonym przez producenta `su` lub root ADB instalator uwierzytelnia wybrany plik kluczem wydania, ponownie sprawdza go po skopiowaniu i instaluje lub aktualizuje atomowo. Przed wymianą aplikacji sprawdza wymagane przez nią możliwości protokołu i tożsamość odtwarzalnej kompilacji.

Poprzedni pomocnik należący do root i jego usługa pozostają dostępne do udanej instalacji aplikacji. Nieudana instalacja lub uruchomienie pomocnika, niewłaściwa tożsamość albo możliwości powodują przywrócenie poprzedniej działającej pary przed wymianą aplikacji. Jeśli ADB rozłączy się podczas instalowania aplikacji przez Androida, instalator zachowuje dziennik odzyskiwania. Ponowne wykonanie tego samego polecenia uwierzytelnia zainstalowaną aplikację i działającego pomocnika, po czym kończy lub wycofuje przerwaną aktualizację.

Migawki odzyskiwania należą do root, są uwierzytelniane zapisanym skrótem i synchronizowane z pamięcią przed wycofaniem działających plików. Instalator odmawia rozpoczęcia przy niedokończonej transakcji pomocnika i wskazuje polecenie, które trzeba uruchomić ponownie.

Instalator preferuje usługę init na zapisywalnym `/system`, gdy może potwierdzić wystarczającą ilość miejsca. Jeśli `/system` jest tylko do odczytu, używa zweryfikowanego mechanizmu Magisk, KernelSU lub APatch w `/data/adb/service.d`. Panel z zapisywalnym, ale zapełnionym `/system` może przechowywać pomocnika i pliki odzyskiwania w `/data/adb/hapaneld`, a jedynie usługę startową w `/vendor/etc/init`; późniejsze aktualizacje zachowują ten zweryfikowany układ. Instalator zatrzymuje się przed wymianą aplikacji, gdy nie może ustalić pojemności pamięci, właściciela uruchamiania lub stanu istniejącej transakcji.

Aplikacja zawiera pasującego pomocnika jako rozwiązanie awaryjne. Jeśli panel z bezpośrednią instalacją przez `su` aktualizuje się z karty Instalacja lub encji aktualizacji Home Assistant przed ponownym użyciem instalatora, pierwsze uruchomienie aplikacji sprawdza wymagany protokół i może uruchomić kopię należącą do root z `/data/local`. Panel z root izolowanym w piaskownicy nie może bezpiecznie pozwolić staremu pomocnikowi na zastąpienie samego siebie, więc odmawia działania i prosi o uruchomienie uwierzytelnionego instalatora z komputera.

## Co może zatrzymać działanie

Instalator zatrzymuje się z niezerowym wynikiem, gdy nie może bezpiecznie ustalić czegoś potrzebnego do żądanej operacji. Przykłady to brak odpowiedzi na zapytanie o pakiet, aplikacja z niewłaściwym pakietem lub podpisującym, niemożliwa do odzyskania transakcja pomocnika, żądany eksport konfiguracji niemożliwy do zweryfikowania lub nieudana wymagana kontrola po instalacji.

Inne ustalenia są ostrzeżeniami, ponieważ zatrzymanie utrudniłoby odzyskiwanie. Niedostępna automatyczna kopia bazy, ostrzeżenie o pamięci lub nieudane wywołanie statusu przed aktualizacją same w sobie nie uniemożliwiają zwykłej wymiany aplikacji w miejscu. Instalator jasno wskazuje to ograniczenie zamiast przedstawiać częściowy lub nieprawidłowy plik odzyskiwania jako sukces.

### Jak czytać odmowę

Każda odmowa wskazuje jeden warunek i niczego nie zmienia na panelu, chyba że mówi inaczej. Treść wskazuje, co naprawić, ponieważ rozwiązania znacznie się różnią.

- **Kanoniczna baza ciągle zmieniała się podczas odczytu.** Aplikacja panelu nadal zapisywała bazę, gdy instalator próbował uzyskać spójną kopię. To panel zajęty, a nie uszkodzony. Kopiowanie jest ponawiane automatycznie, więc komunikat oznacza zapis podczas każdej próby; zwykle wystarczy ponowić instalację przy mniejszej aktywności panelu.
- **Nie można odczytać kanonicznej bazy** lub **nie jest zwykłym plikiem.** To przeciwny przypadek, dotyczący zapisanych danych, a nie aplikacji: pliku brakuje, nie jest plikiem albo w ogóle nie można go otworzyć. Odzyskaj bazę przed ponowieniem.
- **Brakuje kanonicznej bazy, mimo że aplikacja jest zainstalowana.** Aplikacja istnieje, ale jej magazyn nie; zwykła aktualizacja tego nie naprawi. Przywróć kopię zamiast ponawiać.
- **Miejsce docelowe instalacji jest tylko do odczytu.** Katalog instalacji uprzywilejowanego pomocnika znajduje się na systemie plików zamontowanym tylko do odczytu. Ponowne zamontowanie do zapisu na większości paneli nie wymaga restartu. Instalator wskazuje zmierzony system plików, więc sprawdź ten wiersz, zanim założysz, o którą partycję chodzi.
- **W miejscu docelowym brakuje miejsca lub wolnych i-węzłów.** Oba komunikaty podają pomiar i rozróżniają te zasoby, ponieważ jednego może brakować przy dużej ilości drugiego.
- **Nie można uzgodnić niedokończonej wcześniejszej aktualizacji.** Poprzednie wykonanie pozostawiło zapis odzyskiwania, którego instalator nie potrafi dopasować do bieżącej instalacji. Nic nie zostaje zmienione. Trzeba zbadać zapis odzyskiwania zamiast ponawiać, ponieważ kolejna próba zakończy się tak samo.
- **Aplikacja pozostaje zainstalowana po pewnym czasie od przygotowania następcy.** Nowa aplikacja została zainstalowana, ale stara nie została usunięta w okresie oczekiwania instalatora. Panel działa; nie zakończyło się usunięcie.

Odmowa wspominająca wycofanie zmian podaje, czy zostało zweryfikowane. „Wycofano i zweryfikowano” oznacza stan panelu sprzed próby. „Nie można zweryfikować wycofania” oznacza, że należy sprawdzić uprzywilejowanego pomocnika przed poleganiem na operacjach uprzywilejowanych, mimo że sama aplikacja nie została wymieniona.
