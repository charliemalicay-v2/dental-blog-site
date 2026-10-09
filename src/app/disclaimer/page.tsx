import type { Metadata } from "next";
import { DISCLAIMER, PRACTICE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description:
    "The medical disclaimer and editorial standards for the Shallowford Dental resource library.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 md:py-20">
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        <span aria-hidden className="inline-block h-[3px] w-8 bg-brand" />
        Legal
      </p>
      <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">
        Medical Disclaimer
      </h1>

      <div className="prose-dental mt-8">
        <p>{DISCLAIMER}</p>

        <h2>No doctor–patient relationship</h2>
        <p>
          Reading this site does not create a dentist–patient relationship with{" "}
          {PRACTICE.name} or any of its clinicians. A relationship is established
          only through an examination and an agreement for care at the practice.
        </p>

        <h2>No diagnosis or treatment</h2>
        <p>
          Content here is general educational information. It cannot account for
          your medical history, medications, or the specific condition of your
          teeth and gums. Do not use it to diagnose yourself or to delay or
          disregard advice from a licensed dentist or physician.
        </p>

        <h2>Emergencies</h2>
        <p>
          If you have a dental emergency — severe pain, facial swelling,
          difficulty breathing or swallowing, uncontrolled bleeding, or a
          suspected broken jaw — seek immediate care. Call 911 or go to the
          nearest emergency department. Do not rely on this site.
        </p>

        <h2>Editorial standard</h2>
        <p>
          Every published article carries the name, credentials, and review date
          of the dentist who reviewed it, along with a list of sources. Article
          guidance is re-reviewed at least every twelve months. See our{" "}
          <a href="/about">About page</a> for the full content pipeline.
        </p>

        <h2>External links</h2>
        <p>
          We link to primary sources and to the practice website. External
          content is not under our control, and a link is not an endorsement of
          everything on the destination site.
        </p>
      </div>
    </div>
  );
}
