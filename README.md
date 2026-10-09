# Shallowford Dental Blog & Resource Hub

A content hub that establishes [Shallowford Dental Studio](https://shallowfordds.com)
(Roswell, GA) as the authoritative dental resource for Roswell and Cobb & Fulton
Counties. Articles are original, cited to primary sources, and clinically
reviewed before publishing.

> This is a **supporting authority asset**, not a replacement for the practice
> website. It targets informational queries; the practice site owns transactional
> intent. Every article routes readers to the practice.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 (`@theme` tokens) |
| Content | MDX + `gray-matter` frontmatter |
| Fonts | `next/font/google` — Archivo, Hind Guntur, Shippori Antique |
| Hosting | Vercel |

## Documentation

- [`DESIGN-FINDINGS.md`](./DESIGN-FINDINGS.md) — design tokens extracted from the
  practice site (palette, typography, components, motion). The commercial
  `quartage` webfont is **not** copied; Archivo is the free substitute.
- [`PLAN.md`](./PLAN.md) — positioning, IA, content model, YMYL/E-E-A-T pipeline,
  SEO strategy, and the phased roadmap.

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build (runs `validate` first via `prebuild`) |
| `npm run validate` | **Publishing gate** — enforces the E-E-A-T rules below |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Content authoring

Posts live in `content/posts/*.mdx`. Authors and categories are JSON registries
in `content/authors/` and `content/categories/`.

### The publishing gate

`scripts/validate-content.ts` fails the build if any post is missing:

1. A **named, credentialed clinical reviewer** with a review date
   (`clinicalReview.reviewer`, `.credentials`, `.reviewedAt`).
2. At least one **source** (`sources[]`) with title, absolute URL, publisher, year.
3. Valid, resolvable **author** and **category** references.
4. Required frontmatter and well-formed dates (`updatedAt` ≥ `publishedAt`).

This runs locally via `npm run validate` and in CI on every pull request
(`.github/workflows/content-review.yml`).

### Frontmatter shape

```yaml
title: "…"
slug: "kebab-case-must-match-filename"
description: "Meta description, aim for ≤160 chars"
publishedAt: "2026-01-12"
updatedAt: "2026-01-12"
author: "dr-lucy-sedrakyan"      # → content/authors/*.json
category: "preventive-care"      # → content/categories/*.json
tags: ["cleanings", "prevention"]
heroImage: { src: "", alt: "…" } # leave src empty to use the branded placeholder
clinicalReview:
  reviewer: "Dr. Lucy Sedrakyan"
  reviewedAt: "2026-01-10"
  credentials: "DMD"
sources:
  - { title: "…", url: "https://…", publisher: "…", year: 2025 }
relatedToPractice:
  servicePageUrl: "https://shallowfordds.com"
  anchorText: "…"
draft: false
```

## Observing the rules

Dental content is **YMYL** (Your Money Your Life), so Google's quality raters
apply a higher bar. The non-negotiables:

- No article publishes without a licensed dentist's review and a review date.
- No clinical claim without a source.
- No diagnosis language, no promised outcomes.
- A medical disclaimer on every article.
- Guidance re-reviewed at least every 12 months (`updatedAt` is shown publicly).

## Routes

`/` · `/blog` · `/blog/[slug]` · `/category` · `/category/[slug]` ·
`/author/[slug]` · `/resources` · `/about` · `/disclaimer` · `/privacy` ·
`/sitemap.xml` · `/robots.txt` · `/feed.xml`

## Deploying

Push to `main` and connect the repo to Vercel. Set `NEXT_PUBLIC_SITE_URL` to the
production domain so canonicals, sitemap, robots, and RSS resolve correctly.

---

**The practice still needs to supply:** approved clinical-review workflow, licensed
imagery, brand-asset permissions, analytics/GSC access, and legal sign-off on the
disclaimer and privacy copy. See `PLAN.md` §12 for the full checklist.
