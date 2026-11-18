# Lumi docs

The documentation for [Lumi](https://lumi.nieve.ai), Nieve Consulting's open-source AI concierge, published at **[docs.lumi.nieve.ai](https://docs.lumi.nieve.ai)**.

Lumi answers a business's visitors from its own knowledge, checks whether they're a fit and books a meeting or passes on an enquiry. These docs explain how Lumi works and how to install, configure and run it. Anyone can read them, and anyone can propose a fix or a new page.

[![Docs](https://img.shields.io/badge/docs-docs.lumi.nieve.ai-2563eb)](https://docs.lumi.nieve.ai)
[![Content: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-lightgrey)](LICENSE-docs)
[![Code: MIT-0](https://img.shields.io/badge/code-MIT--0-blue)](LICENSE)

## Working on the docs

You need Node.js (the version in `.nvmrc`) and [pnpm](https://pnpm.io). You don't need Lumi's source code to build or preview the site.

```sh
git clone https://github.com/nieve-consulting/lumi-docs.git
cd lumi-docs
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Pages are MDX files in [`content/docs`](content/docs) and reload as you edit them. [CONTRIBUTING.md](CONTRIBUTING.md) explains how pages, navigation and diagrams work and how to open a pull request.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Serves the site locally with reloading. |
| `pnpm check` | Checks internal links and parses every Mermaid diagram. |
| `pnpm lint` | Lints the site's source. |
| `pnpm types:check` | Type-checks the site's source and content. |
| `pnpm build` | Builds the production site, as the deployment does. |

## Licenses

- **Documentation content** (the pages in `content/docs`, their text and diagrams) is licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE-docs). You can share and adapt it, including commercially, as long as you credit Nieve Consulting and link to the license.
- **Code**: the site's source code and the code samples in pages (configuration, commands and snippets) are licensed under the [MIT No Attribution License (MIT-0)](LICENSE), so you can copy samples into your Lumi installation without attribution or license notices. Excerpts of Lumi's own source code quoted in pages stay under Lumi's license, AGPL v3.

Contributions are provided under the license of the part being changed, without transferring copyright.

## More

- [Contributing](CONTRIBUTING.md) and the [code of conduct](CODE_OF_CONDUCT.md)
- [Reporting a vulnerability](SECURITY.md) in Lumi or this site
- [Lumi's product site](https://lumi.nieve.ai), including Nieve's managed option
