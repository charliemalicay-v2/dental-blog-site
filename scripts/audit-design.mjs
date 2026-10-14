/**
 * Design-audit — re-verifies the live shallowfordds.com brand CSS against
 * DESIGN-FINDINGS.md.
 *
 * The origin refuses non-browser TLS fingerprints (Node/PowerShell/curl all get
 * 403), so this runs OFFLINE against a locally cached copy of the homepage.
 * Fetch the page once with a browser (or the harness web-fetch) and drop the
 * HTML in the input dir as `homepage.html`; any `sheet-*.css` files alongside
 * it are folded in too.
 *
 * It extracts the tokens we care about (fonts, colors, breakpoints, motion)
 * from the inline `cs-inline-css` Customizer block and diffs them against the
 * hexes/families recorded in DESIGN-FINDINGS.md.
 *
 * Usage:
 *   node scripts/audit-design.mjs [inputDir]
 */

import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const inDir = resolve(
  process.argv[2] ?? join(tmpdir(), "opencode", "design-audit"),
);
const outDir = inDir;

/* ------------------------------------------------------------------ *
 * Extraction helpers
 * ------------------------------------------------------------------ */

const uniq = (arr) => [...new Set(arr)];
const lc = (s) => s.toLowerCase();

function extractInlineStyle(html, id) {
  const re = new RegExp(
    `<style[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)</style>`,
    "i",
  );
  return html.match(re)?.[1] ?? "";
}

function fontFaces(css) {
  return [...css.matchAll(/@font-face\s*\{[^}]*\}/gi)].map((m) =>
    m[0].replace(/\s+/g, " ").trim(),
  );
}

const families = (css) =>
  uniq(
    [...css.matchAll(/font-family\s*:\s*([^;}]+)/gi)]
      .map((m) => m[1].replace(/!important/g, "").trim())
      .filter(Boolean),
  );

const hexes = (css) =>
  uniq([...css.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => lc(m[0]))).sort();

const rgbs = (css) =>
  uniq(
    [...css.matchAll(/rgba?\([^)]*\)/gi)].map((m) =>
      m[0].replace(/\s+/g, "").toLowerCase(),
    ),
  ).sort();

const mediaWidths = (css) =>
  uniq(
    [...css.matchAll(/@media[^{]*\(([^)]*?(?:width|resolution)[^)]*)\)/gi)].map(
      (m) => m[1].replace(/\s+/g, " ").trim(),
    ),
  ).sort();

const keyframes = (css) =>
  uniq([...css.matchAll(/@keyframes\s+([\w-]+)/gi)].map((m) => m[1])).sort();

const animationNames = (css) =>
  uniq(
    [...css.matchAll(/animation(?:-name)?\s*:\s*([^;}]+)/gi)]
      .flatMap((m) => m[1].split(","))
      .map((v) => v.trim().split(/\s+/)[0])
      .filter(Boolean),
  ).sort();

const uploads = (html) =>
  uniq(
    [...html.matchAll(/https?:\/\/[^"'\s)]*\/wp-content\/uploads\/[^"'\s)]+/gi)].map(
      (m) => m[0],
    ),
  ).sort();

/* ------------------------------------------------------------------ *
 * Load inputs
 * ------------------------------------------------------------------ */

const html = await readFile(join(inDir, "homepage.html"), "utf8");
const inline = extractInlineStyle(html, "cs-inline-css");

let sheetCss = "";
const entries = await readdir(inDir).catch(() => []);
for (const f of entries.filter((f) => /^sheet-.*\.css$/.test(f))) {
  sheetCss += "\n" + (await readFile(join(inDir, f), "utf8"));
}

// Fall back to the external sheet URLs if the cached page didn't inline them.
const combined = inline + "\n" + sheetCss;

/* ------------------------------------------------------------------ *
 * Documented tokens from DESIGN-FINDINGS.md
 * ------------------------------------------------------------------ */

let documentedHexes = [];
let documentedFamilies = [];
try {
  const findings = await readFile(
    join(repoRoot, "DESIGN-FINDINGS.md"),
    "utf8",
  );
  documentedHexes = hexes(findings);
  documentedFamilies = families(findings);
} catch {
  /* findings file optional */
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

const live = {
  inlineChars: inline.length,
  sheetFiles: entries.filter((f) => /^sheet-.*\.css$/.test(f)),
  fontFaces: fontFaces(html + sheetCss),
  families: families(combined),
  hexes: hexes(combined),
  rgbs: rgbs(combined),
  mediaWidths: mediaWidths(combined),
  keyframes: keyframes(combined),
  animationNames: animationNames(combined),
  uploads: uploads(html),
};

const documented = { hexes: documentedHexes, families: documentedFamilies };

const report = {
  auditedAt: new Date().toISOString(),
  source: "cached homepage.html + inline cs-inline-css",
  live,
  documented,
  diff: {
    // hexes present in the live CSS but NOT recorded in DESIGN-FINDINGS
    hexesNotDocumented: live.hexes.filter((h) => !documented.hexes.includes(h)),
    // hexes recorded in DESIGN-FINDINGS but NOT present in the live CSS
    documentedHexesNotLive: documented.hexes.filter(
      (h) => !live.hexes.includes(h),
    ),
    // font families referenced live but not documented
    familiesNotDocumented: live.families.filter(
      (f) =>
        !documentedFamilies.some((d) =>
          lc(d).includes(lc(f.replace(/["']/g, "").split(",")[0].trim())),
        ),
    ),
  },
};

await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "cs-inline-css.css"), inline, "utf8");
await writeFile(
  join(outDir, "tokens.json"),
  JSON.stringify(report, null, 2),
  "utf8",
);

console.log(`Input : ${inDir}`);
console.log(`Output: ${join(outDir, "tokens.json")}\n`);
console.log(
  `cs-inline-css: ${live.inlineChars} chars` +
    (live.inlineChars === 67282 ? "  ✔ matches DESIGN-FINDINGS (67,282)" : ""),
);
console.log(`font-family decls : ${live.families.length}`);
console.log(`@font-face        : ${live.fontFaces.length}`);
console.log(`hex colors        : ${live.hexes.length}`);
console.log(`rgba() colors     : ${live.rgbs.length}`);
console.log(`@media widths     : ${live.mediaWidths.length}`);
console.log(`@keyframes        : ${live.keyframes.length} → ${live.keyframes.join(", ")}`);
console.log(`uploads referenced: ${live.uploads.length}\n`);
console.log("── DRIFT ──────────────────────────────────────────");
console.log(
  `live hexes not in DESIGN-FINDINGS : ${report.diff.hexesNotDocumented.length}`,
);
console.log(
  `DESIGN-FINDINGS hexes not live    : ${report.diff.documentedHexesNotLive.length}`,
);
console.log(
  `font families not documented      : ${report.diff.familiesNotDocumented.length}`,
);
