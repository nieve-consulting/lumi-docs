import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // `/self-hosting.md` serves the page's Markdown; the route itself lives under /llms.mdx
      {
        source: '/:path((?!llms\\.mdx/).+)\\.md',
        destination: '/llms.mdx/:path.md',
      },
    ];
  },
};

export default withMDX(config);
