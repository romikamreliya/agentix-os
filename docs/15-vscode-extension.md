# VS Code Extension

## Overview

The VS Code Extension is the primary user interface for Agentix OS.

It provides a complete project operating system experience directly inside Visual Studio Code.

The extension is responsible for:

* User interaction
* Project management
* Agent interaction
* Reviews
* Approvals
* Knowledge access
* Blueprint management
* Settings management

The extension is not responsible for business logic. Business logic belongs to the Agentix Runtime and Services.

---

# Goals

The extension should provide:

* Simple navigation
* Fast access to information
* Minimal context switching
* Clear project visibility
* Efficient agent interaction
* Consistent user experience

---

# Design Principles

## Local First

Everything should work locally.

---

## Productivity First

Minimize unnecessary clicks.

---

## Information On Demand

Show summaries first.

Load details when needed.

---

## Traceability

Users should always understand:

```text id="oq4a4a"
What happened

Why it happened

Who approved it
```

---

# Extension Architecture

```text id="ig3nm0"
VS Code
      ↓
Agentix Extension
      ↓
Webview UI
      ↓
Extension Host
      ↓
Agentix Runtime
```

---

# Main Navigation

Recommended sidebar:

```text id="55du4q"
Dashboard

Projects

Tasks

Agents

Reviews

Approvals

Knowledge

Blueprints

Settings
```

---

# Dashboard

## Purpose

Provide a high-level overview.

---

## Widgets

### Active Projects

Example:

```text id="4j1h1r"
ERP

CRM

Inventory
```

---

### Open Tasks

Display:

```text id="fbgq7v"
Pending

In Progress

Blocked
```

---

### Open Reviews

Display:

```text id="6np04x"
Pending Reviews

Critical Findings
```

---

### Open Approvals

Display:

```text id="ij92jq"
Pending Approvals

Blocked Approvals
```

---

### Active Risks

Display:

```text id="s16m0q"
Critical Risks

High Risks
```

---

### Recent Activity

Display:

```text id="l7tp8i"
Project Events

Approvals

Reviews

Knowledge Updates
```

---

# Projects View

## Purpose

Manage projects.

---

## Features

```text id="phvrcx"
Create Project

Update Project

Archive Project

Search Projects
```

---

## Layout

```text id="vgfkgk"
Project List
      │
      ├── Details
      ├── Phases
      ├── Tasks
      ├── Reviews
      ├── Risks
      └── Knowledge
```

---

# Project Detail View

## Sections

### Overview

Displays:

```text id="rjlwmr"
Status

Progress

Owner

Created Date
```

---

### Phases

Displays:

```text id="o2p0m4"
Phase List

Status

Progress
```

---

### Tasks

Displays:

```text id="0th55u"
Task List

Priority

Status
```

---

### Reviews

Displays:

```text id="4a4htm"
Review History
```

---

### Approvals

Displays:

```text id="gktxan"
Approval History
```

---

### Risks

Displays:

```text id="4mhj3h"
Open Risks

Resolved Risks
```

---

# Tasks View

## Purpose

Manage project work.

---

## Features

```text id="fjwccr"
Task Creation

Task Assignment

Task Tracking

Task Review
```

---

## Task Board

Recommended:

```text id="mk1g3u"
Pending

In Progress

Review

Blocked

Completed
```

Kanban style.

---

# Agents View

## Purpose

Manage agent activity.

---

## Displays

```text id="x58d0e"
Agent Templates

Agent Instances

Status

Assigned Tasks
```

---

## Agent Detail

Displays:

```text id="m8c3wn"
Skills

Performance

Reviews

Recommendations
```

---

# Agent Chat

## Purpose

Interact with Agentix OS.

---

## Features

```text id="viyb5i"
Prompt Entry

Agent Responses

Workflow History

Discovery Questions
```

---

## Chat Modes

### Project Mode

Context:

```text id="8fx10u"
Current Project
```

---

### Task Mode

Context:

```text id="v4wdsy"
Current Task
```

---

### Global Mode

Context:

```text id="4g1q84"
Entire Workspace
```

---

# Reviews View

## Purpose

Manage reviews.

---

## Displays

```text id="zrr6w7"
Open Reviews

Completed Reviews

Critical Findings
```

---

# Approvals View

## Purpose

Manage approvals.

---

## Displays

```text id="xljm9l"
Pending Approvals

Approved

Rejected

Blocked
```

---

# Knowledge View

## Purpose

Access organizational knowledge.

---

## Features

```text id="v7m9go"
Search

Categories

Tags

References
```

---

# Blueprint View

## Purpose

Manage blueprints.

---

## Features

```text id="mwxql0"
Blueprint List

Versions

Usage

Improvements
```

---

# Settings View

## Purpose

Configure Agentix OS.

---

## Sections

### AI Providers

```text id="9a5a0n"
OpenAI

Anthropic

Gemini
```

API keys stored locally.

---

### Runtime

```text id="bjqwwf"
Memory Limits

Token Limits

Queue Settings
```

---

### Workspace

```text id="4gfxtu"
Storage Location

Backup Options
```

---

# Command Palette Integration

Recommended commands:

```text id="o7s0ij"
Agentix: Create Project

Agentix: Open Dashboard

Agentix: Create Task

Agentix: Show Approvals

Agentix: Open Knowledge
```

---

# Notifications

## Examples

```text id="q4zv4h"
Review Completed

Approval Requested

Risk Created

Task Assigned
```

---

## Priority Levels

```text id="nxxd9i"
Info

Warning

Critical
```

---

# Search System

Global search across:

```text id="6qn9l5"
Projects

Tasks

Knowledge

Blueprints

Agents

Risks
```

---

# UI Performance Rules

## Rule 1

Show summaries first.

---

## Rule 2

Load details on demand.

---

## Rule 3

Avoid loading entire projects.

---

## Rule 4

Use cached summaries when possible.

---

# Accessibility

The extension should support:

```text id="wy3tf6"
Keyboard Navigation

Screen Readers

High Contrast Themes
```

---

# Future Features

Future versions may include:

```text id="4muvtb"
Multi User Support

Collaboration

Cloud Sync

Marketplace
```

Not part of MVP.

---

# Governance Rules

## Rule 1

The extension displays information.

---

## Rule 2

Business logic belongs to services.

---

## Rule 3

Approvals require explicit user action.

---

## Rule 4

Critical actions require confirmation.

---

# VS Code Extension Summary

The VS Code Extension is the user-facing layer of Agentix OS.

It provides a complete interface for:

```text id="knkz6p"
Projects

Tasks

Agents

Reviews

Approvals

Knowledge

Blueprints
```

while keeping business logic inside the runtime and services.

The goal is to create a productive, local-first workspace where users can manage projects, collaborate with agents, and continuously improve through knowledge and governance.
