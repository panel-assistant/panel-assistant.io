---
title: Upgraden naar 1.0
description: Home Assistant en je panelen overzetten van Panel Assistant 0.9 naar 1.0, en wat teruggaan betekent.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel Assistant 1.0 en de 1.0-paneel-app gaan samen over. De 1.0-integratie communiceert alleen met de 1.0-paneel-app, en de 1.0-paneel-app alleen met de 1.0-integratie. Geen van beide werkt dus met een 0.9-tegenhanger. Je werkt eerst de integratie bij en daarna elk paneel vanuit Home Assistant, en **een paneel waarop de 1.0-app draait, kan niet terug naar 0.9**. Lees de hele pagina voordat je begint.

## Voordat je begint

**Rond alles af wat 0.9.0 moet doen.** Gebruik Panel Assistant **0.9.0** en open **Instellingen**, **Reparaties**. Panel Assistant 1.0 kan een paneel niet meer van MQTT overzetten en kan ook een paneel met de oude ha-paneld-app niet meer overzetten, dus laat het beide ongemoeid. Vermeldt 0.9.0 een van beide voor een paneel, volg dan de reparatie totdat het paneel is overgezet; [Een paneel van MQTT overzetten](/nl/home-assistant/move-from-mqtt/) legt het MQTT-deel uit. Gebruik je een Panel Assistant ouder dan 0.9.0, werk dan eerst bij naar 0.9.0 en laat die het werk afronden.

**Maak een Home Assistant-back-up.** Maak onder **Instellingen**, **Systeem**, **Back-ups** een back-up en bewaar die totdat elk paneel 1.0 draait en je tevreden bent. Daarmee kun je de Home Assistant-kant terugzetten.

**Bewaar een back-up van elk paneel.** Open op de webinterface van elk paneel **Installeren** en dan **Back-up**, en bewaar het gedownloade `.hpb`-bestand. Panel Assistant slaat ook vóór elke update de paneelinstellingen op, maar je eigen kopie kun je zelf terugzetten.

## 1. Werk de integratie bij

1.0 wordt eerst als release candidate aangeboden. Open **Instellingen**, **Apparaten en diensten**, **HACS** en kies het apparaat **Panel Assistant**. Vouw de uitgeschakelde entiteiten uit en open **Pre-release**. Schakel in de instellingen ervan **Ingeschakeld** in en kies **Bijwerken**. Zet daarna de schakelaar **Pre-release** onder **Diagnostisch** aan. Ga terug naar Panel Assistant in HACS en download de 1.0-release candidate. Herstart Home Assistant wanneer HACS daarom vraagt of wanneer de reparatie **Herstart Home Assistant om het bijwerken van Panel Assistant af te ronden** verschijnt.

## 2. Controleer de reparaties

Open na de herstart opnieuw **Instellingen**, **Reparaties**.

- **'… heeft app 1.0.0-rc1 nodig'** is te verwachten op elk paneel met een 0.9-app. Tot de update kan Home Assistant dat paneel niet zien of bedienen en worden de entiteiten als niet beschikbaar getoond. Het paneel zelf blijft werken, met zijn instellingen en geschiedenis.
- **'… kan geen app-updates ontvangen'** betekent dat Panel Assistant geen installatie op dat paneel kan uitvoeren, meestal na een wijziging op het paneel zelf, zoals een firmware-update of reset. Verbind het paneel opnieuw via USB met Panel Assistant, zoals **Meer informatie** in de reparatie beschrijft, waarna de update beschikbaar wordt. Er wordt niets verwijderd: op een paneel waarop de app al staat, installeert het USB-installatieprogramma niets en zorgt het alleen dat Panel Assistant het weer kan bereiken.
- **'… is nooit van MQTT overgezet'** of **'… draait nog de oude app'** betekent dat een overstap in 0.9.0 niet is afgerond. Zie [Als een overstap niet is afgerond](#als-een-overstap-niet-is-afgerond).

## 3. Werk één paneel bij en daarna de rest

Zodra de release van de 1.0-paneel-app is gepubliceerd, biedt de update-entiteit van elk paneel in Home Assistant hem aan. Installeer hem eerst op één paneel en gebruik dat een tijdje voordat je de andere bijwerkt, want dat paneel kan niet terug. Panel Assistant maakt een back-up van de paneelinstellingen, installeert de update en bevestigt dat het paneel gezond is teruggekomen, zoals beschreven in [Updates en herstel](/nl/manage/updates-and-recovery/). Instellingen worden overgenomen uit de 0.9-paneel-app.

## Teruggaan

Er zijn twee helften, en die verschillen.

**Een paneel met de 1.0-app blijft op 1.0.** De paneel-app weigert een oudere versie over zichzelf te installeren, Panel Assistant biedt er nooit een aan en een 0.9-integratie kan er niet mee communiceren. Gedraagt een 1.0-paneel zich verkeerd, kijk dan bij [Problemen oplossen](/nl/manage/troubleshooting/) en meld het daarna met een [ondersteuningsrapport](/nl/home-assistant/support-report/), zodat het in de volgende release candidate kan worden opgelost.

**De integratie kan terug zolang geen enkel paneel 1.0 draait.** Herstel de Home Assistant-back-up die je vóór de start maakte. Daarmee draai je ook alle andere wijzigingen in Home Assistant sinds die back-up terug. Je panelen draaien nog hun 0.9-app en verbinden opnieuw met 0.9.0. Zodra een paneel de 1.0-app draait, maakt herstel van de back-up dat paneel onbereikbaar vanuit Home Assistant totdat de integratie weer op 1.0 staat.

Ga niet terug door in HACS 0.9.0 opnieuw over 1.0 te downloaden. De 1.0-update verwijdert een instelling waarop 0.9.0 vertrouwt. Zonder die instelling stuurt 0.9.0 al overgezette panelen terug naar MQTT, waarop de 1.0-paneel-app niet meer antwoordt. Herstel in plaats daarvan de back-up.

<a id="if-a-move-was-not-finished"></a>

## Als een overstap niet is afgerond

Zegt 1.0 dat een paneel nooit van MQTT is overgezet of nog de oude app draait, dan vraagt de reparatie je **Opnieuw downloaden** te kiezen in HACS, 0.9.0 te selecteren, de overstap daar af te ronden en daarna 1.0 opnieuw te installeren. Download 0.9.0 niet opnieuw over 1.0. Zolang geen van je panelen de 1.0-app draait, ga je om de bovenstaande reden terug naar 0.9.0 door de Home Assistant-back-up van vóór de update te herstellen. Rond daarna de overstap in 0.9.0 af en begin opnieuw aan deze pagina. Draaien andere panelen al de 1.0-app of heb je geen back-up van vóór de update, vraag dan op [Discord](https://panel-assistant.io/go/discord) of in de [issues](https://github.com/panel-assistant/ha-integration/issues) om hulp voordat je iets verandert.

Voor een paneel dat nog op MQTT zit, biedt de reparatie ook een nieuwe start: verwijder het apparaat van het paneel onder de MQTT-integratie en voeg het paneel opnieuw toe. Dat maakt nieuwe entiteiten aan en behoudt niets van de geschiedenis.
