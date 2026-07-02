# Preference Intake (Phase 1)

Capture the user's taste **before** designing. Ask in batches with
`AskUserQuestion`, offer concrete options (not open-ended prompts), and record
every answer. If the user has no opinion on a field, note the listed default and
move on — the goal is momentum, not a complete survey.

## What to elicit

### 1. UI style / mood
The overall aesthetic direction. Offer a few archetypes:
- **Minimal / clean** — lots of whitespace, few colors, restrained.
- **Bold / expressive** — big type, saturated color, strong contrast.
- **Playful / friendly** — rounded shapes, illustration, warm palette.
- **Professional / enterprise** — dense, information-first, neutral.
- **Elegant / editorial** — serif accents, generous spacing, refined.
- **Neo-brutalist / retro / glassmorphic** — offer only if the user hints at it.

Also ask **light, dark, or both**, and the emotional adjectives they want (e.g.
"trustworthy", "energetic", "calm").

Default: minimal/clean, light + dark support.

### 2. Color combinations
- A **brand/primary color** (or "pick one for me" → derive from mood).
- Preferred **combination style**: monochromatic, analogous, complementary,
  or a defined brand pair.
- Colors to **avoid** and any hard brand colors that are fixed.

Default: single brand hue + neutral grays + one accent; semantic red/green/amber.

### 3. Typography
- **Style**: geometric sans, humanist sans, serif, slab, mono, or "surprise me".
- **Personality**: modern, classic, technical, friendly.
- Any **required fonts** (brand fonts) or licensing constraints.

Default: one clean sans for UI (e.g. Inter/Geist-like) + optional display face.

### 4. Shadows / elevation
- **Flat** (no shadows, borders for separation), **subtle** (soft low shadows),
  or **pronounced** (layered depth, floating cards).

Default: subtle, soft shadows with a small elevation scale.

### 5. Spacing / density
- **Airy** (generous whitespace), **balanced**, or **compact/dense** (data-heavy).
- Corner **radius** feel: sharp (0–2px), soft (6–12px), or pill/rounded.

Default: balanced spacing on an 4/8px grid, soft radius.

### 6. Animation appetite
- **None/minimal**, **tasteful micro-interactions**, or **rich/expressive**.
- Respect reduced-motion: always plan a `prefers-reduced-motion` fallback.

Default: tasteful micro-interactions (hover, focus, page/section transitions).

### 7. Reference designs / inspiration
- Any **sites, apps, or Dribbble/Behance links** they admire, and *what*
  specifically they like about each (layout, color, type, motion).
- Competitors to match or deliberately differ from.
- If they share a URL and want its system extracted, hand off to
  `firecrawl-website-design-clone` and fold the result into this phase.

Default: none — proceed from the mood adjectives.

## How to ask efficiently
- Group into 2–4 `AskUserQuestion` calls (e.g. one for style+mode, one for
  color, one for type+shadows+density, one for motion+references).
- Lead each option list with your recommended default and label it
  "(Recommended)".
- Echo a one-line **preference summary** back to the user before Phase 2 so the
  captured taste is explicit and correctable.
</content>
