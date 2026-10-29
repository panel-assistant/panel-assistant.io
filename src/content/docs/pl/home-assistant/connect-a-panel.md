---
title: Podłączanie panelu
description: Wyświetlanie pulpitu nawigacyjnego na panelu oraz to, jak własny sprzęt panelu pojawia się w Home Assistant.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel dodany do Home Assistant łączy się z nim na dwa sposoby. Pierwszy wyświetla pulpit nawigacyjny na ekranie. Drugi wprowadza własny sprzęt panelu jako encje.

## Pulpit nawigacyjny na ekranie

Pulpit nawigacyjny wybierasz w kreatorze konfiguracji panelu podczas jego dodawania. Aby zmienić go później, wybierz **Odwiedź** na stronie urządzenia panelu w Home Assistant, aby otworzyć jego stronę stanu, i wybierz inny. Panel sam ładuje ten pulpit. Przy [włączonym filtrowaniu encji](/pl/manage/performance/) uczy się, których encji używa pulpit, i prosi Home Assistant tylko o nie. Szczegóły tego, jak pulpit jest ładowany i co panel robi, gdy nie uda się go załadować, znajdziesz na stronie o [wbudowanym rendererze](/pl/manage/built-in-renderer/).

## Sprzęt panelu w Home Assistant

Ekran, diody LED, przyciski, czujniki i przekaźniki, które ma twój model, pojawiają się w Home Assistant jako encje urządzenia panelu, więc fizyczny przycisk może uruchomić automatyzację, a dioda LED może pokazywać stan czegokolwiek. To, jakie encje otrzymasz, zależy od profilu sprzętowego danego modelu; [strony o sprzęcie](/pl/hardware/) opisują, co udostępnia każdy panel.

## Strona stanu panelu

Wybierz **Odwiedź** na stronie urządzenia panelu w Home Assistant, aby otworzyć jego stronę stanu. Każdy panel udostępnia tę stronę w twojej sieci lokalnej, domyślnie na porcie **8888** (na przykład `http://<panel>:8888/`). To na niej wybierasz pulpit nawigacyjny, sprawdzasz, co robi panel, i czytasz jego raport diagnostyczny. Jest przeznaczona dla zaufanej sieci domowej, więc traktuj dostęp do niej tak samo jak dostęp do samego panelu. [Dokumentacja API](/pl/reference/api/) i [tryb bezpieczeństwa](/pl/manage/security-mode/) opisują, co oferuje ta strona, oraz model zaufania.
