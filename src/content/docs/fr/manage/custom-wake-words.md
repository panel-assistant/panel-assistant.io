---
title: Mots de réveil personnalisés
description: Entraîner votre propre mot de réveil avec microWakeWord, l’importer sur un panneau, le déployer sur plusieurs panneaux et l’ajuster.
sourceCommit: 1969c9acf0faa42c05410c5b96af34f9e6b10eb4
---

Les quatre mots de réveil intégrés sont des modèles [microWakeWord](https://github.com/kahrendt/microWakeWord), et l’[assistant vocal](/fr/manage/voice-assistant/) d’un panneau peut importer tout modèle entraîné de la même manière. Cette page décrit l’entraînement, le format du manifeste, l’importation sur le panneau et les tests après installation.

## Entraîner un modèle

microWakeWord est un projet open source distinct sous licence Apache-2.0, créé par Kevin Ahrendt ; son [notebook d’entraînement](https://github.com/kahrendt/microWakeWord/blob/main/notebooks/basic_training_notebook.ipynb) décrit tout le processus et constitue la référence canonique. En voici les grandes lignes :

1. **Choisir une phrase et générer des échantillons synthétiques.** Vous définissez la phrase cible, et le notebook utilise [piper-sample-generator](https://github.com/rhasspy/piper-sample-generator) pour en synthétiser des milliers d’exemples parlés avec différentes voix.
2. **Augmenter les échantillons.** Le notebook applique des effets à l’audio synthétique (égalisation, distorsion, changement de hauteur, convolution par réponse impulsionnelle de pièce et mélange avec des bruits de fond et de la musique issus de jeux de données audio publics), afin que le modèle n’apprenne pas seulement à reconnaître un enregistrement propre.
3. **Entraîner.** Le modèle s’entraîne pendant un nombre configurable d’étapes, puis est converti d’un modèle non continu vers la forme en continu réellement exécutée par le panneau. Le notebook indique lui-même que l’entraînement dans Google Colab est possible mais nettement plus lent que sur un GPU local.
4. **Exporter.** Le modèle entraîné est exporté sous forme de fichier TensorFlow Lite quantifié en continu. C’est le fichier `.tflite` à importer.

Vous n’avez pas besoin de ces étapes si un modèle prêt à l’emploi couvre déjà votre phrase : le dépôt [`esphome/micro-wake-word-models`](https://github.com/esphome/micro-wake-word-models) (également sous Apache-2.0) publie des modèles entraînés par nom de fichier sous `models/v2/`, qui s’importent exactement comme un modèle entraîné par vos soins.

## Écrire le manifeste

Chaque mot de réveil nécessite un petit manifeste JSON à côté de son fichier `.tflite`, au format version 2 de microWakeWord. C’est le format utilisé par le composant `micro_wake_word` d’ESPHome et le dépôt `esphome/micro-wake-word-models` : un manifeste de l’une ou l’autre source fonctionne donc sans modification. Champs obligatoires :

- `"type"` : toujours `"micro"`.
- `"model"` : le nom du fichier `.tflite` (sans barre oblique).
- `"micro"` : un objet contenant `probability_cutoff` (de 0 à 1), `feature_step_size` (un entier positif ; les modèles actuels utilisent `10`) et `sliding_window_size` (un entier positif).

Champs facultatifs : `wake_word` (la phrase affichée dans l’interface ; à défaut, l’identifiant du mot de réveil), `author`, `website`, `trained_languages`, `version` et `micro.tensor_arena_size`.

Voici le manifeste Hey Jarvis intégré, comme exemple de structure :

```json
{
  "type": "micro",
  "wake_word": "Hey Jarvis",
  "author": "Kevin Ahrendt",
  "website": "https://www.kevinahrendt.com/",
  "model": "hey_jarvis.tflite",
  "trained_languages": ["en"],
  "version": 2,
  "micro": {
    "probability_cutoff": 0.97,
    "feature_step_size": 10,
    "sliding_window_size": 5,
    "tensor_arena_size": 22860,
    "minimum_esphome_version": "2024.7.0"
  }
}
```

### Choisir `probability_cutoff` et `sliding_window_size`

Ces deux paramètres équilibrent les réveils intempestifs et les réveils manqués ; aucune valeur ne convient à tous les modèles :

- **`probability_cutoff`** est le seuil de confiance que le modèle doit dépasser pour signaler une détection. L’augmenter réduit les réveils sur des sons qui ressemblent seulement à votre phrase, mais augmente aussi le risque de manquer une vraie phrase prononcée plus doucement ou plus naturellement. Le diminuer produit le compromis inverse. Les modèles intégrés utilisent environ `0.97` ; le notebook d’entraînement conseille d’ajuster le seuil d’après les performances réelles du modèle entraîné, plutôt que de supposer qu’une valeur unique lui conviendra.
- **`sliding_window_size`** contrôle le nombre de fenêtres de détection consécutives dont la moyenne est calculée avant que le panneau déclenche un réveil. Une fenêtre plus petite réagit plus vite, mais est plus sensible à un pic de bruit isolé ; une plus grande lisse ces pics au prix d’un réveil légèrement plus lent.

Partez des valeurs suggérées par la documentation de votre modèle ou votre exécution du notebook, importez-le, puis ajustez-les à partir du journal des détections proches du seuil décrit dans [Tests et réglages](#tests-et-réglages).

## Importer le modèle

### Depuis la page Configurer du panneau

Sur la carte **Voix**, le sélecteur de mots de réveil comporte une commande **Importer**. Choisissez le manifeste `.json` du modèle et son fichier `.tflite`, puis appuyez sur **Importer**. Le panneau valide le modèle avec son propre moteur de mots de réveil avant de l’accepter ; s’il le refuse, rien n’est installé, et si un modèle du même nom avait déjà été importé, cet ancien modèle reste en place. Les manifestes sont limités à 16 KB et les modèles à 2 MB.

L’identifiant du mot de réveil est dérivé du nom du fichier `.tflite`, mis en minuscules et réduit aux lettres, chiffres et traits de soulignement (il doit commencer par une lettre). Il ne peut pas réutiliser l’identifiant d’un mot de réveil intégré, et importer un modèle sous un nom déjà utilisé remplace cet ancien modèle.

L’importation rend le mot de réveil disponible ; elle ne l’active pas. Pour l’utiliser sur un panneau, cochez-le sous **Mots d’activation** et choisissez son pipeline sous **Pipelines des mots d’activation**. Il apparaît aussi dès lors dans le sélecteur de mots de réveil de Home Assistant pour ce panneau.

### Sur plusieurs panneaux

L’endroit où vous ouvrez Configurer détermine si l’importation est partagée :

- **Directement sur la page Configurer du panneau :** le modèle importé reste sur ce panneau. Il n’est pas partagé avec les autres panneaux.
- **Dans la barre latérale Panel Assistant de Home Assistant :** une fois le modèle validé et installé par le panneau sélectionné, Panel Assistant conserve une copie partagée et l’installe sur tous les autres panneaux équipés d’un microphone, y compris ceux qui se connectent plus tard.

Importer un modèle plus récent avec le même identifiant via la barre latérale remplace la copie partagée et peut mettre à jour les panneaux qui détiennent une copie précédemment partagée. Un modèle différent importé indépendamment sous cet identifiant sur un autre panneau est conservé ; Panel Assistant crée une [Réparation de mot de réveil](/fr/home-assistant/repairs/#wake-word-kept) au lieu de l’écraser. Un panneau qui refuse un modèle partagé reçoit aussi une [Réparation indiquant la raison](/fr/home-assistant/repairs/#wake-word-refused).

Le partage rend le modèle sélectionnable sur chaque panneau ; choisissez séparément son mot de réveil et son pipeline sur chacun pour l’activer.

## Tests et réglages

Sélectionnez **Visiter** sur la page de l’appareil du panneau dans Home Assistant et ouvrez **Journaux** (par exemple, `http://<panel>:8888/logs` avec le port par défaut), puis prononcez le mot de réveil et observez le journal. Un mot de réveil entendu mais qui n’a pas tout à fait déclenché apparaît comme une détection proche du seuil, avec une ligne telle que `wake word my_wake_word heard at 0.86, short of its cutoff`, indiquant le score maximal de cette tentative. Si ces scores se situent juste sous votre `probability_cutoff`, il suffit généralement de diminuer légèrement le seuil ou d’augmenter **Sensibilité au mot d’activation** sur la carte Voix ; si la phrase n’apparaît jamais comme une détection proche du seuil, le modèle lui-même ne la reconnaît pas, et il est plus utile de le réentraîner avec des échantillons plus nombreux ou plus variés.
