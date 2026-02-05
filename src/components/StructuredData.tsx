import { Helmet } from "react-helmet-async";

const StructuredData = () => {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "TourOperator",
    name: "Wine Tours Valparaíso",
    description:
      "Premium wine tours through Chile's Casablanca Valley and city tours of Valparaíso and Viña del Mar.",
    url: "https://winetoursvalparaiso.com",
    telephone: "+56 9 8428 3502",
    email: "info@winetoursvalparaiso.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valparaíso",
      addressRegion: "Valparaíso Region",
      addressCountry: "CL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -33.0472,
      longitude: -71.6127,
    },
    areaServed: {
      "@type": "Place",
      name: "Casablanca Valley, Valparaíso, Viña del Mar",
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "18:00",
    },
    sameAs: [
      "https://www.instagram.com/winetoursvalparaiso",
      "https://www.facebook.com/winetoursvalparaiso",
    ],
  };

  const tours = [
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: "Casablanca Valley Wine Tour",
      description:
        "Full-day wine tour visiting Bodegas RE and Casas del Bosque wineries with tastings and optional gourmet lunch.",
      touristType: "Wine enthusiasts",
      itinerary: {
        "@type": "ItemList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Hotel pickup at 9:00 AM" },
          { "@type": "ListItem", position: 2, name: "Bodegas RE winery visit and tasting" },
          { "@type": "ListItem", position: 3, name: "Casas del Bosque winery tour" },
          { "@type": "ListItem", position: 4, name: "Optional lunch at Casas del Bosque restaurant" },
          { "@type": "ListItem", position: 5, name: "Hotel drop-off at 5:00 PM" },
        ],
      },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        url: "https://winetoursvalparaiso.com/#experiences",
      },
      provider: {
        "@type": "TourOperator",
        name: "Wine Tours Valparaíso",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: "Cellar & Barrel Tasting Experience",
      description:
        "Premium wine experience with cellar tours and barrel tastings at Bodegas RE and Casas del Bosque.",
      touristType: "Wine connoisseurs",
      itinerary: {
        "@type": "ItemList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Hotel pickup at 9:00 AM" },
          { "@type": "ListItem", position: 2, name: "Bodegas RE cellar and barrel tasting" },
          { "@type": "ListItem", position: 3, name: "Casas del Bosque premium tasting" },
          { "@type": "ListItem", position: 4, name: "Optional gourmet lunch" },
          { "@type": "ListItem", position: 5, name: "Hotel drop-off at 5:00 PM" },
        ],
      },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        url: "https://winetoursvalparaiso.com/#experiences",
      },
      provider: {
        "@type": "TourOperator",
        name: "Wine Tours Valparaíso",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: "Valparaíso & Viña del Mar City Tour",
      description:
        "Half-day city tour exploring the colorful streets of Valparaíso and the coastal beauty of Viña del Mar with optional boat trip.",
      touristType: "Cultural travelers",
      itinerary: {
        "@type": "ItemList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Hotel pickup at 10:00 AM" },
          { "@type": "ListItem", position: 2, name: "Viña del Mar city tour" },
          { "@type": "ListItem", position: 3, name: "Valparaíso city tour" },
          { "@type": "ListItem", position: 4, name: "Optional boat trip in Valparaíso bay" },
          { "@type": "ListItem", position: 5, name: "Hotel drop-off at 3:00 PM" },
        ],
      },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        url: "https://winetoursvalparaiso.com/#experiences",
      },
      provider: {
        "@type": "TourOperator",
        name: "Wine Tours Valparaíso",
      },
    },
  ];

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
      {tours.map((tour, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(tour)}
        </script>
      ))}
    </Helmet>
  );
};

export default StructuredData;
