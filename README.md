# AI-Skill-Creator

A **meta-skill** for Claude that generates and maintains other Claude Agent
Skills. Give it source material — raw text, website URLs, PDFs, DOCX and other
documents — and it analyzes everything, authors a well-formed skill, and manages
that skill across versions over time.

## What it does

- **Ingests mixed inputs** — text, URLs, PDFs, DOCX/ODT/RTF/XLSX/HTML, and more.
  It delegates reading to already-installed skills: `firecrawl-scrape` /
  `firecrawl-search` for web pages, `firecrawl-parse` for local documents, and
  built-in `Read` / `WebFetch` as fallbacks.
- **Creates a new skill** — a scannable `SKILL.md` with trigger-rich frontmatter
  plus optional `references/` files, following progressive-disclosure best
  practices.
- **Manages versions** — full snapshot directories (`versions/vX.Y.Z/`) plus a
  `CHANGELOG.md` and a `version` field in frontmatter. Update, bump, and roll
  back over time. No git required.

## Layout

```
skills/ai-skill-creator/
  SKILL.md                     # the meta-skill (two workflows: Create / Update)
  references/
    skill-authoring.md         # how to write a great SKILL.md
    ingestion.md               # input-type -> reader routing table
    versioning.md              # semver + snapshot + changelog procedure
    templates.md               # copy-paste skeletons
```

Skills it generates look like:

```
skills/<name>/
  SKILL.md                     # current; frontmatter version: X.Y.Z
  CHANGELOG.md
  references/...
  versions/
    v1.0.0/{SKILL.md, references/...}   # full snapshot (excludes versions/)
    v2.0.0/{...}
```

## Install

Copy the skill into a location Claude Code loads skills from:

```
# project-local
cp -r skills/ai-skill-creator <your-project>/.claude/skills/

# or user-global
cp -r skills/ai-skill-creator ~/.claude/skills/
```

## Use

Invoke it in natural language, for example:

- "Create a skill from this PDF and https://example.com/docs that summarizes API
  changes."
- "Make a skill that reviews SQL migrations — here are my notes: …"
- "Update the release-notes skill with this new changelog page and bump the
  version."

### Create workflow
Intake inputs → ingest & analyze (per `references/ingestion.md`) → synthesize
purpose/triggers/workflow → design name + description → generate `SKILL.md`,
`CHANGELOG.md` (1.0.0), and `versions/v1.0.0/` snapshot → validate.

### Update workflow
Locate skill + current version → ingest new material → decide bump
(major/minor/patch) → snapshot the current version first → apply edits, bump
`version`, prepend a `CHANGELOG.md` entry.

See `skills/ai-skill-creator/SKILL.md` and its `references/` for full detail.
