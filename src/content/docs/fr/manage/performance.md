---
title: Performances
description: Pourquoi un panneau mural peut sembler lent avec un tableau de bord fluide sur téléphone, comment le mesurer et quelles corrections privilégier.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Un panneau mural Android économique peut sembler lent, saccader au défilement, devenir vide ou cesser de s’actualiser alors que le même tableau de bord fonctionne bien sur téléphone ou ordinateur. Commencez par le travail envoyé par Home Assistant au panneau, puis mesurez les limites restantes du tableau de bord et du matériel avant de supposer qu’il faut remplacer le panneau.

:::tip
Une cause fréquente est le nombre d’états et de mises à jour d’entités Home Assistant reçus par le tableau de bord. [La course](/fr/manage/drag-race/) montre ce coût sur deux panneaux identiques filmés côte à côte. Une grande installation peut faire traiter à un panneau peu puissant des milliers d’entités jamais affichées. Avec le [moteur de rendu intégré](/fr/manage/built-in-renderer/), la première correction à essayer est le filtrage des entités.
:::

## Mesurer avant toute modification

Sélectionnez **Visiter** sur la page d’appareil du panneau dans Home Assistant pour ouvrir son interface web (par exemple `http://<panel-ip>:8888/` avec le port par défaut). Enregistrez la même vue pendant une durée comparable avant et après chaque changement pour une comparaison significative.

- **Réactivité du tableau de bord** : latence réelle d’interaction, interaction la plus lente décomposée en temps d’entrée, de traitement et de présentation, blocage du fil principal, délai avant interactivité et rechargements inattendus du moteur de rendu.
- **Flux d’état Home Assistant** : mises à jour par seconde, débit JSON non compressé, taille de l’hydratation initiale, délai avant que le fil principal rende la main, et trois entités ayant le plus grand volume total de données sur la dernière heure ; leur fréquence de mise à jour est également affichée.
- **Performances** et **Processus principaux** : CPU, GPU, RAM, fréquence, température et processus les plus actifs.
- **Flux de la caméra**, sur un panneau proposant une caméra : abonnés maintenant la session ouverte, encodeur utilisé, fréquence demandée à côté de celle livrée, débit livré à côté du plafond de l’encodeur. Un débit bien inférieur à la demande est signalé sans cause attribuée : cadence de capture en pièce sombre, encodage et concurrence sur le matériel vidéo sont tous possibles ; la carte ne choisit pas au hasard. La demande n’est jamais réduite silencieusement : lorsque la session ne peut fournir la fréquence demandée, la carte montre celle-ci à côté de la fréquence donnée à l’encodeur. La carte n’affiche volontairement aucun chiffre CPU : un encodage matériel utilise le codec et le compositeur en plus de l’application ; aucun processus unique ne représente son coût. Lisez la charge totale dans Performances et Processus principaux.
- **Page Entités** : abonnement actuel du moteur intégré, découvertes de l’apprentissage automatique et règles du tableau de bord nécessitant encore une décision.
- **Rapport de diagnostic** (`/diag`) : rapport à copier dans un ticket si la cause reste incertaine.

Le moteur intégré collecte directement ces mesures navigateur, sans root ni débogage WebView. Avec une application de tableau de bord distincte, l’application du panneau peut montrer le CPU du moteur et les chiffres de rendu Android si root ou l’auxiliaire est disponible, mais ne mesure pas sa latence réelle d’interaction.

La mesure du fil principal pour les événements d’état commence à la distribution d’un message Home Assistant pertinent et finit quand le navigateur rend la main après tous ses gestionnaires et microtâches. Elle inclut le faible coût de l’observateur de l’application et tout autre travail dans la même tâche ; elle n’est donc volontairement pas nommée temps consacré à Home Assistant seul. Le débit est le JSON non compressé traité par le frontend, pas le trafic réseau compressé.

Utilisez le graphique aligné pour chercher les corrélations. Des pics d’interaction coïncidant avec un trafic d’états important et l’occupation des événements d’état orientent vers la taille du flux. Un traitement lent avec un flux calme oriente vers le JavaScript du tableau de bord. Un délai de présentation et de longues images de rendu orientent vers la disposition, les animations, caméras ou médias. Des rechargements répétés orientent vers la mémoire ou l’instabilité du moteur. Lisez les mesures ensemble ; un instantané CPU ne suffit pas à identifier la cause.

La ligne **Cause probable** applique ces règles prudemment et indique son degré de confiance. Si les éléments ne soutiennent pas une cause dominante, elle le dit.

### Comparer avec et sans filtre depuis l’extérieur du panneau

Si le tableau de bord non filtré surcharge son propre WebView, les chiffres dans la page peuvent se figer. Un collecteur lancé sur ordinateur interroge plutôt l’interface de performances propre à l’application, appartenant à l’API REST obsolète (voir la [référence des commandes](/fr/reference/api/#the-rest-api-is-deprecated)). Le CPU du panneau reste ainsi observable, ainsi qu’une sonde native du fil du moteur Chromium si root ou l’auxiliaire est disponible. Il consigne aussi l’âge du dernier lot de mesures navigateur ; au-delà de 15 secondes, il le signale bloqué au lieu de le considérer comme actuel.

Le collecteur ne change pas la configuration. Il n’active ni ne désactive ou réécrit le filtre ; sa première requête peut créer une clé privée d’installation dans l’état interne de l’application. Sélectionnez la même vue et la même charge pour les deux essais, changez le filtre dans l’interface web, attendez le rechargement, puis exécutez une commande depuis une copie du [dépôt ha-paneld](https://github.com/panel-assistant/android) pour chaque état :

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect filtered --label filtered --output filtered.json
```

```bash
python3 tools/measure-dashboard-performance.py collect --panel http://192.168.1.50:8888 --expect unfiltered --label unfiltered --pair-with filtered.json --output unfiltered.json
```

Comparez les deux résultats :

```bash
python3 tools/measure-dashboard-performance.py compare filtered.json unfiltered.json --output comparison.json
```

Chaque essai dure par défaut trois minutes, avec 30 secondes de préchauffage et une interrogation toutes les 10 secondes. `--pair-with` réutilise un identifiant opaque du premier résultat afin de refuser un panneau physique différent, une autre configuration Home Assistant ou de tableau de bord, ou un réglage influençant la mesure modifié, sans enregistrer ces valeurs privées. Il ne détecte pas une autre vue choisie manuellement dans le même tableau de bord : gardez donc la même vue et la même charge.

Le collecteur refuse un essai si le mode attendu est inactif, si la révision du filtre ou la génération du moteur change, si la version ou la configuration change pendant la collecte, si le filtrage revient au repli ou s’il conserve moins de trois échantillons, moins de trois mesures CPU du panneau ou moins de trois mesures CPU natives du moteur. Il écrit tout de même le résultat refusé avec les raisons exactes et n’écrase jamais un fichier existant.

Le JSON omet URL et identifiant du panneau, URL Home Assistant et chemin du tableau de bord, identifiants d’entités, noms de processus et empreinte du filtre. Le panneau calcule les empreintes opaques avec une clé aléatoire privée de 256 bits qui ne le quitte jamais ; elles sont propres à une paire de comparaison, donc on ne peut ni relier des mesures distinctes ni deviner le nom du panneau grâce à elles. Un panneau incapable de stocker la clé refuse la mesure. Le nombre d’entités non filtrées est le dernier nombre synchronisé du catalogue, pas un nombre récupéré en direct du WebView surchargé ; il est indisponible si le catalogue est vide. Les compteurs réseau et navigateur sont normalisés aux intervalles réellement observés, pour qu’une interrogation manquée ne fausse pas la comparaison. Délais et débits navigateur sont exclus des résumés lorsqu’ils sont périmés, tandis que CPU, mémoire, réseau et chiffres du moteur fournis par l’application continuent d’être collectés.

### Débogage distant WebView facultatif

Les cartes de performances intégrées ne nécessitent pas DevTools. Utilisez la carte **Débogage WebView à distance** uniquement pour examiner en profondeur le code de la page.

Avec une application distincte, activez d’abord son propre débogage distant WebView et relancez le tableau de bord ; sans cela, le relais ne trouve pas son WebView. Le relais réseau exige root.

### Écarter le défaut du chien de garde Zigbee d’origine du NSPanel Pro

Les anciens micrologiciels Sonoff NSPanel Pro contenant l’affectation récursive `export LD_LIBRARY_PATH=/vendor/bin/siliconlabs_host/:${LD_LIBRARY_PATH}` peuvent faire du `guard_process.sh` du fabricant la source du problème. Une [enquête communautaire](https://github.com/panel-assistant/android/issues/34) a confirmé le défaut sur un NSPanel Pro 120 en version d’origine 3.8.0 et l’a signalé sur les 16 panneaux de cet utilisateur. Le script ajoute son répertoire toutes les cinq secondes. Après environ dix heures, la chaîne d’environnement dépasse la limite Linux par chaîne pour démarrer un programme ; les commandes externes échouent avec `E2BIG`, `sleep` ne retarde plus la boucle et le chien de garde peut saturer un cœur CPU. Il peut aussi ne plus redémarrer un `zgateway` arrêté, rendant Zigbee indisponible. Les versions 1.x à 3.x pourraient être touchées partout où cette ligne existe, mais cela n’a pas été vérifié indépendamment.

Cherchez ces signes si un NSPanel Pro d’origine au repos signale une charge système périodique :

- `guard_process.sh` reste près de 100 % d’un cœur et sa taille dépasse largement les quelque 9 MB normaux ;
- `zgateway` manque ou ne se rétablit plus ;
- un redémarrage aide, mais la charge revient environ dix heures après.

Un redémarrage ne remet à zéro l’environnement accumulé que temporairement. Le ticket lié contient une solution root/ADB fournie par l’utilisateur, non validée indépendamment par le projet. Ne l’appliquez que si l’affectation récursive exacte apparaît une seule fois dans le script fabricant. Toute réparation doit d’abord vérifier une sauvegarde non vide et préserver propriétaire, mode et métadonnées SELinux. Arrêtez avant toute modification en cas de correspondance inattendue ; après modification, revenez en arrière si le redémarrage ou la vérification échoue, remettez `/vendor` en lecture seule et vérifiez `zgateway` ainsi que sa disponibilité dans Home Assistant. Une mise à jour réécrivant `/vendor` supprime le correctif local ; le défaut ne revient que si le nouveau micrologiciel contient encore l’affectation. L’examen communautaire de 4.0.12 et 4.6.0 ne l’a pas trouvée.

Ce défaut est distinct d’un `zgateway` stable bouclant sur une radio sans réponse. Le capteur de santé Zigbee sépare CPU du chien de garde et de la passerelle, preuves d’association et historique des redémarrages. Il avertit de l’affectation exacte sans modifier lui-même les scripts fabricant. Une passerelle configurée explicitement non associée à un réseau, restant au-dessus de 50 % d’un cœur pendant cinq échantillons d’une minute après son délai de grâce de 15 minutes, est automatiquement désactivée et contenue ; un routeur associé avec CPU élevé ne produit qu’un avertissement.

## Corrections par ordre d’impact

### 1. Filtrer l’abonnement aux entités du moteur intégré

Le frontend Home Assistant s’abonne normalement à l’état de toutes les entités visibles par l’utilisateur connecté. Le panneau doit toutes les recevoir et traiter même si son tableau de bord n’en utilise que quelques-unes. Le moteur intégré peut ajouter l’ensemble d’entités appris du tableau de bord à cet abonnement ; Home Assistant filtre alors le flux avant sérialisation et envoi. Le panneau conserve sa connexion authentifiée habituelle ; aucun proxy ni serveur supplémentaire n’intervient.

Le filtre ne s’applique qu’au moteur intégré. La configuration guidée propose son activation avant le premier chargement ; sur un panneau déjà configuré :

1. Sélectionnez **Visiter** sur sa page d’appareil Home Assistant, puis **Configurer**, **Tableau de bord**, **Moteur de rendu intégré (ha-paneld)** et activez **Filtrage des entités**.
2. Ouvrez l’onglet **Entités** et sélectionnez **Analyser le tableau de bord maintenant**.
3. Visitez chaque onglet et utilisez commandes, fenêtres et contenu conditionnel pour permettre l’observation des dépendances à l’exécution.
4. Examinez les entités actuelles, suggérées et exclues. Épinglez celles nécessaires indirectement à une carte personnalisée ou un modèle.
5. Résolvez les contrôles du filtre. Réduisez les règles trop larges ou dynamiques si possible, ou faites un choix explicite et acceptez l’avertissement affiché.
6. Appliquez l’ensemble, laissez recharger et comparez les mêmes vues avec les cartes de performances de l’onglet Tableau de bord.

L’apprentissage ne peut pas prouver toutes les dépendances d’une carte personnalisée ou d’un modèle dynamique. Une entité manquante peut figer ou rendre indisponible une carte ; examinez donc d’abord le résultat sur un panneau non indispensable et gardez le filtre désactivé tant que le candidat n’est pas crédible. L’abonnement non filtré reste la voie de retour : désactivez **Filtrage des entités** et rechargez.

Si les anciennes observations ou choix manuels ne décrivent plus le tableau de bord, utilisez **Réinitialiser les données apprises** sur la page Entités. Après confirmation, cela efface appartenances apprises, épinglages, exclusions et décisions de sécurité ignorées, conserve le filtre actif connu comme fonctionnel et lance une analyse. Le filtre reste le repli pendant la reconstruction du candidat.

### 2. Alléger le tableau de bord

- Divisez un tableau dense en vues ciblées et évitez les cartes inutiles au panneau.
- Préférez les cartes intégrées lorsqu’une carte personnalisée anime en continu, construit un arbre de document volumineux ou exécute souvent du JavaScript.
- Surveillez le traitement des interactions, les longues images d’animation et les rechargements. Si une vue domine, simplifiez-la ou utilisez temporairement `button.<panel>_reload` pendant la recherche de la carte coûteuse.
- Testez séparément les cartes caméra et graphiques. Décodage, requêtes d’historique et rendu peuvent dominer même avec un filtrage fonctionnel.

### 3. Réduire les mises à jour inutiles à la source

Le filtrage protège des entités non affichées, sans rendre moins coûteuse une entité nécessaire. Si le tableau montre un compteur électrique, un capteur de distance Bluetooth, un modèle changeant vite ou une entité diagnostic bruyante, réduisez sa fréquence à la source si son intégration le permet. Cela peut aussi réduire le travail d’enregistrement et de base de données de toute l’installation Home Assistant.

Les outils utiles comprennent les filtres throttle et delta ESPHome, les intervalles de rapport Zigbee, les réglages `scan_interval` et des mises à jour de modèles moins fréquentes. Vérifiez que le changement ne nuit pas à une automatisation ou à l’historique avant de le généraliser.

### 4. Adapter le tableau restant au matériel

Les panneaux PX30 et RK3566 peuvent bien exécuter un tableau ciblé, mais leurs performances sur un seul fil restent limitées et ils n’ont généralement que 2 GB de RAM. Le filtrage retire le travail d’état inutile ; il ne rend pas gratuit un flux caméra surdimensionné, une animation complexe ou un immense graphique historique. Concevez pour la taille logique de l’écran et testez la vue la plus lourde, pas seulement l’accueil. Les [pages matériel](/fr/hardware/) comparent les panneaux pris en charge.

## Liste de vérification

- [ ] Le moteur intégré est sélectionné partout où les notifications natives ne sont pas nécessaires
- [ ] Le filtrage automatique est activé, analysé, vérifié et appliqué explicitement
- [ ] Tous les onglets, fenêtres et chemins conditionnels ont été utilisés pendant l’apprentissage
- [ ] Les dépendances des cartes personnalisées et modèles sont épinglées ou prises en compte
- [ ] Les contrôles du filtre ont été résolus délibérément, pas ignorés par accident
- [ ] Les mêmes vues ont été comparées avant/après avec les cartes de l’onglet Tableau de bord
- [ ] Si la page non filtrée se bloque, les deux essais ont été collectés et validés par le script
- [ ] Cartes lourdes, flux caméra et graphiques ont été testés séparément
- [ ] Les entités nécessaires à haute fréquence ont été réglées à la source si approprié
- [ ] Sur une pile Zigbee NSPanel Pro d’origine, `guard_process.sh` a été vérifié
- [ ] Rechargement et désactivation du filtre ont été essayés comme voies de récupération

## Référence

### Pourquoi une grande installation Home Assistant peut ralentir un panneau

Le frontend Home Assistant garde un abonnement WebSocket aux états actuels et à toutes les mises à jour ultérieures des entités accessibles à l’utilisateur. Sans ensemble restreint, le moteur reçoit bien plus de données qu’un tableau mural ciblé n’en utilise. Son fil JavaScript principal doit analyser les messages, actualiser le modèle d’état et déterminer si quelque chose de visible a changé.

Les panneaux économiques y sont particulièrement sensibles : JavaScript, disposition et peinture dépendent fortement d’un seul fil de rendu. Des cœurs supplémentaires aident pour d’autres tâches sans supprimer ce délai ; une RAM limitée rend le ramasse-miettes de plus en plus perturbant quand la mémoire WebView croît.

### Symptômes courants

| Symptôme                                                                                        | Cause probable                                                                          |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Touchers retardés, navigation lente ou défilement saccadé                                       | Travail du fil principal dû à un gros flux d’entités, à des cartes lourdes ou aux deux  |
| Une vue est bien pire que les autres                                                            | Cartes coûteuses, décodage caméra, historique ou grand arbre de document dans cette vue |
| La vue devient vide, l’interface autour reste visible                                           | Pression mémoire WebView ou défaillance du moteur                                       |
| Le tableau se dégrade progressivement en plusieurs jours                                        | Croissance mémoire, fragmentation ou carte accumulant du travail                        |
| Les entités cessent de se mettre à jour puis arrivent en rafale                                 | Interruption WebSocket, reconnexion ou moteur incapable de suivre                       |
| Des panneaux similaires se comportent différemment                                              | Contenu, abonnement, version WebView, durée de fonctionnement ou chaleur différents     |
| Un NSPanel Pro d’origine saccade après environ dix heures et `guard_process.sh` utilise un cœur | Affectation récursive du chien de garde Zigbee fabricant, menant à `E2BIG`              |

Le ramasse-miettes suspend périodiquement JavaScript pour récupérer la mémoire inutilisée. Près du plafond mémoire, ces pauses s’allongent et se multiplient, pouvant affamer le rendu sans que le processus Android ait lui-même planté.
