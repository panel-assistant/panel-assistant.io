---
title: Aktualizacja do 1.0
description: Przejście Home Assistant i paneli z Panel Assistant 0.9 do 1.0 oraz znaczenie powrotu do poprzedniej wersji.
sourceCommit: 45ad784a56e8c07917f0c76636d2b389a610b982
---

Panel Assistant 1.0 i aplikacja panelu 1.0 przechodzą na nową wersję razem. Integracja 1.0 komunikuje się tylko z aplikacją panelu 1.0, a aplikacja panelu 1.0 tylko z integracją 1.0, więc żadna nie działa z drugą stroną w wersji 0.9. Najpierw aktualizujesz integrację, potem każdy panel z Home Assistant, a **panel z aplikacją 1.0 nie może wrócić do 0.9**. Zanim zaczniesz, przeczytaj całą stronę. W [informacjach o wydaniu 1.0.0](/pl/release-notes/#panel-assistant-100) znajdziesz wszystkie zmiany.

## Zanim zaczniesz

**Dokończ wszystkie zadania wersji 0.9.0.** Uruchom Panel Assistant **0.9.0** i otwórz **Ustawienia**, **Naprawy**. Panel Assistant 1.0 nie potrafi już przenieść panelu z MQTT ani panelu nadal używającego starej aplikacji ha-paneld, więc pozostawia oba bez zmian. Jeśli 0.9.0 wskazuje którąś z tych sytuacji dla twoich paneli, wykonuj naprawę aż do zakończenia przenoszenia; [przenoszenie panelu z MQTT](/pl/home-assistant/move-from-mqtt/) wyjaśnia część dotyczącą MQTT. Jeśli używasz Panel Assistant starszego niż 0.9.0, najpierw zaktualizuj do 0.9.0 i pozwól mu zakończyć pracę.

**Utwórz kopię zapasową Home Assistant.** W **Ustawienia**, **System**, **Kopie zapasowe** utwórz kopię i zachowaj ją, aż każdy panel będzie działał na 1.0 i będziesz zadowolony z ich działania. To droga powrotu po stronie Home Assistant.

**Zachowaj kopię zapasową każdego panelu.** W interfejsie internetowym każdego panelu otwórz **Instalacja**, następnie **Kopia zapasowa** i zachowaj pobrany plik `.hpb`. Panel Assistant zapisuje też ustawienia panelu przed każdą aktualizacją, ale własna kopia jest tą, którą możesz przywrócić samodzielnie.

## 1. Zaktualizuj integrację

W Home Assistant **2026.11 lub nowszym** zainstaluj aktualizację Panel Assistant przez **Ustawienia**, **Aktualizacje**. W obsługiwanych starszych wersjach, **od 2026.8.3 do 2026.10**, pobierz aktualizację w HACS. Następnie uruchom ponownie Home Assistant, aby wczytać nową integrację, zgodnie z naprawą dotyczącą ponownego uruchomienia lub monitem HACS. [Instalacja integracji](/pl/home-assistant/custom-integration/#updates) wyjaśnia aktualizacje przez Marketplace lub HACS.

## 2. Sprawdź naprawy

Po ponownym uruchomieniu ponownie otwórz **Ustawienia**, **Naprawy**.

- **„… wymaga aplikacji …”** jest oczekiwane dla każdego panelu nadal używającego aplikacji 0.9. Do czasu aktualizacji Home Assistant nie widzi ani nie kontroluje tego panelu, a jego encje są niedostępne. Sam panel nadal działa z własnymi ustawieniami i historią.
- **„… nie może otrzymywać aktualizacji aplikacji”** oznacza, że Panel Assistant nie ma sposobu instalacji na tym panelu, zwykle po zmianie dokonanej na samym panelu, na przykład aktualizacji firmware lub resecie. Ponownie połącz panel z Panel Assistant przez USB, zgodnie z **Dowiedz się więcej** w naprawie, a aktualizacja stanie się dostępna. Nic nie jest usuwane: na panelu mającym już aplikację instalator USB niczego nie instaluje i jedynie przywraca dostęp Panel Assistant do niego.
- **„… nigdy nie został przeniesiony z MQTT”** lub **„… nadal używa starej aplikacji”** oznacza, że przenoszenie nie zostało zakończone w 0.9.0. Zobacz [jeśli przenoszenie nie zostało zakończone](#jeśli-przenoszenie-nie-zostało-zakończone).

## 3. Zaktualizuj jeden panel, a potem pozostałe

Encja aktualizacji każdego panelu w Home Assistant oferuje najnowszą aplikację panelu 1.0. Najpierw zainstaluj ją na jednym panelu i używaj go przez pewien czas przed instalacją na pozostałych, ponieważ ten panel nie może wrócić do poprzedniej wersji. Panel Assistant tworzy kopię ustawień, instaluje aktualizację i potwierdza prawidłowy powrót panelu, zgodnie z [aktualizacjami i odzyskiwaniem](/pl/manage/updates-and-recovery/). Ustawienia są przenoszone z aplikacji panelu 0.9.

## Powrót do poprzedniej wersji

Są dwie części i różnią się od siebie.

**Panel z aplikacją 1.0 pozostaje na 1.0.** Aplikacja panelu odmawia zainstalowania na sobie starszej wersji, Panel Assistant nigdy takiej nie oferuje, a integracja 0.9 nie może się z nią komunikować. Jeśli panel 1.0 działa nieprawidłowo, zajrzyj do [rozwiązywania problemów](/pl/manage/troubleshooting/), a następnie zgłoś problem z [raportem wsparcia](/pl/home-assistant/support-report/), aby można go było naprawić w przyszłym wydaniu.

**Integracja może wrócić do poprzedniej wersji, dopóki żaden panel nie działa na 1.0.** Przywróć kopię zapasową Home Assistant utworzoną przed rozpoczęciem. Cofnie to także wszelkie inne zmiany dokonane w Home Assistant od jej utworzenia. Panele nadal mają aplikację 0.9 i ponownie łączą się z 0.9.0. Gdy choć jeden panel ma aplikację 1.0, przywrócenie kopii pozostawia go poza zasięgiem Home Assistant do czasu ponownej instalacji integracji 1.0.

Nie wracaj przez instalację 0.9.0 na wersję 1.0 przez Marketplace lub HACS. Aktualizacja 1.0 usuwa ustawienie wymagane przez 0.9.0, a bez niego 0.9.0 przekazuje panele już przeniesione z powrotem do MQTT, gdzie aplikacja panelu 1.0 już nie odpowiada. Zamiast tego przywróć kopię zapasową.

<a id="if-a-move-was-not-finished"></a>

## Jeśli przenoszenie nie zostało zakończone

Jeśli 1.0 informuje, że panel nigdy nie został przeniesiony z MQTT lub nadal używa starej aplikacji, wykonaj bezpieczne kroki odzyskiwania opisane w naprawie, aby dokończyć przenoszenie w Panel Assistant 0.9.0, a następnie wróć do 1.0. Nie instaluj 0.9.0 na 1.0 przez Marketplace lub HACS. Dopóki żaden panel nie ma jeszcze aplikacji 1.0, wróć do 0.9.0 przez przywrócenie kopii zapasowej Home Assistant utworzonej przed aktualizacją, z przyczyny opisanej powyżej. Następnie dokończ przenoszenie w 0.9.0 i ponownie rozpocznij tę stronę. Jeśli inne panele mają już aplikację 1.0 lub nie masz kopii sprzed aktualizacji, zapytaj na [Discordzie](https://panel-assistant.io/go/discord) lub w [zgłoszeniach](https://github.com/panel-assistant/ha-integration/issues), zanim cokolwiek zmienisz.

Dla panelu nadal używającego MQTT naprawa oferuje też rozpoczęcie od nowa: usuń urządzenie panelu z integracji MQTT i dodaj panel ponownie. Tworzy to nowe encje i nie zachowuje żadnej historii.
