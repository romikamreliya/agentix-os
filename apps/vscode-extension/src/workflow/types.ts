/** Top-level stage of the approval workflow. */
export type Stage =
  | "understanding"
  | "planning"
  | "tasks"
  | "execution"
  | "completed";

/** Sub-state within a stage. */
export type StageState =
  | "analyzing"
  | "questions"
  | "review"
  | "creating"
  | "done"
  // Tasks stage
  | "generating-tasks"
  | "reviewing-tasks"
  // Execution stage
  | "executing"
  | "paused"
  | "awaiting-approval"
  // Completed stage
  | "summary";

/** A clarification question with predefined options and an optional free-text "Other". */
export interface Question {
  id: string;
  text: string;
  options: string[];
  allowOther: boolean;
}

/** The AI's understanding of the user's request (user-editable during review). */
export interface Understanding {
  summary: string;
  goals: string[];
  /** Derived from clarification answers; reflected back to the user. */
  assumptions: string[];
}

/** A single step in the generated plan (user-editable during review). */
export interface PlanStep {
  id: string;
  title: string;
  detail: string;
  subSteps: string[];
}

export interface Plan {
  steps: PlanStep[];
}

// ---------- Task & Execution types ----------

/** Status of a task during execution. */
export type TaskStatus = "pending" | "in-progress" | "completed" | "failed" | "skipped";

/** A node in the task hierarchy, linked back to a requirement. */
export interface TaskNode {
  id: string;
  title: string;
  /** The requirement/goal this task fulfils (kept on every node for traceability). */
  requirement: string;
  status: TaskStatus;
  /** Error message if the task failed. */
  error?: string;
  /** File changes produced by executing this task. */
  fileChanges: FileChangeRecord[];
  children: TaskNode[];
}

/** Type of file operation. */
export type FileOperation = "create" | "modify" | "delete" | "rename" | "move";

/** A proposed file change (before execution). */
export interface FileChange {
  operation: FileOperation;
  filePath: string;
  /** Destination path for rename/move operations. */
  newPath?: string;
  /** New content for create/modify operations. */
  content?: string;
  /** Original content (for modify — used to generate diffs). */
  originalContent?: string;
  /** Human-readable unified diff. */
  diff?: string;
}

/** A file change record with execution metadata. */
export interface FileChangeRecord extends FileChange {
  taskId: string;
  approved: boolean;
  executed: boolean;
  timestamp: number;
}

/** Execution flow control. */
export type ExecutionControl = "running" | "paused" | "stopped";

/** Final summary generated when all tasks complete. */
export interface CompletionSummary {
  completedTasks: string[];
  failedTasks: string[];
  skippedTasks: string[];
  createdFiles: string[];
  modifiedFiles: string[];
  deletedFiles: string[];
  recommendations: string[];
}

/** The full, serializable workflow session. */
export interface WorkflowSession {
  id: string;
  prompt: string;
  stage: Stage;
  state: StageState;
  revision: number;

  understanding: Understanding;
  understandingApproved: boolean;
  understandingQuestions: Question[];
  understandingAnswers: Record<string, string>;

  plan: Plan;
  planApproved: boolean;
  planQuestions: Question[];
  planAnswers: Record<string, string>;

  tasks: TaskNode[];
  tasksApproved: boolean;

  /** Execution phase fields. */
  executionControl: ExecutionControl;
  currentTaskId?: string;
  pendingChanges: FileChange[];
  allFileChanges: FileChangeRecord[];

  /** Completion phase. */
  summary?: CompletionSummary;
}
