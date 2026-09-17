import casasDelBosque from "@/assets/wineries/casas-del-bosque.jpg?url";
import emiliana from "@/assets/wineries/emiliana.jpg?url";
import bodegasRe from "@/assets/wineries/bodegas-re.jpg?url";
import matetic from "@/assets/wineries/matetic.jpg?url";
import kingston from "@/assets/wineries/kingston.avif?url";
import villard from "@/assets/wineries/villard.jpg?url";
import lomaLarga from "@/assets/wineries/loma-larga.png?url";
import catrala from "@/assets/wineries/catrala.jpg?url";
import morande from "@/assets/wineries/morande.jpg?url";
import attilioMochi from "@/assets/wineries/attilio-mochi.jpg?url";
import williamCole from "@/assets/wineries/william-cole.jpg?url";
import vinaIndomita from "@/assets/wineries/vina-indomita.jpg?url";

export interface Winery {
  slug: string;
  name: string;
  /** External winery website. Left null until a link is supplied. */
  website: string | null;
  /**
   * Locality for structured data, used only when the winery copy itself names it as
   * where the estate/winery sits (not just a valley it sources grapes from). Left
   * undefined — rather than guessed — when the copy doesn't say; see content/SITE-FACTS.md.
   */
  addressLocality?: string;
  /** All wineries covered here sit within Chile's Valparaíso Region. */
  addressRegion: string;
  addressCountry: string;
  image: string | null;
  imageAlt: string;
  paragraphs: string[];
  /** Optional closing note linking to one of our tours that visits this winery. Its
   * tag-stripped text should read naturally as the last paragraph on the page. */
  tourNoteHtml?: string;
}

const TOUR_LINK_CLASS =
  "text-primary underline underline-offset-2 hover:text-primary/80";

export const WINERIES: Winery[] = [
  {
    slug: "casas-del-bosque",
    name: "Casas del Bosque",
    website: "https://casasdelbosque.cl",
    addressLocality: "Casablanca",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: casasDelBosque,
    imageAlt: "Casas del Bosque winery in the Casablanca Valley",
    paragraphs: [
      "Founded in 1993 by the Italian-rooted Cuneo family, Casas del Bosque is a boutique, family-owned winery in the Casablanca Valley — about 70 km from Santiago and 40 km from Valparaíso, just 18 km from the coast. Their single 134-hectare estate is planted entirely with cool-climate varieties (Sauvignon Blanc, Chardonnay, Riesling, Pinot Noir, Syrah, Malbec and Cabernet Franc), with granite-derived soils from ancient marine sediment giving the wines their distinctive character.",
      "The winery produces around 1.3 million litres a year, exporting to more than 50 countries. Beyond wine, Casas del Bosque is known as one of Chile's top tourism destinations, offering vineyard tours, tastings and its acclaimed Tanino restaurant, and has repeatedly ranked among the World's Best Vineyards to visit.",
    ],
    tourNoteHtml: `This winery is included in our <a href="/tours/wine-dine-tour/" class="${TOUR_LINK_CLASS}">Wine &amp; Dine Tour</a>.`,
  },
  {
    slug: "emiliana",
    name: "Emiliana Organic Vineyards",
    website: "https://emiliana.cl",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: emiliana,
    imageAlt: "Emiliana Organic Vineyards biodynamic vineyard rows",
    paragraphs: [
      "Founded in the late 1990s by brothers Rafael and José Guilisasti alongside pioneering winemaker Álvaro Espinoza, Emiliana was one of the first Chilean wineries to convert fully to organic and biodynamic production. What started in 1998 as an experiment has grown into a portfolio of internationally recognized wines, built on the belief that organic and biodynamic farming is not just the best way to make wine, but a more respectful, sustainable way of relating to nature and people.",
      "Today Emiliana farms more than 1,000 hectares organically and biodynamically across six of Chile's key wine valleys — from the desert-fringed Limarí Valley in the north to the cool, rainy Bío-Bío Valley in the south — each contributing distinct grape varieties suited to its terroir: crisp whites from Limarí and Casablanca, structured Carmenere and Syrah from Colchagua and Cachapoal, and premium Cabernet Sauvignon from Maipo.",
      "Along the way the winery has racked up major milestones and certifications: Chile's first ISO 14001 environmental certification (2001), the first Demeter biodynamic-certified wine in Latin America (2006), Fair Trade and CarbonZero certifications, vegan certification, and titles such as \"Winery of the Year\" from Wines of Chile and \"Green Winery of the Year\" from The Drinks Business. It remains one of the world's most respected organic and biodynamic wine producers, now marking over 25 years of organic agriculture.",
    ],
  },
  {
    slug: "bodegas-re",
    name: "Bodegas RE",
    website: "https://bodegasre.cl/en",
    addressLocality: "Casablanca",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: bodegasRe,
    imageAlt: "Bodegas RE earth-covered winery building in Casablanca Valley",
    paragraphs: [
      "Bodegas RE is a small, family-run winery in the Casablanca Valley, founded in 2008 by Pablo Morandé Lavín — the winemaker credited with discovering Casablanca's potential in 1982 and creating Chile's iconic Don Melchor — together with his children Piedad and Pablo. Rooted in generations of winemaking tradition from the Cauquenes area of the Maule Valley, the family's concept is built around \"REcreating, REinventing and REvealing\" ancestral winemaking, using the family's antique clay maulina jars alongside giant concrete amphorae they redesigned from that same ancestral model, blending old techniques with modern winemaking knowledge.",
      "In 2023 the Morandé family partnered with entrepreneur José Crispi, whose own family has a century-long winemaking history in Chile, to help expand the RE brand internationally.",
      "The winery is also notable for its passive, low-energy design: earth-covered perimeter walls planted with vines and olive trees keep the underground cellar naturally stable at 14–16°C year-round with no mechanical heating or cooling, grapes and must move by gravity rather than pumps, fermentation happens in spherical vats without refrigeration, and the estate relies on rainwater irrigation and natural, environmentally-approved treatments in the vineyard.",
    ],
    tourNoteHtml: `You can visit this winery with our <a href="/tours/classic-wine-tour/" class="${TOUR_LINK_CLASS}">Classic Wine Tour</a>.`,
  },
  {
    slug: "william-cole",
    name: "William Cole Vineyards",
    website: "http://williamcolevineyards.cl/new_site/",
    addressLocality: "Casablanca",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: williamCole,
    imageAlt: "William Cole Vineyards estate in the Casablanca Valley",
    paragraphs: [
      "William Cole Vineyards is part of Tapihue Wines, owned by the Weinstein family, known for producing premium wines with recognition both in Chile and abroad. Its main estate sits in the heart of the Casablanca Valley, just 40 km in a straight line from the Pacific, where coastal breezes create a cool climate ideal for Sauvignon Blanc, Chardonnay and Pinot Noir — the 130-hectare vineyard is trellis-trained with drip irrigation and a water-spray frost-control system. Beyond Casablanca, Tapihue Wines also sources Cabernet Sauvignon and Carmenere from carefully managed vineyards in the warmer valleys of Maipo, Colchagua and Cachapoal, plus fruit from Leyda.",
      "The winery itself has a semi-underground barrel room holding 1,500 barrels and a bottling line running at 2,400 bottles/hour. Its wine range spans several tiers — Tapihue, Bill, Grand Reserve, Reserve and Vineyard Selection — and the estate offers personalized boutique-style tours and tastings.",
    ],
    tourNoteHtml: `It's possible to visit this winery with our tours as an extra — ask us when booking our <a href="/tours/wine-dine-tour/" class="${TOUR_LINK_CLASS}">Wine &amp; Dine Tour</a>.`,
  },
  {
    slug: "matetic",
    name: "Matetic Vineyards",
    website: "https://matetic.com",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: matetic,
    imageAlt: "Matetic Vineyards gravity-flow winery in the Rosario Valley",
    paragraphs: [
      "Matetic Vineyards traces back to Jorge Matetic Cetinja, who emigrated from Croatia to Chile in 1892; the family (with roots also in Asturias, Spain) planted its first vineyards in 1999 in the Rosario Valley — a cool-climate coastal valley between Casablanca and San Antonio — where they pioneered growing Syrah. Their debut 2001 EQ Syrah became Chile's first cool-climate Syrah, launching a winery built on four core values: respect, innovation, excellence and sustainability.",
      "The estate transitioned to organic and biodynamic farming starting in 2002, earning full Demeter biodynamic certification across its 160 hectares by 2013, and built a gravity-flow winery (2003) using natural stone and wood from the region, alongside the boutique \"La Casona\" hotel for wine tourism (2004).",
      "The wines have drawn major international recognition over the years — a Wine Spectator Top 100 listing (2006), repeated Wine & Spirits Top 100 Winery honors, a 97-point James Suckling score with a Top 100 world wines placement (2016), and a 98-point \"Best Red Wine of the Year\" nod from Tim Atkin (2018) — cementing Matetic's reputation as one of Chile's leading cool-climate, biodynamic producers.",
    ],
  },
  {
    slug: "vina-indomita",
    name: "Viña Indómita",
    website: "https://www.instagram.com/vina_indomita/",
    addressLocality: "Casablanca",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: vinaIndomita,
    imageAlt: "Viña Indómita hilltop winery in the Casablanca Valley",
    paragraphs: [
      "Viña Indómita is a striking hilltop winery in the heart of the Casablanca Valley, acquired by Chile's Bethia Group in 2006 and now one of the country's leading producers, exporting to 40+ countries. Its vineyards span Casablanca (Chardonnay, Sauvignon Blanc, Pinot Noir), Maipo (Cabernet Sauvignon, Carménère), plus Maule and Itata, giving the range real breadth from crisp whites to structured reds.",
      "Known for sustainability-focused winemaking and a strong wine-tourism offering — restaurant, tastings, shop and tours with some of the valley's best sunset views — it earned a Pearl 1 Star Prestige recognition in 2025.",
    ],
  },
  {
    slug: "kingston",
    name: "Kingston Vineyards",
    website: "https://kingstonvineyards.com",
    addressLocality: "Casablanca",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: kingston,
    imageAlt: "Kingston Family Vineyards in the coastal hills of Casablanca",
    paragraphs: [
      "Kingston's story began in 1906, when Carl John Kingston left Michigan's Upper Peninsula for Chile chasing rumors of gold. He never found it, but he and his wife Caroline ended up with a cattle ranch in the hills of Casablanca, just 12 miles from the Pacific. The ranch stayed in the family for generations — including a son who, as family lore has it, graduated Harvard on a Wednesday, married on Thursday, and sailed for Chile on Friday — until the 1990s, when a new generation (Courtney Kingston, while at Stanford business school) reimagined the cattle farm as an organic vineyard in Casablanca's far western hills.",
      "Today, five generations after Carl John's arrival, Kingston is a boutique, family-run winery known for hands-on, sustainable winemaking and artisan viticulture along Chile's cool coastal terroir. It has been recognized as a \"First Growth\" by Master of Wine Tim Atkin and named a 2021 Forbes \"Small Giant.\" The family also supports nonprofit causes in Chile and the U.S. focused on education, healthcare and economic opportunity, reflecting a community-minded ethos alongside the winemaking.",
    ],
  },
  {
    slug: "villard",
    name: "Villard Fine Wines",
    website: "https://villard.cl",
    addressLocality: "Casablanca",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: villard,
    imageAlt: "Villard Fine Wines estate in the Casablanca Valley",
    paragraphs: [
      "Founded in 1989 by Frenchman Thierry Villard, Villard Fine Wines was Chile's first family-owned premium boutique winery, set in the cool-climate Casablanca Valley near the Pacific coast. It's still family-run today: son Jean-Charles Villard, Bordeaux-trained and seasoned by harvests across Australia, South Africa and France, now leads winemaking alongside longtime winemaker Anamaria Pacheco, with Thierry advising on final blends.",
      "Known for pioneering premium whites and Pinot Noir in Chile, Villard remains one of Casablanca Valley's top producers.",
    ],
  },
  {
    slug: "loma-larga",
    name: "Loma Larga Vineyards",
    website: "https://loma-larga-website-xks24cuyva-uc.a.run.app/",
    addressLocality: "Casablanca",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: lomaLarga,
    imageAlt: "Loma Larga Vineyards estate in the Casablanca Valley",
    paragraphs: [
      "Loma Larga is a family-run winery on a single estate in the Casablanca Valley, tracing its winegrowing roots to the 19th century, when the Díaz Santelices family's great-grandfather brought French vine strains to Chile from Bordeaux and Paris — the family even showcased their wines at the 1889 Paris Exposition Universelle. The modern winery was founded in 1995 in what was then an undiscovered wine region, after Patricio Díaz, his wife Rosita Santelices, and son Felipe spent five years mapping the estate's soils and climate before planting.",
      "Loma Larga is now recognized as Chile's leading producer of cool-climate red wines, built around its emblematic Cabernet Franc alongside Pinot Noir, Merlot, Malbec and Syrah. The estate works exclusively with its own hand-harvested grapes — no outside fruit, no secondary labels — under winemaker Tamara de Baeremaecker, whose 20+ year career includes stints on some of Chile's top labels (Don Melchor, Terrunyo, Amelia). The winery also emphasizes sustainability and fair labor practices as part of its philosophy.",
    ],
  },
  {
    slug: "catrala",
    name: "Catrala",
    website: "https://catrala.cl",
    addressLocality: "Casablanca",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: catrala,
    imageAlt: "Catrala winery surrounded by native forest in Lo Orozco",
    paragraphs: [
      "Catrala is a small family winery owned by the Rodríguez family, set in Lo Orozco in the Casablanca Valley, immersed within the Peñuela–Campana biosphere reserve. The estate's identity is shaped by this setting — sea breezes off the Pacific, quartz soils, and 500 hectares of native forest — which the family sees as expressed directly in their wines' fresh, elegant character. Production is small-batch, centered on cool-climate varieties: Sauvignon Blanc, Chardonnay, Pinot Noir, and Merlot, with several limited-edition bottlings that have picked up international awards.",
      "The winery's name and story pay tribute to a legendary 17th-century Chilean woman named Catrala — described as elegant, impetuous and mysterious, remembered for her eccentricity and unusual customs, and remembered through a blend of legend, fantasy and reality. The brand frames its wines as an echo of her mystery and magnetism, a place where legend and reality meet. Catrala also offers vineyard-walk tours through the surrounding native flora, paired with countryside lunches and tastings.",
    ],
  },
  {
    slug: "morande",
    name: "Morandé",
    website: "https://morande.cl",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: morande,
    imageAlt: "Viña Morandé winery in the Casablanca Valley",
    paragraphs: [
      "Founded in 1996 by Pablo Morandé — the first winemaker to plant vines in the Casablanca Valley — Viña Morandé has built its identity around innovation and a \"pioneering spirit,\" recovering Chile's winemaking heritage while exploring new terroirs. The portfolio spans several distinct lines: House of Morandé and Terroir Wines for everyday and site-driven bottlings, Vitis Única and Selección de Viñedos at the premium end, Pionero and Late Harvest, and the more experimental Specialties and Adventure lines — the latter dedicated to reviving century-old, dry-farmed varieties like País and Carignan from Maule's Secano Interior and Itata, using traditional head-pruning methods inherited from Spanish colonization. Morandé also produces a dedicated range of sparkling wines, overseen by founder Pablo Morandé himself as oenological director.",
      "Fruit is sourced across five valleys, each suited to different varieties: cool, ocean-influenced Casablanca for Malbec, Syrah and Cabernet Franc; Maipo — the historic heart of Chilean wine — for structured Cabernet Sauvignon; Maule for old-vine País, Carignan, Grenache and Syrah; the far-south Malleco Valley for cold-climate Chardonnay and Pinot Noir; and Itata for vines over 100 (and in some plots, over 130) years old, including ungrafted, head-trained Cabernet Sauvignon and Cinsault. On the winemaking side, Morandé was a pioneer of high-density planting in Chile (2004), reintroduced large oak casks, uses concrete-egg fermentation, and has experimented with frozen-grape wines and grappa-style spirits — all under current winemaking director Ricardo Baettig.",
    ],
  },
  {
    slug: "attilio-mochi",
    name: "Attilio & Mochi",
    website: "https://attiliomochi.com",
    addressLocality: "Casablanca",
    addressRegion: "Valparaíso Region",
    addressCountry: "CL",
    image: attilioMochi,
    imageAlt: "Attilio & Mochi small garage winery vineyard in Casablanca Valley",
    paragraphs: [
      "Attilio & Mochi is a tiny \"garage winery\" in Casablanca Valley run by Marcos Attilio and Angela Mochi, a Brazilian couple with food-engineering backgrounds who've worked in wine since 1999 and moved to Chile in 2011 to build the project from scratch. Their vineyard sits in the cold, windy Orrego Arriba sector, close to the coast, planted with eight varieties — mostly red — including the valley's first Grenache, alongside Malbec, Cabernet Franc, Sauvignon Blanc, Pinot Noir, Viognier and Roussanne.",
      "Truly hands-on and small-scale, the couple is involved in every stage of production, from growing the vines to bottling, with a strong focus on sustainability and being good neighbors. They're active members of MOVI (Chile's Movement of Independent Winegrowers) and Casablanca OFF, a group supporting the valley's small producers, and are known for championing lesser-known corners of the Chilean wine scene over mass-market \"value\" wines. Visits are by appointment, about an hour from Santiago, and kept small and single-language for a personal, unhurried experience with the owners themselves.",
    ],
  },
];
