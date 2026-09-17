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
//  5. FAQPage schema-to-HTML check: every question/answer string in a page's FAQPage
//     JSON-LD must appear verbatim in that same page's rendered (visible) HTML — catches
//     schema and copy drifting apart when one is edited without the other.
//  6. llms.txt checks (https://llmstxt.org/): dist/llms.txt must exist; every markdown
//     link URL in it must resolve to a URL actually listed in the sitemap; and every
//     tour price quoted in it must match that tour's own Offer.price in its TouristTrip
//     JSON-LD — catches the generator and the sitemap/schema drifting apart.
//  7. /tours/ CollectionPage checks: the ItemList's numberOfItems must match the number of
//     tour cards actually rendered on the page; every url/@id referenced by an ItemList
//     entry must resolve to a real page in dist/; and any "@id" that appears on more than
//     one page (e.g. a tour's own page and the /tours/ index) must carry the same name and
//     the same Offer price everywhere it appears — catches the index and the individual
//     tour page drifting apart into near-duplicate entities.

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

const HTML_ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

/** Decodes the handful of entities Astro/JSX actually emit for text nodes, so visible
 * text can be compared against raw (un-encoded) strings like JSON-LD content. */
function decodeHtmlEntities(text) {
  return text
    .replace(/&#39;|&amp;|&lt;|&gt;|&quot;|&apos;|&nbsp;/g, (entity) => HTML_ENTITIES[entity])
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

/** Visible body text only — strips scripts and tags, matching how a reader (or a search
 * snippet) would actually see the page, so this doesn't false-positive on markup/JSON. */
function extractVisibleText(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  const body = bodyMatch ? bodyMatch[1] : html;
  return decodeHtmlEntities(
    body
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      // An inline tag (e.g. a closing </a>) right before punctuation leaves a stray
      // space once tags are stripped, even though nothing renders between them visually.
      .replace(/\s+([.,;:!?])/g, "$1")
      .trim()
  );
}

/** Recursively collects every FAQPage question name + accepted-answer text found in a
 * JSON-LD object, anywhere it's nested. */
function collectFaqPageStrings(node, out) {
  if (Array.isArray(node)) {
    for (const item of node) collectFaqPageStrings(item, out);
    return;
  }
  if (node && typeof node === "object") {
    if (node["@type"] === "FAQPage" && Array.isArray(node.mainEntity)) {
      for (const question of node.mainEntity) {
        if (typeof question?.name === "string") out.push(question.name);
        const answerText = question?.acceptedAnswer?.text;
        if (typeof answerText === "string") out.push(answerText);
      }
    }
    for (const value of Object.values(node)) {
      collectFaqPageStrings(value, out);
    }
  }
}

function extractFaqPageStrings(html) {
  const strings = [];
  const scriptRe = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
  let m;
  while ((m = scriptRe.exec(html))) {
    try {
      collectFaqPageStrings(JSON.parse(m[1]), strings);
    } catch {
      // not valid JSON — not our concern here, the build would have failed elsewhere
    }
  }
  return strings;
}

const BARE_DOLLAR_RE = /\$\d/g;

function findBareDollarPrices(text) {
  return [...text.matchAll(BARE_DOLLAR_RE)].map((m) => {
    const start = Math.max(0, m.index - 15);
    const end = Math.min(text.length, m.index + 15);
    return text.slice(start, end).trim();
  });
}

/** Every URL the sitemap actually lists, read from dist/sitemap-index.xml and the
 * per-file sitemaps it points to (not assumed — read from disk, so a sitemap that
 * failed to generate shows up as "no URLs" rather than a false pass). */
function loadSitemapUrls() {
  const indexPath = join(DIST_DIR, "sitemap-index.xml");
  const urls = new Set();
  if (!existsSync(indexPath)) return urls;

  const indexXml = readFileSync(indexPath, "utf8");
  const sitemapFileUrls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  for (const sitemapFileUrl of sitemapFileUrls) {
    const fileName = sitemapFileUrl.split("/").pop();
    const filePath = join(DIST_DIR, fileName);
    if (!existsSync(filePath)) continue;
    const xml = readFileSync(filePath, "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urls.add(m[1]);
    }
  }
  return urls;
}

const MARKDOWN_LINK_RE = /\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;

function extractMarkdownLinkUrls(markdown) {
  return [...markdown.matchAll(MARKDOWN_LINK_RE)].map((m) => m[1]);
}

/** Map of tour slug -> its Offer.price from the TouristTrip JSON-LD on its own page. */
function collectTourOfferPrices() {
  const prices = new Map();
  const toursDir = join(DIST_DIR, "tours");
  if (!existsSync(toursDir)) return prices;

  for (const slug of readdirSync(toursDir)) {
    const file = join(toursDir, slug, "index.html");
    if (!existsSync(file)) continue;
    const html = readFileSync(file, "utf8");
    const scriptRe = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
    let m;
    while ((m = scriptRe.exec(html))) {
      try {
        const data = JSON.parse(m[1]);
        if (data["@type"] === "TouristTrip" && data.offers?.price != null) {
          prices.set(slug, Number(data.offers.price));
        }
      } catch {
        // not valid JSON — not our concern here, the build would have failed elsewhere
      }
    }
  }
  return prices;
}

/** Matches an llms.txt tour line like:
 *  "- [Classic Wine Tour](https://.../tours/classic-wine-tour/): ... From CLP 75,000 ..." */
const LLMS_TOUR_LINE_RE =
  /\[([^\]]+)\]\((https:\/\/[^)]+\/tours\/([a-z0-9-]+)\/)\)[^\n]*?From\s+CLP\s+([\d,]+)/g;

function extractLlmsTourPrices(markdown) {
  return [...markdown.matchAll(LLMS_TOUR_LINE_RE)].map((m) => ({
    name: m[1],
    slug: m[3],
    price: Number(m[4].replace(/,/g, "")),
  }));
}

// Must match astro.config.mjs's `site` — used to resolve an absolute site URL back to a
// dist-relative path so it can be checked against the actual build output.
const SITE_ORIGIN = "https://winetoursvalparaiso.com";

/** Converts an absolute URL on this site to a site-relative path, or null if the URL
 * isn't on this site at all (which is itself worth flagging as broken). */
function absoluteUrlToInternalPath(url) {
  if (!url.startsWith(SITE_ORIGIN)) return null;
  const rest = url.slice(SITE_ORIGIN.length);
  return rest === "" ? "/" : rest;
}

function findAllJsonLd(html) {
  const scriptRe = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
  const blocks = [];
  let m;
  while ((m = scriptRe.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      // not valid JSON — not our concern here, the build would have failed elsewhere
    }
  }
  return blocks;
}

/** Checks the /tours/ index page's CollectionPage > ItemList against what's actually
 * rendered and against dist/: numberOfItems vs. rendered card count, and every
 * url/@id referenced by an entry resolves to a real page. */
function checkToursIndexItemList() {
  const errors = { missing: false, countMismatch: null, unresolvedRefs: [] };

  const file = join(DIST_DIR, "tours", "index.html");
  if (!existsSync(file)) {
    errors.missing = true;
    return errors;
  }

  const html = readFileSync(file, "utf8");
  const collectionPage = findAllJsonLd(html).find((block) => block["@type"] === "CollectionPage");
  const itemList = collectionPage?.mainEntity;
  if (!itemList || itemList["@type"] !== "ItemList") {
    errors.missing = true;
    return errors;
  }

  // Marks each TourCard's title heading — a stable, distinctive anchor for "one card"
  // that doesn't depend on parsing the surrounding markup structure.
  const renderedCardCount = (
    html.match(/<h3 class="font-display text-2xl lg:text-3xl text-foreground font-semibold mb-6">/g) || []
  ).length;

  if (itemList.numberOfItems !== renderedCardCount) {
    errors.countMismatch = { declared: itemList.numberOfItems, rendered: renderedCardCount };
  }

  for (const listItem of itemList.itemListElement ?? []) {
    const item = listItem.item;
    if (!item) continue;
    for (const rawUrl of [item.url, item["@id"], item.offers?.url]) {
      if (!rawUrl) continue;
      const base = rawUrl.split("#")[0];
      const path = absoluteUrlToInternalPath(base);
      if (path === null || !resolvesToFile(path)) {
        errors.unresolvedRefs.push(rawUrl);
      }
    }
  }

  return errors;
}

/** Recursively collects every object bearing an "@id" anywhere in a JSON-LD tree, along
 * with whatever "name" and Offer "price" it declares (if any), tagged with the file it
 * came from — so the same @id found on two pages can be compared for conflicts. */
function collectIdEntities(node, file, out) {
  if (Array.isArray(node)) {
    for (const item of node) collectIdEntities(item, file, out);
    return;
  }
  if (node && typeof node === "object") {
    if (typeof node["@id"] === "string") {
      out.push({
        id: node["@id"],
        file,
        name: typeof node.name === "string" ? node.name : undefined,
        price: node.offers?.price != null ? Number(node.offers.price) : undefined,
      });
    }
    for (const value of Object.values(node)) {
      collectIdEntities(value, file, out);
    }
  }
}

/** Groups every "@id" occurrence across all pages and flags any id whose name or price
 * disagrees between occurrences — the same entity must describe itself identically
 * wherever it's referenced. */
function findIdConflicts(htmlFiles) {
  const entities = [];
  for (const file of htmlFiles) {
    const relFile = file.slice(DIST_DIR.length + 1).replace(/\\/g, "/");
    const html = readFileSync(file, "utf8");
    for (const block of findAllJsonLd(html)) {
      collectIdEntities(block, relFile, entities);
    }
  }

  const byId = new Map();
  for (const entity of entities) {
    if (!byId.has(entity.id)) byId.set(entity.id, []);
    byId.get(entity.id).push(entity);
  }

  const conflicts = [];
  for (const [id, occurrences] of byId) {
    if (occurrences.length < 2) continue;
    const names = new Set(occurrences.map((o) => o.name).filter((n) => n !== undefined));
    const prices = new Set(occurrences.map((o) => o.price).filter((p) => p !== undefined));
    if (names.size > 1 || prices.size > 1) {
      conflicts.push({ id, occurrences });
    }
  }
  return conflicts;
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
  const faqMismatches = [];

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

    const visibleText = extractVisibleText(html);

    for (const snippet of findBareDollarPrices(visibleText)) {
      bareDollarPrices.push({ file: relFile, snippet });
    }

    for (const text of extractFaqPageStrings(html)) {
      if (!visibleText.includes(text)) {
        faqMismatches.push({ file: relFile, snippet: text.length > 60 ? `${text.slice(0, 60)}…` : text });
      }
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

  console.log("--- FAQPage schema-to-HTML check ---");
  if (faqMismatches.length === 0) {
    console.log("OK — every FAQPage question/answer string appears verbatim in its page's HTML.\n");
  } else {
    console.log(`FAIL — ${faqMismatches.length} FAQPage string(s) don't appear verbatim in the rendered HTML:\n`);
    for (const { file, snippet } of faqMismatches) {
      console.log(`  ${file}: "${snippet}"`);
    }
    console.log("");
  }

  console.log("--- llms.txt presence check ---");
  const llmsTxtPath = join(DIST_DIR, "llms.txt");
  const llmsTxtMissing = !existsSync(llmsTxtPath);
  if (llmsTxtMissing) {
    console.log("FAIL — dist/llms.txt is missing.\n");
  } else {
    console.log("OK — dist/llms.txt exists.\n");
  }

  const llmsUrlErrors = [];
  const llmsPriceErrors = [];

  if (!llmsTxtMissing) {
    const llmsTxt = readFileSync(llmsTxtPath, "utf8");
    const sitemapUrls = loadSitemapUrls();

    console.log("--- llms.txt URL-in-sitemap check ---");
    for (const url of extractMarkdownLinkUrls(llmsTxt)) {
      const base = url.split("#")[0];
      if (!sitemapUrls.has(base)) {
        llmsUrlErrors.push(url);
      }
    }
    if (llmsUrlErrors.length === 0) {
      console.log("OK — every llms.txt URL is present in the sitemap.\n");
    } else {
      console.log(`FAIL — ${llmsUrlErrors.length} llms.txt URL(s) not found in the sitemap:\n`);
      for (const url of llmsUrlErrors) {
        console.log(`  ${url}`);
      }
      console.log("");
    }

    console.log("--- llms.txt price-consistency check ---");
    const offerPrices = collectTourOfferPrices();
    const llmsTourPrices = extractLlmsTourPrices(llmsTxt);
    for (const { name, slug, price } of llmsTourPrices) {
      const offerPrice = offerPrices.get(slug);
      if (offerPrice === undefined || offerPrice !== price) {
        llmsPriceErrors.push({ name, slug, price, offerPrice });
      }
    }
    if (llmsPriceErrors.length === 0) {
      console.log(`OK — every tour price in llms.txt matches its Offer JSON-LD price (${llmsTourPrices.length} checked).\n`);
    } else {
      console.log(`FAIL — ${llmsPriceErrors.length} llms.txt price(s) don't match the tour's Offer JSON-LD price:\n`);
      for (const { name, slug, price, offerPrice } of llmsPriceErrors) {
        console.log(`  ${name} (${slug}): llms.txt says CLP ${price}, Offer schema says ${offerPrice ?? "missing"}`);
      }
      console.log("");
    }
  }

  console.log("--- /tours/ ItemList check ---");
  const toursIndexErrors = checkToursIndexItemList();
  if (toursIndexErrors.missing) {
    console.log("FAIL — dist/tours/index.html is missing its CollectionPage > ItemList JSON-LD.\n");
  } else {
    if (toursIndexErrors.countMismatch) {
      console.log(
        `FAIL — ItemList numberOfItems (${toursIndexErrors.countMismatch.declared}) doesn't match the ${toursIndexErrors.countMismatch.rendered} tour card(s) actually rendered.\n`
      );
    } else {
      console.log("OK — ItemList numberOfItems matches the rendered tour cards.");
    }

    if (toursIndexErrors.unresolvedRefs.length === 0) {
      console.log("OK — every ItemList url/@id resolves to a real page in dist/.\n");
    } else {
      console.log(`FAIL — ${toursIndexErrors.unresolvedRefs.length} ItemList url/@id value(s) don't resolve to a page in dist/:\n`);
      for (const ref of toursIndexErrors.unresolvedRefs) {
        console.log(`  ${ref}`);
      }
      console.log("");
    }
  }

  console.log("--- Cross-page @id conflict check ---");
  const idConflicts = findIdConflicts(htmlFiles);
  if (idConflicts.length === 0) {
    console.log("OK — every shared @id has the same name and price wherever it appears.\n");
  } else {
    console.log(`FAIL — ${idConflicts.length} @id(s) disagree on name or price across pages:\n`);
    for (const { id, occurrences } of idConflicts) {
      console.log(`  ${id}:`);
      for (const { file, name, price } of occurrences) {
        console.log(`    ${file}: name=${name ?? "—"} price=${price ?? "—"}`);
      }
    }
    console.log("");
  }

  if (
    slashViolations.length > 0 ||
    brokenLinks.length > 0 ||
    missingAmounts.length > 0 ||
    bareDollarPrices.length > 0 ||
    faqMismatches.length > 0 ||
    llmsTxtMissing ||
    llmsUrlErrors.length > 0 ||
    llmsPriceErrors.length > 0 ||
    toursIndexErrors.missing ||
    toursIndexErrors.countMismatch ||
    toursIndexErrors.unresolvedRefs.length > 0 ||
    idConflicts.length > 0
  ) {
    process.exit(1);
  }

  console.log("seo-check: all checks passed.");
}

main();
