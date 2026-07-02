# Categories & Output Format

## The category taxonomy

Pick **one** primary category. Add a secondary only when the request genuinely
spans two (e.g. code-change **+** documentation).

| Category | The user wants to… | Strong signals | Not this if… |
|---|---|---|---|
| **task** | Get an actionable, non-code thing done | "set up", "configure", "install", "deploy", "rename", "organize", ops/admin work | it's primarily editing source code (→ code-change) |
| **research** | Find, gather, compare, or understand information | "find", "look up", "compare", "what are the options", "investigate", URLs/topics to explore | it asks to change files or build something (→ task/code-change) |
| **code-change** | Create or modify code | "fix", "implement", "refactor", "add feature", "bug", file paths, function/class names, stack/framework names | it only asks about code conceptually with no change (→ chat) |
| **chat** | Talk, decide, brainstorm, or get an opinion | "should I", "what do you think", "explain", "help me decide", no concrete deliverable | it requests a produced artifact (→ other categories) |
| **documentation** | Write or update docs/comments/guides | "document", "write README", "add comments", "changelog", "docstring", "guide" | the doc is incidental to a code change (mark secondary) |
| **other** | Something outside the above | doesn't match any signal cleanly | one of the above clearly fits |

### Disambiguation tips
- **research vs task:** research *ends in knowledge*; task *ends in a change/action*.
- **code-change vs chat:** if a file would be edited, it's code-change; if only a
  question is answered, it's chat.
- **documentation vs code-change:** docs-only ⇒ documentation; docs alongside code
  ⇒ code-change (primary) + documentation (secondary).
- **task vs code-change:** touching source ⇒ code-change; environment/config/ops
  without editing app code ⇒ task.

## Context tags to capture

Alongside the category, record whatever applies:
- **domain** — web/frontend, backend, data, security, SEO, content, infra…
- **artifacts** — files, URLs, frameworks/tools named.
- **scope** — single file / module / whole project / external.
- **risk** — destructive or outward-facing? (deletes, deploys, sends, publishes)
- **suggested skill / next step** — the likely skill to route to (or `skill-router`).

## Classification output format

Emit a compact block (adapt fields that don't apply):

```
🏷️ Prompt triage
- type: <task | research | code-change | chat | documentation | other>[ + <secondary>]
- summary: <one concise sentence of what the user wants>
- context: <domain; artifacts; scope; risk if any>
- confidence: <high | medium | low>
- next: <suggested skill / action, e.g. "route via skill-router" or "proceed">
```

Keep it to these few lines — it's a label, not an essay. If clarifying questions
were asked, reflect the answers in `summary`/`context` before emitting.
