import { gitConfig } from '@/lib/shared';

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t pt-6 text-sm text-fd-muted-foreground">
      <p>
        © Nieve Consulting. Documentation licensed under{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          className="underline underline-offset-2 hover:text-fd-foreground"
          rel="license"
        >
          CC BY 4.0
        </a>
        ; code samples and site source under{' '}
        <a
          href="https://opensource.org/license/mit-0"
          className="underline underline-offset-2 hover:text-fd-foreground"
        >
          MIT-0
        </a>
        .{' '}
        <a
          href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
          className="underline underline-offset-2 hover:text-fd-foreground"
        >
          Improve this site on GitHub
        </a>
        .
      </p>
    </footer>
  );
}
