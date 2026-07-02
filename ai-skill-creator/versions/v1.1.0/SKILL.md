---
name: ai-skill-creator
version: 1.1.0
description: >-
  Create a new Claude Agent Skill from provided material — raw text, website
  URLs, PDFs, DOCX/documents — or update and version an existing generated
  skill. Ingests and analyzes all inputs, then authors a well-formed SKILL.md
  with references and full version management (snapshots + changelog). Use when
  the user says "create a skill", "generate a skill from", "make a skill that",
  "turn this into a skill", "build a skill for", "new version of this skill",
  "update the skill", "improve the skill", or "bump the skill version".
---

# AI-Skill-Creator

Generate and maintain Claude Agent Skills from arbitrary source material, with
filesystem-based version management. This meta-skill has **two workflows**:
**Create** a brand-new skill, and **Update** an existing generated skill.

Skills you generate live under `skills/<name>/` and follow this shape:

```
skills/<name>/
  SKILL.md            # current version; frontmatter carries `version: X.Y.Z`
  CHANGELOG.md        # newest entry first
  references/...       # optional supporting knowledge (progressive disclosure)
  versions/
    v1.0.0/           # full snapshot of SKILL.md + references (NO nested versions/)
    v2.0.0/
```

## Reference files (read on demand)

- `references/skill-authoring.md` — how to write frontmatter, descriptions, and
  body; progressive-disclosure rules; the **required usage-documentation** section
  (where/why/use cases/examples/benefits/limitations/scenarios); the pre-ship
  validation checklist.
- `references/ingestion.md` — routing table mapping each input type to the tool
  or skill that reads it (firecrawl-scrape / firecrawl-search / firecrawl-parse /
  Read / WebFetch).
- `references/versioning.md` — semver rules for skills, the exact snapshot
  procedure, and the CHANGELOG format.
- `references/templates.md` — copy-paste SKILL.md and CHANGELOG.md skeletons.

---

## Workflow A — Create a new skill

### 1. Intake
Collect every input the user provided and classify it: inline text, website
URLs, and local file paths (PDF, DOCX, ODT, RTF, XLSX, HTML, .md, .txt, …).
If the intent of the target skill is unclear, ask the user one or two focused
questions (what should it do, when should it trigger) before proceeding.

### 2. Ingest & analyze
Read `references/ingestion.md` and route each input to the right reader:
- **Website URL** → invoke the `firecrawl-scrape` skill (use `firecrawl-search`
  first if you must discover pages; `WebFetch` is a fallback).
- **Local PDF / DOCX / other documents** → invoke the `firecrawl-parse` skill.
- **Local plain text / Markdown** → `Read`.

Gather **all** material first, then synthesize — do not design the skill until
every input has been ingested.

### 3. Synthesize
From the combined material, extract:
- **Purpose** — what the target skill does, in one or two sentences.
- **Triggers** — the situations and phrases that should invoke it.
- **Workflow** — the concrete steps the skill should have Claude perform.
- **Domain knowledge** — facts, rules, templates, or examples worth capturing.

### 4. Design
Following `references/skill-authoring.md`:
- Choose a `name`: kebab-case, matching the directory name.
- Write a trigger-rich third-person `description` (what + when + trigger words).
- Decide the body-vs-`references/` split via progressive disclosure — keep
  SKILL.md scannable; push long detail or large content into `references/`.
- Plan the **required usage documentation** (see `references/skill-authoring.md`):
  every generated skill must explain **where** it should be used, **why** to use
  it, **recommended use cases**, **practical examples**, **benefits**,
  **limitations**, and **applicable scenarios**. This is mandatory — a skill that
  doesn't say when and where to use it is much less useful and rarely gets
  adopted. Put a concise "When & why to use" section in the SKILL.md body; if it
  grows long, extract a `references/use-cases.md`.

### 5. Generate
Create the files (use `references/templates.md` as the starting point):
- `skills/<name>/SKILL.md` with `version: 1.0.0` in frontmatter, including the
  required "When & why to use" section (where/why/use cases/examples/benefits/
  limitations/scenarios).
- Any `references/*.md` the design calls for.
- `CHANGELOG.md` with an initial `1.0.0` entry dated today (`YYYY-MM-DD`).
- Snapshot the new `SKILL.md` + `references/` into `versions/v1.0.0/`
  (**exclude** the `versions/` folder itself from the snapshot).

### 6. Validate
Run the pre-ship checklist in `references/skill-authoring.md`: frontmatter
parses, `name` equals the directory name, description states what + when +
triggers, the **usage documentation is present** (where/why/use cases/examples/
benefits/limitations/scenarios), and the `versions/v1.0.0/` snapshot matches the
live files. Report the result and the path to the generated skill.

---

## Workflow B — Update / improve an existing skill

### 1. Locate
Find the target skill directory and `Read` its `SKILL.md` frontmatter to get the
current `version`.

### 2. Ingest new material
Route any new inputs or user feedback through the same rules in
`references/ingestion.md`.

### 3. Decide the bump
Per `references/versioning.md`: breaking behavior/interface change → **major**;
new capability added compatibly → **minor**; fix, clarification, or wording →
**patch**.

### 4. Snapshot first (before editing)
Copy the **current** `SKILL.md` + `references/` into `versions/v<current>/`
if that snapshot does not already exist. **Never** copy the `versions/` folder
into itself. Leave existing snapshots untouched.

### 5. Apply, bump, log
- Edit the live `SKILL.md` (and references) with the improvements.
- Ensure the skill has the **required usage documentation** (where/why/use cases/
  examples/benefits/limitations/scenarios). If an older skill lacks it, add the
  "When & why to use" section as part of this update (counts as at least a minor
  bump).
- Bump the `version` field in frontmatter to the new number.
- Prepend a `CHANGELOG.md` entry: new version, today's date (`YYYY-MM-DD`), bump
  type, and a summary of what changed and which source input drove it.
- Optionally snapshot the new version into `versions/v<new>/` as well.

Report the old → new version, the changelog entry, and confirm the prior
snapshot is intact.

---

## Rollback

To roll back, copy a chosen `versions/vX.Y.Z/` snapshot back over the live
`SKILL.md` + `references/`, then add a CHANGELOG entry recording the rollback
(this is itself a new version bump). Never delete existing snapshots.

## Conventions
- Other skills (firecrawl-*) are invoked through the **Skill** tool — delegate
  ingestion to them rather than writing scraping/parsing code.
- All changelog dates are absolute `YYYY-MM-DD`.
- Versioning is filesystem-based; git is not required.
