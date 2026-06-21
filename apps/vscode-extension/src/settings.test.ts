import { describe, it, expect } from "vitest";
import { SettingsService, SETTING_DEFAULTS } from "./settings";
import type { KeyValueStore } from "./providerManager";

class MemoryStore implements KeyValueStore {
  private map = new Map<string, unknown>();
  get<T>(key: string): T | undefined {
    return this.map.get(key) as T | undefined;
  }
  update(key: string, value: unknown) {
    if (value === undefined) this.map.delete(key);
    else this.map.set(key, value);
    return Promise.resolve();
  }
}

describe("SettingsService", () => {
  it("returns defaults when nothing is stored", () => {
    const s = new SettingsService(new MemoryStore());
    expect(s.get()).toEqual(SETTING_DEFAULTS);
  });

  it("persists and reads back an overridden value", async () => {
    const store = new MemoryStore();
    const s = new SettingsService(store);
    await s.set("confirmPlan", false);
    expect(s.get().confirmPlan).toBe(false);
    // Other settings keep their defaults.
    expect(s.get().autoOpenPanel).toBe(true);
    // A fresh service over the same store sees the change.
    expect(new SettingsService(store).get().confirmPlan).toBe(false);
  });

  it("notifies subscribers and unsubscribes cleanly", async () => {
    const s = new SettingsService(new MemoryStore());
    let count = 0;
    const off = s.onDidChange(() => count++);
    await s.set("autoOpenPanel", false);
    expect(count).toBe(1);
    off();
    await s.set("autoOpenPanel", true);
    expect(count).toBe(1);
  });
});
