<p align="center">
  <img src="assets/brand/archive-management-banner.png" alt="Archive Management: local-first archived-chat center for DeepSeek Harness" width="100%">
</p>

<div align="center">

<h1>Archivverwaltung</h1>

<p><strong>Finde frühere DSH-Unterhaltungen, verwalte Archive und sichere sie als ZIP.</strong></p>
<p><code>dsh-archived-chats</code></p>

<p><a href="README.md">简体中文</a> · <a href="README.en.md">English</a> · <a href="README.ja.md">日本語</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <strong>Deutsch</strong> · <a href="README.ru.md">Русский</a> · <a href="README.pt-BR.md">Português (Brasil)</a></p>

<p><a href="CHANGELOG.md">Changelog</a> · <a href="LICENSE">MIT License</a></p>

<p>
  <a href="https://www.npmjs.com/package/dsh-archived-chats"><img alt="npm-Version" src="https://img.shields.io/npm/v/dsh-archived-chats?style=flat&amp;label=npm-Version"></a>
  <a href="#kompatibilit%C3%A4t"><img alt="DSH bis 0.2.2-rc.3" src="https://img.shields.io/badge/DSH-bis%200.2.2--rc.3-2563eb?style=flat"></a>
  <a href="https://www.npmjs.com/package/dsh-archived-chats"><img alt="npm-Downloads in den letzten 18 Monaten" title="npm-Downloads in den letzten 18 Monaten" src="https://img.shields.io/npm/d18m/dsh-archived-chats?style=flat&amp;label=npm-Downloads"></a>
  <a href="LICENSE"><img alt="Lizenz · MIT" src="https://img.shields.io/badge/Lizenz-MIT-2ea44f?style=flat"></a>
  <a href="https://dsh-insights.com/p/Ultroncn/dsh-archived-chats/"><img alt="DSH Insights" src="https://dsh-insights.com/badge/Ultroncn/dsh-archived-chats.svg"></a>
</p>

<p><a href="https://awesome-dsh-plugin.com/p/Ultroncn/dsh-archived-chats/">Plugin market</a> · <a href="https://www.npmjs.com/package/dsh-archived-chats">npm</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/releases">Releases</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/discussions">Discussions</a> · <a href="https://github.com/Ultroncn/dsh-archived-chats/security/advisories/new">Private security report</a></p>

</div>

> Dieses DeepSeek-Harness-Plugin wird von der Community gepflegt und ist kein offizielles Produkt von DeepSeek AI.

Mit der Archivverwaltung können Sie Unterhaltungen in DeepSeek Harness durchsuchen, organisieren und sichern. Finden Sie frühere Lösungen samt Gesprächskontext, archivieren Sie Chats nach Arbeitsbereich oder sichern Sie sie vor dem Löschen als ZIP-Datei.

- **Inhaltssuche.** Durchsuchen Sie Titel, Nachrichten und Tool-Ergebnisse in den archivierten oder nicht archivierten Chats. Im Archiv können Sie zusätzlich nach Tags und Notizen suchen. Treffer zeigen den passenden Gesprächsabschnitt im Kontext und führen direkt zur Fundstelle.
- **Chats organisieren.** Verwalten Sie archivierte und nicht archivierte Chats nach Arbeitsbereich, einschließlich Chats ohne Zuordnung. Nutzen Sie Sammelaktionen sowie Tags und Notizen.
- **ZIP-Sicherungen.** Exportieren und importieren Sie Chats als ZIP mit JSON und Markdown. Vor dem Import sehen Sie eine Vorschau. Bereits vorhandene IDs werden übersprungen, damit bestehende Einträge erhalten bleiben.
- **Herkunft und Verzweigungen.** Die schreibgeschützte Ansicht **Origins & Branches** zeigt Quellchats, Abzweigungen und Subagenten über alle Arbeitsbereiche und Archivstatus hinweg.

> Diese Anleitung beschreibt Version 2.0.5. Die früheren Wiederherstellungsfunktionen wurden entfernt. Fehlgeschlagene Aufgaben zum endgültigen Löschen lassen sich gezielt wiederholen.

## Installieren und öffnen

Suchen Sie im DSH-Plugin-Marktplatz nach `dsh-archived-chats`, prüfen Sie, ob **Ultroncn** als Autor angegeben ist, und installieren Sie das Plugin. Folgen Sie der Neustartaufforderung von DSH und öffnen Sie anschließend **Settings → Archive Management** (auf Chinesisch **设置 → 归档管理**).

Alternativ können Sie die CLI verwenden. Ersetzen Sie das Beispielprofil `web` durch das Profil Ihrer laufenden DSH-Instanz. Verwenden Sie dasselbe Profil für Updates und die Deinstallation.

```sh
dsh plugin --profile web add dsh-archived-chats@latest
```

Falls die Installation `ERR_PNPM_ADDING_TO_ROOT` meldet, fügen Sie `-w` nach `add` ein.

```sh
dsh plugin --profile web add -w dsh-archived-chats@latest
```

Mit diesem Befehl aktualisieren Sie das Plugin.

```sh
dsh plugin --profile web update dsh-archived-chats
```

## Einen Chat archivieren und sichern

1. Öffnen Sie **Unarchived**, klicken Sie auf einen Chattitel und prüfen Sie die Vorschau. Archivieren Sie den Chat, den Sie behalten möchten. Leere neue Chats werden ausgeblendet. Bei laufenden Chats müssen Sie **Stop and archive** ausdrücklich bestätigen.
2. Suchen Sie unter **Archived** nach dem Chat. Öffnen Sie einen Titel oder einen Texttreffer und bearbeiten Sie Tags und Notizen in der Vorschau.
3. Klicken Sie auf **Select**, markieren Sie die gewünschten Chats und wählen Sie **Export selected**. Bei schmalen Ansichten finden Sie die Aktion im Drei-Punkte-Menü. Prüfen Sie in der Downloadliste des Browsers, ob die ZIP-Datei gespeichert wurde.
4. Wählen Sie **Unarchive**, um einen Chat fortzusetzen. Entscheiden Sie vor dem Löschen, ob Sie eine Sicherung behalten möchten. Die Löschung ist endgültig.

## Ansichten und Funktionen

| Ansicht | Funktionen |
| --- | --- |
| **Archived** | Suchen, filtern, Vorschau öffnen, Tags und Notizen bearbeiten, importieren, exportieren, aus dem Archiv zurückholen und nach Bestätigung endgültig löschen. |
| **Unarchived** | Chats nach Arbeitsbereich und ohne Zuordnung anzeigen, in der Ansicht suchen, Vorschau öffnen, archivieren und nach Bestätigung endgültig löschen. |
| **Origins & Branches** | Quellchats, Abzweigungen und Subagenten unabhängig von Arbeitsbereich und Archivstatus ansehen. |
| **About** | Automatisch nach Updates suchen, aktiven Host und lokale Installationen aus einem Checkout erkennen, Installationsdetails kopieren und vom Host unterstützte Updates ausführen. |

Die Inhaltssuche beginnt ab zwei Zeichen und durchsucht den gewählten Bereich in mehreren Durchgängen. Sie zeigt Fortschritt, Treffer und Fehler und lässt sich anhalten oder für verbleibende Chats wiederholen. Beide Chatansichten durchsuchen jeweils ihre eigenen Chats und öffnen die Vorschau direkt an der Fundstelle. Beim Sammelarchivieren gelten dieselben Ausschlüsse für ausgeblendete Sitzungen wie in der Liste. Details zum Suchbereich und zu den Grenzen bei langen Protokollen stehen im [Benutzerhandbuch](docs/USER_GUIDE.md#archive-and-find-chats).

## Archivieren und endgültig löschen

Beim Archivieren und Wiederöffnen nutzt das Plugin die offiziellen Funktionen des DSH-Hosts. Das Löschen eines einzelnen Chats, einer Auswahl oder aller Chats eines Arbeitsbereichs erfordert eine Bestätigung. Das globale Löschen aller archivierten Chats erfordert ebenfalls eine Bestätigung. Suchbegriffe und Filter schränken Sammelaktionen für einen ganzen Arbeitsbereich oder über alle Arbeitsbereiche hinweg nicht ein.

Die endgültige Löschung erfasst die ausschließlich zugehörigen Sitzungsverzeichnisse und Datensätze der ausgewählten Chats sowie der zugehörigen Sitzungen von Subagenten und deren Nachfolgesitzungen. Projektverzeichnisse und Projektdateien, gemeinsam genutzte Anhänge außerhalb der Sitzungsverzeichnisse und unabhängige Sicherungen bleiben erhalten. Schlägt die Löschung fehl, zeigt das Plugin einen Fehler, behält den internen Status des unvollständigen Vorgangs und bietet eine Wiederholung an. Bereits bestätigte Löschaufgaben bleiben bei Updates erhalten. Die früheren Wiederherstellungs- und Schutzsnapshot-Aktionen wurden entfernt. Ein Chat ohne Arbeitsverzeichnis bleibt im Archiv, bis er wieder über die offizielle Hauptliste erreichbar ist. [Löschumfang und Wiederholungsversuche](docs/USER_GUIDE.md#permanent-deletion-and-retries)

## Sicherungen und lokale Daten

Eine Sicherungs-ZIP enthält JSON, Markdown, Tags, Notizen und Verweise auf Anhänge. Sichern Sie die Anhangsdateien separat. Nachfolgesitzungen werden nicht automatisch mit exportiert. Öffnen Sie mit **Import backup** die Vorschau, bevor Sie die Chats wiederherstellen. Der Import überspringt vorhandene IDs.

Vor dem Download prüft der Export dasselbe Format und dieselben Größen- und Mengenlimits wie der Import. Die Meldung über den gestarteten Download bestätigt nur dessen Beginn. Prüfen Sie in der Downloadliste, ob der Browser die Datei gespeichert hat.

Die Plugin-Daten liegen unter `$DSH_HOME/plugin-data/archived-chats/`. Die automatische Update-Prüfung ruft öffentliche npm-Metadaten ab. Chats und Sicherungen werden dabei nicht übertragen. Eine ältere Plugin-Version kann frühere Bereinigungsregeln wieder aktivieren. Legen Sie vor einem Downgrade eine vollständige Datensicherung an und prüfen Sie ausstehende Aufgaben und die Formatkompatibilität. [Lokale Daten und Deinstallation](docs/USER_GUIDE.md#local-data-and-uninstall)

## Kompatibilität

Der deklarierte DSH-Versionsbereich lautet `>=0.1.0-rc.7 || 0.2.2-rc.1 || 0.2.2-rc.2 || 0.2.2-rc.3`. Welche Funktionen verfügbar sind, hängt vom aktiven Host ab. Native Integrationstests decken die offiziellen Backends `0.1.7-rc.2`, `0.2.1-rc.2`, `0.2.1-rc.5`, `0.2.2-rc.1` und `0.2.2-rc.3` ab. Die CI prüft diese Host-Matrix unter macOS, Windows und Linux.

Die Chatliste sowie das Archivieren und Wiederöffnen von Chats nutzen offizielle Host-Funktionen. Für die endgültige Löschung koordiniert das Plugin den Lebenszyklus der Host-Sitzungen und die zugehörigen Speicherorte. [Kompatibilität und Einschränkungen](docs/USER_GUIDE.md#compatibility-and-limits)

## Screenshots

Die [Screenshots im englischen README](README.en.md#screenshots) zeigen Beispielunterhaltungen in einem isolierten offiziellen DSH-Host.

## Dokumentation und Feedback

[Benutzerhandbuch](docs/USER_GUIDE.md) · [Architektur](docs/ARCHITECTURE.en.md) · [Änderungsprotokoll](CHANGELOG.md) · [Support](SUPPORT.md) · [Mitwirken](CONTRIBUTING.md)

Fragen und Vorschläge sind in den [GitHub Discussions](https://github.com/Ultroncn/dsh-archived-chats/discussions) willkommen. Geben Sie bei Fehlerberichten die Plugin- und DSH-Version, die kürzesten Schritte zur Reproduktion und Fehlermeldungen mit geschwärzten vertraulichen Daten an. Melden Sie Sicherheitsprobleme [vertraulich](SECURITY.md).

## Entwicklung und Tests

[![CI](https://img.shields.io/github/actions/workflow/status/Ultroncn/dsh-archived-chats/ci.yml?branch=main&style=flat&label=CI)](https://github.com/Ultroncn/dsh-archived-chats/actions/workflows/ci.yml) [![Node.js 18 | 24](https://img.shields.io/badge/Node.js-18%20%7C%2024-339933?style=flat&logo=nodedotjs&logoColor=white)](https://github.com/Ultroncn/dsh-archived-chats/actions/workflows/ci.yml)

Die Befehle für die Modultests, die nativen Host-Integrationstests und die Paketprüfung stehen unter [Development and validation](README.en.md#development-and-validation). Die nativen Tests verwenden isolierte temporäre Daten. In jeder Testumgebung müssen alle neun Fälle ohne Überspringen durchlaufen. Lesen Sie vor einem Beitrag den vollständigen [Leitfaden für Mitwirkende](CONTRIBUTING.md).

## Deinstallieren

```sh
dsh plugin --profile web remove dsh-archived-chats
```

Beim Entfernen des Pakets bleiben Plugin-Daten und Chats erhalten. [Lokale Daten und Deinstallation](docs/USER_GUIDE.md#local-data-and-uninstall)

[MIT-Lizenz](LICENSE)
