---
title: Format des profils et compatibilité
description: Présentation annotée des profils de panneau de schéma 2 et des règles de validation, de correspondance et de compatibilité appliquées par l’application.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Les profils de panneau utilisés à l’exécution sont des documents YAML à schéma fermé et versionné. Un descripteur de rédaction lisible par machine et un catalogue de pilotes sont disponibles depuis la page Profil d’un panneau compatible ; cette page en est une présentation annotée. Pour tous les champs et le vocabulaire des pilotes de votre version installée, utilisez la page Profil. Cette présentation explique le modèle documentaire et les règles de compatibilité, sans remplacer la validation par la version ha-paneld cible.

<a id="document-model"></a>

## Modèle documentaire

Chaque profil contient ces sections conceptuelles :

| Section                      | Rôle                                                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schéma                       | Sélectionne le langage du document compris par ha-paneld.                                                                                         |
| Identité                     | Identifiant stable du profil et contenu versionné indépendamment.                                                                                 |
| Métadonnées                  | Nom lisible, auteur, source, liens d’affichage seuls, licence, maturité, micrologiciels testés et limites connues.                                |
| Prérequis                    | Version minimale du cœur ha-paneld et pilotes/fonctions compilés nécessaires au document.                                                         |
| Correspondance               | Règles bornées sur l’empreinte du panneau.                                                                                                        |
| Capacités et pilotes         | Faits matériels, choix de pilotes compilés et paramètres typés.                                                                                   |
| Stratégies nommées           | Règles facultatives appartenant au cœur pour le petit ensemble de valeurs dépendant du micrologiciel/modèle prises en charge.                     |
| Intention de provisionnement | Conseils d’accès, recommandations logicielles/d’affichage, état souhaité des paquets et recettes sélectionnées du cœur ; jamais une autorisation. |

Les champs racine incluent `schema`, `id`, `version`, `display_name`, `soc_class`, `soc`, `metadata`, `requires`, `match`, `platform`, `hardware`, `sensors`, `identity`, `input`, `cpu`, `display` et `provisioning`. Leurs noms utilisent le `snake_case` minuscule ; les valeurs sont sensibles à la casse sauf indication contraire du champ. Voir l’[exemple communautaire minimal](https://github.com/panel-assistant/android/blob/main/docs/profiles/examples/minimal-community.yaml).

Les valeurs énumérées exactes et le vocabulaire des pilotes/artefacts sont définis par le schéma et le catalogue servis par la version en cours. Validez avec la même version que celle qui activera le profil.

<a id="closed-schema"></a>

## Schéma fermé

Les champs inconnus sont des erreurs. Cela détecte les fautes qui supprimeraient silencieusement une propriété de sécurité ou laisseraient une capacité non configurée. Le schéma 2 n’a pas de zone d’extension libre. Placez auteur, source HTTPS, licence de type SPDX, maturité `draft`/`experimental`/`verified`, micrologiciels testés et limites dans `metadata` ; ces valeurs ne peuvent définir ni correspondance, ni pilotes, ni accès, ni comportement d’exécution.

Les clés YAML en double, alias et clés récursives sont des erreurs. Un seul document YAML exactement est autorisé. Les balises YAML ne peuvent construire d’objets applicatifs ou Java, et les profils ne peuvent contenir de prédicats à expressions régulières. Le chargeur accepte au plus 20 niveaux d’imbrication, 20 000 événements d’analyse, 512 entrées dans un même dictionnaire ou une même liste, et 16 384 caractères dans une chaîne. Gardez les documents simples et explicites, même si l’éditeur YAML permet des syntaxes plus complexes.

Chaque révision YAML est limitée à 128 KiB. Le catalogue local importé est aussi borné à 128 révisions au total, 16 pour un identifiant de profil et 4 MiB de YAML. Exportez et supprimez les révisions inactives obsolètes avant d’en enregistrer davantage ; les révisions actives, en attente et dernières valides restent protégées. Ces limites empêchent l’échange de profils d’épuiser le stockage du panneau ou d’imposer l’analyse d’un catalogue illimité au démarrage.

Les champs obligatoires ne peuvent être null. Pour les champs facultatifs, le lecteur actuel traite généralement null comme une absence, mais les auteurs devraient omettre les valeurs inconnues pour clarifier l’intention. Chaînes vides, listes/dictionnaires vides, zéros et false sont des valeurs réelles, pouvant différer d’une omission ou d’une valeur par défaut documentée.

<a id="identity-and-versions"></a>

## Identité et versions

Utilisez un identifiant de profil stable et distinctif de 1 à 128 lettres ASCII minuscules ou chiffres, avec points et traits d’union seulement à l’intérieur. Les points consécutifs sont interdits. Préférez un préfixe d’auteur ou d’organisation si un nom générique risque d’entrer en collision, par exemple `org.example.wallpanel-x1`. Ne mettez pas de numéro de micrologiciel dans l’identifiant lorsqu’un profil et ses stratégies nommées peuvent couvrir la famille matérielle.

La version du contenu appartient à l’auteur et change quand les connaissances ou le comportement du profil changent. Utilisez le versionnage sémantique si le profil est partagé :

- correctif : clarifications ou métadonnées sans changement de correspondance ni de comportement d’exécution ;
- mineure : connaissances supplémentaires de capacités, nouvelle variante de micrologiciel compatible ou recommandation plus sûre ;
- majeure : changement d’identité de correspondance, de choix de pilote, de privilèges requis ou autre modification méritant une migration délibérée.

La version du schéma appartient à ha-paneld. Les auteurs ne doivent pas l’incrémenter pour versionner leur profil.

<a id="annotated-schema-2-field-overview"></a>

## Présentation annotée des champs du schéma 2

« Obligatoire » signifie que la clé doit être présente avec le type indiqué. « Facultatif ; défaut … » signifie que l’omission (ou null pour un champ facultatif) produit cette valeur. Les clés inconnues sont des erreurs à tous les niveaux. Tous les entiers doivent tenir dans une valeur signée sur 32 bits avant vérification de la plage plus étroite du champ ; tous les nombres doivent rester finis lors de leur conversion en flottant 32 bits lorsque le champ utilise un nombre.

<a id="root-fields"></a>

### Champs racine

| Champ          | Présence                   | Type et validation                                                                                                                                                                                                                                                           |
| -------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`       | Obligatoire                | Entier ; exactement `2`. Le schéma 1 n’est pas accepté.                                                                                                                                                                                                                      |
| `id`           | Obligatoire                | Chaîne de 1 à 128 caractères ; lettres ASCII minuscules/chiffres, avec `.` ou `-` seulement à l’intérieur ; `..` interdit.                                                                                                                                                   |
| `version`      | Obligatoire                | Version du contenu : exactement trois composantes séparées par des points, chacune `0` ou 1 à 9 chiffres sans zéro initial ; identifiants facultatifs de préversion séparés par des points, faits de lettres ASCII, chiffres et `-` ; aucun suffixe de métadonnées de build. |
| `display_name` | Obligatoire                | Chaîne non blanche de 1 à 100 caractères.                                                                                                                                                                                                                                    |
| `soc_class`    | Obligatoire                | Chaîne non blanche de 1 à 100 caractères.                                                                                                                                                                                                                                    |
| `soc`          | Facultatif ; défaut absent | Faits SoC structurés étayés par le profil ; champs ci-dessous.                                                                                                                                                                                                               |
| `metadata`     | Obligatoire                | Dictionnaire ; champs ci-dessous.                                                                                                                                                                                                                                            |
| `requires`     | Obligatoire                | Dictionnaire ; champs ci-dessous.                                                                                                                                                                                                                                            |
| `match`        | Obligatoire                | Dictionnaire ; champs ci-dessous.                                                                                                                                                                                                                                            |
| `platform`     | Obligatoire                | Dictionnaire ; champs ci-dessous.                                                                                                                                                                                                                                            |
| `hardware`     | Obligatoire                | Dictionnaire ; champs ci-dessous.                                                                                                                                                                                                                                            |
| `sensors`      | Facultatif ; défaut `{}`   | Dictionnaire ; champs ci-dessous.                                                                                                                                                                                                                                            |
| `identity`     | Facultatif ; défaut `{}`   | Dictionnaire ; champs ci-dessous.                                                                                                                                                                                                                                            |
| `input`        | Facultatif ; défaut `{}`   | Dictionnaire ; champs ci-dessous.                                                                                                                                                                                                                                            |
| `cpu`          | Facultatif ; défaut `{}`   | Dictionnaire ; champs ci-dessous.                                                                                                                                                                                                                                            |
| `display`      | Facultatif ; défaut `{}`   | Faits sur l’écran physique ; champs ci-dessous.                                                                                                                                                                                                                              |
| `provisioning` | Obligatoire                | Dictionnaire d’intention de provisionnement ; champs ci-dessous.                                                                                                                                                                                                             |

### `metadata` et `requires`

| Champ                       | Présence                   | Type et validation                                                                                                                                                                                                                                                                   |
| --------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `metadata.author`           | Obligatoire                | Chaîne non blanche de 1 à 100 caractères.                                                                                                                                                                                                                                            |
| `metadata.source`           | Facultatif ; défaut absent | URL HTTPS absolue d’au plus 500 caractères, hôte non vide, sans composante d’informations utilisateur.                                                                                                                                                                               |
| `metadata.links`            | Facultatif ; défaut `[]`   | Liste d’au plus huit liens externes destinés uniquement à l’affichage. ha-paneld ne les récupère, ne les précharge ni ne les utilise jamais pour le provisionnement. URL et libellés doivent être uniques ; un lien ne peut répéter `metadata.source`.                               |
| `metadata.links[].label`    | Obligatoire par élément    | Libellé d’affichage non blanc de 1 à 48 caractères, sans caractères de contrôle ni de formatage bidirectionnel. L’interface Profils affiche aussi le nom d’hôte de destination dans un segment de texte isolé.                                                                       |
| `metadata.links[].url`      | Obligatoire par élément    | URL HTTPS absolue suivant les mêmes règles de 500 caractères, d’hôte et d’absence d’informations utilisateur que `metadata.source`.                                                                                                                                                  |
| `metadata.license`          | Obligatoire                | Chaîne de type SPDX : un ou plusieurs identifiants de 1 à 64 caractères correspondant à `[A-Za-z0-9][A-Za-z0-9.+-]*`, séparés uniquement par `AND` ou `OR`. Parenthèses, `WITH` et texte libre non acceptés.                                                                         |
| `metadata.maturity`         | Obligatoire                | `draft`, `experimental` ou `verified`.                                                                                                                                                                                                                                               |
| `metadata.tested_firmware`  | Facultatif ; défaut `[]`   | Liste d’au plus 32 chaînes non blanches, chacune d’au plus 120 caractères.                                                                                                                                                                                                           |
| `metadata.limitations`      | Facultatif ; défaut `[]`   | Liste d’au plus 32 chaînes non blanches, chacune d’au plus 500 caractères.                                                                                                                                                                                                           |
| `requires.min_core_version` | Facultatif ; défaut absent | Version de publication à points, au plus 64 caractères : 1 à 4 composantes numériques de 1 à 6 chiffres chacune, avec suffixe de préversion facultatif alphanumérique ASCII/`-` séparé par des points. Le cœur exécuté doit être égal ou plus récent, ordre des préversions compris. |
| `requires.drivers`          | Obligatoire                | Liste d’identifiants de pilotes du cœur. Les inconnus sont des erreurs ; un pilote requis par une capacité renseignée doit figurer dans la liste. Un pilote autrement inutilisé produit un avertissement.                                                                            |

### `soc`

`soc_class` reste le libellé obligatoire de famille générale. Le bloc structuré facultatif enregistre les faits qu’Android identifie généralement mal, par exemple si un panneau annoncé à quatre cœurs utilise des Cortex-A35 ou Cortex-A55. Ces valeurs apparaissent dans Tableau de bord et Profils mais pas dans le bref rapport public `/diag`. N’ajoutez que des faits étayés par une source publique ou des preuves matérielles ; omettez les inconnus plutôt que de deviner.

| Champ                          | Présence                         | Type et validation                                                                                                                                      |
| ------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `soc.model`                    | Obligatoire si `soc` est présent | Nom de modèle non blanc de 1 à 100 caractères, sans contrôles C0 ou DEL.                                                                                |
| `soc.introduced_year`          | Facultatif ; défaut absent       | Entier de 1970 à 2100. Année de présentation publique du SoC, pas année de sortie du panneau.                                                           |
| `soc.cpu_cores`                | Facultatif ; défaut `[]`         | Au plus huit groupes d’architecture et 256 cœurs au total. Une liste vide signifie que le modèle est connu mais sa topologie CPU insuffisamment étayée. |
| `soc.cpu_cores[].architecture` | Obligatoire par élément          | Architecture de cœur non blanche de 1 à 64 caractères, sans contrôles ; architectures uniques sans distinction de casse.                                |
| `soc.cpu_cores[].count`        | Obligatoire par élément          | Entier de 1 à 128.                                                                                                                                      |

### `match`

`match.any` applique OU entre les groupes ; la liste `all` d’un groupe applique ET entre prédicats ; la liste `values` d’un prédicat applique OU. Les comparaisons sont sensibles à la casse, sur les faits de build déjà mis en minuscules par ha-paneld.

| Champ                      | Présence    | Type et validation                                                                                                                                |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `match.priority`           | Obligatoire | Entier de 0 à 1000 ; départage les profils après la priorité du groupe correspondant.                                                             |
| `match.fallback`           | Obligatoire | Booléen. `true` n’est valide que pour le profil intégré d’identifiant `generic` ; les profils importés/communautaires ne peuvent être des replis. |
| `match.any`                | Obligatoire | Liste d’au plus 64 objets groupe. Un profil hors repli exige au moins un groupe ; le Generic intégré peut utiliser une liste vide.                |
| `match.any[].priority`     | Obligatoire | Entier de 0 à 1000 ; spécificité de branche utilisée avant la priorité du profil.                                                                 |
| `match.any[].all`          | Obligatoire | Liste de 1 à 8 objets prédicat.                                                                                                                   |
| `match.any[].all[].field`  | Obligatoire | `model`, `device` ou `product_version`.                                                                                                           |
| `match.any[].all[].op`     | Obligatoire | `equals`, `starts_with` ou `contains`.                                                                                                            |
| `match.any[].all[].values` | Obligatoire | Liste de 1 à 32 chaînes non blanches en minuscules ; chacune d’au plus 100 caractères, sans contrôles C0 ou DEL.                                  |

### `platform` et `hardware`

| Champ                                    | Présence                       | Type et validation                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `platform.su_form`                       | Obligatoire                    | `none`, `android` ou `toolbox`.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `platform.app_can_su`                    | Obligatoire                    | Booléen. Doit être `false` si `su_form` vaut `none` ; une forme `android` ou `toolbox` peut rester déclarée avec `false` pour une application isolée dans son bac à sable.                                                                                                                                                                                                                                                                             |
| `platform.has_recents`                   | Facultatif ; défaut `true`     | Booléen.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `platform.has_native_navbar`             | Facultatif ; défaut absent     | Omettez pour sonder la visibilité de la barre de navigation du micrologiciel. `true` ou `false` explicite remplace ce sondage.                                                                                                                                                                                                                                                                                                                         |
| `platform.launcher.vendor_home_packages` | Facultatif ; défaut vide       | Liste d’au plus 8 noms de paquets Android, sans doublons. Applications du fabricant enregistrées comme accueil Android mais qui ne sont pas des tiroirs d’applications, par exemple une application de contrôle du fabricant. Le bouton Lanceur de la barre de navigation les ignore et, si rien d’autre ne convient, ouvre le lanceur du panneau, qui les liste toujours comme applications.                                                          |
| `hardware.led`                           | Obligatoire                    | Dictionnaire contenant les champs LED ci-dessous.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `hardware.led.mechanism`                 | Obligatoire                    | `none`, `autodetect`, `rk3576-ioctl`, `rk3576-ioctl-daemon` ou `sysfs-daemon`. Les mécanismes réservés au démon sont rejetés si `platform.app_can_su` vaut `true`.                                                                                                                                                                                                                                                                                     |
| `hardware.led.transfer`                  | Facultatif ; défaut `identity` | Sélectionne une courbe de transfert compilée. Exemples : `identity`, `rk3576-four-bit`, `perceptual`, `gamma` et `points` mesurés ; utilisez le schéma servi pour les paramètres.                                                                                                                                                                                                                                                                      |
| `hardware.screen_off`                    | Obligatoire                    | Sélectionne un pilote d’extinction compilé, comme `brightness-zero`, `su-blpower`, `daemon-blpower`, `keyevent`, `screen-timeout`, `device-admin` ou `vendor-rpc`. Les prérequis d’autorité et de réveil local dépendent de la voie choisie ; utilisez le schéma servi et vérifiez la voie sur le matériel.                                                                                                                                            |
| `hardware.has_button_backlight`          | Facultatif ; défaut `false`    | Booléen ; active la capacité bornée de rétroéclairage des boutons via l’auxiliaire lorsque vrai.                                                                                                                                                                                                                                                                                                                                                       |
| `hardware.local_wake`                    | Facultatif ; défaut absent     | Liste de valeurs uniques parmi `touch`, `proximity` et `button` : les façons de réveiller localement un panneau complètement noir. `touch` : tout toucher le réveille ; `proximity` : un geste le réveille après étalonnage de proximité ; `button` : un bouton physique le réveille. Omettez si inconnu ; une liste vide déclare que seul Home Assistant le réveille. Home Assistant peut toujours le réveiller, donc ne figure jamais dans la liste. |
| `hardware.zigbee_gateway_dir`            | Facultatif ; défaut absent     | Chemin exact autorisé `/vendor/bin/siliconlabs_host` ; aucun autre accepté.                                                                                                                                                                                                                                                                                                                                                                            |
| `hardware.relay_base`                    | Facultatif ; défaut absent     | Un chemin exact autorisé : `/sys/class/relay`, `/sys/class/st_relay` ou `/sys/class/strelay`.                                                                                                                                                                                                                                                                                                                                                          |
| `hardware.relay_base_fallbacks`          | Facultatif ; défaut `[]`       | Liste d’au plus trois chemins de la même liste autorisée de relais. Entrées uniques, sans répéter `relay_base`.                                                                                                                                                                                                                                                                                                                                        |
| `hardware.button_led_gpio_base`          | Facultatif ; défaut absent     | Entier de 0 à 4092, premier GPIO d’un bloc de quatre.                                                                                                                                                                                                                                                                                                                                                                                                  |
| `hardware.camera`                        | Facultatif ; défaut absent     | Booléen à trois états : omission autorise l’énumération Android, `true` déclare une candidate même si l’énumération échoue, `false` supprime la caméra. La capture exige toujours un indicateur attaché à l’écran ; écran éteint, elle exige aussi une indication LED active. Sans indication écran éteint, la capture s’arrête à l’extinction.                                                                                                        |
| `hardware.microphone`                    | Facultatif ; défaut absent     | `true` déclare un microphone vérifié, `false` le supprime, l’omission utilise l’énumération Android des microphones intégrés puis un contrôle de capture avant l’écoute. Indépendant de la caméra.                                                                                                                                                                                                                                                     |
| `hardware.camera_lens_offset_px`         | Facultatif                     | Entier ; pixels écran entre le haut de la zone d’affichage active et le centre de l’objectif. L’indicateur d’utilisation caméra est un arc centré sur l’objectif : cette mesure du cadre le positionne et varie entre cartes. Omettez si non mesuré ; l’indicateur utilise alors une valeur par défaut.                                                                                                                                                |
| `hardware.touch_click_gain`              | Facultatif ; défaut `0.2`      | Nombre de 0.05 à 1.0 ; ajuste le volume du clic tactile d’une carte dont le clic est trop fort ou trop faible au réglage système par défaut.                                                                                                                                                                                                                                                                                                           |

### `sensors` et `identity`

| Champ                           | Présence                           | Type et validation                                                                                                                                  |
| ------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sensors.proximity_technology`  | Facultatif ; défaut absent         | Chaîne non blanche de 1 à 100 caractères, sans contrôles C0 ou DEL. Sa présence déclare l’utilisation du capteur de proximité Android.              |
| `sensors.proximity_gpio`        | Facultatif ; défaut absent         | Entier de 0 à 4095 pour la voie GPIO binaire prise en charge via root.                                                                              |
| `sensors.light_technology`      | Facultatif ; défaut absent         | Chaîne non blanche de 1 à 100 caractères, sans contrôles C0 ou DEL. Sa présence déclare l’utilisation du capteur Android de lumière ambiante.       |
| `sensors.vi530x`                | Facultatif ; défaut `false`        | Booléen ; expose une source de distance à temps de vol VI530x démarrée par l’auxiliaire via ioctl, puis interrogée. Exige l’auxiliaire authentifié. |
| `sensors.cht8305`               | Facultatif ; défaut `false`        | Booléen ; active une entrée de climat ambiant compatible CHT8305 exactement prise en charge par le cœur, via l’auxiliaire authentifié.              |
| `sensors.room_temp_offset_c`    | Facultatif ; défaut `0.0`          | Nombre fini de -30 à 30 °C.                                                                                                                         |
| `identity.manufacturer`         | Facultatif ; défaut absent         | Chaîne non blanche de 1 à 100 caractères, sans contrôles C0 ou DEL ; absence : déduction à l’exécution.                                             |
| `identity.model`                | Facultatif ; défaut absent         | Chaîne non blanche de 1 à 100 caractères, sans contrôles C0 ou DEL ; absence : déduction à l’exécution.                                             |
| `identity.model_label_strategy` | Facultatif ; défaut `display-name` | `display-name` ou `nspanel-product-version`.                                                                                                        |

Une révision stockée de schéma 2 peut contenir `proximity_near_below`, `proximity_near_raw`, `proximity_far_raw` ou `proximity_graded_strategy`. Le chargeur n’accepte ces clés retirées que comme vestiges de compatibilité : ignorées au chargement et omises lors de la sérialisation d’un document de profil. L’export d’une révision stockée immuable conserve ses octets originaux. À l’exécution, les valeurs par défaut étalonnées du profil de capteur ou la configuration guidée enregistrée sont utilisées, et la source réelle est vérifiée avant de rapporter des valeurs normalisées.

### `input`, `cpu` et `display`

| Champ                              | Présence                    | Type et validation                                                                                                                                                                       |
| ---------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input.evdev_buttons`              | Facultatif ; défaut `[]`    | Liste d’au plus 32 objets de correspondance evdev. Les paires `(sw, code)` en double sont rejetées même si leurs nœuds diffèrent.                                                        |
| `input.evdev_buttons[].node`       | Obligatoire par élément     | Chaîne correspondant à `/dev/input/eventN`, où `N` est de 1 à 3 chiffres décimaux. Aucun autre chemin de périphérique accepté.                                                           |
| `input.evdev_buttons[].code`       | Obligatoire par élément     | Entier de code d’entrée/commutateur Linux de 1 à 767.                                                                                                                                    |
| `input.evdev_buttons[].grab`       | Obligatoire par élément     | Booléen ; true demande l’exclusivité `EVIOCGRAB`.                                                                                                                                        |
| `input.evdev_buttons[].event_type` | Obligatoire par élément     | Chaîne d’au plus 64 caractères correspondant à `KEYCODE_[A-Z0-9_]+`.                                                                                                                     |
| `input.evdev_buttons[].sw`         | Facultatif ; défaut `false` | Booléen ; false choisit `EV_KEY`, true choisit `EV_SW`.                                                                                                                                  |
| `cpu.governors`                    | Facultatif ; défaut absent  | Dictionnaire dont les seules clés autorisées sont `Performance`, `Efficiency` et `Auto`. Chaque valeur est un nom de gouverneur de 1 à 32 caractères correspondant à `[a-z][a-z0-9_-]*`. |
| `display.physical_ppi`             | Facultatif ; défaut absent  | Entier de 50 à 1000.                                                                                                                                                                     |

### `provisioning`

| Champ                                         | Présence                        | Type et validation                                                                                                                                                                                                               |
| --------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provisioning.access`                         | Facultatif ; défaut `{}`        | Dictionnaire de recommandations d’accès.                                                                                                                                                                                         |
| `provisioning.access.shizuku`                 | Champ de compatibilité retiré   | Anciennes valeurs acceptées et ignorées. Elles ne fournissent aucune voie d’accès à l’exécution.                                                                                                                                 |
| `provisioning.software`                       | Facultatif ; défaut `{}`        | Dictionnaire de politique logicielle appartenant au cœur.                                                                                                                                                                        |
| `provisioning.software.webview.artifact`      | Facultatif ; défaut absent      | Identifiant du cœur `lineageos-138-arm`, `lineageos-150-arm` ou `lineageos-150-arm64`. Un profil ne peut fournir URL, version ni empreinte du signataire.                                                                        |
| `provisioning.software.companion.max_version` | Facultatif ; défaut absent      | Version de publication à points suivant la syntaxe et la limite de 64 caractères de `requires.min_core_version`.                                                                                                                 |
| `provisioning.display.density`                | Facultatif ; défaut absent      | Entier de 80 à 640 dpi, ou stratégie nommée `nspanel-variant`.                                                                                                                                                                   |
| `provisioning.display.font_scale`             | Facultatif ; défaut absent      | Nombre fini de 0.5 à 1.5.                                                                                                                                                                                                        |
| `provisioning.packages`                       | Facultatif ; défaut `[]`        | Liste de 0 à 128 objets d’état souhaité de paquet.                                                                                                                                                                               |
| `provisioning.packages[].package`             | Obligatoire par élément         | Nom de paquet Android unique correspondant à `[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)+`.                                                                                                                                          |
| `provisioning.packages[].desired_state`       | Obligatoire par élément         | `disabled`. Décrit l’état cible, sans constituer un consentement à l’exécution.                                                                                                                                                  |
| `provisioning.packages[].importance`          | Obligatoire par élément         | `recommended` ou `optional`. L’importance ne contrôle que la présentation et ne signifie jamais appliquer par défaut.                                                                                                            |
| `provisioning.packages[].tags`                | Facultatif ; défaut `[]`        | Liste d’au plus huit étiquettes de 1 à 24 caractères, commençant par une lettre ASCII minuscule puis uniquement lettres minuscules, chiffres ou `-`.                                                                             |
| `provisioning.packages[].note`                | Facultatif ; défaut chaîne vide | Chaîne d’au plus 500 caractères. Les notes sont des explications complémentaires, pas des procédures.                                                                                                                            |
| `provisioning.recipes`                        | Facultatif ; défaut `[]`        | Liste d’au plus 32 sélections de recettes du cœur.                                                                                                                                                                               |
| `provisioning.recipes[].id`                   | Obligatoire par élément         | Identifiant enregistré unique. Le schéma 2 connaît `nspanel-pro.watchdog-e2big-repair` et `tpa10.vendor-stack-minimize`. Les entrées de recette ne peuvent contenir arguments, commandes, URL ni définitions de flux de travail. |

Dans la version 1.0.0-rc2 non publiée, les trois identifiants WebView désignent les builds et métadonnées de compatibilité du cœur suivantes :

| Identifiant d’artefact | Build du cœur                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| `lineageos-138-arm`    | LineageOS System WebView `138.0.7204.63` ; ABI ARM `armeabi-v7a` et `arm64-v8a` ; Android 8–9.             |
| `lineageos-150-arm`    | LineageOS System WebView `150.0.7871.63` ; ABI ARM `armeabi-v7a` ; Android 10 ou ultérieur.                |
| `lineageos-150-arm64`  | LineageOS System WebView `150.0.7871.63` ; ABI ARM `armeabi-v7a` et `arm64-v8a` ; Android 10 ou ultérieur. |

Le champ d’artefact WebView sélectionne une build dont téléchargement, somme de contrôle, paquet, version et signataire sont compilés dans le cœur. Dans la version 1.0.0-rc2 non publiée, une mise à jour de l’application du panneau lancée depuis Home Assistant peut aussi installer un WebView compatible. Si elle reste inachevée, utilisez sa réparation de mise à jour pour réessayer. Importer ou activer un profil ne lance pas de mise à jour. Voir [Mettre à jour le WebView](/fr/hardware/guides/update-the-webview/).

<a id="conditional-driver-requirements"></a>

### Prérequis conditionnels de pilotes

Chaque pilote sélectionné par les champs renseignés doit figurer dans `requires.drivers`. Le catalogue servi indique ses prérequis d’autorité ; plusieurs voies Android et services du fabricant fonctionnent sans root.

| Condition du profil                                                  | Pilote requis             |
| -------------------------------------------------------------------- | ------------------------- |
| `platform.su_form: android` et `platform.app_can_su: true`           | `access.android-su`       |
| `platform.su_form: toolbox` et `platform.app_can_su: true`           | `access.toolbox-su`       |
| `hardware.led.mechanism: autodetect`                                 | `led.autodetect`          |
| `hardware.led.mechanism: rk3576-ioctl`                               | `led.rk3576-ioctl`        |
| `hardware.led.mechanism: rk3576-ioctl-daemon`                        | `led.rk3576-ioctl-daemon` |
| `hardware.led.mechanism: sysfs-daemon`                               | `led.sysfs-daemon`        |
| `hardware.screen_off: brightness-zero`                               | `screen.brightness-zero`  |
| `hardware.screen_off: su-blpower`                                    | `screen.su-blpower`       |
| `hardware.screen_off: daemon-blpower`                                | `screen.daemon-blpower`   |
| `hardware.screen_off: keyevent`                                      | `screen.keyevent`         |
| `hardware.zigbee_gateway_dir` présent                                | `radio.siliconlabs-host`  |
| `hardware.relay_base` présent, ou `relay_base_fallbacks` non vide    | `relay.sysfs`             |
| `hardware.button_led_gpio_base` présent                              | `relay.gpio-button-led`   |
| `hardware.has_button_backlight: true`                                | `input.button-backlight`  |
| `sensors.proximity_technology` ou `sensors.light_technology` présent | `sensor.android`          |
| `sensors.proximity_gpio` présent                                     | `sensor.gpio-proximity`   |
| `sensors.cht8305: true`                                              | `sensor.cht8305-daemon`   |
| `sensors.vi530x: true`                                               | `sensor.vi530x-daemon`    |
| `input.evdev_buttons` non vide                                       | `input.evdev`             |
| `provisioning.software.webview.artifact` présent                     | `update.webview`          |

<a id="syntax-and-storage-quotas"></a>

### Quotas de syntaxe et de stockage

| Périmètre                        | Limite                                                              |
| -------------------------------- | ------------------------------------------------------------------- |
| Une révision YAML brute          | 128 KiB d’octets UTF-8.                                             |
| Nombre de documents YAML         | Exactement un ; entrée vide invalide.                               |
| Alias YAML                       | Zéro.                                                               |
| Imbrication                      | Au plus 20 niveaux de collections.                                  |
| Travail d’analyse                | Au plus 20 000 événements d’analyse.                                |
| Un dictionnaire ou une liste     | Au plus 512 entrées avant les limites de champ plus étroites.       |
| Une chaîne                       | Au plus 16 384 caractères avant les limites de champ plus étroites. |
| Catalogue importé                | Au plus 128 révisions admises.                                      |
| Un identifiant de profil importé | Au plus 16 révisions admises.                                       |
| Stockage YAML importé            | Au plus 4 MiB au total.                                             |

<a id="requirements"></a>

## Prérequis

Un profil déclare le comportement minimal du cœur et les pilotes compilés nécessaires. La validation refuse par défaut si un prérequis est indisponible. Un prérequis indisponible diffère d’un sondage réel échoué : le premier signifie que cette build ha-paneld ne connaît pas le mécanisme demandé ; le second signifie que le mécanisme existe dans le cœur mais n’était pas accessible sur ce panneau.

N’élargissez pas les prérequis par anticipation. Exiger un pilote privilégié inutilisé complique l’exécution et la revue sans ajouter de capacité.

<a id="match-rules"></a>

## Règles de correspondance

Les règles ne portent que sur les faits immuables `model`, `device` et `product_version` exposés par ha-paneld. Une liste `match.any` est un OU ; les prédicats du `all` d’un groupe sont un ET. Les prédicats acceptent `equals`, `starts_with` et `contains` sur des valeurs attendues en minuscules, jamais d’expressions régulières.

Chaque groupe a une branche `priority` de 0 à 1000. Le profil intégré correspondant dont le groupe correspondant a la priorité la plus élevée gagne ; `match.priority` du profil départage une égalité restante, et une égalité exacte revient prudemment à Generic. Utilisez des priorités de groupe élevées pour les identités produit exactes et faibles pour les replis de compatibilité larges. Une règle correspondant seulement à `px30`, `rk3326`, `rk3566`, `rk3576` ou un nom de référence pareillement réutilisé ne suffit pas à justifier des commandes matérielles spécifiques.

La correspondance choisit un profil candidat ; elle ne prouve pas une capacité. Les pilotes vérifient toujours leur disponibilité réelle ; en cas de désaccord entre preuves et déclaration, le résultat prudent l’emporte.

<a id="named-model-strategies"></a>

## Stratégies nommées de modèle

Le schéma n’a ni langage d’expression générique ni section de modifications conditionnelles arbitraires. Ses stratégies nommées sont volontairement restreintes et appartiennent au cœur :

- `identity.model_label_strategy: nspanel-product-version` décode la variante NSPanel et le libellé du micrologiciel ;
- `provisioning.display.density: nspanel-variant` sélectionne la densité documentée 86P/120P ;
- le défaut `display-name` et les entiers fixes évitent ces transformations.

`hardware.relay_base_fallbacks` est une donnée bornée ordinaire pour les renommages connus de classes de relais pris en charge, pas une expression ni une recherche arbitraire de chemin.

Les stratégies sont des transformations compilées et bornées nommées dans le schéma, pas des scripts du profil. Elles ne peuvent invoquer ni entrées/sorties ni pilotes. Le schéma servi décrit stratégies et entrées prises en charge.

Créez des profils séparés si aucune stratégie ne couvre la différence, ou si les produits nécessitent des pilotes compilés, niveaux d’autorité, attentes de récupération ou preuves entretenues indépendamment différents.

<a id="capabilities-and-compiled-drivers"></a>

## Capacités et pilotes compilés

Une déclaration de capacité contient des faits matériels et, si nécessaire, un identifiant de pilote avec paramètres typés. Les identifiants désignent des implémentations compilées dans ha-paneld. Le pilote valide chemins, plages, codes d’événement, noms de paquet et autres entrées sensibles pour la sécurité. Les chemins privilégiés proviennent des listes autorisées du cœur. Les métadonnées conservées `provisioning.software.webview.artifact` désignent URL, version, somme de contrôle de l’artefact et empreinte du signataire compilées et auditées avec le cœur ; un profil ne peut redéfinir cette racine de confiance. Dans la version 1.0.0-rc2 non publiée, une mise à jour lancée par le propriétaire vérifie le fournisseur installé et sa compatibilité avant d’utiliser l’artefact ; le profil ne peut fournir un autre téléchargement ni une autre racine de confiance.

Les profils ne peuvent fournir :

- commandes shell ni tableaux d’arguments ;
- noms de commandes du démon auxiliaire ;
- opérations arbitraires de lecture/écriture du système de fichiers ;
- bibliothèques natives, numéros ioctl ni charges utiles d’octets ;
- URL d’APK, empreintes de signataire ni nouveaux artefacts de mise à jour ;
- expressions exécutables ayant accès au réseau, aux fichiers, processus, à la réflexion ou à l’horloge ;
- identifiants, jetons Home Assistant ni configuration MQTT.

Une capacité déclarée reste candidate jusqu’à confirmation du pilote. Interface et diagnostics devraient distinguer **déclarée**, **disponible**, **indisponible** et **autorité manquante**, plutôt que de traiter le YAML comme preuve.

<a id="compatibility-behaviour"></a>

## Comportement de compatibilité

ha-paneld traite les incompatibilités comme des problèmes de profil inactif, pas comme des échecs de démarrage du panneau :

- Le schéma `2` est le seul langage documentaire accepté. Les révisions stockées de schéma 1 restent listables, exportables et supprimables, sans pouvoir être activées ; une révision incompatible sélectionnée revient à la dernière valide compatible de schéma 2, à un profil intégré correspondant ou au `generic.yaml` intégré.
- Un pilote ou une transformation obligatoire inconnu empêche l’activation.
- Les révisions locales installées sont revalidées après une mise à jour de l’application.
- Le YAML original et son empreinte restent identifiables après validation et normalisation.
- Un échec d’activation revient à la dernière révision valide.
- Si aucun profil spécifique ne peut fonctionner, ha-paneld démarre avec le comportement prudent du `generic.yaml` intégré. Si ce repli manque ou est corrompu, un contrat d’urgence sans capacité maintient l’interface locale de gestion sans affirmer de matériel du panneau.

Les empreintes de contenu et les éventuelles signatures publiées séparément répondent à des questions différentes. L’empreinte de révision ha-paneld lie enregistrement et activation aux octets examinés. Une signature externe peut aider à identifier un éditeur, mais n’est pas un signal d’autorité interprété par le chargeur. Aucune ne donne root ni la permission de contourner validation et confirmation.

<a id="matching-precedence"></a>

## Ordre de priorité des correspondances

La résolution protège les produits connus contre l’activation implicite de fichiers communautaires :

1. sélection explicite et valide de l’administrateur, figée sur une révision intégrée ou locale exacte ;
2. correspondance automatique exacte intégrée ;
3. replis automatiques de compatibilité intégrés ;
4. Generic.

Les règles locales/communautaires ne sont évaluées que pour aperçu et comparaison. Elles ne participent jamais à la sélection automatique : importer ou enregistrer un fichier ne peut donc remplacer la détection intégrée. Son activation exige toujours une sélection explicite figée.

<a id="compatibility-checklist-for-authors"></a>

## Vérifications de compatibilité pour les auteurs

Avant de partager une nouvelle révision, confirmez :

- que le schéma `2` et chaque champ sont valides sur la plus ancienne version du cœur revendiquée par le fichier ;
- que chaque pilote requis existe dans cette version ;
- que des jeux d’essai d’empreintes exactes couvrent chaque modèle et famille de micrologiciel revendiqués ;
- qu’un jeu d’essai presque similaire ne correspond pas à un autre produit utilisant le même SoC ;
- que chaque limite de stratégie nommée a été testée juste en dessous, à la transition et juste au-dessus lorsque pertinent ;
- que chaque groupe de correspondance exacte a une priorité de branche supérieure à son repli large, avec des jeux d’essai de collision entre profils ;
- que le profil fonctionne avec du matériel facultatif indisponible et une autorité manquante sans bloquer le démarrage ;
- que la révision précédemment active reste une cible de retour utilisable.
