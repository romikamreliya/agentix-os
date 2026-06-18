export const RUNTIME_PACKAGE = "@agentix/runtime";

/**
 * Runtime engine, event bus, command bus, context manager, workflow
 * engine, memory/token engines, and in-process queue are added from
 * Phase 4 onward. Runtime depends on agents only through interfaces in
 * @agentix/core (dependency inversion), never by importing @agentix/agents.
 */
