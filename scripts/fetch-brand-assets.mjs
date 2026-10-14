/**
 * Brand-asset migration for the shallowfordds.com design rebuild.
 *
 * Re-downloads the practice's brand identity, photography and commercial
 * display font into public/, and writes a manifest of SHA-256 hashes that
 * ASSET-PROVENANCE.md is derived from.
 *
 * Why a real browser is required
 * ------------------------------
 * The origin refuses non-browser TLS fingerprints — plain Node `fetch`,
 * PowerShell and curl all receive HTTP 403. This drives Chromium via Playwright
 * and fetches from inside the page context (real network stack, same-origin).
 *
 * Why the `?orig=1` query string
 * ------------------------------
 * The origin content-negotiates: a rewrite serves WebP (and ignores the Accept
 * header) for image URLs, so a "logo.png" request returns WebP bytes. The
 * rewrite only matches the clean path, so appending any query string bypasses
 * it and returns the canonical original. The signature check below then proves
 * the declared extension matches the actual bytes.
 *
 * Requirements (one-off; Playwright is intentionally not a project dependency)
 * ---------------------------------------------------------------------------
 *   npm i --no-save playwright && npx playwright install chromium
 *
 * Usage
 * -----
 *   node scripts/fetch-brand-assets.mjs [outDir] [manifestPath]
 *   node scripts/fetch-brand-assets.mjs public scripts/brand-assets-manifest.json
 */

import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, dirname, extname } from "node:path";

const BASE = "https://shallowfordds.com/wp-content/uploads/";
const OUT = process.argv[2] ?? "public";
const MANIFEST_OUT = process.argv[3] ?? "scripts/brand-assets-manifest.json";

/** [ source path under /uploads/, destination relative to outDir ] */
const MANIFEST = [
  // Typography
  ["2024/11/quartage-webfont.woff", "fonts/quartage-webfont.woff"],
  // Identity
  ["2025/05/roswell-dentist-shallowford-dental-studio-logo.svg", "images/logo.svg"],
  ["2025/05/shallowford-dental-studio-dentist-roswell.png", "images/logo.png"],
  ["2024/11/img-favicon.png", "images/favicon.png"],
  ["2024/11/img-favicon-100x100.png", "images/favicon-100x100.png"],
  ["2024/11/img-Shallowford-Dental-Studio-1200x675-1.png", "images/og-default.png"],
  ["2024/11/img-logo-invisalign.png", "images/logo-invisalign.png"],
  // Photography
  ["2025/02/img-home-banner.jpg", "images/hero.jpg"],
  ["2025/02/img-home-banner-2.jpg", "images/hero-2.jpg"],
  ["2025/05/shallowfordds-dental-office-roswell.jpg", "images/office.jpg"],
  ["2025/05/dr-lucy-sedrakyan-dmd-roswell-dentist.jpg", "images/dr-lucy-sedrakyan.jpg"],
  ["2024/11/Dr.-Lusine-Sedrakyan.png", "images/dr-lusine-sedrakyan.png"],
  ["2025/05/dental-implants-shallowford-dental-studio-of-roswell-ga.webp", "images/service-implants.webp"],
  ["2025/05/invisalign-shallowford-dental-studio-of-roswell.webp", "images/service-invisalign.webp"],
  ["2025/05/preventive-dental-care-roswell-ga.jpg", "images/service-preventive.jpg"],
  // Decorative
  ["2024/10/img-g-star.png", "images/g-star.png"],
  ["2024/11/Vector-5.svg", "images/decor-vector-5.svg"],
];

const ACCEPT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
};

const EXPECTED = {
  ".png": ["PNG"],
  ".jpg": ["JPEG"],
  ".jpeg": ["JPEG"],
  ".webp": ["WEBP"],
  ".svg": ["SVG"],
  ".woff": ["WOFF"],
};

/** Detect the real container from magic bytes. */
function sniff(buf) {
  if (buf.length < 12) return "too-small";
  const ascii = (a, b) => buf.subarray(a, b).toString("latin1");
  if (buf[0] === 0x89 && ascii(1, 4) === "PNG") return "PNG";
  if (ascii(0, 4) === "wOFF") return "WOFF";
  if (ascii(0, 4) === "RIFF") return ascii(8, 12) === "WEBP" ? "WEBP" : "RIFF";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "JPEG";
  if (ascii(0, 4).trim().startsWith("<svg") || ascii(0, 5).includes("<?xml"))
    return "SVG";
  return "unknown";
}

const browser = await chromium.launch();
const page = await browser.newPage();

// Establish a real browser session on the origin first (clears any challenge,
// and makes the subsequent fetch() calls same-origin).
await page.goto("https://shallowfordds.com/", {
  waitUntil: "domcontentloaded",
  timeout: 60_000,
});
await page.waitForTimeout(2500);

const results = [];
let bad = 0;

for (const [src, dest] of MANIFEST) {
  const url = `${BASE}${src}?orig=1`;
  const accept = ACCEPT[extname(dest)] ?? "*/*";

  let buf;
  let lastErr;
  for (let attempt = 1; attempt <= 2 && !buf; attempt++) {
    try {
      const b64 = await page.evaluate(
        async ({ u, a }) => {
          const r = await fetch(u, { credentials: "omit", headers: { Accept: a } });
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          const bytes = new Uint8Array(await r.arrayBuffer());
          let s = "";
          const CH = 0x8000;
          for (let i = 0; i < bytes.length; i += CH) {
            s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
          }
          return btoa(s);
        },
        { u: url, a: accept },
      );
      buf = Buffer.from(b64, "base64");
    } catch (e) {
      lastErr = e;
    }
  }

  if (!buf || buf.length === 0) {
    console.log(`ERR  ${dest}  (${lastErr?.message ?? "empty"})`);
    results.push({ src, dest, url, error: String(lastErr?.message ?? "empty") });
    bad++;
    continue;
  }

  const abs = join(OUT, dest);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, buf);

  const ext = extname(dest);
  const real = sniff(buf);
  const okFormat = (EXPECTED[ext] ?? []).includes(real);
  if (!okFormat) bad++;

  results.push({
    src,
    dest,
    url,
    bytes: buf.length,
    format: real,
    formatOk: okFormat,
    sha256: createHash("sha256").update(buf).digest("hex"),
  });
  console.log(
    `${okFormat ? "ok " : "BAD"} ${String(buf.length).padStart(9)} B  ${real.padEnd(6)} ${dest}`,
  );
}

await writeFile(MANIFEST_OUT, JSON.stringify(results, null, 2) + "\n", "utf8");
await browser.close();

console.log(
  `\n${results.filter((r) => !r.error).length}/${results.length} downloaded, ${bad} problems → ${OUT}`,
);
console.log(`manifest → ${MANIFEST_OUT}`);
