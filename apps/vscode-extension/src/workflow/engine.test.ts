import { describe, it, expect } from "vitest";
import {
  startUnderstanding,
  answerUnderstanding,
  changeUnderstanding,
  approveUnderstanding,
  answerPlan,
  changePlan,
  approvePlan
} from "./engine";
import type { TaskNode } from "./types";

function countLeaves(nodes: TaskNode[]): number {
  return nodes.reduce(
    (n, node) => n + (node.children.length ? countLeaves(node.children) : 1),
    0
  );
}

describe("workflow engine — understanding stage", () => {
  it("generates understanding and option-based questions with an Other slot", () => {
    const s = startUnderstanding("Build a todo app");
    expect(s.stage).toBe("understanding");
    expect(s.state).toBe("questions");
    expect(s.understanding.summary).toContain("Build a todo app");
    expect(s.understandingQuestions.length).toBeGreaterThan(0);
    for (const q of s.understandingQuestions) {
      expect(q.options.length).toBeGreaterThan(0);
      expect(q.allowOther).toBe(true);
    }
  });

  it("reflects clarification answers in the understanding under review", () => {
    let s = startUnderstanding("Build a todo app");
    s = answerUnderstanding(s, { "u-platform": "Web app", "u-priority": "Robustness & testing" });
    expect(s.state).toBe("review");
    expect(s.understanding.assumptions).toContain("Target platform: Web app");
    expect(s.understanding.assumptions).toContain("Primary priority: Robustness & testing");
  });

  it("loops back to questions on a user change and bumps the revision", () => {
    let s = startUnderstanding("Build a todo app");
    s = answerUnderstanding(s, { "u-platform": "Web app" });
    const edited = { summary: "You want a CLI todo tool", goals: ["Fast capture", "Local storage"] };
    s = changeUnderstanding(s, edited);
    expect(s.state).toBe("questions");
    expect(s.revision).toBe(1);
    expect(s.understanding.summary).toBe("You want a CLI todo tool");
    expect(s.understanding.goals).toEqual(["Fast capture", "Local storage"]);
    expect(s.understandingApproved).toBe(false);
  });

  it("approving moves to the planning stage with a plan and planning questions", () => {
    let s = startUnderstanding("Build a todo app");
    s = answerUnderstanding(s, { "u-platform": "Web app" });
    s = approveUnderstanding(s, { summary: s.understanding.summary, goals: s.understanding.goals });
    expect(s.understandingApproved).toBe(true);
    expect(s.stage).toBe("planning");
    expect(s.state).toBe("questions");
    expect(s.plan.steps.length).toBeGreaterThan(0);
    expect(s.planQuestions.every((q) => q.allowOther)).toBe(true);
  });
});

describe("workflow engine — planning stage", () => {
  function approvedUnderstanding() {
    let s = startUnderstanding("Build a todo app");
    s = answerUnderstanding(s, { "u-platform": "Web app" });
    return approveUnderstanding(s, { summary: s.understanding.summary, goals: s.understanding.goals });
  }

  it("regenerates the plan from planning answers and shows it for review", () => {
    let s = approvedUnderstanding();
    s = answerPlan(s, { "p-stack": "Go", "p-split": "By milestone" });
    expect(s.state).toBe("review");
    const text = JSON.stringify(s.plan);
    expect(text).toContain("Go");
    expect(text.toLowerCase()).toContain("by milestone");
  });

  it("loops back on a plan change and bumps the revision", () => {
    let s = approvedUnderstanding();
    s = answerPlan(s, {});
    const edited = {
      steps: [{ id: "step-1", title: "Custom step", detail: "x", subSteps: ["a", "b"] }]
    };
    s = changePlan(s, edited);
    expect(s.state).toBe("questions");
    expect(s.revision).toBe(1);
    expect(s.plan.steps[0].title).toBe("Custom step");
    expect(s.planApproved).toBe(false);
  });
});

describe("workflow engine — task hierarchy", () => {
  it("builds tasks/sub-tasks from the approved plan, reflecting user edits", () => {
    let s = startUnderstanding("Build a todo app");
    s = answerUnderstanding(s, { "u-platform": "Web app" });
    s = approveUnderstanding(s, { summary: s.understanding.summary, goals: s.understanding.goals });
    s = answerPlan(s, {});

    const editedPlan = {
      steps: [
        { id: "step-1", title: "Scaffold", detail: "", subSteps: ["init repo", "add config"] },
        { id: "step-2", title: "Ship", detail: "", subSteps: ["release"] }
      ]
    };
    s = approvePlan(s, editedPlan);

    expect(s.stage).toBe("completed");
    expect(s.state).toBe("done");
    expect(s.planApproved).toBe(true);

    // One task per edited step; sub-tasks per sub-step (edits reflected).
    expect(s.tasks.map((t) => t.title)).toEqual(["Scaffold", "Ship"]);
    expect(s.tasks[0].children.map((c) => c.title)).toEqual(["init repo", "add config"]);
    expect(countLeaves(s.tasks)).toBe(3);

    // Every node links to a requirement (traceability).
    for (const task of s.tasks) {
      expect(task.requirement).toBeTruthy();
      for (const child of task.children) {
        expect(child.requirement).toBe(task.requirement);
      }
    }
  });
});
