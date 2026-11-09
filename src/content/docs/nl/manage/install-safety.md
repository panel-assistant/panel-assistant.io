---
title: Installatieveiligheid
description: De controles van het buiten gebruik gestelde opdrachtregel-installatieprogramma, de back-ups vóór paneelwijzigingen en wanneer het stopte.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Deze pagina beschrijft de controles van het buiten gebruik gestelde [opdrachtregel-installatieprogramma](/nl/install/installing-ha-paneld/), dat panelen installeerde vóór ha-paneld v0.9.9. Panel Assistant installeert en actualiseert nu panelen: het controleert een paneel voordat iets verandert en maakt vóór elke update een instellingenback-up, zoals beschreven in [Updates en herstel](/nl/manage/updates-and-recovery/).

## Grenzen voor vertrouwen en aanmeldgegevens

Bestanden met aanmeldgegevens houden geheimen uit de shellgeschiedenis en opdrachtregels van onderliggende processen op de computer waarop het installatieprogramma draait. Ze versleutelen de beheer-API van het paneel niet. De paneel-API (bijvoorbeeld `http://<panel>:8888` met de standaardpoort) volgt het model van een vertrouwd netwerk. Brokergegevens en Home Assistant-tokens gaan dus als onversleutelde HTTP over die verbinding. Voer het installatieprogramma alleen op een vertrouwd, gesegmenteerd netwerk uit. De [beveiligingsreferentie](/nl/reference/security/) beschrijft het model.

Aanmelden met een Home Assistant-gebruikersnaam en -wachtwoord werkt anders. Het wachtwoord gaat van de installatiecomputer naar het Home Assistant-aanmeldeindpunt en bereikt het paneel nooit. Gebruik een `https://`-URL voor Home Assistant zodat de aanmelding onderweg versleuteld is; een `http://`-URL verstuurt het wachtwoord onversleuteld. Het paneel ontvangt alleen het resulterende vernieuwingstoken, dat kan worden ingetrokken.

Configuratie-exporten bevatten geheimen en worden met alleen toegang voor de eigenaar geschreven; behandel ze als aanmeldgegevens. De automatische instellingen- en databasekopieën van vóór een upgrade komen ook in een map voor alleen de eigenaar, als bestanden met modus 600.

## Authenticatie van releases en pakketten

Het installatieprogramma dat geen checkout vereist, downloadt de bijbehorende release-app en provisioner. Vóór paneelwijzigingen authenticeert het de gepubliceerde app en helperbinaries aan de hand van met de releasesleutel ondertekende SHA-256-records. Het inspecteert ook het pakket en de ondertekenaar van de app met Android Build-Tools. Die zijn optioneel voor een eerste installatie zonder paneel-app, waarbij Android zelf de handtekening controleert, en verplicht bij het bijwerken van een bestaande paneel-app: het vergelijkt de geïnstalleerde en nieuwe ondertekenaars voordat iets verandert en weigert in plaats van te gokken. Anders zou een afwijkende ondertekenaar eerst de draaiende helper uit bedrijf nemen en pas daarna de installatie laten mislukken. Het kiest de helper die bij de gemelde paneel-ABI past.

Een lokaal gebouwde app volgt een afzonderlijke ontwikkelaarsroute. Ze moet nog steeds het ha-paneld-pakket met precies één geldige ondertekenaar bevatten, maar mag de eigen vaste ondertekeningssleutel van de bouwer gebruiken. `--require-release-signer` verscherpt die controle wanneer het lokale bestand een officiële build moet zijn. `--allow-unsigned-helper` is een afzonderlijke bevestiging voor helperbinaries onder beheer van de lokale bouwer in plaats van geauthenticeerde releasebestanden.

## Back-ups en herstel

Drie verschillende bestanden dienen drie verschillende hersteltaken:

- Een **configuratie-export in JSON** bevat instellingen en geheimen. `--export FILE` maakt die expliciet, en vóór een gewone upgrade probeert het installatieprogramma ook automatisch een export voor alleen de eigenaar te maken. Deze bevat niet de runtime-profielcatalogus, profielkeuze, geleerde entiteitstoestand, geschiedenissen of een Home Assistant-aanmelding van een afzonderlijke dashboardapp.
- Een **`.hpb`-back-up** via **Installeren** en **Back-up** in de webinterface is de meest volledige ondersteunde back-up. Die bevat instellingen, duurzame paneeltoestand, de profielcatalogus en een in aanmerking komende aanmelding van een afzonderlijke dashboardapp. De geleerde entiteitencatalogus en nabijheids- en omgevingsgeschiedenis worden opnieuw geleerd in plaats van hersteld. Herstel `.hpb` via **Installeren** en **Herstellen** op dezelfde pagina. `--restore FILE` accepteert configuratie-JSON, geen `.hpb`-back-ups.
- Een automatische **`…break-glass.db`** is een laatste redmiddel: een kopie van de interne paneeldatabase. Niets herstelt die automatisch en hij is alleen geldig voor hetzelfde paneel en dezelfde appversie waarvan hij afkomstig is.

Wordt `--export FILE` gecombineerd met installatie- of configuratieopties, dan wordt de geverifieerde export geschreven voordat iets op het paneel verandert. Kan die niet worden gemaakt en geverifieerd, dan stopt de run. Voer `--export FILE` eerst als afzonderlijke opdracht uit als je wilt exporteren zonder iets te installeren.

De automatische instellingenexport vóór een gewone upgrade is een poging zonder garantie. Lukt die niet, dan verwijdert het installatieprogramma het gedeeltelijke bestand, registreert dat er geen instellingenexport is en gaat verder met het vervangen van de app.

Maak vóór verwijderen, appgegevens wissen of ander destructief herstel een afzonderlijke back-up via **Installeren**, **Back-up** en controleer of de gedownloade `.hpb` niet leeg is. Die handelingen vernietigen de appgegevens. Een gewone `adb install -r` behoudt ze.

`--reset-config` werkt bewust anders. **Resetten is onomkeerbaar en maakt geen back-up.** Het vraagt een eigen bevestiging en verwijdert vervolgens alle gegevens van de paneel-app. De app, helper en andere Android-apps blijven geïnstalleerd.

## Automatische databasesnapshot

Vóór elke gewone upgrade probeert het installatieprogramma de database vast te leggen. Die bevat configuratie, entiteitencatalogus, nabijheids- en omgevingsgeschiedenis en de revisiegeschiedenis op het paneel. De snapshot helpt bij herstel na later verwijderen of een andere destructieve reparatie; Android laat bij normale vervanging van de app de oorspronkelijke database staan.

Het installatieprogramma stuurt de draaiende app één verzoek om upgradevoorbereiding, uitsluitend via ADB. De app neemt geen nieuw werk meer aan, voltooit openstaande schrijfacties, pauzeert databaseschrijvers, schrijft zijn toestand weg, maakt een checkpoint van het SQLite-write-ahead-log en sluit de database. Pas na registratie van het oude proces, de appversie, het aantal bytes, een voor de computer verifieerbare SHA-256, de schemaversie en het aantal toestandsrijen bevestigt hij dat exacte verzoek.

De gesloten database wordt rechtstreeks uit de private appopslag gekopieerd zonder een tweede kopie op het paneel klaar te zetten. De computerkopie wordt alleen geaccepteerd als grootte en SHA-256, die altijd wordt gecontroleerd, met de bevestiging overeenkomen en de lokale SQLite-controles op integriteit, schema en rijen slagen.

Geeft de app niet de exacte bevestiging terug, bijvoorbeeld door een time-out of onjuist antwoord, dan valt het installatieprogramma eenmaal terug op de live SQLite-`.backup`. Dat levert dezelfde op zichzelf staande database op zonder write-ahead-log of journalbestanden ernaast. Een paneel zonder rootroute kan zijn private database niet beschikbaar stellen, zodat mogelijk alleen de instellingenexport beschikbaar is.

Bij een gewone upgrade over de bestaande app is de databaseback-up een poging zonder garantie. Een mislukte of inconsistente kopie wordt verwijderd, een duidelijke waarschuwing verschijnt en het vervangen van de app mag doorgaan met de oorspronkelijke appgegevens onaangeroerd. Een ongeldige kopie wordt nooit bewaard of als geslaagde back-up aangeduid.

Er is geen vaste drempel voor vrije ruimte. De normale route zet niets op het paneel klaar, en de ene terugvalpoging laat de werkelijke opname uitwijzen of het past. Opslagdruk, een mislukte databasegezondheidscontrole, een onbereikbaar statuseindpunt, een onjuist antwoord of een onbekende toestand worden vóór en na installatie gerapporteerd. Geen daarvan blokkeert gewone appvervanging, omdat de nieuwe build de enige nuttige herstelpoging voor een ongezonde of onbereikbare oude build kan zijn. Een afzonderlijke `--verify` meldt deze omstandigheden wel als fout wanneer een strikt geslaagd-of-mislukt-resultaat nodig is.

## Tijdzone en controles bij eerste installatie

Vóór paneelwijzigingen vergelijkt het installatieprogramma de paneeltijdzone met die van de computer. Een verschil geeft een waarschuwing, geen stop, omdat een paneel terecht een andere zone kan gebruiken. De vergelijking gebruikt zonenamen in plaats van de huidige UTC-afwijking en lost bekende aliassen op via de tijdzonedatabase van de computer. Zo worden panelen op een fabriekstijdzone gevonden die anders verkeerde lokale tijden in logboeken en schema’s gebruiken.

Kan een van de waarden niet worden vastgesteld, dan blijft de controle stil. Een ontbrekend antwoord, ongeldige zonenaam of onbekende alias laat de installatie niet mislukken en wijzigt haar niet.

Een schoon paneel heeft geen statuseindpunt voor de paneel-app, en sommige defecte installaties evenmin. Het installatieprogramma vraagt Androids pakketbeheer of ha-paneld is geïnstalleerd voordat het beslist welk geval geldt. Een duidelijk 'niet geïnstalleerd' start een normale eerste installatie. Een pakketbeheer- of ADB-vraag zonder antwoord stopt de run vóór een paneelwijziging.

## Root-helperupgrades

Gepubliceerde releases bevatten verzegelde helperbinaries voor `armeabi-v7a` en `arm64-v8a`. Op een paneel met `su` van de fabrikant of root-ADB authenticeert het installatieprogramma de gekozen binary met de releasesleutel, verifieert hem opnieuw na het klaarzetten en installeert of actualiseert hem atomair. Vóór appvervanging controleert het de protocolmogelijkheden en reproduceerbare buildidentiteit die de app nodig heeft.

De eerdere helper met root als eigenaar en zijn service blijven beschikbaar totdat de appinstallatie slaagt. Mislukt het installeren of starten van de helper, of klopt identiteit of mogelijkheid niet, dan wordt het eerdere werkende paar hersteld voordat de app wordt vervangen. Valt ADB weg terwijl Android de app installeert, dan bewaart het installatieprogramma zijn hersteljournal. Dezelfde opdracht opnieuw uitvoeren authenticeert de geïnstalleerde app en draaiende helper en voltooit of herstelt de onderbroken upgrade.

Herstelsnapshots zijn eigendom van root, worden met hun geregistreerde digest geauthenticeerd en naar opslag gesynchroniseerd voordat de live bestanden worden vervangen. Het installatieprogramma weigert te starten bij een onafgeronde helpertransactie en vermeldt de opnieuw uit te voeren opdracht.

Het geeft de voorkeur aan een init-service op een schrijfbare `/system` als voldoende ruimte kan worden geverifieerd. Is `/system` alleen-lezen, dan gebruikt het een geverifieerde Magisk-, KernelSU- of APatch-runner in `/data/adb/service.d`. Een paneel met schrijfbare maar volle `/system` kan helper en herstelbestanden onder `/data/adb/hapaneld` bewaren en alleen de opstartservice in `/vendor/etc/init` zetten; latere updates behouden die geverifieerde indeling. Het stopt vóór appvervanging als opslagcapaciteit, beheer van het opstarten of de toestand van een bestaande transactie niet kan worden vastgesteld.

De app bevat de bijbehorende helper als terugvaloptie. Wordt een paneel met directe `su` bijgewerkt via Installeren of de Home Assistant-update-entiteit voordat het opnieuw door het installatieprogramma gaat, dan controleert de app bij de eerste start het benodigde helperprotocol en kan hij een kopie met root als eigenaar vanuit `/data/local` starten. Een geroot paneel dat root afschermt, kan een oude helper niet veilig zichzelf laten vervangen. Het weigert daarom veilig en vraagt het geauthenticeerde installatieprogramma vanaf een computer uit te voeren.

## Wat een run kan stoppen

Het installatieprogramma stopt met een resultaat ongelijk aan nul als het niet veilig iets kan vaststellen dat de gevraagde handeling nodig heeft. Voorbeelden zijn een pakketvraag zonder antwoord, een app met verkeerd pakket of ondertekenaar, een onherstelbare helpertransactie, een niet-verifieerbare gevraagde configuratie-export of een mislukte verplichte zelfcontrole na installatie.

Andere bevindingen zijn waarschuwingen, omdat stoppen herstel moeilijker zou maken. Een niet-beschikbare automatische databaseback-up, waarschuwing over opslaggezondheid of mislukte statusoproep vóór de upgrade verhindert op zichzelf geen gewone appvervanging. Het installatieprogramma vermeldt die beperking duidelijk en presenteert een gedeeltelijk of ongeldig herstelbestand niet als geslaagd.

### Een weigering lezen

Elke weigering noemt één voorwaarde en verandert niets op het paneel, tenzij anders vermeld. De tekst wijst aan wat moet worden hersteld, omdat de oplossing sterk verschilt.

- **De canonieke database bleef veranderen tijdens het lezen.** De paneel-app schreef nog terwijl een consistente kopie werd geprobeerd. Dit is een druk paneel, geen beschadigd paneel. Kopiëren wordt automatisch herhaald; zie je dit, dan bleef de app bij elke poging schrijven. Nogmaals uitvoeren wanneer het paneel rustiger is, volstaat meestal.
- **De canonieke database kon niet worden gelezen** of **is geen gewoon bestand.** Dit is het omgekeerde geval en gaat over opgeslagen gegevens: het bestand ontbreekt, is geen bestand of kan helemaal niet worden geopend. Herstel de database voordat je opnieuw probeert.
- **De canonieke database ontbreekt terwijl de app is geïnstalleerd.** De app is aanwezig maar de opslag niet, wat een gewone upgrade niet oplost. Herstel een back-up in plaats van opnieuw te proberen.
- **Het installatiedoel is alleen-lezen.** De map waarin de bevoorrechte helper wordt geïnstalleerd, staat op een alleen-lezen aangekoppeld bestandssysteem. Schrijfbaar opnieuw aankoppelen vereist op de meeste panelen geen herstart. Het installatieprogramma noemt het gemeten bestandssysteem, dus controleer die regel voordat je aanneemt welke partitie wordt bedoeld.
- **Het installatiedoel heeft geen ruimte of geen vrije inodes.** Beide vermelden wat is gemeten en worden onderscheiden omdat een paneel van het ene niets en van het andere volop kan hebben.
- **Een onvolledige eerdere upgrade kon niet worden afgestemd.** Een eerdere run liet een herstelrecord achter dat niet met de huidige installatie kan worden verzoend. Er verandert niets. Dit vereist onderzoek van het herstelrecord in plaats van opnieuw proberen, want een nieuwe poging geeft dezelfde conclusie.
- **De app is enige tijd na installatie van de opvolger nog geïnstalleerd.** De nieuwe app is geïnstalleerd maar de oude is niet binnen de wachttijd verwijderd. Het paneel werkt; de verwijdering is niet voltooid.

Een weigering die terugdraaien noemt, vermeldt of dat is geverifieerd. 'Teruggedraaid en geverifieerd' betekent dat het paneel weer is zoals vóór de run. 'Terugdraaien kon niet worden geverifieerd' betekent dat de bevoorrechte helper moet worden gecontroleerd voordat je op bevoorrechte handelingen vertrouwt, ook al is de app zelf niet vervangen.
