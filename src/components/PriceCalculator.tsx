import { useState } from "react";
import { Calculator, Users, MapPin, ChevronDown, Wine, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOCATION_OPTIONS, TOURS, getPrice, formatCLP } from "@/lib/pricing";

interface SelectFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
}

const SelectField = ({ label, icon, value, onChange, options, placeholder }: SelectFieldProps) => (
  <div className="space-y-2">
    <label className="font-body text-sm text-muted-foreground uppercase tracking-widest flex items-center gap-2">
      {icon}{label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-3.5 bg-background border border-input rounded-md font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10 cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
    </div>
  </div>
);

interface PriceCalculatorProps {
  /** Pre-select a tour (matches a TOURS id in @/lib/pricing) — used on per-tour pages. */
  initialTourId?: string;
  /** Compact mode for embedding in a narrower column (e.g. beside tour copy) — same fields/logic, no outer section chrome. */
  embedded?: boolean;
}

const PriceCalculator = ({ initialTourId = "", embedded = false }: PriceCalculatorProps) => {
  const [guests, setGuests] = useState<number>(2);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedTour, setSelectedTour] = useState(initialTourId);
  const [calculated, setCalculated] = useState(false);

  const isFormValid = guests > 0 && pickup && dropoff && selectedTour;

  const handleCalculate = () => { if (isFormValid) setCalculated(true); };
  const handleReset = () => { setCalculated(false); setGuests(2); setPickup(""); setDropoff(""); setSelectedTour(initialTourId); };

  const pricePerPerson = calculated ? getPrice(selectedTour, guests, pickup, dropoff) : null;
  const totalPrice = pricePerPerson !== null ? pricePerPerson * guests : null;

  const card = (
    <div className="bg-card rounded-xl shadow-elevated overflow-hidden">
      <div className="gradient-wine px-8 py-5 flex items-center gap-3">
        <Calculator className="text-wine-gold" size={22} />
        <span className="font-display text-xl text-wine-cream font-semibold">Price Calculator</span>
      </div>

      <div className="p-8 lg:p-10">
        <div className={embedded ? "space-y-8" : "grid md:grid-cols-2 gap-8"}>
          {/* Left column */}
          <div className="space-y-7">
                  {/* Guests */}
                  <div className="space-y-2">
                    <label className="font-body text-sm text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Users size={14} />Number of Guests
                    </label>
                    <div className="flex items-center gap-0 border border-input rounded-md overflow-hidden bg-background">
                      <button type="button" onClick={() => { setGuests((g) => Math.max(1, g - 1)); setCalculated(false); }}
                        className="px-5 py-3.5 text-xl font-light text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors select-none">−</button>
                      <span className="flex-1 text-center font-display text-2xl font-semibold text-foreground py-3">{guests}</span>
                      <button type="button" onClick={() => { setGuests((g) => Math.min(15, g + 1)); setCalculated(false); }}
                        className="px-5 py-3.5 text-xl font-light text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors select-none">+</button>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">
                      {guests === 1 ? "Solo traveler" : guests <= 4 ? "Small group — intimate experience" : guests <= 5 ? "Medium group — great value" : guests <= 10 ? "Large group — minibus pricing" : "Group — best per-person rate"}
                    </p>
                  </div>

                  <SelectField label="Pickup Location" icon={<MapPin size={14} />} value={pickup}
                    onChange={(v) => { setPickup(v); setCalculated(false); }} options={LOCATION_OPTIONS} placeholder="Select pickup point..." />

                  <SelectField label="Drop-off Location" icon={<MapPin size={14} />} value={dropoff}
                    onChange={(v) => { setDropoff(v); setCalculated(false); }} options={LOCATION_OPTIONS} placeholder="Select drop-off point..." />
                </div>

                {/* Right column — Tour selection */}
                <div className="space-y-3">
                  <label className="font-body text-sm text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Wine size={14} />Select Your Tour
                  </label>
                  {TOURS.map((tour) => {
                    const isSelected = selectedTour === tour.id;
                    return (
                      <button key={tour.id} type="button"
                        onClick={() => { setSelectedTour(tour.id); setCalculated(false); }}
                        className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-200 group ${isSelected ? "border-primary bg-primary/5 shadow-wine" : "border-border bg-background hover:border-primary/40 hover:bg-secondary/60"}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`font-display text-base font-semibold leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>{tour.name}</p>
                            <p className="font-body text-xs text-muted-foreground mt-1">{tour.subtitle}</p>
                            <p className="font-body text-xs text-muted-foreground/70 mt-0.5">{tour.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isSelected ? "border-primary bg-primary" : "border-border group-hover:border-primary/40"}`}>
                            {isSelected && <Check size={11} className="text-primary-foreground" strokeWidth={3} />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom action area */}
              <div className="mt-10 pt-8 border-t border-border">
                {!calculated ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <p className="font-body text-sm text-muted-foreground text-center sm:text-left">
                      {isFormValid ? "All set — click to see your estimate" : "Fill in all fields to get your estimate"}
                    </p>
                    <Button variant="wine" size="lg" onClick={handleCalculate} disabled={!isFormValid} className="min-w-[200px]">
                      <Calculator size={18} className="mr-2" />Calculate Price
                    </Button>
                  </div>
                ) : (
                  <div className="animate-fade-in space-y-4">
                    {/* Result card */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-4">
                        {TOURS.find((t) => t.id === selectedTour)?.name} · {pickup} → {dropoff}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* Per person */}
                        <div className="text-center sm:text-left sm:border-r border-border pr-0 sm:pr-6">
                          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-1">Per Person</p>
                          <p className="font-display text-3xl font-semibold text-primary">
                            {pricePerPerson !== null ? formatCLP(pricePerPerson) : "—"}
                          </p>
                          <p className="font-body text-xs text-muted-foreground mt-1">CLP per person</p>
                        </div>
                        {/* Total */}
                        <div className="text-center sm:text-left">
                          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-1">Total for {guests} {guests === 1 ? "guest" : "guests"}</p>
                          <p className="font-display text-3xl font-semibold text-primary">
                            {totalPrice !== null ? formatCLP(totalPrice) : "—"}
                          </p>
                          <p className="font-body text-xs text-muted-foreground mt-1">CLP total</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="font-body text-xs text-muted-foreground text-center sm:text-left">
                        💡 Prices shown are per person estimates in Chilean Pesos (CLP) and are subject to change. Final pricing may vary based on seasonal rates, availability, specific pickup/drop-off locations, and any additional services requested. Contact us to confirm your exact quote.
                      </p>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={handleReset}
                          className="font-body text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                          Start over
                        </button>
                        <Button variant="wine" size="sm" asChild>
                          <a href="#contact">Book This Tour</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
      </div>
    </div>
  );

  if (embedded) {
    return <div id="price-calculator">{card}</div>;
  }

  return (
    <section id="price-calculator" className="py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="font-body text-primary tracking-[0.2em] uppercase text-sm mb-4">Instant Estimate</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground font-semibold leading-tight mb-6">
            Calculate Your
            <span className="text-elegant text-primary block">Tour Price</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Get a quick price estimate for your perfect wine experience. Fill in the details below and we'll show you an instant quote.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">{card}</div>
      </div>
    </section>
  );
};

export default PriceCalculator;
