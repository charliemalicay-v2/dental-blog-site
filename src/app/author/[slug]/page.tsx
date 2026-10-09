import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllAuthors, getAuthorBySlug, getPostsByAuthor } from "@/content";
import { PRACTICE, SITE } from "@/lib/constants";

type Props = PageProps<"/author/[slug]">;

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};

  return {
    title: `${author.name}, ${author.credentials}`,
    description: author.bio,
    alternates: { canonical: `/author/${author.slug}` },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const posts = getPostsByAuthor(author.slug);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    honorificSuffix: author.credentials,
    jobTitle: author.role,
    description: author.bio,
    url: `${SITE.url}/author/${author.slug}`,
    sameAs: author.sameAs,
    worksFor: {
      "@type": "Dentist",
      name: PRACTICE.name,
      url: PRACTICE.url,
      telephone: PRACTICE.phone,
    },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <JsonLd data={personJsonLd} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Authors", href: "/about" },
          {
            label: `${author.name}, ${author.credentials}`,
            href: `/author/${author.slug}`,
          },
        ]}
      />

      <header className="mt-8 grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
        <span
          aria-hidden="true"
          className="flex h-28 w-28 items-center justify-center rounded-full bg-navy font-display text-3xl font-bold text-white"
        >
          {author.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {author.role}
          </p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)]">
            {author.name}, {author.credentials}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{author.bio}</p>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={author.practiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid"
            >
              Visit the Practice
            </a>
            <a
              href={PRACTICE.phoneHref}
              className="btn-outline border-ink text-ink hover:bg-ink hover:text-white"
            >
              {PRACTICE.phone}
            </a>
          </div>
        </div>
      </header>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl md:text-3xl">
            Articles by {author.name.split(" ").slice(0, 2).join(" ")}
          </h2>
          <Link
            href="/blog"
            className="text-sm font-semibold uppercase tracking-[0.12em] text-link hover:text-brand"
          >
            All articles
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-8 text-muted">No articles published yet.</p>
        ) : (
          <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 90}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
