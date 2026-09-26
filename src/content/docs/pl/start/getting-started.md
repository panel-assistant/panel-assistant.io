---
title: Pierwsze kroki
description: W kilka minut od gołego panelu ściennego z Androidem do twojego pulpitu nawigacyjnego Home Assistant, a Home Assistant prowadzi cię przez każdy krok.
sourceCommit: 50fccda5c7e05cce0edbd2b4b37e006c473ca5df
---

Jeśli kiedyś konfigurowałeś panel ścienny lub kiosk, pewnie pamiętasz, jak to wyglądało: instalowanie aplikacji z innych źródeł, szukanie silnika przeglądarki, który potrafiłby wyświetlić pulpit nawigacyjny, zgadywanie ustawień i nigdy do końca pewności, co będzie po następnym restarcie. Konfiguracja panelu z Panel Assistant będzie dla ciebie miłym szokiem. Możesz skończyć w kilka minut, a nawet gdy panel wisi już na ścianie, nie musisz wstawać z krzesła. No dobrze, może raz ;-)

Najtrudniejsza przy każdym panelu jest pierwsza godzina. Panel Assistant przejdzie ją za ciebie, z poziomu Home Assistant. Jeśli panel jest już w twojej sieci, podaj integracji jego adres, a ona zajmie się resztą. Jeśli panel jest jeszcze w pudełku, podłącz go do laptopa kablem USB i zainstaluj aplikację prosto z przeglądarki, zanim w ogóle trafi na ścianę. Tak czy inaczej zatwierdzasz jedno pytanie na panelu i patrzysz, jak wszystko przebiega do końca.

## 1. Instalacja integracji

Dodaj Panel Assistant przez HACS i uruchom ponownie Home Assistant. To jedyna rzecz, którą instalujesz ręcznie. Od tej chwili prowadzi cię Home Assistant. Zobacz [Instalacja integracji](/pl/home-assistant/custom-integration/).

## 2. Włącz debugowanie na panelu

Otwórz na panelu opcje programisty i włącz debugowanie bezprzewodowe albo debugowanie USB, jeśli podłączasz panel kablem. To właśnie pozwala Home Assistant przeprowadzić instalację za ciebie. [Strony o sprzęcie](/pl/hardware/) pokazują, gdzie jest ten przełącznik w każdym modelu, a szczegóły znajdziesz w [Przygotowanie panelu](/pl/install/prepare-a-panel/).

## 3. Dodaj panel

W Home Assistant przejdź do **Ustawienia**, **Urządzenia oraz usługi**, **Dodaj integrację** i wybierz **Panel Assistant**. Następnie wybierz, jak panel jest podłączony.

### Podłączony do komputera

Zupełnie nowy panel możesz skonfigurować, zanim w ogóle zawiśnie na ścianie. Podłącz go do komputera kablem USB i zainstaluj aplikację prosto z przeglądarki. Potrzebujesz do tego przeglądarki Chrome lub Edge.

<div class="pa-steps" role="region" aria-label="Instalacja przez USB – krok po kroku" tabindex="0">
<figure>
<figcaption><span>1</span> Wybierz Zainstaluj przez USB na tym komputerze</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="Krok Skonfiguruj panel w Home Assistant z opcjami Dodaj panel w swojej sieci i Zainstaluj przez USB na tym komputerze">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="Krok Skonfiguruj panel w Home Assistant z opcjami Dodaj panel w swojej sieci i Zainstaluj przez USB na tym komputerze">
</figure>
<figure>
<figcaption><span>2</span> Podłącz panel</figcaption>
<img class="light:sl-hidden" src="asset:usb-connect-dark.png" width="520" height="349" alt="Instalator USB prosi o podłączenie panelu i naciśnięcie Find my panel">
<img class="dark:sl-hidden" src="asset:usb-connect-light.png" width="520" height="349" alt="Instalator USB prosi o podłączenie panelu i naciśnięcie Find my panel">
</figure>
<figure>
<figcaption><span>3</span> Dotknij Zezwól na panelu</figcaption>
<img class="light:sl-hidden" src="asset:usb-allow-dark.png" width="520" height="318" alt="Instalator USB czeka, aż dotkniesz Zezwól na ekranie panelu">
<img class="dark:sl-hidden" src="asset:usb-allow-light.png" width="520" height="318" alt="Instalator USB czeka, aż dotkniesz Zezwól na ekranie panelu">
</figure>
<figure>
<figcaption><span>4</span> Naciśnij Install</figcaption>
<img class="light:sl-hidden" src="asset:usb-confirm-dark.png" width="520" height="349" alt="Instalator USB gotowy do instalacji, z jednym przyciskiem Install">
<img class="dark:sl-hidden" src="asset:usb-confirm-light.png" width="520" height="349" alt="Instalator USB gotowy do instalacji, z jednym przyciskiem Install">
</figure>
<figure>
<figcaption><span>5</span> Obserwuj instalację</figcaption>
<img class="light:sl-hidden" src="asset:usb-progress-dark.png" width="520" height="319" alt="Pasek postępu instalatora USB podczas instalowania aplikacji">
<img class="dark:sl-hidden" src="asset:usb-progress-light.png" width="520" height="319" alt="Pasek postępu instalatora USB podczas instalowania aplikacji">
</figure>
<figure>
<figcaption><span>6</span> Gotowe</figcaption>
<img class="light:sl-hidden" src="asset:usb-done-dark.png" width="520" height="262" alt="Instalator USB potwierdza instalację i otwiera konfigurację panelu">
<img class="dark:sl-hidden" src="asset:usb-done-light.png" width="520" height="262" alt="Instalator USB potwierdza instalację i otwiera konfigurację panelu">
</figure>
</div>

### W twojej sieci

Jeśli panel wisi już na ścianie, Home Assistant potrzebuje tylko jego adresu.

<div class="pa-steps" role="region" aria-label="Jak dodać panel do swojej sieci – krok po kroku" tabindex="0">
<figure>
<figcaption><span>1</span> Wybierz Dodaj panel w swojej sieci</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="Krok Skonfiguruj panel w Home Assistant z opcjami Dodaj panel w swojej sieci i Zainstaluj przez USB na tym komputerze">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="Krok Skonfiguruj panel w Home Assistant z opcjami Dodaj panel w swojej sieci i Zainstaluj przez USB na tym komputerze">
</figure>
<figure>
<figcaption><span>2</span> Podaj adres panelu</figcaption>
<img class="light:sl-hidden" src="asset:ha-address-dark.png" width="580" height="378" alt="Krok Dodaj panel z wpisanym adresem IP panelu">
<img class="dark:sl-hidden" src="asset:ha-address-light.png" width="580" height="378" alt="Krok Dodaj panel z wpisanym adresem IP panelu">
</figure>
<figure>
<figcaption><span>3</span> Wybierz wersję</figcaption>
<img class="light:sl-hidden" src="asset:ha-version-dark.png" width="580" height="305" alt="Krok Wybierz wersję z zalecanym wydaniem na górze listy">
<img class="dark:sl-hidden" src="asset:ha-version-light.png" width="580" height="305" alt="Krok Wybierz wersję z zalecanym wydaniem na górze listy">
</figure>
<figure>
<figcaption><span>4</span> Dotknij Zezwól na panelu i panel jest dodany</figcaption>
<img class="light:sl-hidden" src="asset:ha-done-dark.png" width="580" height="210" alt="Krok zakończenia potwierdzający, że panel został dodany do Home Assistant">
<img class="dark:sl-hidden" src="asset:ha-done-light.png" width="580" height="210" alt="Krok zakończenia potwierdzający, że panel został dodany do Home Assistant">
</figure>
</div>

Tak czy inaczej, kreator zajmuje się najbardziej kłopotliwą częścią. Sprawdza, co już jest na panelu, instaluje bieżące wydanie aplikacji panelu, uruchamia ją i sprawdza, czy działa prawidłowo. Panel, na którym aplikacja już działa, zostaje przejęty, a nie instalowany od nowa. Panel rozpoznaje własny model i ładuje pasujący profil sprzętowy, więc jego ekran, przyciski, diody LED i czujniki trafiają do Home Assistant gotowe do użycia. Zobacz [Dodawanie panelu](/pl/install/installing-ha-paneld/).

## 4. Dokończ w kreatorze na panelu

Home Assistant otwiera następnie kreator konfiguracji samego panelu, który zadaje kilka krótkich pytań, między innymi o nazwę panelu i pulpit nawigacyjny, który ma być na ścianie. Panel ładuje tylko te encje, które pokazuje ten pulpit, i właśnie dzięki temu działa szybko. Zobacz [Podłączanie panelu](/pl/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="Kreator konfiguracji panelu – krok po kroku" tabindex="0">
<figure>
<figcaption><span>1</span> Nazwij panel</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-name-dark.png" width="524" height="702" alt="Kreator konfiguracji panelu prosi o identyfikator panelu i przyjazną nazwę, z podglądem nazw encji, których użyje Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-name-light.png" width="524" height="702" alt="Kreator konfiguracji panelu prosi o identyfikator panelu i przyjazną nazwę, z podglądem nazw encji, których użyje Home Assistant">
</figure>
<figure>
<figcaption><span>2</span> Wybierz pulpit nawigacyjny i obszar</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-dashboard-dark.png" width="524" height="485" alt="Kreator z wybranym dla panelu pulpitem nawigacyjnym i obszarem Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-dashboard-light.png" width="524" height="485" alt="Kreator z wybranym dla panelu pulpitem nawigacyjnym i obszarem Home Assistant">
</figure>
<figure>
<figcaption><span>3</span> Włącz filtr encji</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-filter-dark.png" width="524" height="629" alt="Kreator zaleca filtr encji dla tego panelu i pokazuje liczbę encji w Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-filter-light.png" width="524" height="629" alt="Kreator zaleca filtr encji dla tego panelu i pokazuje liczbę encji w Home Assistant">
</figure>
<figure>
<figcaption><span>4</span> Już prawie gotowe</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-almost-there-dark.png" width="524" height="339" alt="Kreator czeka, aż panel zbuduje przefiltrowany zestaw encji i załaduje pulpit nawigacyjny">
<img class="dark:sl-hidden" src="asset:panel-setup-almost-there-light.png" width="524" height="339" alt="Kreator czeka, aż panel zbuduje przefiltrowany zestaw encji i załaduje pulpit nawigacyjny">
</figure>
<figure>
<figcaption><span>5</span> Wszystko gotowe</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-done-dark.png" width="524" height="526" alt="Kreator potwierdza, że panel jest skonfigurowany, i pokazuje pulpit nawigacyjny">
<img class="dark:sl-hidden" src="asset:panel-setup-done-light.png" width="524" height="526" alt="Kreator potwierdza, że panel jest skonfigurowany, i pokazuje pulpit nawigacyjny">
</figure>
</div>

## Czego potrzebujesz

- Home Assistant w wersji 2026.8.3 lub nowszej, z HACS.
- Panel ścienny z Androidem 8.0 lub nowszym. Większość paneli działa z ogólnym profilem sprzętowym, a [Wybór panelu](/pl/install/supported-panels/) zawiera listę modeli z pełną obsługą sprzętu.
- Przy opcji USB przeglądarka oparta na Chromium, np. Chrome lub Edge.

## Gdzie znajdziesz szczegóły

Strony w sekcji **Utrzymanie działania** szczegółowo opisują każdą funkcję aplikacji panelu. Sekcja referencyjna dokumentuje [API](/pl/reference/api/), [profile sprzętowe](/pl/reference/profiles/) i [model bezpieczeństwa](/pl/reference/security/), a [strony o sprzęcie](/pl/hardware/) opisują każdy obsługiwany panel.
