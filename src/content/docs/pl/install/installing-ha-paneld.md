---
title: Dodawanie panelu
description: Dodawanie panelu z poziomu Home Assistant, przez sieć lub przez kabel USB.
sourceCommit: e132b3f499b292a1757d97d76675e840a7a25067
---

Panel dodaje się z poziomu Home Assistant, bez wiersza poleceń. Są dwie ścieżki i obie kończą się tym, że panel pojawia się jako urządzenie.

Niezależnie od tego, którą wybierzesz, najpierw przejdź przez [Przygotowanie panelu](/pl/install/prepare-a-panel/).

## Przez sieć

Dla panelu, który jest już w twojej sieci. Przejdź do **Ustawienia**, **Urządzenia oraz usługi**, dodaj **Panel Assistant** i podaj adres panelu. Integracja sprawdza, co jest na panelu, za pierwszym razem prosi cię o zatwierdzenie prośby o debugowanie na ekranie samego panelu, instaluje aplikację panelu, uruchamia ją i dopiero wtedy tworzy urządzenie. Jeśli na panelu aplikacja już działa, integracja ją przejmuje, co jest szybsze.

## Przez USB

Dla panelu, który wciąż leży w pudełku albo którego oprogramowanie producenta utrudnia dostęp przez sieć. Podłącz go do laptopa i zainstaluj z przeglądarki, a nic nie przechodzi przez twoją sieć. Uruchamia się to ze strony Panel Assistant na pasku bocznym i wymaga przeglądarki opartej na Chromium. Zobacz [Instalacja przez USB](/pl/install/install-over-usb/).

## Przed czym chroni instalator

Obie ścieżki sprawdzają panel, zanim cokolwiek zmienią, i odmawiają instalacji na istniejącej instalacji, zamiast ryzykować to, co na nim jest. Ścieżka sieciowa robi migawkę danych panelu, zanim wprowadzi zmianę. Jeśli instalacja zostanie przerwana, można ją uruchomić ponownie, a przed kontynuacją sprawdzi każdy niedokończony krok. [Zasady bezpiecznej instalacji](/pl/manage/install-safety/) opisują dokładnie, co jest chronione i kiedy instalator się zatrzymuje.

## Po instalacji

Panel pojawia się jako urządzenie z czujnikiem stanu i diagnostyką, a także na stronie Panel Assistant na pasku bocznym. Panel udostępnia też w twojej sieci własną stronę stanu na porcie 8888 i to tam wskazujesz mu pulpit nawigacyjny. Do tego czasu ekran panelu pokazuje ten adres wraz z kodem QR i przyciskami do konfiguracji lub otwarcia pulpitu nawigacyjnego.

![Ekran oczekiwania panelu przed konfiguracją, z adresem konfiguracji, kodem QR oraz przyciskami Konfiguracja i Pulpit nawigacyjny](asset:standing-screen.png)

Przejdź dalej do [Podłączanie panelu](/pl/home-assistant/connect-a-panel/).

## Inne sposoby

Jest też [instalator z wiersza poleceń](/pl/manage/command-line-install/) dla osób, które wolą takie narzędzie; to z niego korzystał projekt, zanim powstała integracja. Nie jest ci potrzebny.
