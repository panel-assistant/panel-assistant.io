---
title: Panel Assistant is verplicht
description: Wat je moet doen als een paneel meldt dat Panel Assistant verplicht is, en de weg van een paneelapp met versie 0.9 naar Panel Assistant 1.0.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Een paneel dat **Panel Assistant is verplicht** toont met het adres van deze pagina, draait een paneelapp met versie 0.9 die nog geen verbinding heeft gemaakt met de Panel Assistant-integratie in Home Assistant. Je dashboardkeuze en paneelinstellingen staan nog op het paneel. Je hoeft het niet opnieuw te installeren of te resetten.

Panel Assistant 1.0 kan geen paneel overnemen dat nog de oude ha-paneld-app draait of waarvan de hardware-entiteiten nog MQTT gebruiken. Zo'n paneel gaat naar 1.0 via Panel Assistant 0.9.0, dat het paneel eerst migreert:

1. [Installeer de Panel Assistant-integratie via HACS](/nl/home-assistant/custom-integration/). Als je paneel nog de oude app draait of MQTT gebruikt, kies dan versie **0.9.0** vóór de eerste herstart; als je al Panel Assistant 1.0 hebt, volg dan [als een migratie niet is voltooid](/nl/manage/upgrade-to-1-0/#if-a-move-was-not-finished) voordat je van versie wisselt. Herstart Home Assistant wanneer HACS daarom vraagt.
2. Als je paneel al onder **Instellingen → Apparaten en diensten → Panel Assistant** verschijnt, hoef je niets opnieuw toe te voegen. Voeg anders je **bestaande paneel** daar toe met de hostnaam of het adres ervan; dit is geen nieuwe paneelinstallatie.
3. Open **Instellingen → Reparaties**. Als Panel Assistant meldt dat het paneel nog de oude ha-paneld-app draait, volg dan de bijbehorende reparatie om het paneel naar de Panel Assistant-app te migreren. Als de hardware-entiteiten van het paneel nog MQTT gebruiken, legt [een paneel migreren van MQTT](/nl/home-assistant/move-from-mqtt/) die overdracht uit, die door 0.9.0 wordt voltooid.
4. Als je 0.9.0 hebt geïnstalleerd, werk dan bij naar 1.0 zodra deze voor geen van je panelen een migratie vermeldt, zoals beschreven in [upgraden naar 1.0](/nl/manage/upgrade-to-1-0/).

Voor hulp bij het vinden van het adres van je paneel of het controleren van de verbinding, zie [Een paneel verbinden](/nl/home-assistant/connect-a-panel/) en [Problemen oplossen](/nl/manage/troubleshooting/).
