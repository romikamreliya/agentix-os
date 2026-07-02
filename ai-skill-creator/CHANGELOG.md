# Changelog

All notable changes to this skill are documented here. Newest first.

## [1.1.0] - 2026-07-02 — minor
### Added
- **Required usage documentation** for every generated skill: each new skill must
  now include a "When & why to use" section covering where to use it, why to use
  it, recommended use cases, practical examples, benefits, limitations, and
  applicable scenarios.
- `references/skill-authoring.md` — new "Usage documentation (required)" section
  and a matching pre-ship checklist item.
- `references/templates.md` — SKILL.md skeleton now includes the "When & why to
  use" section.
- This CHANGELOG and filesystem version management for the meta-skill itself
  (`versions/v1.0.0/` snapshot of the prior state).
### Changed
- `SKILL.md` — Create workflow steps 4/5/6 and the Update workflow step 5 now
  require and validate the usage documentation.

Source: user request — creating a skill without explaining when/where to use it
makes it less useful and harder to adopt.

## [1.0.0] - 2026-07-02 — initial
### Added
- Initial ai-skill-creator meta-skill: Create and Update workflows, ingestion
  routing, filesystem versioning, and authoring/template references.
