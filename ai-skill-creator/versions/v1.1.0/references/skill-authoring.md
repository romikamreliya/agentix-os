# Skill Authoring Guide

How to write a high-quality Claude Agent Skill. Follow this when designing the
`SKILL.md` that ai-skill-creator generates.

## Anatomy of a skill

```
skills/<name>/
  SKILL.md          # required: YAML frontmatter + Markdown body
  references/*.md   # optional: detail loaded only when needed
  scripts/*         # optional: helper scripts the skill runs
  assets/*          # optional: templates, images, data files
```

## Frontmatter

Required keys:

- `name` — **kebab-case**, and it **must equal the directory name**
  (`skills/pdf-summarizer/` → `name: pdf-summarizer`). Letters, digits, hyphens
  only. Keep it short and descriptive.
- `description` — the single most important field. It is the *only* text always
  loaded into context, so it alone decides whether the skill triggers. Write it
  in the **third person** and make it state:
  1. **What** the skill does.
  2. **When** to use it (the situations).
  3. **Trigger words/phrases** the user is likely to say.
  Keep it under ~1024 characters. Avoid vague descriptions like "helps with
  documents" — be specific and list concrete triggers.

Optional keys this project uses:

- `version` — semantic version `X.Y.Z` (see `versioning.md`).
- `allowed-tools` — restrict which tools the skill may use, if desired.

### Description examples

Weak: `description: Works with PDFs.`

Strong:
```
description: >-
  Extract and summarize the key points from a local PDF report. Use when the
  user provides a .pdf file and asks to "summarize this PDF", "pull the key
  findings", or "what does this document say". Produces a structured summary
  with sections and action items.
```

## Body

The body is loaded when the skill is invoked. Keep it **scannable**:

- Open with a one-line statement of what the skill does.
- Use numbered steps for the workflow Claude should follow.
- Prefer imperative instructions ("Read the file", "Ask the user…").
- Link to `references/*.md` for anything long — don't inline large tables,
  exhaustive rules, or big examples.

## Usage documentation (required in every skill)

A skill that doesn't say **when and where to use it** is far less useful and
rarely gets adopted — people forget it exists or misapply it. So every generated
skill **must** document its own usage. Include a **"When & why to use"** section
in the SKILL.md body (extract to `references/use-cases.md` if it gets long),
covering:

- **Where to use it** — the surfaces, contexts, project types, or files where it
  applies.
- **Why to use it** — the problem it solves and the value over doing it manually.
- **Recommended use cases** — concrete situations where it's the right tool.
- **Practical examples** — short, realistic invocations or before/after snippets.
- **Benefits** — what the user gains (speed, consistency, correctness, quality).
- **Limitations** — where it falls short, and what it deliberately does *not* do.
- **Applicable scenarios** — trigger conditions / signals that this skill fits;
  and, where useful, when to prefer a different skill instead.

This is distinct from the `description` frontmatter: the description is the
trigger text (short, third person); this section is the fuller adoption guide the
reader sees once the skill is opened. Keep it concrete — avoid generic filler.

## Progressive disclosure (the core principle)

Context is loaded in three tiers — put each piece of information at the tier
where it is cheapest but still available:

1. **Always loaded:** `description`. Keep it tight and trigger-focused.
2. **Loaded on invocation:** the SKILL.md body. Keep it to the workflow and the
   pointers to references. Aim for a short, high-signal file.
3. **Loaded on demand:** `references/*.md`, scripts, assets. Move detail, long
   checklists, large templates, and edge-case handling here so they cost nothing
   until actually needed.

If the body is getting long, that's the signal to extract a reference file.

## When to add references vs. keep inline

- Inline in body: the short, ordered steps of the workflow.
- Extract to `references/`: routing tables, format specifications, semver rules,
  copy-paste templates, domain knowledge, and anything a reader would skim past.

## Pre-ship validation checklist

Before declaring a generated skill done, confirm:

- [ ] `SKILL.md` frontmatter is valid YAML and parses.
- [ ] `name` is kebab-case **and** equals the directory name.
- [ ] `description` states what + when + trigger words, third person, < ~1024 chars.
- [ ] Usage documentation is present — a "When & why to use" section covering
      where, why, recommended use cases, practical examples, benefits,
      limitations, and applicable scenarios (in body or `references/use-cases.md`).
- [ ] `version` is present and is a valid `X.Y.Z`.
- [ ] Body is scannable, with clear numbered steps.
- [ ] Long/large content lives in `references/`, not the body.
- [ ] Any referenced file path (`references/…`, `scripts/…`) actually exists.
- [ ] `CHANGELOG.md` exists with an entry matching the current `version`.
- [ ] `versions/v<current>/` snapshot exists and matches the live files.
