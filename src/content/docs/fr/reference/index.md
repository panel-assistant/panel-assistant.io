---
title: Référence
description: Référence technique de l’application du panneau, couvrant ses entités Home Assistant, les profils d’appareil, sa sécurité et sa compilation.
sidebar:
  label: Vue d’ensemble
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Ces pages décrivent le fonctionnement interne de l’application du panneau : les interfaces qu’elle expose, le format des profils qui décrivent chaque modèle de panneau et les choix de sécurité associés. Vous n’en avez pas besoin pour installer ou utiliser Panel Assistant.

## Interfaces

- [Référence des commandes et de Home Assistant](/fr/reference/api/) : les entités et services pour automatiser un panneau, ainsi que les pages et points de terminaison du panneau sur son port HTTP (8888 par défaut).
- [Sécurité](/fr/reference/security/) : le modèle de confiance, la surface d’attaque et les décisions prises.

## Profils d’appareil

- [Profils de panneau à l’exécution](/fr/reference/profiles/) : ce qu’est un profil et comment en écrire, tester et activer un.
- [Format des profils et compatibilité](/fr/reference/profiles/format/) : la référence complète des champs du schéma 2.
- [Tester et dépanner les profils](/fr/reference/profiles/testing/) : une séquence progressive de tests matériels et les étapes de récupération.
- [Partager et contribuer des profils](/fr/reference/profiles/sharing/) : provenance, échange sûr et exigences pour l’intégration à l’application.
- [Architecture des profils d’appareil](/fr/reference/profiles/architecture/) : comment l’application résout, fait correspondre et active les profils.
- [Profils de panneau communautaires](/fr/reference/profiles/community/) : des profils de panneaux que l’application n’intègre pas.
  - [Echo Show 5 Gen 2 (LineageOS)](/fr/reference/profiles/community/echo-show-5-gen2/)
  - [Lenovo ThinkSmart View (LineageOS)](/fr/reference/profiles/community/lenovo-thinksmart-view/)
  - [Sunworld YC-SM55P](/fr/reference/profiles/community/sunworld-yc-sm55p/)

## Le code

- [Environnement de développement](/fr/reference/development-environment/) : la chaîne d’outils, les scripts de compilation et ce qu’un fork doit savoir sur la signature.
- [Visite guidée du code sur DeepWiki](https://deepwiki.com/panel-assistant/android) : un parcours guidé du code source de ha-paneld.
