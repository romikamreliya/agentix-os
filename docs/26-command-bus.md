# Command Bus

## Overview

The Command Bus is responsible for executing application actions within Agentix OS.

Commands represent requests to perform work.

The Command Bus routes commands to their appropriate handlers.

---

# Purpose

The Command Bus provides:

* Decoupling
* Traceability
* Validation
* Consistent execution
* Workflow integration

---

# Core Principle

Commands request action.

Events report action.

---

## Example

Command:

```text
CreateProject
```

After successful execution:

```text
ProjectCreated
```

---

# Architecture

```text
UI
 ↓
Command
 ↓
Command Bus
 ↓
Handler
 ↓
Service
 ↓
Repository
 ↓
Database
```

---

# Responsibilities

The Command Bus is responsible for:

```text
Command Routing

Command Validation

Handler Resolution

Execution Tracking

Error Handling
```

---

# Not Responsible For

```text
Business Logic

Database Access

UI Rendering
```

These belong elsewhere.

---

# Command Lifecycle

```text
Command Created
        ↓
Validation
        ↓
Handler Resolution
        ↓
Execution
        ↓
Result
        ↓
Event Publication
```

---

# Command Structure

Every command should implement:

```ts
interface ICommand {
  commandId: string;
  commandType: string;
  timestamp: number;
}
```

---

# Example Command

```ts
interface CreateProjectCommand extends ICommand {
  name: string;
  description?: string;
}
```

---

# Command Result

```ts
interface CommandResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

# Command Handler

Every handler should implement:

```ts
interface ICommandHandler<
  TCommand,
  TResult
> {
  execute(
    command: TCommand
  ): Promise<TResult>;
}
```

---

# Example

## Command

```text
CreateProjectCommand
```

---

## Handler

```text
CreateProjectHandler
```

---

## Service

```text
ProjectService
```

---

## Repository

```text
ProjectRepository
```

---

## Flow

```text
CreateProjectCommand
        ↓
CreateProjectHandler
        ↓
ProjectService
        ↓
ProjectRepository
        ↓
Database
        ↓
ProjectCreated Event
```

---

# Command Naming

Use:

```text
Verb + Entity + Command
```

Examples:

```text
CreateProjectCommand

UpdateProjectCommand

CreateTaskCommand

RequestApprovalCommand

CreateKnowledgeCommand
```

---

# Handler Naming

Use:

```text
Verb + Entity + Handler
```

Examples:

```text
CreateProjectHandler

CreateTaskHandler

RequestApprovalHandler
```

---

# Folder Structure

```text
packages/runtime/

command-bus/

commands/

handlers/
```

---

# Commands Folder

```text
commands/

create-project.command.ts

update-project.command.ts

create-task.command.ts
```

---

# Handlers Folder

```text
handlers/

create-project.handler.ts

update-project.handler.ts

create-task.handler.ts
```

---

# Command Bus Interface

```ts
interface ICommandBus {
  execute<TResult>(
    command: ICommand
  ): Promise<TResult>;
}
```

---

# Handler Registry

The Command Bus maintains a registry.

```text
Command Type
        ↓
Handler
```

Example:

```text
CreateProjectCommand
        ↓
CreateProjectHandler
```

---

# Registration

Example:

```ts
commandBus.register(
  "CreateProjectCommand",
  createProjectHandler
);
```

---

# Validation

Validation occurs before execution.

---

## Examples

```text
Required Fields

Business Rules

Permissions

Workflow State
```

---

# Validation Failure

Return:

```ts
{
  success: false,
  error: "Validation failed"
}
```

No handler execution should occur.

---

# Transactions

Commands that modify multiple entities should use transactions.

Examples:

```text
Create Project

Blueprint Promotion

Skill Promotion

Approval Actions
```

---

# Event Publication

Events should be published only after successful execution.

---

## Example

```text
CreateProjectCommand
        ↓
Project Created
        ↓
Publish ProjectCreated
```

---

# Error Handling

Command execution failures should:

```text
Log Error

Return Failure

Preserve Audit Trail
```

---

# Retry Policy

Applicable for:

```text
Transient Database Errors

Temporary Runtime Failures
```

Not applicable for:

```text
Validation Errors
```

---

# Auditability

Every command execution should record:

```text
Command Id

Command Type

Timestamp

Result

Execution Duration
```

---

# Security

Commands must never contain:

```text
Secrets

API Keys

Credentials
```

---

# Relationship To Events

Commands:

```text
Request Action
```

Events:

```text
Describe Completed Action
```

---

## Example

```text
Command:
CreateTaskCommand

Event:
TaskCreated
```

---

# Parent Agent Integration

The Parent Agent may create commands.

Example:

```text
Parent Agent
      ↓
CreateTaskCommand
      ↓
Command Bus
      ↓
Task Created
```

---

# Workflow Integration

Workflows should execute actions through commands.

Avoid:

```text
Workflow
   ↓
Repository
```

Prefer:

```text
Workflow
   ↓
Command
   ↓
Command Bus
   ↓
Handler
```

---

# MVP Commands

Required:

```text
CreateProjectCommand

UpdateProjectCommand

CreatePhaseCommand

CreateTaskCommand

UpdateTaskCommand

CreateReviewCommand

RequestApprovalCommand

CreateKnowledgeCommand
```

---

# Future Commands

```text
CreateBlueprintCommand

PromoteBlueprintCommand

CreateSkillCommand

PromoteSkillCommand
```

Not required for MVP.

---

# Command Bus Rules

## Rule 1

Commands request action.

---

## Rule 2

Handlers execute commands.

---

## Rule 3

Services contain business logic.

---

## Rule 4

Repositories access data.

---

## Rule 5

Events publish outcomes.

---

# Command Bus Summary

The Command Bus provides a consistent execution model for Agentix OS.

It ensures:

```text
Validation

Traceability

Consistency

Governance

Separation Of Concerns
```

and acts as the primary mechanism for executing state-changing operations throughout the platform.
