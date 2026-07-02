# Motion for React — API Cheatsheet

Grounded in the official docs (motion.dev). Package: `motion`; import from
`motion/react`.

> Not using React? See `references/vanilla-and-cdn.md` for the framework-agnostic
> JS API (`animate`/`scroll`/`inView`/`hover`/`press`/`stagger`), CDN single-HTML
> setup, and Vue/Svelte/Angular/Astro notes.

## The `motion` component

Prefix any HTML/SVG tag with `motion.` to unlock animation props:

```jsx
import { motion } from "motion/react"

<motion.div animate={{ opacity: 1 }} />
<motion.button whileHover={{ scale: 1.1 }} />
<motion.circle animate={{ pathLength: 1 }} />
```

### Core props

| Prop | Purpose |
|---|---|
| `initial` | Starting values (or `false` to skip the enter animation). |
| `animate` | Target values; animates whenever they change. |
| `exit` | Values to animate to on unmount (requires `AnimatePresence`). |
| `whileHover` | Target while hovered. |
| `whileTap` | Target while pressed (click/touch). |
| `whileFocus` | Target while focused. |
| `whileDrag` | Target while dragging. |
| `whileInView` | Target while in the viewport (scroll-triggered). |
| `transition` | How to animate (see below). |
| `variants` | Named animation states; referenced by string label. |
| `custom` | Data passed to dynamic (function) variants. |
| `layout` | Animate layout changes (size/position) via transforms. |
| `layoutId` | Shared-element transitions between different components. |
| `drag` | `true`, `"x"`, or `"y"` to make an element draggable. |

Any prop can take either literal values or the **name of a variant**.

## Transitions

`transition` controls the animation. `type` is `"tween"`, `"spring"`, or
`"inertia"`.

```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
/>
```

Defaults: physical properties (`x`, `y`, `scale`, `rotate`) use **spring**;
visual properties (`opacity`, `color`) use **tween**.

### Spring params
- `stiffness` — higher = snappier (default ~100).
- `damping` — opposing force; lower = more oscillation (0 = never settles).
- `mass` — heavier = slower.
- `bounce` — `0` none … `1` very bouncy (duration-based springs).
- `visualDuration` — perceived time to reach target; overrides `duration`,
  easiest way to coordinate springs with tweens.

```jsx
transition={{ type: "spring", visualDuration: 0.4, bounce: 0.3 }}
```

### Tween params
- `duration` — seconds.
- `ease` — `"linear"`, `"easeIn"`, `"easeOut"`, `"easeInOut"`, or a cubic-bezier
  array `[0, 0.71, 0.2, 1.01]`. For keyframes, an array of easings between values.
- `delay`, `repeat`, `repeatType` (`"loop" | "reverse" | "mirror"`).

### Value-specific & defaults
```jsx
transition={{
  default: { type: "spring" },
  opacity: { ease: "linear", duration: 0.2 },
}}
```

Set app-wide defaults with `MotionConfig`:
```jsx
import { MotionConfig } from "motion/react"
<MotionConfig transition={{ duration: 0.4, ease: "easeInOut" }}> ... </MotionConfig>
```

## Keyframes

Pass an array to animate through several values; the current value is the first
keyframe if you use a wildcard `null`:

```jsx
<motion.div animate={{ x: [0, 100, 0], backgroundColor: ["#f00", "#0f0"] }}
  transition={{ times: [0, 0.5, 1], duration: 1 }} />
```

## Variants & orchestration

Define named states once, reference by label; they propagate to children.

```jsx
import { motion, stagger } from "motion/react"

const list = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", delayChildren: stagger(0.1) },
  },
}
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

<motion.ul variants={list} initial="hidden" animate="visible">
  <motion.li variants={item} />
  <motion.li variants={item} />
</motion.ul>
```

- `when`: `"beforeChildren"` / `"afterChildren"`.
- `delayChildren: stagger(0.1, { from: "last" | "first" | "center", startDelay })`.
- **Dynamic variants** — make a variant a function of `custom`:
  ```jsx
  const variants = { visible: (i) => ({ opacity: 1, transition: { delay: i * 0.1 } }) }
  items.map((it, i) => <motion.div custom={i} variants={variants} />)
  ```

## Gestures

`whileHover`, `whileTap`, `whileFocus`, `whileDrag`, plus event handlers
`onHoverStart/End`, `onTap/onTapStart/onTapCancel`, `onPan`, `onDragStart/End`.
These are cross-device (work on touch, unlike CSS `:hover`).

```jsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
  onTap={() => submit()} />
```

Dragging with constraints:
```jsx
<motion.div drag dragConstraints={{ left: 0, right: 300 }} dragElastic={0.2} />
```

## Exit animations — `AnimatePresence`

Keeps elements in the DOM until their `exit` animation finishes. Children need a
stable `key`.

```jsx
import { AnimatePresence, motion } from "motion/react"

<AnimatePresence>
  {open && (
    <motion.div key="modal"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
  )}
</AnimatePresence>
```
- `mode="wait"` animates one out before the next in; `mode="popLayout"` for lists.
- `initial={false}` skips the first-mount enter animation.

## Scroll

- **Triggered:** `whileInView` (+ `viewport={{ once: true, amount: 0.3 }}`).
  ```jsx
  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} />
  ```
- **Linked:** `useScroll` returns `MotionValue`s; feed them to `style` or map
  with `useTransform`.
  ```jsx
  import { useScroll, useTransform, motion } from "motion/react"
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  <motion.div style={{ scaleX: scrollYProgress, opacity }} />
  ```

## Layout animations

```jsx
<motion.div layout />                 // animate size/position changes
<motion.div layoutId="highlight" />   // shared element across components
```
Wrap reorderable groups so siblings animate too; use `LayoutGroup` to coordinate
across separate trees.

## Imperative control — `useAnimate`

For sequencing, timelines, or triggering outside React's render cycle:

```jsx
import { useAnimate } from "motion/react"
const [scope, animate] = useAnimate()
// later:
await animate(scope.current, { opacity: 1 })
await animate("li", { x: 0 }, { delay: stagger(0.1) })
```

## MotionValues

`useMotionValue`, `useTransform`, `useSpring`, `useMotionValueEvent` track values
outside React state (no re-render) — ideal for scroll/drag-linked effects.

## Reduced motion

`useReducedMotion()` returns a boolean; or set globally:
```jsx
<MotionConfig reducedMotion="user"> ... </MotionConfig>
```
See `performance-and-a11y.md`.
