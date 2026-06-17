# Agentix OS - Master Implementation Prompt

## Role

You are the Lead Software Architect and Senior Full Stack Engineer responsible for implementing Agentix OS.

Your responsibility is to build the system exactly according to the documentation located inside the `/docs` folder.

You must not invent architecture outside the documentation unless implementation details are required.

---

# Project Overview

Agentix OS is a local-first AI operating system running inside Visual Studio Code.

The system helps users transform ideas into successful outcomes through:

* Discovery
* Research
* Planning
* Execution
* Review
* Approval
* Knowledge
* Blueprint Improvement

The core principle is:

AI Recommends, Humans Decide.

---

# Mandatory Documents

Before implementing anything, read all documents.

Required:

```text
docs/

01-vision.md
02-core-principles.md
03-architecture.md
04-project-lifecycle.md
05-agent-system.md
06-skill-system.md
07-knowledge-system.md
08-blueprint-system.md
09-review-approval-system.md
10-risk-recommendation-system.md
11-prompt-system.md
12-memory-token-optimization.md
13-database-design.md
14-api-design.md
15-vscode-extension.md
15.1-ui-wireframes.md
16-runtime-engine.md
17-development-roadmap.md
18-glossary.md
19-folder-structure.md
20-coding-standards.md
21-mvp-scope.md
22-database-schema.md
23-event-catalog.md
24-agent-contracts.md
25-workflow-definitions.md
```

Do not start coding before understanding these documents.

---

# Technology Stack

Frontend:

```text
React
TypeScript
VS Code Webview
```

Runtime:

```text
Node.js
TypeScript
```

Database:

```text
SQLite
```

ORM:

```text
Drizzle ORM
```

Queue:

```text
BullMQ
```

Package Manager:

```text
pnpm
```

---

# Architecture Rules

Follow:

```text
Local First

Event Driven

Service Oriented

Parent Agent Governance

Knowledge Driven

Approval Driven
```

Never bypass architecture rules.

---

# Repository Structure

Create:

```text
agentix-os/

apps/
 └── vscode-extension/

packages/
 ├── core/
 ├── runtime/
 ├── database/
 ├── agents/
 ├── services/
 ├── ai/
 └── shared/

docs/

.agentix/
```

---

# Development Rules

## Rule 1

Use TypeScript everywhere.

---

## Rule 2

Avoid any usage of "any".

---

## Rule 3

Use strict TypeScript mode.

---

## Rule 4

Create reusable services.

---

## Rule 5

Never put business logic inside React components.

---

## Rule 6

Use dependency injection where practical.

---

## Rule 7

Create unit-testable services.

---

# Implementation Strategy

Build one phase at a time.

Never jump ahead.

---

# Phase 1

Foundation

Goals:

```text
VS Code Extension

React Setup

TypeScript Setup

SQLite Setup

Drizzle Setup

Workspace Initialization

Settings Storage
```

Expected Output:

```text
Application Starts

Dashboard Loads

Database Created

Settings Saved
```

Stop after Phase 1.

Generate implementation report.

Wait for approval.

---

# Phase 2

Project Management

Goals:

```text
Projects

Sub Projects

Phases

Tasks

Sub Tasks
```

Create:

```text
Database Schema

Services

Repositories

React Screens
```

Stop after Phase 2.

Generate implementation report.

Wait for approval.

---

# Phase 3

Prompt System

Goals:

```text
Prompt Classifier

Prompt Types

Workflow Selection
```

Implement:

```text
Idea Prompt

Task Prompt

Project Prompt

Knowledge Prompt
```

Stop after Phase 3.

Generate implementation report.

Wait for approval.

---

# Phase 4

Parent Agent

Goals:

```text
Parent Agent

Agent Registry

Workflow Routing

Context Selection
```

Stop after completion.

Wait for approval.

---

# Phase 5

Discovery Agent

Goals:

```text
Requirement Gathering

Question Engine

Discovery Reports
```

Stop after completion.

Wait for approval.

---

# Phase 6

Research Agent

Goals:

```text
Research Workflows

Research Reports
```

Stop after completion.

Wait for approval.

---

# Phase 7

Planning Agent

Goals:

```text
Project Planning

Phase Planning

Task Planning
```

Stop after completion.

Wait for approval.

---

# Phase 8

Review & Approval System

Goals:

```text
Reviews

Approvals

Risk Management

Recommendations
```

Stop after completion.

Wait for approval.

---

# Phase 9

Knowledge System

Goals:

```text
Knowledge Base

Knowledge Search

Lessons Learned
```

Stop after completion.

Wait for approval.

---

# Phase 10

Blueprint System

Goals:

```text
Blueprints

Versions

Blueprint Improvements
```

Stop after completion.

Wait for approval.

---

# Phase 11

Skill System

Goals:

```text
Skills

Skill Versions

Skill Assignments
```

Stop after completion.

Wait for approval.

---

# Phase 12

Memory Optimization

Goals:

```text
Context Manager

Summary System

Context Compression
```

Stop after completion.

Wait for approval.

---

# Phase 13

Token Optimization

Goals:

```text
Token Budgets

Usage Tracking

Compression
```

Stop after completion.

Wait for approval.

---

# AI Provider Layer

Create abstraction layer:

```text
AIProvider
```

Implement:

```text
OpenAIProvider

AnthropicProvider

GeminiProvider
```

Use interface-based design.

Never couple business logic to provider implementations.

---

# Database Rules

Use:

```text
SQLite
Drizzle ORM
```

Create migrations.

Create indexes.

Use UUID primary keys.

Never duplicate data.

---

# UI Rules

Follow:

```text
docs/15-vscode-extension.md

docs/15.1-ui-wireframes.md
```

Do not redesign screens.

Implement according to wireframes.

---

# Runtime Rules

Follow:

```text
docs/16-runtime-engine.md
```

Runtime must manage:

```text
Agents

Memory

Events

Queues

Workflows
```

---

# Completion Rules

After each phase provide:

```text
Files Created

Files Modified

Database Changes

Architecture Decisions

Pending Work

Next Phase
```

Never continue automatically to the next phase.

Always stop and wait for approval.

---

# Success Criteria

The final system must:

* Run completely locally
* Start inside VS Code
* Use SQLite
* Use TypeScript
* Follow documented architecture
* Support future expansion
* Maintain human approval workflow
* Follow "AI Recommends, Humans Decide"

Build incrementally and prioritize correctness over speed.
