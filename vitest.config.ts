import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const r = (p: string): string => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@agentix/shared": r("./packages/shared/src/index.ts"),
      "@agentix/core": r("./packages/core/src/index.ts"),
      "@agentix/database": r("./packages/database/src/index.ts"),
      "@agentix/services": r("./packages/services/src/index.ts"),
      "@agentix/runtime": r("./packages/runtime/src/index.ts"),
      "@agentix/agents": r("./packages/agents/src/index.ts"),
      "@agentix/ai": r("./packages/ai/src/index.ts")
    }
  },
  test: {
    globals: true,
    environment: "node",
    include: ["packages/**/*.test.ts", "apps/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage"
    }
  }
});
