# Agent guide

This repository holds Lumi's public documentation site, served at [docs.lumi.nieve.ai](https://docs.lumi.nieve.ai). Lumi is Nieve Consulting's open-source AI concierge: visitors, prospective clients and job candidates use it to learn about a business and book meetings, and the business manages its knowledge and conversations in an admin interface.

The site is built with [Fumadocs](https://fumadocs.dev) on Next.js. Fumadocs' APIs may differ from your training data, so check its docs for the task at hand: [writing pages](https://fumadocs.dev/docs/next/markdown.md), [page conventions](https://fumadocs.dev/docs/next/page-conventions.md), [customizing the UI](https://fumadocs.dev/docs/next/guides/customize-ui.md), [theme](https://fumadocs.dev/docs/ui/theme.md), [upgrading](https://fumadocs.dev/docs/next/upgrade.md), and [every page](https://fumadocs.dev/llms.txt).

## Where pages live

- Each page is an MDX file under `content/docs/`. Its path is its URL: `content/docs/configuration/handoff.mdx` is served at `/configuration/handoff`, and a folder's `index.mdx` at the folder's path. The site serves docs from the root, not `/docs`.
- Sections are folders. Each folder's `meta.json` sets the section's sidebar title and the order of its pages; `content/docs/meta.json` orders the sections. Add a new page to its folder's `meta.json`.
- Every page has `title` and `description` frontmatter. The title is rendered as the page heading, so the body starts at `##` headings.
- Link to other pages with absolute site paths, for example `[Calendar booking](/configuration/handoff#calendar-booking)`. Heading anchors are GitHub-style slugs. `pnpm check:links` verifies every internal link and anchor.
- Lumi links to these pages and anchors from its error messages, `.env.example` comments, admin interface and READMEs, including in releases already installed, which keep those links after the docs change (`git -C ../lumi grep docs.lumi.nieve.ai` lists them). Don't move a page or rename a heading Lumi links to. When a heading must change, keep its old anchor with a custom id (`## New heading [#old-slug]`), and update the links in Lumi too.

## Writing pages

- Write for businesses and agencies evaluating, installing or running Lumi, in plain, direct English. Prefer short paragraphs, tables for settings and numbered steps for procedures.
- MDX is stricter than Markdown: escape `<`, `>`, `{` and `}` in prose (or put them in backticks), use `{/* comment */}` instead of HTML comments, and self-close void tags (`<br />`).
- Components available in every page without imports: `Callout` (`type="info" | "warn" | "error"`), `Cards` and `Card`, `Tabs` and `Tab` (`<Tabs items={['npm', 'pnpm']}>`), `Steps` and `Step`. Code blocks take a language and an optional `title="file name"`.
- Leave out pages for capabilities Lumi doesn't have yet rather than writing placeholders.

### Diagrams

Write diagrams as ` ```mermaid ` code blocks, not images, where a picture explains how pieces fit together better than prose: architecture, request flow, journeys, data flows.

- Give every diagram `accTitle:` and `accDescr:` lines, right after the diagram type line (`flowchart TD`, `sequenceDiagram`), so screen readers get a title and description.
- Introduce or follow every diagram with prose that states the same facts. Diagrams render in the browser, so search engines and readers without JavaScript only see the text.
- Don't style diagrams with `style`, `classDef` or `%%{init}%%` directives: the site themes them from its colours and follows light and dark mode. HTML and click handlers in labels are blocked.
- Keep diagrams narrow enough to read on a phone; prefer top-to-bottom flowcharts for long chains. Wide diagrams scroll within the page.
- `pnpm check:mermaid` parses every diagram and fails with the page named when one has a syntax error.

## Checking pages against Lumi's code

Pages must match Lumi's current code, not paraphrase older docs. Lumi's code lives in the public [`nieve-consulting/lumi`](https://github.com/nieve-consulting/lumi) repository on GitHub.

- Locally, use a sibling checkout (`../lumi`); in the cloud, clone `https://github.com/nieve-consulting/lumi.git`. The site's build and CI never need Lumi's code, so contributors can build and preview the site without it.
- Start from Lumi's `AGENTS.md` and the guide for each area (`frontend/AGENTS.md`, `backend/AGENTS.md`, `widget/AGENTS.md`), then read the code, configuration (`deploy/.env.example`), migrations and GraphQL schema behind each statement.
- When a page needs a change in Lumi as well (a wrong comment, a README link), open a pull request on Lumi for that part. When a Lumi change is user-facing, Lumi's agents open a companion pull request here.

## Keeping private material out

The docs are public. Never publish credentials, tokens, customer or visitor conversations, personal data, internal notes or details of Nieve's private infrastructure. Lumi's repository is public, so pages may link to its files on `main`, for example [`deploy/.env.example`](https://github.com/nieve-consulting/lumi/blob/main/deploy/.env.example), or name them in code formatting ("`deploy/.env.example` in Lumi's source"). Either way, explain on the page what the reader needs rather than sending them to the code. `pnpm check` doesn't verify links into Lumi's repository, so open them before handing off.

## Checks

Use pnpm. Before handing off, run `pnpm lint`, `pnpm types:check`, `pnpm check` (links and diagrams) and `pnpm build`. CI runs the same on every pull request, without secrets.

Use Conventional Commits (`type(scope): summary`), with the section as scope where it helps, for example `docs(configuration): Explain the setup token`.

## Licenses

Documentation content is [CC BY 4.0](LICENSE-docs); the site's source code and the code samples in pages are [MIT-0](LICENSE). Excerpts of Lumi's own source code stay under AGPL v3; prefer configuration, commands and original snippets over quoting it. Contributions are provided under the license of the part being changed.
