---
title: Een ondersteuningsrapport begrijpen
description: Lees de gegevens over een mislukte installatie of update van Panel Assistant en deel ze wanneer je om hulp vraagt.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Als een installatie via het netwerk of een update van de paneelapp mislukt, open dan het bijbehorende item onder **Instellingen → Reparaties** in Home Assistant en kies **Ondersteuningsrapport**. Het rapport bewaart de exacte veldnamen en waarden in een kopieerbaar tekstblok. Het begint met `panel_assistant.version` en `panel_assistant.build`, gevolgd door `home_assistant.version` en de Repair ID in `repair.issue_id`. Opgeslagen gebeurtenissen staan onder `events[N]`, waarbij `N` begint bij 0.

Open bij een mislukte [USB-installatie](/nl/install/install-over-usb/) in plaats daarvan de ondersteuningsdetails van het installatieprogramma.

Lees het rapport voordat je het deelt. Het kan een paneeladres, apparaatidentificatoren, releasegegevens en een trace van een uitzondering bevatten. Verwijder alles wat je niet in een openbaar issue wilt zetten. Behoud indien mogelijk de reden van de mislukking en de bijbehorende details; die helpen verklaren wat er is gebeurd.

Voor hulp bij een mislukte installatie of update [open je een issue voor de Home Assistant-integratie](https://panel-assistant.io/go/report-issue) en plak je het rapport in de beschrijving van het issue. Voeg toe wat je aan het doen was, wat je verwachtte en wat er op het paneel gebeurde. Als het paneel bereikbaar is, kan de [diagnostische download](/nl/manage/troubleshooting/) ervan meer context bieden.

## Zo lees je de velden

- `events[N]` geeft opgeslagen gebeurtenissen in volgorde weer, beginnend bij `events[0]`. Een latere gebeurtenis kan het tegenhouden van een nieuwe poging beschrijven in plaats van de oorspronkelijke mislukking.
- `kind` geeft aan of de gebeurtenis afkomstig is van een poging van het type `install`, `update` of `retry_hold`. `at` is, indien aanwezig, het vastgelegde tijdstip.
- `panel` is de weergavenaam of het adres van het paneel; `address` is het netwerkdoel dat Home Assistant heeft gebruikt. `entry_id` identificeert het integratie-item in Home Assistant. `job_id` identificeert een installatiepoging.
- `reason` is het opgeslagen resultaat of de opgeslagen foutmelding. Bij een installatie geeft `receipt.result_code` de algemene uitkomst aan en geeft `receipt.failure_stage` aan welke stap actief was toen de installatie mislukte. Een `receipt.result_subcode` maakt, indien aanwezig, de diagnose specifieker; de waarde ervan kan tussen releases veranderen.
- `target_version` en `artifact.*` beschrijven de release die voor een update is geselecteerd. `receipt.*` bevat het installatiebewijs, inclusief details over het doel en de stappen. `exception` is een technische trace; de laatste regels ervan wijzen vaak op de directe fout.

Het installatieresultaat `authorization_failed` betekent dat Home Assistant geen toestemming kon krijgen om met het paneel te werken. `preflight_rejected` betekent dat het paneel niet door de controles voorafgaand aan de installatie is gekomen. `artifact_rejected` betekent dat het geselecteerde appbestand niet is geaccepteerd. `transport_failed` betekent dat de communicatie met het paneel is mislukt. `install_failed` en `launch_failed` duiden respectievelijk de installatiestap en de stap voor het starten van de app aan. `health_check_failed` betekent dat de app niet door de controle na de installatie is gekomen. `ambiguous_mutation` of `verification_required` betekent dat Home Assistant de toestand van het paneel niet met zekerheid kon vaststellen; inspecteer het paneel voordat je een nieuwe poging doet. Bij een update of een nieuwe poging kan in plaats daarvan een beschrijvende foutmelding in `reason` staan.

## Vraag een AI-assistent om te helpen het rapport te lezen

Kopieer deze prompt en plak daarna je gecontroleerde rapport erachter. Een assistent kan het bewijsmateriaal uitleggen en controles voorstellen, maar kan de huidige toestand van het paneel niet uit alleen het rapport afleiden.

```text
I need help understanding a Panel Assistant support report from Home Assistant Repairs. Panel Assistant is a Home Assistant integration that installs or updates an app on an Android wall panel. The report is a copyable text block with exact dotted field names and values. It starts with panel_assistant.version and panel_assistant.build, followed by home_assistant.version and the Repair ID in repair.issue_id. Saved install, update, or retry-hold events appear under events[N], starting at events[0]. Each event preserves its original fields and installation receipt.

Explain in plain language what happened, in time order. Identify the failure reason, the installation step if receipt.failure_stage is present, and the strongest evidence in the report. Treat receipt.result_subcode as diagnostic detail, not as a guaranteed public error code. Distinguish observed facts from guesses. Suggest safe checks I can make in Home Assistant or on the panel. If the panel's installed state is uncertain, do not suggest reinstalling, clearing data, or retrying until that state is checked. Tell me what information is missing and what to include in a GitHub issue. Do not repeat private addresses or identifiers in your answer.

Support report:
```
