# When & Where to Use Motion — Use Cases by Pattern

Guidance for **where and when** each animation pattern belongs, so motion
reinforces the interface instead of decorating it. Use this to decide *whether*
to animate and *which* pattern fits, then jump to the recipe in
`references/patterns.md` (React) or `references/vanilla-and-cdn.md` (vanilla /
CDN / other frameworks).

This guidance is **method-agnostic** — the same use cases apply whether you
implement with React, plain JS, a CDN single-HTML page, or another framework.

## When to reach for this skill

Good fits:
- **Feedback** — confirming a tap, hover, drag, toggle, or successful action.
- **Continuity** — showing where something came from or went (open/close,
  navigation, reorder, expand).
- **Attention & hierarchy** — drawing the eye to newly revealed or important
  content without a jarring pop-in.
- **Delight in moderation** — brand personality on marketing/landing surfaces.

Skip or minimize motion when:
- The surface is **dense, data-heavy, or productivity-critical** (tables, admin
  dashboards, forms mid-entry) — animation slows expert users.
- It would **block input** or delay content the user is waiting for.
- The user has **`prefers-reduced-motion`** set — always degrade (see
  `references/performance-and-a11y.md`).
- A **static state change reads fine on its own** — don't animate for its own sake.

## Pattern → use case → UI components

| Pattern (see patterns.md) | When to use | Recommended use cases | Applicable UI components |
| --- | --- | --- | --- |
| **1. Fade / slide in on mount** | Content appears on load or first render and you want a soft entrance | First paint of a section, empty-state → loaded, toast appearing | Cards, hero sections, toasts/notifications, empty states, sidebars |
| **2. Hover & tap button** | Interactive element needs tactile feedback | Primary CTAs, icon buttons, clickable cards, links | Buttons, icon buttons, chips, cards, FABs, menu items |
| **3. Staggered list** | Multiple sibling items enter together and a cascade adds hierarchy | List/grid populates, search results render, menu opens | Lists, grids, nav menus, dropdown items, feed/timeline items |
| **4. Scroll reveal (in view)** | Long page where sections should surface as the user scrolls | Marketing/landing sections, feature blocks, testimonials | Landing sections, feature cards, stats blocks, images, quotes |
| **5. Scroll-linked progress** | Communicate reading/scroll position continuously | Article reading progress, long-form docs, parallax accents | Progress bars, reading indicators, sticky headers, parallax layers |
| **6. Modal / dialog (enter + exit)** | Content overlays the page and must clearly enter and leave | Confirmations, dialogs, drawers, popovers, command palettes | Modals, dialogs, drawers/sheets, popovers, command palette, lightbox |
| **7. Page / route transition** | Navigation between routes/views should feel connected | SPA route changes, tab-panel swaps, wizard steps | Route containers, tab panels, multi-step forms, onboarding flows |
| **8. Layout animation** | An element's size or position changes and you want it to move smoothly | Expand/collapse, resizing panels, filtering/reflow | Expandable cards, resizable panels, grids that reflow, chat bubbles |
| **9. Shared-element (magic move)** | The same conceptual element moves between two positions/states | Active tab indicator, list → detail, thumbnail → full image | Tab underlines, selection highlights, gallery→detail, hero image handoff |
| **10. Draggable with constraints** | User directly manipulates or reorders an element | Sortable lists, sliders, swipe-to-dismiss, bottom sheets | Sortable lists (Kanban), carousels, sliders, dismissible cards, sheets |
| **11. Accordion / expand-collapse** | Show/hide a region while animating its height | FAQs, settings groups, nested nav, "show more" | Accordions, collapsible sections, FAQ items, tree/nav groups |
| **12. Reusable motion presets** | You want consistent feel across many surfaces | Design-system-wide entrance/exit, shared timing tokens | Any component; enforce app-wide consistency via a presets module |

## Choosing by trigger (quick lookup)

- **On mount / data loaded** → 1 (fade-in), 3 (stagger for collections).
- **On pointer interaction** → 2 (hover/tap), 10 (drag).
- **On scroll** → 4 (reveal, discrete) or 5 (linked, continuous).
- **On open/close of overlay** → 6 (modal/drawer), 11 (accordion for inline).
- **On navigation / view change** → 7 (route), 9 (shared element for continuity).
- **On state that changes size/position** → 8 (layout).
- **For consistency across the app** → 12 (presets), applied to any of the above.

## Intensity by surface

- **Marketing / landing** — expressive is welcome: scroll reveals, staggers,
  shared-element hero transitions.
- **App / product UI** — favor short, subtle feedback: hover/tap, layout,
  concise modal transitions; avoid long or repeated large-motion effects.
- **Data / admin** — minimal: instant or near-instant feedback only; prefer
  opacity/layout over large movement, and keep durations at the low end.
