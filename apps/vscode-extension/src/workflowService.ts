import * as engine from "./workflow/engine";
import type {
  FileChange,
  Plan,
  Understanding,
  WorkflowSession
} from "./workflow/types";
import type { KeyValueStore } from "./providerManager";
import type { ProviderManager, SecretStore } from "./providerManager";
import type { SettingsService } from "./settings";
import type { AIAdapter } from "./ai/aiAdapter";
import type { FileSystemService } from "./fileSystemService";
import { createAdapter } from "./ai/adapterFactory";

const SESSION_KEY = "agentix.workflow";

type UnderstandingEdit = Pick<Understanding, "summary" | "goals">;

/**
 * Orchestrates the approval workflow: applies engine transitions, persists the
 * session to the local store, integrates with AI providers for real generation,
 * and manages file system operations during execution.
 *
 * UI-agnostic — webviews subscribe via onDidChange and render the snapshot.
 */
export class WorkflowService {
  private session?: WorkflowSession;
  private readonly listeners = new Set<() => void>();
  private adapter?: AIAdapter;

  constructor(
    private readonly store: KeyValueStore,
    private readonly settings: SettingsService,
    private readonly providerManager: ProviderManager,
    private readonly secrets: SecretStore,
    private readonly fs: FileSystemService
  ) {
    this.session = store.get<WorkflowSession>(SESSION_KEY) ?? undefined;
  }

  onDidChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSession(): WorkflowSession | undefined {
    return this.session;
  }

  private emit(): void {
    for (const listener of [...this.listeners]) {
      listener();
    }
  }

  private async commit(session: WorkflowSession | undefined): Promise<void> {
    this.session = session;
    await this.store.update(SESSION_KEY, session);
    this.emit();
  }

  /**
   * Resolves the active AI adapter. Returns undefined if no provider is configured.
   */
  private async getAdapter(): Promise<AIAdapter | undefined> {
    const active = await this.providerManager.getActiveConfigured();
    if (!active) return undefined;

    // Re-create adapter if provider changed
    if (!this.adapter || this.adapter.providerId !== active.id) {
      const key = await this.secrets.get(`agentix.apiKey.${active.id}`);
      if (!key) return undefined;
      this.adapter = createAdapter(active.id, key);
    }
    return this.adapter;
  }

  // ===================================================================
  // Phase 1: Understanding
  // ===================================================================

  /** Step 1–3: start a new workflow from a prompt. */
  async start(prompt: string): Promise<void> {
    // Show analyzing state
    this.session = engine.analyzingSession(prompt);
    this.emit();

    const adapter = await this.getAdapter();
    if (!adapter) {
      // Fallback: use deterministic placeholder
      await this.commit(
        engine.startUnderstanding(prompt, {
          summary: `You want to build: ${prompt}`,
          goals: [
            `Deliver the core of "${prompt.slice(0, 56)}"`,
            "Keep the solution simple and maintainable",
            "Validate the result with tests before shipping"
          ],
          assumptions: []
        }, [
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
        ])
      );
      return;
    }

    try {
      const result = await adapter.generateUnderstanding(prompt);
      await this.commit(
        engine.startUnderstanding(prompt, {
          summary: result.summary,
          goals: result.goals,
          assumptions: []
        }, result.questions)
      );
    } catch (err) {
      // On error, fall back to basic understanding
      const msg = err instanceof Error ? err.message : String(err);
      await this.commit(
        engine.startUnderstanding(prompt, {
          summary: `You want to build: ${prompt}`,
          goals: [`Build: ${prompt.slice(0, 80)}`],
          assumptions: [`AI error: ${msg.slice(0, 100)}`]
        }, [])
      );
    }
  }

  /** Step 4: user answers clarification questions → review (or auto-approve). */
  async answerUnderstanding(answers: Record<string, string>): Promise<void> {
    if (!this.session) return;

    const adapter = await this.getAdapter();
    let refined: { understanding: Understanding; questions: import("./workflow/types").Question[] } | undefined;

    if (adapter) {
      try {
        const result = await adapter.refineUnderstanding(
          this.session.prompt,
          this.session.understanding,
          { ...this.session.understandingAnswers, ...answers }
        );
        refined = {
          understanding: {
            summary: result.summary,
            goals: result.goals,
            assumptions: []
          },
          questions: result.questions
        };
      } catch {
        // Fall through — use basic answer application
      }
    }

    await this.commit(engine.answerUnderstanding(this.session, answers, refined));

    // Auto-approve if plan confirmation is disabled
    if (!this.settings.get().confirmPlan && this.session?.state === "review") {
      await this.approveUnderstanding({
        summary: this.session.understanding.summary,
        goals: this.session.understanding.goals
      });
    }
  }

  /** Step 5: user edits understanding and resubmits → re-analyze. */
  async changeUnderstanding(edited: UnderstandingEdit): Promise<void> {
    if (!this.session) return;
    this.session = { ...this.session, state: "analyzing" };
    this.emit();

    const adapter = await this.getAdapter();
    let questions: import("./workflow/types").Question[] = [];

    if (adapter) {
      try {
        const result = await adapter.generateUnderstanding(
          `${this.session.prompt}\n\nRefined understanding:\nSummary: ${edited.summary}\nGoals: ${edited.goals.join(", ")}`
        );
        questions = result.questions;
      } catch {
        // Fallback to default questions
        questions = [
          {
            id: "u-platform",
            text: "What is the primary target platform?",
            options: ["Web app", "Mobile app", "Desktop app", "API / backend"],
            allowOther: true
          }
        ];
      }
    }

    if (!this.session) return;
    await this.commit(engine.changeUnderstanding(this.session, edited, questions));
  }

  /** Step 6–7: approve understanding → AI creates the plan. */
  async approveUnderstanding(edited: UnderstandingEdit): Promise<void> {
    if (!this.session) return;
    await this.commit(engine.approveUnderstanding(this.session, edited));

    // Now generate the plan
    const adapter = await this.getAdapter();
    if (!this.session) return;

    if (adapter) {
      try {
        const result = await adapter.generatePlan(this.session.understanding, {});
        await this.commit(
          engine.showPlan(this.session, { steps: result.steps }, result.questions)
        );
        return;
      } catch {
        // Fall through to placeholder
      }
    }

    // Fallback plan
    const fallbackPlan: Plan = {
      steps: this.session.understanding.goals.map((g, i) => ({
        id: `step-${i + 1}`,
        title: `Implement: ${g}`,
        detail: g,
        subSteps: [`Design ${g}`, `Build ${g}`, `Test ${g}`]
      }))
    };
    await this.commit(
      engine.showPlan(this.session, fallbackPlan, [
        {
          id: "p-stack",
          text: "Preferred technology stack?",
          options: ["TypeScript / Node", "Python", "Go", "No preference"],
          allowOther: true
        }
      ])
    );
  }

  /** Step 8: user answers planning questions → review (or auto-approve). */
  async answerPlan(answers: Record<string, string>): Promise<void> {
    if (!this.session) return;

    const adapter = await this.getAdapter();
    const merged = { ...this.session.planAnswers, ...answers };
    let refined: { plan: Plan; questions: import("./workflow/types").Question[] } | undefined;

    if (adapter) {
      try {
        const result = await adapter.refinePlan(
          this.session.understanding,
          this.session.plan,
          merged
        );
        refined = { plan: { steps: result.steps }, questions: result.questions };
      } catch {
        // Fall through
      }
    }

    await this.commit(engine.answerPlan(this.session, answers, refined));

    if (!this.settings.get().confirmPlan && this.session?.state === "review") {
      await this.approvePlan(this.session.plan);
    }
  }

  /** Step 10: user edits the plan and resubmits → re-plan. */
  async changePlan(edited: Plan): Promise<void> {
    if (!this.session) return;
    this.session = engine.creatingSession(this.session);
    this.emit();

    const adapter = await this.getAdapter();
    let questions: import("./workflow/types").Question[] = [];

    if (adapter) {
      try {
        const result = await adapter.refinePlan(
          this.session.understanding,
          edited,
          this.session.planAnswers
        );
        questions = result.questions;
      } catch {
        // Empty questions on error
      }
    }

    if (!this.session) return;
    await this.commit(engine.changePlan(this.session, edited, questions));
  }

  /** Step 11–13: approve plan → generate tasks. */
  async approvePlan(edited: Plan): Promise<void> {
    if (!this.session) return;
    await this.commit(engine.approvePlan(this.session, edited));

    // Generate task hierarchy
    if (!this.session) return;
    const tasks = engine.buildTasks(this.session.plan, this.session.understanding);
    await this.commit(engine.showTasks(this.session, tasks));
  }

  // ===================================================================
  // Phase 3: Task approval
  // ===================================================================

  /** Step 14–17: approve generated task structure → begin execution. */
  async approveTasks(): Promise<void> {
    if (!this.session) return;
    await this.commit(engine.approveTasks(this.session));

    // Auto-start first task
    if (this.session?.currentTaskId) {
      await this.executeNextTask();
    }
  }

  // ===================================================================
  // Phase 4: Execution
  // ===================================================================

  /** Execute the next pending task. */
  async executeNextTask(): Promise<void> {
    if (!this.session || this.session.executionControl !== "running") return;

    const taskId = this.session.currentTaskId;
    if (!taskId) {
      // All tasks done
      await this.completeWorkflow();
      return;
    }

    // Find the task node
    const allTasks = engine.flattenTasks(this.session.tasks);
    const task = allTasks.find((t) => t.id === taskId);
    if (!task) {
      await this.completeWorkflow();
      return;
    }

    // If this task has children, skip to the first child
    if (task.children.length > 0) {
      const firstChild = engine.findNextPendingTask(task.children);
      if (firstChild) {
        await this.commit(engine.startTask(this.session, firstChild.id));
        await this.executeNextTask();
        return;
      }
      // All children done — mark parent complete
      await this.commit(engine.completeTask(this.session, taskId));
      if (engine.allTasksDone(this.session.tasks)) {
        await this.completeWorkflow();
      } else {
        await this.executeNextTask();
      }
      return;
    }

    // Set task to in-progress
    await this.commit(engine.startTask(this.session, taskId));

    // Generate changes using AI
    const adapter = await this.getAdapter();
    if (!adapter || !this.session) {
      // No adapter — complete task with no changes
      await this.commit(engine.completeTask(this.session!, taskId));
      if (engine.allTasksDone(this.session!.tasks)) {
        await this.completeWorkflow();
      } else {
        await this.executeNextTask();
      }
      return;
    }

    try {
      // Build project context
      const treeText = await this.fs.getProjectTreeText();
      const context = { tree: treeText, files: [] as { path: string; content: string }[] };

      const result = await adapter.generateTaskChanges(
        task.title,
        task.requirement,
        this.session.plan,
        this.session.understanding,
        context
      );

      if (result.changes.length === 0) {
        // No changes needed — complete task
        await this.commit(engine.completeTask(this.session, taskId));
        if (engine.allTasksDone(this.session.tasks)) {
          await this.completeWorkflow();
        } else {
          await this.executeNextTask();
        }
        return;
      }

      // Enrich changes with original content and diffs
      const enriched: FileChange[] = [];
      for (const change of result.changes) {
        const enrichedChange = { ...change };
        if (change.operation === "modify" && change.content) {
          try {
            const orig = await this.fs.readFile(change.filePath);
            enrichedChange.originalContent = orig;
            enrichedChange.diff = this.fs.generateDiff(orig, change.content, change.filePath);
          } catch {
            // File might not exist yet
          }
        }
        enriched.push(enrichedChange);
      }

      // Propose changes for approval
      await this.commit(engine.proposeChanges(this.session, taskId, enriched));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await this.commit(engine.failTask(this.session, taskId, msg));
      if (engine.allTasksDone(this.session.tasks)) {
        await this.completeWorkflow();
      } else {
        await this.executeNextTask();
      }
    }
  }

  /** User approves proposed file changes → execute them. */
  async approveChanges(): Promise<void> {
    if (!this.session) return;
    const taskId = this.session.currentTaskId;
    const changes = [...this.session.pendingChanges];

    // Mark changes as approved in the session
    await this.commit(engine.approveChanges(this.session));

    // Execute each change
    for (const change of changes) {
      const result = await this.fs.executeChange(change);
      if (!result.ok && this.session) {
        await this.commit(
          engine.failTask(this.session, taskId ?? "", result.error ?? "File operation failed")
        );
        if (engine.allTasksDone(this.session.tasks)) {
          await this.completeWorkflow();
        } else {
          await this.executeNextTask();
        }
        return;
      }
      // Mark change as executed
      if (this.session) {
        const idx = this.session.allFileChanges.length - changes.length + changes.indexOf(change);
        await this.commit(engine.markChangeExecuted(this.session, idx));
      }
    }

    // Task complete
    if (this.session && taskId) {
      await this.commit(engine.completeTask(this.session, taskId));
      if (engine.allTasksDone(this.session.tasks)) {
        await this.completeWorkflow();
      } else {
        await this.executeNextTask();
      }
    }
  }

  /** User rejects proposed changes → fail the task. */
  async rejectChanges(): Promise<void> {
    if (!this.session || !this.session.currentTaskId) return;
    await this.commit(
      engine.failTask(this.session, this.session.currentTaskId, "Changes rejected by user")
    );
    if (engine.allTasksDone(this.session.tasks)) {
      await this.completeWorkflow();
    } else {
      await this.executeNextTask();
    }
  }

  /** Pause execution. */
  async pauseExecution(): Promise<void> {
    if (!this.session) return;
    await this.commit(engine.pauseExecution(this.session));
  }

  /** Resume execution from pause. */
  async resumeExecution(): Promise<void> {
    if (!this.session) return;
    await this.commit(engine.resumeExecution(this.session));
    await this.executeNextTask();
  }

  /** Skip the current task. */
  async skipCurrentTask(): Promise<void> {
    if (!this.session || !this.session.currentTaskId) return;
    await this.commit(engine.skipTask(this.session, this.session.currentTaskId));
    if (engine.allTasksDone(this.session.tasks)) {
      await this.completeWorkflow();
    } else {
      await this.executeNextTask();
    }
  }

  /** Retry a failed or skipped task. */
  async retryTask(taskId: string): Promise<void> {
    if (!this.session) return;
    await this.commit(engine.retryTask(this.session, taskId));
    if (this.session.executionControl === "running") {
      await this.executeNextTask();
    }
  }

  // ===================================================================
  // Phase 5: Completion
  // ===================================================================

  /** Generate summary and complete the workflow. */
  private async completeWorkflow(): Promise<void> {
    if (!this.session) return;

    const adapter = await this.getAdapter();
    let recommendations: string[] = [];

    if (adapter) {
      try {
        const allTasks = engine.flattenTasks(this.session.tasks);
        recommendations = await adapter.generateRecommendations(
          this.session.understanding,
          this.session.plan,
          allTasks.filter((t) => t.status === "completed").map((t) => t.title),
          allTasks.filter((t) => t.status === "failed").map((t) => t.title)
        );
      } catch {
        recommendations = ["Review all generated files for correctness", "Run tests to verify the implementation"];
      }
    } else {
      recommendations = ["Review all generated files for correctness", "Run tests to verify the implementation"];
    }

    await this.commit(engine.completeWorkflow(this.session, recommendations));
  }

  // ===================================================================
  // General
  // ===================================================================

  /** Clears the workflow (new chat). */
  async clear(): Promise<void> {
    this.adapter = undefined;
    await this.commit(undefined);
  }
}
