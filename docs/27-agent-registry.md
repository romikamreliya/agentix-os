# Agent Registry

## Overview

The Agent Registry is responsible for managing all agents within Agentix OS.

It acts as the central directory for:

* Agent Registration
* Capability Registration
* Agent Discovery
* Agent Selection
* Agent Lifecycle Management

The Parent Agent uses the Agent Registry to locate and assign agents.

---

# Purpose

The Agent Registry provides:

```text id="gkn31r"
Agent Discovery

Capability Matching

Agent Selection

Agent Tracking

Future Extensibility
```

---

# Core Principle

Agents are selected by capabilities.

Not by hardcoded names.

---

## Bad

```text id="u44x7z"
if (type === "research") {
  use ResearchAgent
}
```

---

## Good

```text id="z8f30w"
Find Agent
With RESEARCH Capability
```

---

# Architecture

```text id="z4lbxg"
Parent Agent
      ↓
Agent Registry
      ↓
Agent Selection
      ↓
Agent Execution
```

---

# Responsibilities

The Agent Registry is responsible for:

```text id="7o9x0x"
Agent Registration

Capability Registration

Agent Lookup

Capability Lookup

Agent Lifecycle Tracking
```

---

# Not Responsible For

```text id="8t9oq0"
Business Logic

Workflow Execution

Database Queries

UI Rendering
```

---

# Agent Lifecycle

Every agent follows:

```text id="zj5nzk"
Registered
      ↓
Available
      ↓
Assigned
      ↓
Running
      ↓
Completed

or

Failed
```

---

# Agent Structure

Every agent should implement:

```ts id="0n3kfr"
interface IAgent {
  id: string;

  name: string;

  type: string;

  capabilities: AgentCapability[];

  execute(
    input: AgentInput
  ): Promise<AgentOutput>;
}
```

---

# Agent Capability

```ts id="f1kwr4"
interface AgentCapability {
  name: string;

  version: string;
}
```

---

# Example Capability

```json id="uv8m3w"
{
  "name": "RESEARCH",
  "version": "1.0.0"
}
```

---

# Capability Naming

Use:

```text id="94afwt"
UPPER_SNAKE_CASE
```

Examples:

```text id="gkj0kk"
DISCOVERY

RESEARCH

TECH_ANALYSIS

RISK_ANALYSIS

PLANNING

REVIEW

KNOWLEDGE_CAPTURE
```

---

# Agent Registration

Example:

```ts id="kh1vtv"
agentRegistry.register(
  researchAgent
);
```

---

# Registration Requirements

Every agent must provide:

```text id="h6s4fx"
Agent Id

Agent Name

Agent Type

Capabilities

Version
```

---

# Agent Registry Interface

```ts id="z8r4a7"
interface IAgentRegistry {
  register(
    agent: IAgent
  ): void;

  unregister(
    agentId: string
  ): void;

  getAgent(
    agentId: string
  ): IAgent | undefined;

  findByCapability(
    capability: string
  ): IAgent[];

  getAllAgents(): IAgent[];
}
```

---

# Agent Discovery

The Parent Agent should never directly instantiate agents.

Instead:

```text id="cm6x5q"
Capability
      ↓
Agent Registry
      ↓
Matching Agent
```

---

# Example

Request:

```text id="xw3xly"
RESEARCH
```

Registry:

```text id="ql9kgm"
Research Agent
```

Result:

```text id="1a9p86"
Research Agent Assigned
```

---

# Capability Matching

## Exact Match

Example:

```text id="t4yl73"
RESEARCH
```

returns:

```text id="oqkp3t"
Research Agent
```

---

## Multiple Matches

Example:

```text id="l34lbx"
RESEARCH
```

returns:

```text id="vv4r09"
Research Agent

Advanced Research Agent
```

---

# Selection Strategy

Preferred order:

```text id="h6jqgs"
Highest Capability Match

Highest Version

Highest Availability
```

---

# Agent Status

Supported statuses:

```text id="cf3w3l"
AVAILABLE

BUSY

OFFLINE

DISABLED
```

---

# Status Example

```json id="9zv6r2"
{
  "agentId": "research-agent",
  "status": "AVAILABLE"
}
```

---

# Agent Availability

Before assignment:

```text id="w8ij9q"
Check Status
      ↓
Check Capability
      ↓
Assign Agent
```

---

# Agent Assignment

Example:

```text id="8e5kpk"
Parent Agent
      ↓
Find Capability
      ↓
Assign Agent
```

---

# Registry Storage

MVP:

```text id="g0rzk5"
In Memory
```

---

Future:

```text id="vawt0r"
Database Persistence
```

---

# Agent Categories

## Core Agents

```text id="2ygb1j"
Parent Agent

Discovery Agent

Research Agent

Planning Agent

Review Agent

Knowledge Agent
```

---

## Future Agents

```text id="4g0kl7"
Blueprint Agent

Skill Agent

Risk Agent

Analytics Agent
```

---

# Agent Versioning

Every agent should define:

```text id="v7byf9"
Major

Minor

Patch
```

Example:

```text id="8s3q8m"
1.0.0
```

---

# Agent Health

Optional health tracking:

```text id="jlwm5f"
Last Execution

Success Rate

Failure Count
```

Not required for MVP.

---

# Parent Agent Integration

The Parent Agent uses:

```text id="8v1cn7"
findByCapability()
```

instead of:

```text id="t1mhnl"
new ResearchAgent()
```

---

# Runtime Engine Integration

Flow:

```text id="22s9wg"
Prompt
      ↓
Parent Agent
      ↓
Agent Registry
      ↓
Agent Selected
      ↓
Execution
```

---

# Security Rules

Agents must not:

```text id="2xg8lw"
Register Duplicate IDs

Override Existing Agents

Modify Registry Directly
```

without validation.

---

# Registry Events

Published events:

```text id="kqk4ly"
AgentRegistered

AgentUnregistered

AgentAssigned

AgentCompleted

AgentFailed
```

---

# Error Handling

When no matching agent exists:

Return:

```json id="8r1k26"
{
  "success": false,
  "error": "No matching capability found"
}
```

---

# MVP Capabilities

Required:

```text id="w0lfwv"
DISCOVERY

RESEARCH

PLANNING

REVIEW

KNOWLEDGE_CAPTURE
```

---

# Future Capabilities

```text id="i4qjzr"
BLUEPRINT_MANAGEMENT

SKILL_MANAGEMENT

ANALYTICS

RISK_MANAGEMENT
```

---

# Registry Rules

## Rule 1

Register agents through the registry.

---

## Rule 2

Select agents by capability.

---

## Rule 3

Never hardcode agent references.

---

## Rule 4

Validate capability matches.

---

## Rule 5

Track agent status.

---

# Agent Registry Summary

The Agent Registry acts as the central directory for all agents in Agentix OS.

It enables:

```text id="ql0xps"
Capability-Based Selection

Agent Discovery

Loose Coupling

Extensibility

Future Plugin Support
```

and ensures that the Parent Agent remains independent from specific agent implementations.
