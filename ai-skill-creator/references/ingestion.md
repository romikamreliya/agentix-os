# Ingestion Guide

How to read every kind of source material the user provides before designing a
skill. **Gather everything first, then synthesize** — do not start designing the
target skill until all inputs have been ingested.

All firecrawl capabilities are **skills**, invoked through the **Skill** tool.
Delegate to them rather than writing scraping or parsing code yourself.

## Routing table

| Input type | Preferred reader | Fallback |
|---|---|---|
| Website URL (single page) | `firecrawl-scrape` skill | `WebFetch` |
| Need to discover pages / search the web | `firecrawl-search` skill | `WebSearch` |
| Whole site / section (many pages) | `firecrawl-crawl` skill | scrape each URL |
| Local PDF | `firecrawl-parse` skill | — |
| Local DOCX / DOC / ODT / RTF | `firecrawl-parse` skill | — |
| Local XLSX / XLS / HTML file | `firecrawl-parse` skill | `Read` |
| Local plain text / Markdown (`.txt`, `.md`) | `Read` | — |
| Inline text pasted by the user | use directly | — |
| Structured data from a site (JSON) | `firecrawl-agent` skill | scrape + parse |

Key distinction: **remote pages → firecrawl-scrape**, **local files →
firecrawl-parse**. `firecrawl-parse` converts local documents (PDF/DOCX/etc.)
into clean Markdown on disk; use it for anything with a local file path.

## Procedure

1. **Classify** each input (URL, local doc, local text, inline text).
2. **Ingest** each via the reader above; save or note the extracted Markdown.
3. **Note provenance** — track which fact came from which source so the
   CHANGELOG can cite the driving input on updates.
4. **Consolidate** the material, then move to synthesis (Workflow A, step 3).

## Notes

- If a `firecrawl-*` skill is not installed, fall back to the built-in tool in
  the table (`WebFetch`, `WebSearch`, `Read`). `firecrawl-parse` has no built-in
  equivalent for binary documents — if it is unavailable, tell the user the PDF/
  DOCX cannot be read and ask for a text export.
- For large or many-page sources, summarize as you ingest rather than pasting
  everything, to keep the working context focused.
- Respect the user's authorization: only scrape/crawl sources they asked you to.
