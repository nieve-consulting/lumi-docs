// Parses every ```mermaid block with Mermaid's own parser and fails with the
// page and line when a diagram has a syntax error, so broken diagrams never ship.
import { JSDOM } from 'jsdom';
import { readPages, scan } from './content.mjs';

// Mermaid expects a browser; parsing only needs a minimal DOM.
const { window } = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = window;
globalThis.document = window.document;
globalThis.DOMParser = window.DOMParser;
globalThis.Element = window.Element;
globalThis.HTMLElement = window.HTMLElement;
globalThis.SVGElement = window.SVGElement;

const { default: mermaid } = await import('mermaid');
mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });

let diagrams = 0;
const errors = [];
for (const page of await readPages()) {
  for (const block of scan(page.source).blocks.filter((b) => b.lang === 'mermaid')) {
    diagrams += 1;
    try {
      await mermaid.parse(block.code);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${page.file}:${block.line}: ${message.split('\n').slice(0, 4).join('\n  ')}`);
    }
    if (!/^\s*accTitle\s*:/m.test(block.code) || !/^\s*accDescr\s*[:{]/m.test(block.code)) {
      errors.push(`${page.file}:${block.line}: diagram needs accTitle and accDescr lines`);
    }
    if (/^\s*(style|classDef)\s|%%\{/m.test(block.code)) {
      errors.push(`${page.file}:${block.line}: remove style, classDef and init directives; the site themes diagrams`);
    }
  }
}

if (errors.length) {
  console.error(`Mermaid check failed:\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`Mermaid check passed: ${diagrams} diagrams parsed.`);
