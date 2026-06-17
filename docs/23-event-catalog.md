# Event Catalog

## Overview

This document defines all system events used within Agentix OS.

Events enable loose coupling between modules and allow services, workflows, and agents to react to system changes without direct dependencies.

Agentix OS uses an event-driven architecture.

---

# Event Principles

## Rule 1

Events describe something that already happened.

Good:

```text
ProjectCreated
TaskCompleted
ReviewApproved
```

Bad:

```text
CreateProject
CompleteTask
ApproveReview
```

Commands request action.

Events report action.

---

## Rule 2

Events are immutable.

Once published, an event cannot be modified.

---

## Rule 3

Events should contain business meaning.

Avoid technical events.

---

# Event Structure

Every event follows:

```ts
interface IEvent {
  id: string;
  eventType: string;
  timestamp: number;
  correlationId: string;
  payload: Record<string, unknown>;
}
```

---

# Event Naming

Format:

```text
EntityAction
```

Examples:

```text
ProjectCreated
TaskAssigned
ReviewCompleted
```

---

# Core Event Categories

```text
Project Events
Task Events
Review Events
Approval Events
Risk Events
Recommendation Events
Knowledge Events
Workflow Events
Agent Events
System Events
```

---

# Project Events

## ProjectCreated

Triggered when a project is created.

Payload:

```ts
{
  projectId: string;
  projectName: string;
}
```

---

## ProjectUpdated

Payload:

```ts
{
  projectId: string;
}
```

---

## ProjectArchived

Payload:

```ts
{
  projectId: string;
}
```

---

## ProjectDeleted

Future use only.

Not part of MVP.

---

# Phase Events

## PhaseCreated

```ts
{
  phaseId: string;
  projectId: string;
}
```

---

## PhaseStarted

```ts
{
  phaseId: string;
}
```

---

## PhaseCompleted

```ts
{
  phaseId: string;
}
```

---

## PhaseApproved

```ts
{
  phaseId: string;
  approvalId: string;
}
```

---

# Task Events

## TaskCreated

```ts
{
  taskId: string;
  phaseId: string;
}
```

---

## TaskUpdated

```ts
{
  taskId: string;
}
```

---

## TaskAssigned

```ts
{
  taskId: string;
  agentId?: string;
}
```

---

## TaskStarted

```ts
{
  taskId: string;
}
```

---

## TaskCompleted

```ts
{
  taskId: string;
}
```

---

## TaskBlocked

```ts
{
  taskId: string;
  reason: string;
}
```

---

# Review Events

## ReviewCreated

```ts
{
  reviewId: string;
  entityType: string;
  entityId: string;
}
```

---

## ReviewStarted

```ts
{
  reviewId: string;
}
```

---

## ReviewCompleted

```ts
{
  reviewId: string;
}
```

---

## ReviewRejected

```ts
{
  reviewId: string;
}
```

---

# Approval Events

## ApprovalRequested

```ts
{
  approvalId: string;
  entityType: string;
  entityId: string;
}
```

---

## ApprovalApproved

```ts
{
  approvalId: string;
}
```

---

## ApprovalRejected

```ts
{
  approvalId: string;
}
```

---

## ApprovalEscalated

```ts
{
  approvalId: string;
}
```

---

# Risk Events

## RiskCreated

```ts
{
  riskId: string;
}
```

---

## RiskUpdated

```ts
{
  riskId: string;
}
```

---

## RiskResolved

```ts
{
  riskId: string;
}
```

---

## CriticalRiskDetected

```ts
{
  riskId: string;
}
```

This event may block approvals.

---

# Recommendation Events

## RecommendationCreated

```ts
{
  recommendationId: string;
}
```

---

## RecommendationApproved

```ts
{
  recommendationId: string;
}
```

---

## RecommendationRejected

```ts
{
  recommendationId: string;
}
```

---

## RecommendationConvertedToTask

```ts
{
  recommendationId: string;
  taskId: string;
}
```

---

# Knowledge Events

## KnowledgeCreated

```ts
{
  knowledgeId: string;
}
```

---

## KnowledgeUpdated

```ts
{
  knowledgeId: string;
}
```

---

## KnowledgePublished

```ts
{
  knowledgeId: string;
}
```

---

## KnowledgeArchived

```ts
{
  knowledgeId: string;
}
```

---

# Workflow Events

## WorkflowCreated

```ts
{
  workflowId: string;
  workflowType: string;
}
```

---

## WorkflowStarted

```ts
{
  workflowId: string;
}
```

---

## WorkflowPaused

```ts
{
  workflowId: string;
}
```

---

## WorkflowBlocked

```ts
{
  workflowId: string;
  reason: string;
}
```

---

## WorkflowCompleted

```ts
{
  workflowId: string;
}
```

---

## WorkflowFailed

```ts
{
  workflowId: string;
  error: string;
}
```

---

# Agent Events

## AgentRegistered

```ts
{
  agentId: string;
  agentType: string;
}
```

---

## AgentStarted

```ts
{
  agentId: string;
}
```

---

## AgentCompleted

```ts
{
  agentId: string;
}
```

---

## AgentFailed

```ts
{
  agentId: string;
  error: string;
}
```

---

## AgentRecommendationCreated

```ts
{
  agentId: string;
  recommendationId: string;
}
```

---

# Prompt Events

## PromptReceived

```ts
{
  promptId: string;
}
```

---

## PromptClassified

```ts
{
  promptId: string;
  promptType: string;
}
```

---

## PromptRouted

```ts
{
  promptId: string;
  workflowType: string;
}
```

---

# System Events

## SystemStarted

```ts
{
  version: string;
}
```

---

## SystemStopped

```ts
{
  version: string;
}
```

---

## DatabaseInitialized

```ts
{
  databasePath: string;
}
```

---

## SettingsUpdated

```ts
{
  settingKey: string;
}
```

---

# Event Subscribers

## Example

```text
ProjectCreated
       │
       ├── Knowledge Service
       ├── Analytics Service
       └── Workflow Service
```

Multiple services may subscribe to the same event.

---

# Event Storage

All published events should be stored in:

```text
events
```

table.

Benefits:

```text
Audit Trail

Debugging

Analytics

Replay Support
```

---

# Event Bus Rules

## Rule 1

Publish after successful transaction.

---

## Rule 2

Events must not modify state directly.

---

## Rule 3

Subscribers perform actions.

---

## Rule 4

Event handlers should be idempotent.

---

# Event Priorities

```text
LOW
NORMAL
HIGH
CRITICAL
```

Example:

```text
CriticalRiskDetected
```

Priority:

```text
CRITICAL
```

---

# MVP Event List

Required for MVP:

```text
ProjectCreated
ProjectUpdated

TaskCreated
TaskCompleted

ReviewCreated
ReviewCompleted

ApprovalRequested
ApprovalApproved
ApprovalRejected

RiskCreated
RiskResolved

RecommendationCreated

KnowledgeCreated

WorkflowStarted
WorkflowCompleted

PromptReceived
PromptClassified

SystemStarted
SystemStopped
```

---

# Future Events

Not required for MVP:

```text
PluginInstalled
MarketplacePackageInstalled
CloudSyncCompleted
UserInvited
TeamMemberAdded
```

---

# Event Catalog Summary

The Event Catalog defines the official communication language of Agentix OS.

Events enable:

```text
Loose Coupling

Traceability

Workflow Automation

Agent Coordination

Auditability
```

Every service, workflow, and agent should communicate through events whenever cross-module communication is required.
