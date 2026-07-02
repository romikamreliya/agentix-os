---
name: skill-router
version: 1.0.0
description: >-
  Analyze the user's request and automatically select, sequence, and apply the
  most relevant available skill(s) for the task — so skills never have to be
  chosen manually one by one. Use when the user wants Claude to figure out which
  skill(s) to use, when a task spans multiple skills, or when they say
  "auto-select a skill", "use the right skill(s)", "pick the best skill", "which
  skill should handle this", "route this task", "decide what skills to use", or
  give a broad task without naming any skill. Inventories the installed skills,
  matches intent against their descriptions, resolves overlaps, and invokes them
  in the correct order.
---

# Skill Router (Auto-Select)

Turn a plain request into the right sequence of skills — automatically. Instead
of the user hunting for and naming skills one at a time, this skill has Claude
**inventory** what's available, **understand** the request, **match** it to the
best-fitting skill(s), and **invoke** them in the right order.

> This is an **orchestrator**. It does not replace individual skills — it decides
> which ones to run and chains them. It must **never invoke itself**.

## Reference files (read on demand)

- `references/matching-guide.md` — how to parse a request, read a skill's
  description (what / when / triggers), score matches, apply the specificity
  rule, and disambiguate overlapping skills. Read this to choose correctly.
- `references/orchestration.md` — how to sequence multiple skills, pass context
  between them, handle unavailable/failed skills, avoid loops, and report what
  ran. Read this when a task needs more than one skill.

## When & why to use

- **Where to use:** any session with skills available (Claude Code / Agent SDK),
  on any task — especially broad, multi-part, or ambiguous requests.
- **Why to use:** manually recalling and picking the correct skill for every
  request is slow and error-prone; users often don't know a skill exists. This
  routes intent → skill(s) automatically and chains multi-step work.
- **Recommended use cases:** "build and review a feature" (design → review),
  "research X and write it up" (search → write), "scrape this site into JSON"
  (map/scrape → extract), or any request where the right skill isn't obvious.
- **Examples:** user says *"make a landing page and check it for a11y"* → routes
  to `frontend-design` then `web-design-guidelines`; *"find recent papers on Y
  and summarize"* → `firecrawl-research-papers`.
- **Benefits:** no manual skill-picking, correct ordering, fewer missed skills,
  consistent use of the best tool, graceful fallback when nothing fits.
- **Limitations:** it can only route to **installed** skills it can see; it does
  not install new ones (suggest `find-skills` for that) and does not execute
  skills' work itself. Overly broad triggering is avoided by design (see rules).
- **Applicable scenarios:** the user asks Claude to decide/route, a task clearly
  needs several skills, or a request is broad enough that the target skill is
  unclear. Skip it when the user already named a skill or the task is trivial.

## Workflow

1. **Inventory available skills.** Read the current list of skills exposed to the
   session (the `available-skills` / system-reminder listing and the Skill tool).
   Use each skill's `name` + `description` (what it does, when to use it, trigger
   phrases) as the routing table. Never rely on skills from memory that aren't in
   the current list — verify presence first.
2. **Understand the request.** Extract the **intent** (action verbs), the
   **deliverable(s)**, the **domain**, and any **artifacts** (file types, URLs,
   frameworks) and **constraints**. Note if the user already named a skill.
3. **Match & rank.** Using `references/matching-guide.md`, score each candidate
   skill against the request (trigger-phrase hit > deliverable/domain match >
   vague theme). Apply the **specificity rule**: prefer the most specific skill,
   and a directory-scoped variant over its generic form.
4. **Decide the plan.** Choose one of:
   - **Single skill** — one clear winner above the confidence threshold.
   - **Chain** — multiple deliverables → several skills; determine order via
     `references/orchestration.md` (gather → produce → review).
   - **No skill** — nothing clears the threshold; do the task directly (and, if
     the user wanted a capability that may exist, suggest `find-skills`).
5. **Confirm only if needed.** If two skills tie, or the action is destructive or
   outward-facing, ask one concise question. Otherwise proceed — the whole point
   is to avoid manual selection.
6. **Invoke, in order.** Call the selected skill(s) via the **Skill** tool,
   following each skill's own instructions. For a chain, run sequentially and feed
   each result into the next (see `references/orchestration.md`).
7. **Synthesize & report.** Deliver the combined result and briefly state **which
   skills were selected, in what order, and why** — so the routing is transparent
   and correctable.

## Core rules

- **Never invoke `skill-router` from within `skill-router`** — no recursion or
  loops.
- **Only route to skills present in the current session list.** If a needed skill
  isn't installed, say so and suggest `find-skills`; don't invent skill names.
- **Prefer the most specific match.** A purpose-built skill beats a general one;
  a directory-scoped variant beats the unscoped one when files fall under it.
- **Don't force a skill.** If nothing genuinely fits, complete the task directly.
- **Respect each selected skill's instructions** and any auth/permission needs
  (e.g., a skill whose MCP server needs authorization can't be run — report it).
- **Be transparent.** Always name the skills you routed to and the reason.
