import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getAllCategories, getAllPosts } from "@/content";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Curated dental guides and reading paths for patients in Roswell, GA and the surrounding area.",
  alternates: { canonical: "/resources" },
};

/** Simple hub: featured reading paths across categories. */
export default function ResourcesPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  const paths = categories
    .map((category) => ({
      category,
      posts: posts.filter((p) => p.category === category.slug).slice(0, 3),
    }))
    .filter((p) => p.posts.length > 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          <span aria-hidden className="inline-block h-[3px] w-8 bg-brand" />
          Guides
        </p>
        <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">
          Reading paths, grouped by what you need
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Start with the topic that matches your question, then follow the
          related articles inside it.
        </p>
      </header>

      <div className="mt-14 space-y-16">
        {paths.map((path, i) => (
          <Reveal key={path.category.slug} delay={(i % 2) * 90}>
            <section className="border-t-[3px] border-teal pt-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="text-2xl md:text-3xl">{path.category.name}</h2>
                <Link
                  href={`/category/${path.category.slug}`}
                  className="text-sm font-semibold uppercase tracking-[0.12em] text-link hover:text-brand"
                >
                  View all
                </Link>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                {path.category.description}
              </p>
              <ul className="mt-6 space-y-4">
                {path.posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-display text-lg font-semibold text-ink hover:text-link"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {post.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
