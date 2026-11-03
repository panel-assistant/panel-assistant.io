---
title: Zrozum raport pomocy technicznej
description: Zapoznaj się z informacjami o niepowodzeniu instalacji lub aktualizacji Panel Assistant i udostępnij je, prosząc o pomoc.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Gdy instalacja przez sieć lub aktualizacja aplikacji panelu zakończy się niepowodzeniem, otwórz odpowiadającą jej pozycję w sekcji **Ustawienia → Problemy** w Home Assistant i wybierz **Raport dla pomocy technicznej**. Raport zachowuje dokładne nazwy i wartości pól w bloku tekstu, który można skopiować. Zaczyna się od `panel_assistant.version` i `panel_assistant.build`, po których następują `home_assistant.version` i Repair ID w `repair.issue_id`. Zapisane zdarzenia znajdują się pod `events[N]`, gdzie `N` zaczyna się od 0.

Jeśli nie powiodła się [instalacja przez USB](/pl/install/install-over-usb/), zamiast tego otwórz szczegóły pomocy technicznej w instalatorze.

Przeczytaj raport przed jego udostępnieniem. Może zawierać adres panelu, identyfikatory urządzenia, szczegóły wydania i ślad wyjątku. Usuń wszystko, czego nie chcesz umieszczać w publicznym zgłoszeniu. Jeśli możesz, zachowaj przyczynę niepowodzenia i towarzyszące jej szczegóły — pomagają wyjaśnić, co się stało.

Aby uzyskać pomoc po nieudanej instalacji lub aktualizacji, [otwórz zgłoszenie dotyczące integracji Home Assistant](https://panel-assistant.io/go/report-issue) i wklej raport do treści zgłoszenia. Dodaj opis wykonywanych czynności, oczekiwanego rezultatu i tego, co stało się na panelu. Jeśli panel jest dostępny, [pobranie jego danych diagnostycznych](/pl/manage/troubleshooting/) może dostarczyć więcej kontekstu.

## Jak odczytywać pola

- `events[N]` zawiera zapisane zdarzenia w kolejności, począwszy od `events[0]`. Późniejsze zdarzenie może opisywać wstrzymanie ponownej próby zamiast pierwotnego niepowodzenia.
- `kind` określa, czy zdarzenie pochodzi z próby typu `install`, `update` czy `retry_hold`. `at`, jeśli występuje, zawiera zarejestrowany czas.
- `panel` to wyświetlana nazwa lub adres panelu; `address` to adres docelowy w sieci użyty przez Home Assistant. `entry_id` identyfikuje wpis integracji Home Assistant. `job_id` identyfikuje próbę instalacji.
- `reason` to zapisany wynik lub komunikat o błędzie. W przypadku instalacji `receipt.result_code` określa ogólny wynik, a `receipt.failure_stage` wskazuje, który krok był wykonywany w chwili niepowodzenia. `receipt.result_subcode`, jeśli występuje, zawęża diagnozę; jego wartość może się zmieniać między wydaniami.
- `target_version` i `artifact.*` opisują wydanie wybrane do aktualizacji. `receipt.*` zawiera potwierdzenie instalacji, w tym szczegóły celu i kroków. `exception` to ślad techniczny; jego ostatnie wiersze często wskazują bezpośrednie niepowodzenie.

Wynik instalacji `authorization_failed` oznacza, że Home Assistant nie mógł uzyskać uprawnień do pracy z panelem. `preflight_rejected` oznacza, że panel nie przeszedł kontroli przed instalacją. `artifact_rejected` oznacza, że wybrany plik aplikacji nie został zaakceptowany. `transport_failed` oznacza, że komunikacja z panelem się nie powiodła. `install_failed` i `launch_failed` oznaczają odpowiednio etapy instalacji i uruchamiania aplikacji. `health_check_failed` oznacza, że aplikacja nie przeszła kontroli po instalacji. `ambiguous_mutation` lub `verification_required` oznacza, że Home Assistant nie mógł potwierdzić stanu panelu; sprawdź panel przed kolejną próbą. W przypadku aktualizacji lub ponownej próby w `reason` może zamiast tego pojawić się opisowy komunikat o błędzie.

## Poproś asystenta AI o pomoc w odczytaniu raportu

Skopiuj ten prompt, a następnie wklej po nim sprawdzony przez siebie raport. Asystent może wyjaśnić zawarte w nim dowody i zasugerować, co sprawdzić, ale na podstawie samego raportu nie może zobaczyć aktualnego stanu panelu.

```text
I need help understanding a Panel Assistant support report from Home Assistant Repairs. Panel Assistant is a Home Assistant integration that installs or updates an app on an Android wall panel. The report is a copyable text block with exact dotted field names and values. It starts with panel_assistant.version and panel_assistant.build, followed by home_assistant.version and the Repair ID in repair.issue_id. Saved install, update, or retry-hold events appear under events[N], starting at events[0]. Each event preserves its original fields and installation receipt.

Explain in plain language what happened, in time order. Identify the failure reason, the installation step if receipt.failure_stage is present, and the strongest evidence in the report. Treat receipt.result_subcode as diagnostic detail, not as a guaranteed public error code. Distinguish observed facts from guesses. Suggest safe checks I can make in Home Assistant or on the panel. If the panel's installed state is uncertain, do not suggest reinstalling, clearing data, or retrying until that state is checked. Tell me what information is missing and what to include in a GitHub issue. Do not repeat private addresses or identifiers in your answer.

Support report:
```
