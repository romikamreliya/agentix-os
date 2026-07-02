---
name: ui-ux-designer
version: 1.0.0
description: >-
  Produce UI/UX design recommendations for an app, website, or product feature —
  but collect all inputs first. Gathers the user's design preferences (UI style,
  color combinations, typography, shadows, spacing, animations, reference
  designs), then analyzes the product's goals, target audience, and requirements,
  maps the UX flow and user journey, and selects a design system, color palette,
  and visual style before generating anything. Use when the user says "design a
  UI", "design the UX", "create a design system", "how should this look", "design
  a landing page/dashboard/app", "UI/UX for my product", or "make it look good".
  Produces a structured design brief: UX flows, design system, palette,
  typography, spacing, motion, and screen-level UI recommendations.
---

# UI/UX Designer

Turn a product idea into a grounded UI/UX design recommendation. This skill is
**intake-first**: it collects design preferences and product context, works
through UX and visual-system decisions, and only *then* produces the final design
recommendations. Never jump straight to visuals.

## Core principle — collect everything, then design

Do not generate any design output until Phases 1–4 are complete. If the user is
eager for a result, still confirm the essentials quickly (a few defaults are
fine), but the **order is fixed**: preferences → product analysis → UX flow →
visual system → final design. Guessing preferences and back-filling them is the
failure mode this skill exists to prevent.

## Reference files (read on demand)

- `references/preference-intake.md` — the full preference questionnaire (UI
  style, color, typography, shadows, spacing, animation, reference designs), how
  to ask it efficiently, and sensible defaults when the user has no opinion.
- `references/discovery.md` — how to analyze the product (goals, audience,
  requirements) and how to build the UX flow and user journey from those goals.
- `references/design-systems.md` — catalog of design-system archetypes, palette
  construction, type pairing, spacing/scale, elevation/shadows, and motion
  principles used in Phase 4.
- `references/output-spec.md` — the exact structure of the final design brief
  deliverable.

## When & why to use
- **Where to use:** greenfield product/feature design, redesigns, landing pages,
  dashboards, mobile/web apps, design-system definition, or any "how should this
  look and flow" request — before frontend implementation begins.
- **Why to use:** it forces the right order (understand → structure → style →
  render), so the visuals serve real goals and match the user's taste instead of
  defaulting to generic AI aesthetics or premature pixel-pushing.
- **Recommended use cases:** "design a SaaS dashboard for X", "UI/UX for my
  fitness app", "create a design system for our brand", "design an onboarding
  flow", "make my landing page convert".
- **Examples:** *"Design the UX and UI for a budgeting app for freelancers"* →
  skill asks preference + product questions, returns user journey + design system
  + screen recommendations. *"I need a clean, dark, minimal dashboard"* → skill
  captures the style cues, still confirms goals/audience, then designs.
- **Benefits:** decisions are traceable to goals and stated taste; output is a
  reusable spec a developer or the `frontend-design` skill can build from.
- **Limitations:** produces specifications and recommendations, not final
  production code or high-fidelity mockup images. For building the coded UI, hand
  off to `frontend-design`; for motion implementation, to `motion-animations`;
  for auditing an existing UI, to `web-design-guidelines`; to reverse-engineer an
  existing site's design, to `firecrawl-website-design-clone`.
- **Applicable scenarios:** the user has a product idea and needs both structure
  (UX) and style (UI) defined. If they only want an existing UI reviewed, or only
  want code generated from an already-decided design, prefer the skills above.

## Workflow

Run the phases in order. Confirm each phase's outputs before moving on.

### Phase 1 — Gather design preferences (do this first)
Read `references/preference-intake.md`. Elicit the user's taste **before**
analyzing the product, so visual decisions later are anchored to it. Cover:
UI style/mood, color combinations, typography, shadows/elevation, spacing/density,
animation appetite, and any reference designs or inspirations. Use the
`AskUserQuestion` tool to batch related questions with concrete options; record
answers. Where the user has no preference, note the default you'll use and move on
— don't stall.

### Phase 2 — Analyze the product
Read `references/discovery.md`. From the user's prompt (and a few targeted
questions only where genuinely unknown), extract and confirm:
- **Goals** — what the product must achieve; the primary success metric.
- **Target audience** — who uses it, their context, devices, and accessibility
  needs.
- **Requirements & constraints** — core features/screens, platform (web/mobile/
  both), content types, brand or technical constraints, scope.
Summarize this back to the user in a few lines and get a nod before proceeding.

### Phase 3 — UX flow & user journey
Still in `references/discovery.md`. Derive the structure from the goals:
- Map the **primary user journey** (entry → key tasks → success/exit) and any
  critical secondary flows.
- List the **screens/states** each flow needs, and the key actions and decision
  points on each.
- Note information hierarchy and navigation model.
Present the flow (a numbered journey plus a screen list) and confirm it.

### Phase 4 — Select the visual system
Read `references/design-systems.md`. Choose, matching the Phase 1 preferences and
Phase 2 audience:
- A **design-system archetype** / overall visual style.
- A **color palette** (roles: primary, secondary, accent, neutrals, semantic;
  with light/dark intent and contrast that meets WCAG AA).
- **Typography** (families + type scale), **spacing/grid**, **shadow/elevation**,
  **radius**, and **motion** language.
State the rationale tying each choice to a preference or a goal.

### Phase 5 — Generate the final UI/UX design recommendations
Only now, assemble the deliverable per `references/output-spec.md`: the confirmed
UX flow and user journey, the design system (tokens), and **per-screen UI
recommendations** (layout, components, key states, and copy tone). Close with
concrete next steps and the recommended hand-off skill (e.g. `frontend-design`).

## Notes
- Ask in batches with `AskUserQuestion`; don't interrogate one field at a time.
- Never skip Phase 1. If the user gave some preferences in their prompt, confirm
  and fill only the gaps.
- Accessibility (contrast, target sizes, motion-reduction) is a requirement, not
  an add-on — bake it into Phases 3–5.
- This skill outputs a specification. Hand off building to `frontend-design` and
  motion to `motion-animations`.
</content>
</invoke>
