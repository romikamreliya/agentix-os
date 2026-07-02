# Versioning Guide

Filesystem-based version management for generated skills. No git required.

## Version numbers (semver for skills)

Versions are `MAJOR.MINOR.PATCH`, starting at `1.0.0` for a new skill.

- **MAJOR** — a breaking change: the skill's behavior or expected inputs change
  incompatibly, a workflow is removed, or the trigger scope changes such that
  prior usage no longer works the same way.
- **MINOR** — a backward-compatible addition: a new capability, a new workflow
  step, an added reference file, broader triggers.
- **PATCH** — a fix or polish: wording, typos, clarified instructions, small
  corrections that don't change what the skill can do.

The `version` in `SKILL.md` frontmatter is always the current live version.

## Directory layout

```
skills/<name>/
  SKILL.md                 # live, current version
  CHANGELOG.md             # newest first
  references/...            # live references
  versions/
    v1.0.0/
      SKILL.md
      references/...
    v2.0.0/
      SKILL.md
      references/...
```

## Snapshot procedure

A snapshot is a full copy of the skill's live files **excluding** the
`versions/` directory itself (never copy `versions/` into a snapshot — it causes
infinite nesting).

**On create (v1.0.0):**
1. Write the live `SKILL.md`, `references/`, `CHANGELOG.md`.
2. Copy `SKILL.md` + `references/` into `versions/v1.0.0/`.

**On update (v<old> → v<new>):**
1. **Before editing**, if `versions/v<old>/` does not exist, copy the current
   live `SKILL.md` + `references/` into it. This preserves the old version.
2. Edit the live files with the improvements.
3. Set frontmatter `version: <new>`.
4. Prepend a CHANGELOG entry (format below).
5. Optionally copy the new live files into `versions/v<new>/` too.

Existing snapshots are immutable — never modify or delete them.

## Rollback

1. Choose the target `versions/vX.Y.Z/`.
2. Copy its `SKILL.md` + `references/` back over the live files.
3. Bump to a **new** version (rolling back is a change) and add a CHANGELOG
   entry noting "rolled back to vX.Y.Z".

## CHANGELOG format

Keep-a-Changelog style, newest entry first, absolute `YYYY-MM-DD` dates:

```markdown
# Changelog

## [2.0.0] - 2026-07-02 — major
### Changed
- Reworked the extraction workflow to require explicit user confirmation.
  Source: user feedback.
### Added
- `references/edge-cases.md`.

## [1.0.0] - 2026-07-01 — minor/initial
### Added
- Initial release generated from <source inputs>.
```

Each entry records: version, date, bump type, and what changed — cite the source
input or feedback that drove the change where possible.
