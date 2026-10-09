import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { CitationList } from "@/components/blog/CitationList";
import { ReviewBadge } from "@/components/blog/ReviewBadge";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getAllSlugs,
  getAuthorBySlug,
  getCategoryBySlug,
  getPostBySlug,
  getRelatedPosts,
} from "@/content";
import { loadMdxPost } from "@/content/render";
import { DISCLAIMER, PRACTICE, SITE } from "@/lib/constants";

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

type Props = PageProps<"/blog/[slug]">;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      url: `${SITE.url}/blog/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const MdxBody = await loadMdxPost(post.slug);
  const author = getAuthorBySlug(post.author);
  const category = getCategoryBySlug(post.category);
  const related = getRelatedPosts(post.slug, post.category, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${post.slug}`,
    },
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          honorificSuffix: author.credentials,
          jobTitle: author.role,
          url: `${SITE.url}/author/${author.slug}`,
        }
      : undefined,
    reviewedBy: {
      "@type": "Person",
      name: post.clinicalReview.reviewer,
      honorificSuffix: post.clinicalReview.credentials,
    },
    publisher: {
      "@type": "Organization",
      name: PRACTICE.name,
      url: PRACTICE.url,
    },
    citation: post.sources.map((s) => s.url),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE.url}/blog/${post.slug}` },
    ],
  };

  return (
    <article>
      <JsonLd data={[articleJsonLd, breadcrumbJsonLd]} />

      <div className="mx-auto w-full max-w-3xl px-5 pt-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />
      </div>

      <header className="mx-auto w-full max-w-3xl px-5 pt-8">
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-teal transition-colors hover:text-link"
          >
            {category.name}
          </Link>
        )}

        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] leading-tight">
          {post.title}
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-muted">
          {post.description}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-4 text-sm">
          {author && (
            <span className="font-display font-semibold text-ink">
              By {author.name}, {author.credentials}
            </span>
          )}
          <span className="text-muted">
            Published{" "}
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", DATE_OPTS)}
            </time>
          </span>
          {post.updatedAt !== post.publishedAt && (
            <span className="text-muted">
              Updated{" "}
              <time dateTime={post.updatedAt}>
                {new Date(post.updatedAt).toLocaleDateString("en-US", DATE_OPTS)}
              </time>
            </span>
          )}
        </div>
      </header>

      <div className="mx-auto mt-8 w-full max-w-3xl px-5">
        <div className="relative mb-10 w-full overflow-hidden bg-placeholder pb-[56%]">
          {post.heroImage?.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.heroImage.src}
              alt={post.heroImage.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-navy/90">
              <span className="watermark text-center text-[clamp(1.75rem,5vw,3rem)]">
                {category?.name ?? "Dental"}
              </span>
            </div>
          )}
        </div>

        <ReviewBadge review={post.clinicalReview} />

        <div className="prose-dental mt-10">
          <MdxBody />
        </div>

        <aside
          role="note"
          className="mt-12 border-l-[3px] border-brand bg-surface px-5 py-4 text-sm leading-relaxed text-muted"
        >
          <strong className="text-ink">Medical disclaimer.</strong> {DISCLAIMER}
        </aside>

        <div className="mt-8 border-t border-line pt-6">
          <a
            href={post.relatedToPractice.servicePageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-semibold text-link underline underline-offset-4 hover:text-brand"
          >
            {post.relatedToPractice.anchorText}
          </a>
        </div>

        <CitationList sources={post.sources} />
      </div>

      <CtaBanner
        eyebrow="From the practice"
        title="Ready to talk to a dentist in Roswell?"
        body="This guide is general information. For advice about your own teeth, book a visit with the team at Shallowford Dental Studio."
        ctaLabel="Book a Visit"
        ctaHref={PRACTICE.url}
      />

      {related.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl">Keep reading</h2>
          <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 90}>
                <BlogCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
