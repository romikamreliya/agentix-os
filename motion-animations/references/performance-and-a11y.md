# Performance & Accessibility

Apply these on **every** animation. Motion runs animations natively via the Web
Animations API + ScrollTimeline (up to 120fps) and falls back to JS only when
needed — but that only helps if you animate the right properties.

## Animate cheap properties

Prefer GPU-accelerated, compositor-only properties that never trigger layout or
paint:

- ✅ `transform` values: `x`, `y`, `scale`, `rotate`, `skew` — and `opacity`.
- ⚠️ Avoid animating `width`, `height`, `top`, `left`, `margin`, `padding` — they
  cause layout reflow and jank. Use `scale`/`x`/`y`, or the `layout` prop which
  animates layout changes *using transforms* and corrects scale distortion.
- ⚠️ `boxShadow`, `filter`, `backgroundColor` are animatable but more expensive —
  use sparingly and keep them short.

For expand/collapse where you truly need `height: auto`, that's an accepted
exception (see pattern 11); keep `overflow: hidden` and the element small.

## Keep it subtle and fast

- UI feedback (hover/tap/toggles): **150–300ms**. Larger entrance/page
  transitions: **300–500ms**. Longer than ~500ms feels sluggish for interactions.
- Use springs for movement (`x`, `scale`), tween/ease for opacity and color.
- Don't animate everything at once — stagger and prioritize the primary element.

## Bundle size

- Motion is tree-shakable; import only what you use from `motion/react`.
- For size-critical bundles, use `LazyMotion` + the lightweight `m` component to
  defer loading feature sets:
  ```jsx
  import { LazyMotion, domAnimation, m } from "motion/react"
  <LazyMotion features={domAnimation}>
    <m.div animate={{ opacity: 1 }} />
  </LazyMotion>
  ```
  Use `domMax` instead of `domAnimation` if you need layout/drag features.
- **Vanilla / CDN:** the imperative API is already tiny — import only the
  functions you use (`animate`, `scroll`, …), or use `motion/mini`'s `animate`
  (WAAPI-only) for the smallest footprint. `LazyMotion`/`m` are React-only.

## Respect `prefers-reduced-motion`

Vestibular-sensitive users can be harmed by large motion. Always provide a
reduced experience — typically keep opacity fades but drop movement/scale/parallax.

**Global (simplest):**
```jsx
import { MotionConfig } from "motion/react"
<MotionConfig reducedMotion="user">{app}</MotionConfig>
```
With `reducedMotion="user"`, Motion automatically disables transform/layout
animations for users who requested reduced motion, while keeping opacity/color.

**Vanilla / CDN / other frameworks:** there's no `MotionConfig`, so gate motion
with `matchMedia` and skip or reduce the animation yourself:
```js
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
animate("#box", reduce ? { opacity: [0, 1] } : { opacity: [0, 1], y: [40, 0] })
```

**Per-component / conditional (React):**
```jsx
import { useReducedMotion, motion } from "motion/react"

function Card() {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    />
  )
}
```

## Other accessibility notes

- Don't convey meaning through motion alone; keep it enhancement, not information.
- Ensure interactive animated elements remain keyboard-focusable and that
  `whileFocus` mirrors `whileHover` where relevant.
- Avoid infinite/looping attention-grabbing animation near text content.
- Test with the OS "Reduce motion" setting enabled.

## SSR / Next.js (React)

- Components using Motion hooks/props must be client components (`"use client"`).
- Set `initial={false}` where you don't want a flash of animation on hydration.
- Vanilla/CDN code runs client-side by definition — guard against a flash by
  setting the initial style in CSS and animating from it after load.
