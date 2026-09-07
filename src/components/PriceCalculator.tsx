import { useState } from "react";
import { Calculator, Users, MapPin, ChevronDown, Wine, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOCATION_OPTIONS = [
  "Santiago Hotel",
  "Santiago Airport",
  "Valparaíso Port",
  "Valparaíso Hotel",
  "Viña del Mar Hotel",
];

const TOURS = [
  { id: "classic", name: "Classic Wine Tour", subtitle: "Half Day · 2 Wineries", description: "Bodegas RE + Casas del Bosque" },
  { id: "wine-dine", name: "Wine & Dine Tour", subtitle: "Full Day · 2 Wineries + Lunch", description: "Bodegas RE + Casas del Bosque + Restaurant" },
  { id: "casablanca", name: "Valparaíso + Casablanca Wine Tour", subtitle: "Full Day · Casablanca Valley", description: "Casablanca Valley + Valparaíso City Walk" },
  { id: "city", name: "Valparaíso & Viña del Mar", subtitle: "Half Day · City Tour", description: "Viña del Mar + Valparaíso Highlights" },
];

// Location keys matching spreadsheet column abbreviations
type Loc = "SH" | "SA" | "VP" | "VH" | "VdM";
const LOC_KEY: Record<string, Loc> = {
  "Santiago Hotel": "SH",
  "Santiago Airport": "SA",
  "Valparaíso Port": "VP",
  "Valparaíso Hotel": "VH",
  "Viña del Mar Hotel": "VdM",
};

// Guest tier mapping
type Tier = "1" | "2" | "3" | "4" | "5" | "6-10" | "11-15";
const getTier = (guests: number): Tier => {
  if (guests <= 5) return String(guests) as Tier;
  if (guests <= 10) return "6-10";
  return "11-15";
};

// Price table: prices in thousands of CLP (per person)
// Structure: PRICES[tourId][tier][`${pickup}-${dropoff}`]
const PRICES: Record<string, Record<Tier, Record<string, number>>> = {
  classic: {
    "1":    { "SH-SH":275,"SH-SA":275,"SH-VP":225,"SH-VH":235,"SH-VdM":235,"SA-SH":275,"SA-SA":275,"SA-VP":225,"SA-VH":225,"SA-VdM":225,"VP-SH":225,"VP-SA":225,"VP-VP":170,"VP-VH":170,"VP-VdM":170,"VH-SH":225,"VH-SA":225,"VH-VP":225,"VH-VH":225,"VH-VdM":225,"VdM-SH":225,"VdM-SA":225,"VdM-VP":170,"VdM-VH":170,"VdM-VdM":170 },
    "2":    { "SH-SH":195,"SH-SA":195,"SH-VP":145,"SH-VH":155,"SH-VdM":155,"SA-SH":195,"SA-SA":195,"SA-VP":145,"SA-VH":145,"SA-VdM":145,"VP-SH":145,"VP-SA":145,"VP-VP":135,"VP-VH":135,"VP-VdM":135,"VH-SH":145,"VH-SA":145,"VH-VP":145,"VH-VH":145,"VH-VdM":145,"VdM-SH":145,"VdM-SA":145,"VdM-VP":135,"VdM-VH":135,"VdM-VdM":135 },
    "3":    { "SH-SH":165,"SH-SA":165,"SH-VP":115,"SH-VH":125,"SH-VdM":125,"SA-SH":165,"SA-SA":165,"SA-VP":115,"SA-VH":115,"SA-VdM":115,"VP-SH":115,"VP-SA":115,"VP-VP":125,"VP-VH":125,"VP-VdM":125,"VH-SH":115,"VH-SA":115,"VH-VP":115,"VH-VH":115,"VH-VdM":115,"VdM-SH":115,"VdM-SA":115,"VdM-VP":125,"VdM-VH":125,"VdM-VdM":125 },
    "4":    { "SH-SH":180,"SH-SA":180,"SH-VP":130,"SH-VH":140,"SH-VdM":140,"SA-SH":180,"SA-SA":180,"SA-VP":130,"SA-VH":130,"SA-VdM":130,"VP-SH":130,"VP-SA":130,"VP-VP":115,"VP-VH":115,"VP-VdM":115,"VH-SH":130,"VH-SA":130,"VH-VP":130,"VH-VH":130,"VH-VdM":130,"VdM-SH":130,"VdM-SA":130,"VdM-VP":115,"VdM-VH":115,"VdM-VdM":115 },
    "5":    { "SH-SH":155,"SH-SA":155,"SH-VP":105,"SH-VH":115,"SH-VdM":115,"SA-SH":155,"SA-SA":155,"SA-VP":105,"SA-VH":105,"SA-VdM":105,"VP-SH":105,"VP-SA":105,"VP-VP":105,"VP-VH":105,"VP-VdM":105,"VH-SH":105,"VH-SA":105,"VH-VP":105,"VH-VH":105,"VH-VdM":105,"VdM-SH":105,"VdM-SA":105,"VdM-VP":105,"VdM-VH":105,"VdM-VdM":105 },
    "6-10": { "SH-SH":135,"SH-SA":135,"SH-VP":85,"SH-VH":95,"SH-VdM":95,"SA-SH":135,"SA-SA":135,"SA-VP":85,"SA-VH":85,"SA-VdM":85,"VP-SH":85,"VP-SA":85,"VP-VP":90,"VP-VH":90,"VP-VdM":90,"VH-SH":85,"VH-SA":85,"VH-VP":85,"VH-VH":85,"VH-VdM":85,"VdM-SH":85,"VdM-SA":85,"VdM-VP":90,"VdM-VH":90,"VdM-VdM":90 },
    "11-15":{ "SH-SH":125,"SH-SA":125,"SH-VP":75,"SH-VH":85,"SH-VdM":85,"SA-SH":125,"SA-SA":125,"SA-VP":75,"SA-VH":75,"SA-VdM":75,"VP-SH":75,"VP-SA":75,"VP-VP":80,"VP-VH":80,"VP-VdM":80,"VH-SH":75,"VH-SA":75,"VH-VP":75,"VH-VH":75,"VH-VdM":75,"VdM-SH":75,"VdM-SA":75,"VdM-VP":80,"VdM-VH":80,"VdM-VdM":80 },
  },
  "wine-dine": {
    "1":    { "SH-SH":355,"SH-SA":355,"SH-VP":285,"SH-VH":285,"SH-VdM":285,"SA-SH":355,"SA-SA":355,"SA-VP":285,"SA-VH":285,"SA-VdM":285,"VP-SH":285,"VP-SA":285,"VP-VP":230,"VP-VH":230,"VP-VdM":230,"VH-SH":285,"VH-SA":285,"VH-VP":285,"VH-VH":285,"VH-VdM":285,"VdM-SH":285,"VdM-SA":285,"VdM-VP":230,"VdM-VH":230,"VdM-VdM":230 },
    "2":    { "SH-SH":255,"SH-SA":255,"SH-VP":205,"SH-VH":205,"SH-VdM":205,"SA-SH":255,"SA-SA":255,"SA-VP":205,"SA-VH":205,"SA-VdM":205,"VP-SH":205,"VP-SA":205,"VP-VP":195,"VP-VH":195,"VP-VdM":195,"VH-SH":205,"VH-SA":205,"VH-VP":205,"VH-VH":205,"VH-VdM":205,"VdM-SH":205,"VdM-SA":205,"VdM-VP":195,"VdM-VH":195,"VdM-VdM":195 },
    "3":    { "SH-SH":240,"SH-SA":240,"SH-VP":175,"SH-VH":175,"SH-VdM":175,"SA-SH":240,"SA-SA":240,"SA-VP":175,"SA-VH":175,"SA-VdM":175,"VP-SH":175,"VP-SA":175,"VP-VP":185,"VP-VH":185,"VP-VdM":185,"VH-SH":175,"VH-SA":175,"VH-VP":175,"VH-VH":175,"VH-VdM":175,"VdM-SH":175,"VdM-SA":175,"VdM-VP":185,"VdM-VH":185,"VdM-VdM":185 },
    "4":    { "SH-SH":225,"SH-SA":225,"SH-VP":190,"SH-VH":190,"SH-VdM":190,"SA-SH":225,"SA-SA":225,"SA-VP":190,"SA-VH":190,"SA-VdM":190,"VP-SH":190,"VP-SA":190,"VP-VP":175,"VP-VH":175,"VP-VdM":175,"VH-SH":190,"VH-SA":190,"VH-VP":190,"VH-VH":190,"VH-VdM":190,"VdM-SH":190,"VdM-SA":190,"VdM-VP":175,"VdM-VH":175,"VdM-VdM":175 },
    "5":    { "SH-SH":215,"SH-SA":215,"SH-VP":205,"SH-VH":205,"SH-VdM":205,"SA-SH":215,"SA-SA":215,"SA-VP":205,"SA-VH":205,"SA-VdM":205,"VP-SH":205,"VP-SA":205,"VP-VP":165,"VP-VH":165,"VP-VdM":165,"VH-SH":205,"VH-SA":205,"VH-VP":205,"VH-VH":205,"VH-VdM":205,"VdM-SH":205,"VdM-SA":205,"VdM-VP":165,"VdM-VH":165,"VdM-VdM":165 },
    "6-10": { "SH-SH":205,"SH-SA":205,"SH-VP":145,"SH-VH":145,"SH-VdM":145,"SA-SH":205,"SA-SA":205,"SA-VP":145,"SA-VH":145,"SA-VdM":145,"VP-SH":145,"VP-SA":145,"VP-VP":150,"VP-VH":150,"VP-VdM":150,"VH-SH":145,"VH-SA":145,"VH-VP":145,"VH-VH":145,"VH-VdM":145,"VdM-SH":145,"VdM-SA":145,"VdM-VP":150,"VdM-VH":150,"VdM-VdM":150 },
    "11-15":{ "SH-SH":195,"SH-SA":195,"SH-VP":135,"SH-VH":135,"SH-VdM":135,"SA-SH":195,"SA-SA":195,"SA-VP":135,"SA-VH":135,"SA-VdM":135,"VP-SH":135,"VP-SA":135,"VP-VP":140,"VP-VH":140,"VP-VdM":140,"VH-SH":135,"VH-SA":135,"VH-VP":135,"VH-VH":135,"VH-VdM":135,"VdM-SH":135,"VdM-SA":135,"VdM-VP":140,"VdM-VH":140,"VdM-VdM":140 },
  },
  casablanca: {
    "1":    { "SH-SH":245,"SH-SA":245,"SH-VP":245,"SH-VH":245,"SH-VdM":245,"SA-SH":245,"SA-SA":245,"SA-VP":245,"SA-VH":245,"SA-VdM":245,"VP-SH":245,"VP-SA":245,"VP-VP":245,"VP-VH":245,"VP-VdM":245,"VH-SH":245,"VH-SA":245,"VH-VP":245,"VH-VH":245,"VH-VdM":245,"VdM-SH":245,"VdM-SA":245,"VdM-VP":245,"VdM-VH":245,"VdM-VdM":245 },
    "2":    { "SH-SH":165,"SH-SA":165,"SH-VP":165,"SH-VH":165,"SH-VdM":165,"SA-SH":165,"SA-SA":165,"SA-VP":165,"SA-VH":165,"SA-VdM":165,"VP-SH":165,"VP-SA":165,"VP-VP":165,"VP-VH":165,"VP-VdM":165,"VH-SH":165,"VH-SA":165,"VH-VP":165,"VH-VH":165,"VH-VdM":165,"VdM-SH":165,"VdM-SA":165,"VdM-VP":165,"VdM-VH":165,"VdM-VdM":165 },
    "3":    { "SH-SH":155,"SH-SA":155,"SH-VP":155,"SH-VH":155,"SH-VdM":155,"SA-SH":155,"SA-SA":155,"SA-VP":155,"SA-VH":155,"SA-VdM":155,"VP-SH":155,"VP-SA":155,"VP-VP":155,"VP-VH":155,"VP-VdM":155,"VH-SH":155,"VH-SA":155,"VH-VP":155,"VH-VH":155,"VH-VdM":155,"VdM-SH":155,"VdM-SA":155,"VdM-VP":155,"VdM-VH":155,"VdM-VdM":155 },
    "4":    { "SH-SH":145,"SH-SA":145,"SH-VP":145,"SH-VH":145,"SH-VdM":145,"SA-SH":145,"SA-SA":145,"SA-VP":145,"SA-VH":145,"SA-VdM":145,"VP-SH":145,"VP-SA":145,"VP-VP":145,"VP-VH":145,"VP-VdM":145,"VH-SH":145,"VH-SA":145,"VH-VP":145,"VH-VH":145,"VH-VdM":145,"VdM-SH":145,"VdM-SA":145,"VdM-VP":145,"VdM-VH":145,"VdM-VdM":145 },
    "5":    { "SH-SH":135,"SH-SA":135,"SH-VP":135,"SH-VH":135,"SH-VdM":135,"SA-SH":135,"SA-SA":135,"SA-VP":135,"SA-VH":135,"SA-VdM":135,"VP-SH":135,"VP-SA":135,"VP-VP":135,"VP-VH":135,"VP-VdM":135,"VH-SH":135,"VH-SA":135,"VH-VP":135,"VH-VH":135,"VH-VdM":135,"VdM-SH":135,"VdM-SA":135,"VdM-VP":135,"VdM-VH":135,"VdM-VdM":135 },
    "6-10": { "SH-SH":125,"SH-SA":125,"SH-VP":125,"SH-VH":125,"SH-VdM":125,"SA-SH":125,"SA-SA":125,"SA-VP":125,"SA-VH":125,"SA-VdM":125,"VP-SH":125,"VP-SA":125,"VP-VP":125,"VP-VH":125,"VP-VdM":125,"VH-SH":125,"VH-SA":125,"VH-VP":125,"VH-VH":125,"VH-VdM":125,"VdM-SH":125,"VdM-SA":125,"VdM-VP":125,"VdM-VH":125,"VdM-VdM":125 },
    "11-15":{ "SH-SH":115,"SH-SA":115,"SH-VP":115,"SH-VH":115,"SH-VdM":115,"SA-SH":115,"SA-SA":115,"SA-VP":115,"SA-VH":115,"SA-VdM":115,"VP-SH":115,"VP-SA":115,"VP-VP":115,"VP-VH":115,"VP-VdM":115,"VH-SH":115,"VH-SA":115,"VH-VP":115,"VH-VH":115,"VH-VdM":115,"VdM-SH":115,"VdM-SA":115,"VdM-VP":115,"VdM-VH":115,"VdM-VdM":115 },
  },
  city: {
    "1":    { "SH-SH":225,"SH-SA":225,"SH-VP":175,"SH-VH":175,"SH-VdM":175,"SA-SH":225,"SA-SA":225,"SA-VP":175,"SA-VH":175,"SA-VdM":175,"VP-SH":175,"VP-SA":175,"VP-VP":175,"VP-VH":175,"VP-VdM":175,"VH-SH":175,"VH-SA":175,"VH-VP":175,"VH-VH":175,"VH-VdM":175,"VdM-SH":175,"VdM-SA":175,"VdM-VP":175,"VdM-VH":175,"VdM-VdM":175 },
    "2":    { "SH-SH":145,"SH-SA":145,"SH-VP":95,"SH-VH":95,"SH-VdM":95,"SA-SH":145,"SA-SA":145,"SA-VP":95,"SA-VH":95,"SA-VdM":95,"VP-SH":95,"VP-SA":95,"VP-VP":95,"VP-VH":95,"VP-VdM":95,"VH-SH":95,"VH-SA":95,"VH-VP":95,"VH-VH":95,"VH-VdM":95,"VdM-SH":95,"VdM-SA":95,"VdM-VP":95,"VdM-VH":95,"VdM-VdM":95 },
    "3":    { "SH-SH":135,"SH-SA":135,"SH-VP":85,"SH-VH":85,"SH-VdM":85,"SA-SH":135,"SA-SA":135,"SA-VP":85,"SA-VH":85,"SA-VdM":85,"VP-SH":85,"VP-SA":85,"VP-VP":85,"VP-VH":85,"VP-VdM":85,"VH-SH":85,"VH-SA":85,"VH-VP":85,"VH-VH":85,"VH-VdM":85,"VdM-SH":85,"VdM-SA":85,"VdM-VP":85,"VdM-VH":85,"VdM-VdM":85 },
    "4":    { "SH-SH":125,"SH-SA":125,"SH-VP":75,"SH-VH":75,"SH-VdM":75,"SA-SH":125,"SA-SA":125,"SA-VP":75,"SA-VH":75,"SA-VdM":75,"VP-SH":75,"VP-SA":75,"VP-VP":75,"VP-VH":75,"VP-VdM":75,"VH-SH":75,"VH-SA":75,"VH-VP":75,"VH-VH":75,"VH-VdM":75,"VdM-SH":75,"VdM-SA":75,"VdM-VP":75,"VdM-VH":75,"VdM-VdM":75 },
    "5":    { "SH-SH":115,"SH-SA":115,"SH-VP":65,"SH-VH":65,"SH-VdM":65,"SA-SH":115,"SA-SA":115,"SA-VP":65,"SA-VH":65,"SA-VdM":65,"VP-SH":65,"VP-SA":65,"VP-VP":65,"VP-VH":65,"VP-VdM":65,"VH-SH":65,"VH-SA":65,"VH-VP":65,"VH-VH":65,"VH-VdM":65,"VdM-SH":65,"VdM-SA":65,"VdM-VP":65,"VdM-VH":65,"VdM-VdM":65 },
    "6-10": { "SH-SH":105,"SH-SA":105,"SH-VP":55,"SH-VH":55,"SH-VdM":55,"SA-SH":105,"SA-SA":105,"SA-VP":55,"SA-VH":55,"SA-VdM":55,"VP-SH":55,"VP-SA":55,"VP-VP":55,"VP-VH":55,"VP-VdM":55,"VH-SH":55,"VH-SA":55,"VH-VP":55,"VH-VH":55,"VH-VdM":55,"VdM-SH":55,"VdM-SA":55,"VdM-VP":55,"VdM-VH":55,"VdM-VdM":55 },
    "11-15":{ "SH-SH":95,"SH-SA":95,"SH-VP":45,"SH-VH":45,"SH-VdM":45,"SA-SH":95,"SA-SA":95,"SA-VP":45,"SA-VH":45,"SA-VdM":45,"VP-SH":45,"VP-SA":45,"VP-VP":45,"VP-VH":45,"VP-VdM":45,"VH-SH":45,"VH-SA":45,"VH-VP":45,"VH-VH":45,"VH-VdM":45,"VdM-SH":45,"VdM-SA":45,"VdM-VP":45,"VdM-VH":45,"VdM-VdM":45 },
  },
};

const formatCLP = (thousands: number) =>
  `$${(thousands * 1000).toLocaleString("es-CL")}`;

const getPrice = (tourId: string, guests: number, pickup: string, dropoff: string): number | null => {
  const tier = getTier(guests);
  const pk = LOC_KEY[pickup];
  const dk = LOC_KEY[dropoff];
  if (!pk || !dk) return null;
  return PRICES[tourId]?.[tier]?.[`${pk}-${dk}`] ?? null;
};

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

const PriceCalculator = () => {
  const [guests, setGuests] = useState<number>(2);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedTour, setSelectedTour] = useState("");
  const [calculated, setCalculated] = useState(false);

  const isFormValid = guests > 0 && pickup && dropoff && selectedTour;

  const handleCalculate = () => { if (isFormValid) setCalculated(true); };
  const handleReset = () => { setCalculated(false); setGuests(2); setPickup(""); setDropoff(""); setSelectedTour(""); };

  const pricePerPerson = calculated ? getPrice(selectedTour, guests, pickup, dropoff) : null;
  const totalPrice = pricePerPerson !== null ? pricePerPerson * guests : null;

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

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl shadow-elevated overflow-hidden">
            <div className="gradient-wine px-8 py-5 flex items-center gap-3">
              <Calculator className="text-wine-gold" size={22} />
              <span className="font-display text-xl text-wine-cream font-semibold">Price Calculator</span>
            </div>

            <div className="p-8 lg:p-10">
              <div className="grid md:grid-cols-2 gap-8">
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
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;
