import { Star, Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  location: string;
  rating: number;
}

const TestimonialCard = ({ quote, author, location, rating }: TestimonialProps) => {
  return (
    <div className="bg-card p-8 rounded-lg shadow-soft relative">
      <Quote
        className="absolute top-6 right-6 text-primary/10"
        size={48}
        strokeWidth={1}
      />
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="text-accent fill-accent" size={16} />
        ))}
      </div>
      <p className="font-body text-muted-foreground leading-relaxed mb-6 italic">
        "{quote}"
      </p>
      <div>
        <p className="font-display text-lg font-semibold text-foreground">
          {author}
        </p>
        <p className="font-body text-sm text-muted-foreground">{location}</p>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "We were very fortunate to have found Wine Tours Valparaiso. The four of us had 2 fantastic days touring. Michael was very accommodating and recommended 3 wonderful vineyards the first day, along with a delicious lunch that had an over the top dessert platter!",
      author: "Vicki B.",
      location: "TripAdvisor Review",
      rating: 5,
    },
    {
      quote:
        "Uplifted by Michael, he drove about an hour out of town to our first venue, which was different in that it was about organic vine growing. The wine tour guide was truly excellent, and the tasting that followed quite superb.",
      author: "Marshall M.",
      location: "TripAdvisor Review",
      rating: 5,
    },
    {
      quote:
        "Had a superb city tour through Valparaiso with Michael along with a wine tour in Casablanca. His knowledge of the wine region and wines is first rate.",
      author: "Debbie M.",
      location: "TripAdvisor Review",
      rating: 5,
    },
    {
      quote:
        "Michael's selection of wineries and restaurants was diverse and fantastic. We've had tasting/touring experiences with many wine regions in the world and these tastings and the tours of the region were very memorable... We would highly recommend Michael and Wine Tours Valparaiso.",
      author: "Anne S.",
      location: "TripAdvisor Review",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-body text-primary tracking-[0.2em] uppercase text-sm mb-4">
            Guest Reviews
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground font-semibold leading-tight mb-6">
            What Our Guests
            <span className="text-elegant text-primary block">Are Saying</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="text-accent fill-accent"
                  size={20}
                />
              ))}
            </div>
            <span className="font-body text-muted-foreground">
              4.6/5 on TripAdvisor
            </span>
          </div>
          <div className="w-px h-6 bg-border hidden md:block" />
          <p className="font-body text-muted-foreground">
            <span className="font-semibold text-foreground">74</span> reviews
          </p>
          <div className="w-px h-6 bg-border hidden md:block" />
          <p className="font-body text-muted-foreground">
            #5 of 37 Food & Drink in Valparaíso
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
