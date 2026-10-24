---
title: Pierwsze kroki
description: W kilka minut od gołego panelu ściennego z Androidem do twojego pulpitu nawigacyjnego Home Assistant, a Home Assistant prowadzi cię przez każdy krok.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Jeśli kiedyś konfigurowałeś panel ścienny lub kiosk, pewnie pamiętasz, jak to wyglądało: instalowanie aplikacji z innych źródeł, szukanie silnika przeglądarki, który potrafiłby wyświetlić pulpit nawigacyjny, zgadywanie ustawień i nigdy do końca pewności, co będzie po następnym restarcie. Konfiguracja panelu z Panel Assistant będzie dla ciebie miłym szokiem. Możesz skończyć w kilka minut, a nawet gdy panel wisi już na ścianie, nie musisz wstawać z krzesła. No dobrze, może raz ;-)

Najtrudniejsza przy każdym panelu jest pierwsza godzina. Panel Assistant przejdzie ją za ciebie, z poziomu Home Assistant. Jeśli panel jest już w twojej sieci, podaj integracji jego adres, a ona zajmie się resztą. Jeśli panel jest jeszcze w pudełku, podłącz go do laptopa kablem USB i zainstaluj aplikację prosto z przeglądarki, zanim w ogóle trafi na ścianę. Jeśli panel poprosi o autoryzację debugowania, zaakceptuj prośbę na jego ekranie, a następnie obserwuj instalację do końca.

## 1. Instalacja integracji

Dodaj Panel Assistant przez HACS i uruchom ponownie Home Assistant. To jedyna rzecz, którą instalujesz ręcznie. Od tej chwili prowadzi cię Home Assistant. Zobacz [Instalacja integracji](/pl/home-assistant/custom-integration/).

:::note
Panel Assistant 1.0 jest dostępny w publicznej wersji zapoznawczej. Do czasu jego wydania HACS instaluje 0.9.0. Aby zamiast tego zainstalować wersję zapoznawczą, otwórz **Panel Assistant** w HACS, włącz **Pokaż wersje beta** i pobierz najnowszą wersję zapoznawczą 1.0. Panel z aplikacją 1.0 nie może wrócić do 0.9; [Aktualizacja do 1.0](/pl/manage/upgrade-to-1-0/) wyjaśnia, co się zmienia.
:::

## 2. Włącz debugowanie na panelu

Otwórz opcje programisty na panelu: na większości paneli otwórz **Ustawienia**, następnie **Informacje** i dotknij **Numer kompilacji** siedem razy. Następnie włącz **debugowanie USB**, jeśli podłączasz panel kablem, albo **sieciowe ADB na porcie TCP 5555** dla ścieżki sieciowej. Nie każdy panel ma przełącznik sieciowego ADB; każda [strona sprzętu](/pl/hardware/) mówi, czy twój go ma i gdzie, a jeśli nie, użyj ścieżki USB. Szczegóły znajdziesz w [Przygotowaniu panelu](/pl/install/prepare-a-panel/).

## 3. Dodaj panel

W Home Assistant przejdź do **Ustawienia**, **Urządzenia oraz usługi**, **Dodaj integrację** i wybierz **Panel Assistant**. Następnie wybierz, jak panel jest podłączony.

### Podłączony do komputera

Zupełnie nowy panel możesz skonfigurować, zanim w ogóle zawiśnie na ścianie. Podłącz go do komputera kablem USB i zainstaluj aplikację prosto z przeglądarki. Potrzebujesz do tego przeglądarki Chrome lub Edge. Po wybraniu **Zainstaluj przez USB na tym komputerze** wybierz **Otwórz instalator USB**, pozostaw zalecaną wersję i naciśnij **Dalej**; instalator otworzy się w nowym oknie. Panel nadal potrzebuje Wi-Fi do ukończenia konfiguracji, więc połącz go ze swoją siecią w jego własnej aplikacji Ustawienia, przed instalacją lub po niej.

<div class="pa-steps" role="region" aria-label="Instalacja przez USB – krok po kroku" tabindex="0">
<figure>
<figcaption><span>1</span> Wybierz Zainstaluj przez USB na tym komputerze</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="Krok Skonfiguruj panel w Home Assistant z opcjami Dodaj panel w swojej sieci i Zainstaluj przez USB na tym komputerze">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="Krok Skonfiguruj panel w Home Assistant z opcjami Dodaj panel w swojej sieci i Zainstaluj przez USB na tym komputerze">
</figure>
<figure>
<figcaption><span>2</span> Podłącz panel, naciśnij Znajdź mój panel i wybierz panel z listy w przeglądarce</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-connect-dark.png" width="520" height="375" alt="Instalator USB prosi o podłączenie panelu i naciśnięcie Znajdź mój panel">
<img class="dark:sl-hidden" src="/screenshots/usb-connect-light.png" width="520" height="375" alt="Instalator USB prosi o podłączenie panelu i naciśnięcie Znajdź mój panel">
</figure>
<figure>
<figcaption><span>3</span> Zezwól na debugowanie na panelu, jeśli o to poprosi</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-allow-dark.png" width="520" height="263" alt="Instalator USB czeka, aż dotkniesz Zezwól na ekranie panelu">
<img class="dark:sl-hidden" src="/screenshots/usb-allow-light.png" width="520" height="263" alt="Instalator USB czeka, aż dotkniesz Zezwól na ekranie panelu">
</figure>
<figure>
<figcaption><span>4</span> Naciśnij Install</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-confirm-dark.png" width="520" height="323" alt="Instalator USB gotowy do instalacji, z jednym przyciskiem Install">
<img class="dark:sl-hidden" src="/screenshots/usb-confirm-light.png" width="520" height="323" alt="Instalator USB gotowy do instalacji, z jednym przyciskiem Install">
</figure>
<figure>
<figcaption><span>5</span> Obserwuj instalację</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-progress-dark.png" width="520" height="309" alt="Pasek postępu instalatora USB podczas instalowania aplikacji">
<img class="dark:sl-hidden" src="/screenshots/usb-progress-light.png" width="520" height="309" alt="Pasek postępu instalatora USB podczas instalowania aplikacji">
</figure>
<figure>
<figcaption><span>6</span> Gotowe</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-done-dark.png" width="520" height="308" alt="Instalator USB potwierdza instalację i otwiera konfigurację panelu">
<img class="dark:sl-hidden" src="/screenshots/usb-done-light.png" width="520" height="308" alt="Instalator USB potwierdza instalację i otwiera konfigurację panelu">
</figure>
</div>

### W twojej sieci

Jeśli panel wisi już na ścianie, Home Assistant potrzebuje tylko jego adresu.

<div class="pa-steps" role="region" aria-label="Jak dodać panel do swojej sieci – krok po kroku" tabindex="0">
<figure>
<figcaption><span>1</span> Wybierz Dodaj panel w swojej sieci</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="Krok Skonfiguruj panel w Home Assistant z opcjami Dodaj panel w swojej sieci i Zainstaluj przez USB na tym komputerze">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="Krok Skonfiguruj panel w Home Assistant z opcjami Dodaj panel w swojej sieci i Zainstaluj przez USB na tym komputerze">
</figure>
<figure>
<figcaption><span>2</span> Podaj adres panelu</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-address-dark.png" width="580" height="377" alt="Krok Dodaj panel z wpisanym adresem IP panelu">
<img class="dark:sl-hidden" src="/screenshots/ha-address-light.png" width="580" height="377" alt="Krok Dodaj panel z wpisanym adresem IP panelu">
</figure>
<figure>
<figcaption><span>3</span> Wybierz wersję</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-version-dark.png" width="580" height="304" alt="Krok Wybierz wersję z zalecanym wydaniem na górze listy">
<img class="dark:sl-hidden" src="/screenshots/ha-version-light.png" width="580" height="304" alt="Krok Wybierz wersję z zalecanym wydaniem na górze listy">
</figure>
<figure>
<figcaption><span>4</span> Zezwól na debugowanie na panelu, jeśli o to poprosi</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-authorize-dark.png" width="580" height="354" alt="Home Assistant czeka, aż zaznaczysz Zawsze zezwalaj z tego komputera i dotkniesz Zezwól na panelu; potem kontynuuje automatycznie">
<img class="dark:sl-hidden" src="/screenshots/ha-authorize-light.png" width="580" height="354" alt="Home Assistant czeka, aż zaznaczysz Zawsze zezwalaj z tego komputera i dotkniesz Zezwól na panelu; potem kontynuuje automatycznie">
</figure>
<figure>
<figcaption><span>5</span> Otwórz stronę konfiguracji panelu</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-done-dark.png" width="580" height="248" alt="Home Assistant udostępnia stronę konfiguracji panelu i prosi o powrót oraz wybranie Gotowe po jej ukończeniu">
<img class="dark:sl-hidden" src="/screenshots/ha-done-light.png" width="580" height="248" alt="Home Assistant udostępnia stronę konfiguracji panelu i prosi o powrót oraz wybranie Gotowe po jej ukończeniu">
</figure>
</div>

Jeśli panel zapyta, czy zezwolić na debugowanie, zaznacz **Zawsze zezwalaj z tego komputera** i dotknij **Zezwól** na panelu; Home Assistant sam przejdzie dalej. Następnie potwierdź instalację.

Tak czy inaczej, kreator zajmuje się najbardziej kłopotliwą częścią. Sprawdza, co już jest na panelu, instaluje bieżące wydanie aplikacji panelu, uruchamia ją i sprawdza, czy działa prawidłowo. Panel, na którym aplikacja już działa, zostaje przejęty, a nie instalowany od nowa. Panel rozpoznaje własny model i ładuje pasujący profil sprzętowy, więc jego ekran, przyciski, diody LED i czujniki trafiają do Home Assistant gotowe do użycia. Zobacz [Dodawanie panelu](/pl/install/installing-ha-paneld/).

## 4. Dokończ w kreatorze na panelu

Następnie przychodzi czas na kreator konfiguracji samego panelu. Udostępnia go panel, ale otwiera się on w przeglądarce na komputerze, a nie na ekranie panelu. Po instalacji sieciowej Home Assistant pokazuje **Dokończ konfigurację tego panelu**: otwórz stronę konfiguracji panelu, wykonaj tam wszystkie kroki, a potem wróć do Home Assistant i wybierz **Gotowe**. Po instalacji USB okno instalatora przechodzi prosto do kreatora. Ponieważ udostępnia go panel, ładuje się tylko w przeglądarce w tej samej sieci co panel.

Kreator prosi o nazwę panelu, loguje go do Home Assistant i pyta, który pulpit nawigacyjny wyświetlać oraz w którym obszarze znajduje się panel. Panel łączy się jako konto Home Assistant, którym się zalogujesz, więc jeśli twoja przeglądarka jest zalogowana jako ty, panel może połączyć się jako ty; aby panel korzystał z własnego konta, zaloguj się zamiast tego na to konto. Przy włączonym filtrowaniu encji panel ładuje tylko encje używane przez ten pulpit, dzięki czemu działa szybko. Zobacz [Podłączanie panelu](/pl/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="Kreator konfiguracji panelu – krok po kroku" tabindex="0">
<figure>
<figcaption><span>1</span> Nazwij panel</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-name-dark.png" width="524" height="702" alt="Kreator konfiguracji panelu prosi o identyfikator panelu i przyjazną nazwę, z podglądem nazw encji, których użyje Home Assistant">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-name-light.png" width="524" height="702" alt="Kreator konfiguracji panelu prosi o identyfikator panelu i przyjazną nazwę, z podglądem nazw encji, których użyje Home Assistant">
</figure>
<figure>
<figcaption><span>2</span> Zaloguj się do Home Assistant</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-sign-in-dark.png" width="524" height="688" alt="Kreator proponuje zalogowanie z tej przeglądarki lub na panelu, przy użyciu konta Home Assistant, z którym panel ma się łączyć">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-sign-in-light.png" width="524" height="688" alt="Kreator proponuje zalogowanie z tej przeglądarki lub na panelu, przy użyciu konta Home Assistant, z którym panel ma się łączyć">
</figure>
<figure>
<figcaption><span>3</span> Wybierz pulpit nawigacyjny i obszar</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-dashboard-dark.png" width="524" height="485" alt="Kreator z wybranym dla panelu pulpitem nawigacyjnym i obszarem Home Assistant">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-dashboard-light.png" width="524" height="485" alt="Kreator z wybranym dla panelu pulpitem nawigacyjnym i obszarem Home Assistant">
</figure>
<figure>
<figcaption><span>4</span> Włącz filtr encji, jeśli pojawi się taka prośba</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-filter-dark.png" width="524" height="636" alt="Kreator zaleca filtr encji dla tego panelu i pokazuje liczbę encji w Home Assistant">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-filter-light.png" width="524" height="636" alt="Kreator zaleca filtr encji dla tego panelu i pokazuje liczbę encji w Home Assistant">
</figure>
<figure>
<figcaption><span>5</span> Już prawie gotowe</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-almost-there-dark.png" width="524" height="339" alt="Kreator czeka, aż panel zbuduje przefiltrowany zestaw encji i załaduje pulpit nawigacyjny">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-almost-there-light.png" width="524" height="339" alt="Kreator czeka, aż panel zbuduje przefiltrowany zestaw encji i załaduje pulpit nawigacyjny">
</figure>
<figure>
<figcaption><span>6</span> Wszystko gotowe</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-done-dark.png" width="524" height="526" alt="Kreator potwierdza, że panel jest skonfigurowany, i pokazuje pulpit nawigacyjny">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-done-light.png" width="524" height="526" alt="Kreator potwierdza, że panel jest skonfigurowany, i pokazuje pulpit nawigacyjny">
</figure>
</div>

## Czego potrzebujesz

- Home Assistant w wersji 2026.8.3 lub nowszej, z HACS.
- Panel ścienny z procesorem ARM, Androidem 8.0 lub nowszym i dostępem do debugowania. Większość paneli działa z ogólnym profilem sprzętowym, a [Wybór panelu](/pl/install/supported-panels/) zawiera listę modeli z pełną obsługą sprzętu.
- Przy opcji USB przeglądarka oparta na Chromium, np. Chrome lub Edge.

## Gdzie znajdziesz szczegóły

Strony w sekcji **Utrzymanie działania** szczegółowo opisują każdą funkcję aplikacji panelu. Sekcja referencyjna dokumentuje [API](/pl/reference/api/), [profile sprzętowe](/pl/reference/profiles/) i [model bezpieczeństwa](/pl/reference/security/), a [strony o sprzęcie](/pl/hardware/) opisują każdy obsługiwany panel.
