import type { ProviderDefinition, ValidationResult } from "./types";

/**
 * Maps an SDK / HTTP error to a friendly validation result.
 * Auth failures mean the key is invalid; rate limits mean the key authenticated
 * fine; anything else is surfaced as-is so the user can act on it.
 */
function classifyError(error: unknown): ValidationResult {
  const status =
    (error as { status?: number; statusCode?: number })?.status ??
    (error as { statusCode?: number })?.statusCode;

  if (status === 401 || status === 403) {
    return { ok: false, error: "Authentication failed — the API key is invalid." };
  }
  if (status === 429) {
    // Rate limited, but the key authenticated successfully.
    return { ok: true };
  }

  const message =
    (error as { message?: string })?.message ?? String(error ?? "Unknown error");
  if (/fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|network|getaddrinfo/i.test(message)) {
    return { ok: false, error: "Network error — could not reach the provider." };
  }
  return { ok: false, error: message.slice(0, 200) };
}

/** Validates a key against any OpenAI-compatible API (OpenAI, DeepSeek). */
async function validateOpenAICompatible(
  apiKey: string,
  baseURL?: string
): Promise<ValidationResult> {
  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey, baseURL });
    await client.models.list();
    return { ok: true };
  } catch (error) {
    return classifyError(error);
  }
}

/** Validates an Anthropic key via the official SDK. */
async function validateAnthropic(apiKey: string): Promise<ValidationResult> {
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });
    await client.models.list();
    return { ok: true };
  } catch (error) {
    return classifyError(error);
  }
}

/** Validates a Google Gemini key via the official Generative Language API. */
async function validateGemini(apiKey: string): Promise<ValidationResult> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
    );
    if (res.ok) {
      return { ok: true };
    }
    if (res.status === 429) {
      return { ok: true };
    }
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      return { ok: false, error: "Authentication failed — the API key is invalid." };
    }
    return { ok: false, error: `Provider returned HTTP ${res.status}.` };
  } catch (error) {
    return classifyError(error);
  }
}

/** All supported AI providers, in display order. */
export const PROVIDERS: ProviderDefinition[] = [
  {
    id: "claude",
    label: "Claude",
    vendor: "Anthropic",
    docsUrl: "https://console.anthropic.com/settings/keys",
    keyHint: "Starts with sk-ant-",
    isLikelyValidFormat: (key) => key.startsWith("sk-ant-") && key.length > 20,
    validateKey: validateAnthropic
  },
  {
    id: "openai",
    label: "GPT",
    vendor: "OpenAI",
    docsUrl: "https://platform.openai.com/api-keys",
    keyHint: "Starts with sk-",
    isLikelyValidFormat: (key) => key.startsWith("sk-") && key.length > 20,
    validateKey: (key) => validateOpenAICompatible(key)
  },
  {
    id: "gemini",
    label: "Gemini",
    vendor: "Google",
    docsUrl: "https://aistudio.google.com/app/apikey",
    keyHint: "Starts with AIza",
    isLikelyValidFormat: (key) => key.startsWith("AIza") && key.length > 30,
    validateKey: validateGemini
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    vendor: "DeepSeek",
    docsUrl: "https://platform.deepseek.com/api_keys",
    keyHint: "Starts with sk-",
    isLikelyValidFormat: (key) => key.startsWith("sk-") && key.length > 20,
    validateKey: (key) => validateOpenAICompatible(key, "https://api.deepseek.com")
  }
];
