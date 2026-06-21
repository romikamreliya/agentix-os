import { describe, it, expect, beforeEach } from "vitest";
import { ProviderManager, type SecretStore, type KeyValueStore } from "./providerManager";
import type { ProviderDefinition, ValidationResult } from "./providers/types";

class MemorySecrets implements SecretStore {
  private map = new Map<string, string>();
  get(key: string) {
    return Promise.resolve(this.map.get(key));
  }
  store(key: string, value: string) {
    this.map.set(key, value);
    return Promise.resolve();
  }
  delete(key: string) {
    this.map.delete(key);
    return Promise.resolve();
  }
}

class MemoryStore implements KeyValueStore {
  private map = new Map<string, unknown>();
  get<T>(key: string): T | undefined {
    return this.map.get(key) as T | undefined;
  }
  update(key: string, value: unknown) {
    if (value === undefined) {
      this.map.delete(key);
    } else {
      this.map.set(key, value);
    }
    return Promise.resolve();
  }
}

/** Builds a fake provider whose validation result is controllable. */
function fakeProvider(id: string, result: ValidationResult, format = true): ProviderDefinition {
  return {
    id,
    label: id.toUpperCase(),
    vendor: "Test",
    docsUrl: "",
    keyHint: "any",
    isLikelyValidFormat: () => format,
    validateKey: () => Promise.resolve(result)
  };
}

describe("ProviderManager", () => {
  let secrets: MemorySecrets;
  let store: MemoryStore;

  beforeEach(() => {
    secrets = new MemorySecrets();
    store = new MemoryStore();
  });

  function manager(providers: ProviderDefinition[]) {
    return new ProviderManager(secrets, store, providers);
  }

  it("starts with no configured providers and no active selection", async () => {
    const m = manager([fakeProvider("a", { ok: true })]);
    const statuses = await m.getStatuses();
    expect(statuses[0].configured).toBe(false);
    expect(statuses[0].active).toBe(false);
    expect(m.getActive()).toBeUndefined();
  });

  it("stores a valid key, marks it valid, and makes it active", async () => {
    const m = manager([fakeProvider("a", { ok: true })]);
    const result = await m.saveKey("a", "good-key");
    expect(result.ok).toBe(true);

    const statuses = await m.getStatuses();
    expect(statuses[0].configured).toBe(true);
    expect(statuses[0].status).toBe("valid");
    expect(statuses[0].active).toBe(true);
    expect(m.getActive()).toBe("a");
  });

  it("does not store an invalid key", async () => {
    const m = manager([fakeProvider("a", { ok: false, error: "bad key" })]);
    const result = await m.saveKey("a", "bad-key");
    expect(result.ok).toBe(false);
    expect(result.error).toBe("bad key");

    const statuses = await m.getStatuses();
    expect(statuses[0].configured).toBe(false);
    expect(statuses[0].status).toBe("invalid");
    expect(m.getActive()).toBeUndefined();
  });

  it("rejects keys that fail the local format check without calling the API", async () => {
    let validated = false;
    const provider: ProviderDefinition = {
      ...fakeProvider("a", { ok: true }, false),
      validateKey: () => {
        validated = true;
        return Promise.resolve({ ok: true });
      }
    };
    const m = manager([provider]);
    const result = await m.saveKey("a", "wrong-shape");
    expect(result.ok).toBe(false);
    expect(validated).toBe(false);
  });

  it("only allows selecting configured providers", async () => {
    const m = manager([fakeProvider("a", { ok: true }), fakeProvider("b", { ok: true })]);
    const denied = await m.setActive("b");
    expect(denied.ok).toBe(false);

    await m.saveKey("b", "good-key");
    const allowed = await m.setActive("b");
    expect(allowed.ok).toBe(true);
    expect(m.getActive()).toBe("b");
  });

  it("keeps the first configured provider active when a second is added", async () => {
    const m = manager([fakeProvider("a", { ok: true }), fakeProvider("b", { ok: true })]);
    await m.saveKey("a", "good-key");
    await m.saveKey("b", "good-key");
    expect(m.getActive()).toBe("a");
  });

  it("clears the active selection when the active key is removed", async () => {
    const m = manager([fakeProvider("a", { ok: true }), fakeProvider("b", { ok: true })]);
    await m.saveKey("a", "good-key");
    await m.saveKey("b", "good-key");
    await m.setActive("b");

    await m.removeKey("b");
    // Falls back to the other configured provider.
    expect(m.getActive()).toBe("a");

    await m.removeKey("a");
    expect(m.getActive()).toBeUndefined();
  });

  it("notifies subscribers on change and stops after unsubscribe", async () => {
    const m = manager([fakeProvider("a", { ok: true })]);
    let count = 0;
    const off = m.onDidChange(() => count++);
    await m.saveKey("a", "good-key"); // validating + valid → 2 emits
    expect(count).toBeGreaterThanOrEqual(2);

    const prev = count;
    off();
    await m.removeKey("a");
    expect(count).toBe(prev);
  });

  it("getActiveConfigured returns the active provider only when configured", async () => {
    const m = manager([fakeProvider("a", { ok: true })]);
    expect(await m.getActiveConfigured()).toBeUndefined();
    await m.saveKey("a", "good-key");
    const active = await m.getActiveConfigured();
    expect(active?.id).toBe("a");
  });
});
