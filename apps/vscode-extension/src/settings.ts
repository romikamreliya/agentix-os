import type { KeyValueStore } from "./providerManager";

/** User-configurable preferences, persisted in the local data store. */
export interface AgentixSettings {
  /** Open the home as a panel beside the editor on startup. */
  autoOpenPanel: boolean;
  /** Reveal the Secondary Side Bar on startup. */
  revealRightSection: boolean;
  /** Require plan approval before implementation. */
  confirmPlan: boolean;
}

export const SETTING_DEFAULTS: AgentixSettings = {
  autoOpenPanel: true,
  revealRightSection: true,
  confirmPlan: true
};

const PREFIX = "agentix.settings.";

/** Typed, defaulted access to preferences with a change subscription. */
export class SettingsService {
  private readonly listeners = new Set<() => void>();

  constructor(private readonly store: KeyValueStore) {}

  onDidChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for (const listener of [...this.listeners]) {
      listener();
    }
  }

  get(): AgentixSettings {
    return {
      autoOpenPanel: this.read("autoOpenPanel"),
      revealRightSection: this.read("revealRightSection"),
      confirmPlan: this.read("confirmPlan")
    };
  }

  private read<K extends keyof AgentixSettings>(key: K): AgentixSettings[K] {
    const value = this.store.get<AgentixSettings[K]>(PREFIX + key);
    return value === undefined ? SETTING_DEFAULTS[key] : value;
  }

  async set<K extends keyof AgentixSettings>(key: K, value: AgentixSettings[K]): Promise<void> {
    await this.store.update(PREFIX + key, value);
    this.emit();
  }
}
