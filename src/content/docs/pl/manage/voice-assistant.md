---
title: Asystent głosowy
description: Mikrofon panelu jako satelita Home Assistant Assist, hasła wybudzania, potoki, komunikaty i rozwiązywanie problemów.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel z mikrofonem może działać jako [satelita Assist](https://www.home-assistant.io/voice_control/) Home Assistant. Nasłuchuje hasła wybudzania, przesyła polecenie do Home Assistant i odczytuje odpowiedź przez głośnik panelu. Nie trzeba dodawać osobnego urządzenia: satelita jest encją `assist_satellite.<panel>` na istniejącym urządzeniu panelu w Home Assistant, a dźwięk płynie przez to samo połączenie, którego panel już używa.

:::note
Karta Głos jest dostępna, gdy profil urządzenia deklaruje mikrofon lub Android zgłasza wbudowany mikrofon na panelu, którego profil tego nie określa. Niezweryfikowany mikrofon musi przejść kontrolę przechwytywania dźwięku panelu przed rozpoczęciem nasłuchiwania. Profil jawnie deklarujący brak mikrofonu nie udostępnia Głosu.
:::

## Włączanie

Przy nowej instalacji głos jest domyślnie włączony, gdy profil urządzenia panelu deklaruje mikrofon. Istniejące zapisane ustawienia są zachowywane. Na pozostałych panelach z kartą Głos włącz **Asystent głosowy**, aby go używać. Wyłącz go, jeśli nie chcesz, aby panel nasłuchiwał hasła wybudzania.

1. Użyj **Odwiedź** na stronie urządzenia panelu w Home Assistant, a następnie otwórz **Konfiguracja** (na przykład `http://<panel>:8888/` przy domyślnym porcie).
2. Na karcie **Głos** włącz **Asystent głosowy**.
3. W **Słowa budzące** zaznacz każde hasło, którego panel ma nasłuchiwać.
4. W **Potoki słów budzących** wybierz potok Assist dla każdego zaznaczonego hasła.

Gdy asystent głosowy jest wyłączony, zwalnia swoje rezerwacje mikrofonu, a encja satelity jest niedostępna w Home Assistant. Inna włączona funkcja, na przykład dźwięk pomieszczenia kamery, może nadal używać mikrofonu.

## Hasła wybudzania i potoki

Panel zawiera cztery hasła wybudzania: **Okay Nabu**, **Hey Jarvis**, **Hey Mycroft** i **Alexa**. Kilka może być aktywnych naraz, a każde może wskazywać inny potok Assist, więc jedno hasło może odpowiadać w innym języku lub przekazywać rozmowę innemu agentowi niż drugie. Pozostawienie domyślnego ustawienia hasła używa potoku aktualnie uznawanego przez Home Assistant za preferowany. Jeśli przypisany potok zostanie później usunięty, hasło również wraca do preferowanego potoku.

Aktywne hasła wybudzania możesz zmieniać także w samym Home Assistant: ustawienia satelity w **Ustawienia > Asystenci głosowi** lub na stronie urządzenia panelu pokazują tę samą listę i zapisują zmiany na panelu. Potok dla każdego hasła ustawia się na stronie Konfiguracja panelu.

Samo wykrywanie hasła działa na panelu, nie w chmurze ani na serwerze Home Assistant. Panel rozpoczyna wysyłanie dźwięku do Home Assistant dopiero po usłyszeniu hasła i tylko tak długo, jak rozpoznawanie mowy nadal odbiera polecenie; kończy wysyłanie, gdy Home Assistant zgłosi zakończenie polecenia.

Chcesz hasło spoza tej listy? Zobacz [własne hasła wybudzania](/pl/manage/custom-wake-words/).

## Co pokazuje panel

Krótki sygnał i rozchodząca się fala oznaczają moment usłyszenia hasła przez panel. Podczas słuchania, myślenia lub odpowiadania krawędzie ekranu przyjmują delikatne, powoli pulsujące zabarwienie. Kolor określa odpowiadający potok: Panel Assistant przypisuje każdemu potokowi kolor przy pierwszym użyciu przez dowolny panel i zachowuje tę parę, więc ten sam potok wygląda tak samo na każdym panelu w domu. Nie ma tu nic do konfigurowania.

Jeśli agent rozmowy potoku zada dodatkowe pytanie, panel sam ponownie rozpoczyna słuchanie, bez potrzeby powtarzania hasła.

## Komunikaty i rozpoczynanie rozmowy

Gdy asystent głosowy jest włączony, `assist_satellite.announce` odczytuje na panelu wiadomość z dowolnej automatyzacji lub skryptu, opcjonalnie poprzedzoną krótkim sygnałem. `assist_satellite.start_conversation` odczytuje komunikat rozpoczynający rozmowę i nasłuchuje odpowiedzi; Home Assistant pozwala na to tylko z agentem rozmowy obsługującym samodzielne rozpoczynanie rozmowy, czego wbudowany agent Home Assistant nie obsługuje. Obie usługi wymagają włączonego asystenta głosowego; [Zamiana tekstu na mowę](/pl/manage/text-to-speech/#play-an-announcement-with-the-voice-assistant-on) opisuje prostszą alternatywę REST na panelach bez mikrofonu.

## Kilku asystentów w jednym pomieszczeniu

Jeśli dwa satelity na tej samej instancji Home Assistant usłyszą to samo hasło w odstępie nie większym niż dwie sekundy, Home Assistant tłumi duplikat, aby odpowiedział tylko jeden. Dotyczy to każdego satelity tej instancji Home Assistant, nie tylko paneli w tym samym obszarze Home Assistant, więc obejmuje też panel i dowolny inny posiadany satelita. Jeśli chcesz wybrać urządzenie odpowiadające we wspólnym pomieszczeniu, nadaj im różne hasła.

## Ustawienia

Karta Głos ma kilka opcji regulacji poza listą haseł:

- **Czułość budzenia:** niska, normalna lub wysoka. Wysoka obniża próg modelu hasła, więc panel wybudza się łatwiej, ale też częściej po fałszywym dopasowaniu; niska wymaga wyraźniejszego dopasowania przed wybudzeniem.
- **Wzmocnienie mikrofonu (dB):** wzmacnia tylko dźwięk wysyłany do Home Assistant do transkrypcji, nigdy dźwięk analizowany przez detektor hasła. Zwiększ je, jeśli hasło niezawodnie wyzwala panel, ale polecenia z drugiego końca pokoju są pomijane lub błędnie rozpoznawane.
- **Źródło dźwięku:** źródło dźwięku Androida używane do przechwytywania mikrofonu. Pozostaw domyślne (`voice_recognition`), chyba że otrzymasz inne zalecenie.

## Rozwiązywanie problemów

**Panel nigdy się nie wybudza.** Potwierdź, że **Asystent głosowy** jest włączony, a wypowiadane hasło zaznaczone w **Słowa budzące**. Spróbuj **Czułość budzenia: wysoka** i mów z miejsca, z którego normalnie używasz panelu, nie tuż przy mikrofonie.

**Wybudza się, ale nie rozumie polecenia.** Nieco zwiększ **Wzmocnienie mikrofonu (dB)** i spróbuj ponownie; wpływa to tylko na dźwięk wysyłany do transkrypcji, więc samo w sobie nie ułatwi wybudzania. Jeśli trenujesz własne hasło, dziennik panelu zapisuje też prawie udane wykrycia wraz z osiągniętym wynikiem, co najprościej pokazuje, czy pominięte hasło było blisko progu, czy daleko od niego. Zobacz [własne hasła wybudzania](/pl/manage/custom-wake-words/#testowanie-i-dostrajanie).

**Encja satelity jest niedostępna.** Asystent głosowy jest wyłączony lub panel nie jest połączony z Home Assistant przez Panel Assistant. Włącz asystenta głosowego na stronie Konfiguracja panelu; nie można go włączyć z Home Assistant.
