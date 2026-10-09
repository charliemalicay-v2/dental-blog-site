import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost";

type Props = ComponentProps<"a"> & {
  variant?: Variant;
  /** Internal path — renders a Next.js <Link>. */
  href: string;
  children: ReactNode;
};

const VARIANT_CLASS: Record<Variant, string> = {
  solid: "btn-solid",
  outline: "btn-outline",
  ghost: "btn-outline border-transparent hover:border-current",
};

/**
 * CTA button. Internal hrefs become client navigations, external hrefs open
 * the practice site (or other destination) in a new tab.
 */
export function Button({
  variant = "solid",
  href,
  className = "",
  children,
  ...rest
}: Props) {
  const classes = `${VARIANT_CLASS[variant]} ${className}`.trim();
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
