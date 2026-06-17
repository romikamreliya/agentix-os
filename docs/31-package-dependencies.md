# Package Dependencies

## Overview

This document defines the dependency rules between all packages in Agentix OS.

The purpose of these rules is to:

* Prevent circular dependencies
* Enforce clean architecture
* Improve maintainability
* Enable independent package development
* Simplify testing

Every package must follow these rules.

---

# Core Principle

Dependencies flow in one direction only.

---

## Allowed

```text id="e8q6ka"
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

## Not Allowed

```text id="c6j8mn"
services
    ↓
runtime

runtime
    ↓
services

(Reverse Imports)
```

---

# Package Overview

```text id="h5v2zw"
@agentix/shared

@agentix/core

@agentix/database

@agentix/services

@agentix/runtime

@agentix/agents

@agentix/ai

apps/vscode-extension
```

---

# Dependency Hierarchy

```text id="m7s3qx"
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

# Shared Package

Package:

```text id="j4f9dp"
@agentix/shared
```

Purpose:

```text id="t2m6sw"
Utilities

Logger

Errors

Validation

Configuration

IPC Types
```

---

## Allowed Dependencies

```text id="v1x4kj"
None
```

Shared is the foundation package.

---

## Forbidden Dependencies

```text id="s5w8cf"
core

database

services

runtime

agents

vscode-extension
```

---

# Core Package

Package:

```text id="n8p1rv"
@agentix/core
```

Purpose:

```text id="d4j7lu"
Entities

Types

Enums

Constants

Interfaces
```

---

## Allowed Dependencies

```text id="f9k2ta"
shared
```

---

## Forbidden Dependencies

```text id="u3y5gm"
database

services

runtime

agents

vscode-extension
```

---

# Database Package

Package:

```text id="k1c8qx"
@agentix/database
```

Purpose:

```text id="q6m4bj"
Drizzle

SQLite

Repositories

Migrations
```

---

## Allowed Dependencies

```text id="g7v9hp"
shared

core
```

---

## Forbidden Dependencies

```text id="x2j6mw"
services

runtime

agents

vscode-extension
```

---

# Services Package

Package:

```text id="w8r3fa"
@agentix/services
```

Purpose:

```text id="z5n2yu"
Business Logic

Validation

Transactions
```

---

## Allowed Dependencies

```text id="c4m9pd"
shared

core

database
```

---

## Forbidden Dependencies

```text id="y6q7lt"
runtime

agents

vscode-extension
```

---

# Runtime Package

Package:

```text id="s1j4vn"
@agentix/runtime
```

Purpose:

```text id="r8w6ga"
Runtime Engine

Command Bus

Event Bus

Context Manager

Workflow Manager
```

---

## Allowed Dependencies

```text id="m2f7kc"
shared

core

services
```

---

## Forbidden Dependencies

```text id="j9p3sx"
agents

vscode-extension
```

Runtime must remain independent.

---

# Agents Package

Package:

```text id="h7x5ql"
@agentix/agents
```

Purpose:

```text id="b3t8mz"
Discovery Agent

Research Agent

Planning Agent

Review Agent

Knowledge Agent

Agent Registry
```

---

## Allowed Dependencies

```text id="p6r1dy"
shared

core

services

runtime
```

---

## Forbidden Dependencies

```text id="z4m2kt"
vscode-extension
```

---

# AI Package

Package:

```text id="y1f9sw"
@agentix/ai
```

Purpose:

```text id="n6v3pd"
OpenAI

Anthropic

Gemini

Provider Abstraction
```

---

## Allowed Dependencies

```text id="k8q7mu"
shared

core
```

---

## Forbidden Dependencies

```text id="u7w1fc"
database

services

runtime

agents

vscode-extension
```

---

# VS Code Extension

Package:

```text id="f3x5vn"
apps/vscode-extension
```

Purpose:

```text id="h8n6zw"
UI

Commands

Views

Extension Host
```

---

## Allowed Dependencies

```text id="w4q8pj"
shared

core

database

services

runtime

agents

ai
```

---

# Visual Dependency Map

```text id="p5k7mx"
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

ai
  ↓

vscode-extension
```

---

# Import Rules

## Preferred

```ts id="r2m9df"
import {
  ProjectService
} from "@agentix/services";
```

---

## Avoid

```ts id="n7q3tw"
import ProjectService
from "../../../services";
```

---

# Circular Dependency Rules

Never allow:

```text id="x8v5pk"
A → B

B → A
```

---

## Example

Bad:

```text id="s3j6md"
services
 ↓
runtime

runtime
 ↓
services
```

---

Good:

```text id="y2f4nw"
runtime
 ↓
services
```

---

# Interface Ownership

Interfaces belong in:

```text id="g1r8tv"
core
```

Examples:

```text id="d9k5pu"
IAgent

IAIProvider

IRepository
```

---

# Event Ownership

Events belong in:

```text id="j4v7mq"
runtime
```

---

# Command Ownership

Commands belong in:

```text id="a7n3zs"
runtime
```

---

# Database Ownership

Repositories belong in:

```text id="x1f9wd"
database
```

---

# Business Logic Ownership

Business logic belongs in:

```text id="z6m8qp"
services
```

---

# Agent Ownership

Agents belong in:

```text id="q4t2lx"
agents
```

---

# UI Ownership

UI belongs in:

```text id="c7p1mv"
vscode-extension
```

---

# Testing Dependencies

Tests may import:

```text id="m5q8rv"
Target Package

Mocks

Test Utilities
```

Only.

---

# Build Order

Packages must build in this order:

```text id="v8n4pt"
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
ai
 ↓
vscode-extension
```

---

# Dependency Validation

CI should verify:

```text id="w2m6jk"
No Circular Dependencies

Valid Imports

Package Boundaries
```

---

# Governance Rules

## Rule 1

Follow dependency hierarchy.

---

## Rule 2

No reverse imports.

---

## Rule 3

No circular dependencies.

---

## Rule 4

Use package aliases.

---

## Rule 5

Respect package ownership.

---

# Future Packages

Possible future additions:

```text id="r9k3vq"
analytics

plugins

marketplace

sync
```

These must follow the same dependency rules.

---

# Package Dependency Summary

Agentix OS uses a strict dependency hierarchy to maintain:

```text id="b6p2nm"
Clean Architecture

Modularity

Maintainability

Scalability

Testability
```

Every package has clearly defined responsibilities and allowed dependencies, ensuring long-term consistency across the platform.
