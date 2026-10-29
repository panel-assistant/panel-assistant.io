---
title: Paneelprofielen van de gemeenschap
description: Profielen van de gemeenschap voor panelen die de paneel-app niet meelevert, hoe je ze veilig importeert en hoe je een camera inschakelt die een profiel niet vermeldt.
sidebar:
  label: Overzicht
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Dit is een catalogus van profielen van de gemeenschap die niet met ha-paneld worden meegeleverd. Een vermelding hier betekent niet dat ha-paneld draait op de genoemde winkelhardware zoals die wordt verkocht. Elk profiel kan betrekking hebben op een specifieke herinstallatie van firmware, firmwarewijziging of één gemelde installatie in plaats van de standaardsoftware van de fabrikant.

Profielen van de gemeenschap worden nooit automatisch geselecteerd. Download het afzonderlijke YAML-bestand, bekijk de bron, geteste firmware en beperkingen, en importeer het via de pagina **Profielen** van het paneel. Importeren en valideren tonen alleen een voorbeeld; ze slaan het profiel niet op en activeren het niet.

Controleer vóór het opslaan dat het voorbeeld meldt dat elk predicaat in één volledige matchgroep overeenkomt met de onveranderlijke apparaatgegevens van het paneel. Alleen een overeenkomende naam is onvoldoende. Activering controleert die identiteit strikt en weigert onveilige exclusieve touchscreenovername, maar controleert niet vooraf elke actieve route naar bevoegdheden. Na de gecontroleerde herstart onderzoeken de actieve drivers voor specifieke mogelijkheden hun interfaces en bevoegdheden wanneer ze worden geïnitialiseerd of gebruikt; niet-beschikbare mogelijkheden blijven niet beschikbaar en de opstartgezondheid bepaalt of het kandidaatprofiel actief blijft of wordt teruggedraaid. Beschouw een geslaagde import of activering nooit als bewijs dat elke opgegeven mogelijkheid werkt.

## Een profiel van de gemeenschap veilig uitproberen

1. Open de apparaatpagina van het paneel in Home Assistant, selecteer **Bezoeken** en open **Profielen**. Exporteer de actieve revisie en maak een actuele volledige paneelback-up. Gebruik bij rechtstreeks verbinden de gemelde HTTP-poort van het paneel (`http://<panel-ip>:8888/profiles` bij de standaardpoort).
2. Download en bekijk de YAML. Controleer dat de precieze aannames over firmware en wijzigingen van toepassing zijn op het paneel voor je.
3. Plak of upload de YAML op **Profielen** en valideer deze. Ga niet verder als de identiteitsmatch onvolledig is, een vereiste gecompileerde driver ontbreekt of een onveilige invoertoewijzing wordt gemeld. Validatie bewijst geen actieve hardwarebevoegdheden.
4. Sla de gevalideerde inhoud op als een inactieve lokale revisie. Opslaan verandert het actieve profiel nog steeds niet.
5. Test en activeer het alleen terwijl iemand het paneel kan zien en aanraken, volgens de [controlelijst voor profieltests](/nl/reference/profiles/testing/). Activering is gekoppeld aan de exacte profiel-ID, revisie en inhoudshash.
6. Bekijk na de herstart de actuele resultaten per mogelijkheid en controleer de actieve revisie, verwachte bediening en Home Assistant-entiteiten. Een niet-beschikbare route moet niet beschikbaar blijven en mag niet als geslaagd worden behandeld. Probeer **Terugdraaien** voordat je zonder toezicht op het profiel vertrouwt; een mislukte opstartgezondheidscontrole hoort automatisch terug te keren naar de laatst bekende goede revisie.

Teruggaan naar **Automatisch gebruiken** selecteert alleen een meegeleverd profiel of de behoudende Generic-terugvaloptie. Dit activeert een revisie van de gemeenschap niet automatisch opnieuw.

## De camera inschakelen op een paneel waarvan het profiel er geen vermeldt

De camera wordt aangeboden op elk paneel dat er een heeft: een camera die het profiel met `hardware.camera` vermeldt, of een camera die Android opsomt op een paneel waarvan het profiel niets vermeldt. Een bord met werkende camerahardware heeft daarom meestal helemaal geen profielvermelding nodig en de groep Camera verschijnt in **Configureren** zonder dat iemand YAML bewerkt.

Drie dingen kunnen deze toch laten ontbreken. De kaart Camera in **Configureren** vermeldt welke van toepassing is, in plaats van te verdwijnen:

- **Het profiel onderdrukt de camera.** `hardware.camera: false` is een bewuste derde toestand, anders dan het weglaten van de sleutel: dit zegt dat het opgesomde apparaat geen bruikbare kamercamera is, bijvoorbeeld een HDMI-capture-ingang. Verwijder de regel of stel deze in op `true` om de camera aan te bieden.
- **Android heeft geen camera opgesomd.** Als het paneel er wel een heeft, vermeld dan `hardware.camera: true` in het profiel. Een vermelding heeft voorrang op een lege opsomming, dus dit lost ook het geval op waarin de cameraservice aanwezig is maar de opsomming onbetrouwbaar is.
- **De opsomming heeft nog niet geantwoord.** Dit zegt niets over de hardware. Wacht enkele seconden en laad Configureren opnieuw; je hoeft niets te bewerken.

Een camera vermelden die het bord niet beschikbaar stelt is veilig. Een lichte runtimecontrole leest de lijst met Android-camera-ID's voor de rapportage van mogelijkheden; een vermelde camera wordt nog steeds aangeboden en een bord zonder camera weigert het openen met een geclassificeerde fout `no_camera_id` waarvan de actie aangeeft dat het profiel onjuist is. Dit maakt het paneel niet instabiel.

Eén vereiste hoort bij de vlag. Cameragebruik wordt geweigerd tenzij het paneel in de kamer kan tonen dat de camera open is, en bij een uitgeschakeld scherm vereist dat een route buiten het scherm. Zorg voor een werkende ledindicatie voor opnamen terwijl het scherm uit is. Bij een ingeschakeld scherm kan de schermindicator zonder led aan de vereiste voldoen. Stel `hardware.camera_lens_offset_px` zo in dat die indicator onder de lens staat in plaats van ernaast.

De vlag verandert niets anders aan de camera: deze blijft uit totdat je haar inschakelt, de schakelaar is nooit een voorgestelde standaardinstelling en inschakelen via de Home Assistant-camera-entiteit vraagt in elke beveiligingsmodus om goedkeuring op het eigen scherm van het paneel. De Camera-instelling in Configureren is een afzonderlijke configuratieroute voor de eigenaar.

## Catalogus

- [`community-cronos-lineageos18.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-cronos-lineageos18.yaml): een concept voor de Amazon Echo Show 5 Gen 2 van één bijdrager, voorzien van LineageOS 18.1. De standaard Fire OS kan ha-paneld niet uitvoeren; ontgrendelen, firmware opnieuw installeren en herstel worden niet ondersteund en het project heeft het profiel niet op hardware gevalideerd. Zie de [profielspecifieke bewijsnotities](/nl/reference/profiles/community/echo-show-5-gen2/).
- [`community-lenovo-thinksmart-view-lineageos.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-lenovo-thinksmart-view-lineageos.yaml): een concept voor de Lenovo ThinkSmart View van één bijdrager, voorzien van LineageOS 8.1. Het selecteert Android-slaapstand omdat helderheid nul zichtbaar verlicht blijft, legt vast dat aanraken het paneel niet wekt en vermeldt de bevestiging van de bijdrager dat Home Assistant het kan dimmen, volledig uitschakelen en weer wekken. Zie de [profielspecifieke bewijsnotities](/nl/reference/profiles/community/lenovo-thinksmart-view/).
- [`community-sunworld-yc-sm55p-p76s01.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/unofficial/community-sunworld-yc-sm55p-p76s01.yaml): een concept voor de 5,5-inch Sunworld YC-SM55P van één bijdrager op het Portworld P76S01-bord. Het profiel legt de door firmware ondersteunde RK3576S-identiteit en behoudende Android-bedieningsroutes vast, maar laat optionele sensoren en camerahardware uitgeschakeld totdat fysieke tests zijn uitgevoerd. De generieke Rockchip-buildidentiteit is niet veilig voor automatische selectie. Zie de [profielspecifieke bewijsnotities](/nl/reference/profiles/community/sunworld-yc-sm55p/).

Zie voor het profielformaat, de vertrouwensgrens en vereisten voor bijdragen de [gids voor runtimeprofielen](/nl/reference/profiles/), [formaatreferentie](/nl/reference/profiles/format/), [testcontrolelijst](/nl/reference/profiles/testing/) en [gids voor delen](/nl/reference/profiles/sharing/).
