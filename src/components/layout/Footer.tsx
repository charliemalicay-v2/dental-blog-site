import Link from "next/link";
import { DISCLAIMER, NAV, PRACTICE, SITE } from "@/lib/constants";

const address = `${PRACTICE.address.street}, ${PRACTICE.address.city}, ${PRACTICE.address.region} ${PRACTICE.address.postalCode}`;

export function Footer() {
  return (
    <footer className="mt-auto bg-nav text-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold uppercase">
              Shallowford <span className="text-brand">Dental</span> Resource
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Expert-reviewed dental guides for Roswell, GA and Cobb &amp;
              Fulton Counties. Published in connection with Shallowford Dental
              Studio.
            </p>
            <a
              href={PRACTICE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid mt-6"
            >
              Visit the Practice
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Explore
            </p>
            <ul className="mt-4 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              The Practice
            </p>
            <address className="mt-4 space-y-3 text-sm not-italic text-white/80">
              <p>{PRACTICE.name}</p>
              <p>{address}</p>
              <p>
                <a
                  href={PRACTICE.phoneHref}
                  className="transition-colors hover:text-brand"
                >
                  {PRACTICE.phone}
                </a>
              </p>
            </address>
            <div className="mt-4 space-y-2 text-sm">
              <Link href="/disclaimer" className="block text-white/70 hover:text-brand">
                Medical Disclaimer
              </Link>
              <Link href="/privacy" className="block text-white/70 hover:text-brand">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs leading-relaxed text-white/50">{DISCLAIMER}</p>
          <p className="mt-4 text-xs text-white/50">
            &copy; {new Date().getFullYear()} {SITE.name}. This site is an
            informational resource and is operated in connection with{" "}
            {PRACTICE.name}.
          </p>
        </div>
      </div>
    </footer>
  );
}
