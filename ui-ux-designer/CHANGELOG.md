# Changelog

All notable changes to this skill are documented here. Newest first.

## [1.1.0] - 2026-07-02 — minor
### Added
- New **Phase 4 — Research current design trends**: browse the web to research
  the latest design trends, explore innovative patterns, analyze modern UI
  examples, and extract concrete improvements to the visual design and UX.
  Delegates browsing to the `firecrawl-search` / `firecrawl-scrape` /
  `firecrawl-website-design-clone` / `firecrawl-deep-research` skills, with
  `WebSearch`/`WebFetch` as fallbacks.
- New reference `references/trend-research.md` covering what to research, how to
  browse, turning findings into recommendations, and guardrails.
- Final deliverable now includes a **Trend basis** section listing the applied
  trends with sources (`references/output-spec.md`).
### Changed
- Renumbered visual-system (now Phase 5) and final-recommendations (now Phase 6)
  phases; updated `design-systems.md` and `output-spec.md` phase headers.
- Description and "When & why to use" updated to advertise trend research and new
  trigger phrases ("research design trends", "find modern UI examples", "improve
  the design").
- Fixed stray closing tags accidentally left at the end of `SKILL.md` in 1.0.0.
### Source
- Driven by user request to add web-browsing / design-trend research and
  improvement suggestions to the skill.

## [1.0.0] - 2026-07-02 — initial
### Added
- Initial release of the `ui-ux-designer` skill: an intake-first UI/UX design
  workflow that gathers design preferences (UI style, color, typography, shadows,
  spacing, animation, reference designs), analyzes product goals/audience/
  requirements, maps the UX flow and user journey, selects a design system,
  palette, and visual style, and only then generates final UI/UX design
  recommendations.
- Reference files: `preference-intake.md`, `discovery.md`, `design-systems.md`,
  `output-spec.md`.
</content>
