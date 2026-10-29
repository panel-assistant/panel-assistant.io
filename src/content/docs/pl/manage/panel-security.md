---
title: Konto panelu i bezpieczeństwo sieci
description: Wybierz konto Home Assistant używane przez panel i zaplanuj jego dostęp do sieci.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

## Którego konta Home Assistant używa panel?

Gdy dodajesz nowy panel z Panel Assistant, logowanie w przeglądarce zwykle używa konta Home Assistant już zalogowanego na komputerze. Jeśli to konto administratora, panel loguje się jako ten administrator. Panel Assistant nie prosi o hasło ani nie tworzy kolejnego użytkownika Home Assistant. Panel zachowuje własną sesję logowania do Home Assistant, aby ładować pulpit nawigacyjny i komunikować się z Home Assistant jako ten użytkownik.

Możesz używać zwykłego konta, zwłaszcza jeśli instalacja Home Assistant ma tylko jednego użytkownika. Osobny **istniejący** użytkownik jest przydatny, jeśli chcesz oddzielić dostęp panelu od konta administratora. Użytkownik bez uprawnień administratora może korzystać z pulpitów bez dostępu do ustawień Home Assistant. Osobne konto jest opcjonalne; Panel Assistant nie tworzy go podczas konfiguracji.

Home Assistant zapisuje też domyślny pulpit i motyw dla każdego użytkownika. Użytkownik panelu może mieć pulpit ścienny i wygląd bez zmiany ustawień telefonu czy komputera. Wbudowany renderer używa tego domyślnego pulpitu, gdy **Pulpit główny** ma wartość **Auto**; pulpit wybrany w ustawieniach panelu ma pierwszeństwo. Ustawienie **Motyw pulpitu** może żądać trybu jasnego lub ciemnego, ale jawnie wybrany motyw Home Assistant nadal ma pierwszeństwo.

W **Home Assistant → Profil użytkownika → Ogólne** możesz nadać użytkownikowi panelu własne elementy paska bocznego i ich kolejność, język, strefę czasową oraz formaty liczb, daty i czasu. Preferencje paska bocznego mają znaczenie, gdy jest on widoczny; wbudowany renderer przy pierwszym uruchomieniu ukrywa zadokowany pasek boczny. Ukrycie elementu paska bocznego nie ogranicza dostępu do niego. Te ustawienia konta opisuje [przewodnik po profilu użytkownika Home Assistant](https://www.home-assistant.io/docs/configuration/user-configuration/).

### Zmiana logowania panelu

W Home Assistant otwórz **Panel Assistant**, wybierz panel, a następnie otwórz jego kartę **Konfiguracja**. W sekcji **Logowanie przez przeglądarkę** wybierz **Połącz się ponownie** i **Skopiuj link**. Otwórz ten link w prywatnym oknie przeglądarki, zaloguj się do Home Assistant jako istniejący użytkownik, którego ma używać panel, i pozwól przeglądarce wrócić do panelu. Prywatne okno pomaga, gdy zwykła przeglądarka jest już zalogowana jako administrator. Możesz też otworzyć **Konfiguracja** bezpośrednio na panelu i tam rozpocząć logowanie w przeglądarce. Jeśli Home Assistant zgłosi następnie niezgodność użytkownika panelu w **Ustawienia → Naprawy**, potwierdź, że wskazany nowy użytkownik jest tym, którego wybrano.

Aby ukończyć logowanie, przeglądarka musi mieć dostęp zarówno do Home Assistant, jak i do lokalnego adresu panelu. Panel także musi mieć dostęp do Home Assistant. Jeśli otwarto Konfiguracja zdalnie przez Home Assistant, ale przeglądarka nie może połączyć się z lokalnym adresem panelu, dokończ logowanie po połączeniu z siecią panelu lub bezpośrednio na panelu.

## Umieszczenie panelu w osobnej sieci

Panel może korzystać z sieci VLAN bez dostępu do internetu, jeśli zapora nadal pozwala panelowi i Home Assistant komunikować się ze sobą, a przeglądarka w twojej sieci może dotrzeć do panelu, gdy ktoś musi się zalogować. Panel używa lokalnego adresu Home Assistant do logowania i wyświetlania pulpitu. Home Assistant także musi mieć dostęp do panelu w celu zarządzania i aktualizacji.

Panel Assistant może pobrać zweryfikowaną aktualizację aplikacji panelu na maszynę Home Assistant i wysłać ją do panelu przez sieć lokalną. Home Assistant nadal potrzebuje dostępu do źródła aktualizacji. Sprawdzanie wersji przez panel i instalacje uruchamiane przez właściciela z jego karty Instalacja używają GitHub i również wymagają dostępu do internetu. Te kontrole i pobrania nie będą działać w sieci VLAN bez drogi do internetu. W niewydanej wersji 1.0.0-rc2 aktualizacja aplikacji uruchomiona z Home Assistant może też zainstalować zgodny WebView na obsługiwanych panelach. Zaplanuj także obsługiwaną przez panel [drogę aktualizacji WebView](/pl/hardware/guides/update-the-webview/).

Oddzielenie sieci ogranicza urządzenia, które mogą dotrzeć do interfejsu internetowego i API panelu. Nie ogranicza uprawnień konta Home Assistant już zalogowanego na panelu. Jeśli panel używa konta administratora, ta sesja pozostaje sesją administratora nawet w odizolowanej sieci VLAN. Wybierz konto i reguły zapory zgodnie z poziomem zaufania do urządzenia na ścianie i sieci lokalnej.

Interfejs internetowy panelu i zwykłe sterowanie zakładają zaufaną sieć lokalną. Opcjonalny [tryb wzmocniony](/pl/manage/security-mode/) wymaga fizycznego dostępu dla wybranych bezpośrednich żądań LAN o dużych skutkach. Niektóre zwykłe działania administracyjne mogą być wykonywane przez uwierzytelniony pasek boczny Panel Assistant przez administratora Home Assistant; inne chronione operacje nadal wymagają zatwierdzenia na ekranie panelu. Nie zastępuje to oddzielenia sieci ani nie uwierzytelnia każdego żądania API.
