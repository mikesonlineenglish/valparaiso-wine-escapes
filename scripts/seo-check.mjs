#!/usr/bin/env node
// Post-build checks against the actual built output in dist/ — not the source, not the
// dev server. Run after `npm run build`.
//
//  1. Trailing-slash regression check: every internal href (starts with "/", isn't the
//     root path, isn't a direct file with an extension) must end with "/", to match
//     astro.config.mjs's `trailingSlash: "always"` and how GitHub Pages actually serves
//     directory-format output. A bare "/tours/foo" costs an extra redirect on every click.
//  2. Broken-link check: every internal href must resolve to a real file in dist/ — either
//     <path>/index.html or <path>.html (or the literal file itself for hrefs with an
//     extension). Catches links to pages that don't exist yet.
//  3. Currency-amount check: every meta description and JSON-LD "description" field that
//     mentions a currency code (CLP/USD) must actually show an amount near it — catches
//     the "Prices from CLP per person" bug (interpolation silently dropped, code renders,
//     amount doesn't).
//  4. Ambiguous-price check: no visible price may render as a bare "$" + digits (reads as
//     USD to an English-speaking visitor) — prices must show the currency code.

import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const DIST_DIR = join(process.cwd(), "dist");

function findHtmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...findHtmlFiles(full));
    } else if (entry.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

function extractHrefs(html) {
  const hrefs = [];
  const re = /href\s*=\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html))) {
    hrefs.push(m[1]);
  }
  return hrefs;
}

/** True if `href` is a site-relative absolute path we care about (not external, not
 * mailto/tel, not a fragment-only same-page anchor, not protocol-relative). */
function isInternalPath(href) {
  if (!href.startsWith("/")) return false;
  if (href.startsWith("//")) return false; // protocol-relative external URL
  return true;
}

function splitSuffix(href) {
  const match = href.match(/^([^?#]*)([?#].*)?$/);
  return { base: match ? match[1] : href, suffix: match && match[2] ? match[2] : "" };
}

/** Violates the trailing-slash convention: starts with "/", has no file extension,
 * isn't exactly "/", and doesn't end with "/" (ignoring ?query/#fragment). */
function violatesTrailingSlash(href) {
  if (!isInternalPath(href)) return false;
  if (href === "/") return false;

  const { base } = splitSuffix(href);
  if (base === "") return false;
  if (base.endsWith("/")) return false;

  const lastSegment = base.slice(base.lastIndexOf("/") + 1);
  if (lastSegment.includes(".")) return false; // direct file path (has an extension)

  return true;
}

/** Whether `href` resolves to a real file under dist/. */
function resolvesToFile(href) {
  const { base } = splitSuffix(href);
  const path = base === "" ? "/" : base;
  const relative = path.startsWith("/") ? path.slice(1) : path;

  if (path.endsWith("/")) {
    return existsSync(join(DIST_DIR, relative, "index.html"));
  }

  if (extname(relative)) {
    return existsSync(join(DIST_DIR, relative));
  }

  // No trailing slash and no extension — could still resolve as path.html.
  return existsSync(join(DIST_DIR, relative)) || existsSync(join(DIST_DIR, `${relative}.html`));
}

/** A currency code with no amount nearby — only whitespace may separate the code from
 * the first digit; anything else (a word, punctuation, end of string) is a violation. */
const CURRENCY_WITHOUT_AMOUNT_RE = /\b(?:CLP|USD)\b(?!\s*\d)/g;

function findCurrencyWithoutAmount(text) {
  return [...text.matchAll(CURRENCY_WITHOUT_AMOUNT_RE)].map((m) => {
    const start = Math.max(0, m.index - 20);
    const end = Math.min(text.length, m.index + 30);
    return text.slice(start, end).trim();
  });
}

/** Recursively collects every string found under a "description" key in a JSON-LD object. */
function collectJsonLdDescriptions(node, out) {
  if (Array.isArray(node)) {
    for (const item of node) collectJsonLdDescriptions(item, out);
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "description" && typeof value === "string") {
        out.push(value);
      } else {
        collectJsonLdDescriptions(value, out);
      }
    }
  }
}

function extractDescriptions(html) {
  const descriptions = [];

  const metaMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/);
  if (metaMatch) descriptions.push(metaMatch[1]);

  const scriptRe = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
  let m;
  while ((m = scriptRe.exec(html))) {
    try {
      collectJsonLdDescriptions(JSON.parse(m[1]), descriptions);
    } catch {
      // not valid JSON — not our concern here, the build would have failed elsewhere
    }
  }

  return descriptions;
}

/** Visible body text only — strips scripts and tags, matching how a reader (or a search
 * snippet) would actually see the page, so this doesn't false-positive on markup/JSON. */
function extractVisibleText(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  const body = bodyMatch ? bodyMatch[1] : html;
  return body
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const BARE_DOLLAR_RE = /\$\d/g;

function findBareDollarPrices(text) {
  return [...text.matchAll(BARE_DOLLAR_RE)].map((m) => {
    const start = Math.max(0, m.index - 15);
    const end = Math.min(text.length, m.index + 15);
    return text.slice(start, end).trim();
  });
}

function main() {
  if (!existsSync(DIST_DIR)) {
    console.error(`seo-check: ${DIST_DIR} does not exist — run \`npm run build\` first.`);
    process.exit(1);
  }

  const htmlFiles = findHtmlFiles(DIST_DIR);
  const slashViolations = [];
  const brokenLinks = [];
  const missingAmounts = [];
  const bareDollarPrices = [];

  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    const relFile = file.slice(DIST_DIR.length + 1).replace(/\\/g, "/");
    const hrefs = extractHrefs(html);
    const seen = new Set();

    for (const href of hrefs) {
      if (seen.has(href)) continue;
      seen.add(href);

      if (violatesTrailingSlash(href)) {
        slashViolations.push({ file: relFile, href });
      }

      if (isInternalPath(href) && !resolvesToFile(href)) {
        brokenLinks.push({ file: relFile, href });
      }
    }

    for (const description of extractDescriptions(html)) {
      for (const snippet of findCurrencyWithoutAmount(description)) {
        missingAmounts.push({ file: relFile, snippet });
      }
    }

    for (const snippet of findBareDollarPrices(extractVisibleText(html))) {
      bareDollarPrices.push({ file: relFile, snippet });
    }
  }

  console.log(`seo-check: scanned ${htmlFiles.length} HTML file(s) in dist/\n`);

  console.log("--- Trailing-slash check ---");
  if (slashViolations.length === 0) {
    console.log("OK — every internal href ends with a trailing slash.\n");
  } else {
    console.log(`FAIL — ${slashViolations.length} internal href(s) missing a trailing slash:\n`);
    for (const { file, href } of slashViolations) {
      console.log(`  ${file}: ${href}`);
    }
    console.log("");
  }

  console.log("--- Broken internal link check ---");
  if (brokenLinks.length === 0) {
    console.log("OK — every internal href resolves to a file in dist/.\n");
  } else {
    console.log(`FAIL — ${brokenLinks.length} internal href(s) don't resolve to a file in dist/:\n`);
    for (const { file, href } of brokenLinks) {
      console.log(`  ${file}: ${href}`);
    }
    console.log("");
  }

  console.log("--- Currency-amount check ---");
  if (missingAmounts.length === 0) {
    console.log("OK — every CLP/USD mention in a description has an amount near it.\n");
  } else {
    console.log(`FAIL — ${missingAmounts.length} description(s) mention a currency code with no amount:\n`);
    for (const { file, snippet } of missingAmounts) {
      console.log(`  ${file}: ...${snippet}...`);
    }
    console.log("");
  }

  console.log("--- Ambiguous-price check ---");
  if (bareDollarPrices.length === 0) {
    console.log("OK — no visible price renders as a bare \"$\" + digits.\n");
  } else {
    console.log(`FAIL — ${bareDollarPrices.length} visible price(s) render as a bare "$" + digits:\n`);
    for (const { file, snippet } of bareDollarPrices) {
      console.log(`  ${file}: ...${snippet}...`);
    }
    console.log("");
  }

  if (
    slashViolations.length > 0 ||
    brokenLinks.length > 0 ||
    missingAmounts.length > 0 ||
    bareDollarPrices.length > 0
  ) {
    process.exit(1);
  }

  console.log("seo-check: all checks passed.");
}

main();
