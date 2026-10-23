---
title: Przygotowanie panelu
description: Co panel musi spełniać, zanim Panel Assistant będzie mógł zainstalować na nim aplikację, oraz aktualizacja WebView, od której zależy, czy pierwszy pulpit nawigacyjny będzie wyglądał dobrze.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Zanim dodasz panel, musi być spełniony jeden warunek, a drugi decyduje o tym, czy pierwszy pulpit nawigacyjny będzie wyglądał dobrze. Żaden z nich nie wymaga wiersza poleceń.

## 1. Opcje programisty i debugowanie są włączone

Instalator komunikuje się z panelem przez interfejs debugowania Androida, który ma każde urządzenie z Androidem, ale fabrycznie jest on wyłączony. Na większości paneli otwórz **Ustawienia**, następnie **Informacje** i dotknij **Numer kompilacji** siedem razy, aż panel poinformuje, że jesteś programistą; w Ustawieniach pojawią się wtedy **Opcje programisty**. Niektórzy producenci ukrywają tę opcję lub zmieniają jej nazwę, a [strony o sprzęcie](/pl/hardware/) pokazują dokładną kolejność kroków dla każdego modelu. W opcjach programisty włącz **debugowanie USB** dla [ścieżki USB](/pl/install/install-over-usb/) albo **sieciowe ADB na porcie TCP 5555** dla ścieżki sieciowej. Nie każdy panel ma przełącznik sieciowego ADB; strona sprzętu twojego modelu mówi, czy go ma, a jeśli nie, użyj ścieżki USB. Parowane debugowanie bezprzewodowe Androida to inna metoda połączenia, której ten instalator nie obsługuje.

Jeśli panel poprosi o autoryzację połączenia, ktoś musi zaakceptować tę prośbę na ekranie samego panelu; nie da się tego zrobić zdalnie.

Panel nie potrzebuje stałego adresu: Panel Assistant podąża za panelem, którego adres się zmienia.

## 2. Systemowy WebView jest aktualny

Pulpit nawigacyjny rysuje systemowy WebView panelu, a panele często trafiają do sprzedaży z wersją przestarzałą o kilka lat. Stary WebView daje pusty ekran, częściowo narysowany pulpit albo błędy skryptów, które wyglądają jak usterka aplikacji panelu. To zdecydowanie najczęstszy problem przy pierwszym uruchomieniu.

Zaktualizuj go, zanim zaczniesz oceniać cokolwiek innego. Procedura, łącznie z panelami, na których jest to kłopotliwe, jest opisana w [Aktualizacji systemowego WebView](/pl/hardware/guides/update-the-webview/).

## Zanim zmienisz coś nieodwracalnie

Panel Assistant sam niczego nie flashuje ponownie ani nie rootuje. Niektóre panele można zrootować lub ponownie sflashować ręcznie; część takich zmian da się cofnąć, a części nie. Jeśli idziesz tą drogą, najpierw przeczytaj [zasady bezpiecznej instalacji](/pl/manage/install-safety/), a w [Aktualizacjach i odzyskiwaniu](/pl/manage/updates-and-recovery/) sprawdź, co można zarchiwizować, a czego nie.
