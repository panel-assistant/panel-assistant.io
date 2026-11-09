---
title: Pakiety producenta
description: Odwracalne zatrzymywanie natrętnej aplikacji producenta uruchamianej przy starcie i rysującej nad pulpitem, wyłącznie dla wybranych pakietów.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Aktualizacja firmware może pozostawić na panelu aplikację producenta, która uruchamia się przy starcie i rysuje pływający widżet nad pulpitem. Na przykład aktualizacja firmware Sonoff NSPanel Pro 120 pozostawiła `com.eWeLinkControlPanel` uruchamiający się przy starcie i nakładający widżet sterowania na wszystko, co panel wyświetlał. Aplikacja panelu może neutralizować takie pakiety, ale tylko te, które wskażesz.

## Jak to działa

Dla każdego ograniczanego pakietu aplikacja panelu wykonuje trzy odwracalne, uprzywilejowane działania i powtarza je przy każdym uruchomieniu:

| Krok                                 | Mechanizm                                   | Skutek                                                                            |
| ------------------------------------ | ------------------------------------------- | --------------------------------------------------------------------------------- |
| Wymuszenie zatrzymania               | `am force-stop <pkg>`                       | Natychmiast zatrzymuje aplikację, więc jej widżet od razu znika.                  |
| Wyłączenie uruchamiania przy starcie | `pm disable-user --user 0 <pkg>`            | Zapobiega uruchomieniu przy kolejnym starcie. Odwracalne przez `pm enable <pkg>`. |
| Blokowanie nakładek                  | `appops set <pkg> SYSTEM_ALERT_WINDOW deny` | Odbiera uprawnienie do rysowania pływającego okna nad pulpitem.                   |

Wszystkie trzy wymagają uprawnień, więc funkcja potrzebuje **roota lub [pomocnika roota](https://github.com/panel-assistant/android/blob/main/helper/README.md)**. Działa więc także na panelach izolujących root, takich jak [Tuya TPA10](/pl/hardware/panels/tuya/tpa10/), gdzie działania przechodzą przez polecenia pomocnika `STOP`, `DISABLE` i `OVERLAY`.

## Używanie

Zarządza się tym **w interfejsie internetowym samego panelu**, na karcie **Instalacja**, a nie z Home Assistant. Robisz to raz przy konfiguracji panelu lub po aktualizacji firmware, a nie codziennie, więc nie należy to do pulpitu.

Użyj **Odwiedź** na stronie urządzenia panelu w Home Assistant, otwórz **Instalacja** i znajdź kartę **Pakiety dostawców** (na przykład `http://<panel-ip>:8888/install` przy domyślnym porcie).

Naciśnij **Znajdź pakiet…**, aby otworzyć listę aplikacji panelu, którymi możesz chcieć sterować, pogrupowaną dla łatwiejszego wyboru:

- **Zalecane dla tego panelu**: znane natrętne aplikacje firmware dla twojego sprzętu, będące bezpiecznym pierwszym wyborem. Na panelu ze znanym profilem sprzętowym, takim jak NSPanel Pro, znajduje się tu `com.eWeLinkControlPanel`. Każdy wpis ma **tagi** (na przykład `vendor` dla aplikacji producenta panelu, `chipset` dla fabrycznych i testowych aplikacji producenta układu, `overlay`, `boot`) i krótką **notatkę** autora profilu opisującą pakiet i powód oznaczenia, aby odróżnić nakładkę Sonoff od nieszkodliwej aplikacji testowej Rockchip pozostawionej w obrazie.
- **Inne aplikacje**: aplikacje na panelu, które nie należą do podstawowych składników systemu Android. Na panelu bez znanego profilu to tutaj należy szukać dodatków producenta z pozycją w menu uruchamiania aplikacji lub uprawnieniem do wyświetlania nakładek. Jeśli pakietu nie ma na liście, możesz wpisać jego nazwę bezpośrednio.
- **Największe użycie CPU**: to, co aktualnie najbardziej obciąża CPU. Ograniczaj tylko aplikacje, które rozpoznajesz.

Każdy wpis ma przycisk **Poskrom**. Możesz też wpisać znaną nazwę pakietu bezpośrednio w polu. **Poskrom** działa natychmiast, bez osobnego zapisywania, i jest stosowane ponownie przy każdym uruchomieniu. Ograniczony lub już wyłączony pakiet pokazuje zamiast tego **Włącz ponownie**, co odwraca działanie. Sama karta pokazuje pakiety wybrane do ograniczenia, każdy z przyciskiem **Włącz ponownie**.

Nic nie jest ograniczane, dopóki nie naciśniesz przycisku Poskrom. Bez roota lub pomocnika karta pozostaje widoczna, ale zablokowana, z wyjaśnieniem brakującego dostępu.

## Bezpieczeństwo

- **Odwracalne.** Wyłączenie cofa się przez `pm enable <pkg>` albo aktualizację danej aplikacji lub firmware. Nic tutaj nie jest destrukcyjne: nie ma odinstalowania ani czyszczenia danych.
- **Pakiety krytyczne są odrzucane.** Aplikacja panelu nigdy nie zatrzyma ani nie wyłączy interfejsu systemowego, Ustawień, telefonii, szkieletu Androida ani siebie samej, nawet jeśli je wskażesz. Egzekwują to zarówno aplikacja, jak i uprzywilejowany pomocnik, więc literówka nie może unieruchomić panelu.
- **Zmiany dotyczą tylko zainstalowanych, wskazanych pakietów.** Usunięcie pakietu zarządzanego przez aplikację panelu z listy docelowej ponownie go włącza i przywraca zapisane uprawnienie nakładki. **Włącz ponownie** także cofa ograniczenie.

:::caution
Wybierasz pakiety do wyłączenia, więc ogranicz się do oprogramowania producenta, które rozpoznajesz. Wyłączenie elementu, od którego zależy panel, takiego jak rzeczywiście używany program uruchamiający producenta lub metoda wprowadzania, może utrudnić nawigację, dopóki nie włączysz go ponownie przez `adb`. W razie wątpliwości zostaw go bez zmian.
:::
