// Checks every internal link (page and #anchor) in content/docs.
import GithubSlugger from 'github-slugger';
import { readPages, scan } from './content.mjs';

const pages = await readPages();

function plainHeading(text) {
  return text
    .replace(/\s*\[#[^\]]+\]\s*$/, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

const anchors = new Map();
for (const page of pages) {
  const slugger = new GithubSlugger();
  const ids = new Set();
  for (const { text } of scan(page.source).prose) {
    const heading = text.match(/^#{1,6}\s+(.*)$/);
    if (!heading) continue;
    const custom = heading[1].match(/\[#([^\]]+)\]\s*$/);
    ids.add(custom ? custom[1] : slugger.slug(plainHeading(heading[1])));
  }
  anchors.set(page.url, ids);
}

const errors = [];
let checked = 0;
for (const page of pages) {
  for (const { line, text } of scan(page.source).prose) {
    const prose = text.replace(/`[^`]*`/g, '');
    const targets = [
      ...[...prose.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((m) => m[1]),
      ...[...prose.matchAll(/href=["']([^"']+)["']/g)].map((m) => m[1]),
    ];
    for (const target of targets) {
      if (/^[a-z]+:/i.test(target)) continue;
      checked += 1;
      if (!target.startsWith('/') && !target.startsWith('#')) {
        errors.push(`${page.file}:${line}: use an absolute site path instead of ${target}`);
        continue;
      }
      const [pathPart, hash] = target.split('#');
      const url = pathPart === '' ? page.url : pathPart.replace(/\/$/, '') || '/';
      if (!anchors.has(url)) {
        errors.push(`${page.file}:${line}: no page at ${url}`);
      } else if (hash && !anchors.get(url).has(hash)) {
        errors.push(`${page.file}:${line}: no heading #${hash} on ${url}`);
      }
    }
  }
}

if (errors.length) {
  console.error(`Link check failed:\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`Link check passed: ${checked} internal links across ${pages.length} pages.`);
