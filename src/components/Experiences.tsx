import { Clock, Users, Wine, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { TOURS_DATA } from "@/data/tours";
import { normalizeHref } from "@/utils/url";

interface TourCardProps {
  slug: string;
  image: string;
  title: string;
  subtitle: string;
  itinerary: { time: string; activity: string }[];
  includes: string[];
  note?: string;
}

const TourCard = ({
  slug,
  image,
  title,
  subtitle,
  itinerary,
  includes,
  note,
}: TourCardProps) => {
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
      <a
        href={normalizeHref(`/tours/${slug}`)}
        onClick={() => trackEvent("cta_click", { button: `view_details_${title.toLowerCase().replace(/ /g, "_")}` })}
        className="absolute inset-0 z-10"
        aria-label={`View full details for ${title}`}
      />

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

        <div className="relative z-20 flex items-center justify-between pt-6 border-t border-border">
          <div>
            <p className="font-display text-lg text-foreground font-semibold">
              For prices contact us
            </p>
          </div>
          <Button variant="wine" size="sm" asChild>
            <a
              href="#contact"
              onClick={(e) => {
                e.stopPropagation();
                trackEvent("cta_click", { button: `book_now_${title.toLowerCase().replace(/ /g, "_")}` });
              }}
            >Book Now</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

const Experiences = () => {
  const tours = TOURS_DATA;

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
