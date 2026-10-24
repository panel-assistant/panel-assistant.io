---
title: Przenoszenie panelu z MQTT
description: Przekazywanie encji panelu z integracji MQTT w Home Assistant do Panel Assistant, z zachowaniem ich identyfikatorów encji, historii i dostosowań.
sourceCommit: 8eeaa5fae655155d6bdca33322869afe356ca542
---

Panel Assistant 1.0 korzysta z natywnego połączenia Home Assistant i nie obsługuje MQTT. Jeśli encje twojego panelu nadal korzystają z MQTT, najpierw uruchom Panel Assistant **0.9.0**, aby dokończyć przenoszenie z zachowaniem identyfikatorów encji, historii i dostosowań. Jeśli masz już wersję 1.0, przed zmianą wersji postępuj zgodnie z sekcją [Jeśli przenoszenie nie zostało ukończone](/pl/manage/upgrade-to-1-0/#if-a-move-was-not-finished).

Poniższy przewodnik to historyczne instrukcje dla Panel Assistant od 0.3 do 0.8. Jego opcja **Sterowanie** nie jest dostępna w 1.0.

Przenosisz jeden panel naraz i każde przeniesienie można cofnąć. Encje panelu zachowują swoje identyfikatory, historię oraz każdą nazwę, ikonę czy obszar, które im nadałeś, więc pulpity nawigacyjne i automatyzacje, które z nich korzystają, nadal działają.

:::caution[Wczesny dostęp]
Przenoszenie to nowość. Wypróbuj je najpierw na jednym panelu i daj nam znać, jak poszło, na [Discordzie](https://panel-assistant.io/go/discord) albo w [zgłoszeniach](https://github.com/panel-assistant/ha-integration/issues).
:::

## Zanim zaczniesz

- **Panel Assistant od 0.3.0 do 0.8** w Home Assistant, zainstalowany przez HACS zgodnie z opisem w [Instalacja integracji](/pl/home-assistant/custom-integration/).
- **ha-paneld 0.9.8-rc1 lub nowszy** na panelu. Zainstaluj oferowaną aktualizację z encji aktualizacji Panel Assistant tego panelu w Home Assistant. Jeśli potrzebujesz wersji przedpremierowej, której tam nie ma, wybierz ją na karcie **Instalacja** w interfejsie WWW panelu i sam rozpocznij instalację.
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

Wybierz **Dodaj integrację**, potem **Panel Assistant**, potem **Dodaj panel** i wpisz nazwę hosta lub adres panelu. Panel Assistant znajdzie już działający ha-paneld i zaproponuje **Połącz z Home Assistant**. Nic na panelu nie jest instalowane ponownie.

## 3. Potwierdź użytkownika panelu

Gdy panel połączy się po raz pierwszy, Home Assistant pokaże naprawę: **Potwierdź użytkownika Home Assistant dla** twojego panelu. Otwórz ją przez **Ustawienia**, **Problemy**, sprawdź, czy wskazany użytkownik to konto, którym loguje się panel, i potwierdź.

Panel sam ponawia próby, więc naprawa może pojawić się dopiero po maksymalnie 15 minutach, a po twoim potwierdzeniu panel może potrzebować tyle samo czasu, żeby się połączyć.

## 4. Przenieś panel

Otwórz wpis Panel Assistant tego panelu w **Urządzenia oraz usługi**, wybierz **Konfiguruj**, ustaw **Sterowanie** na **Panel Assistant** i zapisz.

Wpis zostanie ponownie wczytany, a panel połączy się ponownie. Jego encje MQTT przechodzą do Panel Assistant, a gdy panel potwierdzi przeniesienie, urządzenie MQTT panelu zostaje usunięte. Spodziewaj się, że encje będą przez kilka sekund widoczne jako niedostępne, i jeszcze raz około 30 sekund później, zanim wszystko się ustabilizuje. Dziennik aktywności urządzenia zapełni się zmianami stanu, gdy każda encja będzie się zgłaszać; tak ma być.

Od teraz zmiana ustawienia lub naciśnięcie przycisku w encjach panelu przechodzi przez Panel Assistant. Zanim panel zostanie przeniesiony, te same elementy sterujące odpowiadają, że panel jest sterowany przez MQTT.

### Co nie jest przenoszone

Dwa przyciski MQTT nie mają odpowiednika w Panel Assistant, **Update ha-paneld** i **Update Companion app**, więc zostają usunięte, razem z ewentualną pozostałą encją aktualizacji MQTT dla ha-paneld. Aby zaktualizować aplikację panelu, użyj encji aktualizacji Panel Assistant tego panelu.

Jeśli nadałeś któremuś z nich własną nazwę, ikonę lub obszar albo go ukryłeś lub wyłączyłeś, Panel Assistant nie usunie go za ciebie. Zamiast tego pokaże go naprawa, a panel zachowa swoje encje MQTT, dopóki nie usuniesz tej encji lub nie wyczyścisz tych ustawień.

## Przenoszenie panelu z powrotem

Otwórz ponownie **Konfiguruj** i ustaw **Sterowanie** na **MQTT wraz z natywnymi raportami do celów porównawczych** albo na **MQTT**. Encje wracają do integracji MQTT z tymi samymi identyfikatorami encji i historią, a panel ponownie ogłasza swoje urządzenie MQTT.

Zawsze przenoś panel z powrotem w ten sposób. Nie usuwaj wpisu Panel Assistant panelu, gdy Panel Assistant nim steruje: Home Assistant przy usuwaniu czyści encje tego wpisu i choć Panel Assistant najpierw je oddaje, dostosowana encja może po drodze stracić nazwę, ikonę lub obszar.

## Znane ograniczenia

- **Niektóre czujniki pozostają niedostępne.** Panel może oferować encje dla czujników, których jego sprzęt nie raportuje, takich jak zbliżenie, temperatura czy wilgotność. To nowe encje Panel Assistant, a nie przeniesione, więc wyłączając je, niczego nie tracisz.
- **Starszy ha-paneld na przeniesionym panelu.** Jeśli przeniesiony panel zostanie później cofnięty do wersji starszej niż 0.9.8-rc1, ponownie ogłosi swoje encje MQTT. Panel Assistant wyłączy duplikaty i zgłosi naprawę **Zaktualizuj ha-paneld**, która zniknie po zaktualizowaniu panelu.
- **Powiadomienia o ponownym uruchomieniu.** Gdy Home Assistant uruchamia się ponownie, panel, którego konto nie jest kontem administratora, nadal dowiaduje się o tym przez MQTT, co jest jeszcze jednym powodem, by na razie nie wyłączać brokera.
