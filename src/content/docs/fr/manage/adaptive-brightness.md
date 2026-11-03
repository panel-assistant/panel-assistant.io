---
title: Luminosité adaptative
description: Laissez le panneau apprendre la luminosité de sa pièce et régler lui-même la luminosité de son écran, sans automatisation Home Assistant.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

La luminosité adaptative est un régulateur facultatif intégré au panneau qui apprend le profil normal de luminosité ambiante autour de lui et ajuste l'écran sans automatisation Home Assistant. Elle est désactivée par défaut, et le réglage habituel de la luminosité, manuel ou via Home Assistant, reste disponible qu'elle soit activée ou désactivée.

![L'onglet Configurer de l'interface web du panneau, avec la carte Affichage présentant la Source de lumière ambiante, la Luminosité auto, le Niveau minimal, la Sensibilité et le graphique d'apprentissage quotidien de la lumière ambiante](/screenshots/ui-configure-dark.png)

## Choisir la source de lumière

Ouvrez **Configurer**, puis **Affichage**, et choisissez **Source de lumière ambiante** :

- Laissez ce champ vide pour utiliser le capteur de luminosité propre au panneau, lorsque le profil matériel actif et la vérification en temps réel des capacités du panneau l'exposent tous les deux.
- Sélectionnez une seule entité d'éclairement Home Assistant lorsque le panneau ne possède pas lui-même de capteur adapté, ou lorsqu'un capteur situé ailleurs dans la pièce représente mieux la lumière que les personnes voient réellement.

Une source Home Assistant est lue au moyen d'un abonnement unique à cette seule entité plutôt qu'au flux complet des états. Si aucune des deux sources n'est disponible, l'application du panneau laisse la régulation adaptative indisponible plutôt que de faire une estimation à partir de l'heure de la journée.

Lorsqu'une entité d'éclairement Home Assistant sert de source, le panneau peut initialiser son profil appris avec jusqu'à sept jours de l'historique existant de cette entité. Cela donne à la luminosité automatique un point de départ utile au lieu d'attendre que de nouvelles mesures s'accumulent. Il faut pour cela que les états de l'entité soient enregistrés dans l'historique et que le service d'historique de Home Assistant soit disponible ; si aucun historique exploitable n'est renvoyé, l'apprentissage commence simplement à partir des nouvelles mesures.

## L'activer et l'ajuster

Activez **Luminosité auto** dans la même carte Affichage. Le régulateur conserve jusqu'à sept jours d'historique de luminosité ambiante sur le panneau et apprend le profil normal pour chaque moment de la journée. Une brève hausse au-dessus de ce profil, comme l'allumage d'une lampe dans la pièce, peut faire monter le niveau proposé au-dessus du niveau de référence.

**Niveau minimal** définit le niveau le plus bas que la régulation automatique proposera et redimensionne la plage apprise entre **Niveau minimal** et **Niveau maximal**. Il va de 4 % à 99 %. Le seuil de 4 % correspond au minimum propre au rétroéclairage (il ne s'éteint jamais), donc toute valeur inférieure déplacerait la commande sans modifier l'écran. Ce réglage ne limite pas la luminosité manuelle, qui peut toujours être réglée plus bas.

**Niveau maximal** plafonne la luminosité automatique, de 5 % à 100 %, au-dessus du minimum sélectionné. Ce réglage ne limite pas la luminosité manuelle.

**Sensibilité** détermine la part de l'écart par rapport au profil appris qui est appliquée à l'écran, une fois que le régulateur a jugé cet écart réel. À 0 %, il ignore l'écart et utilise uniquement le profil appris. Des valeurs plus faibles donnent une réponse plus stable, et la valeur par défaut de 50 % laisse autant de marge de réglage dans les deux sens. Il ne s'agit pas d'une commande suivant directement la lumière : une brève augmentation de luminosité n'est prise en compte qu'une fois qu'elle a duré assez longtemps ou qu'elle a augmenté assez brusquement pour être significative, et tant que le profil quotidien est encore en cours d'apprentissage, l'écran suit la lumière mesurée quelle que soit la valeur de ce réglage.

Le graphique sur sept jours donne un aperçu de la plage observée, du niveau de référence appris et du niveau proposé, avant l'activation du régulateur ou pendant qu'il est actif. Les modifications non enregistrées de Niveau minimal, Niveau maximal et Sensibilité apparaissent dans l'aperçu sans réécrire l'historique stocké.

L'historique est associé à la source sélectionnée et à un contexte approximatif de pièce et de temps, issu de la localisation et du fuseau horaire de Home Assistant. Un changement significatif de localisation, de fuseau horaire ou de source démarre un historique distinct, plutôt que d'appliquer discrètement ce qui a été appris dans un autre contexte.

## Modifications manuelles et reprise

Une modification manuelle de la luminosité enregistre une préférence temporaire pour quatre heures, afin que le régulateur ne s'oppose pas immédiatement à la personne qui l'a modifiée. Les modifications automatiques commencent avec une influence de 20 % et reprennent pleinement le contrôle au fil d'une transition progressive de quatre heures. Sélectionnez **Reprendre le mode auto** pour mettre fin immédiatement à la préférence au lieu d'attendre la fin de la transition.

Sélectionnez **Réinitialiser l’historique appris** après avoir déplacé le panneau, changé sa source de lumière, ou lorsque la semaine écoulée ne représente plus la pièce. Après confirmation, cette action supprime les sept jours d'historique de luminosité ambiante pour la source et le contexte actuels, puis relance l'apprentissage. Elle ne modifie ni la source sélectionnée ni le réglage Luminosité auto.

La luminosité adaptative utilise le réglage normal de luminosité de l'écran d'Android et ne nécessite pas d'accès root. La lecture du capteur de luminosité d'un panneau donné peut toutefois dépendre de la manière dont ce capteur est accessible sur ce matériel ; le profil actif et la vérification en temps réel des capacités le déterminent.

## Commande via Home Assistant

Lorsque le panneau l'expose, `switch.<panel>_auto_brightness` active et désactive le même régulateur. La luminosité de l'écran reste pilotée par `light.<panel>_screen`, de sorte qu'une modification de luminosité depuis Home Assistant crée la même préférence temporaire qu'une modification sur le panneau. Utilisez **Reprendre le mode auto** sur la page Configurer pour revenir directement au niveau appris.
