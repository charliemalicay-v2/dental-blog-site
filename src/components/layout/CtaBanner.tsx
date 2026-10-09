import Link from "next/link";

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

/**
 * Full-width conversion banner on the navy accent, closing an article or page
 * with a clear path to the practice site.
 */
export function CtaBanner({ eyebrow, title, body, ctaLabel, ctaHref }: Props) {
  return (
    <section className="mt-16 bg-navy py-14 text-white md:py-16">
      <div className="mx-auto grid w-full max-w-4xl gap-8 px-5 text-center md:grid-cols-[1.4fr_1fr] md:items-center md:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.25rem)] text-white">
            {title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
            {body}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 md:items-end">
          <a href={ctaHref} className="btn-solid" target="_blank" rel="noopener noreferrer">
            {ctaLabel}
          </a>
          <Link
            href="/blog"
            className="text-sm text-white/70 underline underline-offset-4 hover:text-white"
          >
            Or keep reading the guides
          </Link>
        </div>
      </div>
    </section>
  );
}
