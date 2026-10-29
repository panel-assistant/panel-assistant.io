---
title: Aktualizacja do 1.0
description: Przejście Home Assistant i paneli z Panel Assistant 0.9 do 1.0 oraz znaczenie powrotu do poprzedniej wersji.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel Assistant 1.0 i aplikacja panelu 1.0 przechodzą na nową wersję razem. Integracja 1.0 komunikuje się tylko z aplikacją panelu 1.0, a aplikacja panelu 1.0 tylko z integracją 1.0, więc żadna nie działa z drugą stroną w wersji 0.9. Najpierw aktualizujesz integrację, potem każdy panel z Home Assistant, a **panel z aplikacją 1.0 nie może wrócić do 0.9**. Zanim zaczniesz, przeczytaj całą stronę.

## Zanim zaczniesz

**Dokończ wszystkie zadania wersji 0.9.0.** Uruchom Panel Assistant **0.9.0** i otwórz **Ustawienia**, **Naprawy**. Panel Assistant 1.0 nie potrafi już przenieść panelu z MQTT ani panelu nadal używającego starej aplikacji ha-paneld, więc pozostawia oba bez zmian. Jeśli 0.9.0 wskazuje którąś z tych sytuacji dla twoich paneli, wykonuj naprawę aż do zakończenia przenoszenia; [przenoszenie panelu z MQTT](/pl/home-assistant/move-from-mqtt/) wyjaśnia część dotyczącą MQTT. Jeśli używasz Panel Assistant starszego niż 0.9.0, najpierw zaktualizuj do 0.9.0 i pozwól mu zakończyć pracę.

**Utwórz kopię zapasową Home Assistant.** W **Ustawienia**, **System**, **Kopie zapasowe** utwórz kopię i zachowaj ją, aż każdy panel będzie działał na 1.0 i będziesz zadowolony z ich działania. To droga powrotu po stronie Home Assistant.

**Zachowaj kopię zapasową każdego panelu.** W interfejsie internetowym każdego panelu otwórz **Instalacja**, następnie **Kopia zapasowa** i zachowaj pobrany plik `.hpb`. Panel Assistant zapisuje też ustawienia panelu przed każdą aktualizacją, ale własna kopia jest tą, którą możesz przywrócić samodzielnie.

## 1. Zaktualizuj integrację

Wersja 1.0 jest początkowo oferowana jako kandydat do wydania. Otwórz **Ustawienia**, **Urządzenia i usługi**, **HACS** i wybierz urządzenie **Panel Assistant**. Rozwiń wyłączone encje i otwórz **Wersja wstępna**. W jej ustawieniach włącz **Włączone** i wybierz **Aktualizuj**, a następnie włącz przełącznik **Wersja wstępna** w sekcji **Diagnostyka**. Wróć do Panel Assistant w HACS i pobierz kandydata do wydania 1.0. Uruchom ponownie Home Assistant, gdy poprosi o to HACS lub pojawi się naprawa **Uruchom ponownie Home Assistant, aby dokończyć aktualizację Panel Assistant**.

## 2. Sprawdź naprawy

Po ponownym uruchomieniu ponownie otwórz **Ustawienia**, **Naprawy**.

- **„… wymaga aplikacji 1.0.0-rc1”** jest oczekiwane dla każdego panelu nadal używającego aplikacji 0.9. Do czasu aktualizacji Home Assistant nie widzi ani nie kontroluje tego panelu, a jego encje są niedostępne. Sam panel nadal działa z własnymi ustawieniami i historią.
- **„… nie może otrzymywać aktualizacji aplikacji”** oznacza, że Panel Assistant nie ma sposobu instalacji na tym panelu, zwykle po zmianie dokonanej na samym panelu, na przykład aktualizacji firmware lub resecie. Ponownie połącz panel z Panel Assistant przez USB, zgodnie z **Dowiedz się więcej** w naprawie, a aktualizacja stanie się dostępna. Nic nie jest usuwane: na panelu mającym już aplikację instalator USB niczego nie instaluje i jedynie przywraca dostęp Panel Assistant do niego.
- **„… nigdy nie został przeniesiony z MQTT”** lub **„… nadal używa starej aplikacji”** oznacza, że przenoszenie nie zostało zakończone w 0.9.0. Zobacz [jeśli przenoszenie nie zostało zakończone](#jeśli-przenoszenie-nie-zostało-zakończone).

## 3. Zaktualizuj jeden panel, a potem pozostałe

Po opublikowaniu wydania aplikacji panelu 1.0 encja aktualizacji każdego panelu w Home Assistant będzie je oferować. Najpierw zainstaluj je na jednym panelu i używaj go przez pewien czas przed instalacją na pozostałych, ponieważ ten panel nie może wrócić do poprzedniej wersji. Panel Assistant tworzy kopię ustawień, instaluje aktualizację i potwierdza prawidłowy powrót panelu, zgodnie z [aktualizacjami i odzyskiwaniem](/pl/manage/updates-and-recovery/). Ustawienia są przenoszone z aplikacji panelu 0.9.

## Powrót do poprzedniej wersji

Są dwie części i różnią się od siebie.

**Panel z aplikacją 1.0 pozostaje na 1.0.** Aplikacja panelu odmawia zainstalowania na sobie starszej wersji, Panel Assistant nigdy takiej nie oferuje, a integracja 0.9 nie może się z nią komunikować. Jeśli panel 1.0 działa nieprawidłowo, zajrzyj do [rozwiązywania problemów](/pl/manage/troubleshooting/), a następnie zgłoś problem z [raportem wsparcia](/pl/home-assistant/support-report/), aby można go było naprawić w kolejnym kandydacie do wydania.

**Integracja może wrócić do poprzedniej wersji, dopóki żaden panel nie działa na 1.0.** Przywróć kopię zapasową Home Assistant utworzoną przed rozpoczęciem. Cofnie to także wszelkie inne zmiany dokonane w Home Assistant od jej utworzenia. Panele nadal mają aplikację 0.9 i ponownie łączą się z 0.9.0. Gdy choć jeden panel ma aplikację 1.0, przywrócenie kopii pozostawia go poza zasięgiem Home Assistant do czasu ponownej instalacji integracji 1.0.

Nie wracaj przez ponowne pobranie 0.9.0 w HACS na wersję 1.0. Aktualizacja 1.0 usuwa ustawienie wymagane przez 0.9.0, a bez niego 0.9.0 przekazuje panele już przeniesione z powrotem do MQTT, gdzie aplikacja panelu 1.0 już nie odpowiada. Zamiast tego przywróć kopię zapasową.

<a id="if-a-move-was-not-finished"></a>

## Jeśli przenoszenie nie zostało zakończone

Jeśli 1.0 informuje, że panel nigdy nie został przeniesiony z MQTT lub nadal używa starej aplikacji, naprawa prosi o wybranie **Pobierz ponownie** w HACS, wybranie 0.9.0, dokończenie przenoszenia i ponowną instalację 1.0. Nie pobieraj ponownie 0.9.0 na 1.0. Dopóki żaden panel nie ma jeszcze aplikacji 1.0, wróć do 0.9.0 przez przywrócenie kopii zapasowej Home Assistant utworzonej przed aktualizacją, z przyczyny opisanej powyżej. Następnie dokończ przenoszenie w 0.9.0 i ponownie rozpocznij tę stronę. Jeśli inne panele mają już aplikację 1.0 lub nie masz kopii sprzed aktualizacji, zapytaj na [Discordzie](https://panel-assistant.io/go/discord) lub w [zgłoszeniach](https://github.com/panel-assistant/ha-integration/issues), zanim cokolwiek zmienisz.

Dla panelu nadal używającego MQTT naprawa oferuje też rozpoczęcie od nowa: usuń urządzenie panelu z integracji MQTT i dodaj panel ponownie. Tworzy to nowe encje i nie zachowuje żadnej historii.
