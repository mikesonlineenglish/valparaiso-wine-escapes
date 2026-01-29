import { Clock, Users, Wine, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import wineCellar from "@/assets/wine-cellar.jpg";
import vineyardTour from "@/assets/vineyard-tour.jpg";
import wineTasting from "@/assets/wine-tasting.jpg";

interface ExperienceCardProps {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  groupSize: string;
  price: string;
  featured?: boolean;
}

const ExperienceCard = ({
  image,
  title,
  subtitle,
  description,
  duration,
  groupSize,
  price,
  featured = false,
}: ExperienceCardProps) => {
  return (
    <div
      className={`group relative bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 ${
        featured ? "lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden ${
          featured ? "h-72 lg:h-full" : "h-56"
        }`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-charcoal/80 via-wine-charcoal/20 to-transparent" />

        {featured && (
          <span className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded text-xs font-body font-semibold uppercase tracking-wide">
            Most Popular
          </span>
        )}
      </div>

      <div className="p-6">
        <p className="font-body text-primary text-xs tracking-[0.15em] uppercase mb-2">
          {subtitle}
        </p>
        <h3 className="font-display text-2xl text-foreground font-semibold mb-3">
          {title}
        </h3>
        <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-primary" />
            {duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-primary" />
            {groupSize}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="font-body text-xs text-muted-foreground">From</span>
            <p className="font-display text-2xl text-foreground font-bold">
              {price}
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
  const experiences = [
    {
      image: vineyardTour,
      title: "Casablanca Valley Tour",
      subtitle: "Full Day Experience",
      description:
        "Explore three prestigious wineries with guided tastings, gourmet lunch, and stunning vineyard walks. The quintessential Chilean wine experience.",
      duration: "8 hours",
      groupSize: "Max 8 guests",
      price: "$189",
      featured: true,
    },
    {
      image: wineCellar,
      title: "Cellar & Barrel Tasting",
      subtitle: "Premium Experience",
      description:
        "Go behind the scenes with exclusive cellar access and barrel tastings at boutique wineries.",
      duration: "5 hours",
      groupSize: "Max 6 guests",
      price: "$149",
    },
    {
      image: wineTasting,
      title: "Sunset Wine & Dine",
      subtitle: "Evening Experience",
      description:
        "Watch the sun set over the vineyards while enjoying premium wines paired with local cuisine.",
      duration: "4 hours",
      groupSize: "Max 10 guests",
      price: "$129",
    },
  ];

  return (
    <section id="experiences" className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-body text-primary tracking-[0.2em] uppercase text-sm mb-4">
            Curated Experiences
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground font-semibold leading-tight mb-6">
            Unforgettable
            <span className="text-elegant text-primary block">Wine Journeys</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Each tour is thoughtfully designed to showcase the best of Chilean
            wine country. Small groups ensure a personalized, intimate experience.
          </p>
        </div>

        {/* Experience Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} {...exp} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Wine className="text-primary" size={24} />
            </div>
            <h4 className="font-display text-xl font-semibold mb-2">
              Expert Sommeliers
            </h4>
            <p className="text-muted-foreground text-sm">
              All tours led by certified wine professionals
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
