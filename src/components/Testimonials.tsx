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
        "An absolutely magical experience! Our guide was incredibly knowledgeable, and the wines were exceptional. The perfect way to explore Chilean wine country.",
      author: "Sarah Mitchell",
      location: "San Francisco, USA",
      rating: 5,
    },
    {
      quote:
        "We've done wine tours around the world, and this was one of the best. The personal touch and access to boutique wineries made it truly special.",
      author: "James & Emma Thompson",
      location: "London, UK",
      rating: 5,
    },
    {
      quote:
        "From the stunning vineyard views to the incredible tastings, every moment was perfect. Highly recommend the sunset tour!",
      author: "Maria González",
      location: "Buenos Aires, Argentina",
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              4.9/5 on TripAdvisor
            </span>
          </div>
          <div className="w-px h-6 bg-border hidden md:block" />
          <p className="font-body text-muted-foreground">
            <span className="font-semibold text-foreground">500+</span> 5-star
            reviews
          </p>
          <div className="w-px h-6 bg-border hidden md:block" />
          <p className="font-body text-muted-foreground">
            Certificate of Excellence 2024
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
