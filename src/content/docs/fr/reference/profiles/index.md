---
title: Profils de panneau à l’exécution
description: Comment les profils décrivent un modèle de panneau mural Android, et comment en écrire, tester et activer un depuis l’interface web du panneau.
sidebar:
  label: Vue d’ensemble
  order: 0
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Les profils décrivent les particularités d’un modèle de panneau mural Android : sa reconnaissance par ha-paneld, les pilotes matériels compilés utilisables, les caractéristiques connues de l’écran et des capteurs, et les variantes dépendant du micrologiciel. Ce sont des fichiers YAML lisibles. Ils peuvent être consultés, exportés, modifiés, importés et activés depuis une installation ha-paneld en fonctionnement sans reconstruire l’application Android.

Cette page est le guide pratique de création. Consultez la [référence du format et de la compatibilité](/fr/reference/profiles/format/) pour le modèle de document, [Tests et dépannage](/fr/reference/profiles/testing/) avant d’activer des commandes matérielles, et le [guide de partage et de contribution](/fr/reference/profiles/sharing/) avant de publier un profil. Un catalogue clairement distinct de [profils communautaires](/fr/reference/profiles/community/) existe aussi ; ces fichiers sont des imports manuels, pas une prise en charge intégrée.

Les profils intégrés à l’application se trouvent dans le dépôt ha-paneld sous [`app/src/main/assets/device-profiles`](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles).

![La page Profils du panneau montrant le YAML d’une révision intégrée dans l’éditeur, avec des badges de vérification pour les recommandations de désactivation de paquets, les voies root et les métadonnées d’artefact WebView, puis les faits observés sur l’appareil](/screenshots/ui-profile-dark.png)

## Ce qu’un profil peut faire

Un profil peut sélectionner des pilotes et transformations déjà fournis par ha-paneld et fournir leurs paramètres typés. Il peut décrire les faits matériels, règles de correspondance, variantes de micrologiciel, recommandations d’affichage, capacités candidates et niveau d’autorité Android utile sur le panneau.

Un profil ne peut pas ajouter de code exécutable, commandes shell, verbes du démon auxiliaire, ioctls noyau, bibliothèques natives ou nouveau protocole matériel. Si un panneau nécessite un mécanisme absent de l’éditeur ou de la référence du format, celui-ci doit d’abord être implémenté et vérifié dans ha-paneld. Cette limite garde le fichier YAML échangé inspectable et l’empêche de devenir un script root arbitraire.

Les profils n’accordent pas non plus d’autorité. Un pilote privilégié reste indisponible tant que sa voie active requise ne réussit pas. Voir [Autorité : Android standard et voies privilégiées](#autorité--android-standard-et-voies-privilégiées).

## Démarrage rapide sans environnement de développement

Il suffit d’une installation ha-paneld prenant en charge les profils et d’un navigateur web. La page Profils comprend un éditeur YAML avec retour de validation ; l’exportation vers un éditeur de texte distinct est facultative. Android Studio, Gradle, le SDK Android et une copie du dépôt ne sont pas nécessaires.

1. Ouvrez la page d’appareil du panneau dans Home Assistant, sélectionnez **Visiter**, puis **Profils**. En connexion directe, utilisez le port HTTP signalé par le panneau (`http://<panel-ip>:8888/profiles` avec le port par défaut).
2. Si ha-paneld reconnaît déjà le panneau, exportez la révision active exacte comme référence. Les profils intégrés sont immuables ; la première modification crée donc une copie locale autonome plutôt que de modifier celle fournie avec l’application.
3. Si le panneau utilise **Generic**, téléchargez son brouillon passif d’appareil. Celui-ci inclut l’empreinte du panneau et des valeurs inconnues/TODO explicites ; il ne devine pas le matériel privilégié et ne lance aucune sonde active.
4. Donnez au profil un identifiant stable en minuscules et une version, complétez sa provenance et ses métadonnées de compatibilité, puis commencez par des règles de correspondance exactes. Utilisez l’[exemple ci-dessous](#exemples) et la [référence du format](/fr/reference/profiles/format/).
5. Importez le YAML dans la page Profils. L’importation et la validation sont uniquement un aperçu : elles n’enregistrent et n’activent rien.
6. Lisez chaque message de validation et comparez le candidat au profil actif. Examinez particulièrement l’empreinte, les pilotes, chemins matériels, entités Home Assistant ajoutées ou retirées, et exigences d’autorité.
7. Enregistrez le candidat validé. Cela crée une révision locale immuable et inactive, sans changer le panneau en fonctionnement.
8. Testez-le par étapes avec la [liste de vérification](/fr/reference/profiles/testing/). Activez-le uniquement en présence d’une personne pouvant voir et toucher le panneau s’il change l’écran, les entrées, LED, relais, paquets ou autres comportements privilégiés.
9. L’activation exige une confirmation explicite liée à l’identifiant, la révision et l’empreinte de contenu exacts. ha-paneld redémarre son service afin que tous les contrôleurs reçoivent le même profil résolu.
10. Après le redémarrage, confirmez que la page Profils indique la révision attendue comme **Actif**, inspectez les capacités et entités Home Assistant, puis testez le retour arrière. Si la validation au démarrage échoue, ha-paneld revient à la **dernière révision connue comme fonctionnelle** et signale le candidat comme ayant subi un **retour arrière automatique**.

Conservez le YAML exporté comme source échangeable. Une capture de la page Profils verte est un élément utile, mais ne remplace ni le fichier, ni sa provenance, ni les résultats matériels par étapes.

## Exemples

L’exemple [`minimal-community.yaml`](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml) utilise le schéma public accepté par la page Profils. C’est un support pédagogique, pas l’affirmation que le matériel fictif existe. Ce point de départ prudent, fondé sur Android standard, n’active aucun protocole fabricant, voie root/auxiliaire, relais, entrée evdev, artefact de mise à jour, état souhaité de paquet ou recette de provisionnement.

Importez l’exemple via **Profils**, examinez l’aperçu de validation et enregistrez-le uniquement comme révision locale inactive. Changez l’identifiant, la provenance, l’empreinte exacte, les micrologiciels testés et les limites avant de l’utiliser pour un vrai panneau. Une correspondance importée n’est qu’un élément d’aperçu ; les profils locaux et communautaires ne sont jamais sélectionnés automatiquement.

Pour des exemples de production complets, exportez un profil intégré immuable depuis un panneau en fonctionnement, ou lisez les [fichiers YAML intégrés](https://github.com/panel-assistant/android/tree/main/app/src/main/assets/device-profiles). Ils utilisent le même schéma mais peuvent sélectionner des pilotes privilégiés compilés et des artefacts gérés par le cœur, à ne pas copier sans preuves matérielles.

## Cycle de vie du profil

ha-paneld traite le contenu comme des révisions immuables plutôt qu’un objet de réglages actif modifiable. Cela rend les comparaisons reproductibles et empêche l’activation d’un fichier modifié sous un aperçu antérieur.

- **Intégré** : fourni avec ha-paneld et immuable. Il peut être exporté ou copié pour modification.
- **Révision locale inactive** : importée ou créée sur ce panneau, validée et enregistrée, mais inutilisée par les contrôleurs actifs.
- **En attente** : la révision exacte est acceptée pour activation et le service redémarre.
- **Actif** : révision utilisée pour construire les capteurs, contrôleurs matériels, modèle de capacités de l’interface et surface de découverte Home Assistant actuels.
- **Dernière connue comme fonctionnelle** : sélection précédente éprouvée, conservée comme cible de récupération et de retour arrière manuel après le démarrage réussi d’une nouvelle révision.
- **Retour arrière automatique** : candidat dont l’activation a échoué et qui a été automatiquement remplacé par la dernière révision connue comme fonctionnelle.

L’enregistrement lie une révision immuable au YAML exact de son aperçu de validation. L’activation et la suppression vérifient également la génération du catalogue ; si un autre navigateur ou un administrateur a modifié le catalogue, ces opérations fondées sur un état périmé sont refusées. Actualisez la page et comparez à nouveau avant d’agir sur le nouvel état.

Supprimer une révision locale inactive ne change pas le panneau actif. Une révision active ou dernière connue comme fonctionnelle ne doit pas être supprimée avant qu’une autre voie de récupération valide existe.

**Passer en automatique** ramène un panneau épinglé à la reconnaissance par empreinte des profils intégrés au prochain redémarrage contrôlé. Les révisions importées et communautaires ne participent jamais à ce choix automatique ; elles restent disponibles uniquement pour une activation épinglée explicite.

## Commencer avec Generic

`Generic` est le repli prudent d’un panneau non reconnu. Il utilise les contrôles ordinaires de capacités Android et des sondes d’exécution sûres, sans inventer de matériel fabricant, boutons evdev, relais, radios, puces climatiques, artefacts de mise à jour ou actions sur les paquets.

C’est donc le bon point de départ d’un profil communautaire :

1. Téléchargez le **brouillon pour l’appareil** depuis la page Profiles. Il recueille les informations exactes sur le modèle de compilation, l’appareil de compilation et la version du produit dont dispose ha-paneld, ainsi qu’une sélection d’observations passives. Examinez le rapport passif distinct, au contenu limité et expurgé des données sensibles, sur la page Profiles avant de partager vos éléments de preuve.
2. Masquez les informations sensibles et relisez avant de partager. Le rapport généré est conçu pour l’assistance, mais l’auteur reste responsable de retirer noms de panneaux, adresses, détails Home Assistant, identifiants secrets et contenu des tableaux de bord.
3. Ajoutez d’abord identité et provenance. Utilisez un identifiant stable en minuscules préfixé par l’auteur ou l’organisation, comme `org.example.wallpanel-x1`, plus une version initiale, les informations auteur/source/licence, un niveau de maturité, la plage de micrologiciels testés et les limites connues.
4. Ajoutez des règles d’empreinte étroites et exactes. Un modèle fabricant ou préfixe de version produit est généralement plus sûr qu’un alias de SoC large comme `px30`, `rk3326`, `rk3566` ou `rk3576`, partagé par des panneaux sans rapport.
5. Laissez les sections de capacités inconnues absentes ou explicitement inconnues. Un nom de fichier, une annonce commerciale ou un pilote noyau compilé dans le micrologiciel ne prouve ni la présence de matériel actif ni son accessibilité à une application Android.
6. Ajoutez une capacité étayée à la fois, puis validez, comparez et testez avant de continuer.

Le brouillon est volontairement passif et en lecture seule. Ne transformez pas des commandes shell exploratoires ou des essais root ponctuels en champs de profil. Lorsqu’une nouvelle sonde active ou un pilote est nécessaire, proposez une implémentation ha-paneld bornée avec sa propre validation et ses tests.

## Reconnaître un panneau en sécurité

La correspondance est une décision de sécurité, pas seulement une commodité. Une mauvaise correspondance peut sélectionner un pilote inadapté ou revendiquer les capacités d’un autre produit utilisant la même carte de référence.

Préférez l’identité produit exacte dans cet ordre :

1. modèle fabricant ou nom de code d’appareil propre au produit ;
2. format exact de version produit ou préfixe strictement ancré ;
3. combinaison de champs de compilation indépendants ;
4. alias large de SoC/plateforme de référence uniquement comme repli de compatibilité délibéré.

Attribuez à chaque groupe exact une priorité de branche supérieure à son repli large. ha-paneld compare d’abord la priorité du groupe reconnu, puis celle du profil ; une égalité exacte entre profils intégrés mène par sécurité à Generic. Les priorités reproduisent un ordre de branches délibéré mais ne remplacent pas une empreinte étroite.

Les révisions communautaires et importées ne participent jamais à la sélection automatique, même si leur correspondance est exacte. Celle-ci est un élément d’aperçu aidant l’administrateur à décider si le fichier décrit ce panneau. Une révision locale ne remplace la détection intégrée que par activation explicite ; le panneau épingle alors son identifiant, sa révision et son empreinte exacts. Une importation ultérieure ne peut donc pas modifier implicitement le résultat actif.

Utilisez un champ de stratégie nommé, géré par le cœur, pour une différence prise en charge dans une même famille matérielle, comme un libellé produit ou une règle de densité. Le format ne contient ni langage général d’expressions ni modifications arbitraires de variantes. L’échelle de proximité, sa polarité et son comportement binaire ou en distance ne sont volontairement pas des stratégies de profil : l’exécution les apprend par observation directe. Utilisez des profils distincts lorsque les stratégies nommées disponibles ne décrivent pas une véritable différence d’acquisition, pilote, frontière de privilèges ou récupération.

## Autorité : Android standard et voies privilégiées

Les profils décrivent des mécanismes candidats ; les sondes en direct décident si le panneau actif peut les utiliser.

### Android standard

Commencez ici. Le rendu du tableau de bord, l’association Panel Assistant et les capteurs Android ordinaires, la luminosité, l’audio, la navigation et l’interface web locale ne nécessitent pas root. Un nouveau profil doit prouver son identité et son comportement Android standard avant d’ajouter un pilote privilégié.

### Root du fabricant ou auxiliaire ha-paneld

Un pilote compilé peut nécessiter une voie `su` du fabricant fonctionnelle ou l’auxiliaire root ha-paneld installé séparément. Déclarer cette exigence ne crée pas la voie, n’installe pas l’auxiliaire et n’élargit pas sa liste d’autorisation. L’auxiliaire n’accepte que des commandes compilées et bornées et authentifie son correspondant ; le profil fournit à ces commandes des paramètres validés, jamais du texte de commande.

Ne recommandez pas de rooter un appareil livré sans root pour satisfaire un profil. Documentez honnêtement les fonctions réduites. Voir [Accès root](/fr/hardware/guides/root-access/) pour l’aspect matériel.

## Mettre à jour un profil installé

Les versions du contenu et celles du schéma de document répondent à des besoins différents. Incrémentez la version du profil lorsque les connaissances matérielles ou le comportement changent. La version du schéma ne change que lorsque ha-paneld modifie le langage du document.

Avant d’enregistrer une mise à jour, comparez-la à la révision active et lisez le rapport de compatibilité. Une mise à jour ha-paneld revalide aussi les profils installés avant utilisation. Un fichier exigeant un cœur plus récent, un pilote indisponible ou un schéma futur non pris en charge reste installé mais ne peut pas devenir actif ; le profil actuel connu comme fonctionnel continue de fonctionner.

Considérez toute modification de correspondance, pilote privilégié, chemin, variante de micrologiciel, état souhaité de paquet, sélection de recette ou artefact de mise à jour du cœur comme significative pour le comportement, même si la différence YAML est petite. Répétez les étapes de test pertinentes et augmentez la version du profil.

## Étapes suivantes

- [Format et compatibilité des profils](/fr/reference/profiles/format/)
- [Tests et dépannage](/fr/reference/profiles/testing/)
- [Partager et contribuer des profils](/fr/reference/profiles/sharing/)
- [Architecture des profils d’appareil](/fr/reference/profiles/architecture/)
- [Posture de sécurité](/fr/reference/security/)
- [Matériel des panneaux](/fr/hardware/)
