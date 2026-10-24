---
title: Dodawanie panelu
description: Dodawanie panelu z poziomu Home Assistant, przez sieć lub przez kabel USB.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Panel dodaje się z poziomu Home Assistant, bez wiersza poleceń. Są dwie ścieżki i obie kończą się tym, że panel pojawia się jako urządzenie.

Niezależnie od tego, którą wybierzesz, najpierw przejdź przez [Przygotowanie panelu](/pl/install/prepare-a-panel/).

## Przez sieć

Dla panelu, który jest już w twojej sieci. Przejdź do **Ustawienia**, **Urządzenia oraz usługi**, dodaj **Panel Assistant** i podaj adres panelu. Integracja sprawdza, co jest na panelu, w razie potrzeby prosi cię o zatwierdzenie prośby o debugowanie na ekranie samego panelu, prosi o potwierdzenie instalacji, instaluje aplikację panelu, uruchamia ją i dopiero wtedy tworzy urządzenie. Jeśli na panelu aplikacja już działa, integracja ją przejmuje, co jest szybsze.

## Przez USB

Dla panelu, który wciąż leży w pudełku albo którego oprogramowanie producenta utrudnia dostęp przez sieć. Podłącz go do laptopa i zainstaluj z przeglądarki przez kabel USB. Przeglądarka pozostaje połączona z Home Assistant, który dostarcza zweryfikowane wydanie; panel nie potrzebuje sieciowego ADB. Zacznij od **Ustawienia**, **Urządzenia oraz usługi**, **Dodaj integrację**, **Panel Assistant**, **Zainstaluj przez USB na tym komputerze**; potrzebna jest przeglądarka oparta na Chromium. Zobacz [Instalacja przez USB](/pl/install/install-over-usb/).

## Przed czym chroni instalator

Obie ścieżki sprawdzają panel, zanim cokolwiek zmienią. Ścieżka sieciowa przejmuje istniejącą aplikację, zamiast instalować ją ponownie. USB nie nadpisuje innej istniejącej instalacji; jeśli zainstalowana jest dokładnie wybrana kompilacja, kończy jej konfigurację. Przerwaną instalację USB można ponowić z tym samym wydaniem, sprawdzając przed kontynuacją, co zostało ukończone. Kopie zapasowe przed aktualizacją aplikacji opisano w [Aktualizacjach i odzyskiwaniu](/pl/manage/updates-and-recovery/).

## Po instalacji

Panel pojawia się jako urządzenie z czujnikiem stanu i diagnostyką, a także na stronie Panel Assistant na pasku bocznym. Następnie kończysz pracę w kreatorze konfiguracji samego panelu, w którym nadajesz mu nazwę i wybierasz pulpit nawigacyjny. Dopóki konfiguracja nie jest ukończona, ekran panelu pokazuje kod QR i przycisk **Skonfiguruj**, więc możesz też dokończyć ją z telefonu lub na samym panelu. Aby później zmienić pulpit nawigacyjny, otwórz stronę stanu panelu w przeglądarce, pod jego adresem na porcie 8888.

Przejdź dalej do [Podłączanie panelu](/pl/home-assistant/connect-a-panel/).
