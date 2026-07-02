# Visual System Selection (Phase 4)

Choose each element to match the **Phase 1 preferences** and **Phase 2 audience**.
State the rationale for every choice. Accessibility (WCAG AA contrast, target
sizes ≥ 44px, reduced-motion) is a constraint on all of it.

## 1. Design-system archetype

Pick an overall visual style, then borrow tokens/patterns from a known system as
a baseline the user can build on:

| Archetype | Feels like | Good for | Baseline reference |
|-----------|-----------|----------|--------------------|
| Minimal / clean | Calm, focused | SaaS, content, tools | shadcn/ui, Vercel/Geist |
| Enterprise / dense | Efficient, neutral | Dashboards, admin, B2B | Ant Design, Carbon |
| Material | Familiar, tactile | Android, cross-platform | Material 3 |
| Human-interface | Native, refined | iOS/macOS apps | Apple HIG |
| Bold / expressive | Confident, loud | Marketing, consumer, brand | custom |
| Playful / friendly | Warm, approachable | Consumer, education, kids | custom + illustration |
| Editorial / elegant | Premium, spacious | Portfolios, publications | custom, serif-led |

## 2. Color palette

Define **roles**, not just colors:
- **Primary** (brand action), **secondary**, **accent** (sparingly).
- **Neutrals** — a 5–9 step gray ramp for text, borders, surfaces, backgrounds.
- **Semantic** — success (green), warning (amber), error (red), info (blue).
- **Surfaces** — background, card, elevated, overlay — for both light and dark.

Construction:
- Start from the brand hue; build tints/shades as a numbered ramp (50–900).
- Choose harmony per preference: monochromatic, analogous, or complementary.
- **Contrast is mandatory**: body text ≥ 4.5:1, large text/UI ≥ 3:1 against its
  surface, in *both* light and dark. Verify before finalizing.
- Don't encode meaning by color alone (color-blind safety): pair with icon/label.

Deliver palette as named tokens (e.g. `--color-primary-600`) with hex values.

## 3. Typography

- **Families**: one UI/body face; optionally a display face for headings and a
  mono for code/data. Match the Phase 1 personality (geometric/humanist/serif).
- **Type scale**: a modular scale (e.g. 12, 14, 16, 20, 24, 32, 40, 48) with
  defined line-heights (tighter for headings ~1.1–1.25, ~1.5 for body).
- **Weights**: limit to 2–3 (e.g. regular, medium, semibold).
- Body text ≥ 16px on the web for readability.

## 4. Spacing, grid & radius

- **Spacing scale**: 4px base (4, 8, 12, 16, 24, 32, 48, 64) — density per Phase 1
  (airy → larger steps; compact → tighter).
- **Grid**: 12-column responsive for web; define breakpoints (e.g. 640/768/1024/
  1280). Define max content width.
- **Radius scale**: e.g. 4 / 8 / 12 / full — matched to the sharp↔pill preference.

## 5. Elevation / shadows

- Define an elevation ramp (e.g. 0/1/2/3): flat (borders only), subtle (soft
  low-blur), or pronounced (layered) per preference.
- Keep shadows consistent (single light source); soften and reduce opacity for
  dark mode.

## 6. Motion

- **Language**: durations (~150–250ms UI, ~300–500ms larger transitions),
  easing (ease-out for enter, ease-in for exit), and what animates (opacity/
  transform — avoid animating layout for performance).
- Scope per Phase 1 appetite: micro-interactions (hover/focus/press), state
  transitions, page/section reveals.
- **Always** define a `prefers-reduced-motion` fallback (cross-fade or none).
- For implementation, hand off to the `motion-animations` skill.

## Output of Phase 4
A named **design token set**: colors (roles + ramps), typography (families +
scale), spacing, radius, elevation, and motion — each with a one-line rationale
tying it to a preference or goal. This feeds directly into Phase 5.
</content>
