import Link from "next/link";
import { getAuthorBySlug, getCategoryBySlug } from "@/content";
import type { PostFrontmatter } from "@/types";

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

/**
 * Grid article card. Uses a 102% aspect-ratio placeholder on #ccc when no
 * licensed image is supplied, matching the source site's thumbnail box.
 */
export function BlogCard({ post }: { post: PostFrontmatter }) {
  const author = getAuthorBySlug(post.author);
  const category = getCategoryBySlug(post.category);
  const date = new Date(post.publishedAt);

  return (
    <article className="group flex flex-col">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative w-full overflow-hidden bg-placeholder pb-[102%]">
          {post.heroImage?.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.heroImage.src}
              alt={post.heroImage.alt}
              loading="lazy"
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

      {category && (
        <Link
          href={`/category/${category.slug}`}
          className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-teal transition-colors hover:text-link"
        >
          {category.name}
        </Link>
      )}

      <h3 className="mt-2 text-lg leading-[1.2] capitalize md:text-xl">
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors group-hover:text-link"
        >
          {post.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {post.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-base font-semibold uppercase tracking-[0.12em] text-ink">
        {author && <span>{author.name}</span>}
        <span aria-hidden className="text-placeholder">
          /
        </span>
        <time dateTime={post.publishedAt} className="text-muted">
          {date.toLocaleDateString("en-US", DATE_OPTS)}
        </time>
      </div>
    </article>
  );
}
