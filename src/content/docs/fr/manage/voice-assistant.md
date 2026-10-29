---
title: Assistant vocal
description: Utiliser le microphone d’un panneau comme satellite Home Assistant Assist, avec mots de réveil, pipelines, annonces et dépannage.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Un panneau doté d’un microphone peut servir de [satellite Assist](https://www.home-assistant.io/voice_control/) Home Assistant. Il écoute un mot de réveil, transmet votre commande à Home Assistant et énonce la réponse par le haut-parleur du panneau. Aucun appareil distinct n’est à ajouter : le satellite est une entité `assist_satellite.<panel>` sur l’appareil Home Assistant existant du panneau, et l’audio emprunte la connexion déjà utilisée par le panneau.

:::note
La carte Voix est proposée lorsque le profil de l’appareil déclare un microphone, ou lorsqu’Android signale un microphone intégré sur un panneau dont le profil ne le précise pas. Un microphone non vérifié doit réussir le contrôle de capture du panneau avant le début de l’écoute. Un profil déclarant explicitement l’absence de microphone ne propose pas Voix.
:::

## L’activer

La voix est activée par défaut sur une nouvelle installation lorsque le profil de l’appareil déclare un microphone. Les réglages déjà enregistrés sont préservés. Sur les autres panneaux proposant la carte Voix, activez **Assistant vocal** pour l’utiliser. Désactivez-le si vous ne souhaitez pas que le panneau écoute un mot de réveil.

1. Sélectionnez **Visiter** sur la page de l’appareil du panneau dans Home Assistant, puis ouvrez **Configurer** (par exemple, `http://<panel>:8888/` avec le port par défaut).
2. Sur la carte **Voix**, activez **Assistant vocal**.
3. Cochez chaque mot que le panneau doit écouter sous **Mots d’activation**.
4. Sous **Pipelines des mots d’activation**, choisissez le pipeline Assist à utiliser pour chaque mot coché.

Lorsque l’assistant vocal est désactivé, ses réservations du microphone sont libérées et l’entité satellite apparaît indisponible dans Home Assistant. Une autre fonction activée, comme l’audio de la pièce pour la caméra, peut toujours utiliser le microphone.

## Mots de réveil et pipelines

Le panneau intègre quatre mots de réveil : **Okay Nabu**, **Hey Jarvis**, **Hey Mycroft** et **Alexa**. Plusieurs peuvent être actifs simultanément, chacun associé à un pipeline Assist différent : un mot peut ainsi répondre dans une autre langue ou transmettre la commande à un autre agent de conversation. Laisser le réglage par défaut d’un mot utilise le pipeline actuellement préféré par Home Assistant. Si un pipeline affecté est supprimé ultérieurement, le mot de réveil revient aussi au pipeline préféré.

Vous pouvez également changer les mots de réveil actifs depuis Home Assistant : les réglages du satellite, sous **Paramètres > Assistants vocaux** ou sur la page de l’appareil du panneau, affichent la même liste et transmettent les modifications au panneau. Le pipeline de chaque mot de réveil se règle sur la page Configurer du panneau.

La détection du mot de réveil s’exécute sur le panneau, et non dans le cloud ou sur votre serveur Home Assistant. Le panneau commence à envoyer de l’audio à Home Assistant uniquement après avoir entendu un mot de réveil, et seulement tant que la reconnaissance vocale reçoit encore votre commande ; l’envoi cesse dès que Home Assistant signale la fin de la commande.

Vous souhaitez un mot de réveil absent de cette liste ? Voir [Mots de réveil personnalisés](/fr/manage/custom-wake-words/).

## Ce que le panneau affiche

Un bref carillon et une ondulation marquent la détection d’un mot de réveil. Pendant l’écoute, la réflexion ou la réponse, les bords de l’écran prennent une teinte douce qui pulse lentement. La couleur identifie le pipeline qui répond : Panel Assistant attribue une couleur à chaque pipeline lors de sa première utilisation par un panneau et conserve cette association, pour qu’un même pipeline ait la même apparence sur tous les panneaux de la maison. Vous n’avez rien à configurer ici.

Si l’agent de conversation du pipeline pose une question complémentaire, le panneau reprend l’écoute automatiquement, sans qu’il soit nécessaire de répéter le mot de réveil.

## Annonces et lancement d’une conversation

Une fois l’assistant vocal activé, `assist_satellite.announce` énonce un message sur le panneau depuis toute automatisation ou tout script, éventuellement précédé d’un bref carillon. `assist_satellite.start_conversation` énonce une invite puis écoute la réponse ; Home Assistant ne l’autorise qu’avec un agent de conversation capable de démarrer lui-même une conversation, ce que l’agent Home Assistant intégré ne permet pas. Les deux services nécessitent que l’assistant vocal soit activé ; voir [Synthèse vocale](/fr/manage/text-to-speech/#play-an-announcement-with-the-voice-assistant-on) pour l’alternative REST plus simple sur les panneaux sans microphone.

## Plusieurs assistants dans une même pièce

Si deux satellites d’une même instance Home Assistant entendent la même phrase de réveil à moins de deux secondes d’intervalle, Home Assistant supprime le doublon afin qu’un seul réponde. Cela s’applique à tous les satellites de cette instance Home Assistant, et non seulement aux panneaux d’une même zone Home Assistant : cela couvre donc aussi un panneau et tout autre satellite que vous possédez déjà. Pour choisir quel appareil répond dans une pièce partagée, attribuez-leur des mots de réveil différents.

## Réglages

La carte Voix propose quelques options de réglage en plus de la liste des mots de réveil :

- **Sensibilité au mot d’activation :** Faible, Normale ou Élevée. Élevée abaisse le seuil du modèle de mot de réveil : le panneau se réveille plus facilement, mais risque aussi davantage de se réveiller sur une fausse correspondance ; Faible exige une correspondance plus nette.
- **Gain du microphone (dB) :** amplifie uniquement l’audio envoyé à Home Assistant pour la transcription, jamais celui analysé par l’écoute du mot de réveil. Augmentez-le si le mot de réveil est détecté de façon fiable mais que les commandes prononcées de l’autre côté de la pièce sont manquées ou mal comprises.
- **Source audio :** la source audio Android utilisée pour capturer le microphone. Laissez sa valeur par défaut (`voice_recognition`) sauf indication contraire.

## Dépannage

**Le panneau ne se réveille jamais.** Vérifiez que **Assistant vocal** est activé et que le mot prononcé est coché sous **Mots d’activation**. Essayez **Sensibilité au mot d’activation : Élevée**, et parlez depuis l’endroit où vous utilisez normalement le panneau, plutôt que juste à côté du microphone.

**Il se réveille mais ne comprend pas la commande.** Augmentez légèrement le **Gain du microphone (dB)** et réessayez ; cela n’affecte que l’audio envoyé pour transcription et ne facilite donc pas à lui seul le réveil du panneau. Si vous entraînez votre propre mot de réveil, le journal du panneau enregistre aussi les détections proches du seuil avec leur score : c’est le moyen le plus direct de savoir si un mot manqué était proche du seuil ou très loin. Voir [Mots de réveil personnalisés](/fr/manage/custom-wake-words/#tests-et-réglages).

**L’entité satellite apparaît indisponible.** L’assistant vocal est désactivé, ou le panneau n’est pas connecté à Home Assistant via Panel Assistant. Activez l’assistant vocal depuis la page Configurer du panneau ; il ne peut pas être activé depuis Home Assistant.
