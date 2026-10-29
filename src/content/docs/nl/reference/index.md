---
title: Referentie
description: Technische referentie voor de paneel-app, met Home Assistant-entiteiten, apparaatprofielen, beveiligingskeuzes en bouwinstructies.
sidebar:
  label: Overzicht
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Deze pagina’s documenteren hoe de paneel-app onder de motorkap werkt: de interfaces die hij beschikbaar stelt, het profielformaat dat elk paneelmodel beschrijft en de beveiligingskeuzes achter beide. Je hebt ze niet nodig om Panel Assistant te installeren of te gebruiken.

## Interfaces

- [Bediening en Home Assistant-referentie](/nl/reference/api/): de entiteiten en diensten waarmee je een paneel automatiseert, en de pagina’s en eindpunten van het paneel op zijn HTTP-poort (standaard 8888).
- [Beveiliging](/nl/reference/security/): het vertrouwensmodel, het aanvalsoppervlak en de gemaakte keuzes.

## Apparaatprofielen

- [Paneelprofielen tijdens uitvoering](/nl/reference/profiles/): wat een profiel is en hoe je het schrijft, test en activeert.
- [Profielformaat en compatibiliteit](/nl/reference/profiles/format/): de volledige veldreferentie voor schema 2.
- [Profielen testen en problemen oplossen](/nl/reference/profiles/testing/): een stapsgewijze hardwaretest en herstelstappen.
- [Profielen delen en bijdragen](/nl/reference/profiles/sharing/): herkomst, veilig uitwisselen en vereisten voor meeleveren.
- [Architectuur van apparaatprofielen](/nl/reference/profiles/architecture/): hoe de app profielen vindt, vergelijkt en activeert.
- [Paneelprofielen van de gemeenschap](/nl/reference/profiles/community/): profielen voor panelen die de app niet meelevert.
  - [Echo Show 5 Gen 2 (LineageOS)](/nl/reference/profiles/community/echo-show-5-gen2/)
  - [Lenovo ThinkSmart View (LineageOS)](/nl/reference/profiles/community/lenovo-thinksmart-view/)
  - [Sunworld YC-SM55P](/nl/reference/profiles/community/sunworld-yc-sm55p/)

## De code

- [Ontwikkelomgeving](/nl/reference/development-environment/): de toolchain, bouwscripts en wat een fork moet weten over ondertekenen.
- [Codeverkenning op DeepWiki](https://deepwiki.com/panel-assistant/android): een begeleide rondleiding door de ha-paneld-broncode.
