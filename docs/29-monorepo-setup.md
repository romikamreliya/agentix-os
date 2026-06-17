# Monorepo Setup

## Overview

This document defines the official monorepo structure for Agentix OS.

The goal is to create a scalable, maintainable, and modular codebase.

All applications and packages must follow this structure.

---

# Objectives

The monorepo should provide:

```text id="n7c8fx"
Shared Code

Independent Packages

Consistent Tooling

Simple Development

Incremental Builds
```

---

# Technology Stack

Package Manager:

```text id="ewluhc"
pnpm
```

---

Build System:

```text id="shktnm"
Turbo
```

---

Language:

```text id="4kxrrt"
TypeScript
```

---

Testing:

```text id="6frlwl"
Vitest
```

---

# Root Structure

```text id="rvjknr"
agentix-os/

apps/
packages/
docs/
scripts/
tests/

package.json
pnpm-workspace.yaml
turbo.json
tsconfig.base.json

eslint.config.js
prettier.config.js

.gitignore
```

---

# Applications

Applications are executable products.

```text id="7u1wwn"
apps/
```

---

## VS Code Extension

```text id="gf3n5m"
apps/
└── vscode-extension/
```

Contains:

```text id="zsnl5q"
Extension Host

React Webview

UI Screens

VS Code Integration
```

---

# Packages

Reusable modules.

```text id="5h34g4"
packages/
```

---

## Shared

```text id="4qj66w"
packages/shared/
```

Purpose:

```text id="hf9gb7"
Utilities

Logger

Errors

Validation

Configuration
```

---

## Core

```text id="jsygm9"
packages/core/
```

Purpose:

```text id="8d1c5m"
Domain Models

Types

Enums

Constants
```

---

## Database

```text id="f1rlvk"
packages/database/
```

Purpose:

```text id="mwhbgq"
SQLite

Drizzle

Repositories

Migrations
```

---

## Services

```text id="p47wyy"
packages/services/
```

Purpose:

```text id="g7v3s4"
Business Logic

Validation

Transactions
```

---

## Runtime

```text id="z7x4ja"
packages/runtime/
```

Purpose:

```text id="vmp6r8"
Runtime Engine

Event Bus

Command Bus

Context Manager
```

---

## Agents

```text id="76xgwr"
packages/agents/
```

Purpose:

```text id="vb3t9v"
Agent Implementations

Agent Registry
```

---

## AI

```text id="q68xw7"
packages/ai/
```

Purpose:

```text id="j0s6vh"
Provider Abstraction

OpenAI

Anthropic

Gemini
```

---

# Workspace Configuration

## pnpm-workspace.yaml

```yaml id="f7m7qn"
packages:
  - apps/*
  - packages/*
```

---

# Root Package.json

Purpose:

```text id="9q6zvq"
Workspace Scripts

Shared Dependencies

Development Tooling
```

---

# Turbo Configuration

## turbo.json

Responsible for:

```text id="s33pqo"
Build

Lint

Test

Type Check
```

---

# TypeScript Configuration

## tsconfig.base.json

Shared by all packages.

---

## Required Settings

```json id="mdv7vt"
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

# Package Naming

Use:

```text id="bcbmhg"
@agentix/*
```

---

## Examples

```text id="uokxan"
@agentix/shared

@agentix/core

@agentix/database

@agentix/services

@agentix/runtime

@agentix/agents

@agentix/ai
```

---

# Dependency Rules

## Shared

No internal dependencies.

---

## Core

May depend on:

```text id="7pbyk5"
shared
```

---

## Database

May depend on:

```text id="d8bqls"
shared

core
```

---

## Services

May depend on:

```text id="g1z02t"
shared

core

database
```

---

## Runtime

May depend on:

```text id="g1ixtn"
shared

core

services
```

---

## Agents

May depend on:

```text id="7fl62l"
shared

core

runtime

services
```

---

## VS Code Extension

May depend on:

```text id="wut2bf"
all packages
```

---

# Dependency Flow

```text id="s2fth0"
shared
   ↓
core
   ↓
database
   ↓
services
   ↓
runtime
   ↓
agents
   ↓
vscode-extension
```

---

# Forbidden Dependencies

## Database

Must NOT import:

```text id="x1od8f"
runtime

agents

vscode-extension
```

---

## Services

Must NOT import:

```text id="l3j6hz"
agents

vscode-extension
```

---

## Runtime

Must NOT import:

```text id="j3b0iy"
vscode-extension
```

---

## Agents

Must NOT import:

```text id="jdr3pa"
vscode-extension
```

---

# Build Order

```text id="f4ol4q"
shared
 ↓
core
 ↓
database
 ↓
services
 ↓
runtime
 ↓
agents
 ↓
vscode-extension
```

---

# Package Structure Template

Every package:

```text id="pjlwm0"
src/

package.json

tsconfig.json

README.md
```

---

# Package Entry Point

Use:

```text id="s1rl7e"
src/index.ts
```

as the public entry point.

---

# Import Rules

Preferred:

```ts id="7s0f4u"
import {
  ProjectService
} from "@agentix/services";
```

---

Avoid:

```ts id="z61jmh"
../../../services
```

---

# Versioning

Use:

```text id="aq4f4w"
Semantic Versioning
```

Format:

```text id="r2i3cl"
MAJOR.MINOR.PATCH
```

Example:

```text id="px6y7j"
1.0.0
```

---

# Environment Variables

Root:

```text id="u7j8op"
.env
```

Development:

```text id="5oqsxl"
.env.development
```

---

Production:

```text id="g0d2tv"
.env.production
```

---

# Secrets

Do NOT store:

```text id="qrlh9l"
API Keys

Credentials
```

inside source code.

Use:

```text id="8qnt6t"
VS Code Secret Storage
```

for extension secrets.

---

# Testing Structure

```text id="t4i9xv"
tests/

unit/

integration/

e2e/
```

---

# CI/CD

GitHub Actions should validate:

```text id="a8v5g4"
Lint

Type Check

Build

Tests
```

before merge.

---

# Phase 0 Deliverables

Required files:

```text id="0k0gjo"
pnpm-workspace.yaml

package.json

turbo.json

tsconfig.base.json

eslint.config.js

prettier.config.js

.gitignore
```

---

# Success Criteria

A successful monorepo setup provides:

```text id="m8b8pv"
Single Install

Shared Tooling

Shared Types

Fast Builds

Clear Dependencies
```

---

# Governance Rules

## Rule 1

Use pnpm workspace.

---

## Rule 2

Use package boundaries.

---

## Rule 3

Avoid circular dependencies.

---

## Rule 4

Follow dependency flow.

---

## Rule 5

Keep packages independent.

---

# Monorepo Summary

The Agentix OS monorepo is organized around:

```text id="v5g2sy"
Applications

Packages

Documentation
```

and follows a strict dependency hierarchy that ensures maintainability, scalability, and clean architecture as the platform evolves.
