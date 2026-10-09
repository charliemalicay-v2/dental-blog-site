import type { MDXComponents } from "mdx/types";

/**
 * Global MDX component mapping.
 * Next.js requires this file when using @next/mdx.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Anchor headings get an id so in-article links and TOCs resolve.
    a: (props) => <a {...props} />,
    ...components,
  };
}
