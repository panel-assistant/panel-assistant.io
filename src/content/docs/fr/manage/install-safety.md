---
title: Sécurité de l’installation
description: Les vérifications de l’ancien installateur en ligne de commande, ses sauvegardes avant modification d’un panneau et ses conditions d’arrêt.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Cette page décrit les vérifications de l’ancien [installateur en ligne de commande](/fr/manage/command-line-install/), qui installait les panneaux avant ha-paneld v0.9.9. Panel Assistant installe et met désormais à jour les panneaux : il vérifie un panneau avant toute modification et sauvegarde ses réglages avant chaque mise à jour, comme décrit dans [Mises à jour et récupération](/fr/manage/updates-and-recovery/).

## Frontières de confiance et d’identifiants

Les fichiers d’identifiants gardent les secrets hors de l’historique du shell et des lignes de commande des processus enfants sur l’ordinateur qui exécute l’installateur. Ils n’ajoutent aucun chiffrement à l’API de gestion du panneau. L’API du panneau (par exemple, `http://<panel>:8888` avec le port par défaut) suit le modèle de réseau de confiance du projet : les identifiants du courtier et les jetons Home Assistant traversent donc cette connexion en HTTP non chiffré. N’exécutez l’installateur que sur un réseau de confiance segmenté. La [référence de sécurité](/fr/reference/security/) décrit ce modèle.

La connexion avec un nom d’utilisateur et un mot de passe Home Assistant fonctionne différemment. Le mot de passe passe de l’ordinateur d’installation au point de connexion Home Assistant et n’atteint jamais le panneau. Utilisez une URL Home Assistant `https://` pour chiffrer le transit ; une URL `http://` envoie le mot de passe sans chiffrement. Le panneau ne reçoit que le jeton de renouvellement obtenu, qui peut être révoqué.

Les exports de configuration contiennent des secrets et sont écrits avec des permissions réservées au propriétaire ; traitez-les comme des identifiants. Les copies automatiques des réglages et de la base avant mise à niveau sont aussi placées dans un répertoire réservé au propriétaire, en fichiers de mode 600.

## Authentification des versions et paquets

L’installateur sans dépôt local télécharge l’application et l’outil de provisionnement de la même version. Il authentifie les binaires publiés de l’application et de l’assistant à partir d’enregistrements SHA-256 signés avec la clé de publication avant de modifier le panneau. Il examine aussi le paquet et le signataire de l’application avec Android Build-Tools. Ces outils sont facultatifs pour une première installation sur un panneau sans application, où Android vérifie lui-même la signature à l’installation, et obligatoires pour mettre à jour un panneau déjà équipé : l’installateur compare les signataires installé et nouveau avant toute modification et refuse plutôt que de deviner. Une différence de signataire retirerait sinon l’assistant actif avant l’échec de l’installation. L’installateur choisit l’assistant correspondant à l’ABI indiquée par le panneau.

Une application compilée localement suit une voie de développement distincte. Elle doit toujours contenir le paquet ha-paneld avec exactement un signataire valide, mais peut utiliser la propre clé de signature cohérente du compilateur. `--require-release-signer` renforce ce contrôle lorsque le fichier local est censé être une compilation officielle. `--allow-unsigned-helper` est une acceptation distincte pour les binaires d’assistant contrôlés par le compilateur local plutôt qu’authentifiés comme fichiers de publication.

## Sauvegardes et récupération

Trois fichiers différents assurent trois fonctions de récupération :

- Un **export JSON de configuration** contient les réglages et secrets. `--export FILE` en crée explicitement un, et l’installateur essaie aussi d’en créer automatiquement un réservé au propriétaire avant une mise à niveau ordinaire. Il ne contient ni le catalogue des profils d’exécution, ni la sélection de profil, ni les états appris des entités, ni les historiques, ni une connexion Home Assistant détenue par une application de tableau de bord distincte.
- Une **sauvegarde `.hpb`** depuis **Installer**, puis **Sauvegarde**, sur l’interface web du panneau est la sauvegarde prise en charge la plus complète. Elle contient les réglages, l’état durable du panneau, le catalogue de profils et une connexion admissible détenue par une application de tableau de bord distincte. Le catalogue d’entités appris et les historiques de proximité et d’ambiance sont réappris plutôt que restaurés. Restaurez un `.hpb` via **Installer**, puis **Restaurer**, sur cette même page. `--restore FILE` de l’installateur accepte du JSON de configuration, pas des sauvegardes `.hpb`.
- Un **`…break-glass.db`** automatique est une copie de dernier recours de la base interne du panneau. Rien ne la restaure automatiquement ; elle n’est valide que pour le même panneau et la même version de l’application dont elle provient.

Lorsque `--export FILE` est combiné à des options d’installation ou de configuration, l’export vérifié est écrit avant toute modification du panneau. S’il ne peut pas être produit et vérifié, l’exécution s’arrête. Exécutez d’abord `--export FILE` séparément si vous voulez exporter sans installer.

L’export automatique des réglages avant une mise à niveau ordinaire est effectué dans la mesure du possible. S’il ne peut pas être créé, l’installateur retire le fichier partiel, consigne l’absence d’export et poursuit le remplacement de l’application.

Avant une désinstallation, un effacement des données de l’application ou toute récupération destructive, créez une sauvegarde distincte via **Installer**, puis **Sauvegarde**, et vérifiez que le `.hpb` téléchargé n’est pas vide. Ces opérations détruisent les données de l’application. Un `adb install -r` ordinaire les conserve.

`--reset-config` fonctionne délibérément différemment. **La réinitialisation est irréversible et ne crée aucune sauvegarde.** Elle demande sa propre confirmation, puis supprime toutes les données de l’application du panneau. L’application, l’assistant et les autres applications Android restent installés.

## Instantané automatique de la base de données

Avant chaque mise à niveau ordinaire, l’installateur essaie de capturer la base du panneau, qui contient la configuration, le catalogue d’entités, les historiques de proximité et d’ambiance et l’historique des révisions conservé sur le panneau. L’instantané aide à récupérer après une désinstallation ou une autre réparation destructive ultérieure ; le remplacement normal sur place d’une application Android laisse la base d’origine à sa place.

L’installateur envoie à l’application active une demande de préparation de mise à niveau, uniquement via ADB. L’application cesse d’accepter du nouveau travail, termine les écritures en attente, suspend les écritures en base, vide son état, effectue un point de contrôle du journal SQLite d’écriture anticipée et ferme la base. Elle n’accuse réception de cette demande exacte qu’après avoir consigné l’ancien processus, la version de l’application, le nombre d’octets, un SHA-256 vérifiable par l’ordinateur, la version du schéma et le nombre de lignes d’état.

L’installateur copie la base fermée directement depuis le stockage privé de l’application, sans créer une seconde copie sur le panneau. La copie sur l’ordinateur n’est acceptée que si sa taille et son SHA-256, toujours vérifié, correspondent à l’accusé de réception et si les contrôles locaux d’intégrité SQLite, de schéma et de lignes réussissent.

Si l’application ne renvoie pas l’accusé exact, par exemple en raison d’un délai dépassé ou d’une réponse mal formée, l’installateur utilise une seule fois `.backup` de SQLite en direct. Cela produit la même base autonome unique, sans journal d’écriture anticipée ni autres fichiers de journal à côté. Un panneau sans voie root ne peut pas exposer sa base privée : seul l’export des réglages peut donc être disponible.

Pour une mise à niveau ordinaire sur place, la sauvegarde de base est effectuée dans la mesure du possible. Une copie échouée ou incohérente est supprimée, l’installateur affiche un avertissement bien visible et le remplacement de l’application peut continuer avec les données d’origine intactes. Une copie invalide n’est jamais conservée ni étiquetée comme sauvegarde réussie.

Aucun seuil fixe d’espace libre ne s’applique à cette sauvegarde. La voie normale ne stocke rien sur le panneau, et le seul repli laisse la capture réelle déterminer si l’espace suffit. Une pression sur le stockage, un contrôle de santé de la base échoué, un point d’état inaccessible, une réponse mal formée ou un état inconnu sont signalés avant et après l’installation. Aucun ne bloque le remplacement ordinaire d’une application, car la nouvelle compilation peut être la seule tentative de récupération utile pour une ancienne compilation défaillante ou inaccessible. Un `--verify` autonome signale ces conditions comme un échec si vous avez besoin d’un résultat strict.

## Fuseau horaire et contrôles de première installation

Avant de modifier le panneau, l’installateur compare son fuseau horaire à celui de l’ordinateur. Une différence est un avertissement, pas un arrêt, car un panneau peut légitimement utiliser un autre fuseau. La comparaison utilise les noms de fuseaux plutôt que le décalage UTC actuel et résout les alias connus via la base de fuseaux de l’ordinateur. Elle repère les panneaux restés sur le fuseau d’usine, qui horodateraient sinon les journaux et exécuteraient les programmes à la mauvaise heure locale.

Le contrôle reste silencieux si l’une des valeurs ne peut pas être établie. Une réponse absente, un nom de fuseau invalide ou un alias inconnu de la base de l’ordinateur ne fait ni échouer ni modifier l’installation.

Un panneau vierge ne possède pas de point d’état pour l’application du panneau, et certaines installations défaillantes non plus. L’installateur demande au gestionnaire de paquets Android si ha-paneld est installé avant de décider du cas rencontré. Un « non installé » certain lance une première installation normale. Une requête au gestionnaire de paquets ou à ADB sans réponse arrête l’exécution avant toute modification du panneau.

## Mises à niveau de l’assistant root

Les versions publiées incluent des binaires d’assistant scellés `armeabi-v7a` et `arm64-v8a`. Sur un panneau doté du `su` du fabricant ou d’ADB root, l’installateur authentifie le binaire sélectionné avec la clé de publication, le vérifie à nouveau après son transfert et l’installe ou le met à niveau atomiquement. Il vérifie les capacités du protocole et l’identité de compilation reproductible requises avant de remplacer l’application.

L’ancien assistant appartenant à root et son service restent disponibles jusqu’à la réussite de l’installation de l’application. Un échec d’installation ou de démarrage de l’assistant, ou une identité ou capacité incorrecte, restaure le couple fonctionnel précédent avant le remplacement de l’application. Si la connexion ADB tombe pendant qu’Android installe l’application, l’installateur conserve son journal de récupération. Relancer la même commande authentifie l’application installée et l’assistant actif, puis termine ou annule la mise à niveau interrompue.

Les instantanés de récupération appartiennent à root, sont authentifiés par leur empreinte enregistrée et synchronisés vers le stockage avant le retrait des fichiers actifs. L’installateur refuse de démarrer en présence d’une transaction d’assistant inachevée et indique la commande à relancer.

L’installateur privilégie un service init sur un `/system` accessible en écriture lorsqu’il peut vérifier que l’espace suffit. Si `/system` est en lecture seule, il utilise un lanceur Magisk, KernelSU ou APatch vérifié dans `/data/adb/service.d`. Un panneau dont `/system` est accessible en écriture mais encombré peut conserver l’assistant et les fichiers de récupération sous `/data/adb/hapaneld`, avec seulement le service de démarrage dans `/vendor/etc/init` ; les mises à jour suivantes conservent cette disposition vérifiée. L’installateur s’arrête avant de remplacer l’application s’il ne peut pas établir la capacité de stockage, le responsable du démarrage ou l’état d’une transaction existante.

L’application embarque l’assistant correspondant comme repli. Si un panneau avec une installation `su` directe est mis à jour depuis l’onglet Installer ou l’entité de mise à jour Home Assistant avant un nouveau passage de l’installateur, le premier démarrage de l’application vérifie le protocole d’assistant requis et peut lancer une copie appartenant à root depuis `/data/local`. Un panneau rooté qui isole root ne peut pas laisser un ancien assistant se remplacer lui-même en sécurité : il bloque donc l’opération et demande l’exécution de l’installateur authentifié depuis un ordinateur.

## Ce qui peut arrêter une exécution

L’installateur s’arrête avec un résultat non nul s’il ne peut pas établir en sécurité un élément nécessaire à l’opération demandée. Par exemple : une requête de paquet sans réponse, une application avec un paquet ou signataire incorrect, une transaction d’assistant irrécupérable, un export de configuration demandé non vérifiable ou un autocontrôle requis après installation échoué.

D’autres constats restent des avertissements, car arrêter rendrait la récupération plus difficile. Une sauvegarde automatique de base indisponible, un avertissement de santé du stockage ou un appel d’état échoué avant la mise à niveau n’empêche pas à lui seul le remplacement ordinaire sur place. L’installateur énonce clairement cette limite au lieu de présenter un fichier de récupération partiel ou invalide comme une réussite.

### Comprendre un refus

Chaque refus nomme une condition et ne change rien sur le panneau sauf indication contraire. Le message est formulé pour indiquer quoi réparer, ce qui compte car les remèdes diffèrent fortement.

- **La base canonique changeait sans cesse pendant sa lecture.** L’application du panneau écrivait encore dans sa base pendant que l’installateur essayait d’en prendre une copie cohérente. Le panneau est occupé, pas endommagé. La copie est réessayée automatiquement : ce message signifie donc que l’application a continué à écrire pendant toutes les tentatives ; relancer l’installateur lorsque le panneau est plus calme suffit généralement.
- **La base canonique n’a pas pu être lue**, ou **n’est pas un fichier ordinaire.** C’est le cas inverse : il concerne les données stockées, pas l’application. Le fichier est absent, n’est pas un fichier ou ne peut pas être ouvert. Récupérez la base avant de réessayer.
- **La base canonique manque alors que l’application est installée.** L’application est présente mais pas son stockage, ce qu’une mise à niveau ordinaire ne résout pas. Restaurez une sauvegarde plutôt que de réessayer.
- **La cible d’installation est en lecture seule.** Le répertoire d’installation de l’assistant privilégié se trouve sur un système de fichiers monté en lecture seule. Le remonter en écriture ne nécessite pas de redémarrage sur la plupart des panneaux. L’installateur indique le système de fichiers mesuré : vérifiez cette ligne avant de supposer quelle partition est concernée.
- **La cible d’installation manque d’espace ou d’inodes libres.** Les deux indiquent les mesures et sont distingués parce qu’un panneau peut manquer de l’un tout en ayant largement assez de l’autre.
- **Une mise à niveau précédente incomplète n’a pas pu être réconciliée.** Une exécution précédente a laissé un enregistrement de récupération que l’installateur ne peut pas rapprocher de l’installation actuelle. Rien n’est modifié. Il faut examiner cet enregistrement plutôt que réessayer, car une nouvelle tentative aboutira à la même conclusion.
- **L’application reste installée un certain temps après le provisionnement de sa remplaçante.** La nouvelle application a été installée mais l’ancienne n’a pas été retirée dans le délai attendu. Le panneau fonctionne ; c’est le retrait qui n’a pas abouti.

Un refus mentionnant un retour arrière précise si celui-ci a été vérifié. « Retour arrière effectué et vérifié » signifie que le panneau est dans son état antérieur à l’exécution. « Le retour arrière n’a pas pu être vérifié » signifie que l’assistant privilégié doit être contrôlé avant de compter sur les opérations privilégiées, même si l’application elle-même n’a pas été remplacée.
