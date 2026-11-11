---
title: Aan de slag
description: Van een leeg Android-wandpaneel naar je Home Assistant-dashboard in een paar minuten, waarbij Home Assistant je bij elke stap begeleidt.
sourceCommit: e919a9dd655eb7095993ae5e1e3b5dbe7af600c4
---

Als je al eens een wandpaneel of kiosk hebt ingericht, weet je waarschijnlijk nog hoe dat ging: apps sideloaden, zoeken naar een browser-engine die een dashboard kon tekenen, gokken naar instellingen, en de volgende herstart nooit helemaal vertrouwen. Een paneel instellen met Panel Assistant zal als een aangename schok komen. Je kunt binnen een paar minuten klaar zijn, en zelfs als het paneel al aan de muur hangt, hoef je niet uit je stoel op te staan. Oké, misschien één keer ;-)

Het lastigste deel van elk paneel is het eerste uur. Panel Assistant doet dat uur voor je, vanuit Home Assistant. Zit het paneel al op je netwerk, geef de integratie dan het adres en zij doet de rest. Zit het nog in de doos, sluit het dan met een USB-kabel aan op je laptop en installeer rechtstreeks vanuit je browser, nog voordat het aan de muur komt. Als het paneel je vraagt foutopsporing te autoriseren, keur de melding dan op het scherm goed en kijk mee tot de installatie klaar is.

## 1. Installeer de integratie

Installeer Panel Assistant op Home Assistant **2026.11 of nieuwer** via **Instellingen**, **Marketplace**. Installeer het op ondersteunde oudere versies, **2026.8.3 tot en met 2026.10**, via HACS en herstart Home Assistant. In Marketplace kun je de integratie mogelijk meteen instellen; volg eerst eventuele herstartmeldingen. Dit is het enige dat je handmatig installeert. Zie [De integratie installeren](/nl/home-assistant/custom-integration/) voor beide routes en updates.

:::note
Als je bijwerkt vanaf 0.9, lees dan vóór je begint [Upgraden naar 1.0](/nl/manage/upgrade-to-1-0/) en bewaar de daarin beschreven back-ups van Home Assistant en je panelen. Een paneel waarop de 1.0-app draait, kan niet terug naar 0.9.
:::

## 2. Schakel foutopsporing in op het paneel

Open de ontwikkelaarsopties op het paneel: open op de meeste panelen **Instellingen**, dan **Over**, en tik zeven keer op **Buildnummer**. Schakel daarna **USB-foutopsporing** in als je het paneel aansluit, of **netwerk-ADB op TCP-poort 5555** voor de netwerkroute. Niet elk paneel heeft een schakelaar voor netwerk-ADB; de [hardwarepagina’s](/nl/hardware/) vermelden bekende routes en geven aan wanneer de eerste toegang niet is geverifieerd. Is netwerktoegang niet beschikbaar, gebruik dan USB zodra USB-foutopsporing en een USB-datapoort voor je model zijn bevestigd. [Het paneel voorbereiden](/nl/install/prepare-a-panel/) geeft de details.

## 3. Voeg het paneel toe

Ga in Home Assistant naar **Instellingen**, **Apparaten en diensten**, **Integratie toevoegen** en kies **Panel Assistant**. Kies daarna hoe het paneel is verbonden.

### Aangesloten op je computer

Je kunt een gloednieuw paneel al instellen voordat je het aan de muur hangt. Sluit het met een USB-kabel aan op je computer en installeer het rechtstreeks vanuit je browser. Hiervoor heb je Chrome of Edge nodig. Nadat je **Installeer via USB op deze computer** hebt gekozen, selecteer je **Open het USB-installatieprogramma**, houd je de aanbevolen versie aan en druk je op **Doorgaan**; het installatieprogramma opent in een nieuw venster. Het paneel heeft nog steeds wifi nodig om de configuratie af te ronden, dus verbind het vóór of na de installatie met je netwerk via de eigen app Instellingen.

<div class="pa-steps" role="region" aria-label="Stap voor stap installeren via USB" tabindex="0">
<figure>
<figcaption><span>1</span> Kies Installeer via USB</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="De stap Een paneel instellen in Home Assistant, met de keuze Voeg een paneel op je netwerk toe of Installeer via USB op deze computer">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="De stap Een paneel instellen in Home Assistant, met de keuze Voeg een paneel op je netwerk toe of Installeer via USB op deze computer">
</figure>
<figure>
<figcaption><span>2</span> Sluit het paneel aan, druk op Mijn paneel zoeken en kies het paneel in de lijst van je browser</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-connect-dark.png" width="520" height="375" alt="Het USB-installatieprogramma vraagt je het paneel aan te sluiten en op Mijn paneel zoeken te drukken">
<img class="dark:sl-hidden" src="/screenshots/usb-connect-light.png" width="520" height="375" alt="Het USB-installatieprogramma vraagt je het paneel aan te sluiten en op Mijn paneel zoeken te drukken">
</figure>
<figure>
<figcaption><span>3</span> Sta foutopsporing op het paneel toe als daarom wordt gevraagd</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-allow-dark.png" width="520" height="263" alt="Het USB-installatieprogramma wacht terwijl je op het scherm van het paneel op Toestaan tikt">
<img class="dark:sl-hidden" src="/screenshots/usb-allow-light.png" width="520" height="263" alt="Het USB-installatieprogramma wacht terwijl je op het scherm van het paneel op Toestaan tikt">
</figure>
<figure>
<figcaption><span>4</span> Druk op Installeren</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-confirm-dark.png" width="520" height="323" alt="Het USB-installatieprogramma, klaar om te installeren, met één knop Installeren">
<img class="dark:sl-hidden" src="/screenshots/usb-confirm-light.png" width="520" height="323" alt="Het USB-installatieprogramma, klaar om te installeren, met één knop Installeren">
</figure>
<figure>
<figcaption><span>5</span> Kijk mee terwijl het installeert</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-progress-dark.png" width="520" height="309" alt="De voortgangsbalk van het USB-installatieprogramma tijdens het installeren van de app">
<img class="dark:sl-hidden" src="/screenshots/usb-progress-light.png" width="520" height="309" alt="De voortgangsbalk van het USB-installatieprogramma tijdens het installeren van de app">
</figure>
<figure>
<figcaption><span>6</span> Klaar</figcaption>
<img class="light:sl-hidden" src="/screenshots/usb-done-dark.png" width="520" height="308" alt="Het USB-installatieprogramma bevestigt de installatie en opent de installatiewizard van het paneel">
<img class="dark:sl-hidden" src="/screenshots/usb-done-light.png" width="520" height="308" alt="Het USB-installatieprogramma bevestigt de installatie en opent de installatiewizard van het paneel">
</figure>
</div>

### Op je netwerk

Als het paneel al aan de muur hangt, heeft Home Assistant alleen het adres nodig.

<div class="pa-steps" role="region" aria-label="Stap voor stap een paneel aan je netwerk toevoegen" tabindex="0">
<figure>
<figcaption><span>1</span> Kies Voeg een paneel op je netwerk toe</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-menu-dark.png" width="580" height="330" alt="De stap Een paneel instellen in Home Assistant, met de keuze Voeg een paneel op je netwerk toe of Installeer via USB op deze computer">
<img class="dark:sl-hidden" src="/screenshots/ha-menu-light.png" width="580" height="330" alt="De stap Een paneel instellen in Home Assistant, met de keuze Voeg een paneel op je netwerk toe of Installeer via USB op deze computer">
</figure>
<figure>
<figcaption><span>2</span> Geef het adres van het paneel op</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-address-dark.png" width="580" height="377" alt="De stap Een paneel toevoegen, met het IP-adres van het paneel ingevuld">
<img class="dark:sl-hidden" src="/screenshots/ha-address-light.png" width="580" height="377" alt="De stap Een paneel toevoegen, met het IP-adres van het paneel ingevuld">
</figure>
<figure>
<figcaption><span>3</span> Kies een versie als er meerdere worden aangeboden</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-version-dark.png" width="580" height="304" alt="De stap Kies een versie, met de aanbevolen release bovenaan de lijst">
<img class="dark:sl-hidden" src="/screenshots/ha-version-light.png" width="580" height="304" alt="De stap Kies een versie, met de aanbevolen release bovenaan de lijst">
</figure>
<figure>
<figcaption><span>4</span> Sta foutopsporing op het paneel toe als daarom wordt gevraagd</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-authorize-dark.png" width="580" height="354" alt="Home Assistant wacht totdat je Altijd toestaan vanaf deze computer aanvinkt en op Toestaan tikt op het paneel; daarna gaat het automatisch verder">
<img class="dark:sl-hidden" src="/screenshots/ha-authorize-light.png" width="580" height="354" alt="Home Assistant wacht totdat je Altijd toestaan vanaf deze computer aanvinkt en op Toestaan tikt op het paneel; daarna gaat het automatisch verder">
</figure>
<figure>
<figcaption><span>5</span> Open de installatiepagina van het paneel</figcaption>
<img class="light:sl-hidden" src="/screenshots/ha-done-dark.png" width="580" height="248" alt="Home Assistant biedt de installatiepagina van het paneel aan en vraagt je terug te keren en Gereed te kiezen nadat je die hebt afgerond">
<img class="dark:sl-hidden" src="/screenshots/ha-done-light.png" width="580" height="248" alt="Home Assistant biedt de installatiepagina van het paneel aan en vraagt je terug te keren en Gereed te kiezen nadat je die hebt afgerond">
</figure>
</div>

Als het paneel vraagt of foutopsporing is toegestaan, vink dan **Altijd toestaan vanaf deze computer** aan en tik op **Toestaan** op het paneel; Home Assistant gaat vanzelf verder. Bevestig daarna de installatie.

Hoe dan ook neemt de wizard het rommelige deel voor zijn rekening. Hij controleert wat er al op het paneel staat, installeert de huidige release van de paneel-app, start die en controleert of hij gezond is. Een paneel waarop de app al draait, wordt overgenomen, niet opnieuw geïnstalleerd. Het paneel herkent zijn eigen model en laadt het bijbehorende hardwareprofiel, zodat het scherm, de knoppen, de LED’s en de sensoren meteen klaar voor gebruik in Home Assistant verschijnen. Zie [Een paneel toevoegen](/nl/install/installing-ha-paneld/).

## 4. Rond af in de eigen wizard van het paneel

Daarna volgt de eigen installatiewizard van het paneel. Die wordt door het paneel aangeboden en opent in je browser op de computer, niet op het scherm van het paneel. Na een netwerkinstallatie toont Home Assistant **Rond de installatie van dit paneel af**: open de installatiepagina van het paneel, doorloop daar de stappen, keer terug naar Home Assistant en kies **Gereed**. Na een USB-installatie gaat het installatievenster meteen verder met de wizard. Omdat het paneel de wizard aanbiedt, laadt die alleen in een browser op hetzelfde netwerk als het paneel.

De wizard vraagt om een naam voor het paneel, meldt het paneel aan bij Home Assistant en vraagt welk dashboard het moet tonen en in welke ruimte het staat. Het paneel maakt verbinding met het Home Assistant-account waarmee je je aanmeldt. Als je browser als jou is aangemeld, kan het paneel dus als jou verbinden; wil je voor het paneel een eigen account gebruiken, meld je dan met dat account aan. Als entiteitsfiltering is ingeschakeld, laadt het paneel alleen de entiteiten die dat dashboard gebruikt, en daardoor blijft het snel. Zie [Een paneel verbinden](/nl/home-assistant/connect-a-panel/).

De configuratie kan worden afgerond, ook als de browser-engine van het paneel te oud is om een actueel Home Assistant-dashboard met de ingebouwde renderer weer te geven. De wizard waarschuwt als dit aandacht nodig heeft. Volg de [WebView-handleiding](/nl/hardware/guides/update-the-webview/) voordat je op het dashboard vertrouwt; alleen het afronden van de configuratie bevestigt niet dat het dashboard kan laden.

<div class="pa-steps pa-steps--panel" role="region" aria-label="De installatiewizard voor het paneel, stap voor stap" tabindex="0">
<figure>
<figcaption><span>1</span> Geef het paneel een naam</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-name-dark.png" width="524" height="702" alt="De installatiewizard van het paneel vraagt om een paneel-ID en een weergavenaam, met een voorbeeld van de entiteitsnamen die Home Assistant zal gebruiken">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-name-light.png" width="524" height="702" alt="De installatiewizard van het paneel vraagt om een paneel-ID en een weergavenaam, met een voorbeeld van de entiteitsnamen die Home Assistant zal gebruiken">
</figure>
<figure>
<figcaption><span>2</span> Meld je aan bij Home Assistant</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-sign-in-dark.png" width="524" height="688" alt="De wizard biedt aan je aan te melden vanuit deze browser of op het paneel, met het Home Assistant-account waarmee het paneel moet verbinden">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-sign-in-light.png" width="524" height="688" alt="De wizard biedt aan je aan te melden vanuit deze browser of op het paneel, met het Home Assistant-account waarmee het paneel moet verbinden">
</figure>
<figure>
<figcaption><span>3</span> Kies het dashboard en de ruimte</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-dashboard-dark.png" width="524" height="485" alt="De wizard met een dashboard en een Home Assistant-ruimte geselecteerd voor het paneel">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-dashboard-light.png" width="524" height="485" alt="De wizard met een dashboard en een Home Assistant-ruimte geselecteerd voor het paneel">
</figure>
<figure>
<figcaption><span>4</span> Schakel het entiteitsfilter in als daarom wordt gevraagd</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-filter-dark.png" width="524" height="636" alt="De wizard die het entiteitsfilter aanbeveelt voor dit paneel, met het aantal entiteiten in Home Assistant">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-filter-light.png" width="524" height="636" alt="De wizard die het entiteitsfilter aanbeveelt voor dit paneel, met het aantal entiteiten in Home Assistant">
</figure>
<figure>
<figcaption><span>5</span> Bijna klaar</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-almost-there-dark.png" width="524" height="339" alt="De wizard wacht terwijl het paneel zijn gefilterde entiteitsset samenstelt en het dashboard laadt">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-almost-there-light.png" width="524" height="339" alt="De wizard wacht terwijl het paneel zijn gefilterde entiteitsset samenstelt en het dashboard laadt">
</figure>
<figure>
<figcaption><span>6</span> Alles klaar</figcaption>
<img class="light:sl-hidden" src="/screenshots/panel-setup-done-dark.png" width="524" height="526" alt="De wizard die bevestigt dat het paneel is ingesteld en het dashboard weergeeft">
<img class="dark:sl-hidden" src="/screenshots/panel-setup-done-light.png" width="524" height="526" alt="De wizard die bevestigt dat het paneel is ingesteld en het dashboard weergeeft">
</figure>
</div>

## Wat je nodig hebt

- Home Assistant 2026.8.3 of nieuwer. Gebruik de ingebouwde Marketplace op 2026.11 of nieuwer, of HACS op ondersteunde oudere versies.
- Een ARM-wandpaneel met Android 8.0 of nieuwer en toegang tot foutopsporing. De meeste panelen werken met het generieke hardwareprofiel, en [Een paneel kiezen](/nl/install/supported-panels/) noemt de modellen met volledige hardware-ondersteuning.
- Voor de USB-optie heb je een op Chromium gebaseerde browser nodig, zoals Chrome of Edge.

## Waar de details staan

De pagina’s onder **Draaiend houden** behandelen elke functie van de paneel-app uitgebreid. Het referentiegedeelte documenteert de [API](/nl/reference/api/), [hardwareprofielen](/nl/reference/profiles/) en het [beveiligingsmodel](/nl/reference/security/), en de [hardwarepagina’s](/nl/hardware/) behandelen elk ondersteund paneel.
