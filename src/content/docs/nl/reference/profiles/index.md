---
title: Runtimepaneelprofielen
description: Hoe paneelprofielen een model Android-wandpaneel beschrijven en hoe je ze schrijft, test en activeert vanuit de eigen webinterface van het paneel.
sidebar:
  label: Overzicht
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Paneelprofielen beschrijven wat bijzonder is aan een model Android-wandpaneel: hoe ha-paneld het herkent, welke gecompileerde hardwaredrivers het mag gebruiken, bekende scherm- en sensoreigenschappen en eventuele firmwareafhankelijke varianten. Profielen zijn menselijk leesbare YAML-bestanden. Je kunt ze bekijken, exporteren, bewerken, importeren en activeren vanuit een draaiende ha-paneld-installatie zonder de Android-app opnieuw te bouwen.

Deze pagina is de praktische schrijfgids. Zie de [formaat- en compatibiliteitsreferentie](/nl/reference/profiles/format/) voor het documentmodel, [testen en probleemoplossing](/nl/reference/profiles/testing/) voordat je hardwarebediening activeert en de [gids voor delen en bijdragen](/nl/reference/profiles/sharing/) voordat je een profiel publiceert. Er is ook een duidelijk afzonderlijke catalogus van [profielen van de gemeenschap](/nl/reference/profiles/community/); die bestanden worden handmatig geïmporteerd en zijn geen meegeleverde ondersteuning.

De met de app meegeleverde profielen staan in de ha-paneld-repository onder [`app/src/main/assets/device-profiles`](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles).

![De pagina Profielen van het paneel met de YAML van een meegeleverde revisie in de editor, beoordelingsbadges voor aanbevelingen voor pakketuitschakeling, rootpaden en WebView-artefactmetadata, en daaronder de waargenomen apparaatgegevens](/screenshots/ui-profile-dark.png)

## Wat een profiel kan doen

Een profiel kan kiezen uit drivers en transformaties die ha-paneld al levert en de getypeerde parameters daarvan opgeven. Het kan hardwaregegevens, matchregels, firmwarevarianten, schermaanbevelingen, kandidaatmogelijkheden en het Android-bevoegdheidsniveau beschrijven dat op het paneel nuttig kan zijn.

Een profiel kan geen uitvoerbare code, shellopdrachten, helperdaemonwerkwoorden, kernel-ioctls, native bibliotheken of nieuw hardwareprotocol toevoegen. Als een paneel een mechanisme nodig heeft dat niet in de profieleditor of formaatreferentie staat, moet dat mechanisme eerst in ha-paneld zelf worden geïmplementeerd en beoordeeld. Deze grens houdt een uitgewisseld YAML-bestand controleerbaar en voorkomt dat een profiel een willekeurig rootscript wordt.

Profielen verlenen ook geen bevoegdheden. Een bevoorrechte driver blijft niet beschikbaar tenzij de vereiste actuele route slaagt. Zie [Bevoegdheden: standaard-Android en bevoorrechte routes](#bevoegdheden-standaard-android-en-bevoorrechte-routes).

## Snel beginnen zonder ontwikkelomgeving

Je hebt alleen een ha-paneld-installatie met profielondersteuning en een webbrowser nodig. De pagina Profielen bevat een YAML-editor met validatiefeedback; exporteren naar een afzonderlijke teksteditor is optioneel. Je hebt geen Android Studio, Gradle, Android SDK of repositorycheckout nodig.

1. Open de apparaatpagina van het paneel in Home Assistant, selecteer **Bezoeken** en open **Profielen**. Gebruik bij rechtstreeks verbinden de gemelde HTTP-poort van het paneel (`http://<panel-ip>:8888/profiles` bij de standaardpoort).
2. Als ha-paneld het paneel al herkent, exporteer dan de exacte actieve profielrevisie als referentie. Meegeleverde profielen zijn onveranderlijk, dus de eerste bewerking maakt een zelfstandige lokale afsplitsing in plaats van de met de app geleverde kopie te wijzigen.
3. Als het paneel **Generic** gebruikt, download dan het passieve apparaatconcept. Het concept bevat de paneelvingerafdruk en expliciete onbekend/TODO-waarden; het raadt geen bevoorrechte hardware en voert geen actieve controle uit.
4. Geef het profiel een stabiele ID in kleine letters en een versie, vul herkomst- en compatibiliteitsmetadata in en begin met exacte matchregels. Gebruik het [voorbeeld hieronder](#voorbeelden) en de [formaatreferentie](/nl/reference/profiles/format/).
5. Importeer de YAML op de pagina Profielen. Import en validatie tonen alleen een voorbeeld: ze slaan niets op en activeren niets.
6. Lees elke validatiemelding en vergelijk de kandidaat met het actieve profiel. Let vooral op vingerafdrukmatching, drivers, hardwarepaden, nieuwe of verwijderde Home Assistant-entiteiten en vereiste bevoegdheden.
7. Sla de gevalideerde kandidaat op. Dit maakt een onveranderlijke, inactieve lokale revisie. Het verandert het draaiende paneel nog steeds niet.
8. Test stapsgewijs met de [testcontrolelijst](/nl/reference/profiles/testing/). Activeer alleen terwijl iemand het paneel kan zien en aanraken als het profiel scherm-, invoer-, led-, relais-, pakket- of ander bevoorrecht gedrag verandert.
9. Activering vereist expliciete bevestiging gekoppeld aan de exacte profiel-ID, revisie en inhoudshash. ha-paneld herstart zijn service zodat elke controller hetzelfde opgeloste profiel ontvangt.
10. Controleer na de herstart dat de pagina Profielen de verwachte revisie als **Actief** meldt, bekijk mogelijkheden en Home Assistant-entiteiten en test terugdraaien. Als opstartvalidatie mislukt, keert ha-paneld terug naar de **laatst bekende goede** revisie en meldt de mislukte kandidaat als **automatisch teruggedraaid**.

Bewaar de geëxporteerde YAML als uitwisselbare bron. Een schermafbeelding van een groene pagina Profielen is nuttig bewijs, maar vervangt niet het bestand, de herkomst of de stapsgewijze hardwareresultaten.

## Voorbeelden

Het voorbeeld [`minimal-community.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml) gebruikt het openbare schema dat de pagina Profielen accepteert. Het is lesmateriaal en geen bewering dat de fictieve hardware bestaat. Het is een behoudend beginpunt met standaard-Android dat geen leveranciersprotocol, root-/helperpad, relais, evdev-invoer, updateartefact, gewenste pakkettoestand of inrichtingsrecept inschakelt.

Importeer het voorbeeld via **Profielen**, bekijk het validatievoorbeeld en sla het alleen als inactieve lokale revisie op. Verander ID, herkomst, exacte vingerafdruk, geteste firmware en beperkingen voordat je het gebruikt als basis voor een echt paneel. Een geïmporteerde match is alleen voorbeeldbewijs; lokale profielen en profielen van de gemeenschap worden nooit automatisch geselecteerd.

Exporteer voor volledige productievoorbeelden een van de onveranderlijke meegeleverde profielen vanaf een draaiend paneel of lees de [meegeleverde YAML-bestanden](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles). Die gebruiken hetzelfde schema, maar kunnen bevoorrechte gecompileerde drivers en door de kern beheerde artefacten selecteren die je zonder hardwarebewijs niet moet kopiëren.

## De levenscyclus van een profiel

ha-paneld behandelt profielinhoud als onveranderlijke revisies in plaats van een bewerkbaar actief instellingenobject. Dit maakt vergelijkingen reproduceerbaar en voorkomt dat een gewijzigde upload onder een eerder voorbeeld wordt geactiveerd.

- **Gebundeld**: geleverd met ha-paneld en onveranderlijk. Een meegeleverd profiel kan worden geëxporteerd of afgesplitst.
- **Lokale inactieve revisie**: geïmporteerd of gemaakt op dit paneel, gevalideerd en opgeslagen, maar niet gebruikt door draaiende controllers.
- **In afwachting**: de exacte revisie is voor activering geaccepteerd en de service herstart.
- **Actief**: de revisie waarmee de huidige sensoren, hardwarecontrollers, het mogelijkhedenmodel van de interface en de Home Assistant-ontdekking zijn opgebouwd.
- **Laatst bekende goede**: de vorige bewezen selectie, behouden als doel voor herstel en handmatig terugdraaien nadat een nieuwe revisie is opgestart.
- **Automatisch teruggedraaid**: een kandidaat waarvan activering mislukte en die automatisch door de laatst bekende goede revisie is vervangen.

Opslaan koppelt een onveranderlijke revisie aan exact de YAML uit het validatievoorbeeld. Bij activeren en verwijderen wordt ook de catalogusgeneratie gecontroleerd; als een andere browser of beheerder de catalogus heeft gewijzigd, worden die verouderde bewerkingen geweigerd. Vernieuw de pagina en vergelijk opnieuw voordat je op basis van de nieuwe toestand handelt.

Een inactieve lokale revisie verwijderen verandert het actieve paneel niet. Een actieve of laatst bekende goede revisie mag niet worden verwijderd totdat een ander geldig herstelpad bestaat.

**Automatisch gebruiken** laat een vastgezet paneel bij de volgende gecontroleerde herstart terugkeren naar vingerafdrukmatching van meegeleverde profielen. Geïmporteerde revisies en revisies van de gemeenschap doen nooit mee aan die automatische keuze; ze blijven alleen beschikbaar voor expliciete vastgezette activering.

## Beginnen vanuit Generic

`Generic` is de behoudende terugvaloptie voor een niet-herkend paneel. Het gebruikt gewone Android-mogelijkheidscontroles en veilige runtimecontroles, maar verzint bewust geen leveranciershardware, evdev-knoppen, relais, radio's, klimaatchips, updateartefacten of pakketacties.

Daarom is Generic het juiste beginpunt voor profilering door de gemeenschap:

1. Download het **apparaatconcept** van de pagina Profiles. Het legt de exacte gegevens over buildmodel, buildapparaat en productversie vast die voor ha-paneld beschikbaar zijn, samen met geselecteerde passieve waarnemingen. Bekijk het afzonderlijke, begrensde passieve rapport waaruit gevoelige gegevens zijn verwijderd op de pagina Profiles voordat je je bewijsmateriaal deelt.
2. Maak gegevens onleesbaar en controleer vóór delen. Het gegenereerde rapport is bedoeld voor ondersteuning, maar de auteur blijft verantwoordelijk voor het verwijderen van paneelnamen, adressen, Home Assistant-details, aanmeldgegevens en dashboardinhoud.
3. Voeg eerst identiteit en herkomst toe. Gebruik een stabiele ID in kleine letters met een auteurs-/organisatievoorvoegsel, zoals `org.example.wallpanel-x1`, plus een eerste profielversie, informatie over auteur/bron/licentie, een volwassenheidsniveau, het geteste firmwarebereik en bekende beperkingen.
4. Voeg smalle, exacte vingerafdrukregels toe. Een leveranciersmodel of productversievoorvoegsel is meestal veiliger dan een brede SoC-alias zoals `px30`, `rk3326`, `rk3566` of `rk3576`, die niet-gerelateerde panelen kunnen delen.
5. Laat onbekende mogelijkheidsecties weg of expliciet onbekend. Een bestandsnaam, winkelvermelding of in firmware gecompileerde kerneldriver bewijst niet dat actieve hardware bestaat of dat een Android-app die kan bereiken.
6. Voeg één met bewijs onderbouwde mogelijkheid tegelijk toe, valideer, vergelijk en test voordat je verdergaat.

Het concept is bewust alleen-lezen en passief. Zet verkennende shellopdrachten of eenmalige rootexperimenten niet om in profielvelden. Als werkelijk een nieuwe actieve controle of driver nodig is, stel die dan voor als een begrensde ha-paneld-implementatie met eigen validatie en tests.

## Een paneel veilig matchen

Matching is een veiligheidsbesluit, niet alleen gemak. Een verkeerde match kan een ongeschikte driver selecteren of mogelijkheden claimen die bij een ander product met hetzelfde referentiebord horen.

Geef de voorkeur aan exacte productidentiteit in deze volgorde:

1. een leveranciersmodel of apparaatcodenaam die uniek is voor het product;
2. een exact productversieformaat of strak verankerd voorvoegsel;
3. een combinatie van onafhankelijke buildvelden;
4. een brede SoC-/referentieplatformalias alleen als bewuste compatibiliteitsterugvaloptie.

Geef elke exacte groep een hogere takprioriteit dan de brede terugvaloptie. ha-paneld vergelijkt eerst de prioriteit van de gematchte groep en daarna de profielprioriteit; een exacte gelijke stand tussen meegeleverde profielen valt veilig terug op Generic. Prioriteiten reproduceren een bewuste takvolgorde, maar vervangen geen smalle vingerafdruk.

Revisies van de gemeenschap en geïmporteerde revisies doen nooit mee aan automatische selectie, ook niet bij een exacte match. Matching is voorbeeldbewijs dat de beheerder helpt beslissen of het bestand dit paneel beschrijft. Een lokale revisie kan meegeleverde detectie alleen via expliciete activering overschrijven, waarna het paneel de exacte profiel-ID, revisie en hash vastzet. Een latere import kan het actieve resultaat dus niet stilzwijgend veranderen.

Gebruik voor een ondersteund verschil binnen één hardwarefamilie een benoemd strategieveld dat door de kern wordt beheerd, bijvoorbeeld een productlabel of dichtheidsregel. Het formaat bevat geen algemene expressietaal of willekeurige variantpatches. Nabijheidsschaal, polariteit en binair-/afstandsgedrag zijn bewust geen profielstrategieën: de runtime leert die uit actueel bewijs. Gebruik afzonderlijke profielen wanneer de beschikbare benoemde strategieën een echt verschil in verwerving, driver, bevoegdheidsgrens of herstel niet kunnen beschrijven.

## Bevoegdheden: standaard-Android en bevoorrechte routes

Profielen beschrijven kandidaatmechanismen; actuele controles bepalen of het draaiende paneel die kan gebruiken.

### Standaard-Android

Begin hier. Dashboardweergave, Panel Assistant-koppeling en gewone Android-sensoren, helderheid, audio, navigatie en de lokale webinterface vereisen geen root. Een nieuw profiel hoort identiteit en standaard-Android-gedrag te bewijzen voordat een bevoorrechte driver wordt toegevoegd.

### Leveranciersroot of de ha-paneld-helper

Een gecompileerde driver kan een werkende leveranciersroute via `su` of de afzonderlijk geïnstalleerde roothelper van ha-paneld vereisen. Die vereiste vermelden laat de route niet bestaan, installeert de helper niet en verruimt zijn toegestane lijst niet. De helper accepteert alleen gecompileerde, begrensde opdrachten en authenticeert de wederpartij; een profiel levert gevalideerde parameters aan die opdrachten, nooit opdrachttekst.

Adviseer niet om een apparaat dat zonder root is geleverd te rooten alleen om aan een profiel te voldoen. Documenteer de beperktere functies eerlijk. Zie [Roottoegang](/nl/hardware/guides/root-access/) voor de hardwarekant.

## Een geïnstalleerd profiel bijwerken

Profielinhoudsversies en documentschemaversies lossen verschillende problemen op. Verhoog de profielversie wanneer hardwarekennis of gedrag verandert. De schemaversie verandert alleen wanneer ha-paneld de documenttaal verandert.

Vergelijk een update vóór opslaan met de actieve revisie en lees het compatibiliteitsrapport. Een ha-paneld-update valideert geïnstalleerde profielen ook opnieuw vóór gebruik. Een bestand dat een nieuwere kern, niet-beschikbare driver of niet-ondersteund toekomstig schema vereist blijft geïnstalleerd maar kan niet actief worden; het huidige laatst bekende goede profiel blijft draaien.

Behandel een wijziging in matching, een bevoorrechte driver, pad, firmwarevariant, gewenste pakkettoestand, receptselectie of door de kern beheerd updateartefact als gedragsmatig betekenisvol, ook als het YAML-verschil klein is. Herhaal de relevante testfasen en verhoog de profielversie.

## Volgende stappen

- [Profielformaat en compatibiliteit](/nl/reference/profiles/format/)
- [Testen en probleemoplossing](/nl/reference/profiles/testing/)
- [Profielen delen en bijdragen](/nl/reference/profiles/sharing/)
- [Apparaatprofielarchitectuur](/nl/reference/profiles/architecture/)
- [Beveiligingsmodel](/nl/reference/security/)
- [Paneelhardware](/nl/hardware/)
