# Coding Standards

## Overview

This document defines the official coding standards for Agentix OS.

All contributors, agents, and generated code must follow these standards.

The goals are:

* Consistency
* Readability
* Maintainability
* Testability
* Scalability

---

# General Principles

## Principle 1

Code should be easy to read.

Prefer:

```ts
const activeProjects = await projectService.getActiveProjects();
```

Avoid:

```ts
const x = await ps.gap();
```

---

## Principle 2

Clarity is more important than cleverness.

---

## Principle 3

Optimize for maintainability.

Do not optimize prematurely.

---

## Principle 4

Business logic belongs in services.

---

## Principle 5

Keep functions small and focused.

---

# TypeScript Standards

## Strict Mode

Must be enabled.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

## No Any

Never use:

```ts
any
```

Bad:

```ts
function process(data: any) {}
```

Good:

```ts
function process(data: ProjectDto) {}
```

---

## Explicit Types

Prefer explicit types for public APIs.

```ts
export async function createProject(
  payload: CreateProjectDto
): Promise<ProjectEntity> {}
```

---

# Naming Conventions

## Classes

Use PascalCase.

Good:

```ts
ProjectService
KnowledgeAgent
RuntimeEngine
```

---

## Interfaces

Prefix with I.

Good:

```ts
IRepository
IAIProvider
IEventBus
```

---

## Types

Use PascalCase.

Good:

```ts
ProjectDto
ProjectStatus
```

---

## Variables

Use camelCase.

Good:

```ts
projectId
activeTasks
currentPhase
```

---

## Constants

Use UPPER_SNAKE_CASE.

Good:

```ts
MAX_TOKEN_LIMIT

DEFAULT_PAGE_SIZE

PROJECT_CACHE_TTL
```

---

## Files

Use kebab-case.

Good:

```text
project-service.ts

knowledge-agent.ts

runtime-engine.ts
```

---

# Folder Rules

## One Responsibility Per Folder

Bad:

```text
project/
  project.service.ts
  task.service.ts
```

Good:

```text
project/
  project.service.ts

task/
  task.service.ts
```

---

# Function Standards

## Small Functions

Prefer:

```ts
function validateProject() {}

function createProject() {}

function publishEvent() {}
```

Avoid:

```ts
function createProjectAndValidateAndPublishAndNotify() {}
```

---

## Single Responsibility

One function should do one thing.

---

## Max Function Size

Recommended:

```text
30-50 lines
```

Maximum:

```text
100 lines
```

---

# Class Standards

## Single Responsibility

Bad:

```ts
ProjectService
```

Handles:

```text
Projects
Tasks
Reviews
Approvals
```

Good:

```text
ProjectService

TaskService

ReviewService

ApprovalService
```

---

## Constructor Injection

Prefer:

```ts
constructor(
  private readonly repository: IProjectRepository
) {}
```

Avoid:

```ts
const repository = new ProjectRepository();
```

inside services.

---

# Architecture Rules

## UI Layer

Responsibilities:

```text
Display

Input

Navigation
```

Must NOT contain:

```text
Business Logic
```

---

## Service Layer

Responsibilities:

```text
Business Logic

Validation

Workflows
```

---

## Repository Layer

Responsibilities:

```text
Database Access
```

Only.

---

## Agent Layer

Responsibilities:

```text
Analysis

Research

Recommendations
```

---

# Error Handling

## Custom Errors

Create custom error classes.

Example:

```ts
export class ProjectNotFoundError extends Error {}
```

---

## Never Swallow Errors

Bad:

```ts
try {
}
catch {}
```

Good:

```ts
try {
}
catch (error) {
  logger.error(error);
  throw error;
}
```

---

# Logging Standards

Use centralized logger.

Good:

```ts
logger.info("Project created", {
  projectId
});
```

---

## Log Levels

```text
TRACE

DEBUG

INFO

WARN

ERROR
```

---

# Database Standards

## Repositories Only

Bad:

```ts
db.select()
```

inside UI or services.

Good:

```ts
projectRepository.findById()
```

---

## Transactions

Required for:

```text
Project Creation

Blueprint Updates

Skill Updates

Approval Actions
```

---

## Migrations

All schema changes must use migrations.

Never manually edit production databases.

---

# Event Standards

## Naming

Format:

```text
EntityAction
```

Good:

```text
ProjectCreated

TaskCompleted

ReviewApproved
```

---

## Event Structure

```ts
{
  eventId,
  eventType,
  timestamp,
  payload
}
```

---

# API Standards

## Response Format

Success:

```ts
{
  success: true,
  data: {}
}
```

Error:

```ts
{
  success: false,
  error: {}
}
```

---

# Agent Standards

## Agents Cannot

```text
Approve

Override

Modify Governance Rules
```

---

## Agents Can

```text
Recommend

Analyze

Review

Research
```

---

## Parent Agent

Coordinates agents.

Specialized agents perform work.

---

# React Standards

## Functional Components Only

Use:

```tsx
function Dashboard() {}
```

Avoid class components.

---

## One Component Per File

Good:

```text
dashboard.tsx
```

---

## Component Size

Recommended:

```text
Under 200 lines
```

---

## Custom Hooks

Extract logic.

Good:

```ts
useProjects()

useTasks()
```

---

# State Management

Prefer:

```text
Zustand
```

for MVP.

Avoid unnecessary complexity.

---

# Testing Standards

## Unit Tests

Required for:

```text
Services

Utilities

Validators
```

---

## Integration Tests

Required for:

```text
Database

Repositories

Workflows
```

---

## Coverage Target

Minimum:

```text
70%
```

Target:

```text
80%+
```

---

# Documentation Standards

Every public service should include:

```ts
/**
 * Creates project
 */
```

---

## Complex Logic

Must include explanation comments.

---

# Security Standards

Never log:

```text
API Keys

Passwords

Secrets
```

---

## Secrets Storage

Use:

```text
VS Code Secret Storage
```

Never store secrets in source code.

---

# Performance Standards

Avoid:

```text
N+1 Queries

Repeated Database Calls

Duplicate Context Loading
```

---

# AI Provider Standards

All providers must implement:

```ts
interface IAIProvider {
  generate();
  analyze();
  review();
  summarize();
}
```

Business logic must never depend on provider-specific code.

---

# Git Standards

## Branch Naming

```text
feature/project-module

feature/discovery-agent

fix/runtime-error
```

---

## Commit Format

```text
feat:

fix:

refactor:

docs:

test:
```

Examples:

```text
feat: add project service

fix: resolve task validation issue

docs: update architecture documentation
```

---

# Code Review Checklist

Before merge:

```text
TypeScript Strict Pass

Lint Pass

Tests Pass

No Any

Architecture Rules Followed

Documentation Updated
```

---

# Governance Rules

## Rule 1

Readability over cleverness.

---

## Rule 2

Business logic belongs in services.

---

## Rule 3

Repositories handle database access.

---

## Rule 4

Agents recommend, humans decide.

---

## Rule 5

Follow documented architecture.

---

# Coding Standards Summary

Agentix OS code should be:

```text
Readable

Maintainable

Testable

Type Safe

Modular

Consistent
```

Every implementation must follow these standards to ensure long-term maintainability and scalability of the platform.
