import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred } from 'fumadocs-core/negotiation';

// Agents that prefer Markdown get a page's Markdown at its usual URL.
// Files like `/self-hosting.md` are served by the rewrites of the Next.js config.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isMarkdownPreferred(request) || /\.(md|txt)$/.test(pathname)) return NextResponse.next();

  const markdownPath = pathname === '/' ? '/index.md' : `${pathname.replace(/\/$/, '')}.md`;
  return NextResponse.rewrite(new URL(`/llms.mdx${markdownPath}`, request.nextUrl), {
    // this URL has two representations, selected by `Accept`
    headers: { Vary: 'Accept' },
  });
}

export const config = {
  // pages only: not API routes, Next.js assets, OG images or static files
  matcher: ['/((?!api|_next|og|llms|.*\\.[a-z0-9]+$).*)'],
};
