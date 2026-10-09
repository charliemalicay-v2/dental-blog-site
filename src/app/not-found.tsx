import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-start px-5 py-24">
      <p className="font-display text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-3xl">We could not find that page</h1>
      <p className="mt-4 text-muted">
        The guide you were looking for may have moved, or the link may be out of
        date. Try the library index instead.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/blog" className="btn-solid">
          Browse the Guides
        </Link>
        <Link href="/" className="btn-outline border-ink text-ink hover:bg-ink hover:text-white">
          Back Home
        </Link>
      </div>
    </div>
  );
}
