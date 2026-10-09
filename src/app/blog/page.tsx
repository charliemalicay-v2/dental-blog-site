import type { Metadata } from "next";
import { BlogCard } from "@/components/blog/BlogCard";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { Reveal } from "@/components/motion/Reveal";
import { getAllPosts } from "@/content";

export const metadata: Metadata = {
  title: "Dental Guides & Resources",
  description:
    "Expert-reviewed articles on preventive care, implants, Invisalign, and dental costs for Roswell, GA and the surrounding Cobb and Fulton Counties.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-20">
      <header className="max-w-2xl">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          <span aria-hidden className="inline-block h-[3px] w-8 bg-brand" />
          The Resource Library
        </p>
        <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">
          Dental guides, reviewed by a dentist
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Every article here is written for real patient questions, cited to
          primary sources, and clinically reviewed before it goes live.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-16 text-muted">No published articles yet.</p>
      ) : (
        <>
          <div className="mt-12 md:mt-16">
            <Reveal>
              <FeaturedPost post={featured} />
            </Reveal>
          </div>

          <div className="mt-16 grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 90}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
