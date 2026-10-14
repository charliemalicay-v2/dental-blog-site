import Link from "next/link";
import { getAuthorBySlug, getCategoryBySlug } from "@/content";
import type { PostFrontmatter } from "@/types";

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

/**
 * Sticky lead article above the blog grid: 2fr/1fr split with a teal top rule
 * and a larger display title, per the source site's featured block.
 */
export function FeaturedPost({ post }: { post: PostFrontmatter }) {
  const author = getAuthorBySlug(post.author);
  const category = getCategoryBySlug(post.category);
  const date = new Date(post.publishedAt);

  return (
    <article className="group border-t-[3px] border-teal pt-6 lg:pt-8">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8">
        <div className="order-2 lg:order-1">
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-teal transition-colors hover:text-link"
            >
              {category.name}
            </Link>
          )}

          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.375rem)] leading-tight">
            <Link
              href={`/blog/${post.slug}`}
              className="transition-colors group-hover:text-link"
            >
              {post.title}
            </Link>
          </h2>

          <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
            {post.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-base font-semibold uppercase tracking-[0.12em] text-ink">
            {author && <span>{author.name}</span>}
            <span aria-hidden className="text-placeholder">
              /
            </span>
            <time dateTime={post.publishedAt} className="text-muted">
              {date.toLocaleDateString("en-US", DATE_OPTS)}
            </time>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="btn-solid mt-6"
            tabIndex={-1}
            aria-hidden="true"
          >
            Read the Guide
          </Link>
        </div>

        <div className="order-1 lg:order-2">
          <Link href={`/blog/${post.slug}`} className="block" tabIndex={-1} aria-hidden="true">
            <div className="relative w-full overflow-hidden bg-placeholder pb-[65%] lg:pb-0 lg:h-full lg:min-h-[260px]">
              {post.heroImage?.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.heroImage.src}
                  alt={post.heroImage.alt}
                  loading="eager"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-navy/90">
                  <span className="watermark px-4 text-center text-[clamp(1.5rem,4vw,2.5rem)] leading-tight">
                    {category?.name ?? "Dental"}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}
