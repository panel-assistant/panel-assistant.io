---
title: Dimensionnement de l’affichage
description: Faire correspondre la taille d’un tableau de bord Home Assistant sur un panneau à son apparence dans un navigateur d’ordinateur, à l’aide de la densité et de la taille du texte.
sourceCommit: 9d098839121f176fd5c9e1c6a182c752fd4cfba5
---

Un tableau de bord Home Assistant conçu dans un navigateur d’ordinateur s’affiche souvent à la mauvaise taille sur un panneau mural Android : les cartes sont trop grandes et leurs bords sont coupés, ou elles sont trop petites. Un téléphone reste généralement assez proche de l’affichage sur ordinateur, mais les panneaux s’en écartent souvent, car leurs fabricants définissent une densité système et une échelle de police mal adaptées à l’écran physique. L’application du panneau vous propose deux réglages, **densité (DPI)** et **taille du texte (échelle de police)**, sous **Installer**, puis **Dimensionnement de l’affichage**, pour rétablir les proportions de la disposition et du texte. Vous avez généralement besoin des deux.

:::caution[Expérimental]
Les réglages fonctionnent, mais les valeurs appropriées pour chaque panneau ne sont pas encore établies. Considérez la densité et la taille du texte comme des réglages à expérimenter plutôt que comme une fonction finalisée. Les retours sur les valeurs qui conviennent bien à un panneau donné sont les bienvenus.
:::

## Utilisation

La carte **Dimensionnement de l’affichage** de l’onglet **Installer** du panneau définit une densité logique et une taille de texte personnalisées, les applique immédiatement ou rétablit la densité de base d’usine d’Android. Les deux réglages sont conservés après un redémarrage, car il s’agit de paramètres du système Android.

:::note
Cela nécessite un moyen d’accès privilégié approuvé : normalement le `su` du fabricant ou l’[assistant root](https://github.com/panel-assistant/android/blob/main/helper/README.md). Un panneau compatible sans accès root, dont l’accès renforcé facultatif a déjà été approuvé sur le panneau, peut également effectuer ces modifications précises de l’affichage. Lorsqu’aucun moyen pris en charge n’est prêt, la carte reste visible mais verrouillée.
:::

Pour régler l’affichage, ouvrez le même tableau de bord dans un navigateur d’ordinateur comme référence. Réduisez la densité jusqu’à ce que la disposition corresponde, avec davantage de cartes à l’écran, puis ajustez légèrement la taille du texte jusqu’à ce qu’il corresponde. Les bonnes valeurs dépendent de l’installation — résolution du panneau, distance à laquelle les personnes se tiennent, conception du tableau de bord — plutôt que du modèle, ce qui explique pourquoi aucune valeur standard n’est fournie.

## Les deux réglages

| Réglage                                 | Ce qu’il modifie                                                                                                                                                                                                                                                             | Mécanisme                            |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Densité (DPI)**                       | La disposition entière. La zone d’affichage effective en dp est `physical px ÷ (density / 160)`. Une densité plus faible permet d’afficher davantage de contenu, plus près de la zone d’affichage plus large d’un ordinateur ; une densité plus élevée agrandit l’affichage. | `wm density <n>`                     |
| **Taille du texte (échelle de police)** | Le texte du tableau de bord. L’échelle de police du système Android devient le `textZoom` du WebView (`textZoom = scale × 100`).                                                                                                                                             | `settings put system font_scale <f>` |

La sortie de la commande Android `wm density` appelle la valeur de base d’usine `Physical density`. Ce libellé est trompeur : il s’agit de la densité qu’Android utilise pour la disposition après la réinitialisation d’un réglage personnalisé, et non d’une mesure des pixels par pouce de l’écran. L’application du panneau l’indique comme **base d’usine** et n’affiche une valeur physique en PPI que pour les profils matériels dont les dimensions de l’écran ont été vérifiées indépendamment.

Modifier uniquement la densité redimensionne la disposition, mais peut laisser le texte à une taille incorrecte par rapport à l’ordinateur ; l’échelle de police corrige le texte. Régler les deux ensemble permet de faire correspondre l’affichage du panneau à celui du navigateur dans lequel le tableau de bord a été conçu.
