# Matching Guide — request → skill

How to pick the right skill(s) for a request. The goal: high precision (don't
fire the wrong skill) with good recall (don't miss an obviously-applicable one).

## 1. Parse the request into signals

Extract:

- **Intent / action verb** — build, animate, review, research, scrape, audit,
  summarize, plan, deploy, monitor, extract, design, write…
- **Deliverable(s)** — a component, a report, a JSON dataset, a landing page, an
  audit, a plan, a PR review. Multiple deliverables ⇒ likely multiple skills.
- **Domain** — web/frontend, SEO, data viz, security, docs, scraping, content.
- **Artifacts** — file types (`.pdf`, `.html`, `.tsx`), URLs, framework names
  (React, Vue), tools named (Motion, Firecrawl, Tailwind).
- **Constraints** — "without a build step", "accessible", "as JSON", budget, etc.
- **Explicit skill mention** — if the user already named a skill, honor it and
  skip routing (just run it).

## 2. Read each skill's description as a routing record

Every skill description encodes three things — match against all three:

1. **What** it does (capability).
2. **When** to use it (situations).
3. **Trigger phrases** the user might say.

A request that contains a skill's trigger phrase or clearly matches its
"when" is a strong candidate.

## 3. Score candidates

Rank by strength of evidence:

| Signal | Weight |
|---|---|
| User named the skill, or used an exact trigger phrase | **Strongest** — route directly |
| Deliverable + domain both match the skill's purpose | Strong |
| Domain matches but deliverable is generic | Medium |
| Only a loose/thematic association | Weak — usually don't route |

Set a **confidence threshold**: route to a skill only when evidence is Strong or
better. If the top candidate is only Weak, prefer doing the task directly.

## 4. Specificity rule (break ties by narrowness)

- Prefer the **most specific** skill over a general one. Example: for extracting
  structured company data, `firecrawl-company-directories` beats generic
  `firecrawl-scrape`.
- Prefer a **directory-scoped** variant (e.g. `apps/web:deploy`) over the
  unscoped one **when the files in play live under that directory**.
- Prefer a **purpose-built workflow** skill over composing primitives, when it
  matches the deliverable exactly.

## 5. Disambiguate common overlaps

Use the distinguishing question, not just keywords:

| If the request is about… | Choose | Not |
|---|---|---|
| One known URL's content | `firecrawl-scrape` | `firecrawl-crawl` |
| Many pages under a site/section | `firecrawl-crawl` | `firecrawl-scrape` |
| Finding *which* URL on a site | `firecrawl-map` | `firecrawl-scrape` |
| Structured data as JSON w/ schema | `firecrawl-agent` / directories | `firecrawl-scrape` |
| Bugs & correctness in a diff | `code-review` | `simplify` |
| Cleanup/readability only (no bug hunt) | `simplify` | `code-review` |
| Security vulnerabilities in changes | `security-review` | `code-review` |
| Deciding *what* content to make | `content-strategy` | `seo-audit` |
| Diagnosing why a site won't rank | `seo-audit` | `content-strategy` |
| Adding animations | `motion-animations` | `frontend-design` |
| Overall UI look & build | `frontend-design` | `motion-animations` |
| Checking UI against a11y/UX rules | `web-design-guidelines` | `frontend-design` |

When two still tie and the choice materially changes the output, ask **one**
concise question; otherwise pick the more specific and proceed.

## 6. When NOT to route to a skill

- The task is trivial and a skill would add overhead.
- Nothing clears the confidence threshold — do it directly.
- The user explicitly asked not to use a skill.
- The only match is `skill-router` itself (never route to self).

## 7. Detect multi-skill requests

A single sentence can carry several deliverables:

- *"Research competitors and build a comparison page"* → a research/scrape skill
  **then** `frontend-design`.
- *"Write the landing page and check accessibility"* → `frontend-design` **then**
  `web-design-guidelines`.

When you spot ≥2 deliverables, hand off to `references/orchestration.md` to order
and chain them.
