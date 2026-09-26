---
title: Aan de slag
description: Van een leeg Android-wandpaneel naar je Home Assistant-dashboard in een paar minuten, waarbij Home Assistant je bij elke stap begeleidt.
sourceCommit: 50fccda5c7e05cce0edbd2b4b37e006c473ca5df
---

Als je al eens een wandpaneel of kiosk hebt ingericht, weet je waarschijnlijk nog hoe dat ging: apps sideloaden, zoeken naar een browser-engine die een dashboard kon tekenen, gokken naar instellingen, en de volgende herstart nooit helemaal vertrouwen. Een paneel instellen met Panel Assistant zal als een aangename schok komen. Je kunt binnen een paar minuten klaar zijn, en zelfs als het paneel al aan de muur hangt, hoef je niet uit je stoel op te staan. Oké, misschien één keer ;-)

Het lastigste deel van elk paneel is het eerste uur. Panel Assistant doet dat uur voor je, vanuit Home Assistant. Zit het paneel al op je netwerk, geef de integratie dan het adres en zij doet de rest. Zit het nog in de doos, sluit het dan met een USB-kabel aan op je laptop en installeer rechtstreeks vanuit je browser, nog voordat het aan de muur komt. Hoe dan ook bevestig je één melding op het paneel en kijk je mee tot het klaar is.

## 1. Installeer de integratie

Voeg Panel Assistant toe via HACS en start Home Assistant opnieuw op. Dit is het enige dat je handmatig moet installeren. Vanaf hier begeleidt Home Assistant je verder. Zie [De integratie installeren](/nl/home-assistant/custom-integration/).

## 2. Schakel foutopsporing in op het paneel

Open de ontwikkelaarsopties op het paneel en schakel draadloze foutopsporing in, of USB-foutopsporing als je het paneel aansluit. Daardoor kan Home Assistant het installeren voor je doen. De [hardwarepagina’s](/nl/hardware/) laten per model zien waar de schakelaar zit, en [Het paneel voorbereiden](/nl/install/prepare-a-panel/) geeft de details.

## 3. Voeg het paneel toe

Ga in Home Assistant naar **Instellingen**, **Apparaten en diensten**, **Integratie toevoegen** en kies **Panel Assistant**. Kies daarna hoe het paneel is verbonden.

### Aangesloten op je computer

Je kunt een gloednieuw paneel al instellen voordat je het aan de muur hangt. Sluit het met een USB-kabel aan op je computer en installeer het rechtstreeks vanuit je browser. Hiervoor heb je Chrome of Edge nodig.

<div class="pa-steps" role="region" aria-label="Stap voor stap installeren via USB" tabindex="0">
<figure>
<figcaption><span>1</span> Kies Installeer via USB</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="De stap Een paneel instellen in Home Assistant, met de keuze Voeg een paneel op je netwerk toe of Installeer via USB op deze computer">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="De stap Een paneel instellen in Home Assistant, met de keuze Voeg een paneel op je netwerk toe of Installeer via USB op deze computer">
</figure>
<figure>
<figcaption><span>2</span> Sluit het paneel aan</figcaption>
<img class="light:sl-hidden" src="asset:usb-connect-dark.png" width="520" height="349" alt="Het USB-installatieprogramma vraagt je het paneel aan te sluiten en op Find my panel te drukken">
<img class="dark:sl-hidden" src="asset:usb-connect-light.png" width="520" height="349" alt="Het USB-installatieprogramma vraagt je het paneel aan te sluiten en op Find my panel te drukken">
</figure>
<figure>
<figcaption><span>3</span> Tik op Toestaan op het paneel</figcaption>
<img class="light:sl-hidden" src="asset:usb-allow-dark.png" width="520" height="318" alt="Het USB-installatieprogramma wacht terwijl je op het scherm van het paneel op Toestaan tikt">
<img class="dark:sl-hidden" src="asset:usb-allow-light.png" width="520" height="318" alt="Het USB-installatieprogramma wacht terwijl je op het scherm van het paneel op Toestaan tikt">
</figure>
<figure>
<figcaption><span>4</span> Druk op Install</figcaption>
<img class="light:sl-hidden" src="asset:usb-confirm-dark.png" width="520" height="349" alt="Het USB-installatieprogramma, klaar om te installeren, met één knop Install">
<img class="dark:sl-hidden" src="asset:usb-confirm-light.png" width="520" height="349" alt="Het USB-installatieprogramma, klaar om te installeren, met één knop Install">
</figure>
<figure>
<figcaption><span>5</span> Kijk mee terwijl het installeert</figcaption>
<img class="light:sl-hidden" src="asset:usb-progress-dark.png" width="520" height="319" alt="De voortgangsbalk van het USB-installatieprogramma tijdens het installeren van de app">
<img class="dark:sl-hidden" src="asset:usb-progress-light.png" width="520" height="319" alt="De voortgangsbalk van het USB-installatieprogramma tijdens het installeren van de app">
</figure>
<figure>
<figcaption><span>6</span> Klaar</figcaption>
<img class="light:sl-hidden" src="asset:usb-done-dark.png" width="520" height="262" alt="Het USB-installatieprogramma bevestigt de installatie en opent de installatiewizard van het paneel">
<img class="dark:sl-hidden" src="asset:usb-done-light.png" width="520" height="262" alt="Het USB-installatieprogramma bevestigt de installatie en opent de installatiewizard van het paneel">
</figure>
</div>

### Op je netwerk

Als het paneel al aan de muur hangt, heeft Home Assistant alleen het adres nodig.

<div class="pa-steps" role="region" aria-label="Stap voor stap een paneel aan je netwerk toevoegen" tabindex="0">
<figure>
<figcaption><span>1</span> Kies Voeg een paneel op je netwerk toe</figcaption>
<img class="light:sl-hidden" src="asset:ha-menu-dark.png" width="580" height="314" alt="De stap Een paneel instellen in Home Assistant, met de keuze Voeg een paneel op je netwerk toe of Installeer via USB op deze computer">
<img class="dark:sl-hidden" src="asset:ha-menu-light.png" width="580" height="314" alt="De stap Een paneel instellen in Home Assistant, met de keuze Voeg een paneel op je netwerk toe of Installeer via USB op deze computer">
</figure>
<figure>
<figcaption><span>2</span> Geef het adres van het paneel op</figcaption>
<img class="light:sl-hidden" src="asset:ha-address-dark.png" width="580" height="378" alt="De stap Een paneel toevoegen, met het IP-adres van het paneel ingevuld">
<img class="dark:sl-hidden" src="asset:ha-address-light.png" width="580" height="378" alt="De stap Een paneel toevoegen, met het IP-adres van het paneel ingevuld">
</figure>
<figure>
<figcaption><span>3</span> Kies een versie</figcaption>
<img class="light:sl-hidden" src="asset:ha-version-dark.png" width="580" height="305" alt="De stap Kies een versie, met de aanbevolen release bovenaan de lijst">
<img class="dark:sl-hidden" src="asset:ha-version-light.png" width="580" height="305" alt="De stap Kies een versie, met de aanbevolen release bovenaan de lijst">
</figure>
<figure>
<figcaption><span>4</span> Tik op Toestaan op het paneel, en het is toegevoegd</figcaption>
<img class="light:sl-hidden" src="asset:ha-done-dark.png" width="580" height="210" alt="De stap Succes, die bevestigt dat het paneel aan Home Assistant is toegevoegd">
<img class="dark:sl-hidden" src="asset:ha-done-light.png" width="580" height="210" alt="De stap Succes, die bevestigt dat het paneel aan Home Assistant is toegevoegd">
</figure>
</div>

Hoe dan ook neemt de wizard het rommelige deel voor zijn rekening. Hij controleert wat er al op het paneel staat, installeert de huidige release van de paneel-app, start die en controleert of hij gezond is. Een paneel waarop de app al draait, wordt overgenomen, niet opnieuw geïnstalleerd. Het paneel herkent zijn eigen model en laadt het bijbehorende hardwareprofiel, zodat het scherm, de knoppen, de LED’s en de sensoren meteen klaar voor gebruik in Home Assistant verschijnen. Zie [Een paneel toevoegen](/nl/install/installing-ha-paneld/).

## 4. Rond af in de eigen wizard van het paneel

Daarna opent Home Assistant de eigen installatiewizard van het paneel, die een paar korte vragen stelt, waaronder een naam voor het paneel en het dashboard voor aan de muur. Het paneel laadt alleen de entiteiten die dat dashboard toont, en daardoor blijft het snel. Zie [Een paneel verbinden](/nl/home-assistant/connect-a-panel/).

<div class="pa-steps pa-steps--panel" role="region" aria-label="De installatiewizard voor het paneel, stap voor stap" tabindex="0">
<figure>
<figcaption><span>1</span> Geef het paneel een naam</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-name-dark.png" width="524" height="702" alt="De installatiewizard van het paneel vraagt om een paneel-ID en een weergavenaam, met een voorbeeld van de entiteitsnamen die Home Assistant zal gebruiken">
<img class="dark:sl-hidden" src="asset:panel-setup-name-light.png" width="524" height="702" alt="De installatiewizard van het paneel vraagt om een paneel-ID en een weergavenaam, met een voorbeeld van de entiteitsnamen die Home Assistant zal gebruiken">
</figure>
<figure>
<figcaption><span>2</span> Kies het dashboard en de ruimte</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-dashboard-dark.png" width="524" height="485" alt="De wizard met een dashboard en een Home Assistant-ruimte geselecteerd voor het paneel">
<img class="dark:sl-hidden" src="asset:panel-setup-dashboard-light.png" width="524" height="485" alt="De wizard met een dashboard en een Home Assistant-ruimte geselecteerd voor het paneel">
</figure>
<figure>
<figcaption><span>3</span> Schakel het entiteitsfilter in</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-filter-dark.png" width="524" height="629" alt="De wizard die het entiteitsfilter aanbeveelt voor dit paneel, met het aantal entiteiten in Home Assistant">
<img class="dark:sl-hidden" src="asset:panel-setup-filter-light.png" width="524" height="629" alt="De wizard die het entiteitsfilter aanbeveelt voor dit paneel, met het aantal entiteiten in Home Assistant">
</figure>
<figure>
<figcaption><span>4</span> Bijna klaar</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-almost-there-dark.png" width="524" height="339" alt="De wizard wacht terwijl het paneel zijn gefilterde entiteitsset samenstelt en het dashboard laadt">
<img class="dark:sl-hidden" src="asset:panel-setup-almost-there-light.png" width="524" height="339" alt="De wizard wacht terwijl het paneel zijn gefilterde entiteitsset samenstelt en het dashboard laadt">
</figure>
<figure>
<figcaption><span>5</span> Alles klaar</figcaption>
<img class="light:sl-hidden" src="asset:panel-setup-done-dark.png" width="524" height="526" alt="De wizard die bevestigt dat het paneel is ingesteld en het dashboard weergeeft">
<img class="dark:sl-hidden" src="asset:panel-setup-done-light.png" width="524" height="526" alt="De wizard die bevestigt dat het paneel is ingesteld en het dashboard weergeeft">
</figure>
</div>

## Wat je nodig hebt

- Home Assistant 2026.8.3 of nieuwer, met HACS.
- Een wandpaneel met Android 8.0 of nieuwer. De meeste panelen werken met het generieke hardwareprofiel, en [Een paneel kiezen](/nl/install/supported-panels/) noemt de modellen met volledige hardware-ondersteuning.
- Voor de USB-optie heb je een op Chromium gebaseerde browser nodig, zoals Chrome of Edge.

## Waar de details staan

De pagina’s onder **Draaiend houden** behandelen elke functie van de paneel-app uitgebreid. Het referentiegedeelte documenteert de [API](/nl/reference/api/), [hardwareprofielen](/nl/reference/profiles/) en het [beveiligingsmodel](/nl/reference/security/), en de [hardwarepagina’s](/nl/hardware/) behandelen elk ondersteund paneel.
