# Project Lifecycle

## Overview

Agentix OS is designed to guide projects through a structured lifecycle.

The lifecycle ensures that projects move through consistent stages, reducing uncertainty, improving planning quality, and capturing reusable knowledge.

Every project follows the same high-level flow.

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
```

---

# Lifecycle Goals

The project lifecycle exists to:

* Reduce project failure risk
* Improve planning quality
* Ensure traceability
* Capture lessons learned
* Enable continuous improvement
* Reuse successful patterns

---

# Stage 1: Idea

## Purpose

Capture an idea before any implementation begins.

Examples:

```text
Build ERP System

Create Inventory Management System

Develop AI Assistant

Improve Existing Product
```

---

## Inputs

User prompt

Example:

```text
I want to build an ERP system.
```

---

## Outputs

```text
Idea Record

Initial Scope

Initial Objectives
```

---

# Stage 2: Discovery

## Purpose

Understand the problem before proposing solutions.

---

## Discovery Agent Responsibilities

* Gather requirements
* Ask clarification questions
* Identify missing information
* Define scope
* Produce discovery report

---

## Example Questions

```text
Who will use the system?

Web, Mobile, or Both?

Single Company or Multi Company?

Expected Timeline?

Existing System?
```

---

## Outputs

```text
Discovery Report

Requirements

Constraints

Assumptions
```

---

# Stage 3: Research

## Purpose

Collect information required to make informed decisions.

---

## Research Agent Responsibilities

* Technical research
* Architecture research
* Best practices
* Risk identification
* Feasibility analysis

---

## Outputs

```text
Research Report

Architecture Options

Risks

Recommendations
```

---

# Stage 4: Planning

## Purpose

Transform research into an executable plan.

---

## Planning Agent Responsibilities

* Create project structure
* Create phases
* Create tasks
* Create dependencies
* Estimate complexity

---

## Outputs

```text
Project Plan

Sub Projects

Phases

Tasks

Dependencies
```

---

# Stage 5: Review

## Purpose

Evaluate planning quality before execution.

---

## Review Agent Responsibilities

* Quality review
* Architecture review
* Completeness review
* Risk review

---

## Outputs

```text
Review Findings

Recommendations

Open Risks
```

---

# Stage 6: Approval

## Purpose

Ensure governance and human oversight.

---

## Approval Responsibilities

The user reviews:

* Plans
* Risks
* Recommendations
* Impact analysis

---

## Approval Outcomes

```text
Approved

Rejected

Needs Revision
```

---

# Stage 7: Execution

## Purpose

Perform the actual work.

---

## Execution Activities

Examples:

```text
Implementation

Documentation

Testing

Research Tasks

Review Tasks
```

---

## Structure

```text
Project
    ↓
Sub Project
    ↓
Phase
    ↓
Task
    ↓
Subtask
```

---

# Stage 8: Phase Review

## Purpose

Validate completed work.

---

## Review Activities

* Deliverable review
* Risk assessment
* Recommendation generation
* Quality validation

---

## Outputs

```text
Review Report

Recommendations

Risks

Approval Request
```

---

# Stage 9: Phase Approval

## Purpose

Formally accept completed work.

---

## Approval Rules

Critical risks may block approval.

Example:

```text
Critical Security Risk
      ↓
Approval Blocked
```

---

## Outcomes

```text
Approved

Rejected

Override Requested
```

---

# Stage 10: Project Completion

## Purpose

Mark project execution as complete.

---

## Completion Requirements

All required:

```text
Phases Complete

Reviews Complete

Approvals Complete

Critical Risks Resolved
```

---

# Stage 11: Lessons Learned

## Purpose

Capture project experience.

---

## Examples

```text
What worked?

What failed?

What should change?

What should be reused?
```

---

## Outputs

```text
Lessons Learned

Project Retrospective
```

---

# Stage 12: Knowledge Creation

## Purpose

Convert lessons into reusable organizational knowledge.

---

## Knowledge Types

```text
Best Practice

Decision

Pattern

Guideline

Research

Reference
```

---

## Outputs

```text
Knowledge Records
```

---

# Stage 13: Blueprint Improvement

## Purpose

Improve future projects.

---

## Workflow

```text
Knowledge
      ↓
Blueprint Improvement Proposal
      ↓
Review
      ↓
Approval
      ↓
Blueprint Update
```

---

# Stage 14: Skill Improvement

## Purpose

Improve agent capabilities.

---

## Workflow

```text
Knowledge
      ↓
Skill Improvement Proposal
      ↓
Review
      ↓
Approval
      ↓
Skill Version Update
```

---

# Project States

Projects move through states.

```text
Draft

Discovery

Research

Planning

Review

Approval

Execution

Completed

Archived
```

---

# Phase States

```text
Not Started

In Progress

Under Review

Awaiting Approval

Approved

Blocked

Completed
```

---

# Task States

```text
Pending

In Progress

Under Review

Blocked

Completed

Cancelled
```

---

# Governance Rules

## Rule 1

AI recommends.

Humans decide.

---

## Rule 2

Nothing important happens automatically.

---

## Rule 3

Reviews occur before approvals.

---

## Rule 4

Critical risks may block approvals.

---

## Rule 5

Knowledge drives future improvement.

---

# Lifecycle Summary

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
Review
 ↓
Approval
 ↓
Lessons Learned
 ↓
Knowledge
 ↓
Blueprint Improvement
 ↓
Skill Improvement
```

This lifecycle is the foundation of every project managed by Agentix OS.
