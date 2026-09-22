import type { APIRoute } from "astro";
import { TOURS_DATA, type TourData } from "../data/tours";
import { WINERIES } from "../data/wineries";
import { getMinPrice } from "../lib/pricing";
import { formatPrice } from "../lib/currency";
import faqData from "../../content/faq.json";
import introMd from "../../content/llms-intro.md?raw";

// llmstxt.org format (https://llmstxt.org/): H1, blockquote summary, intro paragraph(s),
// then "## Section" headings with "- [Name](url): description" link lists.
//
// The Tours and Guides sections below are generated from the same data that drives the
// tour pages, the price calculator, and the Offer/FAQPage JSON-LD — so this file can
// never say something the rest of the site doesn't. Everything else (intro, Practical
// details, Contact, Notes for AI assistants) is hand-written editorial content that
// lives in content/llms-intro.md, which this generator only prepends/inserts/appends
// around the two generated sections.

interface FaqSection {
  heading: string;
  items: unknown[];
}

const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
  "eighteen", "nineteen",
];
const TENS_WORDS = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
];

function numberToWords(n: number): string {
  if (n < 20) return NUMBER_WORDS[n];
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return ones === 0 ? TENS_WORDS[tens] : `${TENS_WORDS[tens]}-${NUMBER_WORDS[ones]}`;
  }
  return String(n);
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
}

function lowerFirst(s: string): string {
  return s.length === 0 ? s : s.charAt(0).toLowerCase() + s.slice(1);
}

/** Joins items as a natural-language list: "a, b, then c". */
function joinNatural(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")}, then ${items[items.length - 1]}`;
}

/** Joins items as a natural-language list: "a, b, and c". */
function joinWithAnd(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

const HOTEL_LEG_RE = /^hotel\b/i;

function buildTourLine(tour: TourData, site: URL): string {
  const url = new URL(`/tours/${tour.slug}/`, site).href;
  const activities = tour.itinerary
    .map((item) => item.activity)
    .filter((activity) => !HOTEL_LEG_RE.test(activity));

  const minPriceThousands = getMinPrice(tour.calculatorId);
  const price = minPriceThousands !== null ? formatPrice(minPriceThousands * 1000) : "price on request";

  const noteClause = tour.note ? `; ${lowerFirst(tour.note.replace(/\.$/, ""))}` : "";

  return `- [${tour.title}](${url}): ${tour.subtitle}. ${joinNatural(activities)}. From ${price} per person${noteClause}.`;
}

function buildToursSection(site: URL): string {
  const lines = TOURS_DATA.map((tour) => buildTourLine(tour, site));
  return `## Tours\n\n${lines.join("\n")}`;
}

function buildGuidesSection(site: URL): string {
  const wineryNames = WINERIES.map((w) => w.name);
  const wineriesUrl = new URL("/wineries/", site).href;
  const wineriesDescription =
    `A guide to ${numberToWords(wineryNames.length)} wineries in the Casablanca Valley — ` +
    `${wineryNames.join(", ")} — covering what each is known for and how to reach the ` +
    `valley from Valparaíso or Santiago.`;

  const { sections } = faqData as { sections: FaqSection[] };
  const faqQuestionCount = sections.reduce((sum, section) => sum + section.items.length, 0);
  const faqTopics = sections.map((section) => lowerFirst(section.heading));
  const faqUrl = new URL("/faq/", site).href;
  const faqDescription = `${capitalize(numberToWords(faqQuestionCount))} questions covering ${joinWithAnd(faqTopics)}.`;

  const staysUrl = new URL("/where-to-stay/valparaiso/", site).href;
  const staysDescription =
    "Where to stay in Valparaíso by neighborhood and budget — boutique hotels and " +
    "hostels in Cerro Alegre and Cerro Concepción, plus when Viña del Mar makes more sense.";

  const lines = [
    `- [Casablanca Valley Wineries Guide](${wineriesUrl}): ${wineriesDescription}`,
    `- [Places to Stay in Valparaíso](${staysUrl}): ${staysDescription}`,
    `- [Frequently Asked Questions](${faqUrl}): ${faqDescription}`,
  ];
  return `## Guides and reference\n\n${lines.join("\n")}`;
}

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("llms.txt: astro.config.mjs must set `site` for absolute URLs.");
  }

  const body = introMd
    .replace("<!-- GENERATED:TOURS -->", buildToursSection(site))
    .replace("<!-- GENERATED:GUIDES -->", buildGuidesSection(site));

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
