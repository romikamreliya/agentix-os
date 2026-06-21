import type {
  Plan,
  Question,
  Stage,
  StageState,
  TaskNode,
  Understanding,
  WorkflowSession
} from "./types";

/**
 * Pure workflow engine. Every function returns a new session and performs no
 * I/O — orchestration (delays, persistence, UI) lives in WorkflowService.
 *
 * The "AI" content is generated deterministically here so the full approval
 * flow can be implemented and tested end-to-end without a live model. Swap the
 * generator functions for real provider calls when the runtime lands.
 */

function shorten(text: string, max = 56): string {
  const t = text.trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

function newId(): string {
  return "wf-" + Math.random().toString(36).slice(2, 10);
}

// ---------- Generators (placeholder "AI") ----------

function generateUnderstanding(prompt: string): Understanding {
  const clean = prompt.trim();
  return {
    summary: `You want to build: ${clean}`,
    goals: [
      `Deliver the core of "${shorten(clean)}"`,
      "Keep the solution simple and maintainable",
      "Validate the result with tests before shipping"
    ],
    assumptions: []
  };
}

function understandingQuestions(): Question[] {
  return [
    {
      id: "u-platform",
      text: "What is the primary target platform?",
      options: ["Web app", "Mobile app", "Desktop app", "API / backend"],
      allowOther: true
    },
    {
      id: "u-priority",
      text: "What matters most for this project?",
      options: ["Speed of delivery", "Robustness & testing", "Scalability"],
      allowOther: true
    }
  ];
}

function applyUnderstandingAnswers(
  understanding: Understanding,
  answers: Record<string, string>
): Understanding {
  const assumptions: string[] = [];
  if (answers["u-platform"]) {
    assumptions.push(`Target platform: ${answers["u-platform"]}`);
  }
  if (answers["u-priority"]) {
    assumptions.push(`Primary priority: ${answers["u-priority"]}`);
  }
  return { ...understanding, assumptions };
}

function planQuestions(): Question[] {
  return [
    {
      id: "p-stack",
      text: "Preferred technology stack?",
      options: ["TypeScript / Node", "Python", "Go", "No preference"],
      allowOther: true
    },
    {
      id: "p-split",
      text: "How should the work be organized?",
      options: ["By feature", "By layer", "By milestone"],
      allowOther: true
    }
  ];
}

function generatePlan(understanding: Understanding, answers: Record<string, string>): Plan {
  const stack = answers["p-stack"] || "the chosen stack";
  const split = answers["p-split"] || "By feature";
  const steps = [
    {
      id: "step-1",
      title: "Set up project & tooling",
      detail: `Initialize the project using ${stack}.`,
      subSteps: ["Initialize the repository", `Configure ${stack} toolchain`, "Add scripts and CI"]
    },
    {
      id: "step-2",
      title: "Model the domain",
      detail: `Outline modules and data (${split.toLowerCase()}).`,
      subSteps: ["Define core data structures", `Outline modules (${split.toLowerCase()})`]
    },
    {
      id: "step-3",
      title: "Implement core features",
      detail: "Build the features that satisfy the goals.",
      subSteps: understanding.goals.map((g) => `Implement: ${g}`)
    },
    {
      id: "step-4",
      title: "Add tests & validation",
      detail: "Cover the core behavior with tests.",
      subSteps: ["Write unit tests", "Verify each milestone"]
    },
    {
      id: "step-5",
      title: "Review & ship",
      detail: "Polish, review, and prepare for release.",
      subSteps: ["Code review", "Prepare release notes"]
    }
  ];
  return { steps };
}

/** Builds the final task hierarchy, linking every node to a requirement (goal). */
function buildTasks(plan: Plan, understanding: Understanding): TaskNode[] {
  const goals = understanding.goals.length ? understanding.goals : ["General requirement"];
  return plan.steps.map((step, i) => {
    const requirement = goals[i % goals.length];
    return {
      id: `task-${i + 1}`,
      title: step.title,
      requirement,
      children: step.subSteps.map((sub, j) => ({
        id: `task-${i + 1}-${j + 1}`,
        title: sub,
        requirement,
        children: []
      }))
    };
  });
}

// ---------- Transitions ----------

const EMPTY_UNDERSTANDING: Understanding = { summary: "", goals: [], assumptions: [] };

/** Transient session shown while the AI "analyzes" (stage = understanding). */
export function analyzingSession(prompt: string, base?: WorkflowSession): WorkflowSession {
  const id = base?.id ?? newId();
  return {
    ...(base ?? {
      id,
      prompt,
      stage: "understanding" as Stage,
      revision: 0,
      understanding: EMPTY_UNDERSTANDING,
      understandingApproved: false,
      understandingQuestions: [],
      understandingAnswers: {},
      plan: { steps: [] },
      planApproved: false,
      planQuestions: [],
      planAnswers: {},
      tasks: []
    }),
    prompt,
    stage: "understanding",
    state: "analyzing" as StageState
  };
}

/** Step 2–3: AI understands the prompt and asks clarification questions. */
export function startUnderstanding(prompt: string, base?: WorkflowSession): WorkflowSession {
  const understanding = generateUnderstanding(prompt);
  return {
    id: base?.id ?? newId(),
    prompt,
    stage: "understanding",
    state: "questions",
    revision: base?.revision ?? 0,
    understanding,
    understandingApproved: false,
    understandingQuestions: understandingQuestions(),
    understandingAnswers: {},
    plan: { steps: [] },
    planApproved: false,
    planQuestions: [],
    planAnswers: {},
    tasks: []
  };
}

/** User answers clarification questions → show understanding for review. */
export function answerUnderstanding(
  session: WorkflowSession,
  answers: Record<string, string>
): WorkflowSession {
  return {
    ...session,
    understandingAnswers: { ...session.understandingAnswers, ...answers },
    understanding: applyUnderstandingAnswers(session.understanding, {
      ...session.understandingAnswers,
      ...answers
    }),
    state: "review"
  };
}

/** Step 5: user edits the understanding and resubmits → re-analyze. */
export function changeUnderstanding(
  session: WorkflowSession,
  edited: Pick<Understanding, "summary" | "goals">
): WorkflowSession {
  return {
    ...session,
    revision: session.revision + 1,
    understanding: { summary: edited.summary, goals: edited.goals, assumptions: [] },
    understandingQuestions: understandingQuestions(),
    understandingAnswers: {},
    state: "questions"
  };
}

/** Step 6 → 7: approve understanding, generate the plan + planning questions. */
export function approveUnderstanding(
  session: WorkflowSession,
  edited: Pick<Understanding, "summary" | "goals">
): WorkflowSession {
  const understanding = applyUnderstandingAnswers(
    { summary: edited.summary, goals: edited.goals, assumptions: [] },
    session.understandingAnswers
  );
  return {
    ...session,
    understanding,
    understandingApproved: true,
    stage: "planning",
    state: "questions",
    plan: generatePlan(understanding, {}),
    planQuestions: planQuestions(),
    planAnswers: {}
  };
}

/** Transient session shown while the AI "creates" the plan (stage = planning). */
export function creatingSession(session: WorkflowSession): WorkflowSession {
  return { ...session, stage: "planning", state: "creating" };
}

/** User answers planning questions → regenerate plan → review. */
export function answerPlan(
  session: WorkflowSession,
  answers: Record<string, string>
): WorkflowSession {
  const merged = { ...session.planAnswers, ...answers };
  return {
    ...session,
    planAnswers: merged,
    plan: generatePlan(session.understanding, merged),
    state: "review"
  };
}

/** Step 10: user edits the plan and resubmits → re-plan questions. */
export function changePlan(session: WorkflowSession, edited: Plan): WorkflowSession {
  return {
    ...session,
    revision: session.revision + 1,
    plan: edited,
    planQuestions: planQuestions(),
    planAnswers: {},
    state: "questions"
  };
}

/** Step 11 → 12-15: approve plan, build the task hierarchy from it. */
export function approvePlan(session: WorkflowSession, edited: Plan): WorkflowSession {
  return {
    ...session,
    plan: edited,
    planApproved: true,
    stage: "completed",
    state: "done",
    tasks: buildTasks(edited, session.understanding)
  };
}
