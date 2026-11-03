---
title: Adaptieve nabijheidsdetectie en wekken door zwaaien
description: Hoe het paneel zijn nabijheidssensor leert interpreteren, wat het aan Home Assistant doorgeeft en hoe een zwaaibeweging het scherm activeert.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Nabijheidssensoren op Android-wandpanelen hebben geen gemeenschappelijke bruikbare schaal. Sommige geven een afstand door, andere slechts twee waarden, de polariteit kan omgekeerd zijn en meetwaarden in rust kunnen per exemplaar en firmwareversie verschuiven. De paneelapp gebruikt het gekalibreerde model van het actieve sensorprofiel, of een model dat je via de begeleide configuratie opslaat, om de basiswaarde, nabijheidsreferentie en polariteit van de sensor te interpreteren.

![De begeleide configuratie van nabijheidsdetectie op het paneel, bij stap 3 van 7, waarin je wordt gevraagd op je gebruikelijke manier naar het paneel toe te lopen terwijl het aftelt](/screenshots/proximity-setup-screen-480.gif)

## Begeleide configuratie

Open **Configureren** en vervolgens **Aanwezigheid & wekken** om te zien of het actieve sensorprofiel een bruikbaar model heeft. Als configuratie wordt aangeboden, start je daar de begeleide configuratie van nabijheidsdetectie en volg je de instructies op het scherm van het paneel zelf. Deze meet het signaal bij een vrij detectieveld en bewuste handbewegingen; bekijk het resultaat en sla het op het paneel op.

**Profielstandaarden herstellen** vervangt je opgeslagen kalibratie door de standaardwaarden van het sensorprofiel, voor zover beschikbaar. Een sensor zonder bruikbaar model heeft begeleide configuratie nodig voordat activeren via nabijheidsdetectie gereed is. Activeren door aanraking blijft beschikbaar op panelen met een gevalideerde route voor activeren door aanraking.

## Home Assistant-entiteiten

Wanneer het aangeleerde model betrouwbaar is en het actieve hardwareprofiel een bruikbare nabijheidsbron beschikbaar stelt, krijgt het apparaat van het paneel in Home Assistant:

- `binary_sensor.<panel>_proximity`, aangeleerde aanwezigheid dichtbij of ver weg; en
- `sensor.<panel>_proximity_level`, een genormaliseerde waarde van 0 (ver weg) tot 100 (dichtbij) op dezelfde schaal voor elk paneel.

Beide entiteiten blijven onbeschikbaar zolang er onvoldoende bewijs is of de sensor niet goed werkt. Het paneel geeft geen betrouwbaar ogende waarde door uit een model dat het niet vertrouwt. Een sensor die slechts twee waarden doorgeeft, kan nog steeds aanwezigheidsdetectie en gebaren voor het activeren van het scherm bieden. Het niveau wordt alleen doorgegeven als het signaal daar daadwerkelijk geschikt voor is.

## Wekken door zwaaien

**Wekken door zwaaien** gebruikt de naderende hand of het zwaaipatroon dat door het sensorprofiel of de begeleide configuratie is gevalideerd. Een patroon met één hand activeert het scherm zodra de hand nadert; een patroon met twee zwaaibewegingen controleert de gekoppelde bewegingen voordat het scherm wordt geactiveerd. Configuratie en korte signaalschommelingen in rust genereren geen verzoeken om het scherm te activeren.

Hiervoor zijn een actieve nabijheidsbron en een aangeleerd model dat gereed is nodig. De bron kan een gewone Android-sensor zijn of een route die door het hardwareprofiel is gekozen. De webinterface en diagnostiek van het paneel tonen welke route daadwerkelijk wordt gebruikt en of deze gereed is; alleen het vermelden van een sensor in een profiel maakt die nog niet beschikbaar.
