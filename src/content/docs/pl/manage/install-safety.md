---
title: Bezpieczeństwo instalacji
description: Co Panel Assistant sprawdza przed zmianą panelu, dlaczego przerwaną instalację można bezpiecznie uruchomić ponownie i co zapisuje przed aktualizacją.
sourceCommit: 761d6a72fee28ab8639a6dca9fa60452d2cb5ff7
---

Panel Assistant instaluje i aktualizuje panele z Home Assistant. Zaprojektowano go tak, aby instalacja dawała ten sam wynik zarówno przy pierwszym uruchomieniu, jak i po ponownym uruchomieniu po przerwie. Ta strona opisuje, co sprawdza i co zachowuje.

## Kontrola przed wprowadzeniem zmian

Oba instalatory sprawdzają panel przed jego zmianą. Instalator sieciowy sprawdza, co jest już na panelu, i prosi o potwierdzenie instalacji. Panel, na którym działa już aplikacja panelu, zostaje podłączony zamiast ponownie instalowany. Instalator USB nie nadpisuje innej istniejącej instalacji: jeśli zainstalowana jest już dokładnie wybrana kompilacja, kończy jej konfigurację, a jeśli zainstalowana jest inna kompilacja, ponownie łączy ją z Panel Assistant bez instalowania aktualizacji.

Wydanie pochodzi z Twojego własnego Home Assistant. Home Assistant sprawdza je przed przekazaniem instalatorowi, więc do panelu nie trafia nic, czego Home Assistant nie zweryfikował. [Instalacja przez USB](/pl/install/install-over-usb/) i [Dodawanie panelu](/pl/install/installing-ha-paneld/) opisują obie metody.

## Bezpieczne ponowne uruchomienie

Instalację, która zatrzymała się w połowie, można uruchomić ponownie. Przez USB instalator zapisuje postęp w przeglądarce, przed jakimkolwiek dalszym działaniem sprawdza krok, na którym został przerwany, i kontynuuje od tego miejsca zamiast zaczynać od nowa. W sieci ponowne dodanie panelu pod tym samym adresem sprawia, że Home Assistant jeszcze raz sprawdza panel przed wprowadzeniem zmian. Jeśli aplikacja panelu jest już zainstalowana, Home Assistant ją podłącza i niczego nie instaluje.

Gdy Home Assistant nie potrafi ustalić, jak daleko zaszła instalacja, zatrzymuje się zamiast zgadywać i informuje o tym w komunikacie. [Rozwiązywanie problemów](/pl/manage/troubleshooting/#instalacja-sieciowa-zatrzymała-się-w-trakcie) wyjaśnia poszczególne komunikaty i dalsze kroki.

## Kopia zapasowa przed każdą aktualizacją

Panel Assistant tworzy kopię ustawień panelu przed każdą aktualizacją i przechowuje pięć ostatnich kopii dla każdego panelu. Po aktualizacji potwierdza, że panel ponownie działa prawidłowo.

Przed zmianą, której nie jesteś pewien, a zawsze przed usunięciem aplikacji lub wyczyszczeniem jej danych, samodzielnie utwórz pełną kopię zapasową: w interfejsie internetowym panelu otwórz **Instalacja**, następnie **Kopia zapasowa**, i sprawdź, czy pobrany plik `.hpb` nie jest pusty. Zawiera ustawienia, trwały stan panelu, katalog profili oraz kwalifikujące się dane logowania przechowywane przez osobną aplikację pulpitu. Wyuczony katalog encji oraz historie zbliżenia i oświetlenia otoczenia są tworzone ponownie przez uczenie, zamiast być przywracane. Przywróć kopię przez **Instalacja**, a następnie **Przywracanie**, na tej samej stronie.

## Czego Panel Assistant nie zmienia

Panel Assistant nie wgrywa ponownie oprogramowania układowego panelu, nie nadaje mu uprawnień root i nigdy nie ingeruje w jego firmware. Kopia zapasowa i przywracanie na poziomie firmware na niektórych panelach z rootem to osobna, ręczna czynność, opisana w [kopii zapasowej i przywracaniu firmware](/pl/hardware/guides/firmware-backup-and-restore/). [Aktualizacje i odzyskiwanie](/pl/manage/updates-and-recovery/) opisują, co można odzyskać w razie problemów.
