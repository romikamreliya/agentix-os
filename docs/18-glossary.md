# Glossary

## Overview

This document defines the official terminology used throughout Agentix OS.

All documentation, code, workflows, database schemas, and user interfaces should use these definitions consistently.

The glossary serves as the single source of truth for business terminology.

---

# A

## Agent

A specialized AI worker responsible for performing a specific role within Agentix OS.

Examples:

```text
Discovery Agent
Research Agent
Planning Agent
Review Agent
Knowledge Agent
```

Agents perform work but do not make final decisions.

---

## Agent Instance

A project-specific implementation of an agent template.

Example:

```text
Template:
Backend Agent

Instance:
ERP Backend Agent
```

---

## Agent Template

A reusable definition of an agent.

Contains:

```text
Responsibilities

Capabilities

Default Skills

Configuration
```

---

## Approval

A formal human decision that authorizes or rejects an action.

Examples:

```text
Phase Approval

Blueprint Approval

Skill Approval
```

Approvals represent governance.

---

# B

## Blueprint

A reusable project framework that captures successful structures, processes, skills, and practices.

Blueprints are living entities and evolve through versioning.

---

## Blueprint Version

A specific version of a blueprint.

Example:

```text
ERP Blueprint v1.0

ERP Blueprint v1.1
```

---

# C

## Context

The information loaded into an agent's working memory to complete a task.

Examples:

```text
Task Details

Knowledge

Project Information
```

Agentix OS loads only relevant context.

---

## Context Compression

The process of reducing context size through summaries and structured representations.

Used to reduce token consumption.

---

# D

## Discovery

The process of gathering requirements and clarifying objectives before planning or execution.

---

## Discovery Agent

An agent responsible for requirement gathering and clarification.

The Discovery Agent may ask users questions.

---

# E

## Event

A record representing something that occurred in the system.

Examples:

```text
ProjectCreated

ReviewCompleted

ApprovalRequested
```

Events enable communication between services.

---

## Event Bus

The internal mechanism used to distribute events throughout Agentix OS.

---

# G

## Governance

The collection of rules, approvals, reviews, and controls that guide decision-making.

Governance ensures:

```text
Traceability

Accountability

Human Oversight
```

---

# I

## Idea Prompt

A prompt describing an idea that has not yet been transformed into a project.

Example:

```text
I want to build an ERP system.
```

---

# K

## Knowledge

Reusable intelligence captured from projects, reviews, research, and lessons learned.

Knowledge is a first-class entity.

---

## Knowledge Base

The collection of all knowledge records stored within Agentix OS.

---

## Knowledge Record

A specific knowledge item.

Examples:

```text
Best Practice

Lesson Learned

Decision

Pattern
```

---

# M

## Memory Layer

A logical level of context storage.

Examples:

```text
Active Context

Project Context

Knowledge Context
```

---

## Memory Optimization

The process of minimizing unnecessary context loading.

Goal:

```text
Load Minimum Required Context
```

---

# P

## Parent Agent

The central coordinator responsible for:

```text
Workflow Routing

Agent Coordination

Context Management
```

The Parent Agent does not perform specialized work directly.

---

## Phase

A major project milestone containing tasks.

Example:

```text
Discovery

Research

Planning

Execution
```

---

## Project

The highest-level organizational entity within Agentix OS.

Projects contain:

```text
Sub Projects

Phases

Tasks
```

---

## Project Knowledge

Knowledge specific to a project.

Example:

```text
ERP Authentication Decisions
```

---

## Prompt

A request submitted by a user.

Every prompt is classified before execution.

---

## Prompt Classifier

The runtime component responsible for identifying prompt types and selecting workflows.

---

# Q

## Queue Manager

The runtime component responsible for background processing and asynchronous jobs.

Recommended technology:

```text
BullMQ
```

---

# R

## Recommendation

A suggested improvement, opportunity, or action identified by the system.

Recommendations are advisory.

They do not automatically create changes.

---

## Research

The process of gathering information required for informed decision-making.

---

## Research Agent

An agent responsible for research activities.

---

## Review

An evaluation performed on an entity.

Reviews identify:

```text
Issues

Risks

Recommendations
```

Reviews do not make decisions.

---

## Review Agent

An agent responsible for performing reviews.

---

## Runtime Engine

The execution core of Agentix OS.

Responsible for:

```text
Workflows

Agents

Events

Memory

Tokens
```

---

# S

## Skill

A reusable capability that can be assigned to one or more agents.

Examples:

```text
API Design

Code Review

Project Planning
```

---

## Skill Improvement

A proposed enhancement to a skill.

Requires:

```text
Review

Approval
```

---

## Skill Version

A specific version of a skill.

Example:

```text
API Design v1.0

API Design v1.1
```

---

## Sub Project

A logical grouping inside a project.

Used to organize large projects.

---

## Sub Task

A smaller work item that belongs to a task.

---

# T

## Task

An executable unit of work.

Tasks belong to phases.

---

## Task Prompt

A prompt requesting execution of a specific task.

Example:

```text
Create Login API
```

---

## Token Budget

The maximum number of AI tokens allocated to a workflow or operation.

---

## Token Optimization

The process of reducing unnecessary token usage through:

```text
Summaries

Compression

Context Selection
```

---

# U

## User

The human operator of Agentix OS.

Users are responsible for final decisions.

---

# V

## Version

A numbered revision of an entity.

Examples:

```text
Blueprint Version

Skill Version
```

Versioning provides traceability.

---

# W

## Workflow

A structured sequence of steps used to achieve a goal.

Examples:

```text
Discovery Workflow

Planning Workflow

Review Workflow
```

---

## Workflow Engine

The runtime component responsible for executing workflows.

---

# Core Principles Reference

Agentix OS is built on the following principles:

```text
AI Recommends

Humans Decide

Nothing Important Happens Automatically

Knowledge Drives Improvement

Discovery Before Execution

Local First

Continuous Learning
```

---

# Entity Reference

Core entities within Agentix OS:

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

Agent Template

Agent Instance

Skill

Skill Version

Knowledge

Blueprint

Blueprint Version
```

---

# System Summary

Agentix OS is a local-first AI operating system designed to transform ideas into successful outcomes through:

```text
Discovery

Research

Planning

Execution

Review

Approval

Knowledge

Blueprint Improvement

Continuous Learning
```

This glossary serves as the authoritative definition of terminology used throughout the platform.
