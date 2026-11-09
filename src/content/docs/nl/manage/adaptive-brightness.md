---
title: Adaptieve helderheid
description: Laat het paneel het licht in zijn ruimte leren kennen en zelf de schermhelderheid instellen, zonder automatisering in Home Assistant.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Adaptieve helderheid is een optionele regeling op het paneel die het normale patroon van het omgevingslicht leert kennen en het scherm aanpast zonder automatisering in Home Assistant. Deze staat standaard uit. De gebruikelijke helderheidsregeling, handmatig of via Home Assistant, is beschikbaar ongeacht of de adaptieve regeling aan of uit staat.

![Het tabblad Configureren van de webinterface van het paneel, met de kaart Weergave waarop de omgevingslichtbron, Automatische helderheid, Minimumniveau, Gevoeligheid en de grafiek voor het leren van het dagelijkse omgevingslicht worden getoond](/screenshots/ui-configure-dark.png)

## Kies de lichtbron

Open **Configureren**, vervolgens **Weergave**, en kies **Omgevingslichtbron**:

- Laat dit leeg om de eigen lichtsensor van het paneel te gebruiken, wanneer zowel het actieve hardwareprofiel als de live controle van de mogelijkheden van het paneel zo'n sensor beschikbaar stellen.
- Selecteer één entiteit voor verlichtingssterkte in Home Assistant wanneer het paneel zelf geen geschikte sensor heeft, of wanneer een sensor elders in de ruimte het licht dat mensen daadwerkelijk zien beter weergeeft.

Een bron in Home Assistant wordt uitgelezen via één abonnement op die ene entiteit, in plaats van via de volledige stroom van toestanden. Als geen van beide bronnen beschikbaar is, laat de paneelapp de adaptieve regeling onbeschikbaar in plaats van een schatting te maken op basis van het tijdstip.

Wanneer een entiteit voor verlichtingssterkte in Home Assistant de bron is, kan het paneel zijn aangeleerde patroon een beginbasis geven met maximaal zeven dagen aan bestaande geschiedenis van die entiteit. Dit geeft de automatische helderheid een bruikbaar startpunt, zonder te hoeven wachten tot er voldoende nieuwe metingen zijn verzameld. Hiervoor moet de geschiedenis van de entiteit worden vastgelegd en moet de geschiedenisservice van Home Assistant beschikbaar zijn; als er geen bruikbare geschiedenis wordt teruggegeven, begint het leren gewoon met nieuwe metingen.

## Schakel de regeling in en stel deze af

Schakel **Automatische helderheid** in op dezelfde kaart Weergave. De regeling bewaart maximaal zeven dagen aan geschiedenis van het omgevingslicht op het paneel en leert het normale patroon voor elk tijdstip van de dag. Een korte stijging boven dat patroon, bijvoorbeeld wanneer een lamp in de ruimte wordt aangezet, kan het voorgestelde niveau boven het basisniveau verhogen.

**Minimumniveau** bepaalt het laagste niveau dat de automatische regeling zal voorstellen en schaalt het aangeleerde bereik opnieuw tussen **Minimumniveau** en **Maximaal niveau**. Het is instelbaar van 4% tot 99%. De ondergrens van 4% komt overeen met het eigen minimum van de achtergrondverlichting (deze gaat nooit helemaal uit), dus een lagere waarde zou de bediening wel verplaatsen, maar niets aan het scherm veranderen. Dit beperkt de handmatige helderheid niet; die kan nog steeds lager worden ingesteld.

**Maximaal niveau** begrenst de automatische helderheid, van 5% tot 100%, boven het geselecteerde minimum. Dit beperkt de handmatige helderheid niet.

**Gevoeligheid** bepaalt hoeveel van een afwijking van het aangeleerde patroon op het scherm wordt toegepast, zodra de regeling heeft vastgesteld dat de afwijking echt is. Bij 0% negeert de regeling de afwijking en gebruikt deze alleen het aangeleerde patroon. Lagere waarden geven een stabielere reactie, en de standaardwaarde van 50% laat evenveel ruimte om in beide richtingen bij te stellen. Dit is geen regeling die het licht direct volgt: op een korte toename van het licht wordt pas gereageerd als deze lang genoeg heeft aangehouden of sterk genoeg is gestegen om mee te tellen. Tijdens de eerste opwarmfase volgt het scherm het afgevlakte gemeten licht, ongeacht Gevoeligheid; de instelling wordt van kracht terwijl het model verder leert.

De grafiek over zeven dagen toont een voorbeeld van het waargenomen bereik, het aangeleerde basisniveau en het voorgestelde niveau, voordat of terwijl de regeling actief is. Niet-opgeslagen wijzigingen in Minimumniveau, Maximaal niveau en Gevoeligheid worden in het voorbeeld weergegeven zonder de opgeslagen geschiedenis te herschrijven.

De geschiedenis hoort bij de geselecteerde bron en bij een globale context van ruimte en tijd die is afgeleid van de locatie en tijdzone in Home Assistant. Een wezenlijke wijziging van locatie, tijdzone of bron begint een afzonderlijke geschiedenis, in plaats van stilzwijgend toe te passen wat in een andere context is aangeleerd.

## Handmatige wijzigingen en herstel

Een handmatige wijziging van de helderheid legt voor vier uur een tijdelijke voorkeur vast, zodat de regeling niet meteen ingaat tegen degene die de helderheid heeft gewijzigd. Automatische wijzigingen beginnen met 20% invloed en krijgen gedurende een geleidelijke overgang van vier uur de volledige controle terug. Selecteer **Volledig automatisch hervatten** om de voorkeur direct te beëindigen in plaats van op de overgang te wachten.

Selecteer **Geleerde geschiedenis resetten** nadat je het paneel hebt verplaatst of de lichtbron hebt gewijzigd, of wanneer de afgelopen week niet langer representatief is voor de ruimte. Na bevestiging verwijdert dit de zeven dagen aan geschiedenis van het omgevingslicht voor de huidige bron en context en begint het leren opnieuw. Dit verandert de geselecteerde bron of de instelling Automatische helderheid niet.

Adaptieve helderheid gebruikt de normale instelling voor schermhelderheid van Android en heeft geen roottoegang nodig. Het uitlezen van de lichtsensor van een bepaald paneel kan nog steeds afhangen van de manier waarop die sensor op die hardware wordt benaderd; het actieve profiel en de live controle van de mogelijkheden bepalen dit.

## Bediening via Home Assistant

Waar het paneel deze beschikbaar stelt, schakelt `switch.<panel>_auto_brightness` dezelfde regeling in en uit. De schermhelderheid blijft op `light.<panel>_screen`, zodat een helderheidswijziging vanuit Home Assistant dezelfde tijdelijke voorkeur vastlegt als een wijziging op het paneel. Gebruik **Volledig automatisch hervatten** op de pagina Configureren om direct terug te keren naar het aangeleerde niveau.
