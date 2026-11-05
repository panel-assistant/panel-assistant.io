---
title: Uzyskiwanie dostępu adb i root
description: Jak uzyskać adb i root na każdym opisanym panelu ściennym, do czego aplikacja panelu używa roota i gdzie znaleźć dokładną procedurę dla modelu.
sidebar:
  label: Dostęp adb i root
  order: 1
sourceCommit: f49bf12954ed3e89e5e32d635b4bbcb06095cf9b
---

Każdy panel udostępnia adb oraz root, jeśli go ma, w inny sposób. Ta strona przedstawia ogólny obraz; dokładne kroki dla konkretnego firmware znajdują się na stronie każdego panelu.

## Do czego służy root

Aplikacja panelu instaluje się i działa bez roota. Root ma znaczenie tylko dla sprzętu, którego Android nie udostępnia zwykłej aplikacji:

- **Sysfs i węzły wejściowe należące do `system`.** Na niektórych panelach dioda LED, podświetlenie przycisków i czujniki klimatu są plikami `system:system`, których aplikacja w piaskownicy nie może zapisywać ani odczytywać. Aplikacja panelu komunikuje się wtedy z małym demonem pomocniczym działającym jako root, `hapaneld-helper`, przez gniazdo Unix. Zobacz [dokumentację pomocnika](https://github.com/panel-assistant/android/blob/main/helper/README.md).
- **Rzeczywiste wyłączanie podświetlenia, ponowne uruchamianie i sterowanie zarządcą CPU.** Bez drogi roota używane są możliwości Androida, na przykład jasność zero zamiast odłączenia zasilania podświetlenia.
- **Przekaźniki i linie GPIO**, gdy panel udostępnia je tylko przez sysfs wymagający roota.

Aplikacja panelu sprawdza każdą uprzywilejowaną drogę w chwili jej użycia, więc panel bez roota nadal oferuje pulpit, standardowe czujniki, jasność i nawigację, a funkcja wymagająca roota jest pokazywana jako niedostępna zamiast kończyć się błędem.

## Drogi dostępu według panelu

- **[Sonoff NSPanel Pro](/pl/hardware/panels/sonoff/#uzyskiwanie-dostępu-adb-i-root).** Kompilacja `userdebug` z kluczami testowymi i **bez hasła adb**. Jedyną przeszkodą jest wejście w tryb programisty, co zależy od firmware eWeLink. Następnie `adb root`, ponowne zamontowanie i instalacja trwałego `su`.
- **[Tuya TPA10](/pl/hardware/panels/tuya/tpa10/#uzyskiwanie-dostępu-adb-i-root).** adb jest **chronione hasłem**. Niezawodna droga prowadzi przez tylne wejście aplikacji diagnostycznej USB, a `su` jest już obecne. Krótki skrypt zapewnia następnie utrzymanie sieciowego adb po ponownych uruchomieniach.
- **[Electron WF1589T](/pl/hardware/panels/electron/wf1589t/#uzyskiwanie-dostępu-adb-i-root).** Kompilacja `userdebug` z Google Play. `adb root` działa bezpośrednio. Dioda LED jest dostępna bezpośrednio dla aplikacji, więc root rzadko jest potrzebny.
- **[Electron WF2489T (ZHICAI SMT1019)](/pl/hardware/panels/electron/wf2489t/#dostęp-root-według-kompilacji-firmware).** Detaliczna kompilacja produkcyjna nie ma roota. Kompilacja `userdebug` dostawcy ma roota, ale wymaga ponownego zamontowania, zanim pomocnik będzie mógł zostać utrwalony.
- **[SMT156](/pl/hardware/panels/electron/smt156/).** W zgłoszonej instalacji brak `su` dostępnego dla aplikacji. Nie przetestowano USB `adb root`, trybu inżynierskiego producenta ani trwałych metod odblokowania.
- **[Smatek S9E](/pl/hardware/panels/smatek/s9e/).** Aplikacja producenta wykonuje polecenia roota, a niektóre egzemplarze mają fabrycznie odblokowany tryb programisty. Zgłaszano `su` na poziomie aplikacji w firmware 1.1.0; dostęp nadal zależy od egzemplarza i firmware.
- **[Shelly Wall Display](/pl/hardware/panels/shelly/).** Na [Wall Display X2i](/pl/hardware/panels/shelly/wall-display-x2i/) przetestowanym z fabrycznym firmware 2.5.4 opcje programistyczne i debugowanie USB odblokowuje się z aplikacji Ustawienia, adb łączy się następnie bez monitu autoryzacji, a roota nie ma: brak `su`, a `adb root` jest niedostępne. Instalacja aplikacji panelu i jej codzienne używanie nie wymagają tam roota, ale uprzywilejowane funkcje na tej stronie go wymagają. Pozostałe modele nie zostały przetestowane; starsze firmware jest przeznaczone dla bazowej kompilacji `userdebug`, więc `adb root` może tam działać, jeśli uda się nawiązać połączenie adb.

## Zanim cokolwiek zmienisz

- Zapewnij niezawodne działanie adb, najlepiej w sieci ze wstępnie autoryzowanym kluczem stacji roboczej, zanim wyłączysz aplikację producenta. Wcześniejsze wyłączenie programu uruchamiającego, ustawień lub aplikacji sprzętowej producenta może pozbawić cię dostępu do panelu.
- Zachowaj sposób nawigacji. Na panelu bez przycisków działania nawigacyjne aplikacji panelu zastępują przyciski Wstecz i Ostatnie producenta.
- Sprawdź, co zmienia aktualizacja producenta, zanim zdecydujesz, czy ją odroczyć: aktualizacje mogą cofnąć zmiany w dostępie, ale także naprawić luki w zabezpieczeniach. Zobacz [Aktualizacje firmware i możliwości](/pl/hardware/firmware/#firmware-updates-and-capabilities) oraz [Zatrzymywanie niechcianych aktualizacji](/pl/hardware/guides/firmware-backup-and-restore/#stop-unwanted-updates).
- Utwórz kopię partycji przed modyfikowaniem firmware na panelu Rockchip z rootem. Zobacz [Kopia zapasowa i przywracanie firmware](/pl/hardware/guides/firmware-backup-and-restore/).
- Niektóre drogi wymagają `adb disable-verity`, co ponownie uruchamia panel. Panel chroniony kodem PIN nie może po restarcie ponownie uruchomić aplikacji, dopóki ktoś nie wpisze kodu, więc bądź przy nim osobiście.

## Potencjalne drogi dostępu w innym firmware

[CVE-2026-43499](https://github.com/CVEProject/cvelistV5/blob/main/cves/2026/43xxx/CVE-2026-43499.json) to luka w jądrze Linuksa umożliwiająca eskalację uprawnień, którą może wykorzystać kod już działający lokalnie. Jest ona kandydatem do zbadania w innych obecnych i przyszłych rodzinach paneli, nie tylko w Meta Portal. Sama wersja jądra nie potwierdza istnienia użytecznej drogi dostępu w kompilacji producenta: trzeba sprawdzić poprawki, konfigurację jądra i ograniczenia urządzenia.

Rozpatruj oddzielnie trzy pytania: czy właściciel może najpierw zainstalować lub uruchomić kod; czy ten kod może uzyskać uprawnienia jądra; i czy aplikacja panelu może korzystać z uzyskanego dostępu, także po ponownym uruchomieniu? Tymczasowe uprawnienia mogłyby pomóc w instalacji, ułatwić korzystanie z ADB, zmienić ustawienia administracyjne lub umożliwić dostęp do sprzętu objętego ograniczeniami. Same w sobie nie zapewniają trwałego dostępu root ani pomocnika dostępnego dla aplikacji.

[Badania nad Meta Portal](/pl/hardware/panels/meta/#cve-2026-43499-and-community-provisioning) to przykład z dokładnie określonymi, zgłoszonymi celami i wyraźnymi ograniczeniami. Nie jest to uniwersalny instalator Panel Assistant ani nowo udostępniona funkcja. Nie ustalono możliwości zastosowania w Shelly ani tego, które kompilacje producentów zawierają poprawki. Zwykła instalacja i codzienne użytkowanie nadal nie wymagają dostępu root tam, gdzie panel je obsługuje.
