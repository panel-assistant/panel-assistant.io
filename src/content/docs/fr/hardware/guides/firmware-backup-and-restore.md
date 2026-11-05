---
title: Sauvegarde et restauration du firmware
description: Sauvegardez via le réseau chaque partition d’un panneau mural Rockchip disposant d’un accès root, et restaurez une partition en mode Loader avec rkdeveloptool.
sourceCommit: f49bf12954ed3e89e5e32d635b4bbcb06095cf9b
sidebar:
  label: Sauvegarde et restauration du firmware
  order: 3
---

Le Tuya TPA10 et l’Electron WF1589T ne proposent pas la combinaison habituelle des boutons de volume et d’alimentation pour accéder au mode de récupération Android. Les guides standard qui commencent par « maintenez Volume bas et Alimentation enfoncés » ne s’appliquent donc pas : ces panneaux utilisent à la place le protocole Loader de Rockchip.

La sauvegarde d’une partition s’effectue en lecture seule, mais peut être volumineuse. Elle passe par le réseau sans changement de mode, nécessite un accès root et stocke temporairement chaque image sur le stockage partagé du panneau ([Sauvegarder maintenant](#sauvegarder-maintenant)). Avant de commencer, vérifiez que le panneau dispose d’assez d’espace libre pour sa plus grande partition. La restauration est plus complexe, nécessite un câble USB et un ordinateur portable, et reste expérimentale tant qu’une récupération de bout en bout n’a pas été validée sur un appareil de réserve.

La procédure normale en mode Loader utilise `rkdeveloptool`, un outil open source et multiplateforme. Les anciens outils du fabricant (`RKDevTool` et `AndroidTool`) sont des interfaces graphiques réservées à Windows ; `rkdeveloptool` fonctionne sous Linux, macOS ou Windows via WSL2. Le Sonoff NSPanel Pro utilise des outils distincts propres au modèle, décrits dans les [Notes par panneau](#notes-par-panneau).

:::note
Les commandes ci-dessous s’appliquent uniquement aux agencements des TPA10 et WF1589T dotés d’un accès root, consignés dans les [Notes par panneau](#notes-par-panneau). Ne les utilisez pas sur un ZHICAI SMT1019 ou ZX-SMT156 sans accès root, sur un Shelly Wall Display ou sur un profil Generic non caractérisé. Les étapes de restauration n’ont pas fait l’objet d’un test de blocage et de restauration, et la récupération en mode Maskrom n’est pas documentée, car aucun fichier de chargeur vérifié propre au modèle n’a été établi.
:::

## Sauvegarder maintenant

Lisez chaque partition directement depuis le panneau en fonctionnement, via le réseau. Ces commandes n’écrivent pas dans les partitions et ne changent pas le mode de démarrage ; vous avez seulement besoin de l’adresse du panneau et d’[adb](https://developer.android.com/tools/adb). adb est déjà inclus dans le module complémentaire SSH de Home Assistant, et les panneaux l’exposent sur le port TCP 5555 : la sauvegarde passe donc entièrement par le réseau, sans USB.

```bash
IP=<panel-ip>           # your panel's IP address
mkdir -p backup && cd backup
adb -s $IP:5555 shell 'su 0 sh -c "for f in /dev/block/by-name/*; do echo \$(basename \$f) \$(readlink -f \$f); done"' \
  | while read name dev; do
      [ -z "$dev" ] && continue
      echo "backing up $name ($dev)"
      adb -s $IP:5555 shell "su 0 dd if=$dev of=/sdcard/$name.img bs=1M 2>/dev/null"
      adb -s $IP:5555 pull /sdcard/$name.img "./$name.img"
      adb -s $IP:5555 shell "rm /sdcard/$name.img"
    done
```

Conservez le dossier en lieu sûr. Capturez ensuite les 8 premiers MiB de l’eMMC, comme éléments de preuve supplémentaires sur l’agencement de démarrage. Ce début brut de la mémoire flash n’est **pas** un fichier MiniLoader Rockchip et ne doit pas être transmis à `rkdeveloptool db` :

```bash
adb -s $IP:5555 shell "su 0 dd if=/dev/block/mmcblk2 of=/sdcard/idb_head.img bs=1M count=8"   # mmcblk2 on TPA10; mmcblk1 on WF1589T
adb -s $IP:5555 pull /sdcard/idb_head.img ./idb_head.img && adb -s $IP:5555 shell "rm /sdcard/idb_head.img"
```

:::note
**Ce que vous venez de sauvegarder.** Chaque partition nommée dont la sauvegarde s’est terminée avec succès : le chargeur de démarrage (`uboot`, `trust`, `security`), le système (`boot`, `recovery`, `super` et les autres) et vos données (`userdata`, qui peut être très volumineuse). Comparez la taille de chaque fichier récupéré à celle indiquée par `blockdev --getsize64` pour sa partition source avant de considérer la sauvegarde comme complète. Ces commandes nécessitent la méthode vérifiée `su 0` sur le TPA10 ou le WF1589T ; la famille du SoC ne suffit pas à impliquer un accès root. Le NSPanel Pro utilise des [outils propres au modèle](#notes-par-panneau).
:::

<span id="stop-unwanted-updates"></span>

## Arrêter les mises à jour indésirables

Décidez s’il convient de reporter une mise à jour du fabricant à l’aide des [recommandations sur la sécurité et les capacités du firmware](/fr/hardware/firmware/#firmware-updates-and-capabilities). Une sauvegarde seule ne prouve pas que vous puissiez revenir à une version antérieure ou rétablir l’accès. Si vous choisissez de suspendre les mises à jour automatiques sur un **WF1589T**, la commande ci-dessous désactive son outil de mise à jour ; `pm enable` le réactive :

```bash
adb -s $IP:5555 shell 'pm disable-user --user 0 com.elclcd.otaupdater'   # WF1589T
```

:::note
L’application de mise à jour varie selon le panneau. Le **WF1589T** utilise `com.elclcd.otaupdater` ; le **TPA10** n’a pas d’outil de mise à jour dédié, surveillez donc les mises à jour envoyées par Tuya. Consultez les [Notes par panneau](#notes-par-panneau).
:::

## Si vous devez un jour effectuer une restauration

La restauration écrit sur le panneau : contrairement à la sauvegarde, elle nécessite donc un **câble USB relié à un ordinateur** et le programme `rkdeveloptool`. Apportez un ordinateur portable près du panneau ; vous devrez peut-être décrocher le panneau du mur pour accéder au port USB. La configuration initiale, à effectuer une seule fois, est décrite dans [Configurer rkdeveloptool](#configurer-rkdeveloptool). Les opérations possibles dépendent du panneau et du fait qu’Android démarre encore ou non :

1. **Quel panneau ?** Pour un NSPanel Pro 86P ou 120P, utilisez les [outils propres au modèle](#notes-par-panneau) ; `rkdeveloptool` n’est pas la méthode à utiliser dans ce cas. Pour un TPA10 ou un WF1589T, continuez.
2. **Disposez-vous d’une sauvegarde vérifiée**, avec la taille de chaque fichier comparée à la valeur de `blockdev --getsize64` ? Sinon, arrêtez-vous et effectuez-en une d’abord. La sauvegarde s’effectue en lecture seule et ne nécessite que le réseau.
3. **Android démarre-t-il encore ?** Si oui, utilisez la procédure prise en charge en mode Loader ci-dessous : `adb reboot loader`, confirmez `Loader` avec `rkdeveloptool ld`, restaurez par nom de partition avec `wlx`, puis redémarrez avec `rd`.
4. **Si Android ne démarre pas**, Maskrom permettra toujours d’énumérer l’appareil, mais l’écriture depuis Maskrom nécessite un MiniLoader vérifié, propre au modèle et à la mémoire. Aucun panneau documenté ici n’en possède. Limitez Maskrom à l’observation : exécutez `ld` pour confirmer le mode et n’exécutez pas `db`, `wl`, `wlx`, `gpt`, `ul` ou `ef`. Une procédure d’écriture depuis Maskrom sort du cadre de ce guide, même avec un chargeur validé sur un appareil de réserve.

**Le panneau démarre encore.** Faites-le passer en mode de flashage via le réseau et réécrivez la partition :

```bash
adb -s $IP:5555 reboot loader       # software entry — no buttons
rkdeveloptool ld                     # expect: <id>  Loader
rkdeveloptool wlx boot boot.img      # restore a partition by name
rkdeveloptool rd                     # reboot
```

**Le panneau ne démarre pas.** Arrêtez-vous ici. Le mode Maskrom de Rockchip permet toujours d’énumérer un appareil, mais l’écriture depuis Maskrom nécessite d’abord un MiniLoader valide, propre au modèle et à la mémoire, et ce fichier n’a pas encore été obtenu ni testé en restauration pour ces panneaux :

```bash
# after entering the model-specific hardware mode, observation only:
rkdeveloptool ld                     # expect: <id>  Maskrom
# Do not run `db`, `wl`, `wlx`, `gpt`, `ul` or `ef` without a verified MiniLoader and recovery plan.
```

:::danger
Le fichier brut `idb_head.img` capturé pendant la sauvegarde ne remplace pas un MiniLoader Rockchip. Ne le renommez pas en `loader.bin` et ne le transmettez pas à `rkdeveloptool db`. Tant qu’un chargeur n’a pas été extrait ou obtenu, authentifié et validé sur un appareil de réserve, seule la procédure de restauration ci-dessus en mode Loader, activé par voie logicielle, est documentée.
:::

## Référence

Tout ce qui suit fournit du contexte et des informations de référence ; vous n’en avez pas besoin pour effectuer une sauvegarde.

### Configurer rkdeveloptool

Nécessaire uniquement pour la [restauration](#si-vous-devez-un-jour-effectuer-une-restauration). `rkdeveloptool` est le remplaçant open source des anciens outils Rockchip réservés à Windows. Il communique avec le panneau par USB via [libusb](https://libusb.info), et fonctionne donc sur l’ordinateur portable que vous possédez déjà :

| Votre ordinateur  | Fonctionne ?                                                   | Méthode                                                                                                                                                                                                        |
| ----------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS             | Oui                                                            | `brew install automake autoconf libusb`, puis compilez comme indiqué ci-dessous                                                                                                                                |
| Windows           | Oui, via [WSL2](https://learn.microsoft.com/windows/wsl/about) | Installez [`usbipd-win`](https://github.com/dorssel/usbipd-win), puis utilisez `usbipd bind` et `usbipd attach --wsl` pour confier le périphérique USB à Linux, et compilez comme indiqué ci-dessous dans WSL2 |
| Linux             | Oui, nativement                                                | Compilez comme indiqué ci-dessous ; la règle udev `99-rk-rockusb.rules` accorde l’accès USB                                                                                                                    |
| Windows, en natif | Anciens outils uniquement                                      | L’ancienne interface graphique `RKDevTool.exe` et un pilote spécial. Évitez cette solution et utilisez plutôt WSL2                                                                                             |

Compilez-le avec les mêmes commandes sur toutes les plateformes :

```bash
git clone https://github.com/rockchip-linux/rkdeveloptool && cd rkdeveloptool
autoreconf -i && ./configure && make
sudo cp rkdeveloptool /usr/local/bin/
sudo cp 99-rk-rockusb.rules /etc/udev/rules.d/ && sudo udevadm control --reload   # Linux/WSL2 only
```

#### Docker sur un hôte Linux

Sur un hôte Linux, vous pouvez l’exécuter depuis un conteneur au lieu de le compiler :

```dockerfile
# Dockerfile
FROM debian:stable-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential autoconf automake pkg-config libusb-1.0-0-dev git ca-certificates \
 && git clone https://github.com/rockchip-linux/rkdeveloptool /src \
 && cd /src && autoreconf -i && ./configure && make && cp rkdeveloptool /usr/local/bin/ \
 && apt-get purge -y build-essential git && apt-get autoremove -y && rm -rf /var/lib/apt/lists/* /src
ENTRYPOINT ["rkdeveloptool"]
```

```bash
docker build -t rkdeveloptool .
docker run --rm -it --privileged -v /dev/bus/usb:/dev/bus/usb rkdeveloptool ld
```

Docker Desktop sous macOS et Windows ne peut pas accéder à l’USB, car il s’exécute dans une machine virtuelle ; la méthode par conteneur est donc réservée à Linux.

:::note
La sauvegarde et le passage en mode Loader utilisent adb via le réseau (port 5555), sans USB. L’USB n’est nécessaire que pour les étapes avec `rkdeveloptool`, qui constituent donc la seule partie nécessitant un ordinateur portable près du panneau.
:::

### Commandes de rkdeveloptool

D’après l’aide de l’outil lui-même ; exécutez `rkdeveloptool -h` pour confirmer les commandes de votre version compilée :

| Commande                           | Fonction                                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `ld`                               | lister les appareils connectés et indiquer si chacun est en mode `Loader` ou `Maskrom`                                    |
| `rfi` / `rid` / `rcb`              | lire les informations sur la mémoire flash, son identifiant et sa capacité                                                |
| `ppt`                              | afficher la table des partitions (noms, [LBA](https://en.wikipedia.org/wiki/Logical_block_addressing) de début et taille) |
| `rl <BeginSec> <SectorLen> <File>` | **lire** une plage de LBA dans un fichier (sauvegarde côté hôte)                                                          |
| `wl <BeginSec> <File>`             | écrire un fichier à une adresse LBA brute (avancé)                                                                        |
| `wlx <PartitionName> <File>`       | **écrire** un fichier dans une partition nommée (restauration, le choix le plus sûr)                                      |
| `db <Loader>`                      | charger un chargeur sur un appareil en mode **Maskrom**                                                                   |
| `ul <Loader>`                      | mettre à jour le chargeur stocké en mémoire flash                                                                         |
| `gpt <table>`                      | écrire une table de partitions [GPT](https://en.wikipedia.org/wiki/GUID_Partition_Table)                                  |
| `ef`                               | effacer la mémoire flash                                                                                                  |
| `rd [subcode]`                     | réinitialiser (redémarrer) l’appareil                                                                                     |

### Pourquoi ces panneaux nécessitent des étapes particulières

Les TPA10 et WF1589T sont des SoC [Rockchip](https://en.wikipedia.org/wiki/Rockchip) (rk3566 et rk3576) qui démarrent depuis une [eMMC](https://en.wikipedia.org/wiki/MultiMediaCard#eMMC). Cette description ne s’applique pas à tous les panneaux pris en charge. Sur ces deux modèles, les conseils habituels pour Android ne fonctionnent pas, car :

- **Il n’y a pas de boutons.** Les guides qui indiquent « maintenez Volume bas et Alimentation enfoncés pour accéder à [fastboot](https://en.wikipedia.org/wiki/Fastboot) ou au mode de récupération » ne peuvent pas s’appliquer.
- **Il ne s’agit pas de fastboot.** Rockchip utilise son propre protocole USB, _rockusb_, avec deux [modes de flashage](https://wiki.radxa.com/Rock5/install/rockchip-flash-tools) :
  - **Loader**, activé par voie logicielle avec `adb reboot loader`, sans boutons. Les restaurations normales utilisent ce mode.
  - **Maskrom**, un mode de secours dans la ROM de la puce, qui fonctionne même si le chargeur de démarrage a été effacé. Il démarre sans RAM initialisée : un MiniLoader valide propre au modèle est donc nécessaire avant d’accéder aux partitions. Le début brut de l’eMMC n’est pas ce chargeur, et ce guide ne fournit pas de procédure d’écriture depuis Maskrom.

Articulation des modes :

- **Android en fonctionnement.** La sauvegarde fonctionne dans cet état, via le réseau, en lecture seule, sans changement de mode. `adb reboot loader` fait passer le panneau en mode Loader via le réseau.
- **Mode Loader.** `rkdeveloptool ld` indique `Loader`. `wlx` restaure une partition nommée, et `rkdeveloptool rd` permet de revenir à Android.
- **Mode Maskrom.** Accessible uniquement par voie matérielle : le trou du TPA10 n’est qu’une possibilité et le point de test du WF1589T n’a pas été localisé. `ld` indique le mode et n’écrit rien. Toute écriture (`db`, `wl`, `wlx`, `gpt`, `ul`, `ef`) nécessite un MiniLoader vérifié propre au modèle, qui n’a pas été obtenu ; elle n’est donc pas documentée ici.

En pratique, **Loader est le seul mode depuis lequel ce guide permet une restauration**, et il n’est accessible que tant qu’Android démarre encore, précisément au moment où vous avez le moins l’impression d’en avoir besoin. Cette asymétrie justifie de faire une sauvegarde maintenant : la voie logicielle à partir d’un panneau fonctionnel existe, tandis que la voie de secours à partir d’un panneau hors service manque encore de son fichier de chargeur.

<span id="per-panel-notes"></span>

### Notes par panneau

Les tables de partitions ont été lues sur des appareils en fonctionnement.

**Tuya TPA10** (rk3566, Android 11, eMMC de 7.28 GB `mmcblk2`). Accès root avec `su 0`. Accès au mode Maskrom : le trou près du port USB-C est une possibilité, mais vérifiez s’il sert à la réinitialisation ou au mode Maskrom avant de vous y fier. Port USB-C. Partitions : `security uboot trust misc dtbo vbmeta boot recovery backup cache metadata logo frp upgrade super userdata`.

**Electron WF1589T** (rk3576, Android 14, eMMC de 58.24 GB `mmcblk1`). Accès root avec `su 0`. Outil de mise à jour `com.elclcd.otaupdater`. Point de test Maskrom pas encore localisé. Partitions : `security uboot trust misc dtbo vbmeta boot recovery backup cache metadata frp baseparameter updatekey super userdata`.

**Sonoff NSPanel Pro 86P** (PX30) et **120P** (rk3326-S). Utilisez les outils reconnus de seaky plutôt que `rkdeveloptool` : [nspanel_pro_roottool_apk](https://github.com/seaky/nspanel_pro_roottool_apk) et [nspanel_pro_tools_apk](https://github.com/seaky/nspanel_pro_tools_apk), qui inclut la restauration du firmware. Principaux faits tirés des discussions dans les tickets de seaky (informations de seconde main, non vérifiées sur le matériel) :

- **Ne touchez jamais au stockage du fabricant Rockchip** (`/dev/vendor_storage`). L’emplacement **7** contient la chaîne de licence (les éléments 4 et 5 sont les deux adresses MAC) et l’emplacement **8** l’identifiant du produit (`SN-RKPX30-NSP-01`). L’effacement de ce stockage fait démarrer le panneau sur un écran d’usine en chinois avec un code QR. ([ticket roottool 1](https://github.com/seaky/nspanel_pro_roottool_apk/issues/1))
- **Récupérer le panneau depuis l’écran QR sans reflasher :** installez un lanceur via adb, connectez-vous au Wi-Fi, rouvrez l’application eWeLink du panneau et appuyez quelques fois sur **Activate**. La licence est à nouveau provisionnée en ligne et le panneau redevient fonctionnel. ([ticket roottool 9](https://github.com/seaky/nspanel_pro_roottool_apk/issues/9))
- **Cinq cycles d’alimentation** (coupez l’alimentation à l’apparition du logo de démarrage Sonoff, cinq fois) rétablissent les paramètres d’usine du panneau avec le firmware de sa _partition de récupération_, qui correspond souvent à la version livrée à l’origine. Par exemple, un appareil en version 2.3 revient à la version 1.7, car les mises à niveau à distance ne sont pas écrites dans la partition de récupération. ([tickets roottool 1](https://github.com/seaky/nspanel_pro_roottool_apk/issues/1) et [8](https://github.com/seaky/nspanel_pro_roottool_apk/issues/8))
- **Aucun retour à une version antérieure** (une restriction OTA d’Android). **Le mode développeur et l’accès root sont permanents** et persistent après une réinitialisation d’usine ; les appareils disposant d’un accès root enregistrés auprès d’eWeLink perdent également définitivement certaines fonctions cloud. ([ticket roottool 1](https://github.com/seaky/nspanel_pro_roottool_apk/issues/1))
- **Signes d’une eMMC hors service :** une boucle de démarrage où le rétroéclairage s’allume puis s’éteint et où le mode de récupération ne répond pas, ou un échec de vérification lors du flashage d’un fichier dont le bon fonctionnement est établi. Chacun de ces signes indique une défaillance de l’eMMC (ou un certificat système supprimé) et la récupération est généralement impossible. ([tickets roottool 8](https://github.com/seaky/nspanel_pro_roottool_apk/issues/8) et [12](https://github.com/seaky/nspanel_pro_roottool_apk/issues/12))
- Un reflashage brut utilise **RKDumper et Rockchip AndroidTool** par USB en mode Maskrom ; le PX30 nécessite un ajustement du pilote USB. En mode de récupération, adb identifie le panneau comme `product/model/device = px30_evb`, affiché sous la forme `rockchipplatform … recovery`. ([ticket roottool 2](https://github.com/seaky/nspanel_pro_roottool_apk/issues/2), [ticket tools 87](https://github.com/seaky/nspanel_pro_tools_apk/issues/87))
- **Flasher une mise à jour OTA Sonoff sur une carte Tuya T6E ou S6E la rend inutilisable** : le binaire `stop` est absent et elle reste bloquée en mode de récupération. ([ticket tools 87](https://github.com/seaky/nspanel_pro_tools_apk/issues/87))

### Consignes de sécurité

- Restaurez par **nom** de partition (`wlx`), et non par secteur brut, pour éviter les erreurs de décalage manuel. Confirmez le nom exact de la partition, l’image et le modèle du panneau avant toute écriture.
- Évitez les écritures brutes du disque entier (`wl` au secteur 0). Elles se heurtent à une particularité de rockusb liée à un décalage de `0x2000` secteurs ; limitez-vous à `wlx` et `rl` par partition.
- N’écrivez pas `uboot`, `trust`, un chargeur ou une table de partitions sans une sauvegarde vérifiée, un MiniLoader authentifié propre au modèle et un plan de restauration déjà validé sur un appareil de réserve.
- Si vous le pouvez, faites une répétition de la restauration sur un appareil de réserve avant de l’effectuer sur un panneau installé dans un mur.

### Points restant à éclaircir

Votre aide est souhaitée pour :

- Confirmer l’**accès au mode Maskrom** pour chaque panneau : déterminer si le trou du TPA10 sert à la réinitialisation ou au mode Maskrom, et où se trouve le point de test du WF1589T.
- Documenter comment obtenir ou extraire le **fichier de chargeur** pour chaque panneau, l’unique prérequis au secours en mode Maskrom.
- Effectuer, sur un appareil de réserve, un **test de bout en bout où l’appareil est rendu inutilisable puis restauré**, pour valider les étapes de restauration.
