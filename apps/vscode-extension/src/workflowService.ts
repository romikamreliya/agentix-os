import * as engine from "./workflow/engine";
import type { Plan, Understanding, WorkflowSession } from "./workflow/types";
import type { KeyValueStore } from "./providerManager";
import type { SettingsService } from "./settings";

const SESSION_KEY = "agentix.workflow";

type UnderstandingEdit = Pick<Understanding, "summary" | "goals">;

/**
 * Orchestrates the approval workflow: applies engine transitions, persists the
 * session to the local store, drives the transient "analyzing"/"creating"
 * states, and (when plan confirmation is disabled) auto-approves review stages.
 *
 * UI-agnostic — webviews subscribe via onDidChange and render the snapshot.
 */
export class WorkflowService {
  private session?: WorkflowSession;
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly store: KeyValueStore,
    private readonly settings: SettingsService
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

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Step 1–3: start a new workflow from a prompt. */
  async start(prompt: string): Promise<void> {
    this.session = engine.analyzingSession(prompt);
    this.emit();
    await this.wait(900);
    await this.commit(engine.startUnderstanding(prompt));
  }

  /** Step 4: user answers clarification questions → review (or auto-approve). */
  async answerUnderstanding(answers: Record<string, string>): Promise<void> {
    if (!this.session) return;
    await this.commit(engine.answerUnderstanding(this.session, answers));
    if (!this.settings.get().confirmPlan && this.session) {
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
    await this.wait(900);
    if (!this.session) return;
    await this.commit(engine.changeUnderstanding(this.session, edited));
  }

  /** Step 6–7: approve understanding → AI creates the plan. */
  async approveUnderstanding(edited: UnderstandingEdit): Promise<void> {
    if (!this.session) return;
    this.session = engine.creatingSession(this.session);
    this.emit();
    await this.wait(1000);
    if (!this.session) return;
    await this.commit(engine.approveUnderstanding(this.session, edited));
  }

  /** Step 8: user answers planning questions → review (or auto-approve). */
  async answerPlan(answers: Record<string, string>): Promise<void> {
    if (!this.session) return;
    await this.commit(engine.answerPlan(this.session, answers));
    if (!this.settings.get().confirmPlan && this.session) {
      await this.approvePlan(this.session.plan);
    }
  }

  /** Step 10: user edits the plan and resubmits → re-plan. */
  async changePlan(edited: Plan): Promise<void> {
    if (!this.session) return;
    this.session = engine.creatingSession(this.session);
    this.emit();
    await this.wait(1000);
    if (!this.session) return;
    await this.commit(engine.changePlan(this.session, edited));
  }

  /** Step 11–15: approve plan → create the task hierarchy. */
  async approvePlan(edited: Plan): Promise<void> {
    if (!this.session) return;
    await this.commit(engine.approvePlan(this.session, edited));
  }

  /** Clears the workflow (new chat). */
  async clear(): Promise<void> {
    await this.commit(undefined);
  }
}
