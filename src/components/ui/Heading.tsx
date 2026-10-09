import type { ReactNode } from "react";

type Level = 1 | 2 | 3 | 4;

const TAG: Record<Level, "h1" | "h2" | "h3" | "h4"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
};

const SIZE: Record<Level, string> = {
  1: "text-[clamp(2.25rem,5vw,3.75rem)]",
  2: "text-[clamp(1.75rem,3.5vw,2.5rem)]",
  3: "text-[clamp(1.35rem,2.5vw,1.75rem)]",
  4: "text-xl md:text-2xl",
};

type Props = {
  level?: Level;
  children: ReactNode;
  /** Optional eyebrow label rendered above the heading with a red rule. */
  eyebrow?: string;
  className?: string;
  id?: string;
};

/**
 * Display heading — uses the display font and tight tracking defined in
 * globals.css base styles. The optional eyebrow mirrors the source site's
 * small uppercase label + accent rule pattern.
 */
export function Heading({
  level = 2,
  children,
  eyebrow,
  className = "",
  id,
}: Props) {
  const Tag = TAG[level];
  const heading = (
    <Tag id={id} className={`${SIZE[level]} ${className}`.trim()}>
      {children}
    </Tag>
  );

  if (!eyebrow) return heading;

  return (
    <div className="mb-4">
      <span className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        <span aria-hidden className="inline-block h-[3px] w-8 bg-brand" />
        {eyebrow}
      </span>
      {heading}
    </div>
  );
}
