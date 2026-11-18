# Contributing to Lumi's docs

Fixes, clarifications and new pages are welcome, from a typo to a guide for a setup you've run. You don't need Lumi's source code: the site builds and previews without it.

## Proposing a change

For a small fix, open a pull request directly. For a new page or a larger change, open an issue first describing who the page is for and what they need to achieve, so maintainers can check it fits the docs' structure.

Use fictional examples. Never include credentials, real conversations or personal data, or private business material. Report vulnerabilities as [SECURITY.md](SECURITY.md) describes, not in an issue.

## Setting up

You need Node.js (the version in `.nvmrc`) and [pnpm](https://pnpm.io).

```sh
git clone https://github.com/<your-account>/lumi-docs.git
cd lumi-docs
pnpm install
pnpm dev
```

Fork the repository first, then clone your fork. `pnpm dev` serves the site at [http://localhost:3000](http://localhost:3000) and reloads as you edit.

## Pages and navigation

- Each page is an MDX file in `content/docs`. Its path is its URL: `content/docs/configuration/handoff.mdx` is served at `/configuration/handoff`, and a folder's `index.mdx` at the folder's path.
- Every page starts with frontmatter:

  ```mdx
  ---
  title: Qualification, booking and enquiries
  description: How Lumi checks a visitor's fit and hands them to your team.
  ---
  ```

  The title is shown as the page heading, so start the body with `##` headings.
- Each folder is a sidebar section. Its `meta.json` sets the section's title and the order of its pages; `content/docs/meta.json` orders the sections. Add a new page to its folder's `meta.json`.
- Link to other pages with absolute paths, for example `[Calendar booking](/configuration/handoff#calendar-booking)`.
- MDX is stricter than Markdown: write `<`, `>`, `{` and `}` in backticks or escape them, and use `{/* comment */}` instead of HTML comments.
- Callouts, cards, tabs and steps are available in every page. See the [Fumadocs Markdown guide](https://fumadocs.dev/docs/next/markdown).

Pages describe what Lumi does today. Leave out capabilities that aren't built yet rather than writing placeholders.

## Diagrams

Diagrams are [Mermaid](https://mermaid.js.org) code blocks in the page, not images, so anyone can fix one in a text editor and reviewers see the change as a diff.

1. Add a `mermaid` code block where a picture explains how pieces fit together:

   ````mdx
   ```mermaid
   flowchart TD
     accTitle: Handoff delivery
     accDescr: A qualified visitor's details go to email and, if configured, a webhook.
     Visitor[Qualified visitor] --> Email[Email to the team]
     Visitor --> Webhook[Webhook]
   ```
   ````

2. Put `accTitle` and `accDescr` right after the diagram type line, so screen readers get a title and description.
3. Write prose before or after the diagram that states the same facts. Diagrams render in the browser, so readers without JavaScript and search engines only see the text.
4. Don't add colours or styles (`style`, `classDef`, `%%{init}%%`): the site themes diagrams and switches them with light and dark mode.
5. Preview the page with `pnpm dev`, in light and dark mode and at phone width, then run `pnpm check:mermaid`. It parses every diagram and names the page and line of any syntax error. The [Mermaid Live Editor](https://mermaid.live) helps while drafting.

## Checks

Run these before opening a pull request; CI runs the same on every pull request:

```sh
pnpm lint
pnpm types:check
pnpm check
pnpm build
```

`pnpm check` verifies every internal link and heading anchor and parses every diagram.

## Pull requests

Open a pull request against `main` describing what changed and why. Each pull request gets a preview deployment, linked from the pull request, where you and reviewers can read the result; for pull requests from forks, a maintainer approves the preview build first. Once merged, the change is live at [docs.lumi.nieve.ai](https://docs.lumi.nieve.ai) within minutes, independently of Lumi's releases.

Use [Conventional Commits](https://www.conventionalcommits.org) for the pull request title, for example `docs(configuration): explain the setup token` or `fix: repair the search shortcut`.

## Licensing

Documentation content is licensed under [CC BY 4.0](LICENSE-docs); the site's source code and code samples in pages under [MIT-0](LICENSE). Excerpts of Lumi's own source code stay under AGPL v3. Contributions are provided under the license of the part being changed. Submit only material you have the right to contribute, and identify third-party material and its license. Contributing does not transfer your copyright to Nieve.

Everyone taking part follows the [code of conduct](CODE_OF_CONDUCT.md).
