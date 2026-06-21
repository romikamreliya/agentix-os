import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { LocalStore } from "./localStore";

describe("LocalStore", () => {
  let dir: string;
  let file: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "agentix-store-"));
    file = path.join(dir, "nested", "data.json");
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("returns undefined for missing keys and starts with no file", () => {
    const store = new LocalStore(file);
    expect(store.get("missing")).toBeUndefined();
    expect(fs.existsSync(file)).toBe(false);
  });

  it("persists values to disk and reloads them in a fresh instance", async () => {
    const store = new LocalStore(file);
    await store.update("agentix.activeProvider", "claude");
    await store.update("count", 3);

    expect(fs.existsSync(file)).toBe(true);

    const reloaded = new LocalStore(file);
    expect(reloaded.get("agentix.activeProvider")).toBe("claude");
    expect(reloaded.get<number>("count")).toBe(3);
  });

  it("deletes a key when updated with undefined", async () => {
    const store = new LocalStore(file);
    await store.update("k", "v");
    await store.update("k", undefined);
    expect(store.get("k")).toBeUndefined();
    expect(new LocalStore(file).get("k")).toBeUndefined();
  });

  it("tolerates a corrupt file by starting empty", () => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, "{ not json");
    const store = new LocalStore(file);
    expect(store.get("anything")).toBeUndefined();
  });
});
