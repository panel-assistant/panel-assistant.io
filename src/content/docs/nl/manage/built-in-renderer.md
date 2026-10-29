---
title: De ingebouwde renderer
description: Hoe de paneel-app zelf je Home Assistant-dashboard tekent, van fouten herstelt en ontvangen entiteiten filtert.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

De paneel-app tekent je Home Assistant-dashboard in zijn eigen WebView in plaats van het aan een afzonderlijke dashboardapp over te laten. Daardoor kan hij na een appherstart snel terugkeren: hij opent het laatste dashboard dat Home Assistant voor dezelfde server, account en startdashboardinstelling heeft geverifieerd, terwijl hij op de achtergrond de huidige dashboardlijst controleert. Meldt Home Assistant dat het dashboard is verwijderd of de accountstandaard is gewijzigd, dan gaat het paneel naar de huidige keuze.

Zodra het dashboard draait, kan de paneel-app een vastgelopen verbinding detecteren, opgehoopt WebView-geheugen vrijgeven en renderercrashes opvangen. De ingebouwde verbinding maakt ook entiteitsfiltering mogelijk. Het paneel blijft een apparaat met één app om te installeren en bij te werken.

De ingebouwde renderer is verreweg de voorkeursroute om je dashboard te tonen en wordt door begeleid instellen gekozen. Een afzonderlijke dashboardapp blijft als optie ondersteund, bijvoorbeeld wanneer een paneel meer dan één Home Assistant-server of native meldingen nodig heeft (zie [Beperkingen](#beperkingen)). Assist-spraakbediening hangt niet van een dashboardapp af: op een paneel met microfoon biedt de eigen [spraakassistent](/nl/manage/voice-assistant/) die, ongeacht welke app draait.

## Opstarten en herstel

De renderer gebruikt de gedocumenteerde Home Assistant-interface `?external_auth=1`, zodat de paneel-app kan zien wanneer het dashboard is verbonden in plaats van de pagina als een zwarte doos te behandelen. Hij:

- Opent na een appherstart het laatste geverifieerde dashboard terwijl hij op de achtergrond de Home Assistant-dashboardlijst vernieuwt. Eerst wordt nog een korte compatibiliteitscontrole uitgevoerd. Het onthouden dashboard is aan server, account en ingesteld dashboard gebonden. Een expliciet ingesteld dashboard of tabblad heeft altijd voorrang.
- Bevriest de pagina terwijl het scherm uit staat en hervat bij ontwaken, wat ’s nachts ongeveer 70% renderer-CPU bespaart.
- Herlaadt een dashboard dat opende maar nooit verbond. Nieuwe pogingen worden na herhaalde fouten minder frequent en het paneel toont duidelijk **Opnieuw verbinden met Home Assistant…** in plaats van een browserfoutpagina.
- Herhaalt herstelbare controles met oplopende vertraging. Een blijvend geweigerde aanmelding stopt de pogingen en toont instructies voor Browseraanmelding. Een niet-ondersteunde Home Assistant-versie of ongeschikte WebView vermeldt de benodigde update en wacht daarop.
- Geeft opgehoopt geheugen vrij door onzichtbaar te herladen terwijl het scherm uit staat.
- Vangt renderercrashes op en begrenst hun frequentie. Een pagina die blijft crashen, valt terug op de beheerlauncher in plaats van de hele nacht opnieuw te starten.
- Toont een native melding wanneer Home Assistant aankondigt te stoppen of offline gaat, en wist die pas zodra Home Assistant aantoonbaar terug is.

Trek vanaf de uiterste bovenrand omlaag om te verversen, of tweemaal om volledig te herladen. De renderer ondersteunt ook optioneel terugkeren naar het startdashboard bij inactiviteit, automatisch afspelen van camerastreams en HTTPS met een door de gebruiker geïnstalleerde private certificaatautoriteit. **Android-systeembalken verbergen** geeft een dashboard van rand tot rand; veeg vanaf een schermrand om de balken weer te tonen. Op panelen met de softwarematige navigatiebalk van de app brengt **Dashboard** de renderer naar voren zonder herladen en is **Opnieuw laden** een afzonderlijke herstelactie.

**Zoom (%)** past de weergavegrootte van het dashboard aan, standaard 100%. De renderer voegt **App-instellingen** toe aan de Home Assistant-zijbalk om de paneelconfiguratie te openen. Bij de eerste start verbergt hij de vastgezette zijbalk en houdt de verbinding bij inactiviteit levend; je kunt de zijbalk later openen of deze standaarden wijzigen. De afzonderlijke optie **Navigatie van Home Assistant verbergen (native)** vraagt de frontend om zijn navigatie te verwijderen terwijl native kioskmodus actief is. Heeft het dashboard simpelweg de verkeerde grootte, zie dan [Beeldschermgrootte](/nl/manage/display-sizing/).

## Vereisten en compatibiliteit

De ingebouwde renderer vereist beide:

- **Home Assistant 2026.4.2 of nieuwer**; en
- een Android System WebView die de beveiligde WebMessage-listener van de native hostinterface van Home Assistant ondersteunt.

De meeste mensen hebben alleen een actuele Android System WebView nodig. De paneel-app controleert de WebView-mogelijkheid en verifieert Home Assistant-compatibiliteit voordat hij het dashboard laadt.

Toont het paneel **Home Assistant-upgrade vereist**, werk Home Assistant dan bij en kies **Opnieuw proberen**. Niets op het paneel kan dit vervangen.

Toont het **De webviewer van dit paneel is te oud**, volg dan [De WebView bijwerken](/nl/hardware/guides/update-the-webview/). In de nog niet uitgebrachte versie 1.0.0-rc2 kan een vanuit Home Assistant gestarte paneel-app-update ook een geverifieerde, compatibele WebView installeren wanneer het paneel dat toestaat. Andere panelen vereisen de methode in de handleiding. Kies na de WebView-update **Opnieuw proberen**.

De ingebouwde renderer valt nooit terug op een minder geïsoleerde brug. Een andere renderer kan helpen als Home Assistant zelf niet kan worden bijgewerkt, maar elke dashboardapp op het paneel gebruikt dezelfde systeem-WebView en kan een verouderde dus niet omzeilen.

## Instellen

Kies op een nieuw of gereset paneel **Instellen** op het paneel zelf, of open de instelpagina vanaf een laptop of telefoon (bijvoorbeeld `http://<panel>:8888/setup` met de standaardpoort). Begeleid instellen kiest de renderer, meldt aan bij Home Assistant, selecteert de accountstandaard, een dashboard of specifiek tabblad en vraagt naar het entiteitsfilter voordat het eerste dashboard laadt. Autorisatie gebeurt in de browser van de beheerder, dus er worden geen aanmeldgegevens op het paneel getypt.

Is het paneel al ingesteld, kies dan **Bezoeken** op zijn apparaatpagina in Home Assistant en open **Configureren**. Voer onder **Home Assistant-verbinding** de Home Assistant-URL in, kies **Inloggen via de browser** en selecteer **Ingebouwde renderer** als dashboardapp.

## Dashboarduiterlijk en Android-vergrendeling

Geavanceerde instellingen op Configureren hebben drie onafhankelijke opties, elk voor een andere laag:

| Optie in Configureren                                                     | Wat verandert                                                                                                                                                                                                                                        | Wat **niet** verandert                                                                                                                                                                                            |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Navigatie van Home Assistant verbergen (native)** (standaard uit)       | Vraagt de frontend na verbinding de navigatie te verbergen. Alleen ingebouwde renderer.                                                                                                                                                              | Vergrendelt Android niet, verbergt geen Android-systeembalken en injecteert of wijzigt geen dashboard-CSS. Wijst Home Assistant het verzoek af of ondersteunt het dit niet, dan blijft het dashboard ongewijzigd. |
| **Android-systeembalken verbergen** (standaard aan)                       | Verbergt de Android-status- en navigatiebalk voor een dashboard van rand tot rand. Veeg vanaf een rand om ze te tonen. Alleen ingebouwde renderer.                                                                                                   | Voorkomt niet dat iemand de app verlaat en verbergt geen eigen Home Assistant-menu’s en navigatie.                                                                                                                |
| **Android vergrendelen op het dashboard (experimenteel)** (standaard uit) | Verbergt met root de Android-systeembalken en keert binnen ongeveer drie seconden terug naar het gekozen dashboard wanneer een andere app of Recente apps opent. Ontmoedigt toevallig gebruik; geen beveiligingsgrens tegen een vastberaden persoon. | Verandert het dashboarduiterlijk niet. Werkt niet zonder root. Na herstart is er een ontgrendeld herstelvenster van 60 seconden, waarna de opgeslagen vergrendeling weer geldt.                                   |

Zet voor een rustiger dashboard **Navigatie van Home Assistant verbergen (native)** aan zodra niemand die navigatie op het paneel nodig heeft; **Android-systeembalken verbergen** staat al aan. Zet **Android vergrendelen op het dashboard** alleen aan om gemakkelijk ontsnappen uit de app te ontmoedigen en test eerst de uitwegen: Configureren, de Home Assistant-schakelaar, `adb`, zeven snelle tikken linksboven of het ontgrendelde venster na herstart.

## Entiteitsfilter

:::caution
Automatisch leren kan niet elke afhankelijkheid van een aangepaste kaart of dynamische template bewijzen. Een onvolledige entiteitenset kan ontbrekende of verouderde kaarten geven. Controleer de geleerde set na dashboardwijzigingen en houd de uitschakelroute bij de hand.
:::

Het filter geldt alleen voor de ingebouwde renderer. Het wijzigt het frontendabonnement op Home Assistant, zodat Home Assistant toestanden filtert vóór serialisatie en verzending. Andere dashboardapps worden niet beïnvloed. [Prestaties](/nl/manage/performance/) legt uit waarom dit meestal de grootste verbetering op een traag paneel is.

### Automatische werkwijze

1. Kies **Bezoeken** op de apparaatpagina in Home Assistant, open **Configureren**, dan **Dashboard**, selecteer **Ingebouwde renderer** en schakel **Entiteitsfiltering** in.
2. Open het tabblad **Entiteiten** en kies **Dashboard nu scannen**.
3. Bezoek elk dashboardtabblad en gebruik bediening, pop-ups en voorwaardelijke inhoud, zodat het paneel tijdens uitvoering de afhankelijkheden kan waarnemen.
4. Controleer de lijsten met huidige, voorgestelde en uitgesloten entiteiten. Zet entiteiten vast die aangepaste kaarten of templates indirect gebruiken en los de entiteitsfiltercontroles boven de tabellen op.
5. Kies **Beleidsset toepassen** zodra de kandidaat klaar is. Het paneel toont het oude en nieuwe aantal entiteiten, vraagt bevestiging en herlaadt daarna met het gefilterde abonnement.

![Het tabblad Entiteiten van de webinterface, met het abonnementsfilter, de huidige geabonneerde entiteiten en voorgestelde entiteiten](/screenshots/ui-entities-dark.png)

De pagina Entiteiten legt uit waarom elke entiteit is gevonden, bewaart handmatige vastzettingen en uitsluitingen en houdt herkende brede of dynamische regels zichtbaar totdat je ze oplost of expliciet beslist hoe verder te gaan. Niet-herkend gedrag kan nog bestaan, dus test elk tabblad na inschakeling. Ontbreekt iets, zet **Entiteitsfiltering** dan uit op Configureren en herlaad voordat je de kandidaat herziet.

### Wanneer het paneel het dashboard tegenhoudt

Met automatisch filteren aan opent de ingebouwde renderer Home Assistant nooit ongefilterd. Totdat een scan een verantwoorde set heeft opgeleverd, toont het paneel om één van drie redenen een native wachtscherm in plaats van het dashboard. Tijdens een eerste of mislukte scan herhaalt het paneel die met oplopende tussenpozen, omdat Home Assistant meestal nog niet beschikbaar is. Weigert Home Assistant de aanmeldgegevens, dan noemt het scherm de aanmelding. Is de scan klaar maar is een regel niet af te bakenen, zoals een door een strategie gegenereerd dashboard of onbegrensde selector, dan vraagt het scherm om een besluit: gemarkeerde regels negeren en doorgaan, het filter uitzetten of ze op Entiteiten bekijken. Dat kan op het paneel of vanaf elk apparaat op het netwerk: kies **Bezoeken** op de apparaatpagina in Home Assistant en open **Entiteiten** (bijvoorbeeld `http://<panel>:8888/entities` met de standaardpoort). Het wachtscherm toont ook het adres.

Wachten op een besluit is een stabiele toestand, dus het paneel scant de catalogus dan niet opnieuw. Het vraagt vijf minuten nadat die toestand is bereikt en daarna hooguit elk uur aan Home Assistant of het dashboard is gewijzigd. Het scant alleen opnieuw wanneer de dashboardconfiguratie of accountstandaard werkelijk verandert, een besluit wordt genomen of de Home Assistant-instellingen van het paneel wijzigen.

Een paneel-app-update kan een al gefilterd dashboard opnieuw laten controleren. Markeert die hercontrole een regel op een dashboard waarop al een filter actief was, dan registreert het paneel die regel als genegeerd, herstelt de gebruikte entiteitenset en opent het dashboard in plaats van het tegen te houden. De regel blijft zichtbaar op Entiteiten en kan daar weer worden ingeschakeld. Dit geldt alleen voor een door een update veroorzaakte hercontrole, alleen met een eerder geaccepteerd filter en alleen als de herstelde set niet leeg is. Regels die nooit genegeerd mogen worden, zoals een te groot dashboard om te analyseren, houden de renderer nog steeds tegen.

### Templates en handmatig vastzetten

De paneel-app voert dashboardtemplates niet uit en weet dus niet welke entiteiten ze teruggeven. Hij gokt niet. Hij behandelt de twee soorten entiteiten waarmee een template werkt anders.

Entiteiten die een template alleen **leest**, zoals een toestand in een voorwaarde, vereisen niets. Home Assistant rendert de template zelf en stuurt het resultaat via een afzonderlijk abonnement waarop het filter geen invloed heeft. Die entiteiten horen niet in de lijsten op Entiteiten te staan; toevoegen zou het abonnement zonder voordeel vergroten.

Entiteiten die een template **teruggeeft**, zijn anders. Die worden dashboardkaarten die hun toestand via het gefilterde abonnement lezen, dus moeten ze daarin zitten. Het paneel kan ze niet ontdekken zonder de template uit te voeren. Doorgaan na een entiteitsontdekkingscontrole voegt ze ook niet toe; die keuze laat alleen automatische updates zonder hen doorgaan.

Typ om er één toe te voegen een deel van de naam of ID in het zoekvak bovenaan Entiteiten. Het doorzoekt de volledige Home Assistant-catalogus, niet alleen gevonden entiteiten, en toont het aantal overeenkomsten per tabel. Zet elke benodigde entiteit op **Vastgezet**. Handmatig vastzetten blijft gelden totdat je het verwijdert, ook over dashboardwijzigingen en nieuwe scans heen.

### Geleerde gegevens resetten

Gebruik **Geleerde gegevens resetten** op Entiteiten als oude dashboardgegevens of eerdere handmatige besluiten de kandidaat misleidend maken. Na bevestiging wist dit geleerde dashboardlidmaatschappen en bewijs, handmatige vastzettingen en uitsluitingen en genegeerde veiligheidsbesluiten. Het behoudt het bekende goede actieve filter en de Home Assistant-catalogus voor kandidaatnamen, en start een nieuwe scan als leren aan staat. Resetten bouwt dus de kandidaat opnieuw op in plaats van het abonnement direct naar alle Home Assistant-toestanden te verbreden.

## Thema’s

**Dashboard-thema** (Configureren, dan Ingebouwde renderer) bepaalt wie licht of donker kiest:

- **Home Assistant volgen** (standaard) laat Home Assistant kiezen. Het paneel levert alleen een beginpunt: op Android 13 en nieuwer volgt het de systeeminstelling live, op Android 10 tot 12 bij het laden van het dashboard en op Android 9 en ouder via **Donkere modus** (Configureren, dan Beeldscherm). Een in Home Assistant gekozen thema heeft voorrang.
- **Omgevingslicht** kiest licht of donker met het kamermodel van Automatische helderheid. Automatische helderheid moet aan staan; tot bruikbare metingen binnenkomen, volgt het Home Assistant. Een verandering vereist een volle minuut aanhoudend licht of donker.
- **Donker** en **Licht** laten het paneel kiezen. Dit is voor een kioskdashboard met verborgen zijbalk, waarbij de Home Assistant-profielpagina helemaal niet bereikbaar is vanaf het paneel.

Een thema afdwingen verandert alleen het lichte of donkere deel. Een benoemd thema en de kleuren blijven gelijk. Terugschakelen naar Home Assistant volgen herstelt dat deel naar de eerdere keuze, of Auto als niets was ingesteld. Het paneel wijzigt nooit het thema van je Home Assistant-account, dus Donker op het paneel maakt je telefoon niet donker.

Eén geval kan het niet overrulen. Heeft deze gebruiker in Home Assistant expliciet Licht of Donker gekozen in plaats van Auto, dan blijft die keuze leidend. Overrulen zou een instelling wijzigen die gedeeld is met elk ander apparaat waarop die gebruiker is aangemeld. Zet het gebruikersthema op Auto of geef het paneel een eigen Home Assistant-gebruiker, dan geldt de paneelkeuze. Het paneel vermeldt dit: de kaart **Runtime-diagnostiek** zegt dat het Home Assistant-thema Dashboardthema overrult, en de regel `[renderer]` in `/diag` bevat `theme_overridden=true`.

De webinterface van het paneel staat hier los van en volgt altijd de browser waarin je haar bekijkt.

## Een afzonderlijke dashboardapp gebruiken

Heeft een paneel een van de mogelijkheden onder [Beperkingen](#beperkingen) nodig, open dan Configureren en kies de andere geïnstalleerde dashboardapp onder **Dashboard-app**. De wissel geldt direct. Kies hiervoor niet **Auto**, want dat gebruikt de ingebouwde renderer zodra die klaar is.

## Beperkingen

- **Geen ondersteuning voor meerdere Home Assistant-servers of native meldingen.** Houd een afzonderlijke dashboardapp waar die nodig zijn. Assist-spraakbediening valt hier niet onder: die komt op een paneel met microfoon van de eigen [spraakassistent](/nl/manage/voice-assistant/), ongeacht de actieve dashboardapp.
- **Geen extra schermvullende mediafuncties**, zoals een bestandskiezer of castachtig afspelen. Die vallen buiten de reikwijdte.
- Een **actuele systeem-WebView** blijft nodig voor de Home Assistant-frontend. Een verouderde WebView geeft een gezondheidswaarschuwing in de webinterface; werk die bij met de [methode voor je paneel](/nl/hardware/guides/update-the-webview/).
- Browseraanmelding en de geavanceerde niet-interactieve installatie werken beide zonder root.
