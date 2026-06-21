import type {
  FileChange,
  Plan,
  PlanStep,
  Question,
  Understanding
} from "../workflow/types";

// ---------- Public interface ----------

/** Response shape from AI understanding generation. */
export interface AIUnderstandingResult {
  summary: string;
  goals: string[];
  questions: Question[];
}

/** Response shape from AI plan generation. */
export interface AIPlanResult {
  steps: PlanStep[];
  questions: Question[];
}

/** Response shape from AI task-change generation. */
export interface AITaskChangesResult {
  changes: FileChange[];
  explanation: string;
}

/** Project context fed to the AI during execution. */
export interface ProjectContext {
  tree: string;
  files: { path: string; content: string }[];
}

/**
 * Unified interface for AI provider interactions.
 * Each provider (Claude, OpenAI, Gemini, DeepSeek) implements this.
 */
export interface AIAdapter {
  readonly providerId: string;

  /** Phase 1: Analyze a prompt and return understanding + clarification questions. */
  generateUnderstanding(prompt: string): Promise<AIUnderstandingResult>;

  /** Phase 1 (re-analyze): Refine understanding based on answers and edited understanding. */
  refineUnderstanding(
    prompt: string,
    currentUnderstanding: Understanding,
    answers: Record<string, string>
  ): Promise<AIUnderstandingResult>;

  /** Phase 2: Generate an implementation plan from the approved understanding. */
  generatePlan(
    understanding: Understanding,
    answers: Record<string, string>
  ): Promise<AIPlanResult>;

  /** Phase 2 (re-plan): Refine the plan based on edits and new answers. */
  refinePlan(
    understanding: Understanding,
    currentPlan: Plan,
    answers: Record<string, string>
  ): Promise<AIPlanResult>;

  /** Phase 4: Generate file changes for a specific task. */
  generateTaskChanges(
    taskTitle: string,
    taskRequirement: string,
    plan: Plan,
    understanding: Understanding,
    context: ProjectContext
  ): Promise<AITaskChangesResult>;

  /** Phase 5: Generate completion recommendations. */
  generateRecommendations(
    understanding: Understanding,
    plan: Plan,
    completedTasks: string[],
    failedTasks: string[]
  ): Promise<string[]>;
}

// ---------- System prompts ----------

export const SYSTEM_PROMPTS = {
  understanding: `You are Agentix OS, an AI development assistant. Analyze the user's prompt and produce a JSON response with this exact shape:
{
  "summary": "A clear 1-2 sentence summary of what the user wants to build",
  "goals": ["Goal 1", "Goal 2", ...],
  "questions": [
    {
      "id": "q-1",
      "text": "A clarification question",
      "options": ["Option A", "Option B", "Option C"],
      "allowOther": true
    }
  ]
}
Ask 2-4 focused clarification questions with 3-5 predefined options each. Always set allowOther to true.
Return ONLY valid JSON, no markdown fences, no extra text.`,

  refineUnderstanding: `You are Agentix OS. The user has answered clarification questions about their project. Refine the understanding and ask any remaining questions. Return JSON:
{
  "summary": "Updated summary",
  "goals": ["Updated goals"],
  "questions": [{"id": "q-...", "text": "...", "options": [...], "allowOther": true}]
}
If no more questions are needed, return an empty questions array.
Return ONLY valid JSON.`,

  plan: `You are Agentix OS. Based on the approved understanding, generate a detailed implementation plan. Return JSON:
{
  "steps": [
    {
      "id": "step-1",
      "title": "Step title",
      "detail": "Detailed description of what this step accomplishes",
      "subSteps": ["Sub-task 1", "Sub-task 2"]
    }
  ],
  "questions": [
    {
      "id": "p-1",
      "text": "A planning question",
      "options": ["Option A", "Option B"],
      "allowOther": true
    }
  ]
}
Generate 4-8 concrete implementation steps with 2-5 sub-tasks each.
Ask 1-3 planning questions about technology choices or architecture preferences.
Return ONLY valid JSON.`,

  refinePlan: `You are Agentix OS. Refine the implementation plan based on user feedback and answers. Return JSON with the same shape as the plan generation (steps + questions). If no more questions are needed, return an empty questions array. Return ONLY valid JSON.`,

  taskChanges: `You are Agentix OS. You are executing a specific task from an approved plan. Based on the project context and task requirements, generate the file changes needed.
Return JSON:
{
  "changes": [
    {
      "operation": "create|modify|delete|rename|move",
      "filePath": "relative/path/to/file",
      "newPath": "new/path (only for rename/move)",
      "content": "full file content (for create/modify)",
      "diff": "unified diff showing changes (for modify)"
    }
  ],
  "explanation": "Brief explanation of what these changes accomplish"
}
Only include changes directly relevant to this task.
For modify operations, include a clear unified diff.
Return ONLY valid JSON.`,

  recommendations: `You are Agentix OS. The workflow is complete. Based on what was built and any failures, provide recommendations for next steps. Return a JSON array of strings: ["Recommendation 1", "Recommendation 2", ...]. Return ONLY valid JSON.`
};

// ---------- Helpers ----------

/**
 * Attempts to parse a JSON response from the AI. Handles common issues like
 * markdown fences, leading/trailing text, and partial JSON.
 */
export function parseAIResponse<T>(raw: string): T {
  let cleaned = raw.trim();

  // Strip markdown code fences
  const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // Try to find JSON object or array boundaries
  const jsonStart = cleaned.search(/[\[{]/);
  const jsonEndBrace = cleaned.lastIndexOf("}");
  const jsonEndBracket = cleaned.lastIndexOf("]");
  const jsonEnd = Math.max(jsonEndBrace, jsonEndBracket);

  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
  }

  return JSON.parse(cleaned) as T;
}

/** Ensure questions have valid structure with fallback defaults. */
export function sanitizeQuestions(questions: unknown): Question[] {
  if (!Array.isArray(questions)) return [];
  return questions
    .filter(
      (q): q is Question =>
        typeof q === "object" &&
        q !== null &&
        typeof (q as Question).id === "string" &&
        typeof (q as Question).text === "string" &&
        Array.isArray((q as Question).options)
    )
    .map((q) => ({
      ...q,
      allowOther: q.allowOther !== false
    }));
}
