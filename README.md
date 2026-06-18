# Agentix OS

> Local-First AI Operating System for Projects, Knowledge, Agents, and Continuous Improvement.

## Overview

Agentix OS is a local-first AI-powered operating system that helps transform ideas into successful outcomes through structured workflows, specialized agents, governance, reusable knowledge, and continuous learning.

Unlike traditional AI assistants that focus on answering questions, Agentix OS focuses on helping users execute projects from idea to completion while preserving knowledge for future reuse.

Agentix OS runs entirely inside Visual Studio Code and keeps all project data under the user's control.

---

## Vision

Create a system where:

```text
Idea
 ↓
Discovery
 ↓
Research
 ↓
Planning
 ↓
Execution
 ↓
Review
 ↓
Approval
 ↓
Knowledge
 ↓
Blueprint Improvement
 ↓
Future Success
```

Every completed project contributes to making future projects better.

---

## Core Principles

* AI Recommends, Humans Decide
* Nothing Important Happens Automatically
* Discovery Before Execution
* Knowledge Over Memory
* Continuous Learning
* Reuse Before Reinvention
* Local First
* Traceability Everywhere
* Context Minimization
* Token Efficiency

---

## Key Features

### Project Management

* Projects
* Sub Projects
* Phases
* Tasks
* Sub Tasks

### Multi-Agent System

* Parent Agent
* Discovery Agent
* Research Agent
* Planning Agent
* Review Agent
* Knowledge Agent
* Blueprint Agent
* Skill Agent

### Governance

* Reviews
* Approvals
* Risks
* Recommendations

### Knowledge System

* Lessons Learned
* Best Practices
* Decisions
* Patterns
* Research Records

### Blueprint System

* Reusable Project Templates
* Blueprint Versioning
* Blueprint Improvements

### Skill System

* Reusable Agent Skills
* Skill Versioning
* Skill Improvements

### Memory & Token Optimization

* Context Selection
* Context Compression
* Progressive Loading
* Summary First Strategy

---

## Architecture

```text
VS Code Extension
        │
        ▼
Runtime Engine
        │
        ▼
Parent Agent
        │
 ┌──────┼──────┐
 ▼      ▼      ▼
Discovery
Research
Planning
Review
Knowledge
Blueprint
        │
        ▼
Core Services
        │
        ▼
SQLite Database
```

---

## Technology Stack

### Frontend

* React
* TypeScript
* VS Code Webview

### Backend Runtime

* TypeScript
* Node.js

### Database

* SQLite

### ORM

* Drizzle ORM

### Queue

* BullMQ

### AI Providers

* OpenAI
* Anthropic
* Gemini

---

## Workspace Structure

```text
.agentix/

agentix.db

projects/

knowledge/

blueprints/

logs/

exports/

attachments/

settings/
```

---

## Prompt Types

Agentix OS supports multiple prompt categories:

### Idea Prompt

```text
I want to build an ERP system.
```

### Task Prompt

```text
Create Login API.
```

### Project Prompt

```text
Create Inventory Management System.
```

### Knowledge Prompt

```text
Show authentication best practices.
```

### Review Prompt

```text
Review this architecture.
```

---

## Project Lifecycle

```text
Idea
 ↓
Discovery
 ↓
Research
 ↓
Planning
 ↓
Review
 ↓
Approval
 ↓
Execution
 ↓
Knowledge
 ↓
Blueprint Improvement
```

---

## Development Roadmap

### Phase 1

* VS Code Extension
* SQLite Database
* Settings Management
* Dashboard

### Phase 2

* Projects
* Phases
* Tasks

### Phase 3

* Parent Agent
* Prompt Classifier
* Discovery Agent

### Phase 4

* Research & Planning

### Phase 5

* Reviews & Approvals

### Phase 6

* Knowledge System

### Phase 7

* Blueprint System

### Phase 8

* Memory & Token Optimization

---

## Repository Structure

```text
agentix-os/

apps/
 └── vscode-extension/

packages/
 ├── runtime/
 ├── database/
 ├── agents/
 ├── services/
 ├── ai/
 ├── shared/
 └── core/

docs/
```

---

## MVP Scope

Included:

* VS Code Extension
* Local Runtime
* SQLite Storage
* Parent Agent
* Discovery Agent
* Project Management
* Reviews
* Approvals
* Knowledge System

Not Included:

* Cloud Sync
* Multi User Support
* Marketplace
* Distributed Agents
* Remote Execution

---

## Getting Started

### Prerequisites

* VS Code
* Node.js 22+
* npm

### Installation

```bash
git clone <repository-url>

cd agentix-os

npm install
```

### Run Development Mode

```bash
npm run dev
```

### Launch Extension

Press:

```text
F5
```

inside VS Code to start the Extension Development Host.

---

## Documentation

See the `/docs` folder:

```text
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
```

---

## Philosophy

Agentix OS is not designed to replace humans.

It is designed to help humans:

* Think better
* Plan better
* Execute better
* Learn faster
* Reuse knowledge
* Improve future outcomes

The guiding principle is:

```text
AI Recommends
Humans Decide
```

---

## License

License information will be added before public release.
