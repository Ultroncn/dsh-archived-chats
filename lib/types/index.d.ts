/**
 * Host loader entry — registers the `/plugins/dsh-archived-chats/*` routes
 * (about, about/check-updates, about/install-update,
 * state, stats, deletion-tasks, deletion-tasks/retry,
 * lineage,
 * workspace-archive/workspaces, workspace-archive/preview,
 * workspace-archive/apply,
 * preview, preview/image, search,
 * export, import/inspect, import/restore,
 * metadata, unarchive,
 * unarchive-all, delete, delete-all), streams
 * JSON/Markdown backup ZIPs, and wires archive information:
 * per-session tags/notes joined into `/state`, storage statistics from
 * `/stats`, guarded projected-message reads through `/preview` and `/search`.
 * `/search` optionally accepts `sessionIds: string[]` (0–100 IDs, <=1024 UTF-16
 * units each). Explicit batches scan that scope and report skipped IDs/reasons;
 * empty never means all. scope is archive (default) or unarchived; result
 * rows carry their individual scope. Only currently visible chats in that scope
 * may be inspected, with visibility rechecked after reads. Unarchived reads use
 * fresh live or persisted events without the archived projection cache. Without IDs, the legacy matching-session
 * limit remains; scannedIds/processed/total/remaining/complete disclose coverage.
 * `/preview` and `/preview/image` also accept scope lineage for active/archived
 * nodes across all workspaces in the current Host, including subagents.
 * Reads recheck membership and pending deletion state before returning content.
 * `/preview` accepts an optional nonnegative safe integer `seq`, locating a page
 * around that projected message identity (not a source event offset). The anchor
 * status is found/missing; missing falls back to page zero. previousOffset and
 * nextOffset preserve both directions. Neither route writes session content.
 * `/preview` returns bounded structured tool/image descriptors. The separately
 * listed `/preview/image` route is guarded and read-only, authorizes each stored
 * image against the archived, unarchived, or lineage session's projected
 * attachment descriptors, and
 * degrades only image loading when the optional attachment service is absent.
 * Metadata mutation remains guarded through `/metadata`, and archive restore is
 * preview-first through the import routes. Import restore is capability
 * detected: modern create handles use append/flush/read/close and safe locate
 * rollback; dedicated restore and explicitly exclusive legacy create/append
 * remain fallbacks. Plain legacy create/append is not considered safe restore.
 * ZIP v2 preserves inherited boundaries; v1 import remains supported when the
 * Host can represent its source format without guessing missing boundaries.
 * Archive mutations fail closed when deletion-task storage is unreadable.
 * Permanent deletion persists task identity and scope before removing files.
 * POST /deletion/preview accepts { source, sessions }; POST
 * /deletion/execute additionally requires permanent:true and its fingerprint.
 * Both use the same scope for archived and unarchived roots, including
 * transitive subagents and preserving independent forks. All targets must be idle.
 * Changed scope requires a fresh confirmation. Legacy delete routes require the
 * same fingerprint. Results and /state expose retryTargets for explicit retry
 * through /deletion-tasks/retry. Successful responses can be replayed for ten
 * minutes in the same Host process, with at most 128 cached response receipts.
 */
export interface DeletionTask {
  sessionId: string;
  taskId: string;
  state: 'purge-pending';
  purgeRequestedAt: string;
  title: string | null;
  createdAt: number | null;
  origin: string | null;
  workspace: { id: string; title: string | null; path: string | null } | null;
  cascadeSessionIds?: string[];
  purgeSelectedOnly?: true;
  purgeRequireIdle?: true;
  confirmedScope?: Array<{ sessionId: string; createdAt: number }>;
}

export interface DeletionPlan {
  sessionIds: string[];
  targets: Array<{ sessionId: string; createdAt: number }>;
  selectedCount: number;
  subagentCount: number;
  total: number;
  fingerprint: string;
}

export interface DeletionRetryTarget {
  sessionId: string;
  taskId: string;
}

export interface DeletionResult {
  deleted: string[];
  pending: string[];
  failed: Array<{ id: string; reason: string }>;
  retryTargets: DeletionRetryTarget[];
}

export type LineageStatus = 'active' | 'archived' | 'missing';
export type LineageDiagnosticCode = 'missing-parent' | 'self-parent' | 'cycle' | 'delegation-depth-mismatch';

export interface LineageNode {
  id: string;
  /** Official parent, or a verified plugin-recorded ordinary fork source. */
  parentSession: string | null;
  /** Official fork-inheritance marker; null when unavailable. */
  isSeeded: boolean | null;
  /** Legacy pre-v4 header value only; v4 inherited counts are not list metadata. */
  seedLength: number | null;
  origin: 'subagent' | null;
  delegationDepth: number;
  title: string | null;
  createdAt: number | null;
  workspace: { id: string | null; title: string | null };
  status: LineageStatus;
  children: LineageNode[];
}

export interface LineageDiagnostic {
  code: LineageDiagnosticCode;
  sessionId: string;
  relatedId: string;
}

export interface LineageResponse {
  workspaces: Array<{ id: string; title: string | null }>;
  deletionStatus: 'ready' | 'unavailable';
  provenanceStatus: 'ready' | 'unavailable';
  forkTrackingStatus: 'active' | 'unsupported' | 'degraded';
  /** Official session inventory and missing-parent reference nodes. */
  roots: LineageNode[];
  diagnostics: LineageDiagnostic[];
  nodeCount: number;
}

export declare function apply(ctx: unknown): void;
export declare const name: string;
