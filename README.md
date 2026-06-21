# Home Screen - Hero Prompt Section

## Purpose

The first screen should focus on a single action:

**"Ask AI what you want to build."**

No recent chats, no project cards, no tips, and no starter templates.

The entire experience should feel clean, focused, and distraction-free.

---

## Layout

### Header

**Left**
- 👋 Welcome to Agentix OS

**Subtitle**
- Your AI Development Assistant

**Tags**
- Plan
- Code
- Build
- Ship

**Right**
- Model Selector Dropdown
  - Claude
  - GPT
  - Gemini
  - DeepSeek

---

## Main Prompt Area

### Large Prompt Box

Placeholder:

```text
Ask anything...
(e.g. Create a full ERP system, Fix a bug, Add authentication)
```

### Supported Actions

Icons below input:

- 📎 Attach Files
- </> Include Code
- 🖼 Add Image

### Send Button

- Purple action button
- Bottom-right position

---

## User Flow

### Step 1

User enters prompt:

```text
Create Full ERP System
```

### Step 2

AI analyzes request.

### Step 3

AI generates plan.

### Step 4

User reviews plan.

### Step 5

User approves plan.

### Step 6

AI starts implementation.

---

## Empty State

Show only:

```text
Start building with AI

Describe your idea, bug, feature, or project.
Agentix OS will analyze it and create a plan before implementation.
```

---

## Design Principles

- Minimal UI
- Focus on prompt input
- No distractions
- AI-first experience
- Similar to ChatGPT, Claude, and Gemini home screens
- Clean dark theme
- Purple accent color
- Large whitespace
- Centered content

---

## Components

1. Welcome Header
2. Model Selector
3. Prompt Input
4. Attach Button
5. Code Context Button
6. Image Upload Button
7. Send Button

No other sections on the first screen.