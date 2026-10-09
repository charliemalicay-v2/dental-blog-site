type Props = {
  children: string;
  /** Tailwind size classes — the source steps 150px → 100px on mobile. */
  className?: string;
};

/**
 * Decorative watermark text: transparent fill with a faint stroke, set in the
 * Shippori Antique display face. Purely ornamental — hidden from screen
 * readers and inert to pointer input (see .watermark in globals.css).
 */
export function Watermark({ children, className = "" }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`watermark absolute select-none text-[100px] md:text-[150px] ${className}`.trim()}
    >
      {children}
    </span>
  );
}
