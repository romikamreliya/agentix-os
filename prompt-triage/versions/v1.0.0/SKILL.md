---
name: prompt-triage
version: 1.0.0
description: >-
  Analyze and understand the user's prompt before acting: classify it into a
  category (task, research, code-change, chat, documentation, or other), write a
  concise one-line summary, and tag it with type + context so downstream handling
  is routed correctly. If the prompt is unclear, incomplete, or ambiguous, ask
  focused clarifying questions with suggested answer options plus an "Other"
  free-text choice before proceeding. Use at the start of handling a request, or
  when the user says "analyze my prompt", "classify this", "categorize this
  request", "what type of task is this", "triage this", "summarize what I'm
  asking", or when a request is vague and needs clarifying questions.
---

# Prompt Triage

Understand the request *before* doing the work. This skill reads the user's
prompt, decides **what kind** of request it is, writes a **one-line summary**,
attaches **context tags**, and — when the prompt is unclear — **asks clarifying
questions with suggested options and an Other choice** to fill the gaps.

The output is a small, structured classification block that downstream steps (or
`[[skill-router]]`) can act on with confidence.

## Reference files (read on demand)

- `references/categories.md` — the category taxonomy (definitions, signals, and
  disambiguation), plus the exact classification / tag output format.
- `references/clarifying-questions.md` — how to decide when a prompt needs
  clarification and how to write good questions with suggested options + an Other
  option (using the `AskUserQuestion` tool).

## When & why to use

- **Where to use:** at the front of handling any non-trivial request, in any
  session; especially useful before routing, planning, or large changes.
- **Why to use:** acting on a misread or under-specified prompt wastes work.
  Classifying + summarizing first aligns expectations, and asking targeted
  questions early prevents wrong deliverables.
- **Recommended use cases:** ambiguous one-liners, multi-intent requests, intake
  for a queue/router, or any time the correct handling depends on the request's
  type.
- **Examples:** "fix the login bug" → *category: code-change; summary: fix auth
  failure on login*; "should we use Postgres or Mongo?" → *category: chat
  (advisory)*; "update the README" → *category: documentation*.
- **Benefits:** fewer misunderstandings, consistent categorization, a paper trail
  of intent, and clean hand-off to the right skill or workflow.
- **Limitations:** it classifies and clarifies — it does not *do* the underlying
  work; pair it with the relevant skill afterward. Don't over-question trivial,
  already-clear prompts.
- **Applicable scenarios:** the user asks to analyze/classify/triage a prompt, a
  request is vague/incomplete/contradictory, or an intake step needs a type +
  summary before processing.

## Workflow

1. **Read the whole prompt** (plus visible context: open files, selection, recent
   turns). Note explicit asks, deliverables, and any named files/URLs/tools.
2. **Extract signals** — intent/action verbs, deliverable(s), domain, artifacts,
   constraints. (See `references/categories.md`.)
3. **Classify the category** — pick exactly one primary type: `task`,
   `research`, `code-change`, `chat`, `documentation`, or `other` (add a secondary
   type only if the request genuinely spans two). Use the signals table to decide
   and disambiguate.
4. **Summarize** the request in **one concise sentence** — what the user wants,
   in plain terms.
5. **Assess clarity.** If the goal, target, scope, or acceptance is missing,
   contradictory, or open to materially different readings, go to step 6.
   Otherwise skip to step 7.
6. **Ask clarifying questions** using `references/clarifying-questions.md`:
   pose 1–4 focused questions via the **`AskUserQuestion`** tool, each with 2–4
   **suggested options** (the tool automatically adds an **Other** free-text
   choice). Ask only what changes what you'd do; don't interrogate. Then fold the
   answers back into the summary and context.
7. **Emit the classification block** — the tag output from
   `references/categories.md`: `type`, `summary`, `context`, `confidence`, and a
   suggested next step / skill. Then continue processing (or hand off to
   `[[skill-router]]`).

## Core rules

- **Classify before acting** — don't start the work until the prompt has a type
  and a summary (and any blocking ambiguity is resolved).
- **One primary category.** Only add a secondary when the request truly spans two.
- **Clarify only when it matters.** If a sensible default exists, state the
  assumption and proceed instead of asking.
- **Every clarifying question needs suggested options and an Other choice** — use
  `AskUserQuestion`, which provides Other automatically; use multi-select when
  answers aren't mutually exclusive.
- **Be transparent and brief** — the tag block is short; don't bury the user in
  analysis.
