# Final Deliverable Spec (Phase 6)

Assemble the confirmed outputs of Phases 1–4 into a single design brief. Only
produce this once all prior phases are confirmed. Structure:

## 1. Overview
- Product one-liner, primary goal + success metric, and target audience.
- The captured **preference summary** (style, mood, light/dark).

## 1b. Trend basis (from Phase 4)
- The 2–4 researched trends/examples you actually applied, each with a source
  link and the one concrete change it drove. Keep it short; it shows the design
  is current and traceable, not decorative.

## 2. UX flow & user journey
- The numbered **primary user journey** (entry → tasks → success).
- Critical secondary flows (errors, empties, settings) as relevant.
- **Screen list**: for each screen — purpose, primary action, key states
  (empty/loading/populated/error/success), and navigation placement.
- Navigation model and information hierarchy notes.

## 3. Design system (tokens)
Present as a compact token reference:
- **Color** — roles + ramps with hex, light and dark, with contrast confirmed.
- **Typography** — families, type scale, weights, line-heights.
- **Spacing & grid** — scale, breakpoints, max widths, radius scale.
- **Elevation** — shadow ramp.
- **Motion** — durations, easing, what animates, reduced-motion fallback.
Include a one-line rationale per group tying it to a preference or goal.

## 4. Per-screen UI recommendations
For each key screen from the flow:
- **Layout** — regions, grid usage, above-the-fold priority.
- **Components** — which UI elements and their variants/states.
- **Content & copy tone** — heading style, microcopy voice, CTA wording.
- **Responsive behavior** — how it reflows on mobile.
- **Accessibility** — focus order, labels, contrast, target sizes.

## 5. Next steps & hand-off
- What to build first (highest-goal-impact screen).
- Open questions or assumptions to validate.
- **Hand-off**: recommend the `frontend-design` skill to build the coded UI from
  this spec, `motion-animations` for the motion work, and
  `web-design-guidelines` to audit the result. If a design token export
  (CSS variables / Tailwind config / JSON) is wanted, offer to generate it.

## Format guidance
- Lead with the summary and journey; keep tables tight; use tokens with concrete
  values (hex, px, ms) — never vague adjectives in the final spec.
- Keep the whole brief skimmable with clear headings; it is a working document a
  developer or another skill will build from.
</content>
