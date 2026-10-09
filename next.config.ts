import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow .mdx files to be imported as modules.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: {
    // Pin the workspace root so lockfiles outside the repo are ignored.
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  // Turbopack requires remark/rehype plugins to be passed as strings.
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
