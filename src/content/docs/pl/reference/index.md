---
title: Dokumentacja techniczna
description: Dokumentacja techniczna aplikacji panelu obejmująca encje Home Assistant, profile urządzeń, założenia bezpieczeństwa i kompilowanie.
sidebar:
  label: Przegląd
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Te strony opisują wewnętrzne działanie aplikacji panelu: udostępniane interfejsy, format profilu opisującego każdy model panelu oraz decyzje dotyczące bezpieczeństwa obu tych elementów. Nie potrzebujesz ich do instalacji ani używania Panel Assistant.

## Interfejsy

- [Sterowanie i dokumentacja Home Assistant](/pl/reference/api/): encje i usługi automatyzujące panel oraz strony i punkty końcowe panelu na jego porcie HTTP (domyślnie 8888).
- [Założenia bezpieczeństwa](/pl/reference/security/): model zaufania, powierzchnia ataku i podjęte decyzje.

## Profile urządzeń

- [Profile paneli ładowane w czasie działania](/pl/reference/profiles/): czym jest profil oraz jak go napisać, przetestować i aktywować.
- [Format profilu i zgodność](/pl/reference/profiles/format/): pełna dokumentacja pól schematu 2.
- [Testowanie profili i rozwiązywanie problemów](/pl/reference/profiles/testing/): etapowa sekwencja testów sprzętu i kroki odzyskiwania.
- [Udostępnianie profili i współpraca](/pl/reference/profiles/sharing/): pochodzenie, bezpieczna wymiana i wymagania dołączania do aplikacji.
- [Architektura profili urządzeń](/pl/reference/profiles/architecture/): jak aplikacja rozpoznaje, dopasowuje i aktywuje profile.
- [Społecznościowe profile paneli](/pl/reference/profiles/community/): profile paneli, których aplikacja nie zawiera.
  - [Echo Show 5 Gen 2 (LineageOS)](/pl/reference/profiles/community/echo-show-5-gen2/)
  - [Lenovo ThinkSmart View (LineageOS)](/pl/reference/profiles/community/lenovo-thinksmart-view/)
  - [Sunworld YC-SM55P](/pl/reference/profiles/community/sunworld-yc-sm55p/)

## Kod

- [Środowisko programistyczne](/pl/reference/development-environment/): zestaw narzędzi, skrypty kompilacji i informacje o podpisywaniu potrzebne autorom forków.
- [Przewodnik po kodzie w DeepWiki](https://deepwiki.com/panel-assistant/android): oprowadzenie po kodzie źródłowym ha-paneld.
