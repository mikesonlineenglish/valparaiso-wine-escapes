import vineyardTour from "@/assets/vineyard-tour.jpg?url";
import wineTastingImg from "@/assets/wine-tasting.jpg?url";
import wineDine from "@/assets/wine-dine.jpg?url";
import valparaisoHills from "@/assets/valparaiso-hills.jpg?url";

export interface TourData {
  /** URL slug under /tours/ */
  slug: string;
  /** Matches a TOURS id in @/lib/pricing, for the price calculator + "starts from" price. */
  calculatorId: string;
  image: string;
  title: string;
  subtitle: string;
  /** Unique meta description for the tour's own page. */
  metaDescription: string;
  /** schema.org TouristTrip touristType. */
  touristType: string;
  itinerary: { time: string; activity: string }[];
  includes: string[];
  note?: string;
  /** Optional background section shown on the tour's own page — heading + one or more paragraphs. */
  regionInfoHeading?: string;
  regionInfo?: string[];
}

const CASABLANCA_VALLEY_INFO = [
  "Casablanca is a cool-climate valley just 30 km from Valparaíso and 80 km from Santiago. Once mostly farmland, it's now one of Chile's premier wine regions, prized for Sauvignon Blanc, Chardonnay, and Pinot Noir. Winemaker Pablo Morandé planted the valley's first vines here in the 1980s — today it holds over 6,000 hectares of vineyards. The Humboldt Current sends cool Pacific breezes inland, and with temperatures swinging from around 10°C at night to 27°C in summer, the grapes ripen slowly, developing the concentrated sugar and acidity that give Casablanca wines their character.",
];

const VALPARAISO_CITY_INFO = [
  "The unique and vibrant city of Valparaíso, once mentioned in Moby-Dick, is a UNESCO World Heritage Site and is Chile's closest port to the capital, Santiago.",
  "Discovered in 1536 by Juan de Saavedra, the city grew to become one of South America's most important ports before the opening of the Panama Canal in 1914.",
  "The main features of this enchanting city are the many hillside funiculars, or ascensores, and the colourful houses spontaneously built upon the hills, which act as an amphitheatre with a multitude of views to observe the magic of the city.",
  "Amongst the 42 or so hills in the city, the main places to stay would be in the principal tourist sectors of Cerro Concepción, Cerro Alegre, Cerro Artillería, and Cerro Bellavista.",
  "All of these areas have a wealth of interesting art shops and great nightlife, with good-quality restaurants and bars.",
];

const CASAS_DEL_BOSQUE_TASTING =
  "Casas del Bosque vineyard tour and tasting of their Sauvignon Blanc, Pinot Noir, Syrah, and Carmenère Gran Reserva";

export const TOURS_DATA: TourData[] = [
  {
    slug: "classic-wine-tour",
    calculatorId: "classic",
    image: vineyardTour,
    title: "Classic Wine Tour",
    subtitle: "Half Day Experience",
    metaDescription:
      "Half-day Casablanca Valley wine tour visiting Bodegas RE and Casas del Bosque, with transport, entrance fees, and tastings included. Prices from CLP per person.",
    touristType: "Wine enthusiasts",
    itinerary: [
      { time: "9:00", activity: "Hotel pick up" },
      { time: "10:30", activity: "Bodegas RE vineyard tour and premium tasting" },
      { time: "12:30", activity: CASAS_DEL_BOSQUE_TASTING },
    ],
    includes: [
      "Transport with driver and guide",
      "Vineyard entrance fees",
      "Tours and tastings at both wineries",
    ],
    regionInfo: CASABLANCA_VALLEY_INFO,
  },
  {
    slug: "wine-dine-tour",
    calculatorId: "wine-dine",
    image: wineDine,
    title: "Wine & Dine Tour",
    subtitle: "Full Day Experience",
    metaDescription:
      "Full-day Casablanca Valley wine and dine tour with Bodegas RE, Casas del Bosque, and a vineyard restaurant lunch stop. Prices from CLP per person.",
    touristType: "Wine enthusiasts",
    itinerary: [
      { time: "9:00", activity: "Hotel pick up" },
      { time: "10:30", activity: "Bodegas RE vineyard tour and premium tasting" },
      { time: "12:30", activity: CASAS_DEL_BOSQUE_TASTING },
      { time: "14:00", activity: "Lunch at Casas del Bosque vineyard restaurant" },
    ],
    includes: [
      "Transport with driver and guide",
      "Vineyard entrance fees",
      "Tours and tastings at both wineries",
    ],
    note: "Lunch is not included in the price.",
    regionInfo: CASABLANCA_VALLEY_INFO,
  },
  {
    slug: "wine-tours-from-santiago",
    calculatorId: "casablanca",
    image: wineTastingImg,
    title: "Wine Tours from Santiago",
    subtitle: "Full Day Experience",
    metaDescription:
      "Full-day wine tour from Santiago to Casablanca Valley and Valparaíso, with winery visits, tastings, and a walking tour of Valparaíso's colorful hills. Prices from CLP per person.",
    touristType: "Wine enthusiasts",
    itinerary: [
      { time: "8:00", activity: "Hotel pick up in Santiago" },
      { time: "10:00", activity: "Arrival in Casablanca Valley" },
      { time: "10:30", activity: "Bodegas RE vineyard tour and premium tasting" },
      { time: "12:30", activity: CASAS_DEL_BOSQUE_TASTING },
      { time: "14:00", activity: "Lunch at Casas del Bosque vineyard restaurant" },
      { time: "16:00", activity: "Scenic drive to Valparaíso" },
      { time: "16:30", activity: "Walking tour of Valparaíso's colorful hills, including Cerro Alegre and Cerro Concepción by funicular, and La Sebastiana (Pablo Neruda's house)" },
      { time: "18:00", activity: "Drop off in Valparaíso or return to Santiago" },
    ],
    includes: [
      "Transport with driver and guide from Santiago",
      "Vineyard entrance fees",
      "Tours and tastings at both wineries",
      "Walking tour of Valparaíso",
    ],
    note: "Lunch is not included in the price.",
    regionInfo: CASABLANCA_VALLEY_INFO,
  },
  {
    slug: "valparaiso-vina-del-mar",
    calculatorId: "city",
    image: valparaisoHills,
    title: "Valparaíso & Viña del Mar",
    subtitle: "City Tour",
    metaDescription:
      "Half-day city tour of Valparaíso and Viña del Mar, with an optional boat trip in the bay of Valparaíso. Prices from CLP per person.",
    touristType: "Cultural travelers",
    itinerary: [
      { time: "10:00", activity: "Hotel pick up" },
      { time: "10:30", activity: "Viña del Mar city tour, including the Fonck archaeological museum" },
      { time: "12:00", activity: "Valparaíso city tour through Cerro Alegre and Cerro Concepción by funicular, past La Sebastiana, Pablo Neruda's house" },
      { time: "14:00", activity: "Optional boat trip in the bay of Valparaíso" },
      { time: "15:00", activity: "Hotel drop off" },
    ],
    includes: [
      "Transport with driver and guide",
      "City tours of both Viña del Mar and Valparaíso",
    ],
    note: "Boat trip is optional and not included in the price.",
    regionInfoHeading: "About Valparaíso",
    regionInfo: VALPARAISO_CITY_INFO,
  },
];
