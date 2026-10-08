---
title: Podłączanie panelu
description: Wyświetlanie pulpitu nawigacyjnego na panelu oraz to, jak własny sprzęt panelu pojawia się w Home Assistant.
sourceCommit: fa1d23a12549f2afa3962f9797cd8c52a38db322
---

Panel dodany do Home Assistant łączy się z nim na dwa sposoby. Pierwszy wyświetla pulpit nawigacyjny na ekranie. Drugi wprowadza własny sprzęt panelu jako encje.

## Pulpit nawigacyjny na ekranie

Otwórz stronę stanu panelu w przeglądarce, pod jego adresem na porcie 8888, i wybierz pulpit nawigacyjny, który chcesz mieć na ścianie. Panel sam ładuje ten pulpit, ustala, które encje są na nim pokazane, i prosi Home Assistant tylko o nie, dzięki czemu działa szybko. Szczegóły tego, jak pulpit jest ładowany i co panel robi, gdy nie uda się go załadować, znajdziesz na stronie o [wbudowanym rendererze](/pl/manage/built-in-renderer/).

## Sprzęt panelu w Home Assistant

Ekran, diody LED, przyciski, czujniki i przekaźniki, które ma twój model, pojawiają się w Home Assistant jako encje urządzenia panelu, więc fizyczny przycisk może uruchomić automatyzację, a dioda LED może pokazywać stan czegokolwiek. To, jakie encje otrzymasz, zależy od profilu sprzętowego danego modelu; [strony o sprzęcie](/pl/hardware/) opisują, co udostępnia każdy panel.

## Strona stanu panelu

Każdy panel udostępnia własną stronę w twojej sieci lokalnej na porcie 8888. To na niej wybierasz pulpit nawigacyjny, wpisujesz dane brokera, sprawdzasz, co robi panel, i czytasz jego raport diagnostyczny. Jest przeznaczona dla zaufanej sieci domowej, więc traktuj dostęp do niej tak samo jak dostęp do samego panelu. [Dokumentacja API](/pl/reference/api/) i [tryb bezpieczeństwa](/pl/manage/security-mode/) opisują, co oferuje ta strona, oraz model zaufania.
