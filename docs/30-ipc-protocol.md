# IPC Protocol

## Overview

This document defines the communication protocol used by Agentix OS.

IPC (Inter-Process Communication) allows the following components to communicate:

```text id="1h6m8t"
React Webview
      ↕
VS Code Extension Host
      ↕
Runtime Engine
```

All communication must follow this specification.

---

# Purpose

The IPC Protocol provides:

```text id="z8p0kg"
Consistent Communication

Type Safety

Request Tracking

Error Handling

Future Extensibility
```

---

# Architecture

```text id="x1zv4h"
React Webview
      ↓
postMessage()
      ↓
VS Code Extension Host
      ↓
Command Bus
      ↓
Runtime Engine
      ↓
Services
      ↓
Database
```

---

# Communication Rules

## Rule 1

Webview never accesses Runtime directly.

---

## Rule 2

Runtime never accesses Webview directly.

---

## Rule 3

All communication passes through Extension Host.

---

## Rule 4

All messages must be typed.

---

# Message Flow

## Request

```text id="z4v8mg"
Webview
   ↓
Extension
   ↓
Runtime
```

---

## Response

```text id="x5m3pd"
Runtime
   ↓
Extension
   ↓
Webview
```

---

# Message Structure

Every message must contain:

```ts id="h7r2kw"
interface IMessage {
  id: string;
  type: string;
  timestamp: number;
  payload: unknown;
}
```

---

# Message ID

Requirements:

```text id="4u1t9j"
Unique

UUID v7 Recommended
```

Example:

```text id="y9m5dw"
018fd99a-1234-5678-9012
```

---

# Webview Message

```ts id="8f7kzs"
interface IWebviewMessage {
  id: string;

  type: string;

  timestamp: number;

  payload: unknown;
}
```

---

# Runtime Message

```ts id="7p3hxe"
interface IRuntimeMessage {
  id: string;

  command: string;

  payload: unknown;
}
```

---

# Response Message

```ts id="w9n4tm"
interface IResponseMessage<T> {
  id: string;

  success: boolean;

  data?: T;

  error?: string;
}
```

---

# Webview → Extension

Uses:

```ts id="p5j7sa"
vscode.postMessage()
```

Example:

```json id="d4f1jk"
{
  "id": "123",
  "type": "PROJECT_CREATE",
  "timestamp": 1710000000,
  "payload": {
    "name": "ERP System"
  }
}
```

---

# Extension → Webview

Uses:

```ts id="4q9wzm"
webview.postMessage()
```

Example:

```json id="n3x2pu"
{
  "id": "123",
  "success": true,
  "data": {
    "projectId": "abc"
  }
}
```

---

# Extension → Runtime

The Extension converts UI requests into commands.

Example:

```json id="5u7qgc"
{
  "command": "create-project",
  "payload": {
    "name": "ERP System"
  }
}
```

---

# Runtime → Extension

Returns:

```json id="4r8mhs"
{
  "success": true,
  "data": {}
}
```

---

# Request Lifecycle

```text id="v2x9la"
User Action
      ↓
Webview Message
      ↓
Extension Host
      ↓
Command Bus
      ↓
Handler
      ↓
Service
      ↓
Repository
      ↓
Database
      ↓
Response
```

---

# Supported Message Categories

## Project Messages

```text id="c8w3mf"
PROJECT_CREATE

PROJECT_UPDATE

PROJECT_DELETE

PROJECT_GET
```

---

## Task Messages

```text id="6j7xpk"
TASK_CREATE

TASK_UPDATE

TASK_COMPLETE

TASK_GET
```

---

## Review Messages

```text id="w4e2rl"
REVIEW_CREATE

REVIEW_GET
```

---

## Approval Messages

```text id="u8j9sn"
APPROVAL_REQUEST

APPROVAL_DECIDE
```

---

## Knowledge Messages

```text id="p7m2hy"
KNOWLEDGE_CREATE

KNOWLEDGE_SEARCH

KNOWLEDGE_GET
```

---

## Agent Messages

```text id="s5t8kc"
AGENT_EXECUTE

AGENT_STATUS

AGENT_DISCOVER
```

---

## Settings Messages

```text id="y4w7az"
SETTINGS_GET

SETTINGS_UPDATE
```

---

# Error Response

Standard format:

```json id="x6n5qe"
{
  "id": "123",
  "success": false,
  "error": "Project not found"
}
```

---

# Validation Errors

Example:

```json id="n2v7cf"
{
  "id": "123",
  "success": false,
  "error": "Validation failed"
}
```

---

# Timeout Handling

Default timeout:

```text id="q9z6tj"
30 seconds
```

---

# Timeout Response

```json id="z7u3wm"
{
  "success": false,
  "error": "Request timeout"
}
```

---

# Event Notifications

The Runtime may publish events to the UI.

Examples:

```text id="j3f8kp"
PROJECT_CREATED

TASK_COMPLETED

REVIEW_COMPLETED
```

---

# Event Message

```ts id="t8r5hn"
interface IEventMessage {
  eventType: string;

  payload: unknown;
}
```

---

# Security Rules

## Rule 1

Validate all incoming messages.

---

## Rule 2

Never trust Webview input.

---

## Rule 3

Sanitize payloads.

---

## Rule 4

Reject unknown message types.

---

# Logging

Every message should log:

```text id="m7v4xy"
Message ID

Message Type

Execution Time

Result
```

---

# Versioning

Protocol version:

```text id="r4p8wk"
1.0.0
```

---

# Future Compatibility

Every message may include:

```json id="k5x7qb"
{
  "version": "1.0.0"
}
```

for backward compatibility.

---

# Type Definitions Location

Create:

```text id="v3m9qs"
packages/shared/src/ipc/
```

Files:

```text id="h8n2wj"
message.types.ts

request.types.ts

response.types.ts

event.types.ts
```

---

# Testing Requirements

Must test:

```text id="d2w6fa"
Valid Requests

Invalid Requests

Timeouts

Error Responses

Event Messages
```

---

# Governance Rules

## Rule 1

All communication uses IPC.

---

## Rule 2

No direct Runtime access.

---

## Rule 3

No direct Database access from UI.

---

## Rule 4

All messages must be typed.

---

## Rule 5

All requests must return responses.

---

# IPC Protocol Summary

The IPC Protocol defines the communication contract between:

```text id="p1w5kr"
React Webview

VS Code Extension Host

Runtime Engine
```

and ensures:

```text id="u7f3lx"
Consistency

Traceability

Security

Type Safety

Extensibility
```

through a standardized request/response messaging architecture.
