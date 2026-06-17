# API Design

## Overview

Agentix OS is a local-first system and does not require traditional REST APIs for internal communication.

Instead, the system uses a service-oriented architecture with an internal event bus.

This document defines how modules communicate, how services are organized, and how future external APIs may be exposed.

---

# Goals

The API design should provide:

* Clear module boundaries
* Loose coupling
* High maintainability
* Easy testing
* Future extensibility
* Event-driven workflows

---

# Architecture

```text
VS Code UI
      ↓
Commands
      ↓
Application Services
      ↓
Domain Services
      ↓
Database
```

---

# Communication Types

Agentix OS supports three communication methods.

```text
Direct Service Calls

Internal Events

Future External APIs
```

---

# Service Layer

The service layer contains all business logic.

Example:

```text
Project Service

Task Service

Review Service

Approval Service

Risk Service

Recommendation Service

Knowledge Service

Blueprint Service

Agent Service

Skill Service
```

---

# Service Design Rules

## Rule 1

Business logic belongs in services.

Avoid:

```text
UI → Database
```

Prefer:

```text
UI
 ↓
Service
 ↓
Database
```

---

## Rule 2

Services should not directly depend on UI.

---

## Rule 3

Services should be independently testable.

---

## Rule 4

Services should communicate through contracts.

---

# Application Layer

Purpose:

Coordinate workflows.

Examples:

```text
Project Creation Workflow

Discovery Workflow

Research Workflow

Planning Workflow

Review Workflow

Approval Workflow
```

---

# Domain Layer

Purpose:

Manage business entities.

Examples:

```text
Projects

Tasks

Risks

Reviews

Approvals

Knowledge

Blueprints
```

---

# Internal Service Structure

Example:

```text
ProjectService

create()

update()

archive()

get()

list()
```

---

# Command Pattern

UI actions become commands.

Example:

```text
Create Project
      ↓
CreateProjectCommand
      ↓
Project Service
```

Benefits:

```text
Traceability

Validation

Consistency
```

---

# Event Driven Design

Events are used for cross-module communication.

Example:

```text
Project Created
      ↓
Event
      ↓
Interested Services
```

---

# Event Naming

Recommended format:

```text
EntityAction
```

Examples:

```text
ProjectCreated

ProjectArchived

PhaseCompleted

ReviewCreated

ApprovalRequested

KnowledgeCreated

BlueprintUpdated
```

---

# Event Flow Example

```text
Project Created
      ↓
ProjectCreated Event
      ↓
Knowledge Service

Blueprint Service

Analytics Service
```

Services react independently.

---

# Core Events

## Project Events

```text
ProjectCreated

ProjectUpdated

ProjectArchived
```

---

## Phase Events

```text
PhaseStarted

PhaseCompleted

PhaseApproved
```

---

## Task Events

```text
TaskCreated

TaskAssigned

TaskCompleted
```

---

## Review Events

```text
ReviewCreated

ReviewCompleted
```

---

## Approval Events

```text
ApprovalRequested

ApprovalApproved

ApprovalRejected
```

---

## Knowledge Events

```text
KnowledgeCreated

KnowledgePublished

KnowledgeUpdated
```

---

## Blueprint Events

```text
BlueprintCreated

BlueprintVersionCreated
```

---

# Agent Communication

Agents communicate through the Parent Agent.

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

This centralizes coordination.

---

# Request Context

Every request should contain:

```text
Project

User

Workflow

Agent

Correlation ID
```

This improves traceability.

---

# Response Format

Recommended internal format:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

---

# Error Format

Recommended format:

```json
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project not found"
  }
}
```

---

# Validation Strategy

Validation should occur:

```text
UI
 ↓
Basic Validation

Service
 ↓
Business Validation
```

Business rules must always be enforced by services.

---

# Transaction Strategy

Use database transactions for:

```text
Project Creation

Blueprint Updates

Skill Updates

Approval Actions
```

Multiple writes should be atomic.

---

# Background Jobs

Certain actions should run asynchronously.

Examples:

```text
Research

Knowledge Extraction

Blueprint Analysis

Large Reviews
```

---

# Queue System

Recommended:

```text
BullMQ
```

Responsibilities:

```text
Background Processing

Retries

Scheduling
```

---

# AI Provider Layer

Purpose:

Abstract AI providers.

---

# Provider Interface

Example:

```text
generate()

analyze()

review()

summarize()
```

---

# Supported Providers

```text
OpenAI

Anthropic

Gemini
```

Future providers can be added without changing business logic.

---

# External API Support

Not required for MVP.

Future versions may expose:

```text
REST API

GraphQL API

Webhooks
```

---

# API Versioning

Future external APIs should support:

```text
v1

v2
```

Versioning is not required for internal services.

---

# Security Considerations

Internal services should enforce:

```text
Authorization

Validation

Audit Logging
```

Even in local-first mode.

---

# Logging

Important actions should generate logs.

Examples:

```text
Project Creation

Approvals

Blueprint Updates

Skill Updates
```

---

# Metrics

Track:

```text
Service Execution Time

Event Count

Failed Requests

AI Usage

Queue Metrics
```

---

# Governance Rules

## Rule 1

Business logic belongs in services.

---

## Rule 2

Use events for cross-module communication.

---

## Rule 3

Agents communicate through Parent Agent.

---

## Rule 4

Validate at service level.

---

## Rule 5

Important actions should be traceable.

---

# Future Possibilities

Future versions may support:

```text
Plugin APIs

Extension APIs

Remote Execution APIs

Cloud Synchronization APIs
```

Outside MVP scope.

---

# API Design Summary

Agentix OS uses:

```text
Service-Oriented Architecture

Event-Driven Communication

Parent Agent Coordination

Provider Abstraction
```

to create a maintainable, scalable, and governance-focused platform.

The API design prioritizes:

```text
Traceability

Modularity

Maintainability

Extensibility
```

while remaining simple enough for a local-first MVP.
