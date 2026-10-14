---
title: Mode de sécurité
description: Le comportement par défaut du panneau sur un réseau de confiance et le mode renforcé, qui exige qu’une personne présente au panneau approuve les actions distantes ayant des conséquences importantes.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

L’interface web du panneau, son API et ses commandes Home Assistant sont conçues pour un réseau domestique de confiance. Le **mode souple** est activé par défaut : les automatisations, les outils d’installation et les actions du navigateur fonctionnent sans demande supplémentaire. Une action échappe délibérément à cette règle. Activer la caméra via son entité Home Assistant demande une approbation au panneau dans tous les modes, y compris le mode souple. Le réglage Caméra dans Configurer constitue un moyen de configuration distinct pour le propriétaire. La désactiver ne demande jamais d’approbation.

Pour un panneau sur un réseau partagé avec des appareils moins fiables, le **mode renforcé** facultatif ajoute une approbation en personne à certaines opérations réseau ayant des conséquences importantes. C’est une limite de sécurité supplémentaire, pas un remplacement d’un réseau séparé ou d’un pare-feu, ni une authentification générale de l’API. Les points d’accès en lecture seule et les commandes courantes du panneau restent disponibles selon le modèle habituel de réseau de confiance.

**En mode renforcé, les requêtes directes protégées sur le réseau local nécessitent un accès physique au panneau. Elles ne peuvent être exécutées tant qu’une personne ne les a pas approuvées sur l’écran du panneau, et cette approbation ne peut pas être donnée à distance.**

Les administrateurs qui utilisent la barre latérale Panel Assistant authentifiée peuvent effectuer certaines actions de gestion courantes sans demande sur le panneau : configuration de l’affichage et de l’alimentation, confirmation de prise en compte de la sécurité de l’alimentation, activation de profils, lecture de médias, maîtrise des paquets du fabricant et rechargement du tableau de bord. L’installation, la désinstallation, les sauvegardes, les restaurations, le redémarrage et les autres opérations protégées exigent toujours une approbation sur le panneau. Les requêtes directes sur le réseau local ne bénéficient pas de cette exception.

L’interface web signale les actions concernées par un petit bouclier dans les deux modes, afin que vous puissiez voir quelles procédures franchissent la limite d’approbation avant d’activer le mode renforcé.

## Activer le mode renforcé

Ce paramètre ne peut être modifié que sur le panneau lui-même :

1. Sur le panneau, ouvrez l’écran **Configurer** de l’application du panneau.
2. Ouvrez le menu des options supplémentaires de la barre d’outils et choisissez **Mode de sécurité**.
3. Choisissez **Activer le mode renforcé**.

ADB sur le réseau et le débogage sans fil d’Android doivent tous deux être désactivés au préalable, car chacun permet à un client ADB distant d’injecter des entrées sur l’écran d’approbation. Avant de valider la modification, l’application du panneau vérifie toutes les propriétés Android prises en charge concernant ADB sur le réseau, ADB persistant sur le réseau, les adresses d’écoute explicites d’ADB et l’état du débogage sans fil. Elle arrête aussi tout relais actif des outils de développement WebView sur le réseau et vérifie que son processus et son écoute réseau ont disparu. Si elle ne peut pas établir que ces moyens de commande à distance sont inactifs, elle refuse d’activer le mode renforcé. Désactivez ADB et le débogage sans fil dans les options pour les développeurs d’Android, puis réessayez. Si la vérification du relais échoue, redémarrez le panneau avant de réessayer.

Ce paramètre appartient uniquement au panneau. Il n’est inclus ni dans les exports de configuration ni dans les sauvegardes complètes, et il ne peut pas être modifié via l’API, depuis Home Assistant, par une restauration, par l’importation d’une configuration ou par une mise à jour effectuée sur plusieurs panneaux. Un panneau existant reste donc en mode souple, sauf si quelqu’un active le mode renforcé sur le panneau.

Utilisez le même menu pour revenir au mode souple. Cela efface toutes les demandes d’approbation en attente.

## Approuver une requête réseau

Lorsque le mode renforcé intercepte une requête protégée à l’API, la première tentative renvoie HTTP `202 Accepted` avec une réponse `approval-required`, par exemple :

```json
{
  "ok": false,
  "error": "approval-required",
  "approval_id": "…",
  "message": "Approve this request physically on the panel, then retry it; it cannot be approved remotely."
}
```

Pour terminer l’opération :

1. Sur le panneau, ouvrez **Configurer**, le menu des options supplémentaires de la barre d’outils, **Mode de sécurité**, puis **Examiner les approbations**.
2. Vérifiez l’opération, son résumé et l’appareil qui l’a demandée, puis approuvez-la ou refusez-la.
3. Dans les dix minutes suivant la requête initiale, envoyez à nouveau la requête identique depuis le même appareil.

Une approbation est liée à l’opération, à l’appareil demandeur et au contenu protégé de la requête, et ne peut être utilisée qu’une fois. Modifier la requête, l’envoyer depuis une autre adresse, attendre plus de dix minutes ou redémarrer l’application du panneau nécessite une nouvelle approbation. Seule la nouvelle tentative correspondante consomme une approbation ; il ne s’agit pas d’un contournement général temporaire.

Les commandes natives des entités et des automatisations Home Assistant portent l’origine de transport de Panel Assistant plutôt que l’identité de l’utilisateur individuel. Leurs approbations sont liées à cette origine et à la commande exacte. Cela diffère de l’exception ci-dessus pour la barre latérale administrateur authentifiée.

Les requêtes par l’interface de boucle locale provenant de logiciels déjà en cours d’exécution sur le panneau ne nécessitent pas d’approbation réseau. Le mode renforcé considère les applications Android locales comme fiables et n’isole pas les applications du panneau les unes des autres ; ne laissez donc aucune application non fiable sur le panneau.

## Opérations protégées

En mode renforcé, un client réseau direct a besoin d’une approbation au panneau avant de pouvoir :

- installer une application transférée, une copie gérée de l’application du panneau ou une application distincte de tableau de bord ;
- désinstaller une application ou modifier l’état d’activation, d’exécution ou d’autorisation de superposition à l’écran d’un paquet du fabricant ;
- exporter une sauvegarde complète ou un ensemble de configuration contenant des secrets ;
- importer une configuration, restaurer une révision de configuration enregistrée ou restaurer une sauvegarde du panneau ;
- activer un profil matériel ou en effectuer le retour arrière ;
- lire des médias récupérés depuis une URL distante ;
- recharger le moteur de rendu du tableau de bord ou redémarrer le panneau ;
- télécharger une application depuis un lien, ce qui est approuvé séparément de son installation : le téléchargement est lié au SHA-256 de cette URL exacte et aucune connexion n’est ouverte avant son approbation, si bien qu’une installation depuis un lien en mode renforcé demande deux approbations ;
- faire avancer les opérations de maintenance pour la récupération de la base de données ;
- réparer la configuration d’une application de tableau de bord distincte ou effacer les données de navigation du moteur de rendu intégré ;
- modifier la densité d’affichage du système ou l’échelle de police ;
- désactiver les protections configurées de maintien en éveil ou de prévention de l’assombrissement en cas d’inactivité qui permettent de joindre le panneau, depuis la page Configurer ou Home Assistant ;
- réparer les paramètres de sécurité de l’alimentation du panneau ; ou
- masquer un avertissement précis et inchangé concernant un paramètre de sécurité de l’alimentation qui ne peut être corrigé que manuellement. Cela ne change que ce qui est affiché ; l’évaluation sous-jacente, les diagnostics et le résultat de l’installateur restent identiques.

Activer la caméra du panneau via son entité Home Assistant exige une approbation sur le panneau dans les deux modes. L’activer depuis Configurer reste un réglage distinct réservé au propriétaire ; l’autorisation Android d’accès à la caméra et un indicateur fonctionnel d’utilisation de la caméra restent nécessaires.

En mode renforcé, un enregistrement à distance dans Configurer doit enregistrer une réduction de la sécurité de l’alimentation séparément des modifications des paquets du fabricant, car celles-ci nécessitent des types d’approbation différents. Les enregistrements combinés en mode souple ou par l’interface de boucle locale sont exécutés directement.

Le mode renforcé rejette l’injection d’appuis depuis toute origine autre que l’interface de boucle locale, afin qu’une requête ne puisse pas s’approuver elle-même. Il refuse aussi d’activer ADB sur le réseau, le débogage sans fil d’Android ou le relais des outils de développement WebView. Sur le panneau, repassez en mode souple avant d’utiliser l’un de ces moyens.

La limite d’approbation ne rend pas le reste de l’API sur le port 8888 authentifié. La lecture des diagnostics et de l’état ainsi que les commandes courantes conservent leur comportement habituel sur un réseau de confiance. N’exposez pas l’API du panneau à des réseaux non fiables, même lorsque le mode renforcé est activé ; la [référence de sécurité](/fr/reference/security/) décrit l’ensemble du modèle de sécurité.

Les mises à jour commencent lorsque vous lancez une installation via Panel Assistant ou que vous choisissez vous-même une installation. L’application du panneau n’a ni politique d’installation planifiée ni canal de mise à jour enregistré. Les installations lancées par le propriétaire depuis l’onglet **Installer** restent disponibles, avec une approbation au panneau pour les requêtes distantes protégées en mode renforcé.

## Changer l’adresse Home Assistant

Modifier l’**URL de Home Assistant** efface les anciens identifiants de connexion, sauf si de nouveaux identifiants sont fournis dans le même enregistrement. Cela s’applique dans les deux modes de sécurité. Les enregistrements ordinaires qui conservent la même adresse gardent les valeurs secrètes stockées lorsque ces champs sont laissés vides.
