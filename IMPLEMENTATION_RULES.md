# IMPLEMENTATION_RULES

## Purpose

This document defines the mandatory implementation rules for Agentix OS.

All human developers and AI coding agents must follow these rules.

These rules override implementation preferences.

---

# Core Principle

Agentix OS is a:

```text
Local First
AI Operating System
```

The architecture must prioritize:

```text
Simplicity
Maintainability
Traceability
Extensibility
```

before adding complexity.

---

# Development Philosophy

## Rule 1

Build incrementally.

Never build the entire system at once.

---

## Rule 2

Finish the current phase before starting the next phase.

---

## Rule 3

Every phase must result in a working application.

---

## Rule 4

Avoid over-engineering.

Build only what is required for the current phase.

---

# Technology Rules

## Mandatory Technologies

Frontend

```text
React
TypeScript
```

VS Code

```text
VS Code Extension API
Webview API
```

Runtime

```text
Node.js
TypeScript
```

Database

```text
SQLite
Drizzle ORM
```

Queue

```text
BullMQ
```

Package Manager

```text
npm
```

---

# TypeScript Rules

## Strict Mode

Required.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

## No Any

Forbidden.

Bad:

```ts
const data: any;
```

Good:

```ts
const data: ProjectDto;
```

---

## No ts-ignore

Forbidden.

Bad:

```ts
// @ts-ignore
```

---

## Explicit Public Types

All exported functions must define:

```ts
Input Type
Output Type
```

---

# Architecture Rules

## Layer Structure

```text
UI
 ↓
Commands
 ↓
Services
 ↓
Repositories
 ↓
Database
```

---

## Forbidden

```text
UI
 ↓
Database
```

---

## Forbidden

```text
React Component
 ↓
Database
```

---

## Required

```text
React Component
 ↓
Service
```

---

# Business Logic Rules

Business logic belongs only in:

```text
packages/services
```

Never inside:

```text
React Components

VS Code Commands

Repositories
```

---

# Repository Rules

Repositories only handle:

```text
Create

Read

Update

Delete
```

Repositories must not contain:

```text
Business Logic

Validation

Workflow Logic
```

---

# Service Rules

Services are responsible for:

```text
Validation

Business Rules

Transactions

Event Publishing
```

---

# Agent Rules

Agents may:

```text
Analyze

Research

Review

Recommend
```

Agents may NOT:

```text
Approve

Override Rules

Modify Governance
```

---

# Parent Agent Rules

Parent Agent is responsible for:

```text
Workflow Selection

Agent Coordination

Context Selection

Progress Tracking
```

Parent Agent must NOT:

```text
Perform Specialized Work
```

---

# Workflow Rules

Every workflow must follow:

```text
Validation
 ↓
Execution
 ↓
Review
 ↓
Completion
```

---

# Discovery Rule

Discovery always happens before planning.

Never skip discovery.

---

# Review Rule

Review happens before approval.

Never approve without review.

---

# Knowledge Rule

Completed workflows should generate knowledge when applicable.

---

# Database Rules

## ORM

Use:

```text
Drizzle ORM
```

Only.

---

## Migrations

Every schema change requires migration.

Never manually modify production schema.

---

## IDs

Use:

```text
UUID v7
```

for all primary entities.

---

## Soft Delete

Prefer:

```text
status

is_active
```

Avoid physical deletion.

---

# Event Rules

All cross-module communication should use events.

---

## Event Naming

Format:

```text
EntityAction
```

Examples:

```text
ProjectCreated

TaskCompleted

ReviewCompleted
```

---

## Event Storage

All events should be stored.

Benefits:

```text
Audit Trail

Replay

Analytics
```

---

# AI Provider Rules

Create abstraction layer.

Required interface:

```ts
interface IAIProvider {
  generate();
  analyze();
  review();
  summarize();
}
```

---

## Supported Providers

```text
OpenAI

Anthropic

Gemini
```

Business logic must never depend on provider implementation.

---

# Memory Rules

Load minimum required context.

---

## Forbidden

```text
Load Entire Workspace
```

---

## Preferred

```text
Load Relevant Context
```

---

## Strategy

```text
Summary First

Details On Demand
```

---

# Token Rules

Reduce token usage whenever possible.

Prefer:

```text
Summaries

Compression

Context Selection
```

Avoid:

```text
Large Context Dumps
```

---

# UI Rules

Follow:

```text
docs/15-vscode-extension.md

docs/15.1-ui-wireframes.md
```

Do not redesign screens without approval.

---

# Naming Conventions

Classes

```text
PascalCase
```

Example:

```text
ProjectService
```

---

Interfaces

```text
IInterfaceName
```

Example:

```text
IAIProvider
```

---

Variables

```text
camelCase
```

Example:

```text
projectId
```

---

Constants

```text
UPPER_SNAKE_CASE
```

Example:

```text
MAX_TOKEN_LIMIT
```

---

Files

```text
kebab-case
```

Example:

```text
project-service.ts
```

---

# Testing Rules

## Required

Unit Tests

```text
Services

Utilities

Validators
```

---

Integration Tests

```text
Repositories

Database

Workflows
```

---

Coverage

Minimum:

```text
70%
```

Target:

```text
80%+
```

---

# Security Rules

Never store:

```text
API Keys

Passwords

Secrets
```

inside:

```text
Source Code

Git Repository

Configuration Files
```

---

## Secret Storage

Use:

```text
VS Code Secret Storage
```

---

# Logging Rules

Use centralized logger.

Log:

```text
Workflow Start

Workflow Complete

Errors

Approvals

Reviews
```

Never log:

```text
API Keys

Secrets

Passwords
```

---

# Documentation Rules

When creating code:

Update documentation if architecture changes.

---

## Required Documents

Keep synchronized:

```text
Database Schema

Event Catalog

Agent Contracts

Workflow Definitions
```

---

# Git Rules

Commit format:

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

fix: resolve task validation

docs: update runtime architecture
```

---

# Pull Request Checklist

Before merge:

```text
Build Pass

Tests Pass

Lint Pass

Type Check Pass

Documentation Updated
```

---

# Forbidden Practices

Do NOT:

```text
Use Any

Skip Validation

Bypass Services

Hardcode Secrets

Bypass Approvals

Skip Discovery

Load Entire Context

Put Business Logic In UI
```

---

# AI Coding Agent Instructions

Before writing code:

1. Read README.md
2. Read PROMPT.md
3. Read IMPLEMENTATION_RULES.md
4. Read current phase documentation

Only implement the current phase.

Do not implement future phases.

Stop after phase completion.

Generate:

```text
Files Created

Files Modified

Architecture Decisions

Pending Work

Next Steps
```

Wait for approval before continuing.

---

# Final Principle

Agentix OS follows:

```text
AI Recommends

Humans Decide
```

All implementation decisions must preserve this principle.
