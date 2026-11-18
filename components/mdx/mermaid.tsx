'use client';

import { type CSSProperties, use, useId, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import type { MermaidConfig } from 'mermaid';

// Lumi's accent colours, matching `--color-fd-primary` in app/global.css.
// Mermaid's theme engine needs concrete colours rather than CSS variables.
const themes: Record<'light' | 'dark', MermaidConfig['themeVariables']> = {
  light: {
    background: '#ffffff',
    primaryColor: '#eff6ff',
    primaryBorderColor: '#2563eb',
    primaryTextColor: '#0f172a',
    secondaryColor: '#f1f5f9',
    secondaryBorderColor: '#94a3b8',
    secondaryTextColor: '#0f172a',
    tertiaryColor: '#f8fafc',
    tertiaryBorderColor: '#cbd5e1',
    tertiaryTextColor: '#0f172a',
    lineColor: '#64748b',
    textColor: '#0f172a',
    noteBkgColor: '#fefce8',
    noteBorderColor: '#ca8a04',
    noteTextColor: '#0f172a',
    actorBkg: '#eff6ff',
    actorBorder: '#2563eb',
    actorTextColor: '#0f172a',
    actorLineColor: '#94a3b8',
    signalColor: '#334155',
    signalTextColor: '#0f172a',
    labelBoxBkgColor: '#eff6ff',
    labelBoxBorderColor: '#2563eb',
    labelTextColor: '#0f172a',
    loopTextColor: '#0f172a',
    activationBkgColor: '#dbeafe',
    activationBorderColor: '#2563eb',
    clusterBkg: '#f8fafc',
    clusterBorder: '#cbd5e1',
    edgeLabelBackground: '#ffffff',
  },
  dark: {
    background: '#0a0a0a',
    primaryColor: '#172554',
    primaryBorderColor: '#3b82f6',
    primaryTextColor: '#e2e8f0',
    secondaryColor: '#1e293b',
    secondaryBorderColor: '#64748b',
    secondaryTextColor: '#e2e8f0',
    tertiaryColor: '#111827',
    tertiaryBorderColor: '#334155',
    tertiaryTextColor: '#e2e8f0',
    lineColor: '#94a3b8',
    textColor: '#e2e8f0',
    noteBkgColor: '#422006',
    noteBorderColor: '#ca8a04',
    noteTextColor: '#fef9c3',
    actorBkg: '#172554',
    actorBorder: '#3b82f6',
    actorTextColor: '#e2e8f0',
    actorLineColor: '#64748b',
    signalColor: '#cbd5e1',
    signalTextColor: '#e2e8f0',
    labelBoxBkgColor: '#172554',
    labelBoxBorderColor: '#3b82f6',
    labelTextColor: '#e2e8f0',
    loopTextColor: '#e2e8f0',
    activationBkgColor: '#1e3a8a',
    activationBorderColor: '#3b82f6',
    clusterBkg: '#111827',
    clusterBorder: '#334155',
    edgeLabelBackground: '#0a0a0a',
  },
};

// Narrowest width a wide diagram shrinks to before it scrolls sideways
const MIN_READABLE_WIDTH = 560;

type RenderResult = { svg: string } | { error: string };

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(key: string, create: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;
  const promise = create();
  cache.set(key, promise);
  return promise;
}

/**
 * Renders a ```mermaid code block. Mermaid is imported on first use, so only
 * pages with a diagram load it, and diagrams re-render when the theme changes.
 */
export function Mermaid({ chart }: { chart: string }) {
  // `false` on the server and during hydration
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient) return <div className="my-6 min-h-24" aria-hidden />;
  return <MermaidContent chart={chart} />;
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId().replaceAll(':', '');
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';
  const source = chart.replaceAll('\\n', '\n');

  const result = use(
    cachePromise<RenderResult>(`${mode}:${source}`, async () => {
      const { default: mermaid } = await import('mermaid');
      mermaid.initialize({
        startOnLoad: false,
        // Pages accept outside contributions: keep HTML and click handlers out of labels.
        securityLevel: 'strict',
        fontFamily: 'inherit',
        theme: 'base',
        themeVariables: themes[mode],
      });
      try {
        const { svg } = await mermaid.render(`mermaid-${id}-${mode}`, source);
        return { svg };
      } catch (error) {
        return { error: error instanceof Error ? error.message : String(error) };
      }
    }),
  );

  if ('error' in result) {
    return (
      <div className="my-6 rounded-lg border border-fd-error/50 p-4 text-sm">
        <p className="font-medium text-fd-error">This diagram couldn&apos;t be rendered.</p>
        <pre className="mt-2 overflow-x-auto whitespace-pre text-xs">{source}</pre>
      </div>
    );
  }

  // Mermaid scales diagrams down to fit. On a phone, keep wide diagrams readable
  // and let them scroll within the page instead of shrinking the text.
  const naturalWidth = Number(result.svg.match(/max-width:\s*([\d.]+)px/)?.[1] ?? 0);
  const minWidth = Math.min(naturalWidth, MIN_READABLE_WIDTH);

  return (
    <div
      className="my-6 flex overflow-x-auto [&>svg]:mx-auto [&>svg]:h-auto [&>svg]:min-w-(--diagram-min-width)"
      style={{ '--diagram-min-width': `${minWidth}px` } as CSSProperties}
      dangerouslySetInnerHTML={{ __html: result.svg }}
    />
  );
}
