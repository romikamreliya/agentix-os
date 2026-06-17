# Core Principles

## Overview

This document defines the foundational principles of Agentix OS.

Every architectural decision, workflow, agent, service, and feature must align with these principles.

If a future implementation conflicts with these principles, the principles take precedence.

---

# Principle 1 — AI Recommends, Humans Decide

AI systems assist.

Humans remain responsible for decisions.

Agentix OS is designed to support human judgment, not replace it.

---

## Allowed

```text
AI Analysis

AI Research

AI Recommendations

AI Reviews

AI Planning Assistance
```

---

## Not Allowed

```text
Automatic Approvals

Automatic Governance Changes

Automatic Blueprint Promotion

Automatic Skill Promotion
```

---

## Rule

Important decisions require human approval.

---

# Principle 2 — Discovery Before Execution

Every successful project begins with understanding.

Before planning or execution:

```text
Understand Requirements
      ↓
Identify Constraints
      ↓
Clarify Assumptions
      ↓
Then Execute
```

---

## Rule

Discovery cannot be skipped.

---

# Principle 3 — Local First

Agentix OS runs primarily on the user's machine.

User data belongs to the user.

---

## Benefits

```text
Privacy

Control

Offline Capability

Ownership
```

---

## Rule

Cloud services are optional.

Core functionality must work locally.

---

# Principle 4 — Knowledge Over Memory

Temporary memory is useful.

Reusable knowledge is valuable.

Agentix OS prioritizes converting experience into reusable knowledge.

---

## Example

Bad:

```text
Remember everything forever.
```

Good:

```text
Store reusable lessons learned.
```

---

## Rule

Knowledge should be structured and reusable.

---

# Principle 5 — Continuous Learning

Every completed workflow should improve future outcomes.

---

## Learning Sources

```text
Projects

Reviews

Research

Recommendations

Lessons Learned
```

---

## Outcome

```text
Better Decisions

Better Planning

Better Execution
```

---

# Principle 6 — Governance By Design

Governance is built into the system.

It is not an afterthought.

---

## Governance Components

```text
Reviews

Approvals

Risks

Recommendations

Audit Trails
```

---

## Rule

Important actions must be traceable.

---

# Principle 7 — Context Minimization

Agents should receive only the information required for their task.

---

## Avoid

```text
Entire Project Context

Entire Knowledge Base

Entire Workspace
```

---

## Prefer

```text
Relevant Context

Summaries

References
```

---

## Goal

Reduce complexity and token usage.

---

# Principle 8 — Token Efficiency

Tokens are a resource.

They should be managed carefully.

---

## Strategy

```text
Summary First

Details On Demand

Context Compression

Selective Retrieval
```

---

## Rule

Never load unnecessary context.

---

# Principle 9 — Capability-Based Agents

Agents are selected based on capabilities.

Not based on hardcoded implementations.

---

## Example

Bad:

```text
Use ResearchAgent
```

Good:

```text
Find Agent With RESEARCH Capability
```

---

## Benefits

```text
Extensibility

Flexibility

Custom Agents

Plugin Support
```

---

# Principle 10 — Parent Agent Governance

The Parent Agent coordinates.

Specialized Agents execute.

---

## Parent Agent Responsibilities

```text
Workflow Selection

Agent Selection

Context Selection

Progress Tracking
```

---

## Parent Agent Restrictions

```text
No Specialized Analysis

No Direct Approval Authority
```

---

# Principle 11 — Event-Driven Architecture

System components communicate through events.

---

## Example

```text
ProjectCreated
       ↓
Subscribers React
```

---

## Benefits

```text
Loose Coupling

Scalability

Traceability
```

---

# Principle 12 — Command Responsibility Separation

Commands request actions.

Events report actions.

---

## Commands

```text
CreateProject

CreateTask

RequestApproval
```

---

## Events

```text
ProjectCreated

TaskCreated

ApprovalRequested
```

---

## Rule

Commands and events must remain separate.

---

# Principle 13 — Single Source Of Truth

Every business entity should have one authoritative source.

Avoid duplicate state.

---

## Examples

```text
Project Status

Task Status

Approval Status
```

---

# Principle 14 — Incremental Delivery

Build in small, validated steps.

---

## Preferred

```text
Phase 0
 ↓
Phase 1
 ↓
Phase 2
```

---

## Avoid

```text
Build Everything First
```

---

# Principle 15 — Simplicity First

Prefer simple solutions.

Complexity must be justified.

---

## Rule

Do not introduce infrastructure, services, or patterns without a clear reason.

---

# Principle 16 — Auditability Everywhere

Every important action should be traceable.

---

## Track

```text
Who

What

When

Why
```

---

## Sources

```text
Events

Reviews

Approvals

Logs
```

---

# Principle 17 — Reuse Before Reinvention

Before creating new structures:

```text
Check Existing Knowledge
      ↓
Check Existing Patterns
      ↓
Check Existing Solutions
```

---

## Goal

Reduce duplication.

---

# Principle 18 — Modular Architecture

Every major component should be independently replaceable.

---

## Examples

```text
AI Providers

Database Layer

Agent Implementations

UI Components
```

---

# Principle 19 — Security By Default

Protect user data from the beginning.

---

## Never Store

```text
API Keys

Secrets

Credentials
```

inside source code.

---

## Use

```text
VS Code Secret Storage
```

---

# Principle 20 — Human-Centered Automation

Automation should reduce effort.

Automation should not remove accountability.

---

## Final Rule

Agentix OS exists to help humans:

```text
Think Better

Plan Better

Execute Better

Learn Faster

Improve Continuously
```

The guiding principle of the entire platform is:

```text
AI Recommends

Humans Decide
```
