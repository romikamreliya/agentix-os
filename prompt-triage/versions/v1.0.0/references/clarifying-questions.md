# Clarifying Questions

Ask questions **only** when the answer would change what you do. A prompt that
can be handled with a stated assumption should be handled, not interrogated.

## When a prompt needs clarification

Trigger clarification if any of these is missing or contradictory:

- **Goal** — what outcome does the user actually want?
- **Target** — which file / component / system / data does it apply to?
- **Scope** — how much: one spot, a module, the whole project, external?
- **Acceptance** — what does "done" look like; any constraints or format?
- **Conflicts** — the prompt contradicts itself or the visible context.
- **Multiple readings** — it splits into materially different interpretations.

If none apply, skip questions: state any minor assumption inline and proceed.

## How to ask (use the `AskUserQuestion` tool)

Each clarifying question **must offer suggested options and an Other choice**.
The `AskUserQuestion` tool renders 2–4 options and **adds "Other" automatically**
(free-text), so you don't add an Other option yourself.

Guidelines:
- Ask **1–4 questions max**; each must be decision-changing.
- Give **2–4 concrete options** per question; make them distinct and mutually
  exclusive (unless the choice allows several — then set `multiSelect: true`).
- If you have a recommendation, list it **first** and label it "(Recommended)".
- Keep each question to one decision; use a short `header` chip (≤12 chars).
- Don't ask what you can infer from the code, files, or sensible defaults.

## Examples

**Ambiguous target + scope**
> Q: "Which part of the app should the fix apply to?"
> Options: `Login page only` · `All auth flows` · `Entire project`
> (+ Other) — `header: Scope`

**Underspecified deliverable**
> Q: "What output do you want?"
> Options: `A written summary` · `Code changes` · `A plan first`
> (+ Other) — `header: Deliverable`

**Multiple valid interpretations**
> Q: "By 'clean up', do you mean…?"
> Options: `Remove dead code` · `Reformat/style` · `Refactor for clarity`
> (+ Other, multiSelect) — `header: Cleanup type`

## After asking

- Fold every answer (including any Other free-text) into the prompt's `summary`
  and `context`.
- Re-check clarity; if a critical gap remains, ask one more focused round — but
  avoid endless back-and-forth. When enough is known, emit the classification
  block and proceed.
