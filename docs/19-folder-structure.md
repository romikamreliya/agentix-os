# Folder Structure

## Overview

This document defines the official repository structure for Agentix OS.

The purpose of this structure is to provide:

* Clear separation of concerns
* Scalability
* Maintainability
* Independent package development
* Easier testing
* Easier future expansion

All contributors must follow this structure.

---

# Repository Structure

```text
agentix-os/

apps/
packages/
docs/
scripts/
tests/
.github/

.agentix/
```

---

# Root Structure

## apps

Contains executable applications.

```text
apps/
```

Examples:

```text
vscode-extension
```

---

## packages

Contains reusable libraries.

```text
packages/
```

Examples:

```text
core
runtime
database
services
agents
ai
shared
```

---

## docs

Project documentation.

```text
docs/
```

Contains:

```text
vision
architecture
database
runtime
governance
```

---

## scripts

Automation scripts.

```text
scripts/
```

Examples:

```text
build
release
database
migration
```

---

## tests

Global testing utilities.

```text
tests/
```

---

## .github

GitHub workflows.

```text
.github/
```

Contains:

```text
workflows
issue templates
pull request templates
```

---

# Applications

## VS Code Extension

```text
apps/
└── vscode-extension/
```

Structure:

```text
vscode-extension/

src/

media/

resources/

package.json

tsconfig.json
```

---

# VS Code Source Structure

```text
src/

extension/

webview/

commands/

providers/

views/

hooks/

utils/

types/
```

---

## extension

VS Code activation logic.

```text
src/extension/
```

Examples:

```text
activate.ts

deactivate.ts

registerCommands.ts
```

---

## webview

React application.

```text
src/webview/
```

Examples:

```text
dashboard

projects

tasks

agents
```

---

## commands

VS Code commands.

```text
src/commands/
```

Examples:

```text
createProject

openDashboard

openKnowledge
```

---

## providers

VS Code providers.

```text
src/providers/
```

Examples:

```text
tree views

webview providers
```

---

# Package Structure

```text
packages/

core/

runtime/

database/

services/

agents/

ai/

shared/
```

---

# Core Package

Purpose:

Common domain models and business types.

```text
packages/core/
```

Structure:

```text
src/

entities/

value-objects/

constants/

enums/

types/
```

---

# Runtime Package

Purpose:

Main runtime engine.

```text
packages/runtime/
```

Structure:

```text
src/

engine/

workflow/

events/

memory/

context/

queue/

state/
```

---

# Runtime Details

## Engine

```text
engine/
```

Contains:

```text
RuntimeEngine

ParentAgentCoordinator
```

---

## Workflow

```text
workflow/
```

Contains:

```text
WorkflowRunner

WorkflowRegistry
```

---

## Events

```text
events/
```

Contains:

```text
EventBus

EventHandlers

EventTypes
```

---

## Memory

```text
memory/
```

Contains:

```text
MemoryManager

SummaryManager

CompressionManager
```

---

# Database Package

Purpose:

Database access layer.

```text
packages/database/
```

Structure:

```text
src/

schema/

migrations/

repositories/

database/
```

---

# Database Schema

```text
schema/
```

Contains:

```text
project.schema.ts

task.schema.ts

knowledge.schema.ts
```

---

# Repositories

```text
repositories/
```

Examples:

```text
ProjectRepository

TaskRepository

KnowledgeRepository
```

---

# Services Package

Purpose:

Business logic.

```text
packages/services/
```

Structure:

```text
src/

project/

task/

review/

approval/

risk/

knowledge/

blueprint/
```

---

# Service Structure

Example:

```text
project/

ProjectService.ts

ProjectValidator.ts

ProjectMapper.ts
```

---

# Agents Package

Purpose:

Agent implementations.

```text
packages/agents/
```

Structure:

```text
src/

parent/

discovery/

research/

planning/

review/

knowledge/

blueprint/

skill/
```

---

# Parent Agent

```text
parent/

ParentAgent.ts

PromptRouter.ts

AgentCoordinator.ts
```

---

# Discovery Agent

```text
discovery/

DiscoveryAgent.ts

QuestionEngine.ts

DiscoveryReportBuilder.ts
```

---

# Research Agent

```text
research/

ResearchAgent.ts

ResearchPlanner.ts
```

---

# AI Package

Purpose:

AI provider abstraction.

```text
packages/ai/
```

Structure:

```text
src/

providers/

interfaces/

prompts/

models/
```

---

# Providers

```text
providers/

OpenAIProvider

AnthropicProvider

GeminiProvider
```

---

# Interfaces

```text
interfaces/

IAIProvider
```

---

# Shared Package

Purpose:

Reusable utilities.

```text
packages/shared/
```

Structure:

```text
src/

utils/

logger/

errors/

validation/

config/
```

---

# Tests Structure

```text
tests/

unit/

integration/

e2e/
```

---

# Documentation Structure

```text
docs/

01-vision.md

02-core-principles.md

...

19-folder-structure.md
```

---

# Workspace Structure

Created automatically.

```text
.agentix/
```

Structure:

```text
.agentix/

agentix.db

projects/

knowledge/

blueprints/

exports/

logs/

attachments/

settings/
```

---

# Naming Rules

## Files

Use:

```text
camelCase
```

Examples:

```text
project.schema.ts

task.mapper.ts
```

---

## Classes

Use:

```text
PascalCase
```

Examples:

```text
ProjectService

KnowledgeAgent
```

---

## Constants

Use:

```text
UPPER_SNAKE_CASE
```

Examples:

```text
MAX_CONTEXT_SIZE

DEFAULT_TOKEN_LIMIT
```

---

# Import Rules

Prefer:

```text
@agentix/core

@agentix/runtime

@agentix/services
```

Avoid deep relative imports.

---

# Architecture Boundaries

Allowed:

```text
UI
 ↓
Services
 ↓
Database
```

Avoid:

```text
UI
 ↓
Database
```

---

# Governance Rules

## Rule 1

Business logic belongs in services.

---

## Rule 2

Agents belong in packages/agents.

---

## Rule 3

Database access belongs in repositories.

---

## Rule 4

Runtime orchestration belongs in runtime.

---

## Rule 5

UI should never contain business logic.

---

# Folder Structure Summary

The repository is organized around:

```text
Apps

Packages

Documentation

Workspace Data
```

This structure supports:

* Local First Architecture
* Modular Development
* Independent Testing
* Scalable Growth
* Multi-Agent Systems
* Future Expansion
