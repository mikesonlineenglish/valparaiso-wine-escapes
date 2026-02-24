import { Mail, Phone, MapPin, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm, ValidationError } from '@formspree/react';

const Contact = () => {
  const [state, handleSubmit] = useForm("xwvneape"); // Replace with your form ID

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
                    href="tel:+56984283502"
                    className="font-body hover:text-wine-gold transition-colors"
                  >
                    +56 9 8428 3502
                  </a>
                  <a
                    href="https://wa.me/+56984283502"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body flex items-center gap-2 text-sm hover:text-wine-gold transition-colors mt-1"
                  >
                    <MessageCircle size={16} className="text-wine-gold" />
                    WhatsApp Us
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
            {state.succeeded ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-wine-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-wine-gold" size={24} />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-3">
                  Thank You!
                </h3>
                <p className="font-body text-muted-foreground">
                  We've received your inquiry and will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl font-semibold mb-6">
                  Request a Tour
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="firstName" className="font-body text-sm text-muted-foreground block mb-2">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="John"
                      />
                      <ValidationError
                        prefix="First Name"
                        field="firstName"
                        errors={state.errors}
                        className="text-destructive text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="font-body text-sm text-muted-foreground block mb-2">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Doe"
                      />
                      <ValidationError
                        prefix="Last Name"
                        field="lastName"
                        errors={state.errors}
                        className="text-destructive text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="font-body text-sm text-muted-foreground block mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="john@example.com"
                    />
                    <ValidationError
                      prefix="Email"
                      field="email"
                      errors={state.errors}
                      className="text-destructive text-sm mt-1 block"
                    />
                  </div>


                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="date" className="font-body text-sm text-muted-foreground block mb-2">
                        Preferred Date
                      </label>
                      <input
                        id="date"
                        type="date"
                        name="date"
                        required
                        className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <ValidationError
                        prefix="Date"
                        field="date"
                        errors={state.errors}
                        className="text-destructive text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="guests" className="font-body text-sm text-muted-foreground block mb-2">
                        Number of Guests
                      </label>
                      <select
                        id="guests"
                        name="guests"
                        required
                        className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select...</option>
                        <option value="1-2">1-2 guests</option>
                        <option value="3-4">3-4 guests</option>
                        <option value="5-6">5-6 guests</option>
                        <option value="7+">7+ guests</option>
                      </select>
                      <ValidationError
                        prefix="Guests"
                        field="guests"
                        errors={state.errors}
                        className="text-destructive text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="font-body text-sm text-muted-foreground block mb-2">
                      Message (optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="Tell us about your preferences..."
                    />
                    <ValidationError
                      prefix="Message"
                      field="message"
                      errors={state.errors}
                      className="text-destructive text-sm mt-1"
                    />
                  </div>

                  <Button
                    variant="wine"
                    size="lg"
                    className="w-full"
                    type="submit"
                    disabled={state.submitting}
                  >
                    {state.submitting ? 'Sending...' : 'Send Inquiry'}
                  </Button>

                  <p className="font-body text-xs text-muted-foreground text-center">
                    We typically respond within 24 hours
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
