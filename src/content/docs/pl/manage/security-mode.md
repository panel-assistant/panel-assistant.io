---
title: Tryb bezpieczeństwa
description: Domyślne zachowanie panelu w zaufanej sieci i tryb wzmocniony wymagający zatwierdzania zdalnych działań o dużych skutkach przez osobę przy panelu.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Interfejs internetowy panelu, jego API i sterowanie w Home Assistant są przeznaczone do zaufanej sieci domowej. Domyślny jest **tryb swobodny**: automatyzacje, narzędzia instalatora i działania przeglądarki działają bez dodatkowego monitu. Jedno działanie celowo nie podlega tej zasadzie. Włączenie kamery przez jej encję Home Assistant wymaga zatwierdzenia na panelu w każdym trybie, także swobodnym. Ustawienie Kamera w Konfiguruj jest osobną drogą konfiguracji właściciela. Wyłączenie nigdy nie wymaga zgody.

Na panelu w sieci współdzielonej z mniej zaufanymi urządzeniami opcjonalny **tryb wzmocniony** dodaje osobiste zatwierdzanie wybranych operacji sieciowych o dużych skutkach. To dodatkowa granica bezpieczeństwa, a nie zamiennik osobnej sieci czy zapory ani ogólne uwierzytelnianie API. Punkty końcowe tylko do odczytu i zwykłe sterowanie panelem pozostają dostępne w normalnym modelu zaufanej sieci.

**W trybie wzmocnionym chronione bezpośrednie żądania LAN wymagają fizycznego dostępu do panelu. Nie mogą być wykonane, dopóki ktoś nie zatwierdzi ich na ekranie panelu, a zgody tej nie można udzielić zdalnie.**

Administratorzy używający uwierzytelnionego paska bocznego Panel Assistant mogą wykonywać wybrane zwykłe działania administracyjne bez fizycznego monitu: konfigurację wyświetlacza i zasilania, potwierdzanie bezpieczeństwa zasilania, aktywację profilu, odtwarzanie multimediów, ograniczanie pakietów producenta i ponowne ładowanie pulpitu. Instalacja, odinstalowanie, kopie zapasowe, przywracanie, restart i inne chronione operacje nadal wymagają zgody na panelu. Bezpośrednie żądania LAN nie otrzymują tego wyjątku.

Interfejs internetowy oznacza objęte działania małą tarczą w obu trybach, aby przed włączeniem trybu wzmocnionego było widać, które procedury przekraczają granicę zatwierdzania.

## Włączanie trybu wzmocnionego

To ustawienie można zmienić tylko na samym panelu:

1. Otwórz ekran **Konfiguruj** aplikacji panelu na panelu.
2. Otwórz menu dodatkowych opcji paska narzędzi i wybierz **Tryb bezpieczeństwa**.
3. Wybierz **Włącz tryb wzmocniony**.

Najpierw muszą być wyłączone zarówno sieciowe ADB, jak i debugowanie bezprzewodowe Androida, ponieważ każde pozwala zdalnemu klientowi ADB wstrzykiwać działania na ekranie zatwierdzania. Przed zatwierdzeniem zmiany aplikacja panelu sprawdza wszystkie obsługiwane właściwości Androida dotyczące sieciowego ADB, trwałego sieciowego ADB, jawnych adresów nasłuchiwania ADB i stanu debugowania bezprzewodowego. Zatrzymuje także aktywny sieciowy przekaźnik narzędzi programistycznych WebView i sprawdza, czy jego proces i nasłuch zniknęły. Jeśli nie potrafi ustalić, że te drogi zdalnego sterowania są nieaktywne, odmawia włączenia trybu wzmocnionego. Wyłącz ADB i debugowanie bezprzewodowe w opcjach programisty Androida i spróbuj ponownie. Jeśli weryfikacja przekaźnika zawiedzie, uruchom ponownie panel przed kolejną próbą.

Ustawienie należy wyłącznie do panelu. Nie jest zawarte w eksportach konfiguracji ani pełnych kopiach zapasowych i nie można go zmienić przez API, z Home Assistant, przez przywrócenie, import konfiguracji ani aktualizację na kilku panelach. Istniejący panel pozostaje więc w trybie swobodnym, chyba że ktoś włączy tryb wzmocniony przy panelu.

Użyj tego samego menu, aby wrócić do trybu swobodnego. Usuwa to wszystkie oczekujące żądania zatwierdzenia.

## Zatwierdzanie żądania sieciowego

Gdy tryb wzmocniony przechwyci chronione żądanie API, pierwsza próba zwraca HTTP `202 Accepted` z odpowiedzią `approval-required`, na przykład:

```json
{
  "ok": false,
  "error": "approval-required",
  "approval_id": "…",
  "message": "Approve this request physically on the panel, then retry it; it cannot be approved remotely."
}
```

Aby ukończyć operację:

1. Na panelu otwórz **Konfiguruj**, menu dodatkowych opcji paska narzędzi, **Tryb bezpieczeństwa**, a następnie **Przejrzyj zatwierdzenia**.
2. Sprawdź operację, jej podsumowanie i urządzenie żądające, a następnie zatwierdź lub odrzuć.
3. W ciągu dziesięciu minut od pierwotnego żądania wyślij identyczne żądanie ponownie z tego samego urządzenia.

Zgoda jest związana z operacją, urządzeniem żądającym i chronioną treścią żądania oraz może być użyta raz. Zmiana żądania, wysłanie z innego adresu, odczekanie ponad dziesięciu minut lub restart aplikacji panelu wymagają nowej zgody. Tylko pasująca ponowna próba zużywa zgodę; nie jest to tymczasowe ogólne obejście.

Natywne polecenia encji i automatyzacji Home Assistant przenoszą pochodzenie transportowe Panel Assistant, a nie tożsamość indywidualnego użytkownika. Ich zgody są związane z tym pochodzeniem i dokładnym poleceniem. Różni się to od opisanego wyżej wyjątku uwierzytelnionego paska bocznego administratora.

Żądania przez pętlę zwrotną od oprogramowania już działającego na panelu nie wymagają zgody sieciowej. Tryb wzmocniony traktuje lokalne aplikacje Androida jako zaufane i nie izoluje jednej aplikacji panelu od drugiej, więc nie instaluj na panelu niezaufanych aplikacji.

## Chronione operacje

W trybie wzmocnionym bezpośredni klient sieciowy potrzebuje zgody na panelu, zanim będzie mógł:

- zainstalować przesłaną aplikację lub zarządzaną kopię aplikacji panelu albo osobnej aplikacji pulpitu;
- odinstalować aplikację lub zmienić to, czy pakiet producenta jest włączony, działa lub może rysować nad ekranem;
- wyeksportować pełną kopię zapasową lub pakiet konfiguracji zawierający sekrety;
- zaimportować konfigurację, przywrócić zapisaną rewizję konfiguracji lub kopię zapasową panelu;
- aktywować lub cofnąć profil sprzętowy;
- odtwarzać multimedia pobierane ze zdalnego URL;
- ponownie załadować renderer pulpitu lub uruchomić ponownie panel;
- pobrać aplikację z linku, co jest zatwierdzane oddzielnie od instalacji: pobranie jest powiązane z SHA-256 tego dokładnego URL i przed zgodą nie otwiera się żadnego połączenia, więc instalowanie z linku w trybie wzmocnionym pyta dwa razy;
- przejść do kolejnego etapu konserwacji odzyskiwania bazy danych;
- naprawić konfigurację osobnej aplikacji pulpitu lub wyczyścić dane przeglądania wbudowanego renderera;
- zmienić systemową gęstość wyświetlania lub skalę czcionek;
- wyłączyć skonfigurowane zabezpieczenia podtrzymujące wybudzenie lub zapobiegające przyciemnieniu bezczynności, które utrzymują osiągalność panelu, ze strony Konfiguruj lub Home Assistant;
- naprawić ustawienia bezpieczeństwa zasilania panelu; lub
- ukryć jedno dokładne, niezmienione ostrzeżenie o ustawieniu bezpieczeństwa zasilania, które można poprawić tylko ręcznie. Zmienia to tylko wyświetlanie; podstawowa ocena, diagnostyka i wynik instalatora pozostają takie same.

Włączenie kamery panelu przez jej encję Home Assistant wymaga zgody na panelu w obu trybach. Włączenie z Konfiguruj pozostaje osobnym ustawieniem właściciela; nadal wymagane są uprawnienie kamery Androida i działający wskaźnik używania kamery.

Zdalny zapis Konfiguruj w trybie wzmocnionym musi zapisać zmniejszenie bezpieczeństwa zasilania osobno od zmian pakietów producenta, ponieważ potrzebują one innych rodzajów zgody. Łączone zapisy w trybie swobodnym lub przez pętlę zwrotną przechodzą bezpośrednio.

Tryb wzmocniony odrzuca wstrzykiwanie dotknięć z każdego miejsca poza pętlą zwrotną, więc żądanie nie może samo się zatwierdzić. Odmawia też włączenia sieciowego ADB, debugowania bezprzewodowego Androida i przekaźnika narzędzi programistycznych WebView. Przed ich użyciem przełącz panel z powrotem w tryb swobodny przy samym panelu.

Granica zatwierdzania nie uwierzytelnia reszty API panelu. Odczyty diagnostyki i stanu oraz zwykłe sterowanie zachowują normalne działanie w zaufanej sieci. Trzymaj API panelu z dala od niezaufanych sieci nawet z włączonym trybem wzmocnionym; [dokumentacja bezpieczeństwa](/pl/reference/security/) opisuje pełne założenia.

Aktualizacje rozpoczynają się, gdy instalujesz przez Panel Assistant lub sam wybierasz instalację. Aplikacja panelu nie ma polityki zaplanowanych instalacji ani zapisanego kanału aktualizacji. Instalacje uruchamiane przez właściciela z karty **Instalacja** pozostają dostępne, ze zgodą przy panelu dla chronionych żądań zdalnych w trybie wzmocnionym.

## Zmiana adresu Home Assistant

Zmiana **Adres URL Home Assistant** usuwa poprzednie dane logowania, chyba że w tym samym zapisie dostarczono nowe. Dotyczy to obu trybów bezpieczeństwa. Zwykłe zapisy zachowujące ten sam adres utrzymują zapisane sekrety, gdy ich pola pozostawiono puste.
