import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { gitConfig, productUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image src="/lumi-pebble-icon.webp" alt="" width={24} height={24} priority />
          <span className="font-semibold">Lumi</span>
        </>
      ),
      url: '/',
    },
    links: [{ text: 'Product site', url: productUrl, external: true }],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
