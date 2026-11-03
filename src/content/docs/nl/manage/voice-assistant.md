---
title: Spraakassistent
description: Van de microfoon van een paneel een Home Assistant Assist-satelliet maken, activeringswoorden, pipelines, aankondigingen en problemen oplossen.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Een paneel met microfoon kan dienen als Home Assistant [Assist-satelliet](https://www.home-assistant.io/voice_control/). Het luistert naar een activeringswoord, streamt je opdracht naar Home Assistant en spreekt het antwoord uit via de luidspreker. Je hoeft geen afzonderlijk apparaat toe te voegen: de satelliet is een entiteit `assist_satellite.<panel>` op het bestaande Home Assistant-apparaat van het paneel en de audio gaat via dezelfde verbinding die het paneel al gebruikt.

:::note
De kaart Spraak wordt aangeboden als het apparaatprofiel een microfoon vermeldt, of als Android een ingebouwde microfoon meldt op een paneel waarvan het profiel dit niet specificeert. Een ongeverifieerde microfoon moet door de opnamecontrole van het paneel komen voordat het luisteren begint. Een profiel dat expliciet geen microfoon aangeeft, biedt Spraak niet aan.
:::

## Inschakelen

Spraak staat bij een nieuwe installatie standaard aan als het apparaatprofiel een microfoon vermeldt. Bestaande opgeslagen instellingen blijven behouden. Op andere panelen waar de kaart Spraak wordt aangeboden, zet je **Spraakassistent** aan om hem te gebruiken. Zet hem uit als het paneel niet naar een activeringswoord moet luisteren.

1. Kies **Bezoeken** op de apparaatpagina van het paneel in Home Assistant en open **Configureren** (bijvoorbeeld `http://<panel>:8888/` met de standaardpoort).
2. Zet op de kaart **Spraak** de **Spraakassistent** aan.
3. Vink onder **Activeringswoorden** elk woord aan waarnaar het paneel moet luisteren.
4. Kies onder **Pipelines voor activeringswoorden** welke Assist-pipeline elk aangevinkt woord moet gebruiken.

Als de spraakassistent uit staat, geeft hij zijn microfoontoegang vrij en toont de satellietentiteit in Home Assistant niet beschikbaar. Een andere ingeschakelde functie, zoals kamergeluid van de camera, kan de microfoon nog gebruiken.

## Activeringswoorden en pipelines

Het paneel wordt geleverd met vier activeringswoorden: **Okay Nabu**, **Hey Jarvis**, **Hey Mycroft** en **Alexa**. Meerdere kunnen tegelijk actief zijn, elk met een andere Assist-pipeline. Zo kan het ene activeringswoord in een andere taal antwoorden of een andere gespreksagent gebruiken dan het andere. Laat je een activeringswoord op de standaardinstelling staan, dan gebruikt het de pipeline die Home Assistant op dat moment als voorkeursinstelling behandelt. Wordt een toegewezen pipeline later verwijderd, dan valt dat activeringswoord ook terug op de voorkeurspipeline.

Je kunt actieve activeringswoorden ook vanuit Home Assistant wijzigen: de eigen instellingen van de satelliet, onder **Instellingen > Spraakassistenten** of op de apparaatpagina, tonen dezelfde lijst en schrijven wijzigingen terug naar het paneel. Welke pipeline elk woord gebruikt, stel je op de pagina Configureren van het paneel in.

De detectie van activeringswoorden draait op het paneel zelf, niet in de cloud of op je Home Assistant-server. Het paneel stuurt pas audio naar Home Assistant zodra het een activeringswoord hoort, en alleen zolang spraak-naar-tekst je opdracht nog ontvangt; het stopt zodra Home Assistant meldt dat de opdracht is afgelopen.

Wil je een activeringswoord dat niet in de lijst staat? Zie [Eigen activeringswoorden](/nl/manage/custom-wake-words/).

## Wat het paneel toont

Een kort geluid en een rimpeling markeren het moment waarop het paneel een activeringswoord hoort. Terwijl het luistert, nadenkt of antwoordt, krijgen de schermranden een zachte, langzaam pulserende tint. De kleur geeft aan welke pipeline antwoordt: Panel Assistant kent elke pipeline een kleur toe zodra een paneel die voor het eerst gebruikt en bewaart die koppeling, zodat dezelfde pipeline op elk paneel in huis hetzelfde oogt. Je hoeft hier niets in te stellen.

Stelt de gespreksagent van de pipeline een vervolgvraag, dan begint het paneel vanzelf weer te luisteren, zonder dat je het activeringswoord hoeft te herhalen.

## Aankondigingen en een gesprek starten

Als de spraakassistent aan staat, spreekt `assist_satellite.announce` vanuit elke automatisering of elk script een bericht op het paneel uit, eventueel voorafgegaan door een kort geluid. `assist_satellite.start_conversation` spreekt een openingsbericht uit en luistert vervolgens naar het antwoord; Home Assistant staat dit alleen toe met een gespreksagent die zelf een gesprek kan beginnen, wat de ingebouwde Home Assistant-agent niet kan. Beide diensten vereisen een ingeschakelde spraakassistent; zie [Tekst-naar-spraak](/nl/manage/text-to-speech/#een-aankondiging-afspelen-met-de-spraakassistent-ingeschakeld) voor het eenvoudiger REST-alternatief op panelen zonder microfoon.

## Meerdere assistenten in één kamer

Horen twee satellieten op dezelfde Home Assistant-installatie dezelfde activeringszin binnen twee seconden van elkaar, dan onderdrukt Home Assistant het duplicaat zodat er maar één antwoordt. Dit geldt voor alle satellieten op die Home Assistant-installatie, niet alleen panelen in dezelfde Home Assistant-ruimte. Het geldt dus ook voor een paneel en elke andere satelliet die je al hebt. Wil je kiezen welk apparaat in een gedeelde kamer antwoordt, geef ze dan verschillende activeringswoorden.

## Instellingen

De kaart Spraak heeft naast de woordenlijst enkele afstelopties:

- **Activeringsgevoeligheid:** Laag, Normaal of Hoog. Hoog verlaagt de drempel van het model, zodat het paneel gemakkelijker ontwaakt maar ook vaker onterecht reageert; Laag vereist een duidelijkere overeenkomst.
- **Microfoonversterking (dB):** versterkt alleen de audio die voor transcriptie naar Home Assistant wordt gestuurd, nooit de audio die de activeringswoorddetectie zelf analyseert. Verhoog dit als het activeringswoord betrouwbaar werkt maar opdrachten van de andere kant van de kamer worden gemist of verkeerd verstaan.
- **Audiobron:** de Android-audiobron voor het opnemen met de microfoon. Laat deze op de standaardinstelling (`voice_recognition`) staan, tenzij je ander advies hebt gekregen.

## Problemen oplossen

**Het paneel reageert nooit.** Controleer of **Spraakassistent** aan staat en het uitgesproken woord onder **Activeringswoorden** is aangevinkt. Probeer **Activeringsgevoeligheid: Hoog** en spreek vanaf de plek waar je het paneel gewoonlijk gebruikt, niet vlak naast de microfoon.

**Het reageert maar begrijpt de opdracht niet.** Verhoog **Microfoonversterking (dB)** een beetje en probeer opnieuw; dit beïnvloedt alleen de voor transcriptie verstuurde audio en laat het paneel op zichzelf niet gemakkelijker ontwaken. Train je een eigen activeringswoord, dan registreert het paneellogboek ook bijna-treffers met hun score. Daarmee zie je het duidelijkst of een gemist woord dichtbij kwam of helemaal niet. Zie [Eigen activeringswoorden](/nl/manage/custom-wake-words/#testen-en-afstellen).

**De satellietentiteit is niet beschikbaar.** De spraakassistent staat uit of het paneel is niet via Panel Assistant met Home Assistant verbonden. Schakel de spraakassistent in op de pagina Configureren van het paneel; dat kan niet vanuit Home Assistant.
