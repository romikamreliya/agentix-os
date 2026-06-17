# Agentix OS Architecture

## Overview

Agentix OS is a local-first AI operating system that runs inside Visual Studio Code.

The system is designed around:

* Local execution
* Human governance
* AI-assisted workflows
* Knowledge-driven improvement
* Multi-agent collaboration

The MVP runs entirely on the user's machine.

---

# High-Level Architecture

```text
VS Code
    │
    ▼
Agentix OS Extension
    │
    ▼
Agentix Runtime
    │
    ├── Parent Agent
    ├── Discovery Agent
    ├── Research Agent
    ├── Planning Agent
    ├── Review Agent
    ├── Knowledge Agent
    └── Blueprint Agent
    │
    ▼
Core Services
    │
    ├── Project Service
    ├── Task Service
    ├── Review Service
    ├── Approval Service
    ├── Knowledge Service
    ├── Blueprint Service
    ├── Risk Service
    └── Recommendation Service
    │
    ▼
SQLite Database
    │
    ▼
.agentix Workspace
```

---

# Architecture Goals

The architecture is designed to provide:

* Local-first operation
* Low setup complexity
* Strong governance
* Reusable knowledge
* Traceable decisions
* Efficient AI usage

---

# System Layers

## Layer 1: User Interface

Runs inside VS Code.

Responsibilities:

* Dashboard
* Project Explorer
* Agent Chat
* Reviews
* Approvals
* Settings

Technology:

```text
React
TypeScript
VS Code Webview
```

---

## Layer 2: Runtime Layer

The runtime contains the business logic of Agentix OS.

Responsibilities:

* Agent execution
* Workflow orchestration
* Event processing
* Context management
* Knowledge retrieval

Technology:

```text
TypeScript Services
```

---

## Layer 3: Core Services

Core services manage the main business entities.

Examples:

```text
Project Service

Task Service

Approval Service

Review Service

Knowledge Service

Blueprint Service

Risk Service

Recommendation Service
```

These services should remain independent and reusable.

---

## Layer 4: Storage Layer

Responsible for persistence.

Components:

```text
SQLite

Drizzle ORM

Local File Storage
```

All project information is stored locally.

---

# Runtime Architecture

## Parent Agent

The Parent Agent coordinates all workflows.

Responsibilities:

* Prompt routing
* Workflow selection
* Agent coordination
* Approval orchestration
* Context management

The Parent Agent does not perform specialized work directly.

---

## Discovery Agent

Responsibilities:

* Requirement gathering
* Clarification
* User questioning
* Discovery reports

Only the Discovery Agent or Parent Agent should ask users for clarification.

---

## Research Agent

Responsibilities:

* Research
* Feasibility analysis
* Market investigation
* Technical investigation

---

## Planning Agent

Responsibilities:

* Project planning
* Phase planning
* Task planning
* Impact analysis

---

## Review Agent

Responsibilities:

* Quality review
* Architecture review
* Project review
* Code review

---

## Knowledge Agent

Responsibilities:

* Knowledge extraction
* Knowledge maintenance
* Knowledge categorization

---

## Blueprint Agent

Responsibilities:

* Blueprint generation
* Blueprint improvement proposals
* Blueprint versioning

---

# Workflow Architecture

## Idea Workflow

```text
Idea
 ↓
Discovery
 ↓
Research
 ↓
Planning
 ↓
Approval
 ↓
Execution
```

---

## Task Workflow

```text
Task Request
 ↓
Analysis
 ↓
Execution
 ↓
Review
```

---

## Knowledge Workflow

```text
Project Complete
 ↓
Lessons Learned
 ↓
Knowledge
 ↓
Blueprint Improvements
 ↓
Skill Improvements
```

---

# Prompt Classification Layer

Every prompt passes through a classifier.

```text
User Prompt
      ↓
Prompt Classifier
      ↓
Workflow Selection
      ↓
Parent Agent
```

Supported prompt types:

```text
Idea

Task

Project

Existing Project

Knowledge

Agent

Skill

System
```

---

# Event-Driven Architecture

Agentix OS uses internal events.

Examples:

```text
ProjectCreated

PhaseCompleted

ReviewCreated

ApprovalRequested

KnowledgeCreated

BlueprintUpdated
```

Benefits:

* Loose coupling
* Better maintainability
* Easier future expansion

---

# Memory Architecture

Agentix OS uses layered memory.

## Active Context

Current task only.

---

## Project Context

Current project information.

---

## Knowledge Context

Relevant knowledge only.

---

## Archive Context

Loaded on demand.

---

# Token Optimization Architecture

Principle:

```text
Load minimum context required.
```

Techniques:

* Context selection
* Summarization
* Compression
* Knowledge summaries

The system should avoid loading unnecessary information.

---

# Storage Architecture

All Agentix OS data is stored inside:

```text
.agentix/
```

Example:

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

# Security Architecture

MVP security model:

```text
Local User
      ↓
Local Data
```

No cloud account required.

API keys are stored locally and encrypted before persistence.

---

# Technology Stack

## Frontend

```text
React
TypeScript
VS Code Extension API
```

---

## Runtime

```text
TypeScript
```

---

## Database

```text
SQLite
```

---

## ORM

```text
Drizzle ORM
```

---

## Realtime Communication

```text
Socket.IO
```

---

## AI Layer

```text
Provider Abstraction Layer
```

Supported providers:

* OpenAI
* Anthropic
* Gemini
* Future providers

---

# Design Principles

The architecture follows:

* Local First
* AI Recommends, Humans Decide
* Knowledge Driven
* Event Driven
* Traceable Decisions
* Approval Based Governance
* Continuous Learning

These principles take priority over implementation details.

---

# Architecture Summary

Agentix OS is a local-first, AI-powered project operating system built around:

* Projects
* Agents
* Knowledge
* Governance
* Continuous Improvement

The architecture is designed to transform ideas into successful outcomes while maintaining human control over important decisions.
