import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Lumi docs';
export const siteUrl = 'https://docs.lumi.nieve.ai';
export const productUrl = 'https://lumi.nieve.ai';
// Docs are served from the site's root: /self-hosting, not /docs/self-hosting
export const docsRoute = '/';
export const docsImageRoute = '/og';

export const gitConfig = {
  user: 'nieve-consulting',
  repo: 'lumi-docs',
  branch: 'main',
};

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
