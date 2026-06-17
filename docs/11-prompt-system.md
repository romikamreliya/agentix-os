# Prompt System

## Overview

The Prompt System is the entry point of Agentix OS.

Every user interaction begins with a prompt.

Before any agent executes, Agentix OS must understand:

* What the user wants
* The type of request
* The required workflow
* The required agents
* The required context

The Prompt System is responsible for classifying prompts and routing them to the correct workflow.

---

# Purpose

The Prompt System exists to:

* Understand user intent
* Reduce incorrect execution
* Select the correct workflow
* Minimize unnecessary context
* Improve AI accuracy
* Reduce token usage

---

# Core Principles

## Understand Before Acting

Agentix OS should not immediately execute tasks.

Workflow:

```text
Prompt
    ↓
Classification
    ↓
Discovery
    ↓
Execution
```

---

## Route Before Processing

Every prompt must be classified before agent execution.

---

## Ask When Uncertain

If confidence is low:

```text
Prompt
    ↓
Uncertain Classification
    ↓
Ask User
```

The system should clarify rather than guess.

---

# Prompt Architecture

```text
User Prompt
      ↓
Prompt Classifier
      ↓
Prompt Type
      ↓
Parent Agent
      ↓
Workflow
      ↓
Specialized Agents
```

---

# Prompt Classification

The Prompt Classifier determines:

```text
Prompt Type

Intent

Scope

Project Context

Required Agents
```

---

# Supported Prompt Types

## 1. Idea Prompt

Purpose:

Transform ideas into structured opportunities.

Examples:

```text
I want to build an ERP.

I have an idea for an AI assistant.

I want to create a delivery platform.
```

---

### Workflow

```text
Idea
 ↓
Discovery
 ↓
Research
 ↓
Planning
```

---

### Primary Agents

```text
Discovery Agent

Research Agent

Planning Agent
```

---

# 2. Task Prompt

Purpose:

Execute a specific task.

Examples:

```text
Create Login API

Fix Authentication Bug

Review This Query

Write Documentation
```

---

### Workflow

```text
Task
 ↓
Analysis
 ↓
Execution
 ↓
Review
```

---

### Primary Agents

```text
Execution Agent

Review Agent
```

---

# 3. Project Prompt

Purpose:

Create a complete project.

Examples:

```text
Build ERP System

Create CRM Platform

Create Inventory System
```

---

### Workflow

```text
Project
 ↓
Discovery
 ↓
Research
 ↓
Planning
 ↓
Project Creation
```

---

### Primary Agents

```text
Discovery Agent

Research Agent

Planning Agent
```

---

# 4. Existing Project Prompt

Purpose:

Continue work on an existing project.

Examples:

```text
Continue ERP Project

Show ERP Risks

Create ERP Phase 2
```

---

### Workflow

```text
Load Project
 ↓
Analyze Context
 ↓
Execute
```

---

### Primary Agents

```text
Parent Agent

Relevant Domain Agents
```

---

# 5. Knowledge Prompt

Purpose:

Retrieve or analyze knowledge.

Examples:

```text
Show Lessons Learned

Find Security Best Practices

What Have We Learned?
```

---

### Workflow

```text
Knowledge Request
 ↓
Knowledge Search
 ↓
Response
```

---

### Primary Agents

```text
Knowledge Agent
```

---

# 6. Blueprint Prompt

Purpose:

Manage blueprints.

Examples:

```text
Create Blueprint

Improve ERP Blueprint

Show Available Blueprints
```

---

### Primary Agents

```text
Blueprint Agent
```

---

# 7. Skill Prompt

Purpose:

Manage skills.

Examples:

```text
Create New Skill

Improve API Design Skill

Review Skill
```

---

### Primary Agents

```text
Skill Agent
```

---

# 8. Agent Prompt

Purpose:

Manage agents.

Examples:

```text
Create Agent

Review Agent

Improve Agent
```

---

### Primary Agents

```text
Parent Agent

Skill Agent

Review Agent
```

---

# 9. Review Prompt

Purpose:

Request evaluation.

Examples:

```text
Review Architecture

Review Plan

Review Task
```

---

### Primary Agents

```text
Review Agent
```

---

# 10. Approval Prompt

Purpose:

Request approval actions.

Examples:

```text
Approve Phase

Approve Blueprint

Review Pending Approvals
```

---

### Primary Agents

```text
Approval System

Parent Agent
```

---

# 11. System Prompt

Purpose:

Interact with Agentix OS itself.

Examples:

```text
Show Active Agents

Show System Status

Show Open Risks
```

---

### Primary Agents

```text
Parent Agent
```

---

# Discovery Integration

If information is missing:

```text
Prompt
 ↓
Discovery Agent
 ↓
Clarification Questions
 ↓
Updated Context
```

---

# Parent Agent Responsibilities

The Parent Agent must:

```text
Classify Prompt

Select Workflow

Select Agents

Manage Context

Track Progress
```

---

# Prompt Confidence

Every classification should include confidence.

Example:

```text
Prompt Type:
Project

Confidence:
92%
```

---

# Low Confidence Handling

If confidence is below threshold:

```text
Ask User
```

Example:

```text
Is this:

1. New Project
2. Existing Project
3. Task
4. Research Request
```

---

# Context Selection

Prompt classification determines:

```text
What Context To Load

What Knowledge To Load

What Project To Load

What Agents To Use
```

---

# Memory Optimization

Prompt classification reduces memory usage.

Instead of:

```text
Load Entire Project
```

Load:

```text
Relevant Context Only
```

---

# Token Optimization

Prompt classification reduces token usage.

Benefits:

```text
Less Context

Faster Responses

Lower Cost

Better Accuracy
```

---

# Governance Rules

## Rule 1

Every prompt must be classified.

---

## Rule 2

The Parent Agent owns routing.

---

## Rule 3

Discovery happens before execution when required.

---

## Rule 4

Users are asked when classification confidence is low.

---

## Rule 5

Prompt classification should minimize context usage.

---

# Future Possibilities

Future versions may support:

```text
Custom Prompt Types

Prompt Templates

Workflow Templates

Adaptive Classification

Prompt Analytics
```

These are outside MVP scope.

---

# Prompt System Summary

The Prompt System is the entry point of Agentix OS.

It transforms user requests into structured workflows by:

```text
Understanding Intent

Classifying Requests

Selecting Workflows

Selecting Agents

Managing Context
```

This ensures that Agentix OS remains accurate, efficient, governed, and scalable while minimizing unnecessary memory and token usage.
