import type { Source } from "@/types";

/**
 * Numbered source list. Every clinical claim on the site must map to an entry
 * here — enforced by scripts/validate-content.ts.
 */
export function CitationList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  return (
    <section aria-labelledby="sources-heading" className="mt-12 border-t border-line pt-8">
      <h2 id="sources-heading" className="text-lg">
        Sources
      </h2>
      <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
        {sources.map((source) => (
          <li key={`${source.url}-${source.year}`} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-teal text-[11px] font-bold text-white"
            >
              {sources.indexOf(source) + 1}
            </span>
            <span>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-link underline underline-offset-2 hover:text-brand"
              >
                {source.title}
              </a>
              <span className="text-muted">
                {" "}
                — {source.publisher}, {source.year}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
