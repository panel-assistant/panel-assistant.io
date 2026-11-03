---
title: Synthèse vocale
description: Diffusion des voix de synthèse vocale de Home Assistant et des annonces d’Assist par le haut-parleur d’un panneau.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Toute voix de synthèse vocale de Home Assistant, comme Piper ou Home Assistant Cloud, peut parler via le lecteur multimédia du panneau. Vous n’avez besoin ni d’un microphone ni de l’activation de l’assistant vocal pour utiliser le haut-parleur.

## Diffuser une annonce lorsque l’assistant vocal est activé

Si le panneau dispose d’un microphone et que son [assistant vocal](/fr/manage/voice-assistant/) est activé, `assist_satellite.announce` énonce un message directement sur le panneau, éventuellement précédé d’un bref carillon.

## Utiliser une voix de synthèse vocale

Choisissez un moteur de synthèse vocale configuré et l’entité `media_player` du panneau. Par exemple :

```yaml
action: tts.speak
target:
  entity_id: tts.piper
data:
  media_player_entity_id: media_player.living_room_panel
  message: 'The washing machine has finished'
```

Remplacez les deux identifiants d’entité par ceux de votre Home Assistant. Le moteur synthétise la phrase et Panel Assistant envoie la lecture au panneau via sa connexion native existante. Home Assistant et le panneau ont toujours besoin d’un chemin fonctionnel pour l’audio.

Réglez au préalable le volume du lecteur multimédia du panneau si nécessaire. Pour diffuser la voix dans plusieurs pièces, fournissez une liste d’entités de lecteurs multimédias de panneaux dans `media_player_entity_id`.

En [mode renforcé](/fr/manage/security-mode/), une commande multimédia via la connexion native nécessite qu’une personne l’approuve sur l’écran du panneau. Une automatisation ne peut pas approuver cette demande à distance.
