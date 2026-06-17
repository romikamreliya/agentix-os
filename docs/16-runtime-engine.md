# Runtime Engine

## Overview

The Runtime Engine is the core execution layer of Agentix OS.

It is responsible for:

* Prompt processing
* Workflow orchestration
* Agent coordination
* Context management
* Event handling
* Memory optimization
* Token optimization

The Runtime Engine acts as the operating system behind the user interface.

---

# Purpose

The Runtime Engine exists to:

* Execute workflows
* Coordinate agents
* Manage context
* Enforce governance
* Optimize memory usage
* Optimize token consumption
* Maintain traceability

---

# High-Level Architecture

```text
User
  ↓
VS Code UI
  ↓
Runtime Engine
  ↓
Parent Agent
  ↓
Workflow Engine
  ↓
Specialized Agents
  ↓
Services
  ↓
Database
```

---

# Runtime Components

```text
Prompt Classifier

Parent Agent

Workflow Engine

Agent Manager

Memory Engine

Token Engine

Event Bus

Context Manager

Queue Manager

AI Provider Manager
```

---

# Prompt Classifier

## Purpose

Identify user intent.

---

## Input

```text
User Prompt
```

---

## Output

```text
Prompt Type

Confidence Score

Required Workflow
```

---

## Supported Types

```text
IDEA

TASK

PROJECT

EXISTING_PROJECT

KNOWLEDGE

AGENT

SKILL

SYSTEM

REVIEW

APPROVAL
```

---

# Parent Agent

## Purpose

Central coordinator.

---

## Responsibilities

```text
Workflow Selection

Agent Selection

Context Coordination

Approval Coordination

Progress Tracking
```

---

## Rules

The Parent Agent:

```text
May Coordinate
```

The Parent Agent:

```text
Should Not Perform
Specialized Work
```

---

# Workflow Engine

## Purpose

Execute structured workflows.

---

## Examples

```text
Discovery Workflow

Research Workflow

Planning Workflow

Review Workflow

Approval Workflow
```

---

# Workflow Structure

```text
Start
  ↓
Steps
  ↓
Validation
  ↓
Completion
```

---

# Workflow States

```text
Created

Running

Paused

Blocked

Completed

Cancelled
```

---

# Agent Manager

## Purpose

Manage agents.

---

## Responsibilities

```text
Agent Creation

Agent Assignment

Agent Lifecycle

Agent Execution
```

---

# Agent Execution Model

```text
Parent Agent
      ↓
Assign Work
      ↓
Agent Executes
      ↓
Results Returned
      ↓
Parent Agent
```

---

# Agent Communication

Avoid:

```text
Agent A
 ↓
Agent B
```

Prefer:

```text
Agent A
 ↓
Parent Agent
 ↓
Agent B
```

---

# Discovery Workflow

```text
Prompt
 ↓
Discovery Agent
 ↓
Questions
 ↓
Discovery Report
```

---

# Research Workflow

```text
Discovery Report
 ↓
Research Agent
 ↓
Research Findings
```

---

# Planning Workflow

```text
Discovery
 ↓
Research
 ↓
Planning Agent
 ↓
Project Plan
```

---

# Review Workflow

```text
Entity
 ↓
Review Agent
 ↓
Review Findings
```

---

# Approval Workflow

```text
Approval Request
 ↓
Review
 ↓
Decision
```

---

# Memory Engine

## Purpose

Manage context loading.

---

# Memory Layers

```text
L1 Active Context

L2 Session Context

L3 Project Context

L4 Knowledge Context

L5 Archive Context
```

---

# Memory Rules

```text
Load Minimum Required Context
```

Avoid:

```text
Load Entire Workspace
```

---

# Context Manager

## Purpose

Build context packages.

---

## Responsibilities

```text
Context Selection

Context Ranking

Context Compression

Context Retrieval
```

---

# Context Ranking

Factors:

```text
Relevance

Priority

Recency

Confidence
```

---

# Token Engine

## Purpose

Reduce token consumption.

---

## Responsibilities

```text
Compression

Summarization

Budget Tracking

Usage Tracking
```

---

# Token Strategy

```text
Summary First

Details On Demand
```

---

# Event Bus

## Purpose

Enable loose coupling.

---

# Event Flow

```text
Action
 ↓
Event
 ↓
Subscribers
```

---

## Example

```text
Project Created
 ↓
ProjectCreated Event
 ↓
Interested Services
```

---

# Core Events

```text
ProjectCreated

TaskCreated

ReviewCreated

ApprovalRequested

KnowledgeCreated

BlueprintUpdated
```

---

# Queue Manager

## Purpose

Handle background jobs.

---

# Recommended Technology

```text
BullMQ
```

---

# Background Tasks

Examples:

```text
Research

Knowledge Extraction

Large Reviews

Blueprint Analysis
```

---

# AI Provider Manager

## Purpose

Manage AI integrations.

---

# Supported Providers

```text
OpenAI

Anthropic

Gemini
```

---

# Provider Interface

```text
generate()

review()

analyze()

summarize()
```

---

# Provider Selection

The runtime should select providers based on:

```text
Task Type

Cost

Context Size

User Preferences
```

---

# State Management

## Purpose

Track runtime state.

---

## Examples

```text
Running Workflows

Active Agents

Pending Approvals

Open Reviews
```

---

# Error Handling

## Strategy

```text
Detect

Log

Retry

Escalate
```

---

# Retry Policy

For transient failures:

```text
Attempt 1

Attempt 2

Attempt 3

Fail
```

---

# Logging

Important actions should be logged.

Examples:

```text
Workflow Started

Workflow Completed

Agent Assigned

Approval Granted

Knowledge Created
```

---

# Metrics

Track:

```text
Workflow Duration

Agent Activity

Token Usage

Memory Usage

Queue Activity

AI Requests
```

---

# Governance Enforcement

The Runtime Engine enforces:

```text
AI Recommends

Humans Decide
```

---

# Approval Enforcement

The runtime must prevent:

```text
Blueprint Updates

Skill Updates

Phase Completion
```

when required approvals are missing.

---

# Security

The runtime should protect:

```text
API Keys

Project Data

Knowledge Data
```

---

# Runtime Startup

```text
VS Code Starts
      ↓
Agentix Extension Loads
      ↓
Runtime Starts
      ↓
Services Register
      ↓
Event Bus Starts
      ↓
Ready
```

---

# Runtime Shutdown

```text
Save State
 ↓
Flush Queue
 ↓
Close Database
 ↓
Shutdown
```

When VS Code closes:

```text
Agentix Runtime Stops
```

This aligns with the local-first design.

---

# Future Possibilities

Future versions may support:

```text
Distributed Agents

Remote Workers

Cloud Execution

Plugin Runtime
```

These are outside MVP scope.

---

# Runtime Engine Summary

The Runtime Engine is the heart of Agentix OS.

It coordinates:

```text
Workflows

Agents

Memory

Tokens

Events

Approvals

Knowledge
```

while enforcing governance, optimizing resources, and maintaining a consistent execution model across the entire platform.

The Runtime Engine transforms Agentix OS from a collection of screens into a functioning AI-powered operating system.
