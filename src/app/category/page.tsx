import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getAllCategories, getPostsByCategory } from "@/content";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse dental guides by topic — preventive care, implants, Invisalign, costs, and more.",
  alternates: { canonical: "/category" },
};

export default function CategoryIndexPage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          <span aria-hidden className="inline-block h-[3px] w-8 bg-brand" />
          Topics
        </p>
        <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">
          Browse the library by category
        </h1>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const count = getPostsByCategory(cat.slug).length;
          return (
            <Reveal key={cat.slug} delay={(i % 3) * 90}>
              <Link
                href={`/category/${cat.slug}`}
                className="group flex h-full flex-col border border-line border-t-[3px] border-t-teal p-6 transition-shadow hover:shadow-lg"
              >
                <h2 className="text-lg group-hover:text-link">{cat.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {cat.description}
                </p>
                <span className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-ink">
                  {count} {count === 1 ? "article" : "articles"}
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
