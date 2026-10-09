import type { Metadata } from "next";
import Link from "next/link";
import { getAllAuthors } from "@/content";
import { PRACTICE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About This Resource",
  description:
    "How the Shallowford Dental resource library is written, reviewed, and connected to Shallowford Dental Studio in Roswell, GA.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const authors = getAllAuthors();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 md:py-20">
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        <span aria-hidden className="inline-block h-[3px] w-8 bg-brand" />
        About
      </p>
      <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">
        Why this site exists
      </h1>

      <div className="prose-dental mt-8">
        <p>
          Most dental questions start the same way: a search engine, a late-night
          worry, a bill that does not make sense. This library is our attempt to
          answer those questions honestly — with context, cited evidence, and a
          straight answer about when you need a real appointment.
        </p>

        <p>
          This site is published in connection with{" "}
          <a href={PRACTICE.url} target="_blank" rel="noopener noreferrer">
            {PRACTICE.name}
          </a>
          , a dental practice in Roswell, Georgia. It is an informational
          resource, not a replacement for the practice website, and it does not
          provide diagnosis or treatment.
        </p>

        <h2>How articles are made</h2>
        <p>
          Every article follows the same pipeline before it can be published:
        </p>
        <ol>
          <li>Research from primary dental and public-health sources.</li>
          <li>A drafted, plain-language explanation of the topic.</li>
          <li>Clinical review by a licensed dentist for accuracy and safety.</li>
          <li>An editing pass for readability and tone.</li>
          <li>Citations attached to every clinical claim.</li>
          <li>A legal and disclaimer review before publishing.</li>
        </ol>
        <p>
          A post cannot go live without a named reviewer and at least one
          supporting source. Automated checks block anything missing either.
        </p>

        <h2>Our review standard</h2>
        <p>
          Dental guidance changes. We re-review published articles on a
          twelve-month cycle and show an &ldquo;updated&rdquo; date whenever the
          content changes. If a recommendation is superseded, we fix it rather
          than leave it to age.
        </p>

        <h2>What we will not do</h2>
        <ul>
          <li>Diagnose your condition from a web page.</li>
          <li>Promise a specific outcome or price.</li>
          <li>Publish a clinical claim without a source.</li>
          <li>Publish without a dentist&rsquo;s review.</li>
        </ul>
      </div>

      {authors.length > 0 && (
        <section className="mt-14 border-t border-line pt-8">
          <h2 className="text-2xl">Who writes here</h2>
          <ul className="mt-6 space-y-4">
            {authors.map((author) => (
              <li key={author.slug}>
                <Link
                  href={`/author/${author.slug}`}
                  className="font-display font-semibold text-link underline underline-offset-2 hover:text-brand"
                >
                  {author.name}, {author.credentials}
                </Link>
                <span className="text-muted"> — {author.role}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14 border-t border-line pt-8">
        <h2 className="text-2xl">Visit the practice</h2>
        <address className="mt-4 not-italic leading-relaxed text-muted">
          {PRACTICE.name}
          <br />
          {PRACTICE.address.street}
          <br />
          {PRACTICE.address.city}, {PRACTICE.address.region}{" "}
          {PRACTICE.address.postalCode}
          <br />
          <a href={PRACTICE.phoneHref} className="text-link underline underline-offset-2">
            {PRACTICE.phone}
          </a>
        </address>
      </section>
    </div>
  );
}
