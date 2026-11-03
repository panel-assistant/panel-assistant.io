---
title: Panel Assistant est obligatoire
description: Que faire lorsqu'un panneau indique que Panel Assistant est obligatoire, et comment passer d'une application pour panneau en version 0.9 à Panel Assistant 1.0.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Un panneau qui affiche **Panel Assistant est obligatoire** avec l'adresse de cette page exécute une application pour panneau en version 0.9 qui ne s'est pas encore connectée à l'intégration Panel Assistant dans Home Assistant. Votre choix de tableau de bord et les paramètres du panneau sont toujours sur le panneau. Vous n'avez pas besoin de le réinstaller ni de le réinitialiser.

Panel Assistant 1.0 ne peut pas reprendre la gestion d'un panneau qui exécute encore l'ancienne application ha-paneld ou dont les entités matérielles utilisent encore MQTT. Un tel panneau passe à la version 1.0 par l'intermédiaire de Panel Assistant 0.9.0, qui en effectue d'abord la migration :

1. [Installez l'intégration Panel Assistant via HACS](/fr/home-assistant/custom-integration/). Si votre panneau exécute encore l'ancienne application ou utilise MQTT, choisissez la version **0.9.0** avant le premier redémarrage ; si vous avez déjà Panel Assistant 1.0, suivez les instructions de la section [si une migration n'a pas été terminée](/fr/manage/upgrade-to-1-0/#si-une-migration-na-pas-été-terminée) avant de changer de version. Redémarrez Home Assistant lorsque HACS vous le demande.
2. Si votre panneau apparaît déjà dans **Paramètres → Appareils et services → Panel Assistant**, vous n'avez pas besoin de l'ajouter à nouveau. Sinon, ajoutez-y votre **panneau existant** à l'aide de son nom d'hôte ou de son adresse ; il ne s'agit pas de l'installation d'un nouveau panneau.
3. Ouvrez **Paramètres → Corrections**. Si Panel Assistant indique que le panneau exécute encore l'ancienne application ha-paneld, suivez la correction qu'il propose pour migrer le panneau vers l'application Panel Assistant. Si les entités matérielles du panneau utilisent encore MQTT, la page [migrer un panneau depuis MQTT](/fr/home-assistant/move-from-mqtt/) explique ce transfert, que la version 0.9.0 mène à son terme.
4. Si vous avez installé la version 0.9.0, passez à la version 1.0 dès qu'elle ne répertorie plus aucune migration pour aucun de vos panneaux, comme l'explique la page [mise à niveau vers la version 1.0](/fr/manage/upgrade-to-1-0/).

Pour vous aider à trouver l'adresse de votre panneau ou à vérifier sa connexion, consultez [Connecter un panneau](/fr/home-assistant/connect-a-panel/) et [Dépannage](/fr/manage/troubleshooting/).
