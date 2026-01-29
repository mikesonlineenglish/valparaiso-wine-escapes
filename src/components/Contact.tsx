import { Mail, Phone, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Info */}
          <div>
            <p className="font-body text-wine-rose tracking-[0.2em] uppercase text-sm mb-4">
              Start Your Journey
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
              Book Your
              <span className="text-elegant text-wine-gold block">
                Wine Experience
              </span>
            </h2>
            <p className="text-primary-foreground/80 leading-relaxed mb-10 max-w-lg">
              Ready to explore the finest vineyards of Chile? Contact us to
              customize your perfect wine tour or book one of our signature
              experiences.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-wine-gold/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-wine-gold" size={20} />
                </div>
                <div>
                  <p className="font-body text-sm text-primary-foreground/60 mb-1">
                    Email Us
                  </p>
                  <a
                    href="mailto:info@winetoursvalparaiso.com"
                    className="font-body hover:text-wine-gold transition-colors"
                  >
                    info@winetoursvalparaiso.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-wine-gold/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-wine-gold" size={20} />
                </div>
                <div>
                  <p className="font-body text-sm text-primary-foreground/60 mb-1">
                    Call Us
                  </p>
                  <a
                    href="tel:+56912345678"
                    className="font-body hover:text-wine-gold transition-colors"
                  >
                    +56 9 1234 5678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-wine-gold/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-wine-gold" size={20} />
                </div>
                <div>
                  <p className="font-body text-sm text-primary-foreground/60 mb-1">
                    Located In
                  </p>
                  <p className="font-body">Valparaíso, Chile</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-wine-gold/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="text-wine-gold" size={20} />
                </div>
                <div>
                  <p className="font-body text-sm text-primary-foreground/60 mb-1">
                    Booking Hours
                  </p>
                  <p className="font-body">Mon - Sat: 9am - 7pm</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-10 pt-10 border-t border-wine-merlot">
              <p className="font-body text-sm text-primary-foreground/60 mb-4">
                Follow Our Journey
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-wine-gold/20 flex items-center justify-center hover:bg-wine-gold/30 transition-colors"
                >
                  <Instagram size={18} className="text-wine-gold" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-wine-gold/20 flex items-center justify-center hover:bg-wine-gold/30 transition-colors"
                >
                  <Facebook size={18} className="text-wine-gold" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-card text-card-foreground rounded-lg p-8 lg:p-10 shadow-elevated">
            <h3 className="font-display text-2xl font-semibold mb-6">
              Request a Tour
            </h3>
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-sm text-muted-foreground block mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground block mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-sm text-muted-foreground block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-sm text-muted-foreground block mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground block mb-2">
                    Number of Guests
                  </label>
                  <select className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>1-2 guests</option>
                    <option>3-4 guests</option>
                    <option>5-6 guests</option>
                    <option>7+ guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-body text-sm text-muted-foreground block mb-2">
                  Message (optional)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Tell us about your preferences..."
                />
              </div>

              <Button variant="wine" size="lg" className="w-full">
                Send Inquiry
              </Button>

              <p className="font-body text-xs text-muted-foreground text-center">
                We typically respond within 24 hours
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
