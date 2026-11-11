---
title: Passer à la version 1.0
description: Faire passer Home Assistant et vos panneaux de Panel Assistant 0.9 à 1.0, et comprendre ce qu’implique un retour en arrière.
sourceCommit: 45ad784a56e8c07917f0c76636d2b389a610b982
---

Panel Assistant 1.0 et l’application de panneau 1.0 évoluent ensemble. L’intégration 1.0 communique uniquement avec l’application de panneau 1.0, et celle-ci uniquement avec l’intégration 1.0 : aucune ne fonctionne avec un partenaire 0.9. Vous mettez d’abord à jour l’intégration, puis chaque panneau depuis Home Assistant, et **un panneau qui exécute l’application 1.0 ne peut pas revenir à la version 0.9**. Lisez toute cette page avant de commencer. Les [notes de version de 1.0.0](/fr/release-notes/#panel-assistant-100) répertorient tous les changements.

## Avant de commencer

**Terminez tout ce que la version 0.9.0 doit faire.** Exécutez Panel Assistant **0.9.0** et ouvrez **Paramètres**, **Réparations**. Panel Assistant 1.0 ne peut plus migrer un panneau depuis MQTT, ni un panneau qui exécute encore l’ancienne application ha-paneld : il laisse donc les deux en l’état. Si la version 0.9.0 signale l’un de ces cas pour vos panneaux, suivez sa Réparation jusqu’à la fin de la migration ; [Migrer un panneau depuis MQTT](/fr/home-assistant/move-from-mqtt/) explique la partie MQTT. Si votre version de Panel Assistant est antérieure à 0.9.0, passez d’abord à 0.9.0 et laissez-la terminer.

**Créez une sauvegarde Home Assistant.** Dans **Paramètres**, **Système**, **Sauvegardes**, créez une sauvegarde et conservez-la jusqu’à ce que tous les panneaux exécutent la version 1.0 et vous donnent satisfaction. C’est votre moyen de revenir en arrière côté Home Assistant.

**Conservez une sauvegarde de chaque panneau.** Sur l’interface web de chaque panneau, ouvrez **Installer**, puis **Sauvegarde**, et conservez le fichier `.hpb` téléchargé. Panel Assistant enregistre aussi les réglages du panneau avant chaque mise à jour, mais votre propre copie est celle que vous pouvez restaurer vous-même.

## 1. Mettre à jour l’intégration

Sur Home Assistant **2026.11 ou ultérieur**, installez la mise à jour de Panel Assistant depuis **Paramètres**, **Mises à jour**. Sur les versions antérieures compatibles, de **2026.8.3 à 2026.10**, téléchargez la mise à jour dans HACS. Redémarrez ensuite Home Assistant pour charger la nouvelle intégration, en suivant la Réparation de redémarrage ou la demande de HACS. [Installer l’intégration](/fr/home-assistant/custom-integration/#updates) explique les mises à jour via Marketplace ou HACS.

## 2. Vérifier les Réparations

Après le redémarrage, ouvrez à nouveau **Paramètres**, **Réparations**.

- **« … a besoin de l’application … »** est normal pour chaque panneau qui exécute encore une application 0.9. Tant qu’il n’est pas mis à jour, Home Assistant ne peut ni voir ni contrôler ce panneau, et ses entités apparaissent indisponibles. Le panneau lui-même continue de fonctionner, avec ses réglages et son historique.
- **« … ne peut pas recevoir de mises à jour de l’application »** signifie que Panel Assistant n’a aucun moyen d’installer sur ce panneau, généralement après une modification du panneau lui-même, comme une mise à jour du micrologiciel ou une réinitialisation. Reconnectez le panneau à Panel Assistant par USB, comme l’explique **En savoir plus** dans la Réparation : la mise à jour devient alors disponible. Rien n’est supprimé : sur un panneau où l’application est déjà présente, l’installateur USB n’installe rien et permet uniquement à Panel Assistant de le joindre à nouveau.
- **« … n’a jamais été migré depuis MQTT »** ou **« … exécute encore l’ancienne application »** signifie qu’une migration n’a pas été terminée dans la version 0.9.0. Voir [si une migration n’a pas été terminée](#si-une-migration-na-pas-été-terminée).

## 3. Mettre à jour un panneau, puis les autres

L’entité de mise à jour de chaque panneau dans Home Assistant propose la dernière version 1.0 de l’application du panneau. Installez-la d’abord sur un panneau et utilisez-le quelque temps avant de l’installer sur les autres, car ce panneau ne pourra pas revenir en arrière. Panel Assistant sauvegarde les réglages du panneau, installe la mise à jour et confirme que le panneau fonctionne correctement après son retour, comme décrit dans [Mises à jour et récupération](/fr/manage/updates-and-recovery/). Les réglages de l’application de panneau 0.9 sont conservés.

## Revenir en arrière

Les deux parties diffèrent.

**Un panneau sous l’application 1.0 reste en version 1.0.** L’application du panneau refuse d’installer une version antérieure par-dessus elle-même, Panel Assistant n’en propose jamais, et une intégration 0.9 ne peut pas communiquer avec elle. Si un panneau en version 1.0 se comporte mal, consultez [Dépannage](/fr/manage/troubleshooting/), puis signalez le problème avec un [rapport d’assistance](/fr/home-assistant/support-report/) afin qu’il puisse être corrigé dans une version ultérieure.

**L’intégration peut revenir en arrière tant qu’aucun panneau n’exécute la version 1.0.** Restaurez la sauvegarde Home Assistant créée avant de commencer. Cela annule aussi toute autre modification apportée à Home Assistant depuis sa création. Vos panneaux sont toujours sous leur application 0.9 et se reconnectent à la version 0.9.0. Dès qu’un panneau exécute l’application 1.0, restaurer la sauvegarde rend ce panneau inaccessible depuis Home Assistant jusqu’au retour de l’intégration en version 1.0.

Ne revenez pas en arrière en installant la version 0.9.0 par-dessus la version 1.0 via Marketplace ou HACS. La mise à jour 1.0 supprime un réglage dont dépend la version 0.9.0 ; sans lui, la version 0.9.0 renvoie vers MQTT des panneaux déjà migrés, alors que l’application de panneau 1.0 n’y répond plus. Restaurez plutôt la sauvegarde.

## Si une migration n’a pas été terminée

Si la version 1.0 indique qu’un panneau n’a jamais été migré depuis MQTT ou exécute encore l’ancienne application, suivez les étapes de récupération sûre de la Réparation pour terminer la migration avec Panel Assistant 0.9.0, puis revenir à la version 1.0. N’installez pas 0.9.0 par-dessus 1.0 via Marketplace ou HACS. Tant qu’aucun de vos panneaux n’exécute encore l’application 1.0, revenez à 0.9.0 en restaurant la sauvegarde Home Assistant créée avant la mise à jour, pour la raison ci-dessus. Terminez ensuite la migration dans la version 0.9.0 et reprenez cette page depuis le début. Si d’autres panneaux exécutent déjà l’application 1.0, ou si vous n’avez pas de sauvegarde antérieure à la mise à jour, demandez de l’aide sur [Discord](https://panel-assistant.io/go/discord) ou dans les [tickets](https://github.com/panel-assistant/ha-integration/issues) avant de modifier quoi que ce soit.

Pour un panneau encore sur MQTT, la Réparation propose aussi de repartir de zéro : supprimez l’appareil du panneau sous l’intégration MQTT et ajoutez de nouveau le panneau. Cela crée de nouvelles entités et ne conserve aucun historique.
