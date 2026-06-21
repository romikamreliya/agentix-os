import type {
  CompletionSummary,
  FileChange,
  FileChangeRecord,
  Plan,
  Question,
  Stage,
  StageState,
  TaskNode,
  TaskStatus,
  Understanding,
  WorkflowSession
} from "./types";

/**
 * Pure workflow engine. Every function returns a new session and performs no
 * I/O — orchestration (delays, persistence, UI, AI calls) lives in WorkflowService.
 *
 * Supports the full 5-phase workflow:
 *   1. Understanding  (analyzing → questions → review → approved)
 *   2. Planning       (creating → questions → review → approved)
 *   3. Tasks          (generating-tasks → reviewing-tasks → approved)
 *   4. Execution      (executing → awaiting-approval → per-task loop)
 *   5. Completion     (summary)
 */

function newId(): string {
  return "wf-" + Math.random().toString(36).slice(2, 10);
}

// ---------- Default empty structures ----------

const EMPTY_UNDERSTANDING: Understanding = { summary: "", goals: [], assumptions: [] };

function emptySession(prompt: string, base?: Partial<WorkflowSession>): WorkflowSession {
  return {
    id: base?.id ?? newId(),
    prompt,
    stage: "understanding",
    state: "analyzing",
    revision: 0,
    understanding: EMPTY_UNDERSTANDING,
    understandingApproved: false,
    understandingQuestions: [],
    understandingAnswers: {},
    plan: { steps: [] },
    planApproved: false,
    planQuestions: [],
    planAnswers: {},
    tasks: [],
    tasksApproved: false,
    executionControl: "stopped",
    currentTaskId: undefined,
    pendingChanges: [],
    allFileChanges: [],
    summary: undefined,
    ...base
  };
}

// ===================================================================
// Phase 1: Understanding
// ===================================================================

/** Transient session shown while the AI "analyzes" the prompt. */
export function analyzingSession(prompt: string, base?: WorkflowSession): WorkflowSession {
  if (base) {
    return {
      ...base,
      prompt,
      stage: "understanding",
      state: "analyzing" as StageState
    };
  }
  return emptySession(prompt);
}

/** AI analysis complete — show understanding + clarification questions. */
export function startUnderstanding(
  prompt: string,
  understanding: Understanding,
  questions: Question[],
  base?: WorkflowSession
): WorkflowSession {
  return {
    ...emptySession(prompt, base),
    understanding,
    understandingQuestions: questions,
    stage: "understanding",
    state: questions.length > 0 ? "questions" : "review"
  };
}

/** User answers clarification questions → show understanding for review. */
export function answerUnderstanding(
  session: WorkflowSession,
  answers: Record<string, string>,
  refined?: { understanding: Understanding; questions: Question[] }
): WorkflowSession {
  const merged = { ...session.understandingAnswers, ...answers };

  if (refined && refined.questions.length > 0) {
    // AI has more questions
    return {
      ...session,
      understandingAnswers: merged,
      understanding: refined.understanding,
      understandingQuestions: refined.questions,
      state: "questions"
    };
  }

  // No more questions → go to review
  const understanding = refined?.understanding ?? session.understanding;
  // Build assumptions from answers
  const assumptions = Object.entries(merged).map(([, v]) => v);
  return {
    ...session,
    understandingAnswers: merged,
    understanding: { ...understanding, assumptions },
    state: "review"
  };
}

/** User edits understanding and resubmits → re-analyze. */
export function changeUnderstanding(
  session: WorkflowSession,
  edited: Pick<Understanding, "summary" | "goals">,
  questions: Question[]
): WorkflowSession {
  return {
    ...session,
    revision: session.revision + 1,
    understanding: { summary: edited.summary, goals: edited.goals, assumptions: [] },
    understandingQuestions: questions,
    understandingAnswers: {},
    state: questions.length > 0 ? "questions" : "review"
  };
}

/** Approve understanding → move to planning stage. */
export function approveUnderstanding(
  session: WorkflowSession,
  edited: Pick<Understanding, "summary" | "goals">
): WorkflowSession {
  const understanding: Understanding = {
    summary: edited.summary,
    goals: edited.goals,
    assumptions: session.understanding.assumptions
  };
  return {
    ...session,
    understanding,
    understandingApproved: true,
    stage: "planning",
    state: "creating"
  };
}

// ===================================================================
// Phase 2: Planning
// ===================================================================

/** Transient session shown while the AI creates the plan. */
export function creatingSession(session: WorkflowSession): WorkflowSession {
  return { ...session, stage: "planning", state: "creating" };
}

/** AI plan generated — show plan + planning questions. */
export function showPlan(
  session: WorkflowSession,
  plan: Plan,
  questions: Question[]
): WorkflowSession {
  return {
    ...session,
    plan,
    planQuestions: questions,
    stage: "planning",
    state: questions.length > 0 ? "questions" : "review"
  };
}

/** User answers planning questions → regenerate plan → review. */
export function answerPlan(
  session: WorkflowSession,
  answers: Record<string, string>,
  refined?: { plan: Plan; questions: Question[] }
): WorkflowSession {
  const merged = { ...session.planAnswers, ...answers };

  if (refined && refined.questions.length > 0) {
    return {
      ...session,
      planAnswers: merged,
      plan: refined.plan,
      planQuestions: refined.questions,
      state: "questions"
    };
  }

  return {
    ...session,
    planAnswers: merged,
    plan: refined?.plan ?? session.plan,
    state: "review"
  };
}

/** User edits the plan and resubmits → re-plan questions. */
export function changePlan(
  session: WorkflowSession,
  edited: Plan,
  questions: Question[]
): WorkflowSession {
  return {
    ...session,
    revision: session.revision + 1,
    plan: edited,
    planQuestions: questions,
    planAnswers: {},
    state: questions.length > 0 ? "questions" : "review"
  };
}

/** Approve plan → move to task generation. */
export function approvePlan(session: WorkflowSession, edited: Plan): WorkflowSession {
  return {
    ...session,
    plan: edited,
    planApproved: true,
    stage: "tasks",
    state: "generating-tasks"
  };
}

// ===================================================================
// Phase 3: Task Generation
// ===================================================================

/** Build the task hierarchy from the approved plan. */
export function buildTasks(plan: Plan, understanding: Understanding): TaskNode[] {
  const goals = understanding.goals.length ? understanding.goals : ["General requirement"];
  return plan.steps.map((step, i) => {
    const requirement = goals[i % goals.length];
    return {
      id: `task-${i + 1}`,
      title: step.title,
      requirement,
      status: "pending" as TaskStatus,
      error: undefined,
      fileChanges: [],
      children: step.subSteps.map((sub, j) => ({
        id: `task-${i + 1}-${j + 1}`,
        title: sub,
        requirement,
        status: "pending" as TaskStatus,
        error: undefined,
        fileChanges: [],
        children: []
      }))
    };
  });
}

/** Task generation complete — show for review. */
export function showTasks(session: WorkflowSession, tasks: TaskNode[]): WorkflowSession {
  return {
    ...session,
    tasks,
    stage: "tasks",
    state: "reviewing-tasks"
  };
}

/** User edits, adds, deletes or reorders tasks/sub-tasks. */
export function changeTasks(session: WorkflowSession, tasks: TaskNode[]): WorkflowSession {
  const sanitizedTasks = tasks.map((t, i) => {
    const parentId = `task-${i + 1}`;
    return {
      ...t,
      id: parentId,
      children: t.children.map((sub, j) => ({
        ...sub,
        id: `${parentId}-${j + 1}`
      }))
    };
  });

  return {
    ...session,
    revision: session.revision + 1,
    tasks: sanitizedTasks
  };
}

/** Approve task structure → begin execution. */
export function approveTasks(session: WorkflowSession): WorkflowSession {
  const firstTask = findNextPendingTask(session.tasks);
  return {
    ...session,
    tasksApproved: true,
    stage: "execution",
    state: "executing",
    executionControl: "running",
    currentTaskId: firstTask?.id
  };
}

// ===================================================================
// Phase 4: Execution
// ===================================================================

/** Set a task's status (used for all status transitions). */
export function setTaskStatus(
  tasks: TaskNode[],
  taskId: string,
  status: TaskStatus,
  error?: string
): TaskNode[] {
  return tasks.map((t) => {
    if (t.id === taskId) {
      return { ...t, status, error: error ?? t.error };
    }
    if (t.children.length) {
      return { ...t, children: setTaskStatus(t.children, taskId, status, error) };
    }
    return t;
  });
}

/** Start executing a task (set to in-progress). */
export function startTask(session: WorkflowSession, taskId: string): WorkflowSession {
  return {
    ...session,
    tasks: setTaskStatus(session.tasks, taskId, "in-progress"),
    currentTaskId: taskId,
    state: "executing"
  };
}

/** AI has proposed changes for a task — show for approval. */
export function proposeChanges(
  session: WorkflowSession,
  taskId: string,
  changes: FileChange[]
): WorkflowSession {
  return {
    ...session,
    currentTaskId: taskId,
    pendingChanges: changes,
    state: "awaiting-approval"
  };
}

/** User approves the proposed changes. */
export function approveChanges(session: WorkflowSession): WorkflowSession {
  const records: FileChangeRecord[] = session.pendingChanges.map((c) => ({
    ...c,
    taskId: session.currentTaskId ?? "",
    approved: true,
    executed: false,
    timestamp: Date.now()
  }));
  return {
    ...session,
    pendingChanges: [],
    allFileChanges: [...session.allFileChanges, ...records],
    state: "executing"
  };
}

/** Mark a change as executed after the file system operation succeeds. */
export function markChangeExecuted(
  session: WorkflowSession,
  changeIndex: number
): WorkflowSession {
  const updated = [...session.allFileChanges];
  if (updated[changeIndex]) {
    updated[changeIndex] = { ...updated[changeIndex], executed: true };
  }
  return { ...session, allFileChanges: updated };
}

/** Mark a task as completed and attach its file changes. */
export function completeTask(session: WorkflowSession, taskId: string): WorkflowSession {
  const taskChanges = session.allFileChanges.filter((c) => c.taskId === taskId);
  const tasks = updateTaskNode(session.tasks, taskId, (t) => ({
    ...t,
    status: "completed" as TaskStatus,
    fileChanges: taskChanges
  }));
  const next = findNextPendingTask(tasks);
  return {
    ...session,
    tasks,
    currentTaskId: next?.id,
    pendingChanges: [],
    state: next ? "executing" : "executing" // WorkflowService will call completeWorkflow
  };
}

/** Mark a task as failed. */
export function failTask(
  session: WorkflowSession,
  taskId: string,
  error: string
): WorkflowSession {
  const tasks = setTaskStatus(session.tasks, taskId, "failed", error);
  const next = findNextPendingTask(tasks);
  return {
    ...session,
    tasks,
    currentTaskId: next?.id,
    pendingChanges: []
  };
}

/** Skip a task. */
export function skipTask(session: WorkflowSession, taskId: string): WorkflowSession {
  const tasks = setTaskStatus(session.tasks, taskId, "skipped");
  const next = findNextPendingTask(tasks);
  return {
    ...session,
    tasks,
    currentTaskId: next?.id,
    pendingChanges: []
  };
}

/** Reset a failed/skipped task back to pending for retry. */
export function retryTask(session: WorkflowSession, taskId: string): WorkflowSession {
  const tasks = setTaskStatus(session.tasks, taskId, "pending");
  return {
    ...session,
    tasks,
    currentTaskId: taskId
  };
}

/** Pause execution. */
export function pauseExecution(session: WorkflowSession): WorkflowSession {
  return {
    ...session,
    executionControl: "paused",
    state: "paused"
  };
}

/** Resume execution from pause. */
export function resumeExecution(session: WorkflowSession): WorkflowSession {
  return {
    ...session,
    executionControl: "running",
    state: "executing"
  };
}

// ===================================================================
// Phase 5: Completion
// ===================================================================

/** Build the completion summary and finalize. */
export function completeWorkflow(
  session: WorkflowSession,
  recommendations: string[]
): WorkflowSession {
  const summary = buildSummary(session, recommendations);
  return {
    ...session,
    stage: "completed",
    state: "summary",
    executionControl: "stopped",
    currentTaskId: undefined,
    pendingChanges: [],
    summary
  };
}

function buildSummary(
  session: WorkflowSession,
  recommendations: string[]
): CompletionSummary {
  const all = flattenTasks(session.tasks);
  const completed = all.filter((t) => t.status === "completed").map((t) => t.title);
  const failed = all.filter((t) => t.status === "failed").map((t) => t.title);
  const skipped = all.filter((t) => t.status === "skipped").map((t) => t.title);

  const created = new Set<string>();
  const modified = new Set<string>();
  const deleted = new Set<string>();

  for (const change of session.allFileChanges) {
    if (!change.executed) continue;
    switch (change.operation) {
      case "create":
        created.add(change.filePath);
        break;
      case "modify":
        modified.add(change.filePath);
        break;
      case "delete":
        deleted.add(change.filePath);
        break;
      case "rename":
      case "move":
        deleted.add(change.filePath);
        if (change.newPath) created.add(change.newPath);
        break;
    }
  }

  return {
    completedTasks: completed,
    failedTasks: failed,
    skippedTasks: skipped,
    createdFiles: [...created],
    modifiedFiles: [...modified],
    deletedFiles: [...deleted],
    recommendations
  };
}

// ===================================================================
// Helpers
// ===================================================================

/** Find the next task with status "pending" (depth-first). */
export function findNextPendingTask(tasks: TaskNode[]): TaskNode | undefined {
  for (const task of tasks) {
    if (task.status === "pending") return task;
    if (task.children.length) {
      const child = findNextPendingTask(task.children);
      if (child) return child;
    }
  }
  return undefined;
}

/** Check if all tasks are terminal (completed, failed, or skipped). */
export function allTasksDone(tasks: TaskNode[]): boolean {
  return flattenTasks(tasks).every(
    (t) => t.status === "completed" || t.status === "failed" || t.status === "skipped"
  );
}

/** Flatten the task tree into a single list. */
export function flattenTasks(tasks: TaskNode[]): TaskNode[] {
  const result: TaskNode[] = [];
  for (const task of tasks) {
    result.push(task);
    if (task.children.length) {
      result.push(...flattenTasks(task.children));
    }
  }
  return result;
}

/** Update a single task node by id (deep). */
function updateTaskNode(
  tasks: TaskNode[],
  taskId: string,
  updater: (t: TaskNode) => TaskNode
): TaskNode[] {
  return tasks.map((t) => {
    if (t.id === taskId) return updater(t);
    if (t.children.length) {
      return { ...t, children: updateTaskNode(t.children, taskId, updater) };
    }
    return t;
  });
}
