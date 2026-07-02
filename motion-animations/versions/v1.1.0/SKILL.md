---
name: react-motion-animations
version: 1.1.0
description: >-
  Add modern, performant CSS/motion animations to React apps using the Motion
  library (motion/react, formerly Framer Motion) to improve UX and interface
  interactions. Use when the user wants to animate React components, add
  micro-interactions, hover/tap/drag gestures, enter/exit transitions, scroll
  reveals, page transitions, staggered lists, layout animations, or asks to
  "animate this component", "add motion", "make it animated", "framer motion",
  "motion.dev", "smooth transition", "fade in on scroll", or "animated modal".
  Produces production-ready, accessible, hardware-accelerated animation code.
---

# React Motion Animations

Add smooth, production-grade animations to React interfaces with **Motion**
(`motion/react`, previously Framer Motion). Prefer this library's declarative API
tied to React state/props over hand-rolled CSS keyframes for anything beyond a
trivial hover.

## Reference files (read on demand)

- `references/api-cheatsheet.md` — the core API: `motion` components, `animate`/
  `initial`/`exit`, `transition` (spring vs tween), variants + orchestration,
  gestures, scroll, layout, `AnimatePresence`, and hooks. Read this to get syntax
  right.
- `references/patterns.md` — copy-paste recipes for the common asks (fade-in,
  staggered list, hover/tap button, scroll reveal, modal/dialog, page/route
  transition, layout & shared-element, drag).
- `references/use-cases.md` — **when and where** to use motion and each pattern:
  a pattern → use case → applicable UI components table, trigger-based lookup,
  and how intensity should vary by surface (marketing vs. app vs. data). Read
  this to decide *whether* and *which* to animate before picking a mechanism.
- `references/performance-and-a11y.md` — animate only cheap properties, reduce
  bundle size, and respect `prefers-reduced-motion`. **Always apply this.**

## Setup

Motion ships as the `motion` package:

```bash
npm install motion
```

```jsx
import { motion, AnimatePresence } from "motion/react"
```

In Next.js App Router / RSC, animated components need `"use client"` at the top
of the file.

## Workflow

1. **Clarify the goal & confirm motion fits.** Identify what should animate, the
   trigger (mount, hover/tap, scroll into view, state change, route change, drag),
   and the desired feel (subtle micro-interaction vs. expressive). Use
   `references/use-cases.md` to confirm motion actually helps here (feedback,
   continuity, attention) and to match the surface's appropriate intensity
   (marketing vs. app vs. data/admin) — skip or minimize motion where it would
   slow a dense, productivity-critical UI. Ask only if it's genuinely unclear.
2. **Confirm setup.** Check whether `motion` is installed and whether the file is
   a client component (Next.js). Add the import (and `"use client"`) as needed.
3. **Pick the pattern, then the mechanism.** Use `references/use-cases.md` to map
   the trigger and UI component to the right pattern (its table and trigger
   lookup), then get the API right with `references/api-cheatsheet.md`:
   - Mount/state change → `initial` + `animate` (+ `exit` inside `AnimatePresence`).
   - Interaction → `whileHover` / `whileTap` / `whileFocus` / `whileDrag`.
   - Scroll → `whileInView` (triggered) or `useScroll` + `useTransform` (linked).
   - Reflow/reorder/shared element → `layout` / `layoutId`.
   - Coordinated multi-element → `variants` + `stagger`.
   - Imperative sequencing → `useAnimate`.
4. **Reach for a recipe.** Adapt the closest pattern in `references/patterns.md`
   rather than writing from scratch. Match the surrounding project's styling
   convention (Tailwind classes, CSS modules, inline styles).
5. **Tune the transition.** Use spring physics for movement (`x`, `scale`,
   `rotate`) and tween/ease for visual values (`opacity`, `color`). Keep
   durations short (150–400ms) for UI feedback; see the cheatsheet for
   `stiffness`/`damping`/`bounce`/`visualDuration`.
6. **Apply performance & accessibility** from `references/performance-and-a11y.md`:
   prefer `transform`/`opacity`, and honor reduced-motion. This is not optional.
7. **Verify.** Ensure the component still renders, imports resolve, and the
   animation triggers as intended (run the app or a Storybook/preview if present).

## Core rules

- Prefix any HTML/SVG element with `motion.` (`motion.div`, `motion.button`,
  `motion.path`) to unlock animation props.
- Animate **transforms and opacity** by default — they're GPU-accelerated and
  don't trigger layout. Avoid animating `width`/`height`/`top`/`left`; use
  `scale`/`x`/`y` or the `layout` prop instead.
- Physical values (`x`, `y`, `scale`, `rotate`) default to **spring**; visual
  values (`opacity`, `color`, `backgroundColor`) default to **tween**.
- Wrap conditionally-rendered elements in `AnimatePresence` to get `exit`
  animations, and give each a stable `key`.
- Always degrade gracefully for users who prefer reduced motion.
