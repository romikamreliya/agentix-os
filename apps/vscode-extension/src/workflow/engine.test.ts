import { describe, expect, it } from "vitest";
import * as engine from "./engine";
import type { Plan, TaskNode, Understanding, WorkflowSession } from "./types";

// ---------- Helpers ----------

function basePrompt(): string {
  return "Create a todo app";
}

function baseUnderstanding(): Understanding {
  return {
    summary: "Build a todo app",
    goals: ["CRUD operations", "Persistent storage"],
    assumptions: []
  };
}

function baseQuestions() {
  return [
    { id: "q-1", text: "Platform?", options: ["Web", "Mobile"], allowOther: true }
  ];
}

function basePlan(): Plan {
  return {
    steps: [
      { id: "step-1", title: "Setup project", detail: "Init", subSteps: ["Install deps", "Create config"] },
      { id: "step-2", title: "Build features", detail: "Implement", subSteps: ["Add CRUD", "Add storage"] }
    ]
  };
}

function sessionAtUnderstandingReview(): WorkflowSession {
  const s = engine.startUnderstanding(basePrompt(), baseUnderstanding(), []);
  return { ...s, state: "review" };
}

function sessionAtPlanReview(): WorkflowSession {
  const s = sessionAtUnderstandingReview();
  const approved = engine.approveUnderstanding(s, { summary: s.understanding.summary, goals: s.understanding.goals });
  const withPlan = engine.showPlan(approved, basePlan(), []);
  return { ...withPlan, state: "review" };
}

function sessionWithTasks(): WorkflowSession {
  const s = sessionAtPlanReview();
  const approved = engine.approvePlan(s, s.plan);
  const tasks = engine.buildTasks(s.plan, s.understanding);
  return engine.showTasks(approved, tasks);
}

function sessionInExecution(): WorkflowSession {
  const s = sessionWithTasks();
  return engine.approveTasks(s);
}

// ---------- Phase 1: Understanding ----------

describe("Phase 1: Understanding", () => {
  it("analyzingSession creates a session in analyzing state", () => {
    const s = engine.analyzingSession(basePrompt());
    expect(s.stage).toBe("understanding");
    expect(s.state).toBe("analyzing");
    expect(s.prompt).toBe(basePrompt());
  });

  it("startUnderstanding with questions moves to questions state", () => {
    const s = engine.startUnderstanding(basePrompt(), baseUnderstanding(), baseQuestions());
    expect(s.stage).toBe("understanding");
    expect(s.state).toBe("questions");
    expect(s.understanding.summary).toBe("Build a todo app");
    expect(s.understandingQuestions).toHaveLength(1);
  });

  it("startUnderstanding with no questions moves to review", () => {
    const s = engine.startUnderstanding(basePrompt(), baseUnderstanding(), []);
    expect(s.state).toBe("review");
  });

  it("answerUnderstanding moves to review when no more questions", () => {
    const s = engine.startUnderstanding(basePrompt(), baseUnderstanding(), baseQuestions());
    const answered = engine.answerUnderstanding(s, { "q-1": "Web" });
    expect(answered.state).toBe("review");
    expect(answered.understandingAnswers["q-1"]).toBe("Web");
  });

  it("answerUnderstanding with refined questions stays in questions", () => {
    const s = engine.startUnderstanding(basePrompt(), baseUnderstanding(), baseQuestions());
    const refined = {
      understanding: baseUnderstanding(),
      questions: [{ id: "q-2", text: "Framework?", options: ["React", "Vue"], allowOther: true }]
    };
    const answered = engine.answerUnderstanding(s, { "q-1": "Web" }, refined);
    expect(answered.state).toBe("questions");
    expect(answered.understandingQuestions).toHaveLength(1);
    expect(answered.understandingQuestions[0].id).toBe("q-2");
  });

  it("changeUnderstanding increments revision", () => {
    const s = sessionAtUnderstandingReview();
    const changed = engine.changeUnderstanding(s, { summary: "Updated", goals: ["New goal"] }, []);
    expect(changed.revision).toBe(s.revision + 1);
    expect(changed.understanding.summary).toBe("Updated");
    expect(changed.state).toBe("review"); // no questions
  });

  it("approveUnderstanding moves to planning/creating", () => {
    const s = sessionAtUnderstandingReview();
    const approved = engine.approveUnderstanding(s, {
      summary: s.understanding.summary,
      goals: s.understanding.goals
    });
    expect(approved.stage).toBe("planning");
    expect(approved.state).toBe("creating");
    expect(approved.understandingApproved).toBe(true);
  });
});

// ---------- Phase 2: Planning ----------

describe("Phase 2: Planning", () => {
  it("showPlan with questions moves to questions state", () => {
    const s = sessionAtUnderstandingReview();
    const approved = engine.approveUnderstanding(s, { summary: "Build todo", goals: ["CRUD"] });
    const withPlan = engine.showPlan(approved, basePlan(), baseQuestions());
    expect(withPlan.stage).toBe("planning");
    expect(withPlan.state).toBe("questions");
    expect(withPlan.plan.steps).toHaveLength(2);
  });

  it("showPlan with no questions moves to review", () => {
    const s = sessionAtUnderstandingReview();
    const approved = engine.approveUnderstanding(s, { summary: "Build todo", goals: ["CRUD"] });
    const withPlan = engine.showPlan(approved, basePlan(), []);
    expect(withPlan.state).toBe("review");
  });

  it("answerPlan moves to review", () => {
    const s = sessionAtUnderstandingReview();
    const approved = engine.approveUnderstanding(s, { summary: "Build todo", goals: ["CRUD"] });
    const withPlan = engine.showPlan(approved, basePlan(), baseQuestions());
    const answered = engine.answerPlan(withPlan, { "q-1": "TypeScript" });
    expect(answered.state).toBe("review");
  });

  it("approvePlan moves to tasks/generating-tasks", () => {
    const s = sessionAtPlanReview();
    const approved = engine.approvePlan(s, s.plan);
    expect(approved.stage).toBe("tasks");
    expect(approved.state).toBe("generating-tasks");
    expect(approved.planApproved).toBe(true);
  });
});

// ---------- Phase 3: Task Generation ----------

describe("Phase 3: Task Generation", () => {
  it("buildTasks creates nodes from plan steps", () => {
    const tasks = engine.buildTasks(basePlan(), baseUnderstanding());
    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe("Setup project");
    expect(tasks[0].status).toBe("pending");
    expect(tasks[0].children).toHaveLength(2);
    expect(tasks[0].requirement).toBe("CRUD operations");
  });

  it("showTasks puts session in reviewing-tasks state", () => {
    const s = sessionWithTasks();
    expect(s.stage).toBe("tasks");
    expect(s.state).toBe("reviewing-tasks");
    expect(s.tasks).toHaveLength(2);
  });

  it("approveTasks moves to execution and sets first task", () => {
    const s = sessionInExecution();
    expect(s.stage).toBe("execution");
    expect(s.state).toBe("executing");
    expect(s.tasksApproved).toBe(true);
    expect(s.executionControl).toBe("running");
    expect(s.currentTaskId).toBeDefined();
  });

  it("changeTasks updates task titles, requirements, and sanitizes sequential IDs", () => {
    const s = sessionWithTasks();
    const modified: TaskNode[] = [
      {
        id: "task-1",
        title: "Modified setup",
        requirement: "Goal 1",
        status: "pending",
        fileChanges: [],
        children: [
          {
            id: "task-temp-1",
            title: "Modified sub-task",
            requirement: "Goal 1",
            status: "pending",
            fileChanges: [],
            children: []
          }
        ]
      }
    ];
    const updated = engine.changeTasks(s, modified);
    expect(updated.revision).toBe(s.revision + 1);
    expect(updated.tasks).toHaveLength(1);
    expect(updated.tasks[0].title).toBe("Modified setup");
    expect(updated.tasks[0].id).toBe("task-1");
    expect(updated.tasks[0].children).toHaveLength(1);
    expect(updated.tasks[0].children[0].title).toBe("Modified sub-task");
    expect(updated.tasks[0].children[0].id).toBe("task-1-1"); // ID sanitized
  });
});

// ---------- Phase 4: Execution ----------

describe("Phase 4: Execution", () => {
  it("startTask sets task to in-progress", () => {
    const s = sessionInExecution();
    const taskId = s.tasks[0].children[0].id; // first leaf task
    const started = engine.startTask(s, taskId);
    expect(started.currentTaskId).toBe(taskId);
    const flat = engine.flattenTasks(started.tasks);
    const task = flat.find((t) => t.id === taskId);
    expect(task?.status).toBe("in-progress");
  });

  it("proposeChanges sets pending changes and awaiting-approval state", () => {
    const s = sessionInExecution();
    const taskId = s.tasks[0].children[0].id;
    const started = engine.startTask(s, taskId);
    const changes = [
      { operation: "create" as const, filePath: "src/index.ts", content: "console.log('hello')" }
    ];
    const proposed = engine.proposeChanges(started, taskId, changes);
    expect(proposed.state).toBe("awaiting-approval");
    expect(proposed.pendingChanges).toHaveLength(1);
  });

  it("approveChanges clears pending and records changes", () => {
    const s = sessionInExecution();
    const taskId = s.tasks[0].children[0].id;
    const started = engine.startTask(s, taskId);
    const changes = [
      { operation: "create" as const, filePath: "src/index.ts", content: "code" }
    ];
    const proposed = engine.proposeChanges(started, taskId, changes);
    const approved = engine.approveChanges(proposed);
    expect(approved.pendingChanges).toHaveLength(0);
    expect(approved.allFileChanges).toHaveLength(1);
    expect(approved.allFileChanges[0].approved).toBe(true);
    expect(approved.allFileChanges[0].executed).toBe(false);
  });

  it("completeTask marks task as completed", () => {
    const s = sessionInExecution();
    const taskId = s.tasks[0].children[0].id;
    const completed = engine.completeTask(s, taskId);
    const flat = engine.flattenTasks(completed.tasks);
    const task = flat.find((t) => t.id === taskId);
    expect(task?.status).toBe("completed");
  });

  it("failTask marks task as failed with error", () => {
    const s = sessionInExecution();
    const taskId = s.tasks[0].children[0].id;
    const failed = engine.failTask(s, taskId, "Network error");
    const flat = engine.flattenTasks(failed.tasks);
    const task = flat.find((t) => t.id === taskId);
    expect(task?.status).toBe("failed");
    expect(task?.error).toBe("Network error");
  });

  it("skipTask marks task as skipped", () => {
    const s = sessionInExecution();
    const taskId = s.tasks[0].children[0].id;
    const skipped = engine.skipTask(s, taskId);
    const flat = engine.flattenTasks(skipped.tasks);
    const task = flat.find((t) => t.id === taskId);
    expect(task?.status).toBe("skipped");
  });

  it("retryTask resets task to pending", () => {
    const s = sessionInExecution();
    const taskId = s.tasks[0].children[0].id;
    const failed = engine.failTask(s, taskId, "err");
    const retried = engine.retryTask(failed, taskId);
    const flat = engine.flattenTasks(retried.tasks);
    const task = flat.find((t) => t.id === taskId);
    expect(task?.status).toBe("pending");
    expect(retried.currentTaskId).toBe(taskId);
  });

  it("pauseExecution sets paused state", () => {
    const s = sessionInExecution();
    const paused = engine.pauseExecution(s);
    expect(paused.executionControl).toBe("paused");
    expect(paused.state).toBe("paused");
  });

  it("resumeExecution sets running state", () => {
    const s = sessionInExecution();
    const paused = engine.pauseExecution(s);
    const resumed = engine.resumeExecution(paused);
    expect(resumed.executionControl).toBe("running");
    expect(resumed.state).toBe("executing");
  });
});

// ---------- Phase 5: Completion ----------

describe("Phase 5: Completion", () => {
  it("completeWorkflow builds summary", () => {
    const s = sessionInExecution();
    // Complete all leaf tasks
    let session = s;
    const leaves = engine.flattenTasks(s.tasks).filter((t) => t.children.length === 0);
    for (const leaf of leaves) {
      session = engine.completeTask(session, leaf.id);
    }

    const completed = engine.completeWorkflow(session, ["Add tests", "Deploy"]);
    expect(completed.stage).toBe("completed");
    expect(completed.state).toBe("summary");
    expect(completed.summary).toBeDefined();
    expect(completed.summary?.completedTasks.length).toBeGreaterThan(0);
    expect(completed.summary?.recommendations).toEqual(["Add tests", "Deploy"]);
  });

  it("allTasksDone returns true when all tasks are terminal", () => {
    const s = sessionInExecution();
    let session = s;
    const leaves = engine.flattenTasks(s.tasks).filter((t) => t.children.length === 0);
    for (const leaf of leaves) {
      session = engine.completeTask(session, leaf.id);
    }
    // Mark parents too
    for (const parent of s.tasks) {
      session = engine.completeTask(session, parent.id);
    }
    expect(engine.allTasksDone(session.tasks)).toBe(true);
  });

  it("allTasksDone returns false with pending tasks", () => {
    const s = sessionInExecution();
    expect(engine.allTasksDone(s.tasks)).toBe(false);
  });

  it("findNextPendingTask finds the first pending task", () => {
    const s = sessionInExecution();
    const next = engine.findNextPendingTask(s.tasks);
    expect(next).toBeDefined();
    expect(next?.status).toBe("pending");
  });
});
