---
title: Een paneel overzetten vanaf MQTT
description: De entiteiten van een paneel overdragen van de MQTT-integratie van Home Assistant aan Panel Assistant, met behoud van hun entiteits-ID’s, geschiedenis en aanpassingen.
sourceCommit: fa1d23a12549f2afa3962f9797cd8c52a38db322
---

Tot nu toe bereikten het scherm, de leds, knoppen en sensoren van een paneel Home Assistant via de MQTT-integratie. Panel Assistant kan die entiteiten nu zelf beheren en praat dan met het paneel via de eigen verbinding van Home Assistant in plaats van via een broker. MQTT-ondersteuning wordt vóór versie 1.0 uit ha-paneld verwijderd, waarna een paneel helemaal geen broker meer nodig heeft, en op deze pagina lees je hoe je daar alvast op vooruitloopt.

Je zet één paneel tegelijk over, en elke overstap kun je terugdraaien. De entiteiten van het paneel houden hun entiteits-ID’s, hun geschiedenis en elke naam, elk pictogram of elke ruimte die je ze hebt gegeven, zodat dashboards en automatiseringen die ze gebruiken gewoon blijven werken.

:::caution[Vroege toegang]
Het overzetten is nieuw. Probeer het eerst op één paneel en laat ons op [Discord](https://panel-assistant.io/go/discord) of in de [issues](https://github.com/panel-assistant/ha-integration/issues) weten hoe het ging.
:::

## Voordat je begint

- **Panel Assistant 0.3.0 of nieuwer** in Home Assistant, geïnstalleerd via HACS zoals beschreven in [De integratie installeren](/nl/home-assistant/custom-integration/).
- **ha-paneld 0.9.8-rc1 of nieuwer** op het paneel. Dit is een pre-release: zet op de statuspagina van het paneel **Kanaal voor automatische updates van ha-paneld** op `prerelease` en installeer daarna de update via de update-entiteit van het paneel in Home Assistant.
- **Het paneel is aangemeld bij Home Assistant**; dat is zo als het je dashboard toont.
- **Laat je MQTT-configuratie zoals hij is.** Het paneel blijft de broker gebruiken terwijl je overzet, en daar hoeft niets aan te veranderen.

## 1. Zet de entiteiten van Panel Assistant aan

Voeg dit toe aan `configuration.yaml` en herstart daarna Home Assistant:

```yaml
panel_assistant:
  native_entities: true
```

Er wordt nog niets overgezet. Elk paneel dat Panel Assistant kent, krijgt op zijn Panel Assistant-apparaat een tweede set entiteiten naast de MQTT-entiteiten, zodat je de twee kunt vergelijken. Als je een paneel overzet, nemen zijn MQTT-entiteiten de plaats in van deze tweede set.

## 2. Voeg het paneel toe aan Panel Assistant

Sla deze stap over als het paneel al onder Panel Assistant staat in **Instellingen**, **Apparaten en diensten**.

Kies **Integratie toevoegen**, dan **Panel Assistant**, dan **Voeg een paneel op je netwerk toe**, en voer de hostnaam of het adres van het paneel in. Panel Assistant ziet dat ha-paneld al draait en biedt **Verbind met Home Assistant** aan. Er wordt niets op het paneel opnieuw geïnstalleerd.

## 3. Bevestig de gebruiker van het paneel

Als het paneel voor het eerst verbinding maakt, toont Home Assistant een reparatie: **Bevestig de Home Assistant-gebruiker voor** je paneel. Open die via **Instellingen**, **Reparaties**, controleer of de genoemde gebruiker het account is waarmee het paneel zich aanmeldt, en bevestig.

Het paneel probeert het zelf opnieuw, dus het kan tot 15 minuten duren voordat de reparatie verschijnt, en na je bevestiging kan het paneel er nog eens zo lang over doen om verbinding te maken.

## 4. Zet het paneel over

Open het Panel Assistant-item van het paneel onder **Apparaten en diensten**, kies **Configureren**, zet **Besturing** op **Panel Assistant** en sla op.

Het item wordt opnieuw geladen en het paneel maakt opnieuw verbinding. Zijn MQTT-entiteiten gaan over naar Panel Assistant, en zodra het paneel de overstap heeft bevestigd, wordt het MQTT-apparaat van het paneel verwijderd. Reken erop dat de entiteiten een paar seconden als niet beschikbaar worden getoond, en nog een keer zo’n 30 seconden later, terwijl alles zich instelt. Het activiteitenlogboek van het apparaat loopt vol met statuswijzigingen terwijl elke entiteit zich meldt; dat is normaal.

Vanaf nu gaat het wijzigen van een instelling of het indrukken van een knop op de entiteiten van het paneel via Panel Assistant. Zolang een paneel niet is overgezet, antwoorden dezelfde bedieningselementen dat het paneel via MQTT wordt bestuurd.

### Wat niet meegaat

Twee MQTT-knoppen hebben geen tegenhanger in Panel Assistant, **Update ha-paneld** en **Update Companion app**, dus die worden verwijderd, samen met een eventueel overgebleven MQTT-update-entiteit voor ha-paneld. De Panel Assistant-update-entiteit van het paneel neemt hun taak over.

Als je een van die entiteiten een eigen naam, pictogram of ruimte hebt gegeven, of hem hebt verborgen of uitgeschakeld, verwijdert Panel Assistant hem niet voor je. In plaats daarvan meldt een reparatie hem, en het paneel houdt zijn MQTT-entiteiten totdat je die entiteit verwijdert of die instellingen wist.

## Een paneel terugzetten

Open **Configureren** opnieuw en zet **Besturing** op **MQTT, met native rapporten ter vergelijking** of op **MQTT**. De entiteiten gaan terug naar de MQTT-integratie met dezelfde entiteits-ID’s en geschiedenis, en het paneel kondigt zijn MQTT-apparaat weer aan.

Zet een paneel altijd op deze manier terug. Verwijder het Panel Assistant-item van een paneel niet zolang Panel Assistant het bestuurt: Home Assistant wist bij het verwijderen de entiteiten van dat item, en hoewel Panel Assistant ze eerst teruggeeft, kan een aangepaste entiteit onderweg zijn naam, pictogram of ruimte kwijtraken.

## Bekende beperkingen

- **Sommige sensoren blijven niet beschikbaar.** Een paneel kan entiteiten aanbieden voor sensoren die zijn hardware niet rapporteert, zoals nabijheid, temperatuur of luchtvochtigheid. Het zijn nieuwe Panel Assistant-entiteiten, geen overgezette, dus als je ze uitschakelt, verlies je niets.
- **Oudere ha-paneld op een overgezet paneel.** Als een overgezet paneel later wordt teruggezet naar een versie onder 0.9.8-rc1, kondigt het zijn MQTT-entiteiten opnieuw aan. Panel Assistant schakelt de duplicaten uit en maakt een reparatie aan, **Update ha-paneld**, die verdwijnt zodra het paneel is bijgewerkt.
- **Meldingen bij herstart.** Terwijl Home Assistant herstart, hoort een paneel waarvan het account geen beheerder is dat nog steeds via MQTT. Dat is nog een reden om de broker voorlopig te laten draaien.
