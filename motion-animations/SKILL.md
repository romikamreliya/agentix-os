---
name: motion-animations
version: 2.0.0
description: >-
  Add modern, performant animations to web interfaces with the Motion library
  (motion.dev, formerly Framer Motion) across any environment: React
  (motion/react), plain JavaScript, a single HTML page via CDN, and other
  frameworks (Vue, Svelte, Angular, Astro) through the framework-agnostic JS API.
  Use when the user wants micro-interactions, hover/tap/drag gestures, enter/exit
  transitions, scroll reveals, page transitions, staggered lists, or layout
  animations, or asks to "animate this", "add motion", "make it animated",
  "framer motion", "motion.dev", "motion one", "animate with CDN", "smooth
  transition", "fade in on scroll", or "animated modal". Produces
  production-ready, accessible, hardware-accelerated animation code.
---

# Motion Animations

Add smooth, production-grade animations to web interfaces with **Motion**
(`motion.dev`, previously Framer Motion). Motion is **framework-agnostic**: the
same engine powers a declarative React API and a small imperative JavaScript API
you can drop into a plain HTML page or any framework. Prefer Motion over
hand-rolled CSS keyframes for anything beyond a trivial hover.

## Integration methods

Pick the one that matches the project:

| Method | Import | Use when |
|---|---|---|
| **React** | `import { motion } from "motion/react"` | React / Next.js apps — declarative props tied to state. |
| **Plain JS (bundler)** | `import { animate } from "motion"` | Vanilla JS, TypeScript, or a build step without React. |
| **CDN / single HTML** | `<script type="module">` importing from a CDN | One HTML file, prototypes, no build step. |
| **Other frameworks** | Vue: `motion-v`; Svelte/Angular/Astro: the plain JS API | Non-React frameworks. |

See `references/api-cheatsheet.md` for the React API and
`references/vanilla-and-cdn.md` for the JS API, the CDN single-file setup, and
per-framework notes.

## Reference files (read on demand)

- `references/api-cheatsheet.md` — the **React** API: `motion` components,
  `initial`/`animate`/`exit`, `transition` (spring vs tween), variants +
  orchestration, gestures, scroll, layout, `AnimatePresence`, and hooks.
- `references/vanilla-and-cdn.md` — the **framework-agnostic** JS API (`animate`,
  `scroll`, `inView`, `hover`, `press`, `stagger`, `spring`), a copy-paste **CDN
  single-HTML** page, and notes for **Vue / Svelte / Angular / Astro**.
- `references/patterns.md` — copy-paste recipes for the common asks (fade-in,
  staggered list, hover/tap, scroll reveal, modal, page transition, layout &
  shared-element, drag) in React, with vanilla equivalents cross-referenced.
- `references/use-cases.md` — **when and where** to use motion and each pattern:
  a pattern → use case → applicable UI components table, trigger-based lookup, and
  how intensity should vary by surface. Applies to every integration method.
- `references/performance-and-a11y.md` — animate only cheap properties, reduce
  bundle size, and respect `prefers-reduced-motion`, in both React and vanilla.
  **Always apply this.**

## When & why to use

- **Where to use:** any web UI — React/Next.js apps, plain-JS or TypeScript sites,
  a single static HTML page, or Vue/Svelte/Angular/Astro projects.
- **Why to use:** one small, GPU-accelerated engine gives consistent, accessible
  animation across gestures, scroll, layout, and exit — far less brittle than
  hand-written keyframes or ad-hoc transition state.
- **Recommended use cases:** micro-interactions, enter/exit transitions, scroll
  reveals, staggered lists, layout/shared-element moves, drag. (See
  `references/use-cases.md` for the full pattern → component mapping.)
- **Examples:** React `<motion.div animate={{ opacity: 1 }} />`; vanilla
  `animate("#box", { opacity: 1 })`; CDN one-file page (see vanilla reference).
- **Benefits:** works everywhere Motion runs, hardware-accelerated (WAAPI),
  tiny for the vanilla API, tree-shakable for React, accessible by default.
- **Limitations:** it's a JS animation library — for a single static CSS
  `:hover`, plain CSS is simpler; very complex 3D belongs in WebGL/Three.js.
- **Applicable scenarios:** the user names Motion/Framer Motion/motion.dev, or
  wants richer/interruptible/gesture/scroll/exit animation than CSS gives.

## Workflow

1. **Clarify the goal & confirm motion fits.** Identify what should animate, the
   trigger (mount, hover/tap, scroll into view, state change, route change, drag),
   and the desired feel. Use `references/use-cases.md` to confirm motion helps
   here and to match the surface's appropriate intensity — skip or minimize motion
   where it would slow a dense, productivity-critical UI. Ask only if unclear.
2. **Determine the integration method.** Detect the environment: React/Next.js →
   `motion/react`; a bundler without React → `import from "motion"`; a lone HTML
   file → CDN ESM; Vue → `motion-v`; other frameworks → the plain JS API. Confirm
   Motion is installed/available and add the import (in Next.js, `"use client"`).
3. **Pick the pattern, then the mechanism.** Use `references/use-cases.md` to map
   the trigger and UI component to the right pattern, then get the API right —
   `references/api-cheatsheet.md` for React or `references/vanilla-and-cdn.md` for
   JS/CDN/other frameworks:
   - Mount/state change → React `initial`+`animate` (+`exit` in `AnimatePresence`);
     vanilla `animate(el, {...})` / `inView`.
   - Interaction → React `whileHover`/`whileTap`/`whileFocus`/`whileDrag`;
     vanilla `hover()` / `press()`.
   - Scroll → React `whileInView` or `useScroll`+`useTransform`; vanilla `inView()`
     (triggered) or `scroll()` (linked).
   - Reflow/reorder/shared element → React `layout`/`layoutId`.
   - Coordinated multi-element → `variants` + `stagger` (React) / `stagger()` (JS).
4. **Reach for a recipe.** Adapt the closest pattern in `references/patterns.md`
   (and its vanilla equivalent) rather than writing from scratch. Match the
   project's styling convention (Tailwind, CSS modules, inline).
5. **Tune the transition.** Spring physics for movement (`x`, `scale`, `rotate`);
   tween/ease for visual values (`opacity`, `color`). Keep durations short
   (150–400ms) for UI feedback; see the cheatsheet for `stiffness`/`damping`/
   `bounce`/`visualDuration`.
6. **Apply performance & accessibility** from `references/performance-and-a11y.md`:
   prefer `transform`/`opacity`, and honor reduced-motion. Not optional.
7. **Verify.** Ensure the page/component still renders, imports resolve, and the
   animation triggers as intended (run the app, open the HTML file, or use a
   preview if present).

## Core rules

- **React:** prefix any HTML/SVG element with `motion.` (`motion.div`,
  `motion.button`, `motion.path`) to unlock animation props. **Vanilla/CDN:** call
  `animate(element, keyframes, options)` and friends (`scroll`, `inView`, `hover`,
  `press`, `stagger`).
- Animate **transforms and opacity** by default — GPU-accelerated, no layout.
  Avoid `width`/`height`/`top`/`left`; use `scale`/`x`/`y` or React's `layout`.
- Physical values (`x`, `y`, `scale`, `rotate`) default to **spring**; visual
  values (`opacity`, `color`, `backgroundColor`) default to **tween**.
- React: wrap conditionally-rendered elements in `AnimatePresence` for `exit`
  animations, with a stable `key`. Vanilla: animate out, then remove the node.
- Always degrade gracefully for users who prefer reduced motion.
