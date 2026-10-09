import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Author, Category, PostFrontmatter } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");
const AUTHORS_DIR = path.join(CONTENT_DIR, "authors");
const CATEGORIES_DIR = path.join(CONTENT_DIR, "categories");

/** Read and parse every JSON file in a directory. */
function readJsonDir<T extends { slug: string }>(dir: string): T[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      return JSON.parse(raw) as T;
    });
}

export function getAllAuthors(): Author[] {
  return readJsonDir<Author>(AUTHORS_DIR);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return getAllAuthors().find((a) => a.slug === slug);
}

export function getAllCategories(): Category[] {
  return readJsonDir<Category>(CATEGORIES_DIR);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getAllCategories().find((c) => c.slug === slug);
}

/**
 * Read all post frontmatter (no rendered body), newest first.
 * Drafts are excluded outside of development.
 */
export function getAllPosts(): PostFrontmatter[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data } = matter(raw);
    return data as PostFrontmatter;
  });

  return posts
    .filter((p) => (process.env.NODE_ENV === "production" ? !p.draft : true))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getPostBySlug(slug: string): PostFrontmatter | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): PostFrontmatter[] {
  return getAllPosts().filter((p) => p.category === categorySlug);
}

export function getPostsByAuthor(authorSlug: string): PostFrontmatter[] {
  return getAllPosts().filter((p) => p.author === authorSlug);
}

/** Related posts: same category first, then fill from remaining. */
export function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit = 3,
): PostFrontmatter[] {
  const all = getAllPosts();
  const sameCategory = all.filter(
    (p) => p.category === category && p.slug !== currentSlug,
  );
  const others = all.filter(
    (p) => p.category !== category && p.slug !== currentSlug,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

/** Every post slug for static params and the sitemap. */
export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
