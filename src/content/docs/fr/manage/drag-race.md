---
title: La course de vitesse
description: Deux panneaux muraux identiques, le même tableau de bord, les mêmes appuis au même instant. L’un utilise l’application Home Assistant Companion telle que le panneau est livré ; l’autre Panel Assistant. Mesures, vidéos et raisons pour lesquelles la latence compte davantage que le chronomètre.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Deux panneaux Sonoff NSPanel Pro 86, côte à côte sur la même instance Home Assistant, affichent chacun une copie identique du même tableau de bord. Un script touche les deux écrans au même instant, page après page, et une horloge sous chaque panneau s’arrête lorsque son écran a répondu. Le panneau de gauche utilise l’application Home Assistant Companion avec le moteur web livré dans le micrologiciel du panneau. Celui de droite utilise Panel Assistant avec le moteur web qu’il installe lui-même. Les panneaux échangent ensuite leurs rôles et la course recommence, afin que la vitesse propre à un panneau ne puisse pas fausser le résultat.

## Rendu : environ deux fois plus rapide

![Film A : le premier panneau sous l’application Companion, le second sous Panel Assistant, en course au même instant](/screenshots/drag-race-film-a.gif)

Sept appuis : trois changements de page, un retour à l’accueil et trois appuis sur une carte de lumière. Trois passages dans chaque sens ; les films montrent le passage médian, et les panneaux échangent leurs rôles entre les deux films.

|                                                           | Application Companion, moteur web du micrologiciel | Panel Assistant, son propre moteur web |
| --------------------------------------------------------- | -------------------------------------------------- | -------------------------------------- |
| Première disposition, médiane de trois passages           | 11.7 s                                             | 6.4 s                                  |
| Seconde disposition, panneaux intervertis                 | 14.3 s                                             | 6.1 s                                  |
| Processeur utilisé par les processus de rendu             | 1.3 à 1.5 cœurs                                    | 0.4 à 0.6 cœur                         |
| Fréquence d’images au repos de la page du tableau de bord | 5 images par seconde                               | 59 images par seconde                  |
| Entités suivies par la page                               | 4,118                                              | 54                                     |

La page du tableau de bord sous Panel Assistant ne suit que les entités qu’elle affiche. Sous l’application Companion, elle reçoit chaque changement d’état de la maison, soit des milliers d’entités, et passe l’essentiel de son temps à les traiter. Cela explique pourquoi la même page s’affiche à cinq images par seconde sur un panneau et soixante sur l’autre, et pourquoi les processus de rendu consomment deux fois et demie plus de processeur.

![Film B : les panneaux intervertis, le second sous l’application Companion et le premier sous Panel Assistant](/screenshots/drag-race-film-b.gif)

## Latence : le vrai problème

Être deux fois plus rapide au chronomètre est une amélioration modeste. Ce n’est pas ce que vous remarquez au mur. Ce que vous remarquez, c’est le moment où vous appuyez sur un bouton et où rien ne se passe.

Vous appuyez. Vous attendez un changement. Après plus d’une demi-seconde sans réaction, vous pensez avoir manqué votre appui et vous recommencez. Les deux appuis arrivent alors : la lumière s’allume puis s’éteint aussitôt, ou la page demandée apparaît puis est remplacée par celle de votre second appui. Vous avez tout fait correctement et obtenu l’inverse de ce que vous vouliez. Un tel panneau n’est pas lent ; il est inutilisable, et après une semaine personne dans la maison ne lui fait confiance.

![Le double appui : le même appui sur la même lumière sur les deux panneaux, avec la règle humaine consistant à appuyer de nouveau après une seconde sans réaction](/screenshots/drag-race-double-press.gif)

Les deux mêmes panneaux, la même carte de lumière, la lumière éteinte des deux côtés. Un doigt appuie sur la lumière et suit la règle que chacun suit : si rien n’a changé après une seconde, appuyer à nouveau, jusqu’à trois fois.

|                                                    | Application Companion, moteur web du micrologiciel                            | Panel Assistant, son propre moteur web |
| -------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------- |
| Lumière visiblement allumée après le premier appui | 15.2 s, après trois appuis                                                    | 0.3 s, après un appui                  |
| Les deux autres prises                             | 7 s après un appui ; page toujours en cours de chargement, trois appuis, rien | 0.3 s après un appui, à chaque fois    |

Quinze secondes, ce n’est pas un panneau lent. C’est un panneau auquel vous avez renoncé et dont vous vous êtes éloigné, avant que la lumière s’allume derrière vous. La page sous l’application Companion n’était pas en panne : elle était occupée à traiter le flux d’états de toute la maison sur un panneau à quatre cœurs, et l’appui attendait son tour derrière ce travail. La page de Panel Assistant n’avait que ses propres entités à gérer : l’appui était donc traité immédiatement.

## Méthode de mesure

- Deux panneaux Sonoff NSPanel Pro 86 (Rockchip PX30 à quatre cœurs, écrans de 480 par 480) sur une même instance Home Assistant de production avec environ 4,100 entités et quelque 20 changements d’état par seconde.
- Deux copies d’un tableau de bord, identiques à l’exception de la lumière associée à une carte, afin que les deux panneaux n’agissent jamais en concurrence sur une même entité.
- L’application Companion 2026.6.5 sur le moteur web du micrologiciel, Chromium 107, encore utilisé par la plupart des panneaux installés. Panel Assistant sur Chromium 138, le moteur web compatible utilisé pour ces essais.
- Des appuis injectés sous forme d’événements bruts d’écran au même instant sur les deux panneaux. Chaque étape est enregistrée par le panneau lui-même ; le chronomètre va de l’appui jusqu’à l’arrêt des changements à l’écran. Une étape dont l’écran change encore à la fin de son clip invalide le passage.
- Trois passages dans chaque sens, avec le passage médian filmé. Une carte musicale qui récupérait des paroles sur Internet a été retirée de la course, car aucune application de panneau ne peut accélérer un service externe ; la page de caméra en direct a été exclue parce que sa durée correspond à l’établissement du flux plutôt qu’au travail du tableau de bord.

Vous pouvez consulter l’utilisation du processeur, la réactivité du tableau de bord et le flux d’état Home Assistant de votre propre panneau sous **Performances** dans son interface web ; voir [Performances](/fr/manage/performance/) pour savoir comment lire ces mesures.
