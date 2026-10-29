---
title: De snelheidsrace
description: Twee identieke wandpanelen, hetzelfde dashboard en dezelfde aanrakingen op hetzelfde moment. Het ene draait de Home Assistant Companion-app zoals het paneel wordt geleverd; het andere draait Panel Assistant. Gemeten, gefilmd en waarom vertraging belangrijker is dan de stopwatch.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Twee Sonoff NSPanel Pro 86-panelen naast elkaar op dezelfde Home Assistant, elk met een identieke kopie van hetzelfde dashboard. Een script raakt beide schermen op hetzelfde moment aan, pagina na pagina. Een klok onder elk paneel stopt wanneer dat scherm heeft gereageerd. Het linkerpaneel draait de Home Assistant Companion-app op de webengine die met de firmware wordt geleverd. Het rechterpaneel draait Panel Assistant op de webengine die het zelf installeert. Daarna wisselen de panelen van rol en begint de race opnieuw, zodat de eigen snelheid van geen van beide panelen het resultaat kan vertekenen.

## Tekenen: ongeveer tweemaal zo snel

![Film A: het eerste paneel met de Companion-app en het tweede met Panel Assistant, op hetzelfde moment in de race](/screenshots/drag-race-film-a.gif)

Zeven aanrakingen: drie paginawisselingen, terug naar de startpagina en drie tikken op een lichtkaart. Drie runs in elke richting; de films tonen de middelste run en de panelen wisselen tussen de films van rol.

|                                              | Companion-app, webengine van de firmware | Panel Assistant, eigen webengine |
| -------------------------------------------- | ---------------------------------------- | -------------------------------- |
| Eerste opstelling, mediaan van drie runs     | 11.7 s                                   | 6.4 s                            |
| Tweede opstelling, panelen gewisseld         | 14.3 s                                   | 6.1 s                            |
| Processorgebruik van de tekenprocessen       | 1.3 tot 1.5 kernen                       | 0.4 tot 0.6 kernen               |
| Beeldsnelheid van de dashboardpagina in rust | 5 beelden per seconde                    | 59 beelden per seconde           |
| Entiteiten die de pagina volgt               | 4,118                                    | 54                               |

De dashboardpagina onder Panel Assistant volgt alleen de entiteiten die ze toont. Onder de Companion-app ontvangt ze elke toestandswijziging in huis, duizenden entiteiten, en besteedt ze het grootste deel van haar tijd aan verwerking daarvan. Daarom tekent dezelfde pagina op het ene paneel met vijf beelden per seconde en op het andere met zestig, en gebruiken de tekenprocessen tweeënhalf keer zoveel processorkracht.

![Film B: de panelen gewisseld, het tweede met de Companion-app en het eerste met Panel Assistant](/screenshots/drag-race-film-b.gif)

## Vertraging: het echte probleem

Tweemaal zo snel op een stopwatch is een bescheiden verbetering. Dat is niet wat je aan de muur merkt. Je merkt het moment waarop je op een knop drukt en er niets gebeurt.

Je drukt. Je verwacht verandering. Na meer dan een halve seconde zonder reactie denk je dat je miste en druk je opnieuw. Nu komen beide aanrakingen aan: het licht gaat aan en meteen weer uit, of de gevraagde pagina verschijnt en wordt vervangen door die van je tweede druk. Je deed alles goed en kreeg het tegenovergestelde. Zo’n paneel is niet traag; het is onbruikbaar, en na een week vertrouwt niemand in huis het meer.

![De dubbele druk: dezelfde tik op hetzelfde licht op beide panelen, met de menselijke regel om na een seconde zonder reactie opnieuw te tikken](/screenshots/drag-race-double-press.gif)

Dezelfde twee panelen, dezelfde lichtkaart, het licht op beide uit. Een vinger tikt op het licht en volgt de regel die iedereen volgt: is na een seconde niets veranderd, tik dan opnieuw, tot drie keer.

|                                      | Companion-app, webengine van de firmware                     | Panel Assistant, eigen webengine |
| ------------------------------------ | ------------------------------------------------------------ | -------------------------------- |
| Licht zichtbaar aan na de eerste tik | 15.2 s, na drie tikken                                       | 0.3 s, na één tik                |
| De andere twee opnamen               | 7 s na één tik; pagina nog aan het laden, drie tikken, niets | 0.3 s na één tik, elke keer      |

Vijftien seconden is geen traag paneel. Het is een paneel dat je hebt opgegeven en waarvan je bent weggelopen, waarna achter je het licht aangaat. De pagina onder de Companion-app was niet kapot: ze was op een vierkernpaneel bezig de toestandsstroom van het hele huis te verwerken en de aanraking wachtte achter dat werk op haar beurt. De pagina van Panel Assistant hoefde alleen haar eigen entiteiten bij te houden, dus werd de aanraking meteen afgehandeld.

## Hoe het is gemeten

- Twee Sonoff NSPanel Pro 86-panelen (vierkern Rockchip PX30, schermen van 480 bij 480) op één Home Assistant-productie-installatie met ongeveer 4,100 entiteiten en zo’n 20 toestandswijzigingen per seconde.
- Twee kopieën van één dashboard, identiek op het licht achter één kaart na, zodat de panelen nooit om één entiteit strijden.
- De Companion-app 2026.6.5 op de eigen webengine van de firmware, Chromium 107, wat de meeste geïnstalleerde panelen nog draaien. Panel Assistant op Chromium 138, de compatibele webengine die voor deze runs is gebruikt.
- Aanrakingen op beide panelen op hetzelfde moment als ruwe schermgebeurtenissen ingevoerd. Elke stap door het paneel zelf vastgelegd; de klok loopt van de aanraking totdat het scherm niet meer verandert. Een stap die aan het einde van de clip nog verandert, maakt de run ongeldig.
- Drie runs in elke richting, de middelste run gefilmd. Een muziekkaart die songteksten van internet ophaalde, is verwijderd, omdat geen paneel-app een externe dienst sneller kan maken. De livecamerapagina is weggelaten omdat die tijd voor het opzetten van de stream meet, in plaats van dashboardwerk.

Dezelfde cijfers zijn live op elk Panel Assistant-paneel te zien onder **Prestaties** in de webinterface; zie [Prestaties](/nl/manage/performance/) om ze op je eigen hardware te lezen.
