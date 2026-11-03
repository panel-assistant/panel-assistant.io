---
title: Panel Assistant jest wymagany
description: Co zrobić, gdy panel informuje, że wymagany jest Panel Assistant, oraz jak przejść z aplikacji panelu w wersji 0.9 do Panel Assistant 1.0.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Na panelu, który wyświetla komunikat **Panel Assistant jest wymagany** wraz z adresem tej strony, działa aplikacja panelu w wersji 0.9, która nie połączyła się jeszcze z integracją Panel Assistant w Home Assistant. Wybór pulpitu i ustawienia panelu nadal znajdują się na panelu. Nie musisz go ponownie instalować ani resetować.

Panel Assistant 1.0 nie może przejąć panelu, na którym nadal działa stara aplikacja ha-paneld lub którego encje sprzętowe nadal korzystają z MQTT. Taki panel przechodzi do wersji 1.0 za pośrednictwem Panel Assistant 0.9.0, który najpierw przeprowadza jego migrację:

1. [Zainstaluj integrację Panel Assistant przez HACS](/pl/home-assistant/custom-integration/). Jeśli na twoim panelu nadal działa stara aplikacja lub panel korzysta z MQTT, wybierz wersję **0.9.0** przed pierwszym ponownym uruchomieniem; jeśli masz już Panel Assistant 1.0, przed zmianą wersji postępuj zgodnie z opisem w sekcji [jeśli migracja nie została ukończona](/pl/manage/upgrade-to-1-0/#if-a-move-was-not-finished). Uruchom ponownie Home Assistant, gdy HACS cię o to poprosi.
2. Jeśli twój panel jest już widoczny w **Ustawienia → Urządzenia oraz usługi → Panel Assistant**, nie trzeba niczego dodawać ponownie. W przeciwnym razie dodaj tam swój **istniejący panel**, używając jego nazwy hosta lub adresu; nie jest to instalacja nowego panelu.
3. Otwórz **Ustawienia → Problemy**. Jeśli Panel Assistant informuje, że na panelu nadal działa stara aplikacja ha-paneld, postępuj zgodnie z instrukcjami w zgłoszonym przez niego problemie, aby przenieść panel do aplikacji Panel Assistant. Jeśli encje sprzętowe panelu nadal korzystają z MQTT, [migracja panelu z MQTT](/pl/home-assistant/move-from-mqtt/) wyjaśnia to przekazanie, które wersja 0.9.0 doprowadza do końca.
4. Jeśli masz zainstalowaną wersję 0.9.0, zaktualizuj ją do 1.0, gdy nie będzie już wyświetlać żadnej migracji dla żadnego z twoich paneli, zgodnie z opisem w sekcji [aktualizacja do 1.0](/pl/manage/upgrade-to-1-0/).

Pomoc w znalezieniu adresu panelu lub sprawdzeniu jego połączenia znajdziesz w sekcjach [Podłączanie panelu](/pl/home-assistant/connect-a-panel/) i [Rozwiązywanie problemów](/pl/manage/troubleshooting/).
