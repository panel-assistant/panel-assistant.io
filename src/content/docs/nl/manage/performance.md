---
title: Prestaties
description: Waarom een wandpaneel traag kan aanvoelen met een dashboard dat prima op een telefoon werkt, hoe je het meet en de oplossingen op volgorde van effect.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Een goedkoop Android-wandpaneel kan traag aanvoelen, haperen bij scrollen, leeg worden of niet meer bijwerken, terwijl hetzelfde dashboard goed op een telefoon of computer werkt. Begin bij het werk dat Home Assistant naar het paneel stuurt en meet daarna de resterende dashboard- en hardwarebeperkingen, voordat je aanneemt dat het paneel vervangen moet worden.

:::tip
Een veelvoorkomende oorzaak is het aantal Home Assistant-entiteitstoestanden en -updates dat het dashboard bereikt. [De snelheidsrace](/nl/manage/drag-race/) toont de kosten daarvan op twee identieke panelen, naast elkaar gefilmd. Een grote installatie kan een zwak paneel duizenden entiteiten laten verwerken die het nooit toont. Met de [ingebouwde renderer](/nl/manage/built-in-renderer/) is entiteitsfiltering de eerste oplossing om te proberen.
:::

## Meten voordat je iets verandert

Kies **Bezoeken** op de apparaatpagina in Home Assistant om de webinterface te openen (bijvoorbeeld `http://<panel-ip>:8888/` met de standaardpoort). Leg vóór en na elke wijziging dezelfde dashboardweergave gedurende een vergelijkbare periode vast, zodat de vergelijking betekenis heeft.

- **Reactiesnelheid dashboard**: werkelijke interactievertraging, de traagste interactie uitgesplitst naar invoer-, afhandelings- en presentatietijd, blokkering van de hoofdthread, tijd tot interactief en onverwachte rendererherladingen.
- **Home Assistant-statusstream**: toestandsupdates per seconde, de ongecomprimeerde JSON-gegevenssnelheid, de initiële hydratiegrootte, de tijd totdat de hoofdthread ruimte vrijgeeft en de drie grootste bijdragers in het afgelopen uur, gerangschikt naar updatefrequentie en gegevensvolume.
- **Prestaties** en **Topprocessen**: CPU, GPU, RAM, kloksnelheid, temperatuur en de drukste processen.
- **Camerastream**, op een paneel waar een camera wordt aangeboden: abonnees die de sessie openhouden, de gebruikte encoder, de gevraagde naast de geleverde beeldsnelheid en de geleverde bitrate naast de encoderlimiet. Een duidelijk lagere snelheid dan gevraagd wordt als zodanig gemeld, zonder oorzaak: opnametempo in een donkere kamer, het encoderpad en concurrentie om videohardware zijn allemaal kandidaten en de kaart gokt niet. De aanvraag wordt nooit stilzwijgend verlaagd; kan een sessie de gevraagde snelheid niet leveren, dan toont de kaart de aanvraag naast de aan de encoder gegeven snelheid. De kaart noemt bewust geen CPU-cijfer, omdat hardwarecodering in de codec-hardware en compositor én de app draait, en geen enkel proces de camerakosten weergeeft. Lees de totale paneelbelasting bij Prestaties en Topprocessen.
- **Pagina Entiteiten**: waarop de ingebouwde renderer nu is geabonneerd, wat automatisch leren vond en welke dashboardregels nog een besluit vereisen.
- **Diagnoserapport** (`/diag`): een rapport om in een foutmelding te kopiëren als de oorzaak onduidelijk blijft.

De ingebouwde renderer verzamelt deze browsermetingen rechtstreeks en vereist geen root of WebView-foutopsporing. Bij een afzonderlijke dashboardapp kan de paneel-app met root of helper renderer-CPU en Android-rendercijfers tonen, maar niet de werkelijke interactievertraging van die app meten.

Het cijfer voor toestandsgebeurtenissen op de hoofdthread begint wanneer een relevant Home Assistant-bericht wordt afgehandeld en eindigt wanneer de browser na alle handlers en microtaken ruimte vrijgeeft. Het omvat de kleine waarnemingskosten van de paneel-app en ander werk in dezelfde berichttaak en wordt daarom bewust niet uitsluitend Home Assistant-verwerkingstijd genoemd. De gegevenssnelheid betreft ongecomprimeerde JSON die de frontend verwerkt, geen gecomprimeerd netwerkverkeer.

Gebruik de uitgelijnde grafiek om verbanden te zoeken. Interactiepieken tegelijk met zwaar toestandsverkeer en hoge bezetting door toestandsgebeurtenissen wijzen op de omvang van de toestandsstroom. Trage afhandeling bij een rustige stroom wijst op dashboard-JavaScript. Presentatievertraging en lange renderframes wijzen op lay-out, animatie, camera- of mediawerk. Herhaald herladen wijst op geheugen- of rendererinstabiliteit. Lees metingen samen; één CPU-momentopname kan de oorzaak niet alleen vaststellen.

De rij **Waarschijnlijke oorzaak** past deze regels voorzichtig toe en vermeldt de zekerheid. Ondersteunt het bewijs niet één overheersende oorzaak, dan zegt de rij dat.

### Gefilterd en ongefilterd van buiten het paneel vergelijken

Overbelast het ongefilterde dashboard zijn eigen WebView, dan kunnen de cijfers op de pagina stoppen. Een verzamelscript op een computer bevraagt in plaats daarvan de eigen prestatie-interface van de paneel-app, onderdeel van de verouderde REST-API (zie de [bedieningsreferentie](/nl/reference/api/#de-rest-api-wordt-uitgefaseerd)). Daardoor blijft de totale paneel-CPU zichtbaar en, met root of helper, een native meting van de Chromium-renderthread. Het registreert ook hoe oud de laatste browsermetingen zijn; boven 15 seconden gelden ze als vastgelopen in plaats van actueel.

Het verzamelscript verandert je configuratie niet. Het zet het entiteitsfilter nooit aan of uit en herschrijft het niet; het eerste verzoek kan één private installatiesleutel in de interne toestand aanmaken. Kies voor beide runs dezelfde dashboardweergave en belasting, wijzig het filter op de webinterface, wacht op herladen en voer vanuit een checkout van de [ha-paneld-repository](https://github.com/panel-assistant/android) voor elke toestand één opdracht uit:

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Vergelijk de twee resultaten:

```bash
python3 tools/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Elke run duurt standaard drie minuten, met 30 seconden opwarmen en elke 10 seconden een meting. `--pair-with` hergebruikt een ondoorzichtige vergelijkings-ID uit het eerste resultaat. Zo kan de vergelijking een ander fysiek paneel, een andere ingestelde Home Assistant of dashboard, of een gewijzigde relevante instelling weigeren zonder die private waarden vast te leggen. Een handmatig gekozen andere weergave binnen hetzelfde dashboard wordt niet ontdekt, dus houd zichtbare weergave en belasting gelijk.

Het script weigert een run als de verwachte modus niet actief is, de filterrevisie of renderergeneratie wijzigt, de build of configuratie tijdens verzamelen verandert, filtering terugvalt of minder dan drie monsters, drie totale paneel-CPU-monsters of drie native renderer-CPU-monsters overblijven. Het schrijft het geweigerde resultaat met de exacte redenen toch en overschrijft nooit een bestaand uitvoerbestand.

De JSON laat paneel-URL en -ID, Home Assistant-URL en dashboardpad, entiteits-ID’s, procesnamen en filterhash weg. Het paneel berekent ondoorzichtige vingerafdrukken met een private willekeurige 256-bits installatiesleutel die het nooit verlaat. De vingerafdrukken zijn uniek per vergelijkingspaar, zodat afzonderlijke metingen niet kunnen worden gekoppeld of gebruikt om een paneelnaam te raden. Kan het paneel de sleutel niet opslaan, dan weigert het de meting. Het ongefilterde entiteitsaantal is het laatst gesynchroniseerde catalogusaantal, geen live aantal uit de overbelaste WebView, en geldt als niet beschikbaar bij een lege catalogus. Netwerk- en browserverkeertellers worden genormaliseerd naar werkelijk waargenomen intervallen, zodat een gemiste meting de vergelijking niet vertekent. Verouderde browsertijden en verkeerssnelheden worden uit samenvattingen weggelaten, terwijl CPU-, geheugen-, netwerk- en renderercijfers uit de paneel-app wel verzameld blijven worden.

### Optionele externe WebView-foutopsporing

De ingebouwde prestatiekaarten vereisen geen DevTools. Gebruik **WebView-foutopsporing op afstand** alleen voor diepgaand onderzoek van de paginabron.

Zet bij een afzonderlijke dashboardapp eerst de eigen instelling voor externe WebView-foutopsporing aan en herstart het dashboard; anders kan de relay de WebView niet vinden. De netwerkrelay zelf vereist root.

### Het Zigbee-watchdogdefect in originele NSPanel Pro-firmware uitsluiten

Oudere originele Sonoff NSPanel Pro-firmware met een recursieve toewijzing `export LD_LIBRARY_PATH=/vendor/bin/siliconlabs_host/:${LD_LIBRARY_PATH}` kan het fabrieksscript `guard_process.sh` zelf tot het prestatieprobleem maken. Een [onderzoek uit de gemeenschap](https://github.com/panel-assistant/android/issues/34) bevestigde het defect op een NSPanel Pro 120 met originele firmware 3.8.0 en meldde het op alle 16 panelen van die melder. Het script zet zijn map elke vijf seconden vooraan. Na ongeveer tien uur overschrijdt de omgevingsstring de Linux-limiet per string voor het starten van programma’s. Externe opdrachten mislukken met `E2BIG`, `sleep` vertraagt de lus niet meer en de watchdog kan één CPU-kern volledig bezetten. Ook kan hij een gestopte `zgateway` dan niet herstarten, waardoor Zigbee niet beschikbaar is. Firmware 1.x tot 3.x kan getroffen zijn waar dezelfde regel voorkomt, maar dat is niet onafhankelijk geverifieerd.

Zoek dit patroon bij periodieke systeembelasting op een verder rustige NSPanel Pro met originele firmware:

- `guard_process.sh` blijft rond 100% van één kern en groeit ver boven de gezonde procesgrootte van ongeveer 9 MB;
- `zgateway` ontbreekt of herstelt niet meer; en
- herstarten helpt, maar de belasting komt ongeveer tien uur later terug.

Herstarten reset alleen tijdelijk de groeiende omgeving. Het gekoppelde issue bevat een door de melder aangeleverde root- en ADB-oplossing, die het project niet onafhankelijk heeft gevalideerd. Pas die niet toe tenzij de exacte recursieve toewijzing één keer in het fabrieksscript voorkomt. Elke reparatie moet eerst een niet-lege back-up verifiëren en eigenaar, modus en SELinux-metadata behouden. Stop vóór wijzigingen bij een onverwachte overeenkomst; draai terug als herstart of verificatie na de wijziging mislukt, zet `/vendor` weer alleen-lezen en controleer `zgateway` en beschikbaarheid in Home Assistant. Een firmware-update die `/vendor` herschrijft, verwijdert de lokale patch. Het defect keert alleen terug als de nieuwe firmware de toewijzing nog bevat. Gemeenschapsinspectie vond die niet in firmware 4.0.12 en 4.6.0.

Dit defect verschilt van een stabiele `zgateway` die blijft rondlopen tegen een niet-antwoordende radio. De Zigbee-gezondheidssensor scheidt guard- en gateway-CPU, bewijs van netwerkdeelname en herstartgeschiedenis. Hij waarschuwt voor de exacte recursieve toewijzing maar bewerkt geen fabrieksscripts. Een geconfigureerde gateway die expliciet niet aan een netwerk deelneemt en na zijn respijtperiode van 15 minuten vijf monsters van één minuut boven 50% van één kern blijft, wordt automatisch uitgeschakeld en begrensd; een aangesloten router met hoge CPU geeft alleen een waarschuwing.

## Oplossingen op volgorde van effect

### 1. Het entiteitsabonnement van de ingebouwde renderer filteren

De Home Assistant-frontend abonneert zich normaal op elke entiteit die de aangemelde gebruiker kan zien. Het paneel ontvangt en verwerkt al die toestanden, ook als het dashboard er maar enkele gebruikt. De ingebouwde renderer kan de geleerde dashboardset aan dat abonnement toevoegen, zodat Home Assistant vóór serialisatie en verzending filtert. Het paneel behoudt zijn gewone geauthenticeerde verbinding; er is geen proxy of extra server.

Het entiteitsfilter geldt alleen voor de ingebouwde renderer. Begeleid instellen vraagt vóór de eerste dashboardlading of het aan moet. Op een al ingesteld paneel:

1. Kies **Bezoeken** op de apparaatpagina in Home Assistant, open **Configureren**, dan **Dashboard**, kies **Ingebouwde renderer (ha-paneld)** en zet **Entiteitsfiltering** aan.
2. Open **Entiteiten** en kies **Dashboard nu scannen**.
3. Bezoek elk dashboardtabblad en gebruik bediening, pop-ups en voorwaardelijke inhoud, zodat runtime-afhankelijkheden kunnen worden waargenomen.
4. Controleer huidige, voorgestelde en uitgesloten entiteiten. Zet alles vast wat een aangepaste kaart of template indirect nodig heeft.
5. Los entiteitsfiltercontroles op. Maak brede of dynamische dashboardregels waar mogelijk smaller, of kies expliciet en accepteer de getoonde waarschuwing.
6. Pas de set toe, laat het dashboard herladen en vergelijk dezelfde weergaven met de prestatiekaarten op Dashboard.

Automatisch leren bewijst niet elke afhankelijkheid van een aangepaste kaart of dynamische template. Een ontbrekende entiteit kan een kaart verouderd of niet beschikbaar maken. Controleer het resultaat daarom eerst op een paneel waarvan je niet afhankelijk bent en houd filtering uit totdat de kandidaat geloofwaardig is. Het ongefilterde abonnement blijft de terugweg: zet **Entiteitsfiltering** uit en herlaad.

Beschrijven oude geleerde gegevens of handmatige keuzes het dashboard niet meer, gebruik dan **Geleerde gegevens resetten** op Entiteiten. Na bevestiging wist dit geleerde lidmaatschappen, vastzettingen, uitsluitingen en genegeerde veiligheidsbesluiten, behoudt het bekende goede actieve filter en start een nieuwe scan. Het filter blijft als terugvaloptie actief terwijl de kandidaat opnieuw wordt opgebouwd.

### 2. Het dashboard zelf lichter maken

- Splits een vol dashboard in gerichte weergaven en laad geen kaarten die het paneel nooit nodig heeft.
- Geef ingebouwde kaarten de voorkeur wanneer een aangepaste kaart voortdurend animeert, een grote documentboom bouwt of vaak JavaScript uitvoert.
- Volg interactieverwerking, lange animatieframes en herladingen. Overheerst één weergave, vereenvoudig die of gebruik `button.<panel>_reload` tijdelijk voor herstel terwijl je de dure kaart zoekt.
- Test camera- en grafiekkaarten afzonderlijk. Decodering, geschiedenisvragen en tekenen kunnen overheersen, ook als filtering goed werkt.

### 3. Onnodige updates bij de bron verminderen

Entiteitsfiltering beschermt tegen niet-getoonde entiteiten, maar maakt een benodigde entiteit niet goedkoper. Toont het dashboard echt een vermogensmeter, Bluetooth-afstandssensor, snel veranderende template of drukke diagnostische entiteit, verlaag dan waar de integratie dat toelaat de updatefrequentie bij de bron. Dit kan ook recorder- en databasewerk voor de hele Home Assistant-installatie verminderen.

Bruikbare middelen zijn ESPHome-throttle- en deltafilters, Zigbee-rapportage-intervallen, `scan_interval`-instellingen en minder frequente template-updates. Controleer vóór brede toepassing of een automatisering of geschiedenisweergave daardoor minder bruikbaar wordt.

### 4. Het resterende dashboard op de hardware afstemmen

PX30- en RK3566-panelen kunnen een gericht dashboard goed draaien, maar hebben beperkte prestaties per thread en meestal maar 2 GB RAM. Filtering verwijdert onnodig toestandswerk; het maakt een te grote camerastream, complexe animatie of zeer grote geschiedenisgrafiek niet gratis. Ontwerp voor de logische schermgrootte en test de zwaarste weergave in plaats van alleen de starttab. De [hardwarepagina’s](/nl/hardware/) vergelijken ondersteunde panelen.

## Controlelijst

- [ ] De ingebouwde renderer is gekozen waar native meldingen niet nodig zijn
- [ ] Automatische entiteitsfiltering staat aan, is gescand, beoordeeld en expliciet toegepast
- [ ] Elk dashboardtabblad, elke pop-up en elk voorwaardelijk pad is tijdens leren gebruikt
- [ ] Afhankelijkheden van aangepaste kaarten en templates zijn vastgezet of anders afgedekt
- [ ] Entiteitsfiltercontroles zijn bewust opgelost, niet per ongeluk genegeerd
- [ ] Dezelfde weergaven zijn vóór en na filtering met de prestatiekaarten op Dashboard vergeleken
- [ ] Loopt de ongefilterde pagina vast, dan zijn beide runs met het meetscript verzameld en gevalideerd
- [ ] Zware kaarten, camerastreams en grafieken zijn afzonderlijk getest
- [ ] Benodigde hoogfrequente entiteiten zijn waar passend bij de bron afgesteld
- [ ] Bij de originele NSPanel Pro-Zigbeesoftware is `guard_process.sh` gecontroleerd
- [ ] Herladen en het filter uitzetten zijn beide als herstelroute geprobeerd

## Referentie

### Waarom een grote Home Assistant-installatie een paneel kan vertragen

De Home Assistant-frontend houdt een WebSocket-abonnement bij met de huidige toestand en elke volgende update van de voor de gebruiker beschikbare entiteiten. Zonder beperkte set ontvangt de renderer veel meer gegevens dan een gericht wanddashboard gebruikt. Zijn JavaScript-hoofdthread moet berichten ontleden, het frontendtoestandsmodel bijwerken en bepalen of iets zichtbaars verandert.

Goedkope panelen zijn extra gevoelig, omdat JavaScript, lay-out en tekenen sterk van één renderthread afhangen. Extra CPU-kernen helpen ander werk maar verwijderen die vertraging niet. Beperkt RAM maakt geheugenopruiming steeds verstorender naarmate de WebView groeit.

### Gebruikelijke verschijnselen

| Verschijnsel                                                                                                 | Waarschijnlijke oorzaak                                                         |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Vertraagde tikken, trage navigatie of haperend scrollen                                                      | Hoofdthreadwerk door een grote entiteitenstroom, zware kaarten of beide         |
| Eén dashboardweergave is veel slechter dan de rest                                                           | Dure kaarten, cameradecodering, geschiedenisgegevens of een grote documentboom  |
| De hele weergave wordt leeg terwijl de omliggende interface blijft                                           | WebView-geheugendruk of rendererfout                                            |
| Het dashboard wordt over dagen langzaam slechter                                                             | Geheugengroei, fragmentatie of een kaart die werk ophoopt                       |
| Entiteiten stoppen met bijwerken en komen daarna in een uitbarsting                                          | WebSocket-onderbreking, opnieuw verbinden of een renderer die het niet bijhoudt |
| Vergelijkbare panelen gedragen zich anders                                                                   | Andere inhoud, abonnement, WebView-versie, draaitijd of warmte                  |
| Een originele NSPanel Pro wordt ongeveer tien uur na starten haperig en `guard_process.sh` gebruikt één kern | De recursieve toewijzing in de Zigbee-watchdog, met `E2BIG` als gevolg          |

Geheugenopruiming pauzeert JavaScript af en toe om ongebruikt geheugen terug te winnen. Dicht bij de geheugengrens worden die pauzes langer en frequenter, wat tekenen kan blokkeren ook zonder crash van het Android-proces.
