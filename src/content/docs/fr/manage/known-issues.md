---
title: Problèmes connus
description: Limites connues de Panel Assistant et de l’application du panneau correspondante, et mesures à prendre.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Cette page répertorie les limites connues et les mesures à prendre pour chacune. Signalez tout autre problème dans le [suivi des tickets](https://github.com/panel-assistant/ha-integration/issues), avec le modèle du panneau et ce que vous avez observé.

## La voix est activée au départ lorsque le profil de l’appareil déclare un microphone

La voix est activée par défaut lorsque le profil de l’appareil du panneau déclare un microphone, sauf si vous l’aviez déjà désactivée. Si vous ne souhaitez pas que le panneau écoute un mot de réveil, désactivez **Assistant vocal** sous **Voix** sur la page **Configurer** du panneau.

## Un code PIN de verrouillage peut être nécessaire après une extinction complète de l’écran

Sur les panneaux dont la méthode d’extinction de l’écran utilise le délai de mise en veille d’Android ou l’administration de l’appareil, un code PIN de verrouillage configuré peut être demandé au réveil de l’écran. Supprimez le code PIN si le panneau doit afficher directement son tableau de bord au réveil.

## Deux entités ont disparu

L’entité image distincte pour les instantanés de la caméra est supprimée ; utilisez l’entité caméra du panneau. Sur un panneau équipé d’un haut-parleur, le nombre distinct de volume est supprimé ; utilisez le volume du lecteur multimédia, avec `media_player.volume_set`. Une Réparation nomme les automatisations et scripts qui utilisent encore le nombre de volume. Il n’existe pas de Réparation équivalente pour l’image d’instantané supprimée : vérifiez vous-même les éléments qui l’utilisent.

## Restaurer une sauvegarde sur un panneau sans root peut ignorer certains réglages

Une sauvegarde de réglages créée sur un panneau rooté peut contenir des réglages qu’un panneau sans root ne peut pas appliquer. La restauration répertorie les réglages indisponibles qu’elle ignore et applique ceux qui sont pris en charge. Vérifiez le résultat de la restauration pour repérer les réglages ignorés ou les échecs.
