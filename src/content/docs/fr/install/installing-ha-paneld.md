---
title: Ajouter un panneau
description: Ajouter un panneau depuis Home Assistant, par le réseau ou avec un câble USB.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

L’ajout d’un panneau se fait depuis Home Assistant, sans ligne de commande. Deux méthodes sont possibles ; toutes deux aboutissent à l’apparition du panneau comme appareil.

Quelle que soit la méthode choisie, commencez par [Préparer le panneau](/fr/install/prepare-a-panel/).

## Par le réseau

Pour un panneau déjà connecté à votre réseau. Allez dans **Paramètres**, **Appareils et services**, ajoutez **Panel Assistant** et indiquez l’adresse du panneau. L’intégration vérifie ce qui se trouve sur le panneau, vous demande si nécessaire d’approuver une invite de débogage sur l’écran du panneau, vous demande de confirmer l’installation, installe l’application du panneau, la démarre, puis crée l’appareil. Si le panneau exécute déjà l’application, elle l’adopte, ce qui est plus rapide.

## Par USB

Pour un panneau encore dans sa boîte, ou dont le logiciel du fabricant complique l’accès réseau. Branchez-le à votre ordinateur portable et installez-le depuis votre navigateur avec le câble USB. Votre navigateur reste connecté à Home Assistant, qui fournit la version vérifiée ; le panneau n’a pas besoin d’ADB réseau. Lancez le parcours depuis **Paramètres**, **Appareils et services**, **Ajouter une intégration**, **Panel Assistant**, **Installer par USB sur cet ordinateur** ; il nécessite un navigateur basé sur Chromium. Voir [Installer par USB](/fr/install/install-over-usb/).

Dans la version 1.0.0-rc2 non encore publiée, les deux installateurs peuvent aussi demander une mise à jour vérifiée et compatible du moteur de navigateur sur les panneaux pris en charge. Une mise à jour qui n’aboutit pas n’empêche ni la configuration ni l’association ; voir [Préparer le panneau](/fr/install/prepare-a-panel/) pour la récupération.

## Les protections de l’installateur

Les deux méthodes vérifient le panneau avant de modifier quoi que ce soit. La méthode réseau adopte une application existante au lieu de la réinstaller. L’USB n’écrase pas une autre installation existante ; si la version exacte sélectionnée est déjà installée, il termine sa configuration. Une installation USB interrompue peut être relancée avec la même version ; l’installateur vérifie ce qui a déjà été fait avant de continuer. Pour les sauvegardes avant une mise à jour de l’application, voir [Mises à jour et récupération](/fr/manage/updates-and-recovery/).

## Après l’installation

Le panneau apparaît comme appareil avec un capteur d’état et des diagnostics, ainsi que sur la page Panel Assistant de la barre latérale. Vous terminez ensuite dans l’assistant de configuration du panneau, où vous lui donnez un nom et choisissez son tableau de bord. Tant que la configuration n’est pas terminée, l’écran du panneau affiche un code QR et un bouton **Configurer** : vous pouvez donc aussi terminer depuis un téléphone ou sur le panneau lui-même. Pour changer de tableau de bord ultérieurement, ouvrez la page de l’appareil du panneau dans Home Assistant et sélectionnez **Visiter**. Si vous ouvrez directement l’adresse du panneau, utilisez le port HTTP qu’il indique ; le port par défaut est 8888.

Continuez avec [Connecter un panneau](/fr/home-assistant/connect-a-panel/).
