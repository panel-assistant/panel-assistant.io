---
title: Przenoszenie panelu z MQTT
description: Przekazywanie encji panelu z integracji MQTT w Home Assistant do Panel Assistant, z zachowaniem ich identyfikatorów encji, historii i dostosowań.
sourceCommit: fa1d23a12549f2afa3962f9797cd8c52a38db322
---

Do tej pory ekran, diody LED, przyciski i czujniki panelu trafiały do Home Assistant przez integrację MQTT. Panel Assistant może teraz sam przejąć te encje i komunikować się z panelem przez własne połączenie Home Assistant zamiast przez brokera. Obsługa MQTT zostanie usunięta z ha-paneld przed wersją 1.0, po czym panel nie będzie w ogóle potrzebował brokera, a ta strona pokazuje, jak przejść na nowe rozwiązanie wcześniej.

Przenosisz jeden panel naraz i każde przeniesienie można cofnąć. Encje panelu zachowują swoje identyfikatory, historię oraz każdą nazwę, ikonę czy obszar, które im nadałeś, więc pulpity nawigacyjne i automatyzacje, które z nich korzystają, nadal działają.

:::caution[Wczesny dostęp]
Przenoszenie to nowość. Wypróbuj je najpierw na jednym panelu i daj nam znać, jak poszło, na [Discordzie](https://panel-assistant.io/go/discord) albo w [zgłoszeniach](https://github.com/panel-assistant/ha-integration/issues).
:::

## Zanim zaczniesz

- **Panel Assistant 0.3.0 lub nowszy** w Home Assistant, zainstalowany przez HACS zgodnie z opisem w [Instalacja integracji](/pl/home-assistant/custom-integration/).
- **ha-paneld 0.9.8-rc1 lub nowszy** na panelu. To wersja przedpremierowa: na stronie stanu panelu ustaw **Kanał automatycznych aktualizacji ha-paneld** na `prerelease`, a następnie zainstaluj aktualizację z encji aktualizacji panelu w Home Assistant.
- **Panel jest zalogowany do Home Assistant**, a jest, jeśli wyświetla twój pulpit nawigacyjny.
- **Zostaw konfigurację MQTT bez zmian.** Panel nadal używa brokera podczas przenoszenia i nic nie trzeba w nim zmieniać.

## 1. Włącz encje Panel Assistant

Dodaj to do `configuration.yaml`, a następnie uruchom ponownie Home Assistant:

```yaml
panel_assistant:
  native_entities: true
```

Na razie nic się nie przenosi. Każdy panel znany Panel Assistant otrzymuje drugi zestaw encji na swoim urządzeniu Panel Assistant, obok encji MQTT, dzięki czemu można je porównać. Gdy przeniesiesz panel, jego encje MQTT zajmą miejsce tego drugiego zestawu.

## 2. Dodaj panel do Panel Assistant

Pomiń ten krok, jeśli panel jest już widoczny pod Panel Assistant w **Ustawienia**, **Urządzenia oraz usługi**.

Wybierz **Dodaj integrację**, potem **Panel Assistant**, potem **Dodaj panel w swojej sieci** i wpisz nazwę hosta lub adres panelu. Panel Assistant znajdzie już działający ha-paneld i zaproponuje **Połącz z Home Assistant**. Nic na panelu nie jest instalowane ponownie.

## 3. Potwierdź użytkownika panelu

Gdy panel połączy się po raz pierwszy, Home Assistant pokaże naprawę: **Potwierdź użytkownika Home Assistant dla** twojego panelu. Otwórz ją w **Ustawienia**, **Naprawy**, sprawdź, czy wskazany użytkownik to konto, którym loguje się panel, i potwierdź.

Panel sam ponawia próby, więc naprawa może pojawić się dopiero po maksymalnie 15 minutach, a po twoim potwierdzeniu panel może potrzebować tyle samo czasu, żeby się połączyć.

## 4. Przenieś panel

Otwórz wpis Panel Assistant tego panelu w **Urządzenia oraz usługi**, wybierz **Konfiguruj**, ustaw **Sterowanie** na **Panel Assistant** i zapisz.

Wpis zostanie ponownie wczytany, a panel połączy się ponownie. Jego encje MQTT przechodzą do Panel Assistant, a gdy panel potwierdzi przeniesienie, urządzenie MQTT panelu zostaje usunięte. Spodziewaj się, że encje będą przez kilka sekund widoczne jako niedostępne, i jeszcze raz około 30 sekund później, zanim wszystko się ustabilizuje. Dziennik aktywności urządzenia zapełni się zmianami stanu, gdy każda encja będzie się zgłaszać; tak ma być.

Od teraz zmiana ustawienia lub naciśnięcie przycisku w encjach panelu przechodzi przez Panel Assistant. Zanim panel zostanie przeniesiony, te same elementy sterujące odpowiadają, że panel jest sterowany przez MQTT.

### Co nie jest przenoszone

Dwa przyciski MQTT nie mają odpowiednika w Panel Assistant, **Update ha-paneld** i **Update Companion app**, więc zostają usunięte, razem z ewentualną pozostałą encją aktualizacji MQTT dla ha-paneld. Ich zadanie przejmuje encja aktualizacji Panel Assistant tego panelu.

Jeśli nadałeś któremuś z nich własną nazwę, ikonę lub obszar albo go ukryłeś lub wyłączyłeś, Panel Assistant nie usunie go za ciebie. Zamiast tego pokaże go naprawa, a panel zachowa swoje encje MQTT, dopóki nie usuniesz tej encji lub nie wyczyścisz tych ustawień.

## Przenoszenie panelu z powrotem

Otwórz ponownie **Konfiguruj** i ustaw **Sterowanie** na **MQTT wraz z natywnymi raportami do celów porównawczych** albo na **MQTT**. Encje wracają do integracji MQTT z tymi samymi identyfikatorami encji i historią, a panel ponownie ogłasza swoje urządzenie MQTT.

Zawsze przenoś panel z powrotem w ten sposób. Nie usuwaj wpisu Panel Assistant panelu, gdy Panel Assistant nim steruje: Home Assistant przy usuwaniu czyści encje tego wpisu i choć Panel Assistant najpierw je oddaje, dostosowana encja może po drodze stracić nazwę, ikonę lub obszar.

## Znane ograniczenia

- **Niektóre czujniki pozostają niedostępne.** Panel może oferować encje dla czujników, których jego sprzęt nie raportuje, takich jak zbliżenie, temperatura czy wilgotność. To nowe encje Panel Assistant, a nie przeniesione, więc wyłączając je, niczego nie tracisz.
- **Starszy ha-paneld na przeniesionym panelu.** Jeśli przeniesiony panel zostanie później cofnięty do wersji starszej niż 0.9.8-rc1, ponownie ogłosi swoje encje MQTT. Panel Assistant wyłączy duplikaty i zgłosi naprawę **Zaktualizuj ha-paneld**, która zniknie po zaktualizowaniu panelu.
- **Powiadomienia o ponownym uruchomieniu.** Gdy Home Assistant uruchamia się ponownie, panel, którego konto nie jest kontem administratora, nadal dowiaduje się o tym przez MQTT, co jest jeszcze jednym powodem, by na razie nie wyłączać brokera.
