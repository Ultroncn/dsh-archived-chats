/** Browser settings UI for archive management, lineage and deletion status reporting. */
export type { DeletionTask, DeletionRetryTarget } from '../index.js';

export type LineageStatus = 'active' | 'archived' | 'missing';
export type LineageDiagnosticCode = 'missing-parent' | 'self-parent' | 'cycle' | 'delegation-depth-mismatch';

export interface LineageNode {
  id: string;
  parentSession: string | null;
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
  /** Archived and unarchived chats plus only the parent/child context needed to explain them. */
  roots: LineageNode[];
  diagnostics: LineageDiagnostic[];
  nodeCount: number;
}

export declare const SETTINGS_NS: string;
export declare function apply(ctx: unknown): void;
export declare const inject: string[];
