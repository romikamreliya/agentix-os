/** Top-level stage of the approval workflow. */
export type Stage = "understanding" | "planning" | "completed";

/** Sub-state within a stage. */
export type StageState = "analyzing" | "questions" | "review" | "creating" | "done";

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

/** A node in the final task hierarchy, linked back to a requirement. */
export interface TaskNode {
  id: string;
  title: string;
  /** The requirement/goal this task fulfils (kept on every node for traceability). */
  requirement: string;
  children: TaskNode[];
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
}
