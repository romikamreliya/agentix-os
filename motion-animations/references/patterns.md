# Motion for React — Pattern Recipes

Copy-paste starting points for the common asks. Adapt styling to the project
(Tailwind / CSS modules / inline). All examples assume:

```jsx
import { motion, AnimatePresence } from "motion/react"
```

In Next.js App Router, add `"use client"` at the top of any file using these.

> **Not using React?** Each recipe below has a vanilla-JS / CDN equivalent in
> `references/vanilla-and-cdn.md` ("Vanilla equivalents of the common patterns").

---

## 1. Fade / slide in on mount

```jsx
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  {children}
</motion.div>
```

## 2. Hover & tap button (micro-interaction)

```jsx
<motion.button
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.96 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
>
  Click me
</motion.button>
```

## 3. Staggered list

```jsx
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { delayChildren: stagger(0.08) } },
}
const row = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((it) => (
    <motion.li key={it.id} variants={row}>{it.label}</motion.li>
  ))}
</motion.ul>
```
(`import { stagger } from "motion/react"`)

## 4. Scroll reveal (animate once when in view)

```jsx
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.5 }}
/>
```

## 5. Scroll-linked progress bar

```jsx
import { useScroll, motion } from "motion/react"

function ProgressBar() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "0%",
               position: "fixed", top: 0, left: 0, right: 0, height: 4 }}
    />
  )
}
```

## 6. Modal / dialog with backdrop (enter + exit)

```jsx
<AnimatePresence>
  {open && (
    <motion.div
      key="backdrop"
      className="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        key="dialog"
        className="dialog"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", visualDuration: 0.3, bounce: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

## 7. Page / route transition

Wrap route content and key it by pathname so exit/enter run on navigation.

```jsx
<AnimatePresence mode="wait">
  <motion.main
    key={pathname}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.main>
</AnimatePresence>
```

## 8. Layout animation (auto-animate size/position)

```jsx
<motion.div layout>
  {expanded ? <FullCard /> : <CompactCard />}
</motion.div>
```

## 9. Shared-element (magic move) — animated tab underline

```jsx
{tabs.map((t) => (
  <button key={t.id} onClick={() => setActive(t.id)}>
    {t.label}
    {active === t.id && (
      <motion.div layoutId="underline" className="underline" />
    )}
  </button>
))}
```

## 10. Draggable card with constraints

```jsx
<motion.div
  drag
  dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
  dragElastic={0.15}
  whileDrag={{ scale: 1.05 }}
/>
```

## 11. Accordion / expand-collapse height

```jsx
<AnimatePresence initial={false}>
  {open && (
    <motion.section
      key="content"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: "hidden" }}
    />
  )}
</AnimatePresence>
```
(Height is one of the few non-transform values worth animating; keep
`overflow: hidden`.)

## 12. Reusable motion presets

Centralize variants so the app feels consistent:

```jsx
// motion-presets.js
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
}
```
```jsx
<motion.div variants={fadeUp} initial="hidden" animate="show" />
```
