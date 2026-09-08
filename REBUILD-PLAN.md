# SEO Rebuild — Investigation & Recommendation

Status: **investigation only, no code changed.** Written for a decision, not yet an implementation plan.

## 1. Repo map

- **Build tool:** Vite 5 + `@vitejs/plugin-react-swc`. Plain client-side React app — no SSR/SSG plugin installed.
- **React:** 18.3, with `react-router-dom` 6 installed but effectively unused: [App.tsx](src/App.tsx) defines exactly one real route (`/`) plus a catch-all 404. The router is scaffolding, not in active use.
- **Styling:** Tailwind CSS + shadcn/ui (Radix primitives). The project was originally scaffolded by **Lovable.dev** — the `lovable-tagger` dev dependency in [package.json](package.json:87) is Lovable's dev-time JSX tagger (only active in `mode === "development"`, per [vite.config.ts](vite.config.ts:16); it does not run in production builds, so it's not a build-time risk, just a fingerprint of how this repo started life).
- **shadcn/ui footprint is much bigger than what's used.** `src/components/ui/` has ~50 installed primitives (carousel, sidebar, command palette, calendar, chart, menubar, resizable panels, OTP input...). I grepped actual page content and only **`button.tsx`** is imported by anything under `src/components/*.tsx` (Hero, Header, Experiences, Contact, PriceCalculator). Everything else is unused boilerplate from the shadcn template, inflating `node_modules` and the dependency surface without being on the page.
- **Content storage:** 100% hardcoded, inline, in JSX/TS literals, split across single-purpose section components. There is no data file, no CMS, no markdown, no i18n strings file:
  - Tour cards + itineraries: array literal inside [Experiences.tsx](src/components/Experiences.tsx:106)
  - Full price matrix (4 tours × 7 group-size tiers × 25 location pairs = ~700 price points, in CLP): inline object literal inside [PriceCalculator.tsx](src/components/PriceCalculator.tsx:40)
  - Testimonials: array literal inside [Testimonials.tsx](src/components/Testimonials.tsx:37)
  - About copy, stats, footer links: hardcoded directly in JSX in each component
  - JSON-LD (TourOperator + 3x TouristTrip): hardcoded object literals inside [StructuredData.tsx](src/components/StructuredData.tsx)
- **SEO code that already exists:** [SEO.tsx](src/components/SEO.tsx) and [StructuredData.tsx](src/components/StructuredData.tsx), both built on `react-helmet-async`, injected into `<head>` **client-side, after JS runs**. This is exactly why the audit sees zero body text and no JSON-LD in the raw HTML — the mechanism is there, it's just running at the wrong time (post-hydration, not at response time). `index.html` itself only has static, generic title/description/OG tags — the same ones for every "page" since there's only one.
- **Deploy:** static host confirmed. `package.json` has `"deploy": "gh-pages -d dist"` — the `gh-pages` npm package pushes the built `dist/` folder to a `gh-pages` branch on GitHub, serving via GitHub Pages with a custom domain (`public/CNAME` → `winetoursvalparaiso.com`). No `.github/workflows`, no server, no functions. Whatever we ship has to be output as plain files by `vite build` (or whatever replaces it) — confirmed, no Node runtime available at request time.
- **Testing:** Vitest + Testing Library configured, but only one placeholder test exists ([src/test/example.test.ts](src/test/example.test.ts)). Not a factor in the decision.
- **No environment-dependent code:** grepped for `import.meta.env` / `process.env` — zero matches in `src/`. No build-time data fetching, no API calls, no secrets. This considerably de-risks any rebuild approach.

## 2. Interactive behavior that must survive

1. **Price calculator** ([PriceCalculator.tsx](src/components/PriceCalculator.tsx)) — client-only state machine: guest-count stepper, two location `<select>`s, tour picker, a large hardcoded CLP price-lookup table keyed by `tour × guest-tier × pickup-dropoff pair`, computed per-person/total display. No network call — it's pure client-side arithmetic over embedded data. This is the most complex piece of logic in the app and needs to be carried over exactly (including the very specific pricing table — that's real business data, not sample content).
2. **Contact / inquiry form** ([Contact.tsx](src/components/Contact.tsx)) — uses `@formspree/react`'s `useForm` hook against a hardcoded Formspree form ID (`xwvneape`), with inline HTML5 validation and a submitted/success state. This needs JS and a form endpoint; it's a natural "island" of interactivity regardless of rebuild approach.
3. **Header scroll/mobile-menu behavior** ([Header.tsx](src/components/Header.tsx)) — `useState`/`useEffect` scroll listener that changes header styling past 50px scroll, plus a mobile hamburger menu toggle. Cosmetic, not SEO-relevant, but visible on every page.
4. **Analytics event tracking** ([lib/analytics.ts](src/lib/analytics.ts)) — a `trackEvent` wrapper around `window.gtag`, called from ~10 different CTA/link click handlers across Hero, Header, Experiences, Contact. Needs `gtag.js` to still be loaded and these calls preserved, but it's not complex — just needs to be re-wired to whatever the new CTA markup looks like.
5. **Anchor-based single-page navigation** — the entire current site "routes" via `#about`, `#experiences`, `#testimonials`, `#price-calculator`, `#contact` in-page anchors (Header nav, Footer links, buttons throughout). This isn't really a feature to preserve so much as a pattern that **must change** the moment there's more than one page — it doesn't survive a multi-page rebuild unmodified, it gets replaced by real routes.
6. Nothing else meaningfully interactive was found. `Toaster`/`Sonner`/`TooltipProvider` are wired up globally in [App.tsx](src/App.tsx) but nothing in the actual page content calls `useToast()` or renders a tooltip — leftover shadcn scaffolding, not a real feature.

## 3. Current content structure, and the pain of 30 more pages

The content model right now is: **there is no content model.** Every string, price, itinerary step, and testimonial is a literal inside a `.tsx` component, mixed directly with markup and Tailwind classes. There's exactly one route. Adding a page today means:

- Writing a brand-new React component by hand, in JSX, mixing content and layout
- Manually re-importing and re-stacking `Header`/`Footer`/`SEO` (SEO tags would need to be per-page, currently only `Index.tsx` sets them)
- Registering a new `<Route>` in `App.tsx`
- Deciding what "navigation" even means once anchors stop being able to reach it (the header nav is hardcoded to 5 anchors, footer links likewise)
- No pattern to copy for a "tour detail page" or "location page" template — you'd invent one from scratch on page 1 and then hand-copy it 29 more times, with all the drift that implies

There is also **zero i18n scaffolding** — no `react-i18next`, no per-locale routing, no separation of UI strings from components. Adding Russian today means either duplicating every component with hardcoded Russian strings (a second, parallel codebase you'd have to keep in sync by hand forever), or retrofitting an i18n library into ten components that currently have English text welded into their JSX.

Bottom line: the current architecture is fine for the single page it was built for, and actively hostile to "30 more pages + a full translation," independent of the SEO problem. Whatever we do to fix crawlability should also fix this, or you'll hit the same wall again in a month.

## 4. Recommendation

**Recommend: (b) — rebuild the marketing pages in Astro with static output, keep React only as islands for the calculator and the contact form.**

### Why

- Astro's whole reason to exist is "ship real static HTML per route, zero JS by default, opt in to JS only where you need it." That is a precise match for this site: ~35 pages of mostly-static marketing copy, plus exactly two components (calculator, form) that genuinely need to run in the browser.
- It directly fixes the root problem the audit names: instead of a `<div id="root">` that Googlebot has to render and Bing/AI crawlers largely won't, every route becomes real HTML with real headings and body text at request time, with no dependency on a crawler executing JavaScript at all.
- Astro has first-class **content collections** — page content lives as Markdown/MDX with frontmatter, validated against a schema, instead of as TS object literals buried in JSX. For 30 pages maintained by a non-engineer (you said you maintain this yourself), editing a Markdown file with `title:`, `price:`, `itinerary:` fields is a categorically easier ongoing task than editing a nested JS object inside a component.
- Astro has **built-in i18n routing** (locale-prefixed routes, `hreflang` generation support) that's designed for exactly the "same pages, second language" case. Once the routing/template scaffolding is in place, adding the Russian version of a page is "add a translated content file," not "build a parallel app."
- The two things that actually need interactivity — [PriceCalculator.tsx](src/components/PriceCalculator.tsx) and [Contact.tsx](src/components/Contact.tsx) — can be dropped into Astro almost unchanged as React islands (`client:load` / `client:visible`). Their logic doesn't depend on routing or SSR context, so this is close to a copy-paste, not a rewrite. Same for the price table — it should move to a shared data module either way.
- You keep Tailwind (Astro supports it natively) and can carry over the visual design; this is a structural rebuild, not a redesign.

### The case against it (being honest about the trade-off)

- **It's a real rebuild, not a config change.** Every one of the 8 current section components (Header, Hero, About, Experiences, Testimonials, Footer, plus layout) has to be ported to `.astro` components. That's mechanical work, but it's not zero, and it's easy to introduce small visual regressions in the process that only show up after deploy.
- **You have to learn Astro's model** — content collections, frontmatter, `.astro` component syntax, the islands directive system (`client:load` etc.) — on top of (or instead of) the React/JSX you already have in this repo. If you're not the one hand-editing code and someone else maintains this for you, that's their learning curve, but it's real either way.
- **It costs more upfront than option (a)** (prerendering the existing app as-is) — you're paying migration cost now in exchange for lower per-page cost later. If the 30-page/Russian-translation plan were smaller or less certain, I'd lean toward the cheaper, less disruptive option (a) instead.
- Astro is a smaller ecosystem than Next.js — fewer Stack Overflow answers, fewer devs who already know it if you ever hire out this work. Not a blocker for a marketing site, but worth naming.

### Rough effort

| | (a) Prerender existing React app | (b) Astro rebuild w/ React islands |
|---|---|---|
| Get static HTML output working at all | 1–2 days (prerender tooling for a Vite SPA is not as turnkey as it sounds — `react-snap` is stale, `vite-react-ssg` is the live option but still a real integration) | 3–5 days (port 8 section components to `.astro`, wire up layout + islands for calculator/form) |
| Split single page into real multi-page structure (unavoidable either way, since anchors don't scale past 1 page) | 2–3 days | included in content-collection/template setup below |
| Content model + template for "add a new page" | not really addressed — still hand-written JSX per page | 3–5 days (content collection schema + `[slug].astro` template) |
| i18n / Russian routing scaffold | 3–5 days to bolt `react-i18next` onto a CSR app that has none | mostly included in Astro's built-in i18n routing — 1–2 days to configure |
| **Cost per additional page once scaffolding exists** | still writing JSX by hand, ~0.5–1 day each → **15–30 days for 30 pages** | filling in a Markdown template, ~2–4 hours each once the template is right → **~8–15 days for 30 pages** |
| Russian version of each page | separate JSX tree to maintain forever | translated content file per page, using the same template |

Net: (b) costs roughly 3–5 extra engineering-days up front, and pays that back immediately given you've already committed to 30 pages and a full translation — those aren't hypothetical future scope, they're the actual ask. Option (a) is the right call only if this were staying a small, single-language site; it isn't.

### Why not (c) something else

- **Next.js static export** was the obvious alternative to consider. It's viable (App Router + `output: 'export'`), but for a mostly-static marketing site it ships more client JS by default than Astro does, and its i18n story for a static export is comparatively more manual. It doesn't offer a clear advantage here over Astro for this specific shape of site, so I'm not recommending it.
- A hand-rolled static-HTML + vanilla-JS approach (no framework at all) was also considered, mainly to minimize shipped JS even further. It throws away the existing Tailwind/shadcn design work and, more importantly, gives you no templating system for 30 pages × 2 languages — you'd end up needing something like Astro (or a static site generator equivalent) anyway just to avoid hand-duplicating markup 60 times. So it collapses back into option (b) once you actually plan for the page count you described.

## 5. Things that will make this harder than it looks

- **The price matrix is real business data, not sample content.** [PriceCalculator.tsx](src/components/PriceCalculator.tsx:40) has ~700 individual price points across 4 tours, 7 group-size tiers, and 25 pickup/dropoff pairs, using abbreviated location keys (`SH`, `SA`, `VP`, `VH`, `VdM`) that map to human labels elsewhere in the same file. Whatever rebuild happens, this table needs to move verbatim into a shared data module — it would be very easy to introduce a typo or transcription error across 700 numbers and not notice until a customer gets a wrong quote.
- **`react-router-dom` is installed and partially wired but not actually used for routing decisions today** — it's set up for a multi-route future that was never built out. Don't assume its presence means the app is "mostly ready" for multiple pages; in practice it's just enabling one route and a 404.
- **Most of the shadcn/ui component library in `src/components/ui/` (~45 of ~50 files) is unused by any actual page content** — only `button.tsx` is imported outside the `ui/` folder itself. Don't budget time to "port" all of these; verify usage per-component before carrying anything over, most of it is starter-template weight that can simply be dropped.
- **SEO/StructuredData components already contain good content** ([SEO.tsx](src/components/SEO.tsx), [StructuredData.tsx](src/components/StructuredData.tsx)) — the JSON-LD for `TourOperator` and three `TouristTrip` entries is well-formed and reasonably accurate; it just needs to end up in the actual server-rendered HTML instead of being injected by `react-helmet-async` after hydration. This is content to reuse, not content to rewrite.
- **No env vars, no build-time fetching, no secrets anywhere in `src/`** — confirmed by grep. This significantly de-risks a migration; there's no hidden runtime configuration to rediscover.
- **Formspree form ID (`xwvneape`) and the GA4 measurement ID (`G-SSGXVTTWHZ`, hardcoded in [index.html](index.html:43)) are both plain hardcoded strings, not secrets** — they need to be carried over exactly, but there's no security concern moving them into a new codebase.
- **Deploy is via the `gh-pages` npm package pushing `dist/` to a `gh-pages` branch**, not a CI pipeline — there's no `.github/workflows` to update, but the `deploy` npm script and `CNAME` file will need to point at whatever the new build tool's output directory is (Astro's default is also `dist/`, so this is likely a non-issue, just worth confirming).
- **`lovable-tagger`** only runs in Vite dev mode and has no effect on production output — flagged only so it isn't mistaken for something load-bearing.

---

**Waiting on your decision before any code changes.**
