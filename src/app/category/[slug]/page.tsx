import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getAllCategories, getCategoryBySlug, getPostsByCategory } from "@/content";
import { PRACTICE } from "@/lib/constants";

type Props = PageProps<"/category/[slug]">;

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = getPostsByCategory(category.slug);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/category" },
          { label: category.name, href: `/category/${category.slug}` },
        ]}
      />

      <header className="mt-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Category
        </p>
        <h1 className="mt-3 text-[clamp(2.25rem,5vw,3.5rem)]">
          {category.name}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          {category.description}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-muted">
          No articles published in this category yet.
        </p>
      ) : (
        <div className="mt-14 grid gap-x-6 gap-y-14 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 90}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-16">
        <CtaBanner
          eyebrow="Need care, not just reading?"
          title={`Talk to a dentist about ${category.name.toLowerCase()}`}
          body="Bring your questions to a real appointment. The team at Shallowford Dental Studio can examine, diagnose, and build a plan for you."
          ctaLabel="Book a Visit"
          ctaHref={PRACTICE.url}
        />
      </div>
    </div>
  );
}
