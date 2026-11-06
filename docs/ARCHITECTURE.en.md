# Architecture and maintainer notes

English · [中文](ARCHITECTURE.md) · [User guide](USER_GUIDE.md)

This document describes the interfaces and behavior of version 1.7.0. Native integration tests cover DSH `0.1.7-rc.2`, `0.2.1-rc.2`, `0.2.1-rc.5` and `0.2.2-rc.1`. See the [changelog](../CHANGELOG.md) for release history. Runtime code is the authority for interfaces and behavior; user-facing documentation should agree with it.

The client capability-detects public UI primitives. `HostModal` uses the official headless Modal for complex business content. Ordinary `ConfirmDialog` uses its heading, description and footer. `ControlButton` and `ControlInput` forward refs, disabled state and editing events. Older Hosts retain HTML fallbacks. Native controls use separate styling classes so legacy button CSS cannot override their sizing, colors or hover states. Menus retain filter placement and scrolling constraints; preview content stays within the outer modal bounds. Native modals own focus layering, with document-level legacy traps registered only in compatibility mode. Plugin-owned portals belong to the archive interaction so clicks inside a dialog cannot prematurely release settings protection.

## Product boundary and modules

The plugin supplements archive management; it does not replace DSH's main chat area. The browser accesses data only through Host routes. The Host persistence provider owns session files.

| Module (under `lib/`) | Responsibility |
| --- | --- |
| `index.js` | Host capability resolution, routes, archive visibility, lifecycle queue, physical deletion |
| `client.js` | Settings page, four main views, dialogs, native archive notice, request state |
| `about.js` | Local plugin identity, bounded public version checks, in-memory cache |
| `persistence-compat.js` | Legacy inspect and modern read-handle adaptation; separate title reads |
| `workspace-bulk-archive.js` | Eligible workspace chats, short-lived confirmation, apply-time checks |
| `export.js`, `import.js`, `restore.js` | ZIP export, bounded import validation, transactional restoration |
| `metadata.js`, `durable.js` | Tags/notes, serialized atomic writes, durability primitives |
| `search.js`, `stats.js` | Message projection/search and directory measurements |
| `lineage.js` | Read-only source, fork, and subagent projection |
| `fork-provenance.js` | Local ordinary-fork source records and reversible official-entry adapter |
| `session-graph.js` | Session-id normalization, subagent descendant resolution |

## Host routes

```text
GET  /plugins/dsh-archived-chats/about
POST /plugins/dsh-archived-chats/about/check-updates
POST /plugins/dsh-archived-chats/about/install-update
GET  /plugins/dsh-archived-chats/state
GET  /plugins/dsh-archived-chats/stats
GET  /plugins/dsh-archived-chats/lineage
POST /plugins/dsh-archived-chats/unarchived/delete
GET  /plugins/dsh-archived-chats/workspace-archive/workspaces
POST /plugins/dsh-archived-chats/workspace-archive/preview
POST /plugins/dsh-archived-chats/workspace-archive/apply
POST /plugins/dsh-archived-chats/preview
POST /plugins/dsh-archived-chats/preview/image
POST /plugins/dsh-archived-chats/search
POST /plugins/dsh-archived-chats/export
POST /plugins/dsh-archived-chats/import/inspect
POST /plugins/dsh-archived-chats/import/restore
POST /plugins/dsh-archived-chats/metadata
GET  /plugins/dsh-archived-chats/deletion-tasks
POST /plugins/dsh-archived-chats/deletion-tasks/retry
POST /plugins/dsh-archived-chats/deletion/preview
POST /plugins/dsh-archived-chats/deletion/execute
POST /plugins/dsh-archived-chats/unarchive
POST /plugins/dsh-archived-chats/unarchive-all
POST /plugins/dsh-archived-chats/delete
POST /plugins/dsh-archived-chats/delete-all
GET  /plugins/dsh-archived-chats/unarchived
POST /plugins/dsh-archived-chats/unarchived/export
```

Except for export, these POST routes require `x-dsh-archived-chats: 1`. Content preview, images, and search also use guarded POST. Export separately accepts a bounded native form without this header guard and checks current archive visibility for the requested sessions. Other routes parse their respective bounded payloads.

`/delete` accepts `sessionId` and `/delete-all` accepts `sessionIds`. Without `permanent: true`, they return 400. Legacy deletion endpoints also require the `fingerprint` from `/deletion/preview`. Missing fingerprints and changed scopes prevent deletion. Responses contain `{ deleted, pending, failed, retryTargets }`. Failures with no successful deletions return HTTP 409. Partial success can return 200, so consumers must inspect the result arrays.


All new deletions use `deletionService.preview/remove`, including transitive subagents and preserving independent forks. `POST /deletion/preview` accepts `{ source, sessions }`. Selected sessions carry `sessionId` and `createdAt`; unarchived selections also carry workspace identity. The plan contains target identities, selected count, additional subagent count, total, and a scope fingerprint. `POST /deletion/execute` additionally requires `permanent: true` and that fingerprint, revalidating under the lifecycle lock. Active targets block deletion. Changed scope returns `deletion-scope-changed`.

New tasks durably store `confirmedScope` and the idle requirement. Final removal rechecks the complete scope. Retries protect reused IDs and refuse new descendants. Historical `purgeSelectedOnly` tasks retain their original behavior. Legacy delete routes delegate to the same service and preserve `{ deleted, pending, failed }` responses.

## State, ownership, and durability

Plugin state lives under `$DSH_HOME/plugin-data/archived-chats/`:

| Path | Current purpose |
| --- | --- |
| `metadata.json` | Versioned tags and notes |
| `pending-deletions.json` | Durable intent for sessions entering physical deletion |
| `deletion-tasks.json` | Confirmed permanent-deletion task identities and descendant scope |
| `fork-provenance.json` | Supplemental source records for ordinary forks |

Metadata and deletion-task writes are serialized and published through temporary files and atomic rename. The lifecycle queue serializes critical rechecks and commits for archive, import restore, and deletion. Files use `0600`, directories `0700`; files and parent directories are synced with safe fallback on platforms lacking directory fsync. Windows transient EPERM/EACCES/EBUSY errors receive bounded retries; containment checks use platform path rules.

## Workspace bulk archive

The Host owns archive operations, notice timing and Undo. The plugin extends the official `workspace.toast` slot with a View action that opens Archive Management; archive operations still call `workspaces.archiveSession`. Plugin archive success reuses the optional UI primitives `Toast`, which owns timing and positioning; older Hosts without it keep the result dialog open.

The client registers only `settings.section`. Its Unarchived conversation list lives in **Settings → Archive Management / 设置 → 归档管理**, without depending on a workspace-menu extension. Official `workspaces.list.subscribe` updates synchronize Archived and Unarchived.

1. List all registered workspace and ungrouped conversations in Unarchived, excluding archived, pending deletion, and subagent rows. Bulk archive uses the same exclusions and rechecks them inside the lifecycle lock and after asynchronous inspection. Use `readSession` for cold forks and preserve metadata.
2. Individual archiving binds `sessionIds`; workspace and global actions cover complete workspaces regardless of search or filters. A stale individual target fails rather than expanding scope.
3. Show one aggregate confirmation. Empty preparations return to the refreshed list.
4. Apply token/nonce confirmations, rechecking membership and running status after asynchronous inspection. Refresh archive, Unarchived, sidebar, and storage consumers after success.

Apply accepts credentials, not caller-added session IDs. Under the lifecycle queue, each chat is rechecked for workspace membership, archive state, agent state, and a real `turn/start`. Blank chats yield `session-empty`; unverifiable content yields `session-unavailable`. Older Hosts without agent status conservatively skip loaded chats. Candidate inspection concurrency is eight.

Public `workspaceRegistry.archiveSession()` is invoked with its receiver. Previews may include active chats; their IDs are bound to the confirmation token. Only explicit Stop and archive consent enables `{ stopActivity: true }` for those IDs. Official `workspace/session-activity` covers active agents and background work. Newly active, unconfirmed chats are skipped. Unarchive uses `workspaceRegistry.unarchiveSession()` and its official queue, never direct state replacement. These operations do not move workspace membership, change directories, or capture versions. Missing capability returns `workspace-archive-unsupported`.

## Persistence compatibility and fork titles

A provider with native `inspect` is preserved unchanged. Modern `list()` snapshots and `open(id, 'read')` handles are adapted to internal `list`, `listSnapshots`, `inspect`, `readSession`, and `readTitle`. Reads start at offset zero; handles close on success and failure.

`readTitle` allows inherited events but returns only the last nonblank `session/title` string, never a backup event payload. Archive listing prefers it, preventing strict backup inspection from blocking fork titles.

Strict legacy `inspect` still refuses positive inherited counts. Modern ZIP export uses `readSession` and v2 to preserve the inherited cut.

The adapter exposes modern `create` as `createWriteHandle`, not legacy create/append. It forwards locate only when the provider exposes it, validating the absolute path result. Without locate, directory accounting, physical purge, and the modern ZIP rollback adapter are unsupported. Read-only providers with locate can still support direct deletion.

## Preview, search, and client behavior

Archive transactions temporarily retain the open Archive Management section through the official shared sidebar.settings store. If clearing the archived main chat activates Host onboarding and closes Settings, the subscription restores that section synchronously. Input outside the archive page, dismissal shortcuts and section changes release protection; repeated archive-page clicks and ordinary typing retain it. Completion allows two animation frames for navigation effects to settle before removing subscriptions; plugin disposal also cancels listeners and frames. Success notices still depend on confirmed server results.

Image authorization proceeds through request guard, bounded identity fields, current visibility, an exact canonical projected descriptor, and optional public attachments.readImage. Visibility is rechecked after asynchronous reads. Responses use no-store/nosniff; errors do not echo paths.

Search reads have concurrency four. Archived projection caching uses a 30-second TTL and 64-session LRU. Unarchived search and previews bypass that cache, projecting live `snapshotEvents()` when loaded or official persistence reads otherwise. Limits are 256 Ki Unicode code points per segment, 1 Mi code points/1,000 segments per message, and 10,000 projected messages per session. Unknown structured values are bounded before stringify; oversized content is truncated or excluded from cache.

The client accepts public React component types, including React.memo-wrapped MarkdownText, and prefers Host MarkdownText, DisclosureRow, and JsonBlock with escaped text/native details/pre fallbacks. Tool results join only earlier matching calls. Images use Blob URLs, canceled and revoked on close/unmount; request sequence checks reject late responses. Turn navigation is on the left for desktop and horizontally above content at widths up to 640px.

Turn projection retains recorded boundaries and process/final-response positions. Only a fully loaded, closed turn with a known final response is grouped into a default-closed process disclosure; partial or boundaryless content stays in event order. Process summaries use Thought or observed tool/message/subagent counts, with nested reasoning, context provenance, and tool arguments/results initially closed. The final response sits outside the process disclosure. Real user messages align right; all assistant process content aligns left. The preview is read-only with no composer, does not invent usage or timing, and does not promise full native feature parity or missing log content. Deployment must reload the actual DSH backend to replace the projection code; browser refresh alone is insufficient.

Export download uses a guarded fetch, validates status, ZIP content type, and attachment disposition, then buffers the complete response before creating a Blob URL. It has a five-minute end-to-end timeout and a 320 MiB response-byte cap for declared and streamed bodies. The cap is not a peak-heap guarantee because chunks, the contiguous buffer, and Blob can coexist; the non-stream WebView fallback has no stronger universal memory ceiling. Completion says the download started, not that the browser saved it to disk.

Selection mode stores checked IDs on the client. Select all uses filtered `group.items`; workspace actions keep complete `group.sessionIds`. Hidden selections have a visible count. Cancel or navigation clears the set, and list updates prune missing IDs. Confirmation captures the exact ID snapshot and reuses existing export, unarchive, and deletion APIs. Selection mode hides row mutations and global/workspace menus, retaining preview; More contains Export selected.

`/state` and `/unarchived` expose a separate `updatedAt` sort field. Like Host `ApiSessionList`, live sessions use `sessionProjections.cachedSnapshot` and cold sessions use `sessionProjectionCache.cachedSnapshot`. Recency is the maximum of creation time and `sessionListMetadata.lastPromptAt`; missing or failed projections fall back to creation. Reads do not replay events or mutate projection files, and plugin `metadataUpdatedAt` never affects rank. Recently/least recently updated sorting and workspace grouping use the same field, with session IDs breaking timestamp ties and unknown dates last. Title sorting keeps its previous behavior.

Plugin confirmation, preview, import, and metadata dialogs share the opaque `--dsw-alias-bg-layer-2` surface and Host prominent elevation, with a legacy shadow fallback. Menus and toasts use opaque theme layers. Masks and hover states retain their intentional transparency; frosted menu tokens are not used as dialog backgrounds.

## About and version discovery

`GET /about` returns loaded-package identity, controlled links, and cached status without contacting the network. `POST /about/check-updates` uses the existing same-origin guard and accepts exactly `{ force: boolean }`. It requests only `https://registry.npmjs.org/dsh-archived-chats/latest`, without chat data, backups, or client credentials. Redirects, non-success status, wrong package names, and invalid SemVer are rejected. SemVer comparison never recommends a downgrade. Requests time out after 5 seconds and responses are bounded to 64 KiB.

Opening Archive Management loads local metadata, then automatically checks public npm metadata. While the page stays open, cache-aware checks run every 15 minutes and on visibility/network recovery. Success is cached for 12 hours and failure for 15 minutes; manual checks have a 30-second cooldown and concurrent requests coalesce. No chats or backups are sent. Failure never blocks chat management or claims the plugin is current. Leaving the page removes timers and listeners.

`POST /about/install-update` additionally requires a local request, rejects cross-origin requests and accepts only `{ version }`. `createUpdateRuntime` verifies the profile dependency and loaded package path. Local, external, unknown and mismatched sources cannot install. It prefers official `pluginManager.updateBundle`, including under HMR. The Host owns replacement and rollback. The adapter validates the nested result and on-disk package identity, reports verified restoration separately, and returns `applied` or `restart-required`. Older Hosts may use `installBundle` only without HMR. No package-manager process is spawned. Each Host owns its service state, and the loaded version remains distinct from the installed version. HMR may dispose this settings UI and abort its request, so users can reopen the page to verify the newly loaded version.

## Permanent deletion and crash recovery

Permanent deletion is coordinated by `deletion.js`. `deletion-tasks.js` persists task identity, session identity, and the confirmed descendant scope. Preflight checks store readability, exclusive directory ownership, and activity. After removing the original log, deletion clears workspace and archive indexes, metadata, and provenance.

Failure responses and `/state` expose `retryTargets`. Error feedback offers Retry, and refreshing or reopening restores the prompt. `/deletion-tasks/retry` verifies `sessionId` and `taskId` before continuing the saved scope. Startup and listing only report state. Retries retain identity, descendant-scope, and idle checks, including historical selected-only scopes.

Successful deletion and retry responses are cached in the current Host process for ten minutes, with up to 128 receipts. Repeating the same request returns its original result. Receipts only retain responses. After restart or expiry, normal identity validation applies.

Committed permanent-deletion tasks in the previous `trash.json` can carry forward into the new task store. Previous recovery records and protection snapshots remain on disk without active recovery features.

## Storage and lineage

Stats measures directories with concurrency four, skips symlinks, and caches for 30 seconds; failure affects only the relevant item.

Lineage prefers official durable parentSession and fills verified ordinary-fork gaps from the plugin catalog. Officially stored chats outside pending deletion form the projection anchors across all workspaces. Complete families retain cross-workspace source and branch context. At most 100 missing titles are read on demand, and the Host-wide graph has a 5,000-node limit. List search and state filtering do not modify relationships.

`fork-provenance.js` observes the verified `sessionController.fork(request)` contract and writes successful fork relations into a serialized, atomically replaced catalog. Receiver, arguments, result identity and official rejection are preserved. Disposal restores its method descriptor. A wrapper retained by a later observer becomes pass-through. Projection checks IDs and creation timestamps. Catalog and observer failures are returned as `provenanceStatus` and `forkTrackingStatus`. This Host-local catalog is outside the current ZIP backup format.

Independent unarchived draft candidates are checked against fresh live or persisted events with concurrency eight. Only verified empty candidates are excluded from projection anchors; unreadable logs, conversation events, inherited history and related source nodes remain visible. Lineage preview checks only the requested family and draft candidate.

The client iteratively assigns each managed node to its actual workspace once. The outer list excludes duplicate source references while sourceParent retains the direct-parent summary. Workspace folds persist in browser key dsh-archived-chats:lineage-workspaces without Host writes. Search temporarily opens matching workspaces and clearing restores their folds.

A row action resolves its complete family from the original unfiltered forest by session ID, including cross-workspace sources. Unrelated roots are excluded and independent chats have no graph action. Iterative subtree layout supplies shared DOM-card and SVG-edge coordinates, with one translated/scaled viewport for cards and edges. Pointer capture enables free background panning; a non-passive native wheel listener handles wheel panning and pointer-anchored Ctrl/Command zoom. Nodes never fold. The dialog locates and highlights the selected chat, traps keyboard focus and restores the trigger on close. The list stays mounted to retain query and scroll state. Titles use the shared read-only preview above the graph; preview temporarily owns keyboard focus.

`/preview` and `/preview/image` accept `scope: "lineage"` for active or archived nodes in the current graph, including related subagents. Both recheck membership and pending-deletion state after reading. Unreadable deletion-task storage denies content.

## ZIP export, import, and restore

Export contains a manifest and per-chat session.json/transcript.md with sanitized collision-safe paths. It inspects every selected source exactly once and stages the rendered entries before returning a sequential ZIP stream. `fflate` compresses those entries synchronously in 256 KiB slices with an event-loop yield between slices, and the writer no longer depends on `zip-stream`, so it cannot pull in the `readable-stream@4` chain that requests a builtin name with a trailing slash. The shared complete semantic validator and all importer budgets run first, so a successful export is importable by this plugin and a later invalid source cannot turn an already successful response into a partial backup. Modern reads produce v2 manifest/session records with `source.inheritedEventCount`; legacy reads retain v1. Import accepts ordinary records in both versions, requires matching manifest/record versions, and validates the v2 boundary. An ambiguous seeded v1 source is refused rather than flattened. Both formats exclude attachment bytes and automatic descendant recursion.

The shared limits are 2,000 sessions, 4,001 entries, 4 MiB manifest, 4 MiB per session JSON, 8 MiB per entry/Markdown, and 256 MiB expanded total. Imported compressed input is limited to 512 MiB. Each JSON document is limited to depth 64, 100,000 nodes, and 4 Mi Unicode code points across strings. Import uses bounded decompression and validates declared/actual sizes, paths, version, generator, JSON budgets, and cross-file identities. It reconciles local entries, data descriptors, and the central directory, including sizes and CRCs; truncation, invalid UTF-8, duplicates, encryption, ZIP64, multi-disk archives, and methods other than Store/Deflate are rejected. Existing IDs are disabled; missing workspaces or attachment references produce warnings. Confirmation lasts ten minutes and is single-use; at most eight previews totaling 128 MiB remain in process. Conflict rechecks and confirmed commits run in the lifecycle queue.

Import preview marks incompatible, ambiguous or invalid `cwd` values as non-restorable. Selection and the restore adapter recheck the complete batch before staging or persistence writes. No path is translated, discarded, or replaced with the process directory; native persistence and deletion-location validation remain unchanged. Windows drive/UNC paths not valid on POSIX and single-slash roots on Windows are refused. A single-slash root might originally have been a Windows current-drive path; the backup lacks a source-platform field, so the check is deliberately conservative. Ambiguous double-slash paths retain native UNC/POSIX semantics.

After raw import commits, optional public cold-title publication verifies the exact title and final event watermark under a shared bounded deadline. Cache absence, failure, timeout, or legacy Host seeded-cold-list limitations return stable degraded warnings without rolling back durable restored data. Unarchive separately requires an authoritative readable persisted header with `cwd`; missing `cwd` is not the same as missing workspace and leaves the archived copy available for preview/export.

## Validation and release boundaries

`test/backup-roundtrip.test.mjs` uses an installed official backend with temporary storage when `DSH_NATIVE_MODULE_ROOT` points to its node_modules directory. It covers v1 recovery, fork v2 round-trips, preview/unarchive/reopen, first-publication failures, foreign-create races, and pending-deletion conflicts. Without that opt-in these native tests are explicitly skipped; modern adapter unit tests still run.

Tests cover retained modules: export/import rollback, deletion-task states, interrupted deletion and explicit retry, fork titles, complete reads and strict ZIP reads, statistics, lineage, Host routes, client behavior, types, and package contents. test/archive-lifecycle.test.mjs covers fork preview, inherited-cut preservation, and direct purge. Tests use isolated data, not real chats.

```sh
npm test
npm ci --prefix test/fixtures/native-host --ignore-scripts --include=optional
node scripts/run-native-integration.mjs
npm ci --prefix test/fixtures/native-host-0.2.1 --ignore-scripts --include=optional
node scripts/run-native-integration.mjs --fixture-root test/fixtures/native-host-0.2.1
npm ci --prefix test/fixtures/native-host-0.2.1-rc.5 --ignore-scripts --include=optional
node scripts/run-native-integration.mjs --fixture-root test/fixtures/native-host-0.2.1-rc.5
npm pack --dry-run --json
git diff --check
```

The native commands install the locked `@deepseek-ai/dsh-session@0.1.7-rc.2`, `0.2.1-rc.2` and `0.2.1-rc.5` fixtures and require all nine native integration cases to run without skips for each fixture. This is the local equivalent of the mandatory native Host integration gate in CI.

The declared DSH `>=0.1.0-rc.7` range remains capability-based. Release automation tests Node.js 18 on Ubuntu and Node.js 24 on Ubuntu, macOS, and Windows; the Node.js 24 matrix requires all three official Host backend fixtures, `@deepseek-ai/dsh-session@0.1.7-rc.2`, `0.2.1-rc.2` and `0.2.1-rc.5`, on all three platforms (9/9 each), along with package checks, including the v4 session format. The [screenshots](../screenshots.json) show the current interface with synthetic example chats.
