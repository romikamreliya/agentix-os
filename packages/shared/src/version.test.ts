import { describe, expect, it } from "vitest";
import { SHARED_PACKAGE, VERSION } from "./index.js";

describe("@agentix/shared", () => {
  it("exposes the package name", () => {
    expect(SHARED_PACKAGE).toBe("@agentix/shared");
  });

  it("exposes a version", () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
