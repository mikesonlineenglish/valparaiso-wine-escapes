import logo from "@/assets/logo.jpg?url";
import tripadvisor from "@/assets/tripadvisor.png?url";
import { TOURS_DATA } from "@/data/tours";
import { normalizeHref } from "@/utils/url";

const QUICK_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Experiences", href: "/#experiences" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "#contact" },
];

const Footer = () => {
  return (
    <footer className="bg-wine-charcoal text-wine-cream py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo & About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img src={logo} alt="Wine Tours Valparaiso" className="h-16" />
              <a href="https://www.tripadvisor.com/Attraction_Review-g294306-d2639554-Reviews-Wine_Tours_Valparaiso-Valparaiso_Valparaiso_Region.html" target="_blank" rel="noopener noreferrer">
                <img src={tripadvisor} alt="TripAdvisor Certificate of Excellence 2015" className="h-16" />
              </a>
            </div>
            <p className="font-body text-wine-cream/70 leading-relaxed max-w-md">
              Your premier guide to Chile's magnificent wine country. Experience
              the finest vineyards, exceptional wines, and unforgettable moments
              in the Casablanca Valley.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={normalizeHref(link.href)}
                    className="font-body text-wine-cream/70 hover:text-wine-gold transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tours */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">
              Our Tours
            </h4>
            <ul className="space-y-2">
              {TOURS_DATA.map((tour) => (
                <li key={tour.slug}>
                  <a
                    href={normalizeHref(`/tours/${tour.slug}`)}
                    className="font-body text-wine-cream/70 hover:text-wine-gold transition-colors text-sm"
                  >
                    {tour.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-wine-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-wine-cream/50">
            © {new Date().getFullYear()} Wine Tours Valparaíso. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="font-body text-sm text-wine-cream/50 hover:text-wine-gold transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="font-body text-sm text-wine-cream/50 hover:text-wine-gold transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
