---
title: Le moteur de rendu intégré
description: Comment l’application du panneau affiche elle-même votre tableau de bord Home Assistant, récupère en cas d’échec et filtre les entités reçues.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

L’application du panneau affiche votre tableau de bord Home Assistant dans son propre WebView au lieu de le confier à une application distincte. Cela lui permet de revenir rapidement au tableau de bord après un redémarrage de l’application : elle peut rouvrir le dernier tableau de bord vérifié par Home Assistant pour le même serveur, compte et réglage de tableau de bord d’accueil, tout en vérifiant la liste actuelle en arrière-plan. Si Home Assistant indique que le tableau de bord a été supprimé ou que le choix par défaut du compte a changé, le panneau adopte le choix actuel.

Une fois le tableau de bord actif, l’application du panneau peut détecter une connexion bloquée, libérer la mémoire accumulée par WebView et contenir les plantages du moteur de rendu. La connexion intégrée rend aussi possible le filtrage des entités du tableau de bord. Le panneau reste un appareil à application unique, avec une seule application à installer et à mettre à jour.

Le moteur de rendu intégré est de loin la méthode recommandée pour afficher votre tableau de bord, et celle choisie par la configuration guidée. Une application de tableau de bord distincte reste une option prise en charge, par exemple pour plusieurs serveurs Home Assistant ou des notifications natives (voir [Limites](#limites)). La commande vocale Assist ne dépend d’aucune de ces applications : sur un panneau avec microphone, son propre [assistant vocal](/fr/manage/voice-assistant/) la fournit quelle que soit l’application active.

<a id="startup-and-recovery"></a>

## Démarrage et récupération

Le moteur de rendu utilise l’interface documentée `?external_auth=1` de Home Assistant : l’application du panneau peut donc savoir quand le tableau de bord est connecté au lieu de traiter la page comme une boîte noire. Il :

- Rouvre le dernier tableau de bord vérifié après un redémarrage de l’application tout en actualisant la liste Home Assistant en arrière-plan. Une brève vérification de compatibilité s’exécute d’abord. Le tableau de bord mémorisé est lié au serveur Home Assistant, au compte et au tableau de bord configuré ; un tableau de bord ou un onglet explicitement défini reste toujours prioritaire.
- Fige la page lorsque l’écran est éteint et la reprend au réveil, économisant environ 70% du processeur du moteur de rendu pendant la nuit.
- Recharge un tableau de bord ouvert mais jamais connecté. Les tentatives s’espacent après des échecs répétés, et le panneau affiche un écran clair **Reconnexion à Home Assistant…** au lieu d’une page d’erreur du navigateur.
- Réessaie les vérifications récupérables avec des délais croissants. Une connexion définitivement rejetée arrête les tentatives et affiche les instructions de connexion par navigateur. Une version Home Assistant non prise en charge ou un WebView incompatible indique la mise à jour nécessaire et l’attend.
- Libère la mémoire accumulée avec des rechargements invisibles lorsque l’écran est éteint.
- Contient et limite la fréquence des plantages du moteur de rendu. Une page qui plante sans cesse revient au lanceur d’administration au lieu de redémarrer toute la nuit.
- Lorsque Home Assistant annonce son arrêt ou devient indisponible, affiche une notification native sur le panneau et ne l’efface qu’une fois son retour démontré.

Tirez vers le bas depuis le bord supérieur de l’écran pour actualiser, ou deux fois pour un rechargement complet. Le moteur de rendu prend aussi en charge un retour facultatif au tableau de bord d’accueil après inactivité, la lecture automatique des flux de caméra et HTTPS avec une autorité de certification privée installée par l’utilisateur. **Masquer les barres système Android** donne un tableau de bord bord à bord ; balayez depuis un bord pour faire réapparaître les barres. Sur les panneaux utilisant la barre de navigation logicielle de l’application, **Tableau de bord** ramène le moteur de rendu au premier plan sans le recharger, et **Recharger** est une action de récupération distincte.

**Zoom (%)** ajuste la taille à laquelle le moteur de rendu dessine le tableau de bord, avec 100% par défaut. Le moteur de rendu ajoute une entrée **Paramètres de l’application** à la barre latérale Home Assistant, qui ouvre la page de configuration du panneau. Au premier lancement, il masque la barre latérale ancrée et maintient la connexion pendant l’inactivité ; vous pouvez rouvrir la barre ou changer ces réglages ensuite. L’option distincte **Masquer la navigation Home Assistant (native)** demande au frontend de retirer sa navigation lorsque le mode kiosque natif est actif. Si le tableau de bord n’a simplement pas la bonne taille, voir [Dimensionnement de l’affichage](/fr/manage/display-sizing/).

## Prérequis et compatibilité

Le moteur de rendu intégré nécessite les deux éléments suivants :

- **Home Assistant 2026.4.2 ou version ultérieure** ; et
- un Android System WebView prenant en charge l’écouteur WebMessage sécurisé utilisé par l’interface d’hôte natif de Home Assistant.

La plupart des utilisateurs ont seulement besoin d’un Android System WebView à jour. L’application du panneau vérifie cette capacité de WebView et la compatibilité de Home Assistant avant de charger le tableau de bord.

Si le panneau affiche **Mise à niveau de Home Assistant requise**, mettez Home Assistant à jour puis sélectionnez **Réessayer**. Rien sur le panneau ne peut remplacer cette mise à jour.

S’il affiche **Le navigateur de ce panneau est trop ancien**, suivez [Mettre à jour WebView](/fr/hardware/guides/update-the-webview/). Une mise à jour de l’application lancée depuis Home Assistant peut aussi installer un WebView vérifié et compatible lorsque le panneau le permet. Les autres panneaux nécessitent la méthode décrite dans le guide. Après la mise à jour de WebView, sélectionnez **Réessayer**.

Le moteur de rendu intégré ne revient jamais à un pont moins isolé. Un autre moteur de rendu peut aider lorsque Home Assistant lui-même ne peut pas être mis à jour, mais toute application de tableau de bord sur le panneau utilise le même WebView système : aucune ne peut donc contourner un WebView obsolète.

## Configuration

Sur un panneau neuf ou réinitialisé, sélectionnez **Mise en route** sur le panneau lui-même, ou ouvrez sa page de configuration depuis un ordinateur portable ou un téléphone (par exemple, `http://<panel>:8888/setup` avec le port par défaut). La configuration guidée choisit le moteur de rendu, connecte le panneau à Home Assistant, sélectionne le choix par défaut du compte, un tableau de bord ou un onglet précis, puis vous interroge sur le filtre d’entités avant le premier chargement. L’autorisation se fait dans le navigateur de l’administrateur : aucun identifiant n’est saisi sur le panneau.

Sur un panneau déjà configuré, sélectionnez **Visiter** sur sa page d’appareil dans Home Assistant, puis ouvrez **Configurer**. Sous **Connexion à Home Assistant**, saisissez l’URL Home Assistant et choisissez **Connexion par navigateur**, puis sélectionnez **Moteur de rendu intégré** comme application de tableau de bord.

## Apparence du tableau de bord et verrouillage Android

Les paramètres avancés de la page Configurer comprennent trois commandes indépendantes, chacune agissant sur une couche différente :

| Option de Configurer                                                                  | Ce qu’elle modifie                                                                                                                                                                                                                                                                      | Ce qu’elle **ne modifie pas**                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Masquer la navigation Home Assistant (native)** (désactivée par défaut)             | Une fois Home Assistant connecté, demande à son frontend de masquer sa navigation. Moteur de rendu intégré uniquement.                                                                                                                                                                  | Ne verrouille pas Android, ne masque pas ses barres système et n’injecte ni ne modifie le CSS du tableau de bord. Si Home Assistant rejette ou ne prend pas en charge la demande, le tableau de bord reste inchangé. |
| **Masquer les barres système Android** (activée par défaut)                           | Masque les barres d’état et de navigation Android pour un tableau de bord bord à bord. Balayez depuis un bord pour les afficher. Moteur de rendu intégré uniquement.                                                                                                                    | N’empêche pas de quitter l’application et ne masque pas les menus et la navigation de Home Assistant.                                                                                                                |
| **Verrouiller Android sur le tableau de bord (expérimental)** (désactivée par défaut) | Avec root, masque les barres système Android et revient au tableau de bord sélectionné en environ trois secondes si une autre application ou Applications récentes s’ouvre. Cela décourage l’usage occasionnel ; ce n’est pas une frontière de sécurité contre une personne déterminée. | Ne change pas l’apparence du tableau de bord. Aucun effet sans root. Après un redémarrage, une fenêtre déverrouillée de 60 secondes permet la récupération, puis le verrouillage enregistré s’applique à nouveau.    |

Pour un tableau de bord plus épuré, activez **Masquer la navigation Home Assistant (native)** une fois que personne n’a besoin de cette navigation sur le panneau ; **Masquer les barres système Android** est déjà activé. Activez **Verrouiller Android sur le tableau de bord** uniquement pour décourager une sortie occasionnelle de l’application, et après avoir testé les issues : la page Configurer, l’interrupteur Home Assistant, `adb`, sept appuis rapides dans le coin supérieur gauche ou la fenêtre déverrouillée après un redémarrage.

## Filtre d’entités

:::caution
L’apprentissage automatique ne peut pas prouver toutes les dépendances d’une carte personnalisée ou d’un modèle dynamique, et un ensemble d’entités incomplet peut rendre des cartes absentes ou obsolètes. Examinez l’ensemble appris après toute modification d’un tableau de bord et gardez à portée de main le moyen de désactiver le filtre.
:::

Le filtre s’applique uniquement au moteur de rendu intégré. Il modifie l’abonnement du frontend à Home Assistant : Home Assistant filtre donc les états avant de les sérialiser et de les envoyer au panneau. Les autres applications de tableau de bord ne sont pas affectées. [Performances](/fr/manage/performance/) explique pourquoi c’est généralement la plus grande amélioration sur un panneau lent.

### Procédure automatique

1. Sélectionnez **Visiter** sur la page de l’appareil du panneau dans Home Assistant, puis ouvrez **Configurer**, **Tableau de bord**, sélectionnez **Moteur de rendu intégré** et activez **Filtrage des entités**.
2. Ouvrez l’onglet **Entités** et sélectionnez **Analyser le tableau de bord maintenant**.
3. Visitez chaque onglet du tableau de bord et utilisez ses commandes, fenêtres contextuelles et contenus conditionnels pour que le panneau puisse observer leurs dépendances pendant l’exécution.
4. Examinez les listes actuelles, suggérées et exclues. Épinglez les entités utilisées indirectement par des cartes personnalisées ou des modèles, et résolvez les vérifications du filtre affichées au-dessus des tableaux.
5. Sélectionnez **Appliquer l’ensemble de règles** lorsque le candidat est prêt. Le panneau affiche les nombres d’entités avant et après, demande confirmation, puis recharge le tableau de bord avec l’abonnement filtré.

![L’onglet Entités de l’interface web du panneau, montrant le filtre d’abonnement, les entités actuellement suivies et les entités suggérées](/screenshots/ui-entities-dark.png)

La page Entités explique pourquoi chaque entité a été trouvée, consigne vos épinglages et exclusions manuels et garde visibles les règles larges ou dynamiques reconnues jusqu’à leur correction ou votre décision explicite. Des comportements non reconnus peuvent néanmoins exister : testez donc chaque onglet après l’activation du filtre. Si un élément manque, désactivez **Filtrage des entités** sur la page Configurer et rechargez avant de revoir le candidat.

### Quand le panneau retient le tableau de bord

Avec le filtrage automatique, le moteur de rendu intégré n’ouvre jamais Home Assistant sans filtre. Tant qu’une analyse n’a pas produit un ensemble qu’il peut garantir, le panneau affiche un écran natif d’attente au lieu du tableau de bord, pour l’une de trois raisons. Pendant la première analyse ou après son échec, le panneau réessaie à intervalles croissants, car la cause habituelle est que Home Assistant n’a pas encore démarré. Si Home Assistant rejette les identifiants du panneau, l’écran d’attente indique la connexion concernée. Si l’analyse s’est terminée mais a trouvé une règle qu’elle ne peut pas borner, comme un tableau de bord généré par une stratégie ou un sélecteur non borné, l’écran demande une décision : ignorer les règles signalées et continuer, désactiver le filtre ou les examiner sur la page Entités. Cette décision peut se prendre sur le panneau ou depuis tout appareil du réseau : sélectionnez **Visiter** sur la page de l’appareil dans Home Assistant, puis ouvrez **Entités** (par exemple, `http://<panel>:8888/entities` avec le port par défaut). L’écran d’attente affiche aussi l’adresse.

Une attente nécessitant une décision est stabilisée : le panneau ne réanalyse donc pas le catalogue pendant ce temps. Il demande à Home Assistant si le tableau de bord a changé cinq minutes après cette stabilisation, puis au maximum une fois par heure ; il ne relance l’analyse que si la configuration du tableau de bord ou le choix par défaut du compte a réellement changé, si la décision est prise ou si les réglages Home Assistant du panneau changent.

Une mise à jour de l’application peut amener le panneau à revérifier un tableau de bord déjà filtré. Si cette revérification signale une règle sur un tableau de bord déjà filtré, le panneau enregistre la règle comme ignorée, restaure l’ensemble d’entités utilisé et ouvre le tableau de bord au lieu de le retenir ; la règle reste visible sur la page Entités et peut y être réactivée. Cela s’applique uniquement à une revérification due à une mise à jour, lorsqu’un filtre précédemment accepté existe et que l’ensemble restauré n’est pas vide. Les règles que le panneau ne peut jamais ignorer, comme un tableau de bord trop volumineux à analyser, retiennent toujours le moteur de rendu.

### Modèles et épinglages manuels

L’application du panneau n’exécute pas les modèles du tableau de bord : elle ne peut donc pas savoir quelles entités un modèle renvoie et ne le devine pas. Elle traite différemment les deux sortes d’entités utilisées par un modèle.

Les entités qu’un modèle **lit** seulement, comme un état testé dans une condition, n’exigent rien. Home Assistant exécute lui-même le modèle et envoie le résultat au panneau via un abonnement distinct que le filtre ne touche pas. Ces entités sont censées être absentes des listes de la page Entités ; les ajouter ne ferait qu’élargir l’abonnement sans avantage.

Les entités qu’un modèle **renvoie** sont différentes. Elles deviennent des cartes du tableau de bord qui lisent leur état via l’abonnement filtré : elles doivent donc y figurer. Le panneau ne peut pas les découvrir sans exécuter le modèle ; choisir de continuer malgré une vérification de découverte d’entités ne les ajoute pas non plus. Ce choix permet seulement aux mises à jour automatiques de continuer sans elles.

Pour en ajouter une, saisissez une partie de son nom ou de son identifiant dans le champ de recherche en haut de la page Entités. La recherche couvre tout le catalogue Home Assistant, et non seulement les entités déjà trouvées, et indique le nombre de correspondances de chaque tableau. Définissez chaque entité nécessaire sur **Épinglée**. Un épinglage manuel reste jusqu’à son retrait, y compris après modification du tableau de bord et nouvelles analyses.

### Réinitialiser les données apprises

Utilisez **Réinitialiser les données apprises** sur la page Entités lorsque d’anciennes observations du tableau de bord ou décisions manuelles rendent le candidat trompeur. Après confirmation, cette action efface les appartenances et observations apprises, les épinglages et exclusions manuels et les décisions de sécurité ignorées. Elle conserve le filtre actif connu comme fonctionnel et le catalogue Home Assistant utilisé pour les noms du candidat, et lance une nouvelle analyse si l’apprentissage est activé. La réinitialisation reconstruit donc le candidat au lieu d’élargir immédiatement l’abonnement à tous les états Home Assistant.

## Thèmes

**Thème du tableau de bord** (Configurer, puis Moteur de rendu intégré) détermine qui choisit entre clair et sombre :

- **Comme dans Home Assistant** (par défaut) laisse le choix à Home Assistant. Le panneau ne fournit qu’un point de départ : sur Android 13 et ultérieur, il suit en direct le réglage système ; sur Android 10 à 12, il suit ce réglage au chargement ; sur Android 9 et antérieur, l’interrupteur **Mode sombre** (Configurer, puis Affichage) le définit. Un thème choisi dans Home Assistant prime sur ce point de départ.
- **Lumière ambiante** choisit clair ou sombre à partir du modèle de pièce utilisé par la luminosité automatique. Celle-ci doit être activée ; avant l’arrivée de mesures utilisables, le choix suit Home Assistant. Un changement exige une minute entière de lumière ou d’obscurité soutenue.
- **Sombre** et **Clair** laissent le panneau choisir. Ils conviennent à un tableau de bord kiosque dont la barre latérale est masquée et où le profil Home Assistant est donc inaccessible depuis le panneau.

Forcer un thème ne change que la composante claire ou sombre du choix. Le thème nommé et ses couleurs restent exactement identiques ; revenir à Comme dans Home Assistant rétablit la composante claire ou sombre précédente, ou Auto si rien n’était défini. Le panneau ne modifie jamais le thème enregistré pour votre compte Home Assistant : un panneau réglé sur Sombre ne peut donc pas assombrir votre téléphone.

Un cas ne peut pas être remplacé. Si cet utilisateur Home Assistant a explicitement choisi Clair ou Sombre plutôt qu’Auto, ce choix reste prioritaire, car le remplacer modifierait un réglage partagé avec tous les autres appareils connectés sous ce compte. Réglez le thème de l’utilisateur sur Auto, ou attribuez au panneau son propre utilisateur Home Assistant, et le choix du panneau s’applique. Le panneau le signale : la carte **Diagnostics d’exécution** de son interface web indique que le thème Home Assistant prend le pas sur Thème du tableau de bord, et la ligne `[renderer]` du rapport `/diag` contient `theme_overridden=true`.

L’interface web du panneau est indépendante de tout cela et suit toujours le navigateur dans lequel vous la consultez.

## Utiliser plutôt une application de tableau de bord distincte

Si un panneau a besoin d’une capacité citée dans [Limites](#limites), ouvrez Configurer et sélectionnez l’autre application installée sous **Appli du tableau de bord**. Le changement est immédiat. Ne choisissez pas **Auto** pour cela, car Auto utilise le moteur de rendu intégré dès qu’il est prêt.

## Limites

- **Pas de prise en charge de plusieurs serveurs Home Assistant ni des notifications natives.** Conservez une application de tableau de bord distincte si ces fonctions sont nécessaires. La commande vocale Assist ne figure pas dans cette liste : elle vient de l’[assistant vocal](/fr/manage/voice-assistant/) du panneau équipé d’un microphone, quelle que soit l’application de tableau de bord active.
- **Pas de fonctions multimédias plein écran supplémentaires**, comme un sélecteur de fichiers ou une lecture de type diffusion vers un autre appareil. Elles sont hors périmètre.
- Un **WebView système à jour** reste nécessaire pour afficher le frontend Home Assistant. Un WebView obsolète déclenche un avertissement de santé dans l’interface web ; mettez-le à jour avec la [méthode adaptée à votre panneau](/fr/hardware/guides/update-the-webview/).
- La connexion par navigateur et l’installation avancée non interactive fonctionnent toutes deux sans root.
