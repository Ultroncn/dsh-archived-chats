# Archive Management user guide

Current source removes the previous recovery UI and keeps explicit permanent-deletion retries.

English · [简体中文](USER_GUIDE.zh-CN.md) · [Back to README](../README.md)

Archive Management provides a place to browse and manage DSH's archived chats, plus workspace bulk archiving. This document describes version 2.0.0, with native integration coverage for DSH `0.1.7-rc.2`, `0.2.1-rc.2`, `0.2.1-rc.5` and `0.2.2-rc.1`. See the [changelog](../CHANGELOG.md) for release history. For interfaces and data formats, see the [architecture](ARCHITECTURE.en.md).

Archive Management prefers the Host’s public Modal, Button, Input, menu, Tooltip, and icon components. Search fields follow the built-in plugin inventory’s 36px height, search icon, and focus styles. Ordinary text fields use the public Input. Confirmations use the official heading, description, and action areas. Complex preview and import content use the official modal frame. Older Hosts without these exports use compatible controls. Page headings, descriptions, secondary list text, and focus states follow the official settings typography and theme variables.

## Chat states and legacy data

| Location | Purpose | Return to the main chat area |
| --- | --- | --- |
| Main chat area | Continue everyday conversations | Already there |
| Archived | Keep chats outside the main chat area | Choose Unarchive |

## Install and open

Search for `dsh-archived-chats` in DSH's plugin market, verify the author is **Ultronen**, and choose **Install**. After installation, follow the host's restart instructions. The settings entry is **归档管理** in Chinese; in English it is **Archive Management**.

Alternatively, run this command on the computer running DSH. `web` is an example profile; replace it with the profile that actually runs your DSH instance. Use that same profile for updates and removal:

```sh
dsh plugin --profile web add dsh-archived-chats@latest
```

If installation reports `ERR_PNPM_ADDING_TO_ROOT`, the profile is a pnpm workspace root. Retry with `-w` (using your actual profile):

```sh
dsh plugin --profile web add -w dsh-archived-chats@latest
```

If the settings entry is missing, verify that the plugin is installed and enabled in the profile actually running DSH, reload the host, and check the [compatibility requirements](#compatibility-and-limits).

Before updating an older installation, read “Upgrades” below, for local-data considerations.

## First task: find and back up a chat

1. Open **Archived** and search for a keyword you remember. If the list is empty, archive a completed chat from DSH’s normal session menu first.
2. Click the chat title to preview the conversation, confirm its content, and close the preview.
3. Click **Select**, check the chats to keep, then choose **Export selected** (under **More** in narrow panels). Review the selected count and confirm.
4. Check your browser’s downloads to confirm the ZIP was saved. Keep attachment files separately; the ZIP does not include them.

See [search scope](#archive-and-find-chats) and [export and import](#export-and-import) for limits and restoring a backup.

## Archive and find chats

Use DSH's normal session menu to archive one chat. The Host owns its success notice and Undo action; the plugin adds no second notice and does not replace the official archive method. The plugin groups archived chats by workspace.

The **All workspaces** menu in both lists shows folder icons and includes **Ungrouped** and **Automation tasks**. Ungrouped follows official workspace membership, rather than titles or stale directories. Automation tasks matches session bindings returned by the official `schedule.catalog()`, including retained active and ended tasks. Deleted tasks stop matching; this is not a permanent historical session type. If the Host has no schedule service or its catalog cannot be read, the option is disabled with an explanation while ordinary chats remain available.

Archived and Unarchived use a two-row toolbar: full-width search above the filters. Origins & Branches puts full-width search above a shared row for workspace and status filtering, chat count and expand/collapse all, wrapping as needed on narrow screens.

Archived and Unarchived default to **Recently updated**, matching the Host sidebar: the later of creation time and the last user prompt. **Least recently updated** reverses that order; title sorting is also available. Assistant output and tag/note edits do not affect recency. When the Host has no corresponding time metadata, sorting falls back to creation time. The date shown on each chat remains its creation time.

In **Unarchived**, search occupies the first row. The first filter below it matches Archived, with Type and Sort sections. Choose all, regular, or subagent chats. Each tab retains its own type selection, which also limits content-search candidates. Workspace filtering sits alongside it. The **Refresh** text button at the top right reloads the list, beside **Archive all**. Workspace groups and chat rows use the same layout as Archived.

- Click the chat title for a read-only preview, or **Archive** on an individual chat.
- The workspace three-dot menu offers **Archive all** for that workspace.
- The header **Archive all** covers every workspace in the list.

The Unarchived workspace menu offers Delete all. Confirmation covers the workspace’s complete unarchived list, including chats hidden by search. Each deletion rechecks identity, workspace membership and running state, with successes and failures reported separately.

Search and workspace filters only change display; they do not narrow workspace or global archiving. An idle individual chat archives directly after eligibility checks, without confirmation. Archive Management stays open when archiving the chat currently shown on the homepage and displays the confirmed success notice. Explicit user dismissal still closes Settings. Global and workspace bulk actions still confirm their scope, without counts. Existing chats across all registered workspaces and Ungrouped are listed. Already archived, pending-deletion and subagent chats are excluded from both this list and bulk archiving, with eligibility checked again during execution; verified empty drafts are omitted, while unreadable chats remain visible but cannot be archived yet. Running chats can be archived after an explicit Stop and archive confirmation using the official Host operation. Bulk actions also explain when ongoing work will stop. Blank or unverifiable chats cannot be archived. New chats after preparation are excluded; newly running chats without prior stop consent, or chats moved to another workspace, are skipped. Unarchived offers read-only previews, archiving, individual deletion and workspace Delete all, without selection, export, or a cleanup entry. Archiving preserves workspace directories and prior tags and notes. Unarchive uses the official operation, and official workspace and session subscriptions synchronize both lists after changes from the homepage or another tab, including renames. Background refreshes retain existing Unarchived rows; initial loading displays “Loading chats…”. Older hosts without official stop or unarchive support report an error instead of simulating it by rewriting state.

After confirming an archive, full success closes the dialog and uses the Host's native Toast to show the actual archived count with a **View Archived** action. Older Hosts without that component keep the result dialog open. If any chats are skipped or fail, the detailed results stay open without a full-success notice.

Both Archived and Unarchived search titles, session IDs, workspaces, tags, notes, messages, and tool results. Each tab searches only its own list: Archived searches archived chats, and Unarchived searches unarchived chats. Results and management actions stay within that tab. Running chats are read afresh on each scan or preview; search is not continuously updated while text streams. Filter by type, workspace, and tag; sort by time or title. Content matches show excerpts. Long workspace titles wrap to remain fully visible. Click a workspace heading row to expand or collapse its chats. A folder appears at rest; hover highlights the whole row and replaces the folder with a filled triangle indicating its expanded state. Moving the pointer away restores the folder; the row background stays highlighted only while its menu is open. Group collapse state is saved in the browser.

Content search starts when the trimmed query contains at least two Unicode characters. Workspace, type, and tag filters determine the candidates before requests begin. The client searches 20 candidates per batch; the API accepts at most 100 explicit candidate IDs per request. Results appear progressively, with separate counts for processed candidates/total, body-matched chats, displayed chats, and failed chats. Displayed chats combine metadata and body matches without counting a chat twice; these counts describe chats, not snippets. A completed scan covers the selected candidates within the projection limits; it has no 100-match total cap. Each matching chat shows up to three snippets. Shorter queries still match titles, workspaces, tags, and notes locally. These search rules apply to both lists.

Stop search keeps the results already found. Retry unfinished retries unreadable and unprocessed candidates without duplicating successful hits. Read failures expose the affected IDs and reasons; a network error stops later batches and preserves earlier results. A removed or newly hidden candidate is reported as skipped, never replaced with a broader search. Changing the query, filters, session list, or page cancels the old scan and discards late responses.

Search and preview use bounded projections, not an unlimited raw-log index: at most 10,000 projected messages, 1,000 segments per message, 256 Ki Unicode code points per segment, and 1 Mi code points per message. Long logs or blocks can therefore contain text outside the searchable projection. No hit does not prove the original log contains no matching text.

## Preview, tags, and notes

Read-only preview does not require unarchiving. It supports Markdown, reasoning, code, JSON, tool calls and results, and readable stored images. Missing attachment-read capabilities degrade images only. Closing preview cancels outstanding requests.

Fully loaded turns with a recorded end group intermediate work into a process disclosure, initially collapsed. Its summary shows Thought or recorded tool/message/subagent counts. Expand it to inspect nested reasoning, context provenance, and tool summaries with arguments and results; these details also start collapsed. The final response remains outside the process disclosure. Partial turns or logs without reliable turn boundaries stay expanded in event order instead of being folded into a complete turn.

System prompts start collapsed and scroll within a height-limited area when expanded. On resume or a new request series, the preview shows the recorded effective prompt without inferring missing instructions. Only real user messages appear on the right; assistant work, reasoning, tools, and injected context stay on the left. The preview has no message input. It uses the Host's Markdown renderer when available, but does not promise every native conversation feature or information absent from the log; it does not invent usage or elapsed-time values.

After updating, reload the DSH backend to activate the new preview projection. Refreshing the browser alone does not replace the running backend.

Use the Edit tags and note icon in the preview header to edit metadata. Each chat supports up to 8 tags of 24 Unicode characters each and a note of up to 2,000 Unicode characters. Tag matching is case-insensitive. Notes occupy one line; truncated notes expose their full text on hover or focus.

Tags and notes remain local. Unarchiving preserves them; completed permanent deletion removes them.

## Actions and their scope

| Page and entry | Actions | Scope |
| --- | --- | --- |
| Archived: chat row | Trash icon (permanent deletion), then Unarchive; click the title to preview, with an Edit tags and note icon directly in the preview header | One chat |
| Archived: workspace More menu | This workspace: Unarchive all, Export all; separator; Delete all | All archived chats in that workspace |
| Unarchived: chat row | Click title to preview, Archive, permanent deletion | One chat; archives directly, with stop confirmation for active work |
| Unarchived: workspace three-dot menu | This workspace: Archive all, Delete all | Archive covers eligible chats; deletion covers all unarchived chats in that workspace and associated subagents |
| Unarchived: header | Archive all | Eligible chats across all workspaces |
| Archived: header | Select, three-dot More | Enter selection mode or open the global action menu |
| Archived: selection mode | Select all, Unarchive, Export selected, trash icon (permanent deletion), Cancel | Checked chats only; Select all covers current results |
| Archived: header More menu | Import backup, Export all, Unarchive all; separator; Delete all | Export, unarchive, and delete cover archived chats across all workspaces; Import uses the selected ZIP |

**Selection mode supports one or many chats.** Select shows checkboxes and an action bar; inline action buttons disappear, while the title still opens preview. Unarchive, Export selected, the trash icon (permanent deletion), and Cancel appear directly in that order. In narrow panels, Export selected moves into the three-dot More menu. With no selection, actions are disabled while Cancel remains available. Select all checks current search/filter results and shows an indeterminate state for partial selection. Hidden selections remain checked with a visible count; clearing current results preserves them. Cancel or leaving Archived clears the selection and exits. Actions confirm the selected count, and failed items stay checked. Ordinary rows show only the trash icon (permanent deletion) and Unarchive; click the title to preview, then use the Edit tags and note icon in its header; Unarchived provides read-only previews and archiving. Search and filters do not narrow workspace or global bulk actions.

## Permanent deletion and retries

Deletion requires explicit confirmation and is irreversible after completion. Archived and Unarchived share one deletion policy. Selected chats and their transitive subagent descendants are deleted. Independent forks are preserved. Row, workspace, and global confirmations show selected chats, additional subagents, and the total. Confirmation stays disabled until scope loading completes.

**Data covered by deletion**

- Each target's verified exclusive session directory is removed, including its logs and files within that directory. Corresponding workspace membership, archive records, Host session indexes, plugin tags, notes, and provenance records are also cleared.
- Transitive subagent descendants are included through recorded parent relationships, even across workspace or archive-state boundaries. Ordinary forks are included only when selected themselves.
- Workspace directories, project code, Git repositories and worktrees, global shared attachments and caches outside session directories, exported ZIPs, and other independent backups are retained. Files inside a target session directory are removed with that directory.

To keep content, export the target chats and any subagents you need before deletion. Archive unarchived chats first to make them available for export. Plugin ZIPs exclude attachment binaries and do not automatically include descendant chats. Back up attachments separately.

Every target must be idle. Execution rechecks identities, archive state, workspace membership, and scope. Changed scope requires fresh confirmation. Retries preserve the stored identities and confirmed scope. Historical selected-only tasks retain their original scope.

Deletion failures show an error with Retry, which resumes the confirmed scope. Reopening or refreshing Archive Management also restores the retry prompt for incomplete deletions. Retrying requires a click. The interface has four tabs, Archived, Unarchived, Origins & Branches, and About.

Tasks are stored in `plugin-data/archived-chats/deletion-tasks.json`. Upgrades carry forward committed pending deletions. Previous recovery records and protection snapshots remain on disk without active UI actions.

## Export and import

Each ZIP contains:

```text
manifest.json
sessions/001-<safe-title>-<id>/session.json
sessions/001-<safe-title>-<id>/transcript.md
```

JSON is the machine-readable record and Markdown is the readable companion. Modern Hosts export ZIP v2, retaining each fork's exact inherited boundary; legacy readers produce v1. Both preserve attachment references but **do not include attachment bytes or automatically bundle descendant sessions**. This is not an attachment-complete backup. Consult Harness's official Session log export for conversation-tree export capabilities.

Before returning a download stream, export reads each selected source once, stages its rendered manifest/session/Markdown entries, and applies the same complete format and semantic validation as import. A successful plugin export is therefore within the plugin importer's format and size budgets. If any selected source is invalid or over budget, the whole export is refused before a successful download response; it does not emit a partial backup.

The shared package limits are 2,000 sessions and 4,001 entries; 4 MiB each for `manifest.json` and each session JSON; 8 MiB for any ZIP entry and for each Markdown transcript; and 256 MiB total expanded content. Imported ZIP input is capped at 512 MiB compressed. Every JSON document is additionally limited to depth 64, 100,000 nodes, and 4 Mi Unicode code points across its strings. JavaScript string storage can use more memory than the encoded byte totals.

Import accepts this plugin's v1 and v2 ZIP formats and previews before writing:

After importing, chats return to Archived with their original IDs, titles, events, and tags/notes. Preview them there, then choose Unarchive to return them to the main chat list. Modern-Host import explicitly flushes writes and releases ownership. If a failed write leaves artifacts whose ownership cannot be proven, the plugin reports incomplete rollback and preserves them: keep the ZIP and resolve the error before retrying; do not delete a conflicting chat merely to clear the warning.

Import requires a complete, internally consistent ZIP and rejects truncation, CRC or local/central-directory disagreement, invalid UTF-8, unsafe paths or JSON keys, duplicate/unreferenced entries, encryption, ZIP64, multi-disk archives, and compression methods other than Store or Deflate. A normal v1 backup remains supported, but a seeded v1 source without an exact inherited boundary is refused instead of flattened.

The browser buffers and validates the complete ZIP before initiating its download. The response-byte cap is 320 MiB and the complete fetch/body-read timeout is five minutes; this is not a peak-heap guarantee, and the current non-stream fallback has no stronger universal WebView memory promise. Download started does not mean the browser has saved the file to disk. A timeout or cap failure downloads no incomplete file and can be retried.

Export compresses the staged entries in 256 KiB slices and yields to the event loop between them, so a large backup does not freeze the rest of the Host while it is written. When a download is cancelled, the archive stops and the response fails; a cancelled export is never reported as a completed one.

The Unarchived trash button starts permanent deletion. Confirmation names the chat, counts associated subagents, and explains that deletion cannot be undone. Stop running targets through the official UI first. The Host rechecks archive state, identity, workspace, and confirmed scope through the shared deletion flow. Failures offer Retry in the error feedback.

## Origins and Branches

The scope explanation is behind the help icon beside the chat count. Hover, keyboard focus, or a touch tap reveals it.

Chats appear in compact lists grouped by their actual workspace, with counts and browser-persisted workspace folding. Each row shows its title, archive state, direct source, branch count, creation time and compact session ID, with an action to copy the full ID. Ungrouped chats have their own group. Each chat is listed once; source references are not counted again.

Workspace order follows the main sidebar. Chats within each group default to most recently updated first and follow the sidebar's saved order when manual sorting is enabled. Historical records without an update timestamp use their creation time.

Chat lineage opens the Conversation lineage graph dialog containing that chat's complete relationship family, including ancestors, sibling branches and descendants across workspaces. The selected chat is located and highlighted. List search, workspace and status filters do not trim the dialog's family. Independent chats have no graph action. Inherited history without a recorded parent is labeled Source chat not recorded; this does not mean the transcript is missing, and title previews remain available.

Graph cards directly show title, state, workspace, source, creation time and Copy ID; all branches remain visible without node folding. Solid curves connect forks and dashed curves connect subagents. Drag the background to pan freely. The wheel pans, and Ctrl/Command + wheel zooms around the pointer. Zoom and Fit controls float at the bottom right; node and relationship counts appear at the bottom left. Fit scales and centers the complete graph within the available space, with an outer margin and a maximum zoom of 200%. Escape or the top-right close icon closes the graph while retaining list search, filters, workspace folds and scroll position.

The search placeholder names chat titles, workspaces and IDs. Search occupies the first row; workspace and status filtering, count, scope help and Expand/Collapse all share the second. Search temporarily opens matching workspaces; clearing it restores their fold state. Bulk folding applies only to workspaces in the current results. Search distinguishes direct matches and related branches; retained source context does not imply a direct match.

Titles in both lists and graphs open read-only previews. Clicking a graph card background highlights its source path; Copy ID is independent. Closing preview retains graph zoom and scroll position. Unavailable sources have no preview action. Unknown metadata is not inferred to mean an original or deleted chat.

For the verified modern `sessionController.fork` entry point, successful v4 ordinary forks missing a parent ID receive a plugin-owned source record. Records bind parent/child IDs to creation timestamps and persist in `$DSH_HOME/plugin-data/archived-chats/fork-provenance.json`. They survive restarts; permanent deletion removes the deleted chat’s own record. Recording failures or an unreadable catalog show a warning. Coverage is limited to new forks passing through this entry point. Earlier missing sources, other creation paths, and the current ZIP backup format are outside this coverage.

Relationships use the Host's `parentSession`, `isSeeded` and subagent metadata. Exact v4 inherited-event counts are not header metadata and are not guessed here; older seed lengths are kept only for compatibility. This view never mutates relationships or duplicates archive management actions. If deletion-task metadata is unavailable, official chats and archive states remain visible with a warning. The Host-wide relationship inventory has a 5,000-node limit and reports an error rather than silently truncating larger inventories.

## About and updates

About groups product information and links with version and update controls. It shows the current version, author, license, project homepage, user guide, changelog, issue tracker, and plugin marketplace.

From 1.4.1, a red dot appears on the About tab only when a newer version is confirmed. Unchecked, failed, and up-to-date checks show no dot. Visiting About does not dismiss an available update.

The official sidebar archive-success notice adds a View button that opens Archive Management → Archived and refreshes the list.

About shows the running plugin version, author, license, and direct links to the project, language-appropriate guide, changelog, issue feedback, and plugin market. The title also displays the running version.

Current version is read dynamically from the running backend, never substituted with the registry's latest version. A failed online check keeps the loaded version, identity, and links. Local metadata failure shows Unavailable and Reload information rather than an update-check error. If newly installed endpoints have not loaded yet, reload the DSH backend and retry.

Opening Archive Management loads local metadata, then automatically checks public npm metadata. While the page stays open, cache-aware checks run every 15 minutes and on visibility/network recovery. Success is cached for 12 hours and failure for 15 minutes; manual checks have a 30-second cooldown and concurrent requests coalesce. No chats or backups are sent. Failure never blocks chat management or claims the plugin is current. Leaving the page removes timers and listeners.

When diagnosing an unchanged version after an update, also verify that you updated the profile actually running DSH.

Check for updates and View update beside the heading open a dialog with the running version, public release, last check and current host. Copy the package spec into Add plugin in another host. A terminal command is offered only when the current launcher and profile can be verified; official Desktop uses its own bundled command, never an unrelated dsh on PATH. This detects the current host only, not other Desktop installations.

Local link:/file: installations are labeled Local checkout, offer Copy local path and are protected on the backend against registry replacement. Registry installations offer Install update when supported. The official updateBundle API is preferred, letting the Host check version compatibility, replace the plugin and attempt to restore the previous version if installation fails. Settings may close during replacement. Reopen Archive Management afterward to verify its running version. Results distinguish Host-applied updates from required restarts and report whether restoration was verified. Older Hosts use the official installation API only where replacement is supported, otherwise directing users to the Versions section on the official Plugins page. Duplicate submissions are blocked. Restarting DSH remains a user action.

## Upgrades

Upgrades preserve archives, tags, notes, and pending permanent-deletion tasks. Previous recovery records and protection snapshots remain on disk without the previous recovery actions. Host compatibility follows the package declaration and native integration coverage.

## Compatibility and limits

- **Settings closes unexpectedly (known Host issue):** On DSH `0.2.1-rc.2`, archiving the current chat while initial setup is incomplete can trigger onboarding and close Settings. Reported upstream in [#10596](https://github.com/deepseek-ai/deepseek-harness/discussions/10596). This does not by itself mean archiving failed; reopen Settings to check. Plugin 1.6.0 does not include a Host fix.

Features depend on public Host capabilities, not just a version number:

The declared DSH `>=0.1.0-rc.7 || 0.2.2-rc.1` range remains capability-based. Release automation tests Node.js 18 on Ubuntu and Node.js 24 on Ubuntu, macOS, and Windows; the Node.js 24 matrix requires all four pinned official Host backends, `@deepseek-ai/dsh-session@0.1.7-rc.2`, `0.2.1-rc.2`, `0.2.1-rc.5` and `0.2.2-rc.1` (nine integration cases each) and package checks, including the v4 session format.

## Local data and uninstall

Plugin state lives under:

```text
$DSH_HOME/plugin-data/archived-chats/
```

| File | Purpose |
| --- | --- |
| `metadata.json` | Tags and notes |
| `pending-deletions.json` (legacy) | Migration input for old deletion markers |
| `deletion-tasks.json` | Pending permanent-deletion tasks |

The plugin does not upload, cloud-sync, or schedule historical captures. To uninstall:

```sh
dsh plugin --profile web remove dsh-archived-chats
```
