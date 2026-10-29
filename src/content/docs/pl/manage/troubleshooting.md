---
title: Rozwiązywanie problemów
description: Typowe problemy z panelem ściennym i miejsca, od których warto zacząć.
sourceCommit: 3c2d618c24d3ddd2baf1868792ee3e46ad57f8de
---

Zacznij od urządzenia panelu w Home Assistant, które ma czujnik stanu i możliwość pobrania diagnostyki, oraz od strony stanu samego panelu: użyj **Odwiedź** na stronie jego urządzenia w Home Assistant. Raport `/diag` odpowiada na większość poniższych pytań bez zgadywania.

Gdy potrzebujesz obserwować bieżące działanie panelu, karta **Logi** na tej stronie przesyła na żywo dziennik aplikacji panelu, z ukrytymi tokenami i hasłami.

![Karta Logi interfejsu internetowego panelu przesyłająca dziennik aplikacji na żywo, z polem filtrowania i przyciskami Śledź oraz Wstrzymaj](/screenshots/ui-logs-dark.png)

## Pulpit jest pusty, częściowo narysowany lub pełen błędów skryptów

Najpierw sprawdź systemowy WebView. To zdecydowanie najczęstszy problem przy pierwszym uruchomieniu, a stary WebView daje dokładnie te objawy, wyglądające jak usterka aplikacji panelu. Procedurę opisuje [Aktualizacja systemowego WebView](/pl/hardware/guides/update-the-webview/).

Jeśli WebView jest aktualny, sekcja [uruchamiania i odzyskiwania](/pl/manage/built-in-renderer/#uruchamianie-i-odzyskiwanie) opisuje, co panel robi, gdy pulpit się nie ładuje, i jak ustalić przyczynę.

## Pulpit działa wolno

Częściowo odpowiada za to panel, a częściowo pulpit. [Wydajność](/pl/manage/performance/) opisuje pomiary dostępne na stronie stanu panelu i działania, które zwykle pomagają, a [dokumentacja sprzętu](/pl/hardware/) szereguje obsługiwane panele, aby można było ocenić, czy nie wymagasz zbyt wiele od sprzętu.

## Instalator nie może dotrzeć do panelu

Przez sieć: potwierdź adres panelu i to, że sieciowe ADB na porcie TCP 5555 nadal jest włączone, ponieważ niektóre panele wyłączają je po ponownym uruchomieniu. Jeśli panel wyświetla monit autoryzacji, zaakceptuj go na ekranie panelu. Przez USB: upewnij się, że używasz przeglądarki opartej na Chromium, kabel prowadzi do komputera uruchamiającego przeglądarkę, a debugowanie USB jest włączone. Dostęp do opcji programisty i włączanie debugowania różnią się między modelami; opisują je [Przygotowanie panelu](/pl/install/prepare-a-panel/) i [strony sprzętu](/pl/hardware/). Jeśli panel po prostu nie przyjmuje połączenia sieciowego, zamiast tego [zainstaluj przez USB](/pl/install/install-over-usb/): panel nie potrzebuje sieciowego ADB, a przeglądarka pozostaje połączona z Home Assistant w celu pobrania zweryfikowanego wydania.

## Instalacja sieciowa zatrzymała się w trakcie

Gdy Home Assistant zatrzyma instalację sieciową, komunikat podaje, jak daleko dotarła. Znajdź poniżej zdanie odpowiadające twojemu. W każdym przypadku nie odinstalowuj Panel Assistant, nie czyść jego danych ani nie resetuj panelu: stan panelu wskazuje, gdzie zatrzymała się instalacja.

Tam, gdzie poniższe kroki każą ponownie dodać integrację, jeśli panel jest już dodany, a komunikat pojawił się podczas zezwalania na aktualizacje w **Konfiguruj** lub naprawie, ponów próbę tam i nie dodawaj ponownie integracji.

### Nie zainstalowano APK

Jeśli komunikat mówi, że nie zainstalowano APK lub nie zmieniono panelu, instalacja zatrzymała się przed wprowadzeniem zmian. Sprawdź, czy panel jest włączony i dostępny w sieci pod tym samym adresem, a następnie ponownie dodaj integrację Panel Assistant i wpisz ten sam adres. Home Assistant ponownie sprawdza panel przed wprowadzeniem zmian. Jeśli instalacja zatrzyma się w tym samym miejscu drugi raz, obejrzyj panel i wykonaj następną sekcję, jeśli Panel Assistant jest na nim obecny.

### Zainstalowano, ale nie uruchomiono lub nie sprawdzono

Jeśli komunikat mówi, że APK jest zainstalowane, ale Panel Assistant nie uruchomił się lub nie przeszedł kontroli, aplikacja jest na panelu i brakuje tylko ostatniego kroku. Otwórz Panel Assistant z listy aplikacji panelu i poczekaj na ekran konfiguracji. Następnie ponownie dodaj integrację Panel Assistant z tym samym adresem: gdy aplikacja odpowie, Home Assistant zaproponuje jej połączenie („Panel Assistant jest zainstalowany, ale niepołączony”) i niczego nie zainstaluje. Jeśli Home Assistant informuje, że zainstalowana aplikacja nie jest wybranym wydaniem, wybierz zainstalowaną wersję, którą Ustawienia Androida na panelu pokazują w Aplikacje › Panel Assistant. Jeśli Panel Assistant się nie otwiera lub jego ekran konfiguracji nigdy się nie pojawia, nie ponawiaj automatycznej instalacji: poproś o pomoc zgodnie z następną sekcją.

### Instalacja mogła zmienić panel

Jeśli komunikat mówi, że instalator „zatrzymał się z nierozpoznanym wynikiem”, że instalacja mogła zmienić panel, Home Assistant nie mógł zweryfikować wyniku lub nie może dowieść, że kontynuacja jest bezpieczna, nie zdołał ustalić, jak daleko dotarł panel, więc zatrzymuje się zamiast zgadywać. Nie ponawiaj jeszcze automatycznej instalacji. Najpierw obejrzyj panel: jeśli widoczny jest ekran konfiguracji Panel Assistant lub pulpit albo aplikacja otwiera się z listy aplikacji panelu, wykonaj powyższą sekcję, aby ją połączyć. Jeśli Panel Assistant nie ma na panelu, zapytaj w [zgłoszeniach integracji](https://github.com/panel-assistant/ha-integration/issues) i dołącz model panelu, wybraną wersję, pełny komunikat oraz wiersze dziennika Home Assistant z instalacji (wyszukaj w dzienniku `panel_assistant`).

## Sprzętu panelu brakuje w Home Assistant

Jeśli część encji się pojawia, a inne nie, zwykle odpowiada za to profil sprzętowy modelu, a nie problem połączenia. [Strony sprzętu](/pl/hardware/) opisują, co udostępnia każdy panel.

## Coś innego

Jeśli odpowiedzi nie ma na tej stronie ani w podlinkowanej dokumentacji technicznej, zapytaj w [zgłoszeniach integracji](https://github.com/panel-assistant/ha-integration/issues) lub, w sprawach samej aplikacji panelu, w [zgłoszeniach ha-paneld](https://github.com/panel-assistant/android/issues). Podaj model panelu, wersję ze strony urządzenia panelu i pobraną diagnostykę, ponieważ każda odpowiedź zacznie się od tych trzech rzeczy. Diagnostyka ma już ukryte dane wrażliwe, ale przed publicznym opublikowaniem przeczytaj ją i usuń pozostałe informacje identyfikujące panel, sieć lub konfigurację Home Assistant.
