import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.jpg?url";
import { trackEvent } from "@/lib/analytics";
import { normalizeHref } from "@/utils/url";
import { TOURS_DATA } from "@/data/tours";

interface HeaderProps {
  /** Keeps the header in its "scrolled" (solid background, compact) look at all
   * scroll positions, for pages without a full-bleed hero behind the header. */
  alwaysScrolled?: boolean;
}

interface DropdownLink {
  href: string;
  label: string;
}

const TOURS_LINKS: DropdownLink[] = [
  { href: "/tours", label: "All Tours" },
  ...TOURS_DATA.map((tour) => ({ href: `/tours/${tour.slug}`, label: tour.title })),
];

// Santiago's page doesn't exist yet — add its entry here once it ships.
const PLAN_YOUR_TRIP_LINKS: DropdownLink[] = [
  { href: "/where-to-stay/valparaiso", label: "Where to Stay — Valparaíso" },
  { href: "/faq", label: "FAQ" },
];

/** Desktop dropdown trigger + menu. Menu items are always rendered in the DOM (visibility
 * toggled with classes, not conditional rendering) so they exist as real <a href> links in
 * the server-rendered HTML regardless of JS/hydration state. */
const NavDropdown = ({
  label,
  items,
  isScrolled,
}: {
  label: string;
  items: DropdownLink[];
  isScrolled: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1 font-body text-sm tracking-wide uppercase transition-colors duration-300 ${
          isScrolled
            ? "text-foreground hover:text-primary"
            : "text-wine-cream hover:text-accent"
        }`}
      >
        {label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        role="menu"
        aria-label={label}
        className={`absolute left-0 top-full mt-3 min-w-[240px] rounded-md border border-border bg-background py-2 shadow-elevated transition-all duration-150 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none"
        }`}
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={normalizeHref(item.href)}
            role="menuitem"
            onClick={() => {
              setOpen(false);
              trackEvent("nav_click", { button: item.label.toLowerCase().replace(/ /g, "_") });
            }}
            className="block px-4 py-2 font-body text-sm text-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
};

/** Mobile accordion section — same "always rendered, class-toggled" rule as NavDropdown. */
const MobileAccordion = ({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: DropdownLink[];
  onNavigate: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-3 font-body text-sm tracking-wide uppercase text-foreground"
      >
        {label}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-96 pb-3" : "max-h-0"}`}>
        <div className="flex flex-col gap-1 pl-4">
          {items.map((item) => (
            <a
              key={item.href}
              href={normalizeHref(item.href)}
              onClick={() => {
                onNavigate();
                trackEvent("nav_click", { button: `${item.label.toLowerCase().replace(/ /g, "_")}_mobile` });
              }}
              className="py-2 font-body text-sm text-muted-foreground hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const Header = ({ alwaysScrolled = false }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(alwaysScrolled);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (alwaysScrolled) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysScrolled]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-2xl shadow-soft py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Wine Tours Valparaiso"
            className={`transition-all duration-300 ${
              isScrolled ? "h-12" : "h-16"
            }`}
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavDropdown label="Tours" items={TOURS_LINKS} isScrolled={isScrolled} />

          <a
            href={normalizeHref("/wineries")}
            onClick={() => trackEvent("nav_click", { button: "wineries" })}
            className={`font-body text-sm tracking-wide uppercase transition-colors duration-300 ${
              isScrolled
                ? "text-foreground hover:text-primary"
                : "text-wine-cream hover:text-accent"
            }`}
          >
            Wineries
          </a>

          <NavDropdown label="Plan Your Trip" items={PLAN_YOUR_TRIP_LINKS} isScrolled={isScrolled} />

          <a
            href={normalizeHref("/#about")}
            onClick={() => trackEvent("nav_click", { button: "about" })}
            className={`font-body text-sm tracking-wide uppercase transition-colors duration-300 ${
              isScrolled
                ? "text-foreground hover:text-primary"
                : "text-wine-cream hover:text-accent"
            }`}
          >
            About
          </a>

          <a
            href={normalizeHref("/#price-calculator")}
            onClick={() => trackEvent("cta_click", { button: "get_a_quote_header" })}
            className={`font-body text-sm tracking-wide uppercase px-5 py-2 rounded transition-all duration-300 ${
              isScrolled
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-wine-cream text-wine-burgundy hover:bg-wine-cream/90"
            }`}
          >
            Get a Quote
          </a>

          {/* Reserved for a future EN/RU language switcher. */}
          <div aria-hidden="true" className="w-0" />
        </nav>

        {/* Mobile: hamburger + Get a Quote stay visible outside the collapsible menu */}
        <div className="flex items-center gap-3 md:hidden">
          <a
            href={normalizeHref("/#price-calculator")}
            onClick={() => trackEvent("cta_click", { button: "get_a_quote_header_mobile" })}
            className={`font-body text-xs tracking-wide uppercase px-4 py-2 rounded transition-all duration-300 ${
              isScrolled
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-wine-cream text-wine-burgundy hover:bg-wine-cream/90"
            }`}
          >
            Get a Quote
          </a>
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`p-2 transition-colors ${isScrolled ? "text-foreground" : "text-wine-cream"}`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — always rendered, visibility toggled via class so links stay in
          the server-rendered HTML regardless of JS/hydration state. */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-lg shadow-elevated ${
          isMobileMenuOpen ? "block" : "hidden"
        } ${isScrolled ? "bg-background/95 backdrop-blur-2xl shadow-soft" : ""}`}
      >
        <nav className="container mx-auto px-6 py-4 flex flex-col">
          <MobileAccordion label="Tours" items={TOURS_LINKS} onNavigate={closeMobileMenu} />

          <a
            href={normalizeHref("/wineries")}
            onClick={() => {
              closeMobileMenu();
              trackEvent("nav_click", { button: "wineries_mobile" });
            }}
            className="py-3 border-b border-border font-body text-sm tracking-wide uppercase text-foreground hover:text-primary"
          >
            Wineries
          </a>

          <MobileAccordion label="Plan Your Trip" items={PLAN_YOUR_TRIP_LINKS} onNavigate={closeMobileMenu} />

          <a
            href={normalizeHref("/#about")}
            onClick={() => {
              closeMobileMenu();
              trackEvent("nav_click", { button: "about_mobile" });
            }}
            className="py-3 border-b border-border font-body text-sm tracking-wide uppercase text-foreground hover:text-primary"
          >
            About
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
