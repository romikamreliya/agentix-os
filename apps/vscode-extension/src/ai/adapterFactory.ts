import type { AIAdapter } from "./aiAdapter";
import { ClaudeAdapter } from "./providers/claude";
import { OpenAIAdapter } from "./providers/openai";
import { GeminiAdapter } from "./providers/gemini";
import { DeepSeekAdapter } from "./providers/deepseek";

/**
 * Creates an AIAdapter for the given provider using the supplied API key.
 * Throws if the provider ID is not recognized.
 */
export function createAdapter(providerId: string, apiKey: string): AIAdapter {
  switch (providerId) {
    case "claude":
      return new ClaudeAdapter(apiKey);
    case "openai":
      return new OpenAIAdapter(apiKey);
    case "gemini":
      return new GeminiAdapter(apiKey);
    case "deepseek":
      return new DeepSeekAdapter(apiKey);
    default:
      throw new Error(`Unknown AI provider: ${providerId}`);
  }
}
