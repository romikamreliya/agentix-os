/**
 * Enforces the package dependency hierarchy from docs/31-package-dependencies.md:
 *   shared -> core -> database -> services -> runtime -> agents -> vscode-extension
 *   ai -> (shared, core) only
 * Dependencies flow one direction only. No reverse imports. No cycles.
 *
 * This check is load-bearing under npm workspaces: npm hoists to a flat
 * node_modules, so the package manager does not prevent phantom/reverse imports.
 */

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular dependencies are forbidden.",
      from: {},
      to: { circular: true }
    },
    {
      name: "shared-is-foundation",
      severity: "error",
      comment: "shared must not depend on any other workspace package.",
      from: { path: "^packages/shared/" },
      to: {
        path: "^packages/(core|database|services|runtime|agents|ai)/"
      }
    },
    {
      name: "core-only-shared",
      severity: "error",
      comment: "core may only depend on shared.",
      from: { path: "^packages/core/" },
      to: { path: "^packages/(database|services|runtime|agents|ai)/" }
    },
    {
      name: "database-no-upward",
      severity: "error",
      comment: "database may depend on shared, core only.",
      from: { path: "^packages/database/" },
      to: { path: "^packages/(services|runtime|agents|ai)/" }
    },
    {
      name: "services-no-upward",
      severity: "error",
      comment: "services may depend on shared, core, database only.",
      from: { path: "^packages/services/" },
      to: { path: "^packages/(runtime|agents|ai)/" }
    },
    {
      name: "runtime-no-upward",
      severity: "error",
      comment: "runtime may depend on shared, core, services only.",
      from: { path: "^packages/runtime/" },
      to: { path: "^packages/(agents|ai)/" }
    },
    {
      name: "agents-no-ai-no-app",
      severity: "error",
      comment: "agents may depend on shared, core, services, runtime only.",
      from: { path: "^packages/agents/" },
      to: { path: "^packages/ai/" }
    },
    {
      name: "ai-only-shared-core",
      severity: "error",
      comment: "ai may depend on shared, core only.",
      from: { path: "^packages/ai/" },
      to: { path: "^packages/(database|services|runtime|agents)/" }
    },
    {
      name: "no-package-depends-on-app",
      severity: "error",
      comment: "No package may depend on the vscode-extension app.",
      from: { path: "^packages/" },
      to: { path: "^apps/" }
    }
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "types", "node", "default"]
    }
  }
};
