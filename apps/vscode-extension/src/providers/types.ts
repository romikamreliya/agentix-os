/** Identifier for an AI provider. */
export type ProviderId = string;

/** Result of validating an API key against a provider's API. */
export interface ValidationResult {
  ok: boolean;
  error?: string;
}

/** Validation lifecycle state for a provider's stored key. */
export type ValidationStatus = "unknown" | "validating" | "valid" | "invalid";

/** Static definition of a supported AI provider. */
export interface ProviderDefinition {
  id: ProviderId;
  /** Display name shown in the UI (e.g. "Claude"). */
  label: string;
  /** Vendor / organization (e.g. "Anthropic"). */
  vendor: string;
  /** Where to obtain an API key. */
  docsUrl: string;
  /** Human-readable hint about the expected key shape. */
  keyHint: string;
  /** Cheap local check that the key is plausibly well-formed. */
  isLikelyValidFormat(key: string): boolean;
  /** Live authentication check using the provider's official API. */
  validateKey(key: string): Promise<ValidationResult>;
}

/** Snapshot of a provider's configuration state, sent to the webview. */
export interface ProviderStatus {
  id: ProviderId;
  label: string;
  vendor: string;
  keyHint: string;
  /** A key is stored in SecretStorage. */
  configured: boolean;
  /** Latest validation outcome. */
  status: ValidationStatus;
  /** This provider is the active selection. */
  active: boolean;
}
