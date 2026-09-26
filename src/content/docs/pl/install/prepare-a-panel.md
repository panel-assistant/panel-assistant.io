---
title: Przygotowanie panelu
description: Dwie rzeczy, których panel potrzebuje, zanim Panel Assistant będzie mógł zainstalować na nim aplikację, oraz aktualizacja WebView, od której zależy, czy pierwszy pulpit nawigacyjny będzie wyglądał dobrze.
sourceCommit: e132b3f499b292a1757d97d76675e840a7a25067
---

Zanim dodasz panel, muszą być spełnione dwa warunki, a trzeci decyduje o tym, czy pierwszy pulpit nawigacyjny będzie wyglądał dobrze. Żaden z nich nie wymaga wiersza poleceń.

## 1. Opcje programisty i debugowanie są włączone

Instalator komunikuje się z panelem przez interfejs debugowania Androida, który ma każde urządzenie z Androidem, ale fabrycznie jest on wyłączony. Włączenie go oznacza otwarcie opcji programisty na panelu i włączenie debugowania: **debugowania USB** dla [ścieżki USB](/pl/install/install-over-usb/) albo **debugowania bezprzewodowego**, nazywanego czasem sieciowym ADB, dla ścieżki sieciowej. Dokładna kolejność kroków różni się między modelami i jest opisana na [stronach sprzętu](/pl/hardware/).

Gdy instalator połączy się po raz pierwszy, panel wyświetli na własnym ekranie prośbę o autoryzację. Ktoś musi ją zaakceptować przy panelu; nie da się tego zrobić zdalnie.

## 2. Panel ma stały adres

Przy ścieżce sieciowej nadaj panelowi stały adres albo rezerwację DHCP, żeby adres się nie zmieniał. Tego adresu używasz, żeby dodać panel, a potem, żeby otworzyć własną stronę stanu panelu na porcie 8888. Panelowi zainstalowanemu przez USB możesz nadać adres później.

## 3. Systemowy WebView jest aktualny

Pulpit nawigacyjny rysuje systemowy WebView panelu, a panele często trafiają do sprzedaży z wersją przestarzałą o kilka lat. Stary WebView daje pusty ekran, częściowo narysowany pulpit albo błędy skryptów, które wyglądają jak usterka aplikacji panelu. To zdecydowanie najczęstszy problem przy pierwszym uruchomieniu.

Zaktualizuj go, zanim zaczniesz oceniać cokolwiek innego. Procedura, łącznie z panelami, na których jest to kłopotliwe, jest opisana w [Aktualizacji systemowego WebView](/pl/hardware/guides/update-the-webview/).

## Zanim zmienisz coś nieodwracalnie

Panel Assistant sam niczego nie flashuje ponownie ani nie rootuje. Niektóre panele można zrootować lub ponownie sflashować ręcznie; część takich zmian da się cofnąć, a części nie. Jeśli idziesz tą drogą, najpierw przeczytaj [zasady bezpiecznej instalacji](/pl/manage/install-safety/), a w [Aktualizacjach i odzyskiwaniu](/pl/manage/updates-and-recovery/) sprawdź, co można zarchiwizować, a czego nie.
