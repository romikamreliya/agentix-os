# Workflow Definitions

## Overview

This document defines the official workflows used by Agentix OS.

A workflow is a structured sequence of actions executed by the Runtime Engine and coordinated by the Parent Agent.

Each workflow defines:

* Purpose
* Inputs
* Outputs
* States
* Events
* Success Criteria

Workflows provide consistency, traceability, and governance.

---

# Workflow Standards

## Workflow Structure

Every workflow follows:

```text id="3h4t9a"
Start
  ↓
Validation
  ↓
Execution
  ↓
Review
  ↓
Completion
```

---

## Workflow State Model

All workflows support:

```text id="7ktx91"
Created

Running

Paused

Blocked

Completed

Failed

Cancelled
```

---

## Workflow Contract

```ts id="4skg6b"
interface IWorkflow {
  id: string;

  type: string;

  execute(): Promise<void>;
}
```

---

# Discovery Workflow

## Purpose

Collect requirements before planning.

---

## Trigger

Examples:

```text id="2m0qzb"
New Idea

New Project

Incomplete Requirements
```

---

## Input

```text id="3w3k1d"
User Prompt

Project Goal
```

---

## Steps

```text id="ngy0z5"
Prompt Received
      ↓
Discovery Agent Assigned
      ↓
Questions Generated
      ↓
User Answers
      ↓
Requirements Extracted
      ↓
Discovery Report Created
```

---

## Output

```text id="s0mbgv"
Discovery Report

Requirements

Constraints

Assumptions
```

---

## Events

```text id="owg0cq"
DiscoveryStarted

DiscoveryCompleted
```

---

## Success Criteria

```text id="4i8vzw"
Complete Discovery Report
```

---

# Research Workflow

## Purpose

Gather information needed for planning.

---

## Input

```text id="7w1ezy"
Discovery Report
```

---

## Steps

```text id="h0m3zk"
Research Scope Created
      ↓
Research Agent Assigned
      ↓
Technology Analysis
      ↓
Risk Identification
      ↓
Research Report Created
```

---

## Output

```text id="a4nt1n"
Research Report

Technology Options

Risks

Recommendations
```

---

## Events

```text id="2z79a4"
ResearchStarted

ResearchCompleted
```

---

## Success Criteria

```text id="5syy1w"
Approved Research Report
```

---

# Planning Workflow

## Purpose

Transform research into execution plans.

---

## Input

```text id="kv3k3v"
Discovery Report

Research Report
```

---

## Steps

```text id="v0upzi"
Planning Agent Assigned
      ↓
Project Structure Created
      ↓
Phases Created
      ↓
Tasks Created
      ↓
Plan Generated
```

---

## Output

```text id="lhqdbw"
Project Plan

Phase Plan

Task Plan
```

---

## Events

```text id="ijv0mq"
PlanningStarted

PlanningCompleted
```

---

## Success Criteria

```text id="e0cn2z"
Executable Plan Generated
```

---

# Project Creation Workflow

## Purpose

Create project entities.

---

## Input

```text id="yaj4vt"
Approved Plan
```

---

## Steps

```text id="22m92x"
Create Project
      ↓
Create Phases
      ↓
Create Tasks
      ↓
Publish Events
```

---

## Output

```text id="3q9pt0"
Project Structure
```

---

## Events

```text id="9mmb11"
ProjectCreated

PhaseCreated

TaskCreated
```

---

# Task Execution Workflow

## Purpose

Manage task lifecycle.

---

## Input

```text id="ifk7hc"
Task
```

---

## Steps

```text id="kg0dzg"
Task Assigned
      ↓
Task Started
      ↓
Work Performed
      ↓
Task Completed
```

---

## Output

```text id="h6v8c2"
Completed Task
```

---

## Events

```text id="z6uhhj"
TaskStarted

TaskCompleted
```

---

# Review Workflow

## Purpose

Evaluate quality.

---

## Input

```text id="bghl3w"
Entity

Review Criteria
```

---

## Steps

```text id="r9y3j5"
Review Requested
      ↓
Review Agent Assigned
      ↓
Analysis Performed
      ↓
Findings Generated
      ↓
Review Completed
```

---

## Output

```text id="g8w5gm"
Review Findings

Risks

Recommendations
```

---

## Events

```text id="5wwq5s"
ReviewStarted

ReviewCompleted
```

---

## Success Criteria

```text id="w7k7jp"
Review Findings Available
```

---

# Approval Workflow

## Purpose

Obtain human decision.

---

## Input

```text id="jxxqjr"
Approval Request
```

---

## Steps

```text id="v71zgm"
Approval Requested
      ↓
Review Findings Loaded
      ↓
Decision Presented
      ↓
User Decision
```

---

## Decisions

```text id="ljlhv8"
Approved

Rejected

Requires Changes
```

---

## Events

```text id="v6r1sj"
ApprovalRequested

ApprovalApproved

ApprovalRejected
```

---

## Success Criteria

```text id="6k4c0n"
Decision Recorded
```

---

# Risk Workflow

## Purpose

Track and manage risks.

---

## Input

```text id="o0v11j"
Risk
```

---

## Steps

```text id="j6g4fj"
Risk Created
      ↓
Risk Analyzed
      ↓
Mitigation Planned
      ↓
Monitoring
      ↓
Resolved
```

---

## Output

```text id="08r83g"
Mitigation Plan
```

---

## Events

```text id="3o8vne"
RiskCreated

RiskResolved
```

---

# Recommendation Workflow

## Purpose

Manage recommendations.

---

## Input

```text id="bcmw2q"
Recommendation
```

---

## Steps

```text id="vfwdmu"
Recommendation Created
      ↓
Review
      ↓
User Decision
      ↓
Action
```

---

## Actions

```text id="rq6ntj"
Approve

Reject

Convert To Task

Archive
```

---

## Events

```text id="8b4okf"
RecommendationCreated

RecommendationApproved

RecommendationRejected
```

---

# Knowledge Workflow

## Purpose

Capture reusable learning.

---

## Input

```text id="1o3n7g"
Project Data

Reviews

Recommendations
```

---

## Steps

```text id="uwv6br"
Knowledge Agent Assigned
      ↓
Knowledge Extracted
      ↓
Categorized
      ↓
Stored
```

---

## Output

```text id="q7m3du"
Knowledge Record
```

---

## Events

```text id="wjr1y7"
KnowledgeCreated

KnowledgePublished
```

---

## Success Criteria

```text id="0k5rta"
Reusable Knowledge Stored
```

---

# Blueprint Workflow

## Purpose

Improve reusable blueprints.

---

## Input

```text id="8j4i7v"
Knowledge

Recommendations
```

---

## Steps

```text id="8m6d7g"
Blueprint Analysis
      ↓
Improvement Proposal
      ↓
Review
      ↓
Approval
      ↓
New Version
```

---

## Output

```text id="4o2wla"
Blueprint Proposal

Blueprint Version
```

---

## Events

```text id="q6z8sx"
BlueprintCreated

BlueprintVersionCreated
```

---

# Skill Workflow

## Purpose

Improve reusable skills.

---

## Input

```text id="b8q7yo"
Knowledge

Reviews
```

---

## Steps

```text id="4z0n2r"
Skill Analysis
      ↓
Improvement Proposal
      ↓
Review
      ↓
Approval
      ↓
New Version
```

---

## Output

```text id="i8v6xg"
Skill Proposal

Skill Version
```

---

## Events

```text id="h4v0qj"
SkillCreated

SkillUpdated
```

---

# Prompt Processing Workflow

## Purpose

Handle incoming prompts.

---

## Steps

```text id="8tb1fz"
Prompt Received
      ↓
Prompt Classified
      ↓
Workflow Selected
      ↓
Agent Assigned
      ↓
Workflow Started
```

---

## Events

```text id="2xt1ki"
PromptReceived

PromptClassified

PromptRouted
```

---

# Workflow Dependencies

```text id="4ytj2q"
Discovery
    ↓
Research
    ↓
Planning
    ↓
Project Creation
    ↓
Execution
    ↓
Review
    ↓
Approval
    ↓
Knowledge
    ↓
Blueprint
```

---

# Parent Agent Responsibilities

For every workflow:

```text id="5v1v9g"
Select Workflow

Assign Agents

Manage Context

Track Progress

Publish Events
```

---

# Workflow Governance

## Rule 1

Discovery before planning.

---

## Rule 2

Review before approval.

---

## Rule 3

Knowledge after completion.

---

## Rule 4

Blueprint changes require approval.

---

## Rule 5

Agents cannot bypass workflows.

---

# Workflow Summary

The Workflow System provides the operational backbone of Agentix OS.

It transforms:

```text id="u6vx6g"
Ideas

Tasks

Projects

Knowledge

Recommendations
```

into structured, governed, and traceable outcomes through standardized workflows coordinated by the Parent Agent and Runtime Engine.

The complete workflow chain is:

```text id="h6iqo2"
Prompt
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
Continuous Improvement
```
