# Build Plan — Shallowford Dental Blog & Resource Hub

**Target site:** `https://shallowfordds.com/` (Shallowford Dental Studio, Roswell GA)
**Project root:** `C:\Users\charl\Desktop\current_projects\codebases\dental-blog-site`
**Design source:** [`DESIGN-FINDINGS.md`](./DESIGN-FINDINGS.md)
**Date:** 2026-10-09 · Status: Draft for review

---

## 1. Purpose & positioning

Build a **content hub** that establishes Shallowford Dental Studio as the authoritative dental
resource for **Roswell, GA and Cobb & Fulton Counties**, and routes readers to the official
practice site as the trusted next step.

The site is a *supporting authority asset*, not a replacement for the practice website. Every
article should:

1. Answer a real patient question with clinically accurate, reviewed content.
2. Demonstrate first-hand expertise (E-E-A-T) attributable to a named, credentialed dentist.
3. Offer a clear, contextual path to `shallowfordds.com` for scheduling or service detail.

### Business goals
| Goal | Signal |
|------|--------|
| Organic visibility | Non-branded dental queries ranking in target geo |
| Authority | Branded search + direct traffic growth to practice site |
| Conversion | Assisted appointments / "Book" clicks from blog traffic |
| Trust | Returning readers, email subscribers, shareable citations |

### Non-goals (for MVP)
- No online booking engine (defer to `shallowfordds.com`).
- No patient portal, forms, or PHI handling.
- No replacement of the practice's existing service pages.

---

## 2. Tech stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 15** (App Router, TypeScript) | Static-first, strong SEO primitives, Vercel-native |
| Styling | **Tailwind CSS v4** | CSS-first `@theme` maps 1:1 onto extracted design tokens |
| Content | **MDX** (local files) → optional CMS later | Version-controlled, reviewable in PRs |
| Fonts | `next/font/google` | Self-hosted at build, no CLS |
| Images | `next/image` + remote patterns for CDN | Optimization, LCP budget |
| Search | `pagefind` or FlexSearch (client) | Static-friendly site search |
| Analytics | Vercel Analytics + Plausible/GA4 | Privacy-conscious, event tracking |
| Hosting | **Vercel** | Preview deploys per PR, edge CDN |

### Fonts mapping (from `DESIGN-FINDINGS.md`)
- `--font-display` → **Archivo** (free stand-in for the commercial Quartage)
- `--font-body` → **Hind Guntur** (exact match)
- `--font-decor` → **Shippori Antique** (exact match, watermark layer)

> ⚠️ Do **not** copy the site's `quartage-webfont.woff`. It is a licensed commercial font.

---

## 3. Information architecture

```
/                          Home — hub intro, featured articles, authority strip
/blog                      Blog index — sticky featured + 3-col grid
/blog/[slug]               Single article
/category                  All categories
/category/[slug]           Category archive
/author/[slug]             Author profile (dentist bio + credentials + articles)
/resources                 Guides / hub landing
/tools/[slug]              Optional: interactive (spline calculator, cost estimator)
/about                     Who runs this hub + relationship to the practice
/disclaimer                Medical disclaimer + editorial policy
/privacy                   Privacy policy
/sitemap.xml               Auto-generated
/robots.txt                Crawl rules
```

### Navigation
`Home · Blog · Categories · Guides · About` + persistent CTA → `shallowfordds.com`

---

## 4. Content model

### Article (MDX frontmatter)
```yaml
title:            string        # required
slug:             string        # required, kebab-case
description:      string        # 140–160 chars, meta description
publishedAt:      date
updatedAt:        date
author:           reference     # → author collection
category:         reference     # → category collection
tags:             string[]
heroImage:        { src, alt, credit }
clinicalReview:   { reviewer, reviewedAt, credentials }  # E-E-A-T required
sources:          [{ title, url, publisher, year }]     # citations
canonical:        url           # self-referencing
relatedToPractice: { servicePageUrl, anchorText }       # outbound to shallowfordds.com
draft:            boolean
```

### Author
```yaml
name, slug, credentials (DMD, DDS…), role, bio, headshot,
licenseInfo, practiceUrl, sameAs[]  # → schema.org sameAs
```

### Category (seed set)
`Preventive Care` · `Cosmetic Dentistry` · `Restorative` · `Invisalign & Orthodontics` ·
`Dental Implants` · `Oral Health Tips` · `Cost & Insurance` · `Patient Guides`

### Seed articles (MVP — 6)
1. How Often Should You Really Get a Dental Cleaning?
2. Dental Implants vs. Bridges: Which Is Right for You?
3. Invisalign vs. Braces: Cost, Timeline, and Candidacy
4. 7 Signs You Need to See a Dentist This Week
5. What Does a Root Cost? Understanding Root Canal Pricing in Metro Atlanta
6. A First-Timer's Guide to Visiting a New Dentist

Each drafted from cited dental sources, then reviewed and signed off by
**Dr. Lucy Sedrakyan, DMD** before publish.

---

## 5. Content pipeline (YMYL / E-E-A-T)

Dental content is **Your Money Your Life (YMYL)**. Google's quality raters apply a
significantly higher bar. The pipeline is designed around that.

```
1. RESEARCH      Pull from ADA, AAPD, AAE, peer-reviewed literature, CDC
        ↓
2. DRAFT         AI-assisted drafting — never published unsupervised
        ↓
3. CLINICAL REVIEW   Licensed dentist reviews for accuracy + safety
        ↓               → produces `clinicalReview` block + reviewer byline
4. EDIT          Readability, tone, medical-jargon translation, structure
        ↓
5. CITATIONS     Every clinical claim traceable to a listed source
        ↓
6. LEGAL PASS    Disclaimer language, no promises of outcomes, no pricing guarantees
        ↓
7. PUBLISH       PR → preview deploy → approve → merge to main
```

### Hard rules
- **Every post** carries a named reviewer with credentials and a `reviewedAt` date.
- **No** absolute medical claims, no "guaranteed" outcomes, no diagnosis language.
- **Every post** includes a medical disclaimer block and a "not a substitute for
  professional advice" line.
- Outdated clinical guidance is flagged via `updatedAt`; review cadence **12 months**.
- External citations required for statistics and clinical assertions.

### E-E-A-T signals on every page
- Visible **byline + headshot + credentials**
- **"Medically reviewed by …"** badge with date
- **Cited sources** section
- Clear **relationship disclosure** (hub operated in connection with the practice)
- Link out to `shallowfordds.com` as the authoritative service reference

---

## 6. Design system application

All tokens are already extracted and documented in `DESIGN-FINDINGS.md`. Implementation
maps directly into Tailwind v4 `@theme`:

### Color
| Token | Hex | Use |
|-------|-----|-----|
| `brand` | `#ff2a13` | Primary CTA |
| `brand-hover` | `#ef2201` | CTA hover |
| `brand-border` | `#ac1100` | CTA border |
| `brand-shadow` | `#a71000` | Hard offset shadow |
| `brand-deep` | `#600900` | CTA hover border |
| `ink` | `#272727` | Headings |
| `body` | `#000000` | Body text |
| `nav` | `#1a1a1a` | Header / footer |
| `muted` | `#6a6a6a` | Secondary text |
| `navy` | `#09263D` | Dark sections |
| `teal` | `#1A3637` | Blog dividers, load-more, featured border |
| `link` | `#289EFF` | Card-title + link hover |
| `surface` / `line` / `placeholder` | `#f1f1f1` / `#ddd` / `#ccc` | Neutrals |

### Components to build
- **Button** — solid (red, hard shadow, `0.25em` radius) + outline (3px, inverts on hover)
- **Heading** — display font, `-0.035em` tracking, optional eyebrow rule
- **Watermark** — Shippori Antique 150px → 100px, transparent fill, low-opacity stroke
- **BlogCard** — `102%` aspect thumbnail on `#ccc`, title capitalize → `#289eff` hover,
  author meta 16px / `0.12em` / uppercase
- **FeaturedPost** — `2fr 1fr` grid, `65%` thumb, `3px #1A3637` top border, 38px title
- **Header** — `#1a1a1a` sticky bar, outline CTAs, shrink-on-scroll
- **Callout / Disclaimer** — muted block with `3px` left rule
- **CitationList** — numbered, `teal` accent
- **ReviewBadge** — reviewer avatar, credentials, date
- **RelatedPosts** — 3-col grid reuse of BlogCard
- **CtaBanner** — navy background, display heading, red CTA to practice site

### Layout
- Blog index: `grid-template-columns: repeat(3, 1fr); grid-gap: 64px 24px` → 1 col below `978px`
- Section rhythm: 60–80px top / 20–130px bottom, collapsing 50px → 40px
- Breakpoints: `480 / 767 / 979 / 1200`

### Motion
Scroll-triggered, fire-once: `slideInUp` (headings, text, buttons), `slideInLeft/Right`
(images, cards), `zoomIn` (decor), `pulse` (review/rating). Respect
`prefers-reduced-motion`.

---

## 7. SEO strategy

### Technical
- Self-referencing canonical on every page
- `Article`, `BlogPosting`, `Person`, `BreadcrumbList`, `FAQPage`, `MedicalWebPage` schema
- XML sitemap + `robots.txt`, auto-updated on publish
- RSS feed
- Core Web Vitals budget: LCP < 2.0s, CLS < 0.1, INP < 200ms
- Internal link graph: category ↔ article ↔ related, no orphan pages

### On-page
- Keyword-targeted `title` / `description` per article
- One H1, semantic H2/H3 hierarchy
- Descriptive `alt` on every image
- FAQ blocks (eligible for rich results) on high-intent articles

### Local SEO
- Geo-modified topics: "Roswell GA", "Cobb County", "Fulton County"
- `Dentist` + `LocalBusiness` schema pointing to the practice
- NAP consistency with `4401 Shallowford Rd #140, Roswell, GA 30075` · `(470) 970-4111`
- Author `sameAs` → practice site, Instagram (`shallowford_dental_studio`)
- Location landing pages deferred to Phase 3

### Content clustering
```
Hub:   Dental Implants (category)
  ├─ Dental Implants vs. Bridges
  ├─ How Long Do Implants Last?
  ├─ Am I a Candidate for Implants?
  └─ Implant Cost in Metro Atlanta
```
Every cluster member links to the hub and to the relevant `shallowfordds.com` service page.

---

## 8. Directory structure

```
dental-blog-site/
├── DESIGN-FINDINGS.md
├── PLAN.md
├── public/
│   ├── images/            # original or licensed — never hotlink the source site
│   └── fonts/
├── content/
│   ├── posts/             # MDX articles
│   ├── authors/           # author YAML
│   └── categories/        # category YAML
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # home
│   │   ├── blog/
│   │   │   ├── page.tsx             # index
│   │   │   └── [slug]/page.tsx      # single post
│   │   ├── category/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── author/[slug]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── disclaimer/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── globals.css              # @theme tokens
│   ├── components/
│   │   ├── ui/                      # Button, Heading, Watermark
│   │   ├── blog/                    # BlogCard, FeaturedPost, ReviewBadge, CitationList
│   │   ├── seo/                     # JsonLd, Breadcrumbs
│   │   └── layout/                  # Header, Footer, CtaBanner
│   ├── content/                     # MDX loaders, validation
│   ├── lib/                         # seo helpers, formatting
│   └── types/
├── scripts/
│   └── validate-content.ts          # frontmatter + E-E-A-T rule checks
└── .github/workflows/
    └── content-review.yml           # PR checks on content
```

---

## 9. Phased roadmap

### Phase 0 — Foundation *(prerequisite)*
Scaffold Next.js + TS + Tailwind v4. Configure fonts, `@theme` tokens from
`DESIGN-FINDINGS.md`, base layout, lint/format, Vercel project + preview deploys.

### Phase 1 — MVP *(core deliverable)*
- Content collections (posts / authors / categories) with schema validation
- `Header`, `Footer`, `CtaBanner` — dark `#1a1a1a` bar, red CTA
- **Home** — hub intro, featured articles, authority strip
- **Blog index** — sticky featured (`2fr 1fr`, `3px #1A3637` border) + 3-col grid
- **Single article** — hero, byline, `ReviewBadge`, citations, disclaimer, CTA to practice
- **Category archive** + **Author profile**
- 6 seed articles, fully reviewed + cited
- JSON-LD: `Article`, `Person`, `BreadcrumbList`
- Sitemap, robots, RSS
- `scripts/validate-content.ts` enforcing reviewer + sources on every post

**Exit criteria:** build green · Lighthouse SEO ≥ 95 · every post has reviewer + citations ·
Vercel preview working

### Phase 2 — Growth
- Guides hub + FAQ blocks (rich-result eligible)
- Client-side search
- Related-posts + improved internal linking
- Analytics events: scroll depth, outbound CTA clicks, article completion
- Email capture → subscribe flow
- Content pipeline automation: draft → PR → review checklist

**Exit criteria:** event tracking live · search functional · ≥ 12 articles published

### Phase 3 — Authority & local
- Location pages: Roswell, Cobb County, Fulton County
- Service landing pages linking out to `shallowfordds.com`
- Interactive tools (cost estimator, candidacy self-check)
- `FAQPage` schema on high-intent articles
- Backlink / citation outreach to local + dental publications

**Exit criteria:** ≥ 2 location pages live · local pack impressions trending up

### Phase 4 — Scale & maintain
- Editorial calendar + 2–4 posts/month cadence
- 12-month clinical re-review sweep automation
- Internal link graph monitoring
- Quarterly content audit (prune / refresh / consolidate)

---

## 10. Measurement

| Metric | Tool | Target (6 mo) |
|--------|------|---------------|
| Non-branded organic impressions | GSC | MoM growth |
| Assisted appointments | GA4 event | Baseline → +X% |
| Articles live | CMS/MDX | ≥ 24 |
| Avg. time on page | GA4 | > 2:30 |
| Lighthouse SEO / Perf | CI | ≥ 95 / ≥ 90 |
| LCP | Vercel | < 2.0s |

---

## 11. Risks & considerations

| Risk | Mitigation |
|------|------------|
| **YMYL quality** — inaccurate dental advice harms patients + rankings | Mandatory licensed-dentist review; citations; disclaimer on every post; no outcome promises |
| **Attribution / licensing** — copying source assets | Original or licensed imagery only. No hotlinking. **Never** copy the `quartage` webfont binary |
| **Conflicts with practice site** — duplicate/cannibalizing rankings | Hub targets informational queries; practice site owns transactional. Distinct content, cross-linked |
| **Unreviewed content going live** | `validate-content.ts` CI gate fails any PR missing `clinicalReview` or `sources` |
| **Stale clinical guidance** | 12-month review cadence; visible `updatedAt`; flagged sweep in Phase 4 |
| **Regulatory** | No HIPAA exposure (no PHI). Add medical disclaimer + editorial policy pages |
| **Single-reviewer bottleneck** | Expand reviewer roster as volume grows; document backlog SLA |

---

## 12. Immediate next steps

1. Scaffold Next.js 15 + TypeScript + Tailwind v4 (`create-next-app`)
2. Port `@theme` tokens from `DESIGN-FINDINGS.md` into `globals.css`
3. Wire `next/font/google` for Archivo, Hind Guntur, Shippori Antique
4. Build core components: `Button`, `Heading`, `BlogCard`, `FeaturedPost`, `Header`, `Footer`
5. Set up content collections + `validate-content.ts`
6. Draft 6 seed articles → route through clinical review
7. Connect Vercel, confirm preview deploys

---

**Open items for the practice to supply**
- [ ] Approved dentist review workflow + who signs off
- [ ] Licensed imagery (or budget for stock/licensed photography)
- [ ] Practice logo + brand asset usage permission
- [ ] Analytics property (GA4 / Plausible) and GSC verification
- [ ] Legal sign-off on disclaimer + privacy copy
- [ ] Email service provider, if pursuing Phase 2 subscribe flow
