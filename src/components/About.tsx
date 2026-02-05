import wineTasting from "@/assets/wine-tasting.jpg";

const About = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-elevated">
              <img
                src={wineTasting}
                alt="Wine tasting Valparaíso region experience"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary rounded-lg -z-10" />
          </div>

          {/* Content */}
          <div>
            <p className="font-body text-primary tracking-[0.2em] uppercase text-sm mb-4">
              Our Story
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground font-semibold leading-tight mb-6">
              A Passion for
              <span className="text-elegant text-primary block">Chilean Wine</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                For over a decade, Wine Tours Valparaíso has been the premier
                guide to Chile's magnificent wine country. Our intimate tours
                take you through the heart of the Casablanca Valley, renowned
                for its exceptional cool-climate wines.
              </p>
              <p>
                Led by certified sommeliers and local experts, each journey is
                crafted to immerse you in the rich traditions of Chilean
                viticulture. From boutique family vineyards to award-winning
                estates, we curate experiences that celebrate the art of
                winemaking.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border">
              <div>
                <p className="font-display text-4xl text-primary font-bold">10+</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Years Experience
                </p>
              </div>
              <div>
                <p className="font-display text-4xl text-primary font-bold">50+</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Partner Wineries
                </p>
              </div>
              <div>
                <p className="font-display text-4xl text-primary font-bold">5k+</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Happy Guests
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
