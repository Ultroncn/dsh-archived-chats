/**
 * Host loader entry — registers the `/plugins/dsh-archived-chats/*` routes
 * (about, about/check-updates, about/install-update,
 * state, stats, retention/policy, retention/policy/preview,
 * retention/preview, retention/apply,
 * lineage,
 * workspace-archive/workspaces, workspace-archive/preview,
 * workspace-archive/apply,
 * preview, preview/image, search,
 * export, import/inspect, import/restore,
 * metadata, trash, trash/restore, trash/purge, trash/empty, unarchive,
 * unarchive-all, delete, delete-all, orphans, orphans/delete, orphans/export), streams
 * JSON/Markdown backup ZIPs, and wires archive information:
 * per-session tags/notes joined into `/state`, storage statistics from
 * `/stats`, guarded projected-message reads through `/preview` and `/search`.
 * `/search` optionally accepts `sessionIds: string[]` (0–100 IDs, <=1024 UTF-16
 * units each). Explicit batches scan that scope and report skipped IDs/reasons;
 * empty never means all. Only currently visible archives may be inspected, with
 * visibility rechecked after reads. Without IDs, the legacy matching-session
 * limit remains; scannedIds/processed/total/remaining/complete disclose coverage.
 * `/preview` accepts an optional nonnegative safe integer `seq`, locating a page
 * around that projected message identity (not a source event offset). The anchor
 * status is found/missing; missing falls back to page zero. previousOffset and
 * nextOffset preserve both directions. Neither route writes session content.
 * `/preview` returns bounded structured tool/image descriptors. The separately
 * listed `/preview/image` route is guarded and read-only, authorizes each stored
 * image against the archived, trash, or orphan session's projected
 * attachment descriptors, and
 * degrades only image loading when the optional attachment service is absent.
 * Metadata mutation remains guarded through `/metadata`, and archive restore is
 * preview-first through the import routes. Import restore is capability
 * detected: modern create handles use append/flush/read/close and safe locate
 * rollback; dedicated restore and explicitly exclusive legacy create/append
 * remain fallbacks. Plain legacy create/append is not considered safe restore.
 * ZIP v2 preserves inherited boundaries; v1 import remains supported when the
 * Host can represent its source format without guessing missing boundaries.
 * Archive mutations fail closed while the
 * recycle catalog is unreadable, and `/state` reports `trashStatus` so the
 * listing can be labelled as unverified. Non-permanent delete returns 410;
 * old recycle records remain available for recovery and explicit purge. Guarded
 * permanent deletion removes related snapshots before the original session
 * and retains durable intent until all remaining cleanup succeeds.
 * Direct permanent deletion creates durable `purge-pending` intent without
 * capturing a snapshot; its snapshotId is null. It uses the same
 * snapshot/session cleanup path as legacy purge. Pending tasks require
 * explicit retry; startup does not sweep snapshots or delete sessions.
 */
export type RecycleRecordState = 'trashed' | 'purge-pending' | 'degraded';
export type RecycleLiveDisposition = 'cold' | 'disposed' | 'parked';

export interface RecycleSessionRow {
  sessionId: string;
  state: RecycleRecordState;
  trashedAt: string;
  purgeRequestedAt: string | null;
  title: string | null;
  createdAt: number | null;
  origin: string | null;
  workspace: { id: string | null; title: string | null } | null;
  wasArchived: boolean;
  tags: string[];
  note: string;
  metadataUpdatedAt: string | null;
  /** Null for snapshotless direct permanent deletion or a degraded backup. */
  snapshotId: string | null;
  snapshotBytes: number;
  snapshotAttachmentCount: number;
  liveDisposition: RecycleLiveDisposition;
  /** Durable subagent targets retained until the complete cascade finishes. */
  cascadeSessionIds?: string[];
  /** Pending residual cleanup never expands beyond explicitly selected IDs. */
  purgeSelectedOnly?: true;
}

export interface OrphanSessionRow {
  id: string;
  kind: 'subagent' | 'blank';
  title: string | null;
  createdAt: number | null;
  cwd: string | null;
  parentSession: string | null;
  delegationDepth: number | null;
  sizeBytes: number | null;
}

export interface RecycleSummary {
  count: number;
  snapshotBytes: number;
  degradedCount: number;
  purgePendingCount: number;
}

/** Exact recycle-record incarnation captured by a destructive confirmation. */
export interface RecyclePurgeTarget {
  sessionId: string;
  state: 'trashed' | 'degraded';
  trashedAt: string;
  snapshotId: string | null;
  bytes: number;
}

export type LineageStatus = 'active' | 'archived' | 'trash' | 'missing';
export type LineageDiagnosticCode = 'missing-parent' | 'self-parent' | 'cycle' | 'delegation-depth-mismatch';

export interface LineageNode {
  id: string;
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
  trashStatus: 'ready' | 'unavailable';
  /** Official session inventory and missing-parent reference nodes. */
  roots: LineageNode[];
  diagnostics: LineageDiagnostic[];
  nodeCount: number;
}

export declare function apply(ctx: unknown): void;
export declare const name: string;
