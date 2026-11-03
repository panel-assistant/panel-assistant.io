---
title: Migrer un panneau depuis MQTT
description: Transférer les entités d'un panneau de l'intégration MQTT de Home Assistant à Panel Assistant, en conservant leurs identifiants d'entité, leur historique et leurs personnalisations.
sourceCommit: 8fecd1a461bf69f6e831d11b1f9f01993c603b1f
---

Panel Assistant 1.0 utilise la connexion native de Home Assistant et ne prend pas en charge MQTT. Si les entités de votre panneau utilisent encore MQTT, exécutez d'abord Panel Assistant **0.9.0** pour qu'il puisse terminer la migration en conservant les identifiants d'entité, l'historique et les personnalisations. Si vous avez déjà effectué la mise à jour vers 1.0, suivez [si une migration n'a pas été terminée](/fr/manage/upgrade-to-1-0/#si-une-migration-na-pas-été-terminée) avant de changer de version.

La procédure ci-dessous est un guide historique pour Panel Assistant 0.3 à 0.8. Son option **Contrôle** n'est pas présente dans la version 1.0.

Vous migrez un seul panneau à la fois, et chaque migration est réversible. Les entités du panneau conservent leurs identifiants d'entité, leur historique et tout nom, icône ou pièce que vous leur avez attribué, de sorte que les tableaux de bord et les automatisations qui les utilisent continuent de fonctionner.

:::caution[Accès anticipé]
La migration est une nouveauté. Essayez-la d'abord sur un seul panneau et racontez-nous comment cela s'est passé sur [Discord](https://panel-assistant.io/go/discord) ou dans les [tickets](https://github.com/panel-assistant/ha-integration/issues).
:::

## Avant de commencer

- **Panel Assistant 0.3.0 à 0.8** dans Home Assistant, installé via HACS comme décrit dans [Installer l'intégration](/fr/home-assistant/custom-integration/).
- **ha-paneld 0.9.8-rc1 ou version ultérieure** sur le panneau. Installez une mise à jour proposée depuis l'entité de mise à jour Panel Assistant du panneau dans Home Assistant. Si vous avez besoin d'une préversion qui n'y est pas proposée, sélectionnez-la dans l'onglet **Installer** de l'interface web du panneau et lancez vous-même l'installation.
- **Le panneau est connecté à Home Assistant**, ce qui est le cas s'il affiche votre tableau de bord.
- **Laissez votre configuration MQTT telle quelle.** Le panneau utilise encore le courtier pendant la migration, et aucune modification n'y est nécessaire.

## 1. Activer les entités Panel Assistant

Ajoutez ceci à `configuration.yaml`, puis redémarrez Home Assistant :

```yaml
panel_assistant:
  native_entities: true
```

Rien n'est encore migré. Chaque panneau connu de Panel Assistant reçoit un second ensemble d'entités sur son appareil Panel Assistant, aux côtés des entités MQTT, afin que les deux ensembles puissent être comparés. Lorsque vous migrez un panneau, ses entités MQTT prennent la place de ce second ensemble.

## 2. Ajouter le panneau à Panel Assistant

Ignorez cette étape si le panneau apparaît déjà sous Panel Assistant dans **Paramètres**, **Appareils et services**.

Choisissez **Ajouter une intégration**, puis **Panel Assistant**, puis **Ajouter un panneau**, et saisissez le nom d'hôte ou l'adresse du panneau. Panel Assistant détecte ha-paneld déjà en cours d'exécution et propose **Connecter à Home Assistant**. Rien n'est réinstallé sur le panneau.

## 3. Confirmer l'utilisateur du panneau

Lors de la première connexion du panneau, Home Assistant affiche une réparation : **Confirmer l'utilisateur Home Assistant de** votre panneau. Ouvrez-la depuis **Paramètres**, **Corrections**, vérifiez que l'utilisateur indiqué est le compte avec lequel le panneau se connecte, puis confirmez.

Le panneau réessaie de lui-même ; la réparation peut donc mettre jusqu'à 15 minutes à apparaître, et le panneau peut prendre à nouveau autant de temps pour se connecter après votre confirmation.

## 4. Migrer le panneau

Ouvrez l'entrée Panel Assistant du panneau sous **Appareils et services**, choisissez **Configurer**, réglez **Contrôle** sur **Panel Assistant**, puis enregistrez.

L'entrée se recharge et le panneau se reconnecte. Ses entités MQTT migrent vers Panel Assistant et, une fois que le panneau a confirmé la migration, l'appareil MQTT du panneau est supprimé. Attendez-vous à ce que les entités apparaissent comme indisponibles pendant quelques secondes, puis à nouveau environ 30 secondes plus tard, le temps que la situation se stabilise. Le journal d'activité de l'appareil se remplit de changements d'état à mesure que chaque entité transmet son état ; c'est normal.

Désormais, modifier un paramètre ou appuyer sur un bouton des entités du panneau passe par Panel Assistant. Avant la migration d'un panneau, les mêmes commandes répondent que le panneau est contrôlé via MQTT.

### Ce qui n'est pas migré

Deux boutons MQTT n'ont pas d'équivalent dans Panel Assistant, **Update ha-paneld** et **Update Companion app** ; ils sont donc supprimés, ainsi que toute entité de mise à jour MQTT restante pour ha-paneld. Utilisez l'entité de mise à jour Panel Assistant du panneau pour mettre à jour l'application du panneau.

Si vous avez attribué à l'une de ces entités un nom, une icône ou une pièce de votre choix, ou si vous l'avez masquée ou désactivée, Panel Assistant ne la supprimera pas à votre place. Elle est plutôt répertoriée dans une réparation, et le panneau conserve ses entités MQTT jusqu'à ce que vous supprimiez cette entité ou effaciez ces réglages.

## Revenir en arrière pour un panneau

Ouvrez à nouveau **Configurer** et réglez **Contrôle** sur **MQTT, avec des rapports natifs pour comparaison**, ou sur **MQTT**. Les entités reviennent dans l'intégration MQTT avec les mêmes identifiants d'entité et le même historique, et le panneau annonce à nouveau son appareil MQTT.

Utilisez toujours cette méthode pour annuler la migration d'un panneau. Ne supprimez pas l'entrée Panel Assistant d'un panneau tant que Panel Assistant le contrôle : Home Assistant efface les entités de cette entrée lors de la suppression et, bien que Panel Assistant les restitue d'abord, une entité personnalisée peut perdre son nom, son icône ou sa pièce au cours de l'opération.

## Limitations connues

- **Certains capteurs restent indisponibles.** Un panneau peut proposer des entités pour des capteurs dont son matériel ne transmet pas les données, comme la proximité, la température ou l'humidité. Ce sont de nouvelles entités Panel Assistant, et non des entités migrées ; les désactiver ne fait donc rien perdre.
- **Version plus ancienne de ha-paneld sur un panneau migré.** Si un panneau migré est ensuite rétrogradé vers une version antérieure à 0.9.8-rc1, il annonce à nouveau ses entités MQTT. Panel Assistant désactive les doublons et crée une réparation, **Mettre à jour ha-paneld**, qui disparaît une fois le panneau mis à jour.
- **Avis de redémarrage.** Pendant le redémarrage de Home Assistant, un panneau dont le compte n'est pas administrateur en est toujours informé via MQTT, ce qui constitue une raison de plus de laisser le courtier en fonctionnement pour le moment.
