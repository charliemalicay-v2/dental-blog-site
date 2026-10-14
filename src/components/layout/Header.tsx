"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, PRACTICE, SITE } from "@/lib/constants";

/**
 * Dark sticky header matching the source site: #1a1a1a bar, uppercase
 * letter-spaced nav, and a red outline CTA. Shrinks slightly on scroll.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-nav text-white shadow-[0_3px_25px_0_rgba(255,255,255,0.07)]">
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between px-5 transition-all duration-300 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label={`${SITE.name} — home`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.svg"
            alt={PRACTICE.name}
            width={759}
            height={161}
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                  active ? "text-brand" : "text-white hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={PRACTICE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline border-brand text-brand hover:bg-brand hover:text-white"
          >
            Book a Visit
          </a>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-[3px] w-6 bg-white transition-transform ${open ? "translate-y-[8px] rotate-45" : ""}`}
          />
          <span className={`h-[3px] w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-[3px] w-6 bg-white transition-transform ${open ? "-translate-y-[8px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Main menu"
        className={`overflow-hidden border-t border-white/10 transition-[max-height] duration-300 lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="mx-auto w-full max-w-6xl px-5 py-3">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white hover:text-brand"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-2 pb-4">
            <a
              href={PRACTICE.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-solid w-full"
            >
              Book a Visit
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
