export interface Stay {
  slug: string;
  name: string;
  tagline: string;
  tags: string[];
  pros: string[];
  cons: string[];
  /** Neighborhood/comuna for structured data, only set when known with confidence. */
  addressLocality?: string;
}

export const STAYS: Stay[] = [
  {
    slug: "hotel-casa-higueras",
    name: "Hotel Casa Higueras",
    tagline: "Boutique luxury with bay views",
    tags: ["Spa & Pool", "Historic Cerro Alegre"],
    pros: ["Elegant rooms with panoramic views and fine dining"],
    cons: ["Premium pricing compared to hostels"],
    addressLocality: "Cerro Alegre",
  },
  {
    slug: "palacio-astoreca-hotel",
    name: "Palacio Astoreca Hotel",
    tagline: "Stylish heritage hotel in Cerro Alegre",
    tags: ["Historic Mansion", "Bay View Terrace"],
    pros: [
      "Beautifully restored 100-year-old building",
      "Close to art galleries and restaurants",
    ],
    cons: ["Limited parking availability"],
    addressLocality: "Cerro Alegre",
  },
  {
    slug: "fauna-hotel-restaurant",
    name: "Fauna Hotel & Restaurant",
    tagline: "Trendy boutique with rooftop dining",
    tags: ["Rooftop Restaurant", "Cerro Concepción"],
    pros: [
      "Modern design with artistic flair",
      "Popular rooftop bar and restaurant",
    ],
    cons: ["Rooms can be smaller than average"],
    addressLocality: "Cerro Concepción",
  },
  {
    slug: "casa-galos-hotel-lofts",
    name: "Casa Galos Hotel & Lofts",
    tagline: "Boutique stay with rooftop bay views",
    tags: ["Cerro Alegre", "Kitchenettes"],
    pros: [
      "Spacious rooms with mini kitchens",
      "Rooftop terrace overlooking Valparaíso Bay",
    ],
    cons: ["Limited on-site dining options"],
    addressLocality: "Cerro Alegre",
  },
  {
    slug: "casablu-hotel",
    name: "Casablu Hotel",
    tagline: "Elegant boutique hotel in Cerro Alegre",
    tags: ["Historic Building", "Stylish Decor"],
    pros: [
      "Beautifully decorated rooms",
      "Perfect location near restaurants and galleries",
    ],
    cons: ["Small property, limited amenities"],
    addressLocality: "Cerro Alegre",
  },
  {
    slug: "nomada-eco-hostel",
    name: "Nomada Eco Hostel",
    tagline: "Eco-friendly hostel with social vibe",
    tags: ["Budget-Friendly", "Eco-Conscious"],
    pros: [
      "Friendly atmosphere and common areas",
      "Affordable dorms and private rooms",
    ],
    cons: ["Basic facilities compared to hotels"],
  },
  {
    slug: "zerohotel",
    name: "Zerohotel",
    tagline: "Charming boutique hotel with garden",
    tags: ["Historic Charm", "Quiet Retreat"],
    pros: ["Lovely garden and peaceful setting", "Personalized service"],
    cons: ["Fewer rooms, books up quickly"],
  },
  {
    slug: "hotel-manoir-atkinson",
    name: "Hotel Manoir Atkinson",
    tagline: "Historic boutique stay with panoramic bay views",
    tags: ["Cerro Concepción", "360° Terrace", "Traditional Chilean Cuisine"],
    pros: [
      "Beautifully restored heritage house with rooftop terrace",
      "Personalized service and excellent breakfasts",
      "Located near Ascensor Concepción and Paseo Atkinson",
    ],
    cons: ["Limited number of rooms", "Wi-Fi can be inconsistent"],
    addressLocality: "Cerro Concepción",
  },
  {
    slug: "hotel-casa-somerscales",
    name: "Hotel Casa Somerscales",
    tagline: "Elegant 19th-century home turned boutique hotel",
    tags: ["Cerro Alegre", "Art Heritage", "Event-Friendly"],
    pros: [
      "Former home of British painter Thomas Somerscales",
      "Spacious rooms with balconies and sea views",
      "Perfect for cultural events and private celebrations",
    ],
    cons: ["Small property with limited availability", "Street parking only"],
    addressLocality: "Cerro Alegre",
  },
  {
    slug: "hotel-boutique-acontraluz",
    name: "Hotel Boutique Acontraluz",
    tagline: "Stylish boutique with wine cellar and sea views",
    tags: ["Cerro Alegre", "Wine Cellar", "Library Lounge"],
    pros: [
      "Modern comforts in a historic setting",
      "Rooms with private terraces and sea views",
      "On-site bar and underground wine cellar",
    ],
    cons: ["Breakfast options are limited", "Not all rooms have balconies"],
    addressLocality: "Cerro Alegre",
  },
  {
    slug: "winebox-hotel",
    name: "WineBox Hotel",
    tagline: "Creative container hotel with rooftop wine bar",
    tags: ["Sea Views", "Eco-Friendly", "Street Art"],
    pros: [
      "Rooms built from recycled shipping containers",
      "Rooftop terrace with wine tastings and graffiti art",
    ],
    cons: ["Quirky design may not suit traditional tastes"],
  },
  {
    slug: "verso-hotel",
    name: "Verso Hotel",
    tagline: "Poetry-themed boutique steps from Neruda's house",
    tags: ["Cerro Florida", "Rooftop Terrace", "Restaurant"],
    pros: [
      "Steps from La Sebastiana, Pablo Neruda's house-museum, in Cerro Florida's Barrio de los Poetas",
      "Modern architecture blending concrete, metal, and poetry-inspired décor, with each room themed around an Ibero-American poet",
      "Rooftop terrace with 360° panoramic views of Valparaíso's bay and hills",
      "On-site restaurant serving Mediterranean cuisine with Chilean touches; breakfast is highly rated",
    ],
    cons: [],
    addressLocality: "Cerro Florida",
  },
];
