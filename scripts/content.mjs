// Shared helpers for the content checks: read every page and walk its lines
// outside fenced code blocks.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export const contentDir = path.join(process.cwd(), 'content/docs');

export async function readPages() {
  const files = (await readdir(contentDir, { recursive: true })).filter((file) =>
    file.endsWith('.mdx'),
  );
  return Promise.all(
    files.sort().map(async (file) => ({
      file: path.join('content/docs', file),
      url: toUrl(file),
      source: await readFile(path.join(contentDir, file), 'utf8'),
    })),
  );
}

// content/docs/configuration/index.mdx → /configuration
function toUrl(file) {
  const slug = file
    .replace(/\.mdx$/, '')
    .split(path.sep)
    .filter((part, i, parts) => !(part === 'index' && i === parts.length - 1))
    .join('/');
  return `/${slug}`;
}

/** Splits a page into fenced code blocks and the lines outside them. */
export function scan(source) {
  const lines = source.split('\n');
  const blocks = [];
  const prose = [];
  let fence = null;
  lines.forEach((text, index) => {
    const line = index + 1;
    const marker = text.match(/^\s*(`{3,}|~{3,})\s*([\w-]*)/);
    if (!fence && marker) {
      fence = { marker: marker[1], lang: marker[2], line, body: [] };
    } else if (fence && text.trim().startsWith(fence.marker)) {
      blocks.push({ lang: fence.lang, line: fence.line, code: fence.body.join('\n') });
      fence = null;
    } else if (fence) {
      fence.body.push(text);
    } else {
      prose.push({ line, text });
    }
  });
  return { blocks, prose };
}
