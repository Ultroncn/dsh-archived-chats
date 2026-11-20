<p align="center">
  <img src="assets/brand/archive-management-banner.png" alt="Archive Management: local-first archived-chat center for DeepSeek Harness" width="100%">
</p>

<div align="center">

<h1>Gestion des archives</h1>

<p><strong>Retrouvez vos conversations DSH, gérez vos archives et conservez des sauvegardes ZIP.</strong></p>
<p><code>dsh-archived-chats</code></p>

<p><a href="README.md">简体中文</a> · <a href="README.en.md">English</a> · <a href="README.ja.md">日本語</a> · <a href="README.es.md">Español</a> · <strong>Français</strong> · <a href="README.de.md">Deutsch</a> · <a href="README.ru.md">Русский</a> · <a href="README.pt-BR.md">Português (Brasil)</a></p>

<p><a href="CHANGELOG.md">Changelog</a> · <a href="LICENSE">MIT License</a></p>

<p>
  <a href="https://www.npmjs.com/package/dsh-archived-chats"><img alt="Version npm" src="https://img.shields.io/npm/v/dsh-archived-chats?style=flat&amp;label=Version%20npm"></a>
  <a href="#compatibilit%C3%A9"><img alt="DSH >=0.1.0-rc.7" src="https://img.shields.io/badge/DSH-%3E%3D0.1.0--rc.7-2563eb?style=flat"></a>
  <a href="https://www.npmjs.com/package/dsh-archived-chats"><img alt="Téléchargements npm sur les 18 derniers mois" title="Téléchargements npm sur les 18 derniers mois" src="https://img.shields.io/npm/d18m/dsh-archived-chats?style=flat&amp;label=T%C3%A9l%C3%A9chargements%20npm"></a>
  <a href="LICENSE"><img alt="Licence · MIT" src="https://img.shields.io/badge/Licence-MIT-2ea44f?style=flat"></a>
  <a href="https://dsh-insights.com/p/Ultroncn/dsh-archived-chats/"><img alt="DSH Insights" src="https://dsh-insights.com/badge/Ultroncn/dsh-archived-chats.svg"></a>
</p>

<p><a href="https://awesome-dsh-plugin.com/p/Ultroncn/dsh-archived-chats/">Plugin market</a> · <a href="https://www.npmjs.com/package/dsh-archived-chats">npm</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/releases">Releases</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/discussions">Discussions</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/security/advisories/new">Private security report</a></p>

</div>

> Cette extension de DeepSeek Harness est maintenue par la communauté et ne constitue pas un produit officiel de DeepSeek AI.

La gestion des archives permet de rechercher, d’organiser et de sauvegarder les conversations dans DeepSeek Harness. Retrouvez une solution et son contexte, archivez vos conversations par espace de travail ou sauvegardez-les dans un fichier ZIP avant de les supprimer.

- **Recherche dans les conversations.** Recherchez dans les titres, les messages et les résultats d’outils des conversations archivées ou non archivées. Dans les archives, vous pouvez aussi rechercher par étiquette ou par note. Chaque résultat affiche le passage correspondant dans son contexte et donne accès directement à cet endroit.
- **Organisation des conversations.** Gérez les conversations archivées ou non, regroupées par espace de travail ou sans groupe. Vous disposez d’actions groupées, d’étiquettes et de notes.
- **Sauvegardes ZIP.** Exportez et importez des archives ZIP contenant du JSON et du Markdown. Un aperçu précède l’import et les identifiants déjà présents sont ignorés pour préserver les conversations existantes.
- **Origines et branches.** La vue **Origins & Branches**, en lecture seule, retrace les conversations sources, les branches et les liens avec les sous-agents dans tous les espaces de travail, quel que soit le statut d’archivage.

> Ce document décrit la version 2.0.7. Les anciennes fonctions de récupération ont été supprimées. Vous pouvez relancer explicitement une tâche de suppression définitive qui a échoué.

## Installer et ouvrir

Dans le catalogue de modules de DSH, recherchez `dsh-archived-chats`, vérifiez que l’auteur est **Ultroncn**, puis installez le module. Suivez l’invite de redémarrage de DSH, puis ouvrez **Settings → Archive Management** (en chinois **设置 → 归档管理**).

Vous pouvez aussi utiliser la ligne de commande. Remplacez le profil d’exemple `web` par celui de votre instance DSH en cours d’exécution. Utilisez le même profil pour les mises à jour et la désinstallation.

```sh
dsh plugin --profile web add dsh-archived-chats@latest
```

Si l’installation renvoie `ERR_PNPM_ADDING_TO_ROOT`, ajoutez `-w` après `add`.

```sh
dsh plugin --profile web add -w dsh-archived-chats@latest
```

Pour mettre à jour le module, exécutez la commande suivante.

```sh
dsh plugin --profile web update dsh-archived-chats
```

## Archiver et sauvegarder une conversation

1. Ouvrez **Unarchived**, cliquez sur le titre d’une conversation pour l’examiner, puis archivez celle que vous souhaitez conserver. Les nouvelles conversations vides sont exclues. Si une conversation est en cours, confirmez explicitement **Stop and archive**.
2. Recherchez la conversation sous **Archived**. Cliquez sur un titre ou un extrait correspondant à votre recherche, puis modifiez les étiquettes et les notes depuis l’aperçu.
3. Cliquez sur **Select**, cochez les conversations à sauvegarder, puis choisissez **Export selected**. Dans un panneau étroit, l’action se trouve dans le menu à trois points. Vérifiez que le fichier ZIP figure dans les téléchargements de votre navigateur.
4. Choisissez **Unarchive** pour reprendre une conversation. Avant de supprimer une conversation, décidez si vous souhaitez en conserver une sauvegarde. La suppression est définitive.

## Vues et fonctionnalités

| Vue | Fonctionnalités |
| --- | --- |
| **Archived** | Rechercher, filtrer, consulter un aperçu, modifier les étiquettes et les notes, importer, exporter, désarchiver et confirmer la suppression définitive. |
| **Unarchived** | Afficher les conversations par espace de travail ou sans groupe, rechercher dans la vue, consulter un aperçu, archiver et confirmer la suppression définitive. |
| **Origins & Branches** | Consulter les conversations sources, les branches et les sous-agents dans tous les espaces de travail et pour tous les statuts d’archivage. |
| **About** | Vérifier automatiquement les mises à jour, identifier l’hôte actif et les installations depuis une copie locale, copier les informations d’installation et appliquer les mises à jour prises en charge par l’hôte. |

La recherche dans le contenu commence à partir de deux caractères et parcourt le périmètre sélectionné par lots. Elle affiche la progression, les résultats et les erreurs, et peut être arrêtée puis relancée pour les conversations restantes. Chaque vue recherche dans sa propre liste et permet d’ouvrir l’aperçu à l’endroit du résultat. L’archivage groupé applique les mêmes exclusions de sessions masquées que la liste. Le [guide d’utilisation](docs/USER_GUIDE.md#archive-and-find-chats) détaille le périmètre de recherche et les limites pour les journaux volumineux.

## Archivage et suppression définitive

L’archivage et le désarchivage s’appuient sur les opérations officielles de l’hôte DSH. La suppression d’une conversation, d’une sélection ou de toutes les conversations d’un espace de travail demande une confirmation. La suppression globale de toutes les conversations archivées en demande également une. Les filtres et la recherche ne réduisent pas la portée des actions groupées à l’échelle d’un espace de travail ou de l’ensemble des espaces.

La suppression définitive concerne les répertoires de session propres aux conversations sélectionnées et à leurs sessions descendantes de sous-agents, ainsi que leurs enregistrements. Les répertoires et fichiers des projets, les pièces jointes partagées hors des répertoires de session et les sauvegardes indépendantes sont conservés. En cas d’échec, le module affiche une erreur, conserve l’état interne de l’opération inachevée et propose de la relancer. Les tâches de suppression déjà confirmées sont conservées lors des mises à jour. Les anciennes actions de récupération et de gestion des instantanés de protection ont été retirées. Une conversation sans répertoire de travail reste archivée tant qu’elle demeure inaccessible depuis la liste principale officielle. [Périmètre de la suppression et reprise en cas d’échec](docs/USER_GUIDE.md#permanent-deletion-and-retries)

## Sauvegardes et données locales

Un ZIP de sauvegarde contient le JSON, le Markdown, les étiquettes, les notes et les références aux pièces jointes. Conservez les fichiers joints séparément. Les sessions descendantes ne sont pas ajoutées automatiquement. Choisissez **Import backup** pour consulter un aperçu avant la restauration. L’import ignore les identifiants déjà présents.

Avant le téléchargement, le module vérifie que l’export respecte le même format et les mêmes limites de taille et de quantité que l’import. La notification indique que le téléchargement a démarré. Vérifiez dans les téléchargements du navigateur que le fichier a bien été enregistré.

Les données du module se trouvent dans `$DSH_HOME/plugin-data/archived-chats/`. La vérification automatique des mises à jour consulte les métadonnées publiques de npm et garde les conversations et les sauvegardes en local. L’installation d’une ancienne version peut rétablir ses règles de nettoyage. Avant de revenir à une version antérieure, sauvegardez toutes vos données et vérifiez les tâches en attente ainsi que la compatibilité des formats. [Données locales et désinstallation](docs/USER_GUIDE.md#local-data-and-uninstall)

## Compatibilité

La plage de versions DSH déclarée est `>=0.1.0-rc.7`. Les fonctionnalités disponibles dépendent de l’hôte actif. Les tests d’intégration natifs couvrent les backends officiels `0.1.7-rc.2`, `0.2.1-rc.2`, `0.2.1-rc.5`, `0.2.2-rc.1` et `0.2.2-rc.3`. L’intégration continue exécute cette matrice sous macOS, Windows et Linux.

L’archivage, le désarchivage et le recensement des conversations utilisent les fonctionnalités officielles de l’hôte. Pour la suppression définitive, le module coordonne le cycle de vie des sessions et leurs emplacements de stockage. [Compatibilité et limites](docs/USER_GUIDE.md#compatibility-and-limits)

## Captures d’écran

Les [captures du README en anglais](README.en.md#screenshots) montrent des conversations de démonstration dans un hôte DSH officiel isolé.

## Documentation et retours

[Guide d’utilisation](docs/USER_GUIDE.md) · [Architecture](docs/ARCHITECTURE.en.md) · [Journal des modifications](CHANGELOG.md) · [Assistance](SUPPORT.md) · [Contribuer](CONTRIBUTING.md)

Pour les questions et suggestions, utilisez [GitHub Discussions](https://github.com/Ultroncn/dsh-archived-chats/discussions). Dans un rapport de bogue, indiquez les versions du module et de DSH, les étapes minimales de reproduction et les messages d’erreur expurgés de toute donnée sensible. Signalez les problèmes de sécurité [en privé](SECURITY.md).

## Développement et validation

[![CI](https://img.shields.io/github/actions/workflow/status/Ultroncn/dsh-archived-chats/ci.yml?branch=main&style=flat&label=CI)](https://github.com/Ultroncn/dsh-archived-chats/actions/workflows/ci.yml) [![Node.js 18 | 24](https://img.shields.io/badge/Node.js-18%20%7C%2024-339933?style=flat&logo=nodedotjs&logoColor=white)](https://github.com/Ultroncn/dsh-archived-chats/actions/workflows/ci.yml)

Les commandes de test du module, d’intégration native et de vérification du paquet figurent à la section [Development and validation](README.en.md#development-and-validation). Les tests natifs emploient des données temporaires isolées. Les neuf cas doivent s’exécuter dans chaque environnement de test. Avant de contribuer, lisez le [guide de contribution](CONTRIBUTING.md) dans son intégralité.

## Désinstaller

```sh
dsh plugin --profile web remove dsh-archived-chats
```

La désinstallation du paquet conserve les données du module et les conversations. [Données locales et désinstallation](docs/USER_GUIDE.md#local-data-and-uninstall)

[Licence MIT](LICENSE)
