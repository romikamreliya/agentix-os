# Orchestration — running multiple skills

When a request needs more than one skill, sequence them deliberately.

## Order of operations

Most multi-skill work follows **gather → produce → review**:

1. **Gather / research** — inputs first. e.g. `firecrawl-search`,
   `firecrawl-scrape`, `firecrawl-research-papers`, `firecrawl-parse`.
2. **Produce / build** — create the deliverable. e.g. `frontend-design`,
   `motion-animations`, `content-strategy`, `dataviz`, `writing-plans`.
3. **Review / verify** — check the output. e.g. `code-review`, `security-review`,
   `web-design-guidelines`, `verify`.

Within each stage, respect real dependencies: a step that needs another's output
must run after it.

## Passing context between skills

- Carry forward the concrete artifact (scraped markdown, extracted JSON, a file
  path, the generated component) as the explicit input to the next skill.
- Summarize what the previous skill produced when invoking the next, so the next
  skill has what it needs without re-deriving it.
- Keep a running note of decisions so the final report can explain the chain.

## Sequential vs. parallel

- Skills invoked via the Skill tool run in the main thread — treat them as
  **sequential**. Order by dependency.
- Truly independent research tasks *may* be delegated to subagents **only if the
  user asked for subagents**; otherwise do them inline, one after another.

## Avoid loops and runaway chains

- **Never** invoke `skill-router` from inside a routed step — no recursion.
- Cap a chain to the skills that each add clear value; don't add a review skill
  if there's nothing meaningful to review.
- If a routed skill would itself want to route, stop and decide here instead.

## Handle unavailable or failing skills

- **Not installed:** if a needed skill isn't in the session list, don't fake it —
  report the gap and suggest `find-skills` to locate/install it.
- **Needs authorization:** some skills depend on MCP servers requiring auth. If
  it isn't authorized, say so and tell the user how to enable it; continue with
  whatever parts don't need it.
- **Fails or returns nothing useful:** fall back to doing that stage directly, or
  ask the user how to proceed — don't silently drop the deliverable.

## Report the routing

After the chain completes, state briefly:

- **Which skills ran**, in order.
- **Why** each was chosen (the signal that matched).
- **What each produced**, and the combined result.

Transparency lets the user correct a mis-route quickly (e.g. "use `simplify`, not
`code-review`").

## Example chains

- *"Scrape these 3 competitor pricing pages into a table and flag changes"* →
  `firecrawl-scrape` (or `firecrawl-competitive-intel`) → `dataviz`.
- *"Build a dashboard component with charts and animations, then review it"* →
  `dataviz` → `frontend-design` → `motion-animations` → `code-review`.
- *"Plan this refactor, implement it, and verify"* → `writing-plans` →
  (implementation) → `verify`.
