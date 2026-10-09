"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Variant = "up" | "left" | "right";

type Props = {
  children: ReactNode;
  /** Entrance direction matching the source site's scroll animations. */
  variant?: Variant;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
};

const CLASS: Record<Variant, string> = {
  up: "reveal",
  left: "reveal-left",
  right: "reveal-right",
};

/**
 * Scroll-triggered entrance. Fires once, then disconnects — matching the
 * source site's one-shot reveal behaviour. Reduced-motion users get the
 * final state immediately (see the media query in globals.css).
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${CLASS[variant]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
