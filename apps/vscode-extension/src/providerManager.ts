import type {
  ProviderDefinition,
  ProviderId,
  ProviderStatus,
  ValidationStatus
} from "./providers/types";

/** Minimal secret-storage contract (implemented by KeyStore over VS Code). */
export interface SecretStore {
  get(key: string): Promise<string | undefined>;
  store(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

/** Minimal key/value store (VS Code's Memento satisfies this). */
export interface KeyValueStore {
  get<T>(key: string): T | undefined;
  update(key: string, value: unknown): Thenable<void> | Promise<void>;
}

const ACTIVE_KEY = "agentix.activeProvider";
const STATUS_PREFIX = "agentix.validation.";
const secretKey = (id: ProviderId) => `agentix.apiKey.${id}`;

/**
 * Owns API-key configuration and active-provider selection.
 *
 * Keys live in SecretStorage; validation status and the active selection live in
 * a Memento. The manager is UI-agnostic — it exposes a change subscription so
 * any number of webviews can re-render when state changes.
 */
export class ProviderManager {
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly secrets: SecretStore,
    private readonly store: KeyValueStore,
    private readonly providers: ProviderDefinition[]
  ) {}

  /** Subscribe to state changes; returns an unsubscribe function. */
  onDidChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for (const listener of [...this.listeners]) {
      listener();
    }
  }

  getActive(): ProviderId | undefined {
    return this.store.get<ProviderId>(ACTIVE_KEY) ?? undefined;
  }

  private getStatus(id: ProviderId): ValidationStatus {
    return this.store.get<ValidationStatus>(STATUS_PREFIX + id) ?? "unknown";
  }

  private async setStatus(id: ProviderId, status: ValidationStatus): Promise<void> {
    await this.store.update(STATUS_PREFIX + id, status);
  }

  /** Returns the configuration snapshot for every provider. */
  async getStatuses(): Promise<ProviderStatus[]> {
    const active = this.getActive();
    const statuses: ProviderStatus[] = [];
    for (const provider of this.providers) {
      const configured = (await this.secrets.get(secretKey(provider.id))) !== undefined;
      statuses.push({
        id: provider.id,
        label: provider.label,
        vendor: provider.vendor,
        keyHint: provider.keyHint,
        configured,
        status: this.getStatus(provider.id),
        active: active === provider.id
      });
    }
    return statuses;
  }

  /** Returns the active provider's status, if it is configured. */
  async getActiveConfigured(): Promise<ProviderStatus | undefined> {
    const active = this.getActive();
    if (!active) {
      return undefined;
    }
    const statuses = await this.getStatuses();
    return statuses.find((s) => s.id === active && s.configured);
  }

  /** Selects the active provider. Only configured providers may be selected. */
  async setActive(id: ProviderId): Promise<{ ok: boolean; error?: string }> {
    const configured = (await this.secrets.get(secretKey(id))) !== undefined;
    if (!configured) {
      return { ok: false, error: "Add a valid API key before selecting this provider." };
    }
    await this.store.update(ACTIVE_KEY, id);
    this.emit();
    return { ok: true };
  }

  /**
   * Validates and (if valid) stores an API key. Invalid keys are not stored.
   * The first successfully configured provider becomes the active one.
   */
  async saveKey(id: ProviderId, key: string): Promise<{ ok: boolean; error?: string }> {
    const provider = this.providers.find((p) => p.id === id);
    if (!provider) {
      return { ok: false, error: "Unknown provider." };
    }
    const trimmed = key.trim();
    if (!trimmed) {
      return { ok: false, error: "API key is empty." };
    }
    if (!provider.isLikelyValidFormat(trimmed)) {
      return { ok: false, error: `That doesn't look like a ${provider.label} key (${provider.keyHint}).` };
    }

    await this.setStatus(id, "validating");
    this.emit();

    const result = await provider.validateKey(trimmed);
    if (!result.ok) {
      await this.setStatus(id, "invalid");
      this.emit();
      return { ok: false, error: result.error ?? "Validation failed." };
    }

    await this.secrets.store(secretKey(id), trimmed);
    await this.setStatus(id, "valid");
    if (!this.getActive()) {
      await this.store.update(ACTIVE_KEY, id);
    }
    this.emit();
    return { ok: true };
  }

  /** Removes a provider's key and clears it as the active selection if needed. */
  async removeKey(id: ProviderId): Promise<void> {
    await this.secrets.delete(secretKey(id));
    await this.setStatus(id, "unknown");
    if (this.getActive() === id) {
      const next = (await this.getStatuses()).find((s) => s.configured);
      await this.store.update(ACTIVE_KEY, next?.id);
    }
    this.emit();
  }

  /** Re-runs live validation against the stored key. */
  async revalidate(id: ProviderId): Promise<{ ok: boolean; error?: string }> {
    const provider = this.providers.find((p) => p.id === id);
    const key = await this.secrets.get(secretKey(id));
    if (!provider || !key) {
      return { ok: false, error: "No key configured for this provider." };
    }
    await this.setStatus(id, "validating");
    this.emit();
    const result = await provider.validateKey(key);
    await this.setStatus(id, result.ok ? "valid" : "invalid");
    this.emit();
    return result;
  }
}
