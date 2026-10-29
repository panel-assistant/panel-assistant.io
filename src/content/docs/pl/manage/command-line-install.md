---
title: Skrypt instalacyjny (wycofany)
description: Instalator wiersza poleceń nie instaluje już ani nie aktualizuje paneli. Czego używać zamiast niego i jak usunąć ha-paneld z panelu.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Instalator wiersza poleceń został usunięty. Dodawaj i aktualizuj panele przez Panel Assistant w Home Assistant.

Zamiast niego dodawaj i aktualizuj panele z [Home Assistant](/pl/install/installing-ha-paneld/) za pomocą Panel Assistant. Panel zainstalowany skryptem nadal działa. Dodaj go do Panel Assistant: zostanie połączony, a nie ponownie zainstalowany, a Panel Assistant będzie następnie oferować jego aktualizacje.

## Udostępnianie ADB w sieci

Na niektórych panelach Tuya TPA10 i Smatek ADB początkowo działa tylko przez USB. Podłącz kabel USB i włącz sieciowe ADB, zanim dodasz panel w Home Assistant:

```sh
adb devices                   # accept the on-screen RSA prompt if shown
adb root                      # if this firmware supports it
adb tcpip 5555                # expose adb on the network; this resets on reboot
adb connect 192.168.1.50:5555 # replace this address with the panel's address
```

## Usuwanie ha-paneld z panelu

Wybierz opcję panelu **Usuń Panel Assistant z tego panelu** w sekcji **Konfiguruj** w Home Assistant. W wersji 1.0.0-rc1 wybierz, czy Home Assistant ma zapomnieć panel, a następnie wybierz **Prześlij**. W niewydanej wersji 1.0.0-rc2 opcja nazywa się **Usuń z tego panelu**, a pomyślne usunięcie zawsze usuwa jego wpis w Home Assistant. Panel Assistant przywraca własny ekran główny panelu i odinstalowuje aplikację panelu. Najpierw przeczytaj [Zanim usuniesz ha-paneld](/pl/manage/removal-risks/).

## Sposoby dostępu i tryb bezpieczeństwa

Zalecenia profilu sprzętowego mają wyłącznie charakter informacyjny. Wybranie profilu nie jest zgodą na wyłączanie pakietów, utrwalenie ADB, instalację uprzywilejowanego oprogramowania ani zmianę ustawień wyświetlacza. Pakiety ograniczone już na karcie [pakietów producenta](/pl/manage/vendor-packages/) są nadal ograniczane ponownie przy każdym uruchomieniu.

[Wzmocniony tryb bezpieczeństwa](/pl/manage/security-mode/) wymaga, aby osoba przy panelu zatwierdziła wybrane zdalne działania o dużych skutkach. Można go włączyć tylko przy panelu. Gdy jest włączony, nie można używać sieciowego ADB, więc przed instalacją lub aktualizacją przez ADB przywróć przy panelu tryb swobodny.

## Samodzielne kompilowanie

Aplikacja jest wolnym oprogramowaniem o otwartym kodzie źródłowym, a strona [środowiska programistycznego](/pl/reference/development-environment/) opisuje jej kompilowanie.
