# Design System Findings — shallowfordds.com

Source: `https://shallowfordds.com/` (WordPress / Pro Theme "Integrity" stack)
Extracted from the live site's customizer CSS (`cs-inline-css`, 67,282 chars) and markup.
Date extracted: 2026-10-09

> **Usage note:** Palette, typography, spacing, and component styling are replicated here as
> design tokens. The site's images, logo, written copy, and the commercial `quartage` webfont
> binary are **not** reproduced.

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

### Quartage substitution (recommended)
Quartage is a commercial typeface self-hosted by the site. Use a free lookalike:
- **Archivo** (primary recommendation — geometric grotesque, holds heavy weights at `-0.035em`)
- Alternates: Familjen Grotesk, Bricolage Grotesque, Schibsted Grotesk

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
Scroll-triggered entrance animations (fire-once), all paired with a `rollOut` exit:
- `slideInUp` — headings, body text, buttons
- `slideInLeft` / `slideInRight` — images, cards
- `zoomIn` — decorative elements
- `pulse` — review/rating widget

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
  --font-display: var(--font-archivo), "Hind Guntur", sans-serif;
  --font-body:    var(--font-hind-guntur), sans-serif;
  --font-decor:   var(--font-shippori-antique), serif;

  /* shape */
  --radius-btn:   0.25em;
  --shadow-btn:   0 0.25em 0 0 #a71000, 0 4px 9px rgba(0,0,0,0.75);
}
```
