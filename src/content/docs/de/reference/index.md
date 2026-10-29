---
title: Referenz
description: Technische Referenz zur Panel-App mit ihren Home Assistant-Entitäten, Geräteprofilen, Sicherheitskonzept und Build-Anleitung.
sidebar:
  label: Übersicht
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Diese Seiten dokumentieren die Technik hinter der Panel-App: die bereitgestellten Schnittstellen, das Profilformat zur Beschreibung der einzelnen Panelmodelle und die Sicherheitsentscheidungen hinter beidem. Für die Installation oder Nutzung von Panel Assistant benötigst du keine davon.

## Schnittstellen

- [Steuerung und Home Assistant-Referenz](/de/reference/api/): die Entitäten und Dienste zum Automatisieren eines Panels sowie seine Seiten und Endpunkte auf seinem HTTP-Port (standardmäßig 8888).
- [Sicherheitskonzept](/de/reference/security/): das Vertrauensmodell, die Angriffsfläche und die getroffenen Entscheidungen.

## Geräteprofile

- [Panelprofile zur Laufzeit](/de/reference/profiles/): was ein Profil ist und wie du es schreibst, testest und aktivierst.
- [Profilformat und Kompatibilität](/de/reference/profiles/format/): die vollständige Feldreferenz für Schema 2.
- [Profile testen und Fehler beheben](/de/reference/profiles/testing/): eine schrittweise Hardware-Testfolge und Wiederherstellungsschritte.
- [Profile teilen und beitragen](/de/reference/profiles/sharing/): Herkunft, sicherer Austausch und Anforderungen für die Aufnahme in die App.
- [Geräteprofil-Architektur](/de/reference/profiles/architecture/): wie die App Profile auflöst, zuordnet und aktiviert.
- [Panelprofile der Community](/de/reference/profiles/community/): Profile für Panels, die die App nicht mitliefert.
  - [Echo Show 5 Gen 2 (LineageOS)](/de/reference/profiles/community/echo-show-5-gen2/)
  - [Lenovo ThinkSmart View (LineageOS)](/de/reference/profiles/community/lenovo-thinksmart-view/)
  - [Sunworld YC-SM55P](/de/reference/profiles/community/sunworld-yc-sm55p/)

## Der Code

- [Entwicklungsumgebung](/de/reference/development-environment/): die Werkzeuge, Build-Skripte und was ein Fork über Signierung wissen muss.
- [Code-Rundgang auf DeepWiki](https://deepwiki.com/panel-assistant/android): eine geführte Tour durch den ha-paneld-Quellcode.
