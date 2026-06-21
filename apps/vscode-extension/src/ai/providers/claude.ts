import type {
  AIAdapter,
  AIPlanResult,
  AITaskChangesResult,
  AIUnderstandingResult,
  ProjectContext
} from "../aiAdapter";
import {
  SYSTEM_PROMPTS,
  parseAIResponse,
  sanitizeQuestions
} from "../aiAdapter";
import type { Plan, Understanding } from "../../workflow/types";

/**
 * Claude (Anthropic) AI adapter.
 * Uses the official @anthropic-ai/sdk package.
 */
export class ClaudeAdapter implements AIAdapter {
  readonly providerId = "claude";

  constructor(private readonly apiKey: string) {}

  private async chat(system: string, user: string): Promise<string> {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: this.apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: user }]
    });
    const block = response.content.find((b) => b.type === "text");
    return block && "text" in block ? block.text : "";
  }

  async generateUnderstanding(prompt: string): Promise<AIUnderstandingResult> {
    const raw = await this.chat(SYSTEM_PROMPTS.understanding, prompt);
    const parsed = parseAIResponse<AIUnderstandingResult>(raw);
    return {
      summary: parsed.summary || `Build: ${prompt.slice(0, 80)}`,
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      questions: sanitizeQuestions(parsed.questions)
    };
  }

  async refineUnderstanding(
    prompt: string,
    current: Understanding,
    answers: Record<string, string>
  ): Promise<AIUnderstandingResult> {
    const user = JSON.stringify({ originalPrompt: prompt, currentUnderstanding: current, answers });
    const raw = await this.chat(SYSTEM_PROMPTS.refineUnderstanding, user);
    const parsed = parseAIResponse<AIUnderstandingResult>(raw);
    return {
      summary: parsed.summary || current.summary,
      goals: Array.isArray(parsed.goals) ? parsed.goals : current.goals,
      questions: sanitizeQuestions(parsed.questions)
    };
  }

  async generatePlan(
    understanding: Understanding,
    answers: Record<string, string>
  ): Promise<AIPlanResult> {
    const user = JSON.stringify({ understanding, answers });
    const raw = await this.chat(SYSTEM_PROMPTS.plan, user);
    const parsed = parseAIResponse<AIPlanResult>(raw);
    return {
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      questions: sanitizeQuestions(parsed.questions)
    };
  }

  async refinePlan(
    understanding: Understanding,
    currentPlan: Plan,
    answers: Record<string, string>
  ): Promise<AIPlanResult> {
    const user = JSON.stringify({ understanding, currentPlan, answers });
    const raw = await this.chat(SYSTEM_PROMPTS.refinePlan, user);
    const parsed = parseAIResponse<AIPlanResult>(raw);
    return {
      steps: Array.isArray(parsed.steps) ? parsed.steps : currentPlan.steps,
      questions: sanitizeQuestions(parsed.questions)
    };
  }

  async generateTaskChanges(
    taskTitle: string,
    taskRequirement: string,
    plan: Plan,
    understanding: Understanding,
    context: ProjectContext
  ): Promise<AITaskChangesResult> {
    const user = JSON.stringify({
      task: { title: taskTitle, requirement: taskRequirement },
      plan,
      understanding,
      projectTree: context.tree,
      relevantFiles: context.files.slice(0, 10)
    });
    const raw = await this.chat(SYSTEM_PROMPTS.taskChanges, user);
    const parsed = parseAIResponse<AITaskChangesResult>(raw);
    return {
      changes: Array.isArray(parsed.changes) ? parsed.changes : [],
      explanation: parsed.explanation || ""
    };
  }

  async generateRecommendations(
    understanding: Understanding,
    plan: Plan,
    completedTasks: string[],
    failedTasks: string[]
  ): Promise<string[]> {
    const user = JSON.stringify({ understanding, plan, completedTasks, failedTasks });
    const raw = await this.chat(SYSTEM_PROMPTS.recommendations, user);
    const parsed = parseAIResponse<string[]>(raw);
    return Array.isArray(parsed) ? parsed : [];
  }
}
