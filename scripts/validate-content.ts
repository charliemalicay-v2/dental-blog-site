/**
 * Content validator — the publishing gate.
 *
 * Enforces the non-negotiables for YMYL dental content:
 *   - every post has a named, credentialed clinical reviewer + review date
 *   - every post cites at least one source
 *   - author and category references resolve
 *   - required frontmatter fields are present and well-formed
 *
 * Run with:  npm run validate
 * Node 24 executes TypeScript directly via native type stripping.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const AUTHORS_DIR = path.join(ROOT, "content", "authors");
const CATEGORIES_DIR = path.join(ROOT, "content", "categories");

const errors: string[] = [];
const warnings: string[] = [];

const REQUIRED_POST_FIELDS = [
  "title",
  "slug",
  "description",
  "publishedAt",
  "updatedAt",
  "author",
  "category",
  "tags",
  "clinicalReview",
  "sources",
] as const;

function listJson(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f));
}

function slugsFrom(dir: string): Set<string> {
  return new Set(
    listJson(dir).map((file) => JSON.parse(fs.readFileSync(file, "utf8")).slug),
  );
}

function isIsoDate(value: unknown): boolean {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function fail(file: string, message: string) {
  errors.push(`${file}: ${message}`);
}

function warn(file: string, message: string) {
  warnings.push(`${file}: ${message}`);
}

function main() {
  const authorSlugs = slugsFrom(AUTHORS_DIR);
  const categorySlugs = slugsFrom(CATEGORIES_DIR);

  if (!fs.existsSync(POSTS_DIR)) {
    console.log("No content/posts directory found. Nothing to validate.");
    return;
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(POSTS_DIR, f));

  const seenSlugs = new Map<string, string>();

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const raw = fs.readFileSync(file, "utf8");
    const { data } = matter(raw);

    // 1. Required fields present.
    for (const field of REQUIRED_POST_FIELDS) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        fail(rel, `missing required field "${field}"`);
      }
    }

    // 2. Slug uniqueness + filename match.
    const expectedSlug = path.basename(file, ".mdx");
    if (data.slug && data.slug !== expectedSlug) {
      fail(rel, `slug "${data.slug}" does not match filename "${expectedSlug}"`);
    }
    if (data.slug) {
      const prior = seenSlugs.get(data.slug);
      if (prior) fail(rel, `duplicate slug "${data.slug}" (also in ${prior})`);
      else seenSlugs.set(data.slug, rel);
    }

    // 3. Dates well-formed + updatedAt not before publishedAt.
    if (data.publishedAt && !isIsoDate(data.publishedAt)) {
      fail(rel, "publishedAt is not a valid date");
    }
    if (data.updatedAt && !isIsoDate(data.updatedAt)) {
      fail(rel, "updatedAt is not a valid date");
    }
    if (
      isIsoDate(data.publishedAt) &&
      isIsoDate(data.updatedAt) &&
      new Date(data.updatedAt) < new Date(data.publishedAt)
    ) {
      fail(rel, "updatedAt is earlier than publishedAt");
    }

    // 4. E-E-A-T: clinical review block complete.
    const review = data.clinicalReview;
    if (!review || typeof review !== "object") {
      fail(rel, "clinicalReview block is missing — required for YMYL content");
    } else {
      for (const key of ["reviewer", "reviewedAt", "credentials"] as const) {
        if (!review[key]) fail(rel, `clinicalReview.${key} is required`);
      }
      if (review.reviewedAt && !isIsoDate(review.reviewedAt)) {
        fail(rel, "clinicalReview.reviewedAt is not a valid date");
      }
    }

    // 5. Citations required.
    if (!Array.isArray(data.sources) || data.sources.length === 0) {
      fail(rel, "at least one source is required");
    } else {
      data.sources.forEach((source: Record<string, unknown>, i: number) => {
        for (const key of ["title", "url", "publisher", "year"] as const) {
          if (!source?.[key]) fail(rel, `sources[${i}].${key} is required`);
        }
        if (source?.url && !/^https?:\/\//.test(String(source.url))) {
          fail(rel, `sources[${i}].url must be an absolute URL`);
        }
      });
    }

    // 6. Referential integrity.
    if (data.author && !authorSlugs.has(data.author)) {
      fail(rel, `author "${data.author}" has no matching author file`);
    }
    if (data.category && !categorySlugs.has(data.category)) {
      fail(rel, `category "${data.category}" has no matching category file`);
    }

    // 7. Editorial quality warnings (non-blocking).
    if (typeof data.description === "string" && data.description.length > 160) {
      warn(rel, `description is ${data.description.length} chars (aim for ≤160)`);
    }
    if (Array.isArray(data.tags) && data.tags.length === 0) {
      warn(rel, "tags array is empty");
    }

    // 8. Outbound practice link.
    if (
      !data.relatedToPractice?.servicePageUrl?.startsWith("https://shallowfordds.com")
    ) {
      warn(
        rel,
        "relatedToPractice.servicePageUrl should point to the practice website",
      );
    }
  }

  console.log(`Validated ${files.length} post(s).`);

  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`  ⚠ ${w}`);
  }

  if (errors.length) {
    console.error(`\n${errors.length} error(s):`);
    for (const e of errors) console.error(`  ✖ ${e}`);
    process.exit(1);
  }

  console.log("\nAll content checks passed.");
}

main();
