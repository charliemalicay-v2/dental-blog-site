# Design System Findings — shallowfordds.com

Source: `https://shallowfordds.com/` (WordPress / Pro Theme "Integrity" stack)
Extracted from the live site's customizer CSS (`cs-inline-css`, 67,282 chars) and markup.
Date extracted: 2026-10-09
Re-verified: 2026-10-14 — **no drift**. `cs-inline-css` is byte-identical (67,282 chars) and every
documented brand token is still present. See "Re-verification" below.

> **Usage note:** Palette, typography, spacing, and component styling are replicated here as
> design tokens. Brand assets (logo, imagery) and the commercial `quartage` webfont are
> reproduced in this project at the owner's direction — each is recorded with source URL,
> retrieval date, and checksum in [`ASSET-PROVENANCE.md`](./ASSET-PROVENANCE.md).

---

## Re-verification — 2026-10-14

Re-ran the extraction with `scripts/audit-design.mjs` against a fresh capture of the homepage.

| Check | Result |
|-------|--------|
| `cs-inline-css` length | 67,282 chars — **byte-identical** to the original extraction |
| Brand hexes | all present (live uses `#ccc` / `#f1f1f100` shorthand where the doc wrote `#cccccc` / `#f1f1f1`) |
| Breakpoints | match — live media widths: `479, 766, 767, 978, 978.98, 1199, 1200` |
| Fonts | match — `quartage`, `Hind Guntur`, `Shippori Antique` |

**No corrections to the tokens above were required.** Two clarifications the audit added:

1. **Motion is JS-driven, not CSS** (see §6). `cs-inline-css` contains a single keyframe
   (`glowing`); the entrance animations come from the Cornerstone/Pro animation engine.
2. **The brand logo is supplied as an SVG** that wraps a raster PNG data-URI, not true vector
   artwork (see §8).

---

## 1. Typography

| Role | Font | Source | Details |
|------|------|--------|---------|
| Headings | **Quartage** | Self-hosted `.woff` (commercial) | `font-weight: bolder`, `letter-spacing: -0.035em` |
| Body / UI | **Hind Guntur** | Google Fonts | weights 300 / 400 / 600 / 700 + italics |
| Watermark / decor | **Shippori Antique** | Google Fonts | 100–150px, `color: transparent` |
| Secondary | **Karla** | Google Fonts | 400 / 600 / 700 |
| Icons | FontAwesome (Pro, Light, Regular, Brands) | Self-hosted | — |

### Rules
```css
body, input, button, select, textarea { font-family: "Hind Guntur", sans-serif; }

h1,h2,h3,h4,h5,h6,
.x-text-headline { font-family: "quartage", sans-serif; font-weight: bolder; }

h1,h2,h3,h4,h5,h6 { letter-spacing: -0.035em; }
```

### Type scale observed (px)
`15, 16, 17, 18, 20, 22, 23, 24, 25, 27, 28, 30, 35, 36, 38, 40, 44, 45, 50, 55, 60, 65, 76, 100, 150`

- Body / entry content: **16px** Hind Guntur
- Blog author meta: **16px**, `letter-spacing: 0.12em`, `text-transform: uppercase`
- Blog card title (featured): **38px**
- Watermark text: **150px** desktop → **100px** mobile, Shippori Antique, transparent fill

### Quartage — now self-hosted
> **Update 2026-10-14:** the real Quartage webfont is self-hosted at
> `public/fonts/quartage-webfont.woff` and loaded via `next/font/local`
> (`--font-quartage`) in `src/app/layout.tsx`. The earlier Archivo stand-in has been removed.
> See [`ASSET-PROVENANCE.md`](./ASSET-PROVENANCE.md) §3 for the licensing note — **confirm the
> web licence covers this domain.**

Quartage ships a **single weight**, so headings reach bold via `font-weight: bolder`
(i.e. synthetic emboldening) — exactly what the source does.

---

## 2. Color Palette

### Brand reds (primary CTA ramp)
| Token | Hex | Usage |
|-------|-----|-------|
| `brand` | `#ff2a13` | Button background |
| `brand-hover` | `#ef2201` | Button hover background |
| `brand-border` | `#ac1100` | Button border |
| `brand-shadow` | `#a71000` | Hard offset shadow |
| `brand-deep` | `#600900` | Button hover border |

### Ink & neutrals
| Token | Hex | Usage |
|-------|-----|-------|
| `ink` | `#272727` | Headings, strong labels |
| `body` | `#000000` | Body text, default links |
| `nav` | `#1a1a1a` | Header bar, off-canvas menu bg |
| `muted` | `#6a6a6a` | Secondary / muted text & icons |

### Accents
| Token | Hex | Usage |
|-------|-----|-------|
| `navy` | `#09263D` | Dark section background |
| `teal` | `#1A3637` | **Blog-only** dividers, load-more border, sticky post border |
| `link` | `#289EFF` | **Blog-only** link + card-title hover |

### Neutrals
| Token | Value | Usage |
|-------|-------|-------|
| `surface` | `#F1F1F1` | Row background |
| `line` | `#dddddd` | Borders |
| `placeholder` | `#ccc` | Thumbnail placeholder bg |

### Overlays
```css
rgba(0,0,0,0.4)   /* card overlay panel default */
rgba(0,0,0,0.76)  /* card overlay panel hover */
rgba(0,0,0,0.25)  /* soft shadow */
rgba(0,0,0,0.5)   /* button text-shadow */
rgba(255,255,255,0.07) /* header border / shadow */
```

---

## 3. Buttons

### Solid (primary CTA)
```css
color: #ffffff;
border-color: #ac1100;
background-color: #ff2a13;
text-shadow: 0 0.075em 0.075em rgba(0,0,0,0.5);
box-shadow: 0 0.25em 0 0 #a71000, 0 4px 9px rgba(0,0,0,0.75);
border-radius: 0.25em;
/* hover */
background-color: #ef2201;
border-color: #600900;
```

### Outline (header / secondary)
```css
border: 3px solid #fff;          /* inverts to #000 on hover */
background-color: transparent;
text-transform: uppercase;
letter-spacing: 0.1em;
padding: 0.85em;                 /* top 0.85em / bottom 0.7em */
font-size: 1em;
line-height: 1;
```

### Shared characteristics
- **3px** border width
- **Uppercase**, `letter-spacing: 0.1em` (with `margin-right: -0.1em` compensation)
- Border radius `0.25em`
- Icons flip color on hover (white → black)

---

## 4. Layout & Components

### Header bar
```css
background-color: #1a1a1a;
border-bottom: 1px solid rgba(255,255,255,0.07);
box-shadow: 0 3px 25px 0 rgba(255,255,255,0.07);
```
Sticky with shrink-on-scroll. Logo left, phone + "Book Now" outline buttons right, burger toggle.

### Image cards (service cards)
```css
.overlay        { background-color: rgba(0,0,0,0.4); }
.overlay:hover  { background-color: rgba(0,0,0,0.76); }
padding: 30px 30px 20px;
```

### Blog grid
```css
.theme_blog_posts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 64px 24px;
}
@media (max-width: 978px) { grid-template-columns: 1fr; }
```

### Blog card
```css
.blog_thumb a {
  display: block; position: relative;
  padding-bottom: 102%;      /* aspect box */
  background: #ccc;
}
.blog_thumb a img {
  position: absolute; left: 0; top: 0;
  width: 100%; height: 100%; object-fit: cover;
}
.blog_title        { margin: 0; padding-top: 24px; max-width: 80%; }
.blog_title h4 a   { color: #000; line-height: 1.2;
                     font-family: "quartage", sans-serif;
                     text-transform: capitalize; }
.blog_title h4 a:hover { color: #289eff; }
.blog_author       { font-size: 16px; letter-spacing: 0.12em;
                     text-transform: uppercase; padding-top: 24px;
                     font-family: "Hind Guntur", sans-serif; }
```

### Featured / sticky post
```css
.blog_sticky {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 0 24px;
}
.blog_sticky .blog_thumb a        { padding-bottom: 65%; }
.blog_sticky .blog_content        { border-top: 3px solid #1A3637; }
.blog_sticky .blog_title h4 a     { font-size: 38px; }
@media (max-width: 978px) {
  .blog_sticky                    { grid-template-columns: 1fr; }
  .blog_sticky .blog_content      { padding-left: 24px; padding-right: 24px; border: none; }
}
```

### Load-more divider
```css
.theme_load_more_wrap {
  width: 100%;
  border-top: 3px solid #1A3637;
  padding-top: 16px; margin-top: 40px;
  display: flex; justify-content: flex-end;
}
.theme_load_more_posts {
  font-size: 22px; color: #1a3637;
  line-height: 1.5; cursor: pointer;
}
.theme_load_more_posts:hover { text-decoration: underline; }
```

### Watermark text (decorative)
```css
font-family: "Shippori Antique", sans-serif;
font-size: 150px;          /* 100px mobile */
color: transparent;
line-height: 0.95;
/* positioned e.g. left: 150px; bottom: -30px; */
```
Used for lowercase eyebrow words: `welcome`, `treatments`, `your smile expert`.

---

## 5. Section rhythm
```css
/* typical section padding */
padding-top: 60px–80px;
padding-bottom: 20px–130px;
/* tablet */
padding-top: 50px; padding-bottom: 50px;
/* mobile */
padding-top: 40px; padding-bottom: 40px;
```

### Breakpoints
| Token | Range |
|-------|-------|
| xs | `< 480px` |
| sm | `480 – 766px` |
| md | `767 – 978px` |
| lg | `979 – 1199px` |
| xl | `≥ 1200px` |

Blog collapses to single column at **978px**.

---

## 6. Motion

> ⚠️ **Audit correction (2026-10-14):** these effects are produced by the Pro/Cornerstone
> **JavaScript animation engine**, not CSS. `cs-inline-css` contains exactly one keyframe
> (`glowing`). Reproducing this section means re-implementing the *effect*, not copying a
> `@keyframes` block.

Scroll-triggered entrance animations (fire-once), all paired with a `rollOut` exit:

| Primitive | Applied by the source to | Count on homepage |
|-----------|--------------------------|-------------------|
| `slideInUp` | headings, body text, buttons | 17 |
| `slideInLeft` / `slideInRight` | images, cards | — |
| `zoomIn` | standalone `x-line` rule + `x-text-headline` text blocks (`animationEnter: zoomIn`) | 4 |
| `pulse` | the Google-review CTA image and the EmbedSocial widget, via `animationAlt`; also one scroll **exit** effect | 3 |

#### Implementation status in this repo

The motion system is `src/components/motion/Reveal.tsx` plus the `.reveal*` utilities in
`globals.css`. Verified by computed style in Chromium.

| Source primitive | Status here | Wired at |
|------------------|-------------|----------|
| `slideInUp` | `Reveal` default — `.reveal` | cards, hero, featured post, section blocks |
| `slideInLeft` / `slideInRight` | `variant="left"` / `variant="right"` — `.reveal-left` / `.reveal-right` | home hero image |
| `zoomIn` | `variant="zoom"` — `.zoom-in` | blog index headline block (accent rule + eyebrow + `h1`) — the source's rule+headline pattern |
| `pulse` | **not implemented** | The source applies it only to a Google-review CTA and an EmbedSocial widget; neither component exists on this hub, so the utility would be dead code. Re-add if a review CTA is ever built. |

All implemented variants collapse to their final state under `prefers-reduced-motion: reduce`.
The paired `rollOut` **exit** animations are deliberately not reproduced — every reveal here is
`fire-once` and persists, which is the dominant source behaviour.

---

## 7. Summary token block (Tailwind v4 `@theme` ready)

```css
@theme {
  /* brand */
  --color-brand:        #ff2a13;
  --color-brand-hover:  #ef2201;
  --color-brand-border: #ac1100;
  --color-brand-shadow: #a71000;
  --color-brand-deep:   #600900;

  /* ink */
  --color-ink:          #272727;
  --color-body:         #000000;
  --color-nav:          #1a1a1a;
  --color-muted:        #6a6a6a;

  /* accents */
  --color-navy:         #09263d;
  --color-teal:         #1a3637;
  --color-link:         #289eff;

  /* neutrals */
  --color-surface:      #f1f1f1;
  --color-line:         #dddddd;
  --color-placeholder:  #cccccc;

  /* type */
  --font-display: var(--font-quartage), "Hind Guntur", sans-serif;
  --font-body:    var(--font-hind-guntur), sans-serif;
  --font-decor:   var(--font-shippori-antique), serif;

  /* shape */
  --radius-btn:   0.25em;
  --shadow-btn:   0 0.25em 0 0 #a71000, 0 4px 9px rgba(0,0,0,0.75);
}
```

---

## 8. Asset inventory (from re-verification)

Brand assets referenced by the live homepage. **All of the below are downloaded and committed**
to `public/` (plus the favicon set in `src/app/`), with source URL, byte size, format and
SHA-256 recorded in [`ASSET-PROVENANCE.md`](./ASSET-PROVENANCE.md) and
`scripts/brand-assets-manifest.json`. Re-fetch at any time with `scripts/fetch-brand-assets.mjs`.

### Identity
| Asset | URL path | Notes |
|-------|----------|-------|
| Logo (current) | `/wp-content/uploads/2025/05/roswell-dentist-shallowford-dental-studio-logo.svg` | 759×161 — **SVG wrapping an embedded raster PNG**, not true vector |
| Logo (older) | `/wp-content/uploads/2024/11/img-logo-1.svg` | — |
| Logo (PNG) | `/wp-content/uploads/2025/05/shallowford-dental-studio-dentist-roswell.png` | — |
| Favicon | `/wp-content/uploads/2024/11/img-favicon.png` · `img-favicon-100x100.png` | — |
| OG card | `/wp-content/uploads/2024/11/img-Shallowford-Dental-Studio-1200x675-1.png` | 1200×675 |

### Photography
| Asset | URL path |
|-------|----------|
| Home hero | `/wp-content/uploads/2025/02/img-home-banner.jpg` · `img-home-banner-2.jpg` |
| Office | `/wp-content/uploads/2025/05/shallowfordds-dental-office-roswell.jpg` |
| Practitioner | `/wp-content/uploads/2025/05/dr-lucy-sedrakyan-dmd-roswell-dentist.jpg` · `/2024/11/Dr.-Lusine-Sedrakyan.png` |
| Service — implants | `/wp-content/uploads/2025/05/dental-implants-shallowford-dental-studio-of-roswell-ga.webp` |
| Service — Invisalign | `/wp-content/uploads/2025/05/invisalign-shallowford-dental-studio-of-roswell.webp` |
| Service — preventive | `/wp-content/uploads/2025/05/preventive-dental-care-roswell-ga.jpg` |
| Invisalign logo | `/wp-content/uploads/2024/11/img-logo-invisalign.png` |

### Typography
| Asset | URL path | Status |
|-------|----------|--------|
| Quartage (commercial) | `/wp-content/uploads/2024/11/quartage-webfont.woff` | **Self-hosted** at `public/fonts/quartage-webfont.woff`, loaded via `next/font/local` in `src/app/layout.tsx` |
| FontAwesome Pro (5 faces) | `/wp-content/themes/pro/cornerstone/assets/fonts/fa-*.woff2` | **Not copied** — a separate commercial licence, and no glyphs from it are used on this hub |

> Note: the practitioner is named **Dr. Lucy Sedrakyan** in `src/lib/constants.ts`, and all
> content frontmatter agrees. The source ships **two** spellings — a portrait
> (`dr-lucy-sedrakyan-dmd-roswell-dentist.jpg`) and a 434×84 signature/wordmark
> (`Dr.-Lusine-Sedrakyan.png`) — so *Lusine* is likely the given name and *Lucy* the
> professional form. Confirm the preferred spelling with the practice before treating
> author/attribution pages as final. See [`ASSET-PROVENANCE.md`](./ASSET-PROVENANCE.md) §4.
