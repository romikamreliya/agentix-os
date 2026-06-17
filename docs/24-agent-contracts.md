# Agent Contracts

## Overview

This document defines the official contracts for all agents within Agentix OS.

An Agent Contract specifies:

* Responsibilities
* Inputs
* Outputs
* Capabilities
* Restrictions
* Events
* Success Criteria

Agent contracts ensure consistency and prevent overlap between agents.

---

# Core Principles

## Principle 1

Every agent has a single primary responsibility.

---

## Principle 2

Agents may recommend.

Agents may not approve.

---

## Principle 3

Agents communicate through the Parent Agent.

---

## Principle 4

Agents must produce structured outputs.

---

# Standard Agent Contract

All agents implement:

```ts
interface IAgent {
  id: string;
  name: string;
  type: string;

  execute(
    input: AgentInput
  ): Promise<AgentOutput>;
}
```

---

# Standard Input

```ts
interface AgentInput {
  workflowId: string;

  projectId?: string;

  context: unknown;

  instructions: string;
}
```

---

# Standard Output

```ts
interface AgentOutput {
  success: boolean;

  summary: string;

  findings?: unknown[];

  risks?: unknown[];

  recommendations?: unknown[];

  metadata?: Record<string, unknown>;
}
```

---

# Parent Agent

## Purpose

Central coordinator.

---

## Responsibilities

```text
Prompt Classification

Workflow Selection

Agent Selection

Context Coordination

Progress Tracking
```

---

## Inputs

```text
User Prompt

Workflow State

Project Context
```

---

## Outputs

```text
Workflow Plan

Agent Assignments

Execution Decisions
```

---

## Cannot

```text
Perform Specialized Analysis

Approve Changes

Modify Governance Rules
```

---

## Events

Publishes:

```text
PromptClassified

WorkflowStarted

WorkflowCompleted
```

---

# Discovery Agent

## Purpose

Gather requirements.

---

## Responsibilities

```text
Ask Questions

Clarify Requirements

Identify Missing Information

Create Discovery Report
```

---

## Inputs

```text
User Idea

Project Goal

Prompt Context
```

---

## Outputs

```text
Discovery Report

Requirements

Constraints

Assumptions
```

---

## Cannot

```text
Create Final Architecture

Approve Plans
```

---

## Events

Publishes:

```text
DiscoveryStarted

DiscoveryCompleted
```

---

# Research Agent

## Purpose

Perform structured research.

---

## Responsibilities

```text
Technology Analysis

Option Comparison

Risk Discovery

Research Reports
```

---

## Inputs

```text
Discovery Report

Research Scope
```

---

## Outputs

```text
Research Report

Technology Options

Risk List

Recommendations
```

---

## Cannot

```text
Make Final Decisions

Approve Technologies
```

---

## Events

Publishes:

```text
ResearchStarted

ResearchCompleted
```

---

# Planning Agent

## Purpose

Transform requirements into executable plans.

---

## Responsibilities

```text
Create Project Structure

Create Phases

Create Tasks

Create Milestones
```

---

## Inputs

```text
Discovery Report

Research Report
```

---

## Outputs

```text
Project Plan

Phase Plan

Task Plan
```

---

## Cannot

```text
Execute Tasks

Approve Plans
```

---

## Events

Publishes:

```text
PlanningStarted

PlanningCompleted
```

---

# Review Agent

## Purpose

Evaluate work quality.

---

## Responsibilities

```text
Analyze Deliverables

Identify Issues

Identify Risks

Create Recommendations
```

---

## Inputs

```text
Entity

Review Scope

Review Criteria
```

---

## Outputs

```text
Review Findings

Risk Report

Recommendations
```

---

## Cannot

```text
Approve Deliverables

Override Governance
```

---

## Events

Publishes:

```text
ReviewStarted

ReviewCompleted
```

---

# Knowledge Agent

## Purpose

Capture reusable intelligence.

---

## Responsibilities

```text
Extract Knowledge

Create Lessons Learned

Organize Knowledge

Categorize Knowledge
```

---

## Inputs

```text
Project Data

Reviews

Research

Recommendations
```

---

## Outputs

```text
Knowledge Records

Knowledge Summaries

Knowledge Categories
```

---

## Cannot

```text
Approve Knowledge Changes
```

---

## Events

Publishes:

```text
KnowledgeCreated

KnowledgeUpdated
```

---

# Blueprint Agent

## Purpose

Manage blueprint evolution.

---

## Responsibilities

```text
Create Blueprints

Improve Blueprints

Version Blueprints

Compare Blueprints
```

---

## Inputs

```text
Knowledge

Existing Blueprint

Recommendations
```

---

## Outputs

```text
Blueprint Proposal

Blueprint Changes

Version Updates
```

---

## Cannot

```text
Publish Blueprint Changes
```

Requires approval.

---

## Events

Publishes:

```text
BlueprintCreated

BlueprintVersionCreated
```

---

# Skill Agent

## Purpose

Manage reusable skills.

---

## Responsibilities

```text
Create Skills

Improve Skills

Version Skills

Assign Skills
```

---

## Inputs

```text
Knowledge

Reviews

Recommendations
```

---

## Outputs

```text
Skill Proposal

Skill Update

Skill Version
```

---

## Cannot

```text
Approve Skill Updates
```

---

## Events

Publishes:

```text
SkillCreated

SkillUpdated
```

---

# Risk Agent (Future)

## Purpose

Dedicated risk management.

Not part of MVP.

---

## Responsibilities

```text
Risk Analysis

Risk Monitoring

Mitigation Tracking
```

---

# Recommendation Agent (Future)

## Purpose

Recommendation generation.

Not part of MVP.

---

# Agent State Model

Every agent supports:

```text
Idle

Running

Paused

Completed

Failed
```

---

# Agent Lifecycle

```text
Registered
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

# Agent Context Rules

## Rule 1

Agents receive minimum required context.

---

## Rule 2

Agents must not load entire projects.

---

## Rule 3

Use summaries before full content.

---

# Agent Communication Rules

Allowed:

```text
Agent
 ↓
Parent Agent
 ↓
Agent
```

Not Allowed:

```text
Agent
 ↓
Agent
```

Direct communication is prohibited.

---

# Agent Output Rules

Every output should contain:

```text
Summary

Findings

Recommendations
```

Optional:

```text
Risks

Metrics

References
```

---

# Confidence Scores

Agents should return confidence.

Example:

```json
{
  "confidence": 92
}
```

Range:

```text
0 - 100
```

---

# Governance Rules

## Rule 1

Agents cannot approve.

---

## Rule 2

Agents cannot bypass workflows.

---

## Rule 3

Agents cannot modify governance rules.

---

## Rule 4

Agents must produce traceable outputs.

---

## Rule 5

Agents may recommend.

Humans decide.

---

# Success Criteria

Every agent should:

```text
Produce Structured Output

Follow Contracts

Respect Governance

Use Minimal Context

Generate Traceable Results
```

---

# Agent Contract Summary

Agentix OS agents are specialized workers operating under the coordination of the Parent Agent.

Each agent has:

```text
Defined Responsibilities

Defined Inputs

Defined Outputs

Defined Restrictions

Defined Events
```

This ensures consistency, maintainability, and predictable behavior across the entire Agentix OS platform while preserving the principle:

```text
AI Recommends

Humans Decide
```
