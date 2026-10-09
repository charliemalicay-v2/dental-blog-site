import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { CtaBanner } from "@/components/layout/CtaBanner";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAllCategories, getAllPosts } from "@/content";
import { PRACTICE, SITE } from "@/lib/constants";

const TRUST = [
  {
    title: "Reviewed by a dentist",
    body: "Every article carries the name, credentials, and review date of the clinician who checked it.",
  },
  {
    title: "Cited to primary sources",
    body: "Clinical claims link back to the ADA, CDC, and peer-reviewed literature — no unsourced statistics.",
  },
  {
    title: "Local to Roswell, GA",
    body: "Guidance written for patients in Cobb and Fulton Counties, not generic national filler.",
  },
];

export default function HomePage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  const recent = rest.slice(0, 6);
  const categories = getAllCategories();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { "@type": "Organization", name: PRACTICE.name, url: PRACTICE.url },
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />

      <section className="relative overflow-hidden bg-navy text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.3fr_1fr] md:items-center md:py-24">
          <Reveal variant="up">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              <span aria-hidden className="inline-block h-[3px] w-8 bg-brand" />
              Roswell, GA · Cobb &amp; Fulton Counties
            </p>
            <h1 className="mt-5 text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] text-white">
              Dental answers you can actually trust
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              A resource library from Shallowford Dental Studio. Straightforward,
              cited guides on the questions patients ask us most — reviewed by
              our dentist before anything is published.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/blog" className="btn-solid">
                Browse the Guides
              </Link>
              <a
                href={PRACTICE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-white text-white hover:bg-white hover:text-navy"
              >
                Visit the Practice
              </a>
            </div>
          </Reveal>

          <Reveal variant="right" className="hidden md:block">
            <div className="border-l-[3px] border-brand pl-6">
              <p className="font-display text-2xl font-bold leading-tight">
                Built to point you to the right next step.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                We do not diagnose online. We explain the options clearly, cite
                the evidence, and connect you with the team at{" "}
                <a
                  href={PRACTICE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand underline underline-offset-2"
                >
                  Shallowford Dental Studio
                </a>{" "}
                when it is time for care.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {TRUST.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="border-t-[3px] border-teal pt-5">
                <h2 className="text-lg">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {featured && (
        <section className="mx-auto w-full max-w-6xl px-5 pb-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl md:text-3xl">Latest guide</h2>
            <Link
              href="/blog"
              className="text-sm font-semibold uppercase tracking-[0.12em] text-link hover:text-brand"
            >
              All articles
            </Link>
          </div>
          <div className="mt-8">
            <Reveal>
              <FeaturedPost post={featured} />
            </Reveal>
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
          <h2 className="text-2xl md:text-3xl">More from the library</h2>
          <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 90}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-6xl px-5 pb-4">
        <h2 className="text-2xl md:text-3xl">Browse by topic</h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="inline-flex border-[3px] border-line px-4 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:border-brand hover:text-brand"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12">
        <CtaBanner
          eyebrow="Shallowford Dental Studio"
          title="Questions about your own teeth?"
          body="Our resource library covers the general picture. For a diagnosis and a plan built around you, book a visit with Dr. Sedrakyan and the team."
          ctaLabel="Book a Visit"
          ctaHref={PRACTICE.url}
        />
      </div>
    </>
  );
}
