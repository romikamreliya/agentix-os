# Templates

Copy-paste skeletons for a generated skill. Replace every `<…>` placeholder.

## SKILL.md skeleton

```markdown
---
name: <kebab-case-name-matching-dir>
version: 1.0.0
description: >-
  <What the skill does.> Use when <situations>. Triggers on "<phrase 1>",
  "<phrase 2>", "<phrase 3>". <One line on what it produces.>
---

# <Human Readable Title>

<One sentence: what this skill does.>

## When & why to use
- **Where to use:** <surfaces / contexts / project types / files>.
- **Why to use:** <the problem it solves; value over doing it manually>.
- **Recommended use cases:** <concrete situations where it's the right tool>.
- **Examples:** <short realistic invocation or before/after>.
- **Benefits:** <speed / consistency / correctness / quality gained>.
- **Limitations:** <where it falls short; what it does NOT do>.
- **Applicable scenarios:** <trigger signals; when to prefer another skill>.

## Reference files
- `references/<file>.md` — <what's in it>.

## Workflow
1. <First step — imperative.>
2. <Second step.>
3. <Third step.>

## Notes
- <Conventions, constraints, gotchas.>
```

> The **When & why to use** section is required — see `skill-authoring.md`. If it
> grows long, extract it to `references/use-cases.md` and link it here.

## CHANGELOG.md skeleton (initial)

```markdown
# Changelog

All notable changes to this skill are documented here. Newest first.

## [1.0.0] - <YYYY-MM-DD> — initial
### Added
- Initial release generated from <list of source inputs>.
```

## Optional reference file skeleton

```markdown
# <Reference Title>

<Detail, tables, rules, or examples that would clutter the SKILL.md body.>
```

## Directory to create for a new skill

```
skills/<name>/
  SKILL.md
  CHANGELOG.md
  references/            # only if the design needs them
  versions/
    v1.0.0/
      SKILL.md
      references/        # mirror of live references, if any
```
