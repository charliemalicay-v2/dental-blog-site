# Asset Provenance

Record of every third-party brand asset copied into this repository, where it
came from, and how to verify it. Created because the brand identity, photography
and display typeface belong to **Shallowford Dental Studio** and are used here at
the site owner's direction — this file is the audit trail.

- **Source origin:** `https://shallowfordds.com` (WordPress media library)
- **Retrieved:** 2026-10-14
- **Retrieved by:** `scripts/fetch-brand-assets.mjs`
- **Machine-readable manifest:** [`scripts/brand-assets-manifest.json`](scripts/brand-assets-manifest.json)

---

## 1. Copied assets

All files land in `public/`. SHA-256 is shown truncated to 12 hex characters —
the full 64-character digest for every file is in
`scripts/brand-assets-manifest.json`.

| Destination | Source (under `/wp-content/uploads/`) | Format | Size (B) | SHA-256 (12) |
| --- | --- | --- | ---: | --- |
| `fonts/quartage-webfont.woff` | `2024/11/quartage-webfont.woff` | WOFF | 23,904 | `898b7940bbc3` |
| `images/logo.svg` | `2025/05/roswell-dentist-shallowford-dental-studio-logo.svg` | SVG | 92,051 | `ca5f30b1be43` |
| `images/logo.png` | `2025/05/shallowford-dental-studio-dentist-roswell.png` | PNG | 44,192 | `d928589d45e1` |
| `images/favicon.png` | `2024/11/img-favicon.png` | PNG | 9,264 | `8364754f3eeb` |
| `images/favicon-100x100.png` | `2024/11/img-favicon-100x100.png` | PNG | 3,140 | `b4068ea88021` |
| `images/og-default.png` | `2024/11/img-Shallowford-Dental-Studio-1200x675-1.png` | PNG | 29,230 | `b77421629a8c` |
| `images/logo-invisalign.png` | `2024/11/img-logo-invisalign.png` | PNG | 43,827 | `06dfe43ff463` |
| `images/hero.jpg` | `2025/02/img-home-banner.jpg` | JPEG | 1,270,364 | `ac0622de085d` |
| `images/hero-2.jpg` | `2025/02/img-home-banner-2.jpg` | JPEG | 1,542,466 | `008c2e158347` |
| `images/office.jpg` | `2025/05/shallowfordds-dental-office-roswell.jpg` | JPEG | 366,561 | `2de28f75e1e7` |
| `images/dr-lucy-sedrakyan.jpg` | `2025/05/dr-lucy-sedrakyan-dmd-roswell-dentist.jpg` | JPEG | 198,576 | `7c4459f37336` |
| `images/dr-lusine-sedrakyan.png` | `2024/11/Dr.-Lusine-Sedrakyan.png` | PNG | 7,126 | `d92414695d3a` |
| `images/service-implants.webp` | `2025/05/dental-implants-shallowford-dental-studio-of-roswell-ga.webp` | WEBP | 332,490 | `46fcc0257e04` |
| `images/service-invisalign.webp` | `2025/05/invisalign-shallowford-dental-studio-of-roswell.webp` | WEBP | 48,272 | `eb138fb7e31e` |
| `images/service-preventive.jpg` | `2025/05/preventive-dental-care-roswell-ga.jpg` | JPEG | 68,036 | `0164329bb05f` |
| `images/g-star.png` | `2024/10/img-g-star.png` | PNG | 1,380 | `8fda3ee4586a` |
| `images/decor-vector-5.svg` | `2024/11/Vector-5.svg` | SVG | 466 | `869ba4a6fa67` |

### Derived files

| Destination | Derived from | Note |
| --- | --- | --- |
| `src/app/favicon.ico` | `images/favicon.png` | 250×250 PNG wrapped as a Vista PNG-in-ICO. Replaced the Next.js starter icon. |
| `src/app/icon.png` | `images/favicon.png` | Same 250×250 source; satisfies Next's `icon` convention. |
| `src/app/apple-icon.png` | `images/favicon.png` | Same 250×250 source; satisfies the `apple-icon` convention. |

### Notable dimensions

`logo.png` 1242×261 · `logo.svg` 759×161 · `favicon.png` 250×250 ·
`og-default.png` 1200×675 (canonical Open Graph size) · `hero.jpg` 1920×1019 ·
`dr-lucy-sedrakyan.jpg` 550×720 · `office.jpg` 670×775 ·
`service-*.{webp,jpg}` ≈523×700 · `dr-lusine-sedrakyan.png` 434×84 (a
signature/wordmark, **not** a portrait) · `logo-invisalign.png` 1410×368 ·
`g-star.png` 150×33 (rating strip).

---

## 2. Acquisition notes

Two obstacles shaped the fetch method:

1. **The origin refuses non-browser TLS fingerprints.** Plain Node `fetch`,
   PowerShell `Invoke-WebRequest` and `curl.exe` all return HTTP **403**. The
   script therefore drives real Chromium via Playwright and fetches from inside
   the page context, where the same-origin request carries a browser network
   fingerprint.
2. **The origin content-negotiates images and ignores `Accept`.** Image URLs are
   served through a WebP rewrite, so requesting `…/logo.png` returns **WebP
   bytes** with a `Content-Type: image/webp` header — even when `Accept:
   image/png` is sent explicitly. The rewrite only matches the clean path, so
   appending a query string (`?orig=1`) bypasses it and returns the canonical
   original. Without this, 9 of the 17 files would have been WebP wearing a
   `.png`/`.jpg` extension.

The script asserts the magic-byte signature of every download against the
declared extension (`formatOk` in the manifest), so an extension/format
mismatch cannot pass silently.

### Verifying the committed files

```bash
# Re-download and compare (requires a one-off Playwright install):
npm i --no-save playwright && npx playwright install chromium
node scripts/fetch-brand-assets.mjs public scripts/brand-assets-manifest.json

# Or verify what is on disk against the committed manifest:
node -e "
const m=require('./scripts/brand-assets-manifest.json'),{createHash}=require('crypto'),{readFileSync}=require('fs');
let ok=0,bad=0;
for(const a of m){const b=readFileSync('public/'+a.dest);
const h=createHash('sha256').update(b).digest('hex');
(h===a.sha256&&b.length===a.bytes)?ok++:(bad++,console.log('DRIFT',a.dest));}
console.log(ok+' ok, '+bad+' drift');"
```

Last run: **17 ok, 0 drift.**

---

## 3. Licensing and attribution

These assets are **not** ours to relicense. They remain the property of their
owners and are reproduced here only because this hub site is published in
connection with the same practice.

| Asset | Rights holder | Status |
| --- | --- | --- |
| `quartage-webfont.woff` | Quartage typeface vendor (commercial) | Self-hosted at the owner's direction. **Confirm a web licence covers this domain** — a commercial webfont licence is usually per-site. This is the single highest-risk item in this repository. |
| `logo*.svg`, `logo*.png`, `favicon*`, `og-default.png` | Shallowford Dental Studio | Practice brand marks used by the practice's own hub site. |
| `hero*.jpg`, `office.jpg`, `service-*.{webp,jpg}` | Shallowford Dental Studio / photographer | Practice photography. Confirm the photographer's licence permits reuse on this domain. |
| `dr-lucy-sedrakyan.jpg`, `dr-lusine-sedrakyan.png` | Shallowford Dental Studio | Team likeness + signature — a **person's** image, so keep it accurate and current. |
| `logo-invisalign.png`, `g-star.png` | Align Technology / Google | Third-party trademarks used descriptively with the practice's alignment provider and review profile. Do not restyle or imply endorsement beyond existing use. |

### Deliberately **not** copied

| Item | Why |
| --- | --- |
| **FontAwesome Pro** (5 commercial faces) | Part of the source's icon system, but a separate commercial licence and unnecessary here — the site uses inline SVG/none of those glyphs. |
| **Karla** | Appears in the source's Google Fonts query but not in any `font-family` declaration (see `DESIGN-FINDINGS.md` § Typography). Not a real brand face. |
| **EmbedSocial widget assets**, Google review CTA image, `img-gradient-menu-bg.jpg`, `menu_image.jpg`, `img-bg-4.jpg`, `img-gb.jpg`, `Rectangle-12.jpg`, `Star-new.png`, `img-video-thumb-banner.jpg`, `img-logo-1.svg` | Layout/decorative assets belonging to widgets, the marketing homepage or a superseded logo (`img-logo-1.svg`, 2024/11) — no equivalent component on this hub. |

---

## 4. Open item — reviewer name

The source ships **both** spellings and this repository uses only one:

- `Dr.-Lusine-Sedrakyan.png` (434×84 wordmark/signature)
- `dr-lucy-sedrakyan-dmd-roswell-dentist.jpg` (portrait)

`src/lib/constants.ts` and all content frontmatter use **Dr. Lucy Sedrakyan**.
These are almost certainly the same person — *Lusine* being the given name and
*Lucy* the professional/preferred form. **Needs confirmation from the practice**
before any author-identity or E-E-A-T page is considered final, since
`scripts/validate-content.ts` treats the reviewer as an attribution field.
