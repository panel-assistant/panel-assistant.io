---
title: Naprawy
description: Co oznacza każda naprawa Panel Assistant, dlaczego się pojawia i jak ją rozwiązać.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Otwórz **Ustawienia → System → Naprawy** w Home Assistant i wybierz komunikat Panel Assistant. Pierwszy odnośnik otwiera odpowiednie ustawienie lub kroki odzyskiwania. Wybierz **Dowiedz się więcej**, aby przeczytać wyjaśnienie poniżej.

Zachowaj zapisany raport pomocy podczas sprawdzania nieudanej instalacji lub aktualizacji. Działanie **Wyczyść błąd** usuwa ten raport; nie zmienia panelu.

Używaj zabezpieczonego działania **Spróbuj ponownie** w istniejącej naprawie dopiero po sprawdzeniu jej raportu i panelu. Nie rozpoczynaj nowej instalacji automatycznej, odinstalowania ani resetowania, gdy stan instalacji jest nieznany. Zobacz [odzyskiwanie instalacji](/pl/manage/troubleshooting/#instalacja-sieciowa-zatrzymała-się-w-trakcie) i [raporty pomocy](/pl/home-assistant/support-report/).

## Znajdź swoją naprawę

- [Usuń Panel Assistant z panelu &lt;panel&gt;](#usuń-panel-assistant-z-panelu-panel)
- [Zbyt stara aplikacja panelu](#panel-app-too-old)
- [Stara aplikacja wymaga 0.9.0](#old-app-needs-090)
- [Panel MQTT wymaga 0.9.0](#mqtt-panel-needs-090)
- [Uprawnienia panelu](#panel-permissions)
- [Konfiguracja zbliżenia panelu](#panel-proximity-setup)
- [Niefiltrowany pulpit](#dashboard-unfiltered)
- [Cisza z mikrofonu głosowego](#voice-microphone-silent)
- [Brak dźwięku z mikrofonu głosowego](#voice-microphone-no-audio)
- [Szczegóły braku dźwięku z mikrofonu głosowego](#voice-microphone-no-audio-detail)
- [Zachowane słowo budzące](#wake-word-kept)
- [Odrzucone słowo budzące](#wake-word-refused)
- [Usunięta encja liczbowa głośności](#volume-number-removed)
- [Wymagane ponowne uruchomienie](#restart-required)
- [Niezgodność użytkownika panelu](#panel-user-mismatch)
- [Brak ścieżki aktualizacji](#no-update-route)
- [Scalona tożsamość panelu](#merged-panel-identity)
- [Niepowodzenie instalatora](#installer-failure)
- [Niepowodzenie instalatora: autoryzacja](#installer-failure-authorization-failed)
- [Niepowodzenie instalatora: odrzucone sprawdzenie wstępne](#installer-failure-preflight-rejected)
- [Niepowodzenie instalatora: odrzucony artefakt](#installer-failure-artifact-rejected)
- [Niepowodzenie instalatora: transport](#installer-failure-transport-failed)
- [Niepowodzenie instalatora: instalacja](#installer-failure-install-failed)
- [Niepowodzenie instalatora: uruchamianie](#installer-failure-launch-failed)
- [Niepowodzenie instalatora: sprawdzenie działania](#installer-failure-health-check-failed)
- [Niepowodzenie instalatora: niejednoznaczna zmiana](#installer-failure-ambiguous-mutation)
- [Niepowodzenie instalatora: wymagana weryfikacja](#installer-failure-verification-required)
- [Niepowodzenie instalatora: aktualizacja](#installer-failure-update)
- [Niepowodzenie instalatora: wstrzymana ponowna próba](#installer-failure-retry-hold)
- [Nieosiągalny adres panelu](#panel-address-unreachable)
- [Niezweryfikowany adres panelu](#panel-address-unverified)
- [Niezgodna tożsamość panelu](#panel-identity-mismatch)
- [Współdzielony identyfikator połączenia panelu](#panel-link-shared)
- [Potwierdzenie tożsamości panelu](#panel-identity-confirmation)
- [Niepowodzenie instalatora: autoryzacja ADB](#installer-failure-adb-authorization)
- [Autoryzacja aktualizacji ADB](#adb-update-authorization)
- [Inny Home Assistant](#another-home-assistant)

## Usuń Panel Assistant z panelu &lt;panel&gt;

**Co to oznacza:** W niewydanej wersji 1.0.0-rc2 ktoś nacisnął **Usuń z tego panelu** na stronie urządzenia tego panelu. Przycisk niczego nie usuwa; problem pozostaje dostępny do czasu zakończenia usuwania.

**Dlaczego:** Panel Assistant prosi o potwierdzenie przed przywróceniem ekranu głównego i aplikacji producenta, odinstalowaniem ha-paneld i usunięciem panelu z Home Assistant.

**Jak naprawić:** Przeczytaj [co robi usuwanie i jak ponownie zainstalować](/pl/manage/removal-risks/), zanim wybierzesz **Zatwierdź** jeden raz, aby potwierdzić. Jeśli to była pomyłka, zamknij okno dialogowe bez zatwierdzania i pozostaw problem niepotwierdzony.

<a id="panel-app-too-old"></a>

## Zbyt stara aplikacja panelu

**Co to oznacza:** Home Assistant nie może zobaczyć panelu ani nim sterować przez aktualny protokół połączenia.

**Dlaczego:** Aplikacja panelu nie zgłasza obsługiwanego protokołu połączenia albo jej zakres protokołów nie pokrywa się z zakresem obsługiwanym przez tę wersję Panel Assistant.

**Jak naprawić:** Otwórz aktualizacje Home Assistant i zainstaluj zgodną aktualizację aplikacji dla tego panelu, jeśli jest oferowana. Poczekaj na ponowne połączenie. Jeśli żadna nie jest oferowana, użyj przewodnika odzyskiwania aktualizacji; nie obniżaj wersji w ciemno.

<a id="old-app-needs-090"></a>

## Stara aplikacja wymaga 0.9.0

**Co to oznacza:** Panel Assistant 1.0 nie może zainstalować ani zaktualizować tego panelu ze starą aplikacją.

**Dlaczego:** Przenoszenie ze starej aplikacji ha-paneld zostało usunięte w 1.0.

**Jak naprawić:** Nie pobieraj ponownie Panel Assistant 0.9.0 na działającą instalację 1.0: ustawienie usunięte przez 1.0 może spowodować powrót przeniesionych paneli do MQTT w 0.9.0. Tylko jeśli żaden panel nie ma jeszcze aplikacji 1.0, przywróć kopię Home Assistant sprzed aktualizacji, zakończ wszystkie przenoszenia w 0.9.0, a następnie wróć do 1.0. Jeśli którykolwiek panel ma już aplikację 1.0 albo nie ma odpowiedniej kopii, poproś o pomoc przed zmianą wersji. Zobacz [przewodnik odzyskiwania aktualizacji 1.0](/pl/manage/upgrade-to-1-0/).

<a id="mqtt-panel-needs-090"></a>

## Panel MQTT wymaga 0.9.0

**Co to oznacza:** Panel Assistant nie może podłączyć tego nieprzeniesionego panelu MQTT bez rozdzielenia jego encji i historii.

**Dlaczego:** Panel Assistant 1.0 nie wykonuje już przenoszenia z MQTT.

**Jak naprawić:** Nie pobieraj ponownie Panel Assistant 0.9.0 na działającą instalację 1.0: ustawienie usunięte przez 1.0 może spowodować powrót przeniesionych paneli do MQTT w 0.9.0. Tylko jeśli żaden panel nie ma jeszcze aplikacji 1.0, przywróć kopię Home Assistant sprzed aktualizacji, zakończ wszystkie przenoszenia w 0.9.0, a następnie wróć do 1.0. Jeśli którykolwiek panel ma już aplikację 1.0 albo nie ma odpowiedniej kopii, poproś o pomoc przed zmianą wersji. Zobacz [przewodnik odzyskiwania aktualizacji 1.0](/pl/manage/upgrade-to-1-0/).

<a id="panel-permissions"></a>

## Uprawnienia panelu

**Co to oznacza:** Niektóre funkcje panelu nie mogą działać, ponieważ Android nie przyznał im uprawnień. Pulpit pozostaje dostępny.

**Dlaczego:** Starsza instalacja lub zmiana uprawnień Androida może pozostawić brak wymaganej zgody. Uprawnienie kamery ma znaczenie przy włączonej kamerze; uprawnienie mikrofonu przy włączonej kamerze lub głosie. Nieznany stan funkcji utrzymuje ostrzeżenie do czasu sprawdzenia.

**Jak naprawić:** Na fizycznym panelu otwórz Ustawienia Androida → Aplikacje → Panel Assistant. Zezwól na kamerę, mikrofon i powiadomienia tam, gdzie są wymienione. W specjalnym dostępie aplikacji zezwól na modyfikowanie ustawień systemowych i wyświetlanie nad innymi aplikacjami, a następnie włącz Panel Assistant w Ułatwieniach dostępu. Jeśli nawigacja jest ustawiona na odsłanianie gestem lub stale włączoną i brakuje uprawnienia nakładki, przesuń palcem w górę od dołu pulpitu, aby otworzyć wyświetlanie nad innymi aplikacjami, zezwól, wróć i przesuń ponownie. Wróć do naprawy i wybierz Wyślij. Home Assistant musi na nowo zweryfikować wszystkie istotne uprawnienia; sam nieudany odczyt lub aktualizacja aplikacji nie zamyka naprawy.

<a id="panel-proximity-setup"></a>

## Konfiguracja zbliżenia panelu

**Co to oznacza:** Wybudzanie gestem jest niedostępne, ponieważ panel nie zapisał kalibracji zbliżenia.

**Dlaczego:** Panel zgłasza calibration_required. Kalibracja mierzy tę instalację i wymaga osoby przed panelem; samo rozpoczęcie konfiguracji nie oznacza jej ukończenia.

**Jak naprawić:** Otwórz stronę Konfiguracja tego panelu, sekcję Obecność i wybudzanie, i wybierz konfigurację zbliżenia na panelu. Wykonaj fizyczne instrukcje na panelu; trwa to około minuty. Gdy panel potwierdzi zapisanie kalibracji, wróć do naprawy i wybierz Wyślij. Home Assistant odczytuje świeży stan przed zakończeniem; jeśli konfiguracja nadal trwa lub nie można odczytać panelu, zakończ ją albo przywróć połączenie i wyślij ponownie. Działanie otwarcia konfiguracji zbliżenia na pulpicie także rozpoczyna konfigurację na panelu.

<a id="dashboard-unfiltered"></a>

## Niefiltrowany pulpit

**Co to oznacza:** Panel pokazuje pulpit ze wszystkimi encjami Home Assistant zamiast tylko tych, których pulpit używa.

**Dlaczego:** Gdy panel uczy się, których encji używa jego pulpit, czeka za ekranem wyjaśniającym, na co oczekuje. Jeśli trwa to ponad 90 sekund, pokazuje niefiltrowany pulpit, aby nie pozostawić Cię bez niego. Typowe przyczyny to skan, na który Home Assistant nie odpowiedział, odrzucone logowanie, reguły pulpitu wymagające Twojej decyzji i zbyt stary silnik przeglądarki do filtrowania. Panel nadal próbuje w tle pulpitu.

**Jak naprawić:** Otwórz ten panel na pasku bocznym Panel Assistant, a następnie Encje, aby sprawdzić, na co oczekuje. Rozstrzygnij tam decyzję dotyczącą oznaczonych reguł albo zaloguj się ponownie w Konfiguracji, jeśli Home Assistant odrzucił logowanie. Jeśli Panel Assistant oferuje nowszy silnik przeglądarki dla panelu, zainstaluj go. Panel sam powróci do filtrowanego pulpitu, a naprawa zniknie.

<a id="voice-microphone-silent"></a>

## Cisza z mikrofonu głosowego

**Co to oznacza:** Panel nie nasłuchuje słowa budzącego, ponieważ test przechwytywania mikrofonu zarejestrował tylko ciszę.

**Dlaczego:** Test wykrył tylko ciszę lub stały poziom tła audio.

**Jak naprawić:** Otwórz ten panel na pasku bocznym Panel Assistant, a następnie Konfiguracja → Asystent głosowy. Wyłącz i włącz funkcję, aby powtórzyć test. Jeśli nadal się nie udaje, zmień Źródło dźwięku na tej samej karcie głosu; bezpośredni odnośnik odsłania ustawienie zaawansowane. Udany test usuwa naprawę. Wyłączenie głosu także ją wycofuje, ponieważ nasłuchiwanie nie jest już wymagane.

<a id="voice-microphone-no-audio"></a>

## Brak dźwięku z mikrofonu głosowego

**Co to oznacza:** Panel nie nasłuchuje słowa budzącego, ponieważ test przechwytywania mikrofonu nie otrzymał dźwięku.

**Dlaczego:** Przechwytywanie Androida nie dostarczyło dźwięku, bez dokładniejszego błędu.

**Jak naprawić:** Otwórz ten panel na pasku bocznym Panel Assistant, a następnie Konfiguracja → Asystent głosowy. Wyłącz i włącz funkcję, aby powtórzyć test. Jeśli nadal się nie udaje, zmień Źródło dźwięku na tej samej karcie głosu; bezpośredni odnośnik odsłania ustawienie zaawansowane. Udany test usuwa naprawę. Wyłączenie głosu także ją wycofuje, ponieważ nasłuchiwanie nie jest już wymagane.

<a id="voice-microphone-no-audio-detail"></a>

## Szczegóły braku dźwięku z mikrofonu głosowego

**Co to oznacza:** Panel nie nasłuchuje słowa budzącego, ponieważ test przechwytywania mikrofonu nie otrzymał dźwięku.

**Dlaczego:** Przechwytywanie Androida nie zwróciło dźwięku; szczegóły zgłoszone przez panel wyjaśniają błąd przechwytywania.

**Jak naprawić:** Otwórz ten panel na pasku bocznym Panel Assistant, a następnie Konfiguracja → Asystent głosowy. Wyłącz i włącz funkcję, aby powtórzyć test. Jeśli nadal się nie udaje, zmień Źródło dźwięku na tej samej karcie głosu; bezpośredni odnośnik odsłania ustawienie zaawansowane. Udany test usuwa naprawę. Wyłączenie głosu także ją wycofuje, ponieważ nasłuchiwanie nie jest już wymagane.

<a id="wake-word-kept"></a>

## Zachowane słowo budzące

**Co to oznacza:** Panel zachował własny model pod współdzielonym identyfikatorem słowa budzącego, więc nie używa modelu współdzielonego.

**Dlaczego:** Zainstalowany model ma inny SHA-256 niż model współdzielony i nie jest jego poprzednią kopią. Panel Assistant zachowuje niezależnie zaimportowany model zamiast go nadpisywać.

**Jak naprawić:** Otwórz ten panel w Panel Assistant, Konfiguracja, Słowa budzące. Jeśli chcesz tam model współdzielony, zaimportuj na tym panelu jego pasujący manifest .json i model .tflite. Jeśli obecny model jest zamierzony, pozostaw go; automatyczne współdzielenie nigdy go nie zastępuje. Import przez pasek boczny czyni zaimportowany model także kopią współdzieloną; współdzielenie nie aktywuje słów budzących.

Import przez pasek boczny zastępuje kopię współdzieloną i może zaktualizować inne panele. Zobacz [własne słowa budzące](/pl/manage/custom-wake-words/).

<a id="wake-word-refused"></a>

## Odrzucone słowo budzące

**Co to oznacza:** Współdzielone słowo budzące nie zostało zainstalowane na tym panelu; jego pozostałe zainstalowane słowa pozostają dostępne.

**Dlaczego:** Panel odrzucił importowany model i podał przyczynę. Model może mieć nieprawidłowy manifest, przekraczać limity, nie przejść sprawdzenia silnika słów budzących lub nie zostać zapisany. Model zaakceptowany przez jeden panel może zostać odrzucony przez inny.

**Jak naprawić:** Otwórz ten panel w Panel Assistant, Konfiguracja, Słowa budzące. Użyj zgłoszonej przyczyny, aby poprawić lub ponownie wytrenować model microWakeWord, a następnie zaimportuj tam pasujący manifest .json i plik .tflite. Import pokazuje odpowiedź panelu i przy odmowie zachowuje jego ostatni poprawny model. Współdzielenie nie aktywuje słowa budzącego; wybierz je, jeśli panel ma go nasłuchiwać. Nieobsługiwane polecenia starszej aplikacji i przekroczenia czasu połączenia powodują ostrzeżenia zamiast tej naprawy.

Import przez pasek boczny zastępuje kopię współdzieloną i może zaktualizować inne panele. Zobacz [własne słowa budzące](/pl/manage/custom-wake-words/).

<a id="volume-number-removed"></a>

## Usunięta encja liczbowa głośności

**Co to oznacza:** Automatyzacje lub skrypty nadal odwołują się do oddzielnej encji liczbowej głośności, usuniętej z panelu, który ma teraz odtwarzacz multimediów. Te działania wymagają aktualizacji.

**Dlaczego:** Głośność należy teraz do odtwarzacza multimediów panelu. Panel Assistant po uruchomieniu Home Assistant usuwa tylko dawną encję liczbową głośności tego panelu i wymienia automatyzacje oraz skrypty, które nadal się do niej odwołują.

**Jak naprawić:** Otwórz Automatyzacje lub Skrypty i znajdź pozycje wymienione w naprawie. Zastąp działania number.set_value skierowane do usuniętej encji działaniami media_player.volume_set skierowanymi do odtwarzacza panelu; ustaw volume_level od 0 do 1, np. 0.5 dla 50%. Zaktualizuj inne odwołania zgodnie z ich celem. Zapisz, sprawdź działanie automatyzacji lub skryptu, a następnie zignoruj naprawę. Panel Assistant nie przepisuje ich automatycznie.

<a id="restart-required"></a>

## Wymagane ponowne uruchomienie

**Co to oznacza:** Home Assistant nadal używa poprzedniej wersji Panel Assistant.

**Dlaczego:** Zainstalowana wersja/kompilacja integracji różni się od kodu już załadowanego w Home Assistant.

**Jak naprawić:** Otwórz naprawę, sprawdź zainstalowaną i uruchomioną wersję, a następnie wybierz Wyślij, gdy będziesz gotowy ponownie uruchomić Home Assistant i załadować zainstalowaną wersję.

<a id="panel-user-mismatch"></a>

## Niezgodność użytkownika panelu

**Co to oznacza:** Żądanie konta panelu czeka na Twoje potwierdzenie.

**Dlaczego:** Zalogowany użytkownik Home Assistant poprosił o połączenie jako ten panel. Pierwsze powiązanie lub zmiana zapisanego konta wymaga Twojej zgody.

**Jak naprawić:** Otwórz naprawę i porównaj podany panel i użytkownika z celowo skonfigurowanym kontem. Wybierz Wyślij tylko wtedy, gdy rozpoznajesz żądanie. Jeśli panel ma już inne konto, potwierdzenie zmiany kończy akceptowanie tamtego konta. Przy nieoczekiwanym żądaniu zamknij okno i zignoruj problem: każdy zalogowany użytkownik może zażądać połączenia panelu.

<a id="no-update-route"></a>

## Brak ścieżki aktualizacji

**Co to oznacza:** Panel Assistant nie może instalować aktualizacji aplikacji; panel pozostaje przy obecnej wersji, a jego pozostałe funkcje nadal działają.

**Dlaczego:** Panel nie oferuje już użytecznej ścieżki aktualizacji, co może nastąpić po zmianach firmware lub resetowaniu.

**Jak naprawić:** Wykonaj [przewodnik dla panelu, którego nie można zaktualizować](/pl/manage/updates-and-recovery/#panel-którego-nie-można-zaktualizować). Odzyskiwanie zależy od modelu i firmware: przywracaj debugowanie lub łącz ponownie przez USB tylko wtedy, gdy przewodnik tego wymaga. Naprawa znika, gdy Home Assistant ma działającą ścieżkę aktualizacji.

<a id="merged-panel-identity"></a>

## Scalona tożsamość panelu

**Co to oznacza:** Kilka wpisów deklaruje jedną tożsamość, uniemożliwiając bezpieczne przypisanie natywne.

**Dlaczego:** Sklonowane lub historyczne współdzielone identyfikatory czynią sesję niejednoznaczną; integracja odmawia wybrania panelu.

**Jak naprawić:** Zaktualizuj aplikację na każdym fizycznym panelu objętym problemem, aby każdy zgłaszał własną tożsamość. Następnie usuń scalone urządzenie w Home Assistant i pozwól panelom zarejestrować się ponownie. Przejrzyj encje wyłączone przez wcześniejsze wydanie; nie są przywracane automatycznie.

<a id="installer-failure"></a>

## Niepowodzenie instalatora

**Co to oznacza:** Instalacja lub aktualizacja nie została ukończona.

**Dlaczego:** Niepowodzenie nie pasowało do dokładniejszej przyczyny naprawy.

**Jak naprawić:** Otwórz raport pomocy, aby sprawdzić, co się stało, a następnie użyj Spróbuj ponownie po usunięciu zgłoszonej przyczyny.

<a id="installer-failure-authorization-failed"></a>

## Niepowodzenie instalatora: autoryzacja

**Co to oznacza:** Instalacja nie mogła połączyć się z Androidem na panelu.

**Dlaczego:** Panel nie zaakceptował połączenia ADB z Home Assistant.

**Jak naprawić:** Sprawdź debugowanie panelu i prośbę o zgodę według przewodnika Przygotowanie panelu, a następnie użyj Spróbuj ponownie w naprawie.

<a id="installer-failure-preflight-rejected"></a>

## Niepowodzenie instalatora: odrzucone sprawdzenie wstępne

**Co to oznacza:** Żądana aplikacja nie została zainstalowana.

**Dlaczego:** Sprawdzenia instalatora odrzuciły panel przed instalacją.

**Jak naprawić:** Otwórz raport pomocy, popraw zgłoszony warunek, a następnie użyj Spróbuj ponownie, jeśli panel i wybrane wydanie nadal są zgodne.

<a id="installer-failure-artifact-rejected"></a>

## Niepowodzenie instalatora: odrzucony artefakt

**Co to oznacza:** Żądana aplikacja nie została zainstalowana.

**Dlaczego:** Nie udało się uwierzytelnić wydania albo nie przeszło ono lokalnych sprawdzeń przygotowania, w tym niebezpiecznej lub zajętej ścieżki roboczej.

**Jak naprawić:** Otwórz raport pomocy, aby ustalić odrzucone wydanie lub sprawdzenie przygotowania, a następnie ponów przez naprawę po usunięciu przyczyny.

<a id="installer-failure-transport-failed"></a>

## Niepowodzenie instalatora: transport

**Co to oznacza:** Home Assistant nie mógł ukończyć przesyłania lub instalowania aplikacji.

**Dlaczego:** Operacja transportu nie powiodła się; może to być problem połączenia albo odrzucona operacja przesyłania lub instalacji.

**Jak naprawić:** Przywróć połączenie panelu, a następnie użyj Spróbuj ponownie w naprawie, aby Panel Assistant sprawdził jego bieżący stan przed kontynuacją.

<a id="installer-failure-install-failed"></a>

## Niepowodzenie instalatora: instalacja

**Co to oznacza:** Android odrzucił żądaną instalację.

**Dlaczego:** Instalacja pakietu na panelu nie powiodła się; raport pomocy zawiera wynik.

**Jak naprawić:** Przeczytaj raport pomocy i usuń zgłoszony błąd Androida, a następnie użyj Spróbuj ponownie w naprawie.

<a id="installer-failure-launch-failed"></a>

## Niepowodzenie instalatora: uruchamianie

**Co to oznacza:** Aplikacja jest zainstalowana, lecz nie uruchomiła się.

**Dlaczego:** Instalator nie mógł uruchomić Panel Assistant po instalacji.

**Jak naprawić:** Otwórz Panel Assistant z listy aplikacji panelu, a następnie użyj Spróbuj ponownie w naprawie, aby sprawdzić i zakończyć próbę. Jeśli aplikacja nie otwiera się, użyj raportu pomocy, szukając wsparcia.

<a id="installer-failure-health-check-failed"></a>

## Niepowodzenie instalatora: sprawdzenie działania

**Co to oznacza:** Aplikacja uruchomiła się, lecz nie potwierdzono jej prawidłowego działania.

**Dlaczego:** Instalator nie otrzymał wymaganej odpowiedzi potwierdzającej prawidłowe działanie.

**Jak naprawić:** Sprawdź aplikację na panelu, a następnie użyj Spróbuj ponownie w naprawie, aby sprawdzić jej stan. Jeśli nadal działa nieprawidłowo, użyj raportu pomocy, szukając wsparcia.

<a id="installer-failure-ambiguous-mutation"></a>

## Niepowodzenie instalatora: niejednoznaczna zmiana

**Co to oznacza:** Panel Assistant nie może ustalić, czy nieudana próba zmieniła panel.

**Dlaczego:** Wynik instalacji nie dowiódł końcowego stanu pakietu na panelu.

**Jak naprawić:** Sprawdź zawartość fizycznego panelu i otwórz raport pomocy naprawy. Użyj zabezpieczonego działania Spróbuj ponownie dopiero po sprawdzeniu zgłoszonego stanu; nie odinstalowuj, nie usuwaj danych aplikacji ani nie resetuj panelu, aby skasować komunikat.

<a id="installer-failure-verification-required"></a>

## Niepowodzenie instalatora: wymagana weryfikacja

**Co to oznacza:** Kolejna instalacja jest wstrzymana do czasu sprawdzenia panelu.

**Dlaczego:** Poprzednia próba wymaga weryfikacji przed dalszą instalacją.

**Jak naprawić:** Sprawdź panel i jego raport pomocy, a następnie użyj Spróbuj ponownie w naprawie, aby ponownie sprawdzić bieżący stan. Nie odinstalowuj, nie usuwaj danych aplikacji ani nie resetuj panelu, aby skasować komunikat.

<a id="installer-failure-update"></a>

## Niepowodzenie instalatora: aktualizacja

**Co to oznacza:** Home Assistant nie mógł potwierdzić ukończenia aktualizacji. W niewydanej wersji 1.0.0-rc2 aplikacja panelu może być już zainstalowana, podczas gdy aktualizacja silnika przeglądarki pozostaje niedokończona.

**Dlaczego:** Aktualizacja aplikacji lub, w tej wersji, silnika przeglądarki nie powiodła się albo nie mogła zostać zweryfikowana. Naprawa zachowuje raport całej próby.

**Jak naprawić:** Przeczytaj raport pomocy, przywróć zgłoszone połączenie lub spełnij warunek instalacji, a następnie wybierz **Spróbuj ponownie**. W niewydanej wersji 1.0.0-rc2, jeśli niedokończona pozostaje tylko aktualizacja silnika przeglądarki, a Panel Assistant potwierdzi zainstalowanie żądanej wersji aplikacji, kontynuuje ten etap bez ponownego instalowania aplikacji. Jeśli oferowane jest **Zezwól na aktualizacje**, najpierw użyj go do zatwierdzenia Home Assistant na panelu. Zobacz [przewodnik WebView](/pl/hardware/guides/update-the-webview/), jeśli silnika przeglądarki nie można zaktualizować.

<a id="installer-failure-retry-hold"></a>

## Niepowodzenie instalatora: wstrzymana ponowna próba

**Co to oznacza:** Ponowna próba jest wstrzymana i nie ma zgody na kontynuację.

**Dlaczego:** Sprawdzenie bezpieczeństwa lub nieoczekiwany błąd ponownej próby zatrzymał tę próbę. Zapisany raport zawiera obserwacje; wstrzymanie nie daje zgody na ponowną instalację.

**Jak naprawić:** Przeczytaj zgłoszony błąd ponownej próby i raport pomocy, sprawdź zgodność zamierzonego panelu i wydania, a następnie użyj Spróbuj ponownie po usunięciu przyczyny. Wyczyszczenie błędu usuwa tylko jego naprawę i zapisany raport.

<a id="panel-address-unreachable"></a>

## Nieosiągalny adres panelu

**Co to oznacza:** Sterowanie pozostaje dostępne przez aktywne połączenie, ale operacje HTTP nie mają zweryfikowanego osiągalnego adresu.

**Dlaczego:** Zapisany adres przestał odpowiadać; automatyczne odzyskiwanie nie miało użytecznego kandydata albo nie mogło go zweryfikować.

**Jak naprawić:** Przywróć osiągalność sieciową/HTTP panelu albo dodaj ten sam panel pod bieżącym adresem; nie omijaj sprawdzenia tożsamości.

<a id="panel-address-unverified"></a>

## Niezweryfikowany adres panelu

**Co to oznacza:** Sterowanie pozostaje dostępne przez aktywne połączenie, ale operacje HTTP nie mają zweryfikowanego osiągalnego adresu.

**Dlaczego:** Zapisany adres przestał odpowiadać; automatyczne odzyskiwanie nie miało użytecznego kandydata albo nie mogło go zweryfikować.

**Jak naprawić:** Przywróć osiągalność sieciową/HTTP panelu albo dodaj ten sam panel pod bieżącym adresem; nie omijaj sprawdzenia tożsamości.

<a id="panel-identity-mismatch"></a>

## Niezgodna tożsamość panelu

**Co to oznacza:** Stan panelu i sterowanie są odrzucane pod adresem końcowym o innej tożsamości.

**Dlaczego:** Adres odpowiada teraz jako inna instalacja albo nie można bezpiecznie uzgodnić zapisanych dowodów tożsamości.

**Jak naprawić:** Sprawdź fizyczny panel i adres; dodaj ponownie bieżący znany panel, jeśli został przeniesiony. Nigdy nie zatwierdzaj innej tożsamości wyłącznie dlatego, że używa starego adresu.

<a id="panel-link-shared"></a>

## Współdzielony identyfikator połączenia panelu

**Co to oznacza:** Ponownie zainstalowanego panelu nie można bezpiecznie przypisać do jednej istniejącej konfiguracji.

**Dlaczego:** Kilka wpisów zapisało ten sam dawny identyfikator połączenia urządzenia; sama osiągalność adresu nie jest problemem.

**Jak naprawić:** Zachowaj działające pozostałe panele; usuń tylko nieużywane wpisy albo dodaj ponownie zainstalowany panel oddzielnie.

<a id="panel-identity-confirmation"></a>

## Potwierdzenie tożsamości panelu

**Co to oznacza:** Istniejące konfiguracje paneli czekają na Twoje potwierdzenie po zgłoszeniu przez panele nowych tożsamości urządzeń.

**Dlaczego:** Panel Assistant nie mógł automatycznie dowieść, że każda nowa tożsamość należy do poprzedniej konfiguracji.

**Jak naprawić:** Przejrzyj każdą nazwę i adres panelu na liście. Wybierz Wyślij tylko wtedy, gdy każdy wymieniony panel należy do swojej istniejącej konfiguracji. Otwarcie okna niczego nie zmienia.

<a id="installer-failure-adb-authorization"></a>

## Niepowodzenie instalatora: autoryzacja ADB

**Co to oznacza:** Nieudana aktualizacja nie może być kontynuowana, dopóki panel nie zezwoli Home Assistant.

**Dlaczego:** Nadal wymagana jest zgoda zaufania ADB; raport nieudanej aktualizacji pozostaje dostępny.

**Jak naprawić:** Wybierz Zezwól na aktualizacje w naprawie i Wyślij, a następnie na wskazanym panelu zaznacz Zawsze zezwalaj z tego komputera i dotknij Zezwól. Wróć do naprawy i użyj Spróbuj ponownie dla nieudanej aktualizacji.

<a id="adb-update-authorization"></a>

## Autoryzacja aktualizacji ADB

**Co to oznacza:** Home Assistant nie może używać ADB do aktualizacji tego panelu, dopóki panel na to nie zezwoli.

**Dlaczego:** Ścieżka aktualizacji wymaga wyraźnej zgody zaufania na panelu.

**Jak naprawić:** Otwórz naprawę i wybierz Wyślij, a następnie na wskazanym panelu zaznacz Zawsze zezwalaj z tego komputera i dotknij Zezwól. Android może nazywać Home Assistant komputerem; proces jest kontynuowany po zgodzie.

<a id="another-home-assistant"></a>

## Inny Home Assistant

**Co to oznacza:** Dodanie tutaj panelu nie zmienia jego zapisanego serwera ani konta.

**Dlaczego:** Zapisany na panelu adres Home Assistant wskazuje inny serwer niż ten.

**Jak naprawić:** Jeśli chcesz, aby panel łączył się tutaj, użyj odnośnika naprawy do Konfiguracji, wpisz ten adres Home Assistant, zapisz, a następnie połącz ponownie i zaloguj się na konto, którego panel ma używać. Jeśli należy do innego serwera, pozostaw jego ustawienia i zignoruj naprawę. Jeśli pasek boczny nie może go osiągnąć, otwórz Konfigurację bezpośrednio w sieci panelu.
