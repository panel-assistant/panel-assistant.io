---
title: Problèmes connus de la version 1.0.2
description: Limites connues de Panel Assistant 1.0.2 et de l’application du panneau correspondante, et mesures à prendre.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Panel Assistant 1.0.2 et l’application du panneau correspondante sont des versions stables. Cette page répertorie les limites connues et les mesures à prendre pour chacune. Lisez d’abord [Passer à la version 1.0](/fr/manage/upgrade-to-1-0/) : cette page décrit les conditions préalables à l’installation et explique pourquoi un panneau en version 1.0 ne peut pas revenir à la version 0.9. Signalez tout autre problème dans le [suivi des tickets](https://github.com/panel-assistant/ha-integration/issues), avec le modèle du panneau et ce que vous avez observé.

## Un panneau encore sous l’application 0.9 peut nécessiter le rétablissement de sa connexion ADB

La Réparation indiquant qu’un panneau a besoin de l’application 1.0 signifie que son application ne peut pas encore communiquer avec Panel Assistant 1.0. Si Home Assistant indique aussi que le panneau ne peut pas recevoir de mises à jour de l’application, suivez cette Réparation pour rétablir sa voie de mise à jour. Pour un panneau dont le débogage réseau est désactivé, branchez-le à votre ordinateur et lancez l’installateur USB depuis Home Assistant, comme décrit dans [un panneau qui ne peut pas être mis à jour](/fr/manage/updates-and-recovery/#un-panneau-qui-ne-peut-pas-être-mis-à-jour). Sur un panneau où l’application est déjà installée, l’installateur USB peut rétablir la connexion sans réinstaller : si l’invite apparaît, cochez **Toujours autoriser depuis cet ordinateur** et appuyez sur **Autoriser** sur le panneau. L’installateur réactive le débogage réseau pour que Home Assistant puisse mettre à jour l’application.

## La barre latérale ne peut pas ouvrir un panneau tant qu’il n’exécute pas l’application 1.0

Dans la version 1.0, la barre latérale Panel Assistant affiche les pages d’un panneau via sa propre connexion à Home Assistant. Un panneau encore sous une application 0.9 ne peut pas y ouvrir ses pages. Mettez d’abord à jour l’application du panneau.

## La voix est activée au départ lorsque le profil de l’appareil déclare un microphone

La voix est activée par défaut lorsque le profil de l’appareil du panneau déclare un microphone, sauf si vous l’aviez déjà désactivée. Si vous ne souhaitez pas que le panneau écoute un mot de réveil, désactivez **Assistant vocal** sous **Voix** sur la page **Configurer** du panneau.

## Un code PIN de verrouillage peut être nécessaire après une extinction complète de l’écran

Sur les panneaux dont la méthode d’extinction de l’écran utilise le délai de mise en veille d’Android ou l’administration de l’appareil, un code PIN de verrouillage configuré peut être demandé au réveil de l’écran. Supprimez le code PIN si le panneau doit afficher directement son tableau de bord au réveil.

## Deux entités ont disparu

L’entité image distincte pour les instantanés de la caméra est supprimée ; utilisez l’entité caméra du panneau. Sur un panneau équipé d’un haut-parleur, le nombre distinct de volume est supprimé ; utilisez le volume du lecteur multimédia, avec `media_player.volume_set`. Une Réparation nomme les automatisations et scripts qui utilisent encore le nombre de volume. Il n’existe pas de Réparation équivalente pour l’image d’instantané supprimée : vérifiez vous-même les éléments qui l’utilisent.

## Restaurer une sauvegarde sur un panneau sans root peut ignorer certains réglages

Une sauvegarde de réglages créée sur un panneau rooté peut contenir des réglages qu’un panneau sans root ne peut pas appliquer. La restauration répertorie les réglages indisponibles qu’elle ignore et applique ceux qui sont pris en charge. Vérifiez le résultat de la restauration pour repérer les réglages ignorés ou les échecs.
