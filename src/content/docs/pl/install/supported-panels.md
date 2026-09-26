---
title: Wybór panelu
description: Panele ścienne z Androidem, które Panel Assistant obsługuje już dziś, co sprawia, że panel dobrze się sprawdzi, oraz jak doprowadzić do obsługi modelu, którego nie ma na liście.
sourceCommit: cb91a53b7fe4ae129274b56dae846d3dcc4a9eff
---

Większość paneli ściennych kupuje się na zagranicznych platformach, mając niewiele więcej niż opis oferty i nadzieję. Ta strona to sprawdzian, który warto zrobić przed zakupem. Każdy wymieniony tu model działa z Panel Assistant, a właściciele potwierdzili wszystkie na prawdziwym sprzęcie, z wyjątkiem rodziny Shelly Wall Display: przetestowano jeden egzemplarz X2i, a reszta rodziny jest udokumentowana i czeka na pierwszy potwierdzony egzemplarz.

:::tip
Każdy model ma własną [stronę sprzętu](/pl/hardware/) ze specyfikacją, informacją o tym, co trafia do Home Assistant, i opisem uruchomienia.
:::

## Obsługa ogólna: każdy inny panel z Androidem

**Panel, którego nie wymieniono na tej stronie, nie jest panelem nieobsługiwanym.** Panel Assistant nie musi rozpoznawać twojego sprzętu, żeby na nim działać. Każdy panel spełniający wymagania opisane niżej startuje z profilem ogólnym, a dla większości osób to już jest panel, jakiego chcieli: pulpit nawigacyjny Home Assistant na ekranie, jasność i uśpienie ekranu, dźwięk, nawigacja oraz standardowe czujniki Androida, takie jak czujnik światła i zbliżeniowy, a wszystko to trafia do Home Assistant jako encje na własnym urządzeniu panelu.

Profil konkretnego modelu dodaje sprzęt właściwy tylko temu modelowi: diody LED RGB, fizyczne przyciski, przekaźniki, moduły radiowe producenta i układy klimatyczne. Wiele paneli nie ma żadnego z nich, a wielu właścicieli nigdy nie potrzebuje tych, które mają. W takich przypadkach profil ogólny nie jest gorszym ustawieniem, które trzeba znosić, dopóki nie pojawi się coś lepszego, tylko pełnym zestawem funkcji.

Kupuj więc według poniższych wymagań, a nie według tej listy, a profil dla konkretnego modelu traktuj jako bonus tam, gdzie istnieje.

## Pełna obsługa

Przetestowane na egzemplarzach, które mamy w rękach, z najpełniejszą obsługą sprzętu: ekranu, diod LED, przycisków, czujników i przekaźników, o ile model je ma.

- **[Sonoff NSPanel Pro](/pl/hardware/panels/sonoff-nspanel-pro/)** (w tym wersje 120 i 86)
- **[Tuya TPA10](/pl/hardware/panels/tuya-tpa10/)**
- **[Electron WF1589T](/pl/hardware/panels/electron-wf1589t/)**

## Sprawdzone przez społeczność

Właściciele używają Panel Assistant na tych modelach. Ich profile powstały na podstawie zgłoszeń właścicieli, a każda strona sprzętu pokazuje dokładnie, który sprzęt panelu trafia do Home Assistant.

- **[ZHICAI SMT1019](/pl/hardware/panels/zhicai-smt1019/)**
- **[ZX-SMT156 / RK3566_T](/pl/hardware/panels/zx-smt156/)**
- **[Smatek S9E](/pl/hardware/panels/smatek-s9e/)**

## Wstępna obsługa

Zbadane na jednym fizycznym egzemplarzu; obsługa sprzętu jest jeszcze potwierdzana.

- **[Shelly Wall Display X2i](/pl/hardware/panels/shelly/wall-display-x2i/)**

## Udokumentowane

Profile napisane na podstawie analizy oprogramowania układowego, gotowe na potwierdzenie na egzemplarzu przez pierwszego właściciela. Jeśli masz taki panel, zgłoszenie to najszybszy sposób, by przesunąć go wyżej na tej stronie.

- [Shelly Wall Display](/pl/hardware/panels/shelly/) X2, X1i i XL

## Co sprawia, że panel dobrze się sprawdzi

- **Android 8.0 lub nowszy.**
- **Opcje programisty.** Instalator korzysta z interfejsu debugowania Androida, który prawie każdy panel pozwala włączyć.
- **Dowolny systemowy WebView.** Producenci często dostarczają silnik przeglądarki przestarzały o kilka lat. Panel Assistant go sprawdza i tam, gdzie panel na to pozwala, instaluje za ciebie sprawdzoną wersję. Resztę opisuje [przygotowanie panelu](/pl/install/prepare-a-panel/).
- **Profil sprzętowy, tylko jeśli chcesz dodatków.** Wszystko powyżej wystarcza do profilu ogólnego. Dopiero profil konkretnego modelu obsługuje diody LED, przyciski, przekaźniki i czujniki właściwe dla modelu, jak opisuje [obsługa ogólna](#obsługa-ogólna-każdy-inny-panel-z-androidem).
- **Root, dla kilku dodatków.** Kilka funkcji na niektórych modelach wymaga roota. Każda strona sprzętu mówi, których to dotyczy i jak go uzyskać.

## Nie ma go na liście?

Obsługa sprzętu to dane, a nie kod, więc nowy panel to nowy profil, a nie nowa kompilacja aplikacji, a najszybszy sposób na obsługę twojego modelu to zgłoszenie go. Napisz w [zgłoszeniach](https://github.com/panel-assistant/android/issues), jaki to model i co się stało, a jeśli masz ochotę, [dokumentacja profili](/pl/reference/profiles/) opisuje, co zawiera profil. Każde zgłoszenie, czy panel działa, czy nie, przybliża projekt do obsługi każdego panelu.
