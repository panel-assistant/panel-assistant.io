---
title: Détection de proximité adaptative et réveil par geste de la main
description: Comment le panneau apprend à interpréter son capteur de proximité, ce qu’il transmet à Home Assistant et comment un geste de la main réveille l’écran.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Les capteurs de proximité des panneaux muraux Android ne partagent pas une même échelle exploitable. Certains indiquent une distance, d’autres seulement deux valeurs, la polarité peut être inversée et les mesures au repos peuvent dériver selon les appareils et les versions du micrologiciel. L’application du panneau utilise le modèle étalonné du profil de capteur actif, ou un modèle que vous enregistrez lors de la configuration guidée, pour interpréter la valeur de base, la référence de proximité et la polarité du capteur.

![La configuration guidée de proximité du panneau, à l’étape 3 sur 7, vous demandant de marcher vers le panneau comme vous le feriez normalement pendant le compte à rebours](/screenshots/proximity-setup-screen-480.gif)

## Configuration guidée

Ouvrez **Configurer**, puis **Présence et réveil**, pour vérifier si le profil de capteur actif dispose d’un modèle exploitable. Si la configuration y est proposée, lancez la configuration guidée de proximité et suivez les instructions affichées sur l’écran du panneau lui-même. Elle mesure le signal sans obstacle et les mouvements volontaires de la main ; examinez le résultat et enregistrez-le sur le panneau.

**Rétablir les valeurs par défaut du profil** remplace votre étalonnage enregistré par les valeurs par défaut du profil de capteur, lorsqu’elles sont disponibles. Un capteur sans modèle exploitable nécessite une configuration guidée avant que le réveil par proximité soit prêt. Le réveil tactile reste disponible sur les panneaux disposant d’une voie de réveil tactile validée.

## Entités Home Assistant

Lorsque le modèle issu de l’apprentissage est fiable et que le profil matériel actif expose une source de proximité exploitable, l’appareil du panneau dans Home Assistant reçoit :

- `binary_sensor.<panel>_proximity`, une présence proche ou éloignée déterminée par apprentissage ; et
- `sensor.<panel>_proximity_level`, une valeur normalisée de 0 (loin) à 100 (près), sur la même échelle pour tous les panneaux.

Les deux entités restent indisponibles tant que les données sont insuffisantes ou que le capteur ne fonctionne pas correctement. Le panneau ne transmet pas de valeur donnant une impression de fiabilité à partir d’un modèle auquel il ne fait pas confiance. Un capteur qui n’indique que deux valeurs peut tout de même fournir la détection de présence et les gestes de réveil, et le niveau n’est transmis que lorsque le signal permet réellement d’en déterminer un.

## Réveil par geste de la main

**Réveil par geste de la main** utilise le schéma d’approche ou de mouvement de la main validé par le profil de capteur ou la configuration guidée. Un schéma à un seul geste de la main se déclenche à l’approche de la main ; un schéma à deux gestes vérifie les mouvements appariés avant de réveiller l’écran. La configuration et les brèves fluctuations au repos ne génèrent pas de demandes de réveil.

Cette fonction nécessite une source de proximité active et un modèle issu de l’apprentissage qui soit prêt. La source peut être un capteur Android ordinaire ou une voie choisie par le profil matériel. L’interface web et les diagnostics du panneau indiquent la voie réellement utilisée et si elle est prête ; le fait qu’un profil déclare un capteur ne suffit pas à en rendre un disponible.
