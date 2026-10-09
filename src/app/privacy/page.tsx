import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How the Shallowford Dental resource library handles information and analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 md:py-20">
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        <span aria-hidden className="inline-block h-[3px] w-8 bg-brand" />
        Legal
      </p>
      <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">Privacy Policy</h1>

      <div className="prose-dental mt-8">
        <p>
          This page describes how {SITE.name} handles information. It is a
          general-intent, informational website.
        </p>

        <h2>No health information collected</h2>
        <p>
          This site does not collect, store, or process protected health
          information (PHI). It contains no patient portal, intake form, or
          booking system. Do not submit personal health details through any
          channel on this site.
        </p>

        <h2>Analytics</h2>
        <p>
          We may use privacy-respecting analytics to understand aggregate traffic
          patterns — such as which articles are read and how visitors arrive. Any
          analytics we deploy is configured to avoid collecting directly
          identifying information.
        </p>

        <h2>Cookies</h2>
        <p>
          Essential cookies may be used for basic site function. Where
          non-essential cookies are used, we will provide a way to manage
          consent.
        </p>

        <h2>Third-party links</h2>
        <p>
          Articles link to external sources and to the practice website. Those
          sites have their own privacy policies, which we do not control.
        </p>

        <h2>Children</h2>
        <p>
          This site is intended for a general adult audience and is not directed
          at children under 13.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy as the site evolves. Material changes will be
          reflected here with a revised date.
        </p>
      </div>
    </div>
  );
}
