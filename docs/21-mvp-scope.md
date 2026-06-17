# MVP Scope

## Overview

This document defines the official Minimum Viable Product (MVP) scope for Agentix OS.

The MVP exists to validate the core vision while minimizing complexity, development time, and maintenance costs.

The purpose of the MVP is not to build the final product.

The purpose is to prove that the architecture, workflows, and operating model work correctly.

---

# MVP Goal

The MVP must allow a user to:

```text
Create Project
      ↓
Run Discovery
      ↓
Generate Plan
      ↓
Manage Tasks
      ↓
Review Work
      ↓
Approve Decisions
      ↓
Capture Knowledge
```

inside VS Code.

---

# MVP Success Criteria

The MVP is successful if a user can:

* Install the extension
* Configure an AI provider
* Create a project
* Run discovery
* Generate a project plan
* Manage tasks
* Complete reviews
* Approve decisions
* Store knowledge
* Reuse knowledge

---

# MVP Principles

## Principle 1

Local First

Everything runs on the user's machine.

---

## Principle 2

Single User

The MVP supports one user only.

---

## Principle 3

Human Governance

Users approve important decisions.

---

## Principle 4

Incremental Learning

Projects create reusable knowledge.

---

## Principle 5

Minimal Complexity

Only essential features are included.

---

# Included Features

## VS Code Extension

Included:

```text
Sidebar Navigation

Dashboard

Project Screens

Task Screens

Agent Chat

Settings
```

---

# AI Providers

Included:

```text
OpenAI

Anthropic

Gemini
```

---

# Local Storage

Included:

```text
SQLite

Drizzle ORM

Local Workspace
```

---

# Project Management

Included:

```text
Projects

Sub Projects

Phases

Tasks

Sub Tasks
```

---

# Prompt System

Included:

```text
Prompt Classification

Workflow Routing

Prompt Types
```

Supported Prompt Types:

```text
Idea

Task

Project

Knowledge

Review

Approval

System
```

---

# Parent Agent

Included:

```text
Prompt Routing

Agent Coordination

Context Management

Workflow Tracking
```

---

# Discovery Agent

Included:

```text
Question Engine

Requirement Collection

Discovery Reports
```

---

# Research Agent

Included:

```text
Technology Research

Risk Identification

Research Reports
```

---

# Planning Agent

Included:

```text
Project Planning

Phase Planning

Task Planning
```

---

# Governance

Included:

```text
Reviews

Approvals

Risks

Recommendations
```

---

# Knowledge System

Included:

```text
Knowledge Records

Lessons Learned

Knowledge Search

Knowledge Categories
```

---

# Runtime Engine

Included:

```text
Workflow Engine

Agent Manager

Event Bus

Context Manager
```

---

# Memory Optimization

Included:

```text
Context Selection

Summaries

Progressive Loading
```

---

# Token Optimization

Included:

```text
Token Tracking

Token Budgeting

Context Compression
```

---

# Basic Event System

Included:

```text
ProjectCreated

TaskCreated

ReviewCreated

ApprovalRequested
```

---

# Basic Logging

Included:

```text
Application Logs

Workflow Logs

Agent Logs
```

---

# MVP Database Entities

Included:

```text
Project

Sub Project

Phase

Task

Sub Task

Review

Approval

Risk

Recommendation

Knowledge
```

---

# MVP Agents

Included:

```text
Parent Agent

Discovery Agent

Research Agent

Planning Agent

Review Agent

Knowledge Agent
```

---

# Deferred Features

The following features are intentionally excluded from MVP.

---

## Multi User Support

Excluded.

Reason:

```text
Not required for architecture validation.
```

---

## Cloud Sync

Excluded.

Reason:

```text
Local First MVP.
```

---

## Team Collaboration

Excluded.

Reason:

```text
Single-user MVP.
```

---

## Marketplace

Excluded.

Reason:

```text
Future ecosystem feature.
```

---

## Plugin System

Excluded.

Reason:

```text
Core platform first.
```

---

## Custom Agent Builder

Excluded.

Reason:

```text
Requires stable agent architecture.
```

---

## Distributed Agents

Excluded.

Reason:

```text
Not required for MVP.
```

---

## Remote Execution

Excluded.

Reason:

```text
Local runtime only.
```

---

## Blueprint System

Deferred to v1.1

Reason:

```text
Requires mature knowledge system.
```

---

## Skill Versioning

Deferred to v1.1

Reason:

```text
Not critical for MVP.
```

---

## Analytics Dashboard

Deferred.

Reason:

```text
Low priority.
```

---

## Reports Module

Deferred.

Reason:

```text
Not required for validation.
```

---

# MVP User Flow

```text
Create Project
      ↓
Discovery Agent
      ↓
Research Agent
      ↓
Planning Agent
      ↓
Generate Tasks
      ↓
Execution
      ↓
Review
      ↓
Approval
      ↓
Knowledge
```

---

# MVP UI Screens

Included:

```text
Dashboard

Projects

Tasks

Agent Chat

Reviews

Approvals

Knowledge

Settings
```

---

# MVP Technical Requirements

## Required

```text
TypeScript

SQLite

Drizzle ORM

React

VS Code Extension API

BullMQ
```

---

## Required TypeScript Mode

```text
strict = true
```

---

# MVP Performance Targets

Extension Startup:

```text
< 5 seconds
```

---

Project Load:

```text
< 2 seconds
```

---

Prompt Classification:

```text
< 1 second
```

---

# MVP Quality Targets

```text
70%+ Test Coverage

Zero TypeScript Errors

Zero ESLint Errors
```

---

# MVP Release Criteria

Before release:

```text
Projects Work

Discovery Works

Planning Works

Reviews Work

Approvals Work

Knowledge Works

Data Persists

Extension Stable
```

---

# Out of Scope

Anything not explicitly listed as included should be considered out of scope for MVP.

Examples:

```text
Cloud Infrastructure

Team Collaboration

Marketplace

Advanced Analytics

Enterprise Features

Distributed Runtime
```

---

# MVP Summary

The Agentix OS MVP focuses on validating the core operating model:

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
```

while remaining:

```text
Local First

Single User

Governed

Traceable

Extensible
```

The MVP should prove the architecture works before additional complexity is introduced.
