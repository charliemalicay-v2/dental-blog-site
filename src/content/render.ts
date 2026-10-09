import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import type { PostFrontmatter } from "@/types";

/**
 * Lazily import an MDX post body by slug.
 *
 * The template literal tells Turbopack/webpack to build a module context over
 * `content/posts/*.mdx`, so any post file resolves at build time. A missing
 * file throws, which we translate to a 404.
 */
export async function loadMdxPost(
  slug: string,
): Promise<ComponentType<Record<string, never>>> {
  try {
    const mod = await import(
      /* webpackInclude: /\.mdx$/ */ `@content/posts/${slug}.mdx`
    );
    return mod.default;
  } catch {
    notFound();
  }
}

/** Narrow the frontmatter a page receives once the file is confirmed present. */
export function assertPost(
  post: PostFrontmatter | undefined,
): PostFrontmatter {
  if (!post) notFound();
  return post;
}
