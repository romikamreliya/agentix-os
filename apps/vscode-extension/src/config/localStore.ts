import * as fs from "fs";
import * as path from "path";
import type { KeyValueStore } from "../providerManager";

/**
 * A KeyValueStore backed by a local JSON file on disk.
 *
 * Replaces VS Code's globalState Memento so all non-secret data (active provider,
 * validation status, preferences) is persisted to a plain, inspectable local
 * file. API keys are NOT stored here — those stay in SecretStorage.
 */
export class LocalStore implements KeyValueStore {
  private data: Record<string, unknown> = {};

  constructor(private readonly filePath: string) {
    try {
      this.data = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
    } catch {
      // Missing or unreadable file → start empty; it's written on first update.
      this.data = {};
    }
  }

  get<T>(key: string): T | undefined {
    return this.data[key] as T | undefined;
  }

  async update(key: string, value: unknown): Promise<void> {
    if (value === undefined) {
      delete this.data[key];
    } else {
      this.data[key] = value;
    }
    await fs.promises.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.promises.writeFile(this.filePath, JSON.stringify(this.data, null, 2), "utf8");
  }

  /** Absolute path of the backing file (for display in the UI). */
  get location(): string {
    return this.filePath;
  }
}
