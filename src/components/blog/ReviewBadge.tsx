import { getAuthorBySlug } from "@/content";
import type { ClinicalReview } from "@/types";

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * E-E-A-T signal: prominent "medically reviewed by" badge shown on every
 * article. Required by scripts/validate-content.ts — never publish without it.
 */
export function ReviewBadge({ review }: { review: ClinicalReview }) {
  const reviewer = getAuthorBySlug(
    review.reviewer.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  );

  return (
    <aside
      aria-label="Clinical review"
      className="flex items-start gap-4 border-l-[3px] border-teal bg-surface px-5 py-4"
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-white"
      >
        {review.reviewer
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")}
      </span>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">
          Medically reviewed
        </p>
        <p className="mt-1 text-sm leading-snug text-ink">
          <span className="font-semibold">
            {review.reviewer}, {review.credentials}
          </span>
          {reviewer?.role && (
            <span className="text-muted"> — {reviewer.role}</span>
          )}
        </p>
        <p className="mt-1 text-xs text-muted">
          Reviewed on{" "}
          <time dateTime={review.reviewedAt}>
            {new Date(review.reviewedAt).toLocaleDateString(
              "en-US",
              DATE_OPTS,
            )}
          </time>
        </p>
      </div>
    </aside>
  );
}
