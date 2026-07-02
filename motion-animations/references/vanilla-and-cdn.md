# Motion — Vanilla JS, CDN & Other Frameworks

Motion's engine is framework-agnostic. Outside React you use a small **imperative
JS API** — the same one works with a bundler, a single HTML file via CDN, or any
framework (Svelte, Angular, Astro, Vue*). This is the former "Motion One" API,
now shipped in the `motion` package.

> React users: use `references/api-cheatsheet.md` instead.

## Install (bundler)

```bash
npm install motion
```
```js
import { animate, scroll, inView, hover, press, stagger } from "motion"
```

For the smallest possible bundle (WAAPI `animate` + `scroll` only):
```js
import { animate } from "motion/mini"
```

## CDN — single HTML page (no build step)

Import the ESM build straight from a CDN inside a module script:

```html
<!doctype html>
<html>
  <body>
    <div id="box" style="width:100px;height:100px;background:#5b8cff"></div>

    <script type="module">
      import { animate, hover, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm"

      // fade + slide in on load
      animate("#box", { opacity: [0, 1], transform: ["translateY(16px)", "none"] },
        { duration: 0.4, ease: "easeOut" })

      // hover micro-interaction
      hover("#box", (el) => {
        animate(el, { scale: 1.05 }, { type: "spring", stiffness: 400, damping: 25 })
        return () => animate(el, { scale: 1 })
      })
    </script>
  </body>
</html>
```
(unpkg works too: `https://unpkg.com/motion@latest/+esm`. Pin a major version
like `motion@12` for production instead of `@latest`. **Use `motion@12` or
newer** — the `hover()` and `press()` gesture functions were added in v12, so
`motion@11` will throw `does not provide an export named 'hover'`.)

## The core JS API

### `animate(target, keyframes, options)`
`target` is an element, a CSS selector string, an array of elements, or a
`MotionValue`/number. Returns animation controls (`.then()`, `.pause()`,
`.play()`, `.stop()`, `.complete()`, plus `.time`, `.speed`).

```js
animate("#box", { x: 100, opacity: 1 }, { duration: 0.5 })
animate(".card", { y: [20, 0], opacity: [0, 1] })      // keyframes as arrays
const controls = animate("#box", { rotate: 360 }, { repeat: Infinity, ease: "linear" })
controls.pause()

// animate a plain number (e.g. a counter)
animate(0, 100, { duration: 1, onUpdate: (v) => (el.textContent = Math.round(v)) })
```

Options: `duration`, `delay`, `ease` (`"easeOut"`, cubic-bezier array,
`spring()`, `steps()`), `repeat`, `repeatType` (`"loop"|"reverse"|"mirror"`),
`type: "spring"` with `stiffness`/`damping`/`mass`/`bounce`/`visualDuration`.

### `hover(target, onStart)` / `press(target, onStart)`
Cross-device pointer gestures. `onStart` receives the element and may return an
`onEnd` cleanup.
```js
hover(".btn", (el) => { animate(el, { scale: 1.05 }); return () => animate(el, { scale: 1 }) })
press(".btn", (el) => { animate(el, { scale: 0.95 }); return () => animate(el, { scale: 1 }) })
```

### `inView(target, onStart, options)`
Scroll-**triggered**. `onStart` may return an `onEnd`. Options: `amount`
(`0`–`1` or `"all"`), `margin`.
```js
inView(".section", (el) => {
  animate(el, { opacity: 1, y: [40, 0] }, { duration: 0.6 })
}, { amount: 0.3 })   // fires once per entry; return a cleanup to run on exit
```

### `scroll(onScrollOrAnimation, options)`
Scroll-**linked** (progress `0`→`1`). Pass a callback, or hand it an `animate()`
to scrub.
```js
// progress bar
scroll(animate("#bar", { scaleX: [0, 1] }))
// custom callback, linked to an element's travel through the viewport
scroll((progress) => { header.style.opacity = 1 - progress },
  { target: document.querySelector("#hero"), offset: ["start start", "end start"] })
```

### `stagger(each, options)`
Use as a `delay` when animating multiple elements. Options: `start`,
`from` (`"first"|"last"|"center"|index`), `ease`.
```js
animate(".list li", { opacity: [0, 1], y: [12, 0] }, { delay: stagger(0.08) })
```

### `spring(...)` and MotionValues
`spring()` is an easing generator usable in `ease`. `motionValue()` +
`animate(value, ...)` track values without touching the DOM directly — feed them
into styles for scroll/drag-linked effects.

## Vanilla equivalents of the common patterns

Cross-reference `references/patterns.md` (React) — same visual result:

- **Fade/slide in** → `animate(el, { opacity:[0,1], y:[16,0] }, { duration:0.3 })`.
- **Hover/tap button** → `hover()` + `press()` as above.
- **Staggered list** → `animate(".item", {...}, { delay: stagger(0.08) })`.
- **Scroll reveal** → `inView(el, () => animate(el, {...}))`.
- **Scroll progress** → `scroll(animate("#bar", { scaleX:[0,1] }))`.
- **Modal enter/exit** → `animate(modal, { opacity:[0,1], scale:[0.9,1] })` on
  open; on close `await animate(modal, { opacity:0, scale:0.95 })` **then** remove
  the node from the DOM (no `AnimatePresence` outside React).
- **Accordion** → animate `height` between `0` and the measured `scrollHeight`,
  keep `overflow:hidden`.

> Layout/shared-element (`layout`, `layoutId`) and declarative `exit` are
> **React-only** features. In vanilla, animate explicitly and use FLIP manually
> if you need layout transitions.

## Other frameworks

- **Vue** — use the dedicated **`motion-v`** package for a declarative,
  React-like component API:
  ```vue
  <script setup>import { motion } from "motion-v"</script>
  <template>
    <motion.div :initial="{ opacity: 0 }" :animate="{ opacity: 1 }"
      :while-hover="{ scale: 1.05 }" />
  </template>
  ```
- **Svelte** — call the JS API in `onMount` (and return the cleanup on destroy):
  ```svelte
  <script>
    import { onMount } from "svelte"
    import { animate, hover } from "motion"
    let el
    onMount(() => { animate(el, { opacity: [0, 1] }); return hover(el, ...) })
  </script>
  <div bind:this={el} />
  ```
- **Angular** — call the JS API in `ngAfterViewInit` with an `@ViewChild`
  `ElementRef`; clean up gesture/scroll subscriptions in `ngOnDestroy`.
- **Astro** — put the CDN/ESM snippet in a `<script>` in the `.astro` file (runs
  client-side); great for island-style enhancements.

All of these share the performance and accessibility rules in
`references/performance-and-a11y.md` — including honoring `prefers-reduced-motion`.
