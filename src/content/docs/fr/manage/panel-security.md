---
title: Compte du panneau et sécurité réseau
description: Choisissez le compte Home Assistant utilisé par votre panneau et prévoyez son accès réseau.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

## Quel compte Home Assistant le panneau utilise-t-il ?

Lorsque vous ajoutez un nouveau panneau depuis Panel Assistant, sa connexion par navigateur utilise normalement le compte Home Assistant déjà connecté sur votre ordinateur. S’il s’agit de votre compte administrateur, le panneau se connecte en tant que cet administrateur. Panel Assistant ne vous demande pas votre mot de passe et ne crée pas d’autre utilisateur Home Assistant. Le panneau conserve sa propre connexion Home Assistant pour pouvoir charger votre tableau de bord et communiquer avec Home Assistant en tant que cet utilisateur.

Vous pouvez utiliser votre compte habituel, en particulier si votre installation Home Assistant n’a qu’un seul utilisateur. Un utilisateur **existant** distinct est utile si vous souhaitez séparer l’accès du panneau de votre compte administrateur. Un utilisateur non administrateur peut utiliser les tableaux de bord sans accéder aux paramètres de Home Assistant. Un compte distinct est facultatif ; Panel Assistant n’en crée pas pendant la configuration.

Home Assistant enregistre aussi un tableau de bord et un thème par défaut pour chaque utilisateur. L’utilisateur du panneau peut avoir un tableau de bord mural et une apparence propres sans modifier les choix sur votre téléphone ou votre ordinateur. Le moteur de rendu intégré utilise ce tableau de bord par défaut lorsque **Tableau de bord d’accueil** est réglé sur **Auto** ; un tableau de bord sélectionné dans les paramètres du panneau est prioritaire. Son réglage **Thème du tableau de bord** peut demander le mode clair ou sombre, tandis qu’un choix explicite de thème dans Home Assistant reste prioritaire.

Vous pouvez définir les éléments de la barre latérale et leur ordre, la langue, le fuseau horaire ainsi que les formats des nombres, des dates et des heures pour l’utilisateur du panneau dans **Home Assistant → Profil utilisateur → Général**. Les préférences de la barre latérale comptent lorsqu’elle est visible ; le panneau masque la navigation par défaut. Masquer un élément de la barre latérale ne restreint pas son accès. Voir le [guide du profil utilisateur de Home Assistant](https://www.home-assistant.io/docs/configuration/user-configuration/) pour ces paramètres de compte.

### Changer la connexion du panneau

Dans Home Assistant, ouvrez **Panel Assistant**, sélectionnez le panneau, puis ouvrez son onglet **Configurer**. Sous **Connexion par navigateur**, choisissez **Reconnecter** et **Copier le lien**. Ouvrez ce lien dans une fenêtre de navigation privée, connectez-vous à Home Assistant avec l’utilisateur existant que vous souhaitez faire utiliser au panneau, puis laissez le navigateur revenir au panneau. Une fenêtre privée est utile lorsque votre navigateur habituel est déjà connecté en tant qu’administrateur. Vous pouvez aussi ouvrir **Configurer** directement sur le panneau et y lancer la connexion par navigateur. Si Home Assistant signale ensuite une différence d’utilisateur du panneau sous **Paramètres → Réparations**, confirmez que le nouvel utilisateur nommé est bien celui que vous avez choisi.

Le navigateur doit pouvoir joindre à la fois Home Assistant et l’adresse locale du panneau pour terminer la connexion. Le panneau doit lui aussi pouvoir joindre Home Assistant. Si vous avez ouvert Configurer à distance via Home Assistant mais que votre navigateur ne peut pas joindre l’adresse locale du panneau, terminez la connexion depuis le réseau du panneau ou directement sur celui-ci.

## Placer le panneau sur un réseau séparé

Un panneau peut utiliser un VLAN sans accès à Internet si votre pare-feu permet toujours au panneau et à Home Assistant de se joindre mutuellement, et si un navigateur sur votre réseau peut joindre le panneau lorsqu’une personne doit se connecter. Le panneau utilise l’adresse locale de Home Assistant pour la connexion et son tableau de bord. Home Assistant doit aussi pouvoir joindre le panneau pour la gestion et les mises à jour.

Panel Assistant peut récupérer une mise à jour vérifiée de l’application du panneau sur la machine Home Assistant et l’envoyer au panneau par le réseau local. Home Assistant doit toujours avoir accès à la source des mises à jour. Les vérifications de version du panneau et les installations lancées par le propriétaire depuis son onglet Installer utilisent GitHub et nécessitent aussi un accès à Internet. Ces vérifications et téléchargements ne fonctionneront pas sur un VLAN sans accès à Internet. Android System WebView est maintenu séparément via le Play Store, le micrologiciel du fabricant ou une installation manuelle ; prévoyez donc aussi comment vous le maintiendrez.

La séparation des réseaux limite les appareils qui peuvent accéder à l’interface web et à l’API du panneau. Elle ne réduit pas les droits d’un compte Home Assistant déjà connecté sur le panneau. Si le panneau utilise un compte administrateur, cette connexion reste une connexion administrateur, même sur un VLAN isolé. Choisissez le compte et les règles du pare-feu en fonction de la confiance que vous accordez à ce qui est sur le mur et sur le réseau local.

L’interface web et les commandes courantes du panneau supposent un réseau local de confiance. Le [mode renforcé](/fr/manage/security-mode/) facultatif exige un accès physique pour certaines requêtes directes sur le réseau local ayant des conséquences importantes. Certaines actions de gestion courantes peuvent être effectuées par un administrateur Home Assistant via la barre latérale Panel Assistant authentifiée ; les autres opérations protégées exigent toujours une approbation sur l’écran du panneau. Ce mode ne remplace pas la séparation des réseaux et n’authentifie pas toutes les requêtes de l’API.
