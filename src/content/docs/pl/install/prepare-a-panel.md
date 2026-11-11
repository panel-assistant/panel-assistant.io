---
title: Przygotowanie panelu
description: Co panel musi spełniać, zanim Panel Assistant będzie mógł zainstalować na nim aplikację, oraz aktualizacja WebView, od której zależy, czy pierwszy pulpit nawigacyjny będzie wyglądał dobrze.
sourceCommit: 2ef99e6f646c9c16596e51ebee3c239cce4ec471
---

Zanim dodasz panel, musi być spełniony jeden warunek, a drugi decyduje o tym, czy pierwszy pulpit nawigacyjny będzie wyglądał dobrze. Sposób postępowania zależy od modelu i firmware.

## 1. Opcje programisty i debugowanie są włączone

Instalator komunikuje się z panelem przez interfejs debugowania Androida, który producenci mogą wyłączać lub ograniczać. Na większości paneli otwórz **Ustawienia**, następnie **Informacje** i dotknij **Numer kompilacji** siedem razy, aż panel poinformuje, że jesteś programistą; w Ustawieniach pojawią się wtedy **Opcje programisty**. Niektórzy producenci ukrywają tę opcję lub zmieniają jej nazwę, a [strony o sprzęcie](/pl/hardware/) podają znane kroki i oznaczają niezweryfikowane procedury. W opcjach programisty włącz **debugowanie USB** dla [ścieżki USB](/pl/install/install-over-usb/) albo **sieciowe ADB na porcie TCP 5555** dla ścieżki sieciowej. Nie każdy panel ma przełącznik sieciowego ADB; strona sprzętu twojego modelu mówi, czy go ma, a jeśli nie, użyj ścieżki USB, gdy debugowanie USB będzie dostępne. Jeśli dostęp USB także nie jest zweryfikowany, przed wybraniem któregokolwiek instalatora poproś dostawcę o instrukcje dla twojego modelu i firmware. Dostęp root jest osobną kwestią: polecenie `adb root` zakłada, że debugowanie już działa. Parowane debugowanie bezprzewodowe Androida to inna metoda połączenia, której ten instalator nie obsługuje.

Jeśli panel poprosi o autoryzację połączenia, ktoś musi zaakceptować tę prośbę na ekranie samego panelu; nie da się tego zrobić zdalnie.

Panel nie potrzebuje stałego adresu: Panel Assistant podąża za panelem, którego adres się zmienia.

## 2. Systemowy WebView jest aktualny

Pulpit nawigacyjny rysuje systemowy WebView panelu, nazywany też jego silnikiem przeglądarki. Stary WebView może pozostawić pusty lub częściowo narysowany pulpit.

Zarówno instalator sieciowy, jak i USB mogą zażądać zweryfikowanej, zgodnej aktualizacji silnika przeglądarki na obsługiwanych panelach. Jeśli nie uda się dokończyć aktualizacji, konfiguracja i parowanie pozostają dostępne. Niedokończoną próbę można kontynuować z naprawy aktualizacji panelu w Home Assistant: wybierz **Spróbuj ponownie**. Przed zażądaniem kolejnej próby sprawdza ona dotychczasową pracę; nieudane aktualizacje nie są ponawiane według harmonogramu.

Kreator konfiguracji ostrzega, gdy wbudowany silnik przeglądarki jest za stary. Możesz ukończyć konfigurację i parowanie, ale pulpit nadal może się nie wyświetlać. Jeśli panel nie może zainstalować aktualizacji, wykonaj [Aktualizację systemowego WebView](/pl/hardware/guides/update-the-webview/).

## Zanim zmienisz coś nieodwracalnie

Panel Assistant sam niczego nie flashuje ponownie ani nie rootuje. Niektóre panele można zrootować lub ponownie sflashować ręcznie; część takich zmian da się cofnąć, a części nie. Jeśli idziesz tą drogą, najpierw przeczytaj [zasady bezpiecznej instalacji](/pl/manage/install-safety/), a w [Aktualizacjach i odzyskiwaniu](/pl/manage/updates-and-recovery/) sprawdź, co można zarchiwizować, a czego nie.
