# Database Schema

## Overview

This document defines the implementation-level database schema for Agentix OS.

The schema is designed for:

* SQLite
* Drizzle ORM
* Local-first architecture
* Auditability
* Versioning
* Governance

All tables use UUID-based identifiers.

---

# Database Standards

## Primary Key

All tables:

```sql
id TEXT PRIMARY KEY
```

UUID v7 recommended.

---

## Audit Fields

All primary tables should include:

```sql
created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
created_by TEXT
updated_by TEXT
```

---

## Status Fields

Recommended:

```sql
status TEXT NOT NULL
is_active INTEGER NOT NULL DEFAULT 1
```

---

# Projects

## projects

```sql
id TEXT PRIMARY KEY

name TEXT NOT NULL

description TEXT

status TEXT NOT NULL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL

created_by TEXT
updated_by TEXT

is_active INTEGER DEFAULT 1
```

Indexes:

```sql
CREATE INDEX idx_projects_status
ON projects(status);
```

---

# Sub Projects

## sub_projects

```sql
id TEXT PRIMARY KEY

project_id TEXT NOT NULL

name TEXT NOT NULL

description TEXT

status TEXT NOT NULL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL

FOREIGN KEY(project_id)
REFERENCES projects(id)
```

Indexes:

```sql
CREATE INDEX idx_sub_projects_project
ON sub_projects(project_id);
```

---

# Phases

## phases

```sql
id TEXT PRIMARY KEY

project_id TEXT NOT NULL

sub_project_id TEXT

name TEXT NOT NULL

description TEXT

sequence INTEGER NOT NULL

status TEXT NOT NULL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL

FOREIGN KEY(project_id)
REFERENCES projects(id)

FOREIGN KEY(sub_project_id)
REFERENCES sub_projects(id)
```

---

# Tasks

## tasks

```sql
id TEXT PRIMARY KEY

phase_id TEXT NOT NULL

title TEXT NOT NULL

description TEXT

priority TEXT NOT NULL

status TEXT NOT NULL

estimated_hours REAL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL

FOREIGN KEY(phase_id)
REFERENCES phases(id)
```

Indexes:

```sql
CREATE INDEX idx_tasks_phase
ON tasks(phase_id);

CREATE INDEX idx_tasks_status
ON tasks(status);
```

---

# Sub Tasks

## sub_tasks

```sql
id TEXT PRIMARY KEY

task_id TEXT NOT NULL

title TEXT NOT NULL

description TEXT

status TEXT NOT NULL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL

FOREIGN KEY(task_id)
REFERENCES tasks(id)
```

---

# Reviews

## reviews

```sql
id TEXT PRIMARY KEY

entity_type TEXT NOT NULL

entity_id TEXT NOT NULL

category TEXT NOT NULL

severity TEXT NOT NULL

status TEXT NOT NULL

summary TEXT

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

Indexes:

```sql
CREATE INDEX idx_reviews_entity
ON reviews(entity_type, entity_id);
```

---

# Approvals

## approvals

```sql
id TEXT PRIMARY KEY

entity_type TEXT NOT NULL

entity_id TEXT NOT NULL

decision TEXT

reason TEXT

status TEXT NOT NULL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

Indexes:

```sql
CREATE INDEX idx_approvals_entity
ON approvals(entity_type, entity_id);
```

---

# Risks

## risks

```sql
id TEXT PRIMARY KEY

source_type TEXT NOT NULL

source_id TEXT NOT NULL

title TEXT NOT NULL

description TEXT

severity TEXT NOT NULL

probability TEXT NOT NULL

impact TEXT NOT NULL

status TEXT NOT NULL

mitigation_plan TEXT

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

Indexes:

```sql
CREATE INDEX idx_risks_source
ON risks(source_type, source_id);
```

---

# Recommendations

## recommendations

```sql
id TEXT PRIMARY KEY

source_type TEXT NOT NULL

source_id TEXT NOT NULL

title TEXT NOT NULL

description TEXT

priority TEXT NOT NULL

confidence REAL

status TEXT NOT NULL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

# Knowledge

## knowledge

```sql
id TEXT PRIMARY KEY

project_id TEXT

type TEXT NOT NULL

category TEXT NOT NULL

title TEXT NOT NULL

summary TEXT NOT NULL

content TEXT NOT NULL

status TEXT NOT NULL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL

FOREIGN KEY(project_id)
REFERENCES projects(id)
```

Indexes:

```sql
CREATE INDEX idx_knowledge_category
ON knowledge(category);

CREATE INDEX idx_knowledge_project
ON knowledge(project_id);
```

---

# Agents

## agent_templates

```sql
id TEXT PRIMARY KEY

name TEXT NOT NULL

description TEXT

role TEXT NOT NULL

configuration TEXT

status TEXT NOT NULL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## agent_instances

```sql
id TEXT PRIMARY KEY

project_id TEXT

template_id TEXT NOT NULL

name TEXT NOT NULL

configuration TEXT

status TEXT NOT NULL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL

FOREIGN KEY(project_id)
REFERENCES projects(id)

FOREIGN KEY(template_id)
REFERENCES agent_templates(id)
```

---

# Skills

## skills

```sql
id TEXT PRIMARY KEY

name TEXT NOT NULL

description TEXT

category TEXT NOT NULL

current_version TEXT

status TEXT NOT NULL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## skill_versions

```sql
id TEXT PRIMARY KEY

skill_id TEXT NOT NULL

version TEXT NOT NULL

content TEXT NOT NULL

created_at INTEGER NOT NULL

FOREIGN KEY(skill_id)
REFERENCES skills(id)
```

---

# Agent Skills

## agent_skills

```sql
agent_instance_id TEXT NOT NULL

skill_id TEXT NOT NULL

skill_version TEXT NOT NULL

PRIMARY KEY (
  agent_instance_id,
  skill_id
)
```

---

# Blueprints

## blueprints

```sql
id TEXT PRIMARY KEY

name TEXT NOT NULL

category TEXT NOT NULL

current_version TEXT

status TEXT NOT NULL

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## blueprint_versions

```sql
id TEXT PRIMARY KEY

blueprint_id TEXT NOT NULL

version TEXT NOT NULL

content TEXT NOT NULL

created_at INTEGER NOT NULL

FOREIGN KEY(blueprint_id)
REFERENCES blueprints(id)
```

---

# Workflow Executions

## workflow_executions

```sql
id TEXT PRIMARY KEY

workflow_type TEXT NOT NULL

entity_type TEXT

entity_id TEXT

status TEXT NOT NULL

started_at INTEGER NOT NULL

completed_at INTEGER
```

---

# Events

## events

```sql
id TEXT PRIMARY KEY

event_type TEXT NOT NULL

payload TEXT NOT NULL

created_at INTEGER NOT NULL
```

Indexes:

```sql
CREATE INDEX idx_events_type
ON events(event_type);
```

---

# AI Conversations

## conversations

```sql
id TEXT PRIMARY KEY

project_id TEXT

title TEXT

created_at INTEGER NOT NULL
updated_at INTEGER NOT NULL
```

---

## conversation_messages

```sql
id TEXT PRIMARY KEY

conversation_id TEXT NOT NULL

role TEXT NOT NULL

content TEXT NOT NULL

token_count INTEGER

created_at INTEGER NOT NULL

FOREIGN KEY(conversation_id)
REFERENCES conversations(id)
```

---

# Settings

## settings

```sql
key TEXT PRIMARY KEY

value TEXT NOT NULL

updated_at INTEGER NOT NULL
```

---

# Future Tables (Not MVP)

```text
analytics
notifications
attachments
vector_embeddings
plugin_registry
marketplace_packages
team_members
permissions
```

---

# Schema Summary

Core MVP tables:

```text
projects
sub_projects
phases
tasks
sub_tasks

reviews
approvals
risks
recommendations

knowledge

agent_templates
agent_instances

skills
skill_versions

blueprints
blueprint_versions

workflow_executions
events

conversations
conversation_messages

settings
```

This schema provides the complete foundation required for the Agentix OS MVP while remaining compatible with SQLite and Drizzle ORM.
