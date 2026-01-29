import { Clock, Users, Wine, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import vineyardTour from "@/assets/vineyard-tour.jpg";
import wineTasting from "@/assets/wine-tasting.jpg";

interface TourCardProps {
  image: string;
  title: string;
  subtitle: string;
  itinerary: { time: string; activity: string }[];
  includes: string[];
  note?: string;
}

const TourCard = ({
  image,
  title,
  subtitle,
  itinerary,
  includes,
  note,
}: TourCardProps) => {
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500">
      <div className="relative overflow-hidden h-64">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-charcoal/80 via-wine-charcoal/20 to-transparent" />
      </div>

      <div className="p-6 lg:p-8">
        <p className="font-body text-primary text-xs tracking-[0.15em] uppercase mb-2">
          {subtitle}
        </p>
        <h3 className="font-display text-2xl lg:text-3xl text-foreground font-semibold mb-6">
          {title}
        </h3>

        {/* Itinerary */}
        <div className="mb-6">
          <h4 className="font-body text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
            Itinerary
          </h4>
          <div className="space-y-3">
            {itinerary.map((item, index) => (
              <div key={index} className="flex gap-4">
                <span className="font-body text-primary font-semibold text-sm min-w-[60px]">
                  {item.time}
                </span>
                <span className="font-body text-muted-foreground text-sm">
                  {item.activity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Includes */}
        <div className="mb-6">
          <h4 className="font-body text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
            Includes
          </h4>
          <ul className="space-y-2">
            {includes.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="font-body text-muted-foreground text-sm">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {note && (
          <p className="font-body text-xs text-muted-foreground italic mb-6">
            {note}
          </p>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div>
            <p className="font-display text-lg text-foreground font-semibold">
              For prices contact us
            </p>
          </div>
          <Button variant="wine" size="sm" asChild>
            <a href="#contact">Book Now</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

const Experiences = () => {
  const tours = [
    {
      image: vineyardTour,
      title: "Classic Wine Tour",
      subtitle: "Half Day Experience",
      itinerary: [
        { time: "9:00", activity: "Hotel pick up" },
        { time: "10:30", activity: "Bodegas RE vineyard tour and premium tasting" },
        { time: "12:30", activity: "Casas del Bosque vineyard tour and tasting" },
      ],
      includes: [
        "Transport with driver and guide",
        "Vineyard entrance fees",
        "Tours and tastings at both wineries",
      ],
    },
    {
      image: wineTasting,
      title: "Wine & Dine Tour",
      subtitle: "Full Day Experience",
      itinerary: [
        { time: "9:00", activity: "Hotel pick up" },
        { time: "10:30", activity: "Bodegas RE vineyard tour and premium tasting" },
        { time: "12:30", activity: "Casas del Bosque vineyard tour and tasting" },
        { time: "14:00", activity: "Lunch at Casas del Bosque vineyard restaurant" },
      ],
      includes: [
        "Transport with driver and guide",
        "Vineyard entrance fees",
        "Tours and tastings at both wineries",
      ],
      note: "Lunch is not included in the price.",
    },
    {
      image: vineyardTour,
      title: "Valparaíso & Viña del Mar",
      subtitle: "City Tour",
      itinerary: [
        { time: "10:00", activity: "Hotel pick up" },
        { time: "10:30", activity: "Viña del Mar city tour" },
        { time: "12:00", activity: "Valparaíso city tour" },
        { time: "14:00", activity: "Optional boat trip in the bay of Valparaíso" },
        { time: "15:00", activity: "Hotel drop off" },
      ],
      includes: [
        "Transport with driver and guide",
        "City tours of both Viña del Mar and Valparaíso",
      ],
      note: "Boat trip is optional and not included in the price.",
    },
  ];

  return (
    <section id="experiences" className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-body text-primary tracking-[0.2em] uppercase text-sm mb-4">
            Our Tours
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground font-semibold leading-tight mb-6">
            Unforgettable
            <span className="text-elegant text-primary block">Wine Journeys</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Explore the prestigious Casablanca Valley with our expertly curated
            wine tours. Small groups ensure a personalized, intimate experience.
          </p>
        </div>

        {/* Tour Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {tours.map((tour, index) => (
            <TourCard key={index} {...tour} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Wine className="text-primary" size={24} />
            </div>
            <h4 className="font-display text-xl font-semibold mb-2">
              Expert Guides
            </h4>
            <p className="text-muted-foreground text-sm">
              All tours led by knowledgeable local guides
            </p>
          </div>
          <div className="p-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="text-primary" size={24} />
            </div>
            <h4 className="font-display text-xl font-semibold mb-2">
              Hotel Pickup
            </h4>
            <p className="text-muted-foreground text-sm">
              Complimentary pickup from Valparaíso & Viña del Mar
            </p>
          </div>
          <div className="p-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="text-primary" size={24} />
            </div>
            <h4 className="font-display text-xl font-semibold mb-2">
              Private Tours
            </h4>
            <p className="text-muted-foreground text-sm">
              Custom itineraries available for groups
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experiences;
