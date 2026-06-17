# Database Design

## Overview

This document defines the database architecture, design principles, entities, relationships, and storage strategy for Agentix OS.

The database is the single source of truth for all persistent data.

Agentix OS uses a local-first architecture and stores all data on the user's machine.

---

# Technology Stack

## Database

```text
SQLite
```

Reason:

* Local First
* Zero Configuration
* Fast Setup
* Embedded Database
* Easy Backup
* Cross Platform

---

## ORM

```text
Drizzle ORM
```

Reason:

* Type Safety
* SQLite Support
* Schema Management
* Migration Support

---

# Database Principles

## Single Source of Truth

Every entity has one authoritative location.

Avoid:

```text
Duplicate Data
```

Prefer:

```text
Normalized Relationships
```

---

## UUID Based IDs

All primary entities use UUID.

Example:

```text
id TEXT PRIMARY KEY
```

---

## Soft Delete

All important entities support:

```text
is_active

status
```

Avoid physical deletion where possible.

---

## Auditability

Important entities should track:

```text
created_at

updated_at

created_by

updated_by
```

---

# Core Entity Model

```text
Project
│
├── Sub Project
│
├── Phase
│
├── Task
│
└── Sub Task

Review

Approval

Risk

Recommendation

Agent Template

Agent Instance

Skill

Skill Version

Knowledge

Blueprint

Blueprint Version
```

---

# Project Module

## Projects

Purpose:

Top-level container.

Fields:

```text
id

name

description

status

created_at

updated_at
```

---

## Sub Projects

Purpose:

Logical project grouping.

Fields:

```text
id

project_id

name

description

status
```

---

## Phases

Purpose:

Project milestones.

Fields:

```text
id

project_id

sub_project_id

name

description

sequence

status
```

---

## Tasks

Purpose:

Executable work units.

Fields:

```text
id

phase_id

title

description

priority

status
```

---

## Sub Tasks

Purpose:

Task breakdown.

Fields:

```text
id

task_id

title

status
```

---

# Governance Module

## Reviews

Purpose:

Quality evaluation.

Fields:

```text
id

entity_type

entity_id

category

severity

status

summary
```

---

## Approvals

Purpose:

Decision records.

Fields:

```text
id

entity_type

entity_id

decision

reason

status
```

---

# Risk Module

## Risks

Purpose:

Track threats.

Fields:

```text
id

source_type

source_id

title

description

severity

probability

impact

status

mitigation_plan
```

---

# Recommendation Module

## Recommendations

Purpose:

Track opportunities.

Fields:

```text
id

source_type

source_id

title

description

priority

confidence

status
```

---

# Agent Module

## Agent Templates

Purpose:

Reusable agent definitions.

Fields:

```text
id

name

description

role

configuration

status
```

---

## Agent Instances

Purpose:

Project-specific agents.

Fields:

```text
id

project_id

template_id

name

configuration

status
```

---

# Skill Module

## Skills

Purpose:

Reusable capabilities.

Fields:

```text
id

name

description

category

current_version

status
```

---

## Skill Versions

Purpose:

Version history.

Fields:

```text
id

skill_id

version

content

created_at
```

---

## Agent Skills

Purpose:

Skill assignments.

Fields:

```text
agent_instance_id

skill_id

skill_version
```

---

# Knowledge Module

## Knowledge

Purpose:

Reusable intelligence.

Fields:

```text
id

scope

project_id

type

category

title

summary

content

status
```

---

# Blueprint Module

## Blueprints

Purpose:

Reusable project structures.

Fields:

```text
id

name

category

current_version

status
```

---

## Blueprint Versions

Purpose:

Blueprint history.

Fields:

```text
id

blueprint_id

version

content

created_at
```

---

# Relationship Tables

## Task Agents

Purpose:

Multi-agent assignments.

Fields:

```text
task_id

agent_instance_id

role
```

Roles:

```text
OWNER

CONTRIBUTOR

REVIEWER

TESTER

OBSERVER
```

---

## Knowledge References

Purpose:

Entity relationships.

Fields:

```text
knowledge_id

entity_type

entity_id
```

---

## Blueprint Skills

Purpose:

Blueprint skill mapping.

Fields:

```text
blueprint_id

skill_id
```

---

# Entity Relationships

## Project Structure

```text
Project
    ↓
Sub Project
    ↓
Phase
    ↓
Task
    ↓
Sub Task
```

---

## Governance

```text
Project
Task
Phase
Knowledge
Blueprint
Skill
    ↓
Review
    ↓
Approval
```

---

## Learning

```text
Project
      ↓
Knowledge
      ↓
Blueprint Improvement

Knowledge
      ↓
Skill Improvement
```

---

## Agent Assignment

```text
Task
      ↓
Task Agents
      ↓
Agent Instance
      ↓
Agent Template
```

---

# Status Design

Recommended statuses.

---

## Project Status

```text
DRAFT

DISCOVERY

RESEARCH

PLANNING

EXECUTION

COMPLETED

ARCHIVED
```

---

## Phase Status

```text
NOT_STARTED

IN_PROGRESS

UNDER_REVIEW

AWAITING_APPROVAL

COMPLETED

BLOCKED
```

---

## Task Status

```text
PENDING

IN_PROGRESS

UNDER_REVIEW

COMPLETED

BLOCKED

CANCELLED
```

---

## Risk Status

```text
OPEN

MITIGATING

RESOLVED

ACCEPTED
```

---

## Recommendation Status

```text
OPEN

REVIEWING

APPROVED

REJECTED

ARCHIVED
```

---

# Indexing Strategy

Recommended indexes:

```text
project_id

phase_id

task_id

entity_type

entity_id

status

created_at
```

---

# Storage Location

All data stored inside:

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

logs/

exports/

settings/
```

---

# Future Database Features

Future versions may include:

```text
Vector Search

Full Text Search

Analytics Tables

Usage Metrics

AI Performance Tracking
```

Not required for MVP.

---

# Database Summary

The Agentix OS database is designed around:

```text
Projects

Governance

Agents

Skills

Knowledge

Blueprints
```

while maintaining:

```text
Local First

Traceability

Versioning

Governance

Continuous Learning
```

The database acts as the foundation for every workflow, agent, and decision inside Agentix OS.
