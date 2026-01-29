import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-vineyard.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-wine-cream/80 tracking-[0.3em] uppercase text-sm mb-6 animate-fade-in">
            Discover Chilean Wine Country
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-wine-cream font-semibold leading-tight mb-6 animate-fade-in-up">
            Wine Tours
            <span className="block text-elegant text-wine-gold">Valparaíso</span>
          </h1>
          <p className="font-body text-wine-cream/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-delay-1">
            Embark on an unforgettable journey through the prestigious vineyards
            of Chile's Casablanca Valley. Taste world-class wines and experience
            the beauty of Valparaíso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Button variant="hero" size="xl" asChild>
              <a href="#experiences">Explore Tours</a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#contact">Book Your Experience</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-wine-cream/70 hover:text-wine-cream transition-colors animate-bounce"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

export default Hero;
