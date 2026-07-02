# Product Discovery & UX Flow (Phases 2–3)

## Phase 2 — Analyze the product

Extract these from the user's prompt; ask only where genuinely unknown. Confirm a
short summary before proceeding.

### Goals
- What is the product's **primary purpose**? What must a user be able to do?
- The **single success metric** (conversion, task completion, retention,
  engagement, comprehension).
- Business context: is this a landing page (persuade), an app (enable a task), a
  dashboard (inform), a tool (execute)?

### Target audience
- **Who** they are (role, expertise, age range where relevant).
- **Context of use** — device (mobile/desktop/both), environment, frequency,
  time pressure.
- **Accessibility needs** — assume a broad range; capture any specifics (low
  vision, motor, cognitive load, localization/RTL).
- **Sophistication** — novices need guidance and progressive disclosure; experts
  need speed, density, and shortcuts.

### Requirements & constraints
- **Core features / screens** the product needs.
- **Platform**: web, native mobile, responsive, PWA.
- **Content types**: text, media, data/tables, forms, real-time, long-form.
- **Constraints**: existing brand, tech stack, compliance, timeline, scope.

Output of Phase 2: a 3–6 line confirmed summary of goals, audience, requirements.

## Phase 3 — UX flow & user journey

Derive structure from the goals — not from aesthetics.

### 1. Map the primary user journey
Trace the happy path end to end:
`entry point → onboarding/auth (if any) → core task steps → success state → exit/return`.
For each stage note: the **user's intent**, what they **see**, the **action**
available, and the **decision points**. Add critical secondary flows (error
recovery, empty states, settings, upgrade) only where they matter to the goal.

### 2. Derive screens & states
List every **screen/view** the flows require. For each, capture the key states:
- **Empty** (no data yet), **loading**, **populated**, **error**, and
  **success/confirmation**.
Missing states are the most common UX gap — enumerate them explicitly.

### 3. Information hierarchy & navigation
- What is the **most important element** on each screen? Design around it.
- Choose a **navigation model**: top nav, sidebar, tab bar, wizard/stepper,
  single-page scroll — matched to platform and screen count.
- Define **progressive disclosure**: show the essential, defer the advanced.

### 4. Present & confirm
Deliver Phase 3 as: (a) a numbered **user journey**, and (b) a **screen list**
with each screen's purpose, primary action, and states. Get confirmation before
moving to the visual system (Phase 4).

## Heuristics to apply throughout
- One primary action per screen; make it obvious.
- Minimize steps to the goal; remove anything that doesn't serve it.
- Match the real-world mental model; use the audience's language.
- Design the unhappy paths (errors, empties, permissions) — not just the demo.
</content>
